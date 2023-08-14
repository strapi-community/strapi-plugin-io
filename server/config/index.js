'use strict';

const { pluginConfigSchema } = require('./schema');

module.exports = {
	default() {
		return {
			events: {},
			hooks: { init() {} },
			socket: { serverOptions: { cors: { origin: 'http://localhost:1337', methods: ['GET'] } } },
		};
	},
	validator(config) {
		pluginConfigSchema.validateSync(config);
	},
};
