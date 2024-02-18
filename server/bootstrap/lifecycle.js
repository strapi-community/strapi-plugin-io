'use strict';

/**
 * Bootstrap lifecycles
 *
 * @param {*} params
 * @param {*} params.strapi
 */
async function bootstrapLifecycles({ strapi }) {
	strapi.config.get('plugin.io.contentTypes', []).forEach((ct) => {
		const uid = ct.uid ? ct.uid : ct;

		const subscriber = {
			models: [uid],
		};

		if (!ct.actions || ct.actions.includes('create')) {
			const eventType = 'create';
			subscriber.afterCreate = async (event) => {
				const base = {
					event: eventType,
					schema: event.model,
					data: event.result,
				};

				try {
					const query = buildEventQuery({ event });
					const data = await strapi.entityService.findMany(uid, query);

					if (data[0]) {
						base.data = data[0];
					}
				} catch (e) {
					console.error('afterCreate', e);
				}

				strapi.$io.emit(base);
			};
			subscriber.afterCreateMany = async (event) => {
				const query = buildEventQuery({ event });
				if (query.filters) {
					const records = await strapi.entityService.findMany(uid, query);

					records.forEach((r) => {
						strapi.$io.emit({
							event: eventType,
							schema: event.model,
							data: r,
						});
					});
				}
			};
		}

		if (!ct.actions || ct.actions.includes('update')) {
			const eventType = 'update';
			subscriber.afterUpdate = async (event) => {
				const base = {
					event: eventType,
					schema: event.model,
					data: event.result,
				};

				try {
					const query = buildEventQuery({ event });
					const data = await strapi.entityService.findMany(uid, query);

					if (data[0]) {
						base.data = data[0];
					}
				} catch (e) {
					console.error('afterUpdate', e);
				}

				strapi.$io.emit(base);
			};
			subscriber.beforeUpdateMany = async (event) => {
				const query = buildEventQuery({ event });
				if (query.filters) {
					const ids = await strapi.entityService.findMany(uid, query);
					if (!event.state.io) {
						event.state.io = {};
					}
					event.state.io.ids = ids;
				}
			};
			subscriber.afterUpdateMany = async (event) => {
				if (!event.state.io?.ids) {
					return;
				}
				const records = await strapi.entityService.findMany(uid, {
					filters: { id: event.state.io.ids },
				});

				records.forEach((r) => {
					strapi.$io.emit({
						event: eventType,
						schema: event.model,
						data: r,
					});
				});
			};
		}

		if (!ct.actions || ct.actions.includes('delete')) {
			const eventType = 'delete';
			subscriber.afterDelete = async (event) => {
				strapi.$io.emit({
					event: eventType,
					schema: event.model,
					data: event.result,
				});
			};
			subscriber.beforeDeleteMany = async (event) => {
				const query = buildEventQuery({ event });
				if (query.filters) {
					const records = await strapi.entityService.findMany(uid, query);
					if (!event.state.io) {
						event.state.io = {};
					}
					event.state.io.records = records;
				}
			};
			subscriber.afterDeleteMany = async (event) => {
				if (!event.state.io?.records) {
					return;
				}
				event.state.io.records.forEach((r) => {
					strapi.$io.emit({
						event: eventType,
						schema: event.model,
						data: r,
					});
				});
			};
		}

		// setup lifecycles
		strapi.db.lifecycles.subscribe(subscriber);
	});
}

function buildEventQuery({ event }) {
	const query = {};

	if (event.params.where) {
		query.filters = event.params.where;
		query.populate = '*';
	}

	if (event.result?.count) {
		query.limit = event.result.count;
	} else if (event.params.limit) {
		query.limit = event.params.limit;
	}

	switch (event.action) {
		case 'afterCreate': {
			query.filters = {
				id: event.result.id,
			};
			query.populate = '*';
			break;
		}
		case 'afterCreateMany': {
			query.filters = {
				id: event.result.ids,
			};
			query.populate = '*';
			break;
		}
		case 'beforeUpdate': {
			query.fields = ['id'];
			break;
		}
	}

	return query;
}

module.exports = { bootstrapLifecycles };
