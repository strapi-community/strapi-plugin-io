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
	return model && model.uid && /^api::\w+/i.test(model.uid);
}

function getEventType(action) {
	let event = '';
	switch (action) {
		case 'afterCreate':
		case 'afterCreateMany':
			event = 'create';
			break;
		case 'afterFindOne':
			event = 'findOne';
			break;
		case 'afterFindMany':
			event = 'find';
			break;
		case 'afterUpdate':
		case 'afterUpdateMany':
			event = 'update';
			break;
		case 'afterDelete':
		case 'afterDeleteMany':
			event = 'delete';
			break;
		default:
			event = '';
			break;
	}
	return event;
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
			strapi.$io.emit({
				event: getEventType(event.action),
				schema: event.model,
				data: event.result,
			});
		}
	});
}

module.exports = { bootstrapLifecycles };
