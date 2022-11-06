'use strict';

const getModelMeta = (model) => {
	const rootModel = model.split('::')[1];
	const [apiName, , action] = rootModel.split('.');

	let permission = model;

	switch (action) {
		case 'publish':
		case 'createOrUpdate':
			permission = permission.replace(/publish|createOrUpdate/, 'update');
			break;
		case 'unpublish':
		case 'bulkDelete':
			permission = permission.replace(/unpublish|bulkDelete/, 'delete');
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
