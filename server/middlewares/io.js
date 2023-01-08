'use strict';

const { getService } = require('../utils/getService');
const { isValidContentTypeRoute } = require('../utils/isValidContentTypeRoute');

const io = async (strapi, ctx, next) => {
	const settingsService = getService({ name: 'settingsService' });
	const { contentTypes } = await settingsService.get();
	await next();

	const { body, state } = ctx;

	// ensure body exists, occurs on non existent route
	if (!body) {
		return;
	}

	const { route } = state;
	if (!route || !route.handler) {
		return;
	}

	let model;
	if (ctx.params && ctx.params.model) {
		// partial model is in params for admin calls
		model = `${ctx.params.model}.${route.handler.split('.').pop()}`;

		// account for components with relations
		if (!/api::|plugin::/.test(model)) {
			model = `api::${model}`;
		}
	} else if (route.info.apiName) {
		// full model is in handler for default content api calls
		model = route.handler;

		// account for custom routes which do not have the prefix and apiName in handler
		if (!/api::/.test(model)) {
			model = `api::${route.info.apiName}.${model}`;
		}
	}

	if (!model) {
		return;
	}

	// ensure we are only emitting events for allowed content types as specified in the settings.
	if (!isValidContentTypeRoute({ contentTypes, route, model })) {
		return;
	}

	strapi.$io.emit(model, ctx.body);
};

module.exports = ({ strapi }) => {
	strapi.server.use((ctx, next) => io(strapi, ctx, next));
};
