'use strict';

const { getService } = require('../utils/getService');
const { getAdvancedSettings } = require('../utils/getAdvancedSettings');

/**
 * Auto assign sockets to appropriate rooms based on their strapi role.
 * Defaults to public if no token provided.
 */
async function handshake(socket, next) {
	const jwtService = getService({ name: 'jwt', plugin: 'users-permissions' });
	const userService = getService({ name: 'user', plugin: 'users-permissions' });
	const settingsService = getService({ name: 'settingsService' });
	const { token } = socket.handshake.auth;
	const { publicRoleName } = await settingsService.get();

	if (token) {
		try {
			const user = await jwtService.verify(token);
			const authUser = await userService.fetchAuthenticatedUser(user.id);

			const advancedSettings = await getAdvancedSettings();

			if (advancedSettings.email_confirmation && !authUser.confirmed) {
				throw Error('Invalid credentials');
			}

			if (authUser.blocked) {
				throw Error('Invalid credentials');
			}

			socket.join(authUser.role.name);
		} catch (error) {
			next(error);
		}
	} else {
		socket.join(publicRoleName);
	}
	next();
}

module.exports = {
	handshake,
};
