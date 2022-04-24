'use strict';

/**
 * Retrieves all strapi rooms (roles).
 *
 */
const getStrapiRooms = () =>
	strapi.entityService.findMany('plugin::users-permissions.role', {
		fields: ['name'],
		populate: {
			permissions: {
				fields: ['action'],
			},
		},
	});

module.exports = {
	getStrapiRooms,
};
