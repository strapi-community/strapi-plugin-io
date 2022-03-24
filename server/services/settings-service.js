'use strict';

const { pluginId } = require('../utils/pluginId');

module.exports = ({ strapi }) => ({
	get() {
		return strapi.config.get(`plugin.${pluginId}`);
	},

	set(settings) {
		return strapi.config.set(`plugin.${pluginId}`, settings);
	},
	build(settings) {
		const { contentTypes } = settings;

		// skip processing for wildcard
		if (typeof contentTypes === 'string') {
			return settings;
		}

		for (const contentType in contentTypes) {
			if (!Object.hasOwnProperty.call(contentTypes, contentType)) {
				continue;
			}

			const contentTypeEvents = contentTypes[contentType];

			// skip processing for wildcard content type
			if (typeof contentTypeEvents === 'string') {
				continue;
			}

			settings.contentTypes[contentType] = this.normalizeContentTypeEvents(contentTypeEvents);
		}
		return settings;
	},
	normalizeContentTypeEvents(contentTypeEvents) {
		const events = {};
		for (const event of contentTypeEvents) {
			events[event] = true;
		}
		return events;
	},
});
