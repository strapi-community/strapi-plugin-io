'use strict';

const { pluginId } = require('./pluginId');

const getService = ({ name, plugin = pluginId, type = 'plugin' }) =>
	strapi.service(`${type}::${plugin}.${name}`);

module.exports = {
	getService,
};
