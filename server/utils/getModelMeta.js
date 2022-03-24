'use strict';

const getModelMeta = (model) => {
	const rootModel = model.split('::')[1];
	const [apiName, , action] = rootModel.split('.');

	return {
		rootModel,
		apiName,
		action,
	};
};

module.exports = {
	getModelMeta,
};
