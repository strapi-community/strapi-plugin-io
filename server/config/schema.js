'use strict';

const yup = require('yup');

const contentTypeConfig = yup.lazy((value) => {
	if (typeof value === 'string') {
		return yup.string();
	}

	if (typeof value === 'object') {
		return yup.object().shape({
			uid: yup.string(),
			actions: yup.array().oneOf(['create', 'update', 'delete']).optional(),
		});
	}

	return false;
});

const pluginConfigSchema = yup.object().shape({
	events: yup.object().optional(),
	hooks: yup
		.object()
		.shape({
			init: yup
				.object()
				.test({
					name: 'init',
					exclusive: true,
					// eslint-disable-next-line no-template-curly-in-string
					message: '${path} must be a function',
					test: (value) => typeof value === 'function',
				})
				.optional(),
		})
		.optional(),
	contentTypes: yup.array().of(contentTypeConfig),
	socket: yup.object().shape({ serverOptions: yup.object().optional() }).optional(),
});

module.exports = {
	pluginConfigSchema,
};
