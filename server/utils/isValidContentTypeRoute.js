'use strict';

const { isValidAdminRoute } = require('./isValidAdminRoute');
const { isValidContentAPIRoute } = require('./isValidContentAPIRoute');
const { isWildCard } = require('./isWildCard');
const { getModelMeta } = require('./getModelMeta');

const isValidContentTypeRoute = ({ contentTypes, route, model }) => {
	const { apiName, action } = getModelMeta(model);
	if (!isValidAdminRoute(route) && !isValidContentAPIRoute(route)) {
		return false;
	}

	if (isWildCard(contentTypes)) {
		return true;
	}

	if (!contentTypes[apiName]) {
		return false;
	}

	if (isWildCard(contentTypes[apiName])) {
		return true;
	}

	if (contentTypes[apiName][action]) {
		return true;
	}

	return false;
};

module.exports = {
	isValidContentTypeRoute,
};
