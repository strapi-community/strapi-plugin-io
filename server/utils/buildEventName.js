'use strict';

const { getModelMeta } = require('./getModelMeta');

const buildEventName = (model) => {
	const { apiName, action } = getModelMeta(model);
	return `${apiName}:${action}`;
};

module.exports = {
	buildEventName,
};
