'use strict';

const getModelMeta = (model) => {
	const [type, rootModel] = model.split('::');
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
		type,
		rootModel,
		apiName,
		action,
		permission,
	};
};

module.exports = {
	getModelMeta,
};
