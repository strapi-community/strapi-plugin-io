'use strict';

const { getService } = require('../utils/getService');

/**
 * Auto assign sockets to appropriate rooms based on tokens associated name.
 * Defaults to default role if no token provided.
 *
 * @param {require('socket.io').Socket} socket The socket attempting to connect
 * @param {Function} next Function to call the next middleware in the stack
 */
async function handshake(socket, next) {
	const authService = getService({ name: 'auth' });
	const auth = socket.handshake.auth || {};
	let strategy = auth.strategy || 'jwt';
	const token = auth.token || '';

	// remove strategy if no token provided
	if (!token.length) {
		strategy = '';
	}

	try {
		// TODO: refactor
		let room;
		if (strategy === 'jwt') {
			room = await authService.jwt(auth);
		} else if (strategy === 'apiToken') {
			room = await authService.apiToken(auth);
		} else if (strapi.plugin('users-permissions')) {
			// add to default role if no supported auth provided and users-permission is present
			const advanced = await strapi.store({ type: 'plugin', name: 'users-permissions', key: 'advanced' }).get();
			const defaultRole = await strapi
				.query('plugin::users-permissions.role')
				.findOne({ where: { type: advanced.default_role }, select: ['name'] });

			room = defaultRole.name;
		}

		if (room) {
			socket.join(room);
		}

		next();
	} catch (error) {
		next(error);
	}
}

module.exports = {
	handshake,
};
