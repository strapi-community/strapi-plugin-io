'use strict';

const { Server } = require('socket.io');
const { handshake } = require('../middlewares/handshake');
const { getModelMeta } = require('../utils/getModelMeta');

class IO {
	constructor(options) {
		this._socket = new Server(strapi.server.httpServer, options);
		this._socket.use(handshake);
	}

	// eslint-disable-next-line class-methods-use-this
	_buildEventName(model) {
		const { apiName, action } = getModelMeta(model);
		return `${apiName}:${action}`;
	}

	// eslint-disable-next-line class-methods-use-this
	_getRooms() {
		return strapi.entityService.findMany('plugin::users-permissions.role', {
			fields: ['name'],
			populate: {
				permissions: {
					fields: ['action'],
				},
			},
		});
	}

	async emit(model, entity) {
		const event = this._buildEventName(model);
		const rooms = await this._getRooms();

		for (const room of rooms) {
			if (room.permissions.find((per) => per.action === model)) {
				this._socket.to(room.name).emit(event, entity);
			}
		}
	}
}

module.exports = {
	IO,
};
