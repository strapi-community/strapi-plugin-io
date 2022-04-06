'use strict';

const { IO } = require('./structures/IO');
const IOMiddleware = require('./middlewares/io');

module.exports = async ({ strapi }) => {
	const { getService } = require('./utils/getService');
	const settingsService = getService({ name: 'settingsService' });
	const settings = await settingsService.get();

	// build settings structure
	const normalizedSettings = settingsService.build(settings);

	// reset plugin settings
	await settingsService.set(normalizedSettings);

	// setup io
	// initialize
	strapi.$io = new IO(normalizedSettings.IOServerOptions);

	// add io middleware
	IOMiddleware({ strapi });

	// add any io server events
	if (normalizedSettings.events && normalizedSettings.events.length) {
		strapi.$io.socket.on('connection', (socket) => {
			for (const event of normalizedSettings.events) {
				// "connection" trigger should be executed immediately
				if (event.name === 'connection') {
					event.handler({ strapi, io: strapi.$io, socket });
					continue;
				}

				// register all other events to be triggered at a later time
				socket.on(event.name, (...data) =>
					event.handler({ strapi, io: strapi.$io, socket }, ...data)
				);
			}
		});
	}
};
