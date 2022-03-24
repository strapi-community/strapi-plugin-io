'use strict';

const getAdvancedSettings = () =>
	strapi.store({ type: 'plugin', name: 'users-permissions' }).get({ key: 'advanced' });

module.exports = {
	getAdvancedSettings,
};
