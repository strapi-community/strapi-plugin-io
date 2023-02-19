'use strict';

const { Server } = require('socket.io');
const { handshake } = require('../middlewares/handshake');
const { buildEventName } = require('../utils/buildEventName');
const { getModelMeta } = require('../utils/getModelMeta');
const { getStrapiRooms } = require('../utils/getStrapiRooms');

class IO {
	constructor(options) {
		this._socket = new Server(strapi.server.httpServer, options);
		this._socket.use(handshake);
	}

	/**
	 * Emits an event to all roles that have permission to access the specified model.
	 *
	 * @param {string} model The model uid
	 * @param {object} entity The entity record data
	 */
	async emit(model, entity) {
		const event = buildEventName(model);
		const rooms = await getStrapiRooms();
		const modelMeta = getModelMeta(model);

		for (const room of rooms) {
			if (room.permissions.find((p) => p.action === modelMeta.permission)) {
        const modelController = strapi.controllers[`${modelMeta.type}::${modelMeta.apiName}.${modelMeta.apiName}`];
        const sanitizedEntity = await modelController.sanitizeOutput(entity);
				this._socket.to(room.name).emit(event, await modelController.transformResponse(sanitizedEntity).data);
			}
		}
	}

	/**
	 * Emits an event with no additional validation
	 *
	 * @param {string} event The event to emit
	 * @param {any} data The data to emit
	 * @param {object} options Additional emit options
	 * @param {string} options.room The room to emit to
	 */
	async raw(event, data, options = {}) {
		const { room } = options;
		let emitter = this._socket;
		if (room && room.length) {
			emitter = emitter.to(room);
		}
		emitter.emit(event, data);
	}

	/**
	 *  Returns the server socket
	 */
	get socket() {
		return this._socket;
	}
}

module.exports = {
	IO,
};
