'use strict';

const getModelMeta = (model) => {
	const rootModel = model.split('::')[1];
	const [apiName, , action] = rootModel.split('.');

	let permission = model;

	switch (action) {
		case 'publish':
			permission = permission.replace('publish', 'create');
			break;
		case 'unpublish':
			permission = permission.replace('unpublish', 'delete');
			break;
		default:
			break;
	}

	return {
		rootModel,
		apiName,
		action,
		permission,
	};
};

module.exports = {
	getModelMeta,
};
