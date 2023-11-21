'use strict';

const { plugin } = require('./schema');

module.exports = {
	default() {
		return {
			events: {},
			socket: { serverOptions: { cors: { origin: 'http://127.0.0.1:8080', methods: ['GET'] } } },
			hooks: {},
		};
	},
	validator(config) {
		plugin.parse(config);
	},
};
