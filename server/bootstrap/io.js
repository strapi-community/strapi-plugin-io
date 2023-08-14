'use strict';

const { SocketIO } = require('../structures');
const { pluginId } = require('../utils/pluginId');

/**
 * Bootstrap IO instance and related "services"
 *
 * @param {*} params
 * @param {*} params.strapi
 */
async function bootstrapIO({ strapi }) {
	const settings = strapi.config.get(`plugin.${pluginId}`);

	// initialize io
	const io = new SocketIO(settings.socket.serverOptions);

	// make io avaiable anywhere strapi global object is
	strapi.$io = io;

	// add any io server events
	if (settings.events && Object.keys(settings.events).length) {
		strapi.$io.socket.on('connection', (socket) => {
			for (const [eventName, event] of Object.entries(settings.events)) {
				// "connection" event should be executed immediately
				if (eventName === 'connection') {
					event.handler({ strapi, socket, io });
				} else {
					// register all other events to be triggered at a later time
					socket.on(eventName, (...args) => event.handler({ strapi, socket, io }, ...args));
				}
			}
		});
	}
}

module.exports = { bootstrapIO };
