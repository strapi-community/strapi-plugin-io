'use strict';

const yup = require('yup');
const _ = require('lodash');

const pluginConfigSchema = yup.object().shape({
	IOServerOptions: yup.object(),
	contentTypes: yup.lazy((contentTypes) => {
		if (typeof contentTypes === 'string') {
			return yup.string().oneOf(['*']).required();
		}

		const shape = {};
		_.each(contentTypes, (_value, key) => {
			shape[key] = yup.lazy((events) => {
				if (typeof events === 'string') {
					return yup.string().oneOf(['*']).required();
				}

				return yup
					.array()
					.of(
						yup
							.string()
							.oneOf([
								'find',
								'findOne',
								'delete',
								'create',
								'update',
								'publish',
								'unpublish',
								'bulkDelete',
							])
					)
					.required('An event is required');
			});
		});

		return yup.object().shape(shape);
	}),
	publicRoleName: yup.string(),
});

module.exports = {
	pluginConfigSchema,
};
