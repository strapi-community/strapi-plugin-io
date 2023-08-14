'use strict';

const { Server } = require('socket.io');
const { handshake } = require('../middleware');
const { getService } = require('../utils/getService');
const { pluginId } = require('../utils/pluginId');

const API_TOKEN_TYPES = {
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
	async emit({ event, schema, data: rawData }) {
		const sanitizeService = getService({ name: 'sanitize' });
		const transformService = getService({ name: 'transform' });

		// account for unsaved single content type being null
		if (!rawData) {
			return;
		}

		// fetch all role types
		const roles = await strapi.entityService.findMany('plugin::users-permissions.role', {
			populate: { permissions: true },
		});

		// fetch token types
		const tokens = await strapi.entityService.findMany('admin::api-token', {
			populate: { permissions: true },
		});

		const contentType = strapi.contentType(schema.uid);
		const action = event;
		const eventName = `${schema.singularName}:${action}`;
		const modelAbility = `${schema.uid}.${action}`;

		// emit data to roles
		for (const role of roles) {
			const roleAbility = new Set([...role.permissions.map((p) => p.action)]);
			if (roleAbility.has(modelAbility)) {
				const sanitizedEntity = await sanitizeService.output({
					schema: contentType,
					data: rawData,
					ability: roleAbility,
					scopeFn({ scopes, ability }) {
						return scopes.some((s) => ability.has(s));
					},
				});
				const data = transformService.response({ resource: sanitizedEntity, contentType });
				this._socket.to(role.name).emit(eventName, { data });
			}
		}

		// emit data to tokens
		for (const token of tokens) {
			const tokenAbility = {
				type: token.type,
				scopes: new Set([...token.permissions.map((t) => t.action)]),
			};
			if (
				token.type !== API_TOKEN_TYPES.CUSTOM ||
				(token.type === API_TOKEN_TYPES.CUSTOM && tokenAbility.scopes.has(modelAbility))
			) {
				const sanitizedEntity = await sanitizeService.output({
					schema: contentType,
					data: rawData,
					ability: tokenAbility,
					scopeFn({ scopes, ability }) {
						// Full access and read only have total access to data
						if (
							ability.type === API_TOKEN_TYPES.FULL_ACCESS ||
							ability.type === API_TOKEN_TYPES.READ_ONLY
						) {
							return true;
						}

						// custom token can have any permissions and need to be check
						if (ability.type === API_TOKEN_TYPES.CUSTOM) {
							return scopes.some((s) => ability.scopes.has(s));
						}
					},
				});
				const data = transformService.response({ resource: sanitizedEntity, contentType });
				this._socket.to(token.name).emit(eventName, { data });
			}
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

		emitter.emit(event, { data });
	}

	get server() {
		return this._socket;
	}
}

module.exports = {
	SocketIO,
};
