'use strict';

const isValidContentAPIRoute = (route) =>
	!route.info.pluginName && route.info.apiName && route.info.type === 'content-api';

module.exports = {
	isValidContentAPIRoute,
};
