'use strict';

const { UnauthorizedError } = require('@strapi/utils').errors;
const { getService } = require('../utils/getService');

/**
 * /**
 * Auto assign sockets to appropriate rooms based on auth.
 * Defaults to default role if no token provided.
 *
 * @param {*} socket
 * @param {*} next
 */
async function handshake(socket, next) {
	const jwtService = getService({ name: 'jwt', plugin: 'users-permissions' });
	const userService = getService({ name: 'user', plugin: 'users-permissions' });
	const auth = socket.handshake.auth || {};

	if (auth.token) {
		// verify api token (https://github.com/strapi/strapi/blob/main/packages/core/admin/server/strategies/api-token.js)
		try {
			const tokenService = strapi.service('admin::api-token');
			const apiToken = await tokenService.getBy({
				accessKey: tokenService.hash(auth.token),
			});

			// token not found
			if (!apiToken) {
				throw new UnauthorizedError('Invalid credentials');
			}

			const currentDate = new Date();

			// ensure token has not expired if applicable
			if (apiToken.expiresAt) {
				const expirationDate = new Date(apiToken.expiresAt);
				// token has expired
				if (expirationDate < currentDate) {
					throw new UnauthorizedError('Token expired');
				}
			}

			// update lastUsedAt
			await strapi.entityService.update('admin::api-token', apiToken.id, {
				data: {
					lastUsedAt: currentDate,
				},
			});
			socket.join(apiToken.name);
		} catch (error) {
			next(error);
		}
	} else if (auth.jwt) {
		// verify jwt (https://github.com/strapi/strapi/blob/main/packages/plugins/users-permissions/server/strategies/users-permissions.js)
		try {
			const jwtUser = await jwtService.verify(auth.jwt);
			const user = await userService.fetchAuthenticatedUser(jwtUser.id);

			// No user associated to the token
			if (!user) {
				throw new UnauthorizedError('Invalid credentials');
			}

			const advanced = await strapi
				.store({ type: 'plugin', name: 'users-permissions', key: 'advanced' })
				.get();

			// User not confirmed
			if (advanced.email_confirmation && !user.confirmed) {
				throw new UnauthorizedError('Invalid credentials');
			}

			// User blocked
			if (user.blocked) {
				throw new UnauthorizedError('Invalid credentials');
			}

			socket.join(user.role.name);
		} catch (error) {
			next(error);
		}
	} else {
		// add to public role if no supported auth provided
		const advanced = await strapi
			.store({ type: 'plugin', name: 'users-permissions', key: 'advanced' })
			.get();

		socket.join(advanced.default_role);
	}
	next();
}

module.exports = {
	handshake,
};
