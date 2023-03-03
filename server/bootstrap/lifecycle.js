'use strict';

const ALLOWED_ACTIONS = new Set([
	'afterCreate',
	'afterCreateMany',
	'afterUpdate',
	'afterUpdateMany',
	'afterDelete',
	'afterDeleteMany',
	'afterFindOne',
	'afterFindMany',
]);

function isAllowedAction(action) {
	return action && ALLOWED_ACTIONS.has(action);
}

function isAPIModel(model) {
	return model && model.uid && /'^api::'/i.test(model.uid);
}

/**
 * Bootstrap lifecycles
 *
 * @param {*} params
 * @param {*} params.strapi
 */
async function bootstrapLifecycles({ strapi }) {
	// setup lifecycles
	strapi.db.lifecycles.subscribe((event) => {
		if (isAllowedAction(event.action) && isAPIModel(event.model)) {
			strapi.$io.emit({ ...event });
		}
	});
}

module.exports = { bootstrapLifecycles };
