'use strict';

const { Server } = require('socket.io');
const { handshake } = require('../middleware');
const { getService } = require('../utils/getService');
const { pluginId } = require('../utils/pluginId');

const TOKEN_TYPES = {
	READ_ONLY: 'read-only',
	FULL_ACCESS: 'full-access',
	CUSTOM: 'custom',
};

class SocketIO {
	constructor(options) {
		this._socket = new Server(strapi.server.httpServer, options);
		const { hooks } = strapi.config.get(`plugin.${pluginId}`);
		hooks.init({ strapi, $io: this });
		this._socket.use(handshake);
	}

	// eslint-disable-next-line no-unused-vars
	async emit({ model, data }) {
		const sanitizeService = getService({ name: 'sanitize' });
		const transformService = getService({ name: 'transform' });

		// fetch all role types
		const roles = await strapi.entityService.findMany('plugin::users-permissions.role', {
			populate: { permissions: true },
		});

		// fetch token types
		const tokens = await strapi.entityService.findMany('admin::api-token', {
			populate: { permissions: true },
		});

		const contentType = strapi.contentType(model.uid);

		// emit data to roles
		for (const role of roles) {
			const roleAbility = new Set([...role.permissions.map((p) => p.action)]);
			const sanitizedEntity = await sanitizeService.output({
				schema: contentType,
				data,
				ability: roleAbility,
				scopeFn({ scopes, ability }) {
					scopes.some((s) => ability.has(s));
				},
			});
			const data = transformService.response(sanitizedEntity, contentType);
			// this._socket.to(role.name).emit(event, entity);
		}

		// emit data to tokens
		for (const token of tokens) {
			const tokenAbility = {
				type: token.type,
				scopes: new Set([...token.permissions.map((t) => t.action)]),
			};
			const sanitizedEntity = await sanitizeService.output({
				schema: contentType,
				data,
				ability: tokenAbility,
				scopeFn({ scopes, ability }) {
					// Full access and read only have total access to data
					if (ability.type === TOKEN_TYPES.FULL_ACCESS || ability.type === TOKEN_TYPES.READ_ONLY) {
						return true;
					}

					// Read only
					if (ability.type === TOKEN_TYPES.CUSTOM) {
						return scopes.some((s) => ability.scopes.has(s));
					}
				},
			});
			const data = transformService.response(sanitizedEntity, contentType);
			// this._socket.to(token.name).emit(event, entity);
		}
	}

	async raw({ event, data, rooms }) {
		let emitter = this._socket;

		// send to all specified rooms
		if (rooms && rooms.length) {
			rooms.forEach((r) => {
				emitter = emitter.to(r);
			});
		}

		emitter.emit(event, data);
	}

	get server() {
		return this._socket;
	}
}

module.exports = {
	SocketIO,
};
