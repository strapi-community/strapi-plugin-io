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
	 * @param {object} data The data
	 */
	async emit(model, data) {
		const event = buildEventName(model);
		const rooms = await getStrapiRooms();
		const modelMeta = getModelMeta(model);

		for (const room of rooms) {
			if (room.permissions.find((p) => p.action === modelMeta.permission)) {
				if (data.data?.id) {
					this._socket.to(room.name).emit(event, data);
				}
				else {
					// Retrieve the model's controller
					const modelController = strapi.controllers[`${modelMeta.type}::${modelMeta.apiName}.${modelMeta.apiName}`];
					if (data.results?.length >= 0) {
						// results is coming from strapi.db.query
						const sanitizedEntities = modelController.sanitizeOutput(data.results);
						// Transform the sanitized entities
						const transformedResponse = await modelController.transformResponse(sanitizedEntities);
						this._socket.to(room.name).emit(event, transformedResponse);
					}
					else {
						// Sanitize the entity
						const sanitizedEntity = await modelController.sanitizeOutput(data);
						// Transform the sanitized entity
						const transformedResponse = await modelController.transformResponse(sanitizedEntity);
						this._socket.to(room.name).emit(event, transformedResponse);
					}
				}
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
	 * Returns the server socket
	 */
	get socket() {
		return this._socket;
	}
}

module.exports = {
	IO,
};
