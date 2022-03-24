'use strict';

const isValidAdminRoute = (route) =>
	route.info.pluginName &&
	route.info.pluginName === 'content-manager' &&
	route.info.type === 'admin';

module.exports = {
	isValidAdminRoute,
};
