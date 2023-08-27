'use strict';

const { pluginConfigSchema } = require('./schema');

module.exports = {
	default() {
		return {
			events: {},
			hooks: { init() {} },
			socket: { serverOptions: { cors: { origin: 'http://127.0.0.1:8080', methods: ['GET'] } } },
		};
	},
	validator(config) {
		pluginConfigSchema.validateSync(config);
	},
};
