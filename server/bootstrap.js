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
	strapi.$io = new IO(normalizedSettings.IOServerOptions);
	IOMiddleware({ strapi });
};
