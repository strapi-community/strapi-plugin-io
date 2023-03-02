'use strict';

const { transformResponse } = require('@strapi/strapi/lib/core-api/controller/transform');

/**
 * Transform query response data to API format
 *
 * @param {Object} param
 * @param {String} param.resource
 * @param {Object} param.contentType
 */
function response({ resource, contentType }) {
	return transformResponse(resource, {}, { contentType });
}

module.exports = {
	response,
};
