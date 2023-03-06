'use strict';

const yup = require('yup');

const pluginConfigSchema = yup.object().shape({
	events: yup.object(),
	hooks: yup.object().shape({
		init: yup.object().test({
			name: 'init',
			exclusive: true,
			// eslint-disable-next-line no-template-curly-in-string
			message: '${path} must be a function',
			test: (value) => typeof value === 'function',
		}),
	}),
	socket: yup.object().shape({ serverOptions: yup.object() }),
});

module.exports = {
	pluginConfigSchema,
};
