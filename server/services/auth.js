'use strict';

const { UnauthorizedError } = require('@strapi/utils').errors;
const { getService } = require('../utils/getService');

async function jwt(auth) {
	// adapted from (https://github.com/strapi/strapi/blob/main/packages/plugins/users-permissions/server/strategies/users-permissions.js)

	const jwtService = getService({ name: 'jwt', plugin: 'users-permissions' });
	const userService = getService({ name: 'user', plugin: 'users-permissions' });

	const jwtUser = await jwtService.verify(auth.token);
	const user = await userService.fetchAuthenticatedUser(jwtUser.id);

	// No user associated to the token
	if (!user) {
		throw new UnauthorizedError('Invalid credentials');
	}

	const advanced = await strapi.store({ type: 'plugin', name: 'users-permissions', key: 'advanced' }).get();

	// User not confirmed
	if (advanced.email_confirmation && !user.confirmed) {
		throw new UnauthorizedError('Invalid credentials');
	}

	// User blocked
	if (user.blocked) {
		throw new UnauthorizedError('Invalid credentials');
	}

	return user.role.name;
}

async function apiToken(auth) {
	// adapted from (https://github.com/strapi/strapi/blob/main/packages/core/admin/server/strategies/api-token.js)
	const tokenService = getService({ type: 'admin', plugin: 'api-token' });
	const apiToken = await tokenService.getBy({
		accessKey: tokenService.hash(auth.token),
	});

	// token not found
	if (!apiToken) {
		throw new UnauthorizedError('Invalid credentials');
	}

	const currentDate = new Date();

	// ensure token has not expired if applicable
	if (apiToken.expiresAt) {
		const expirationDate = new Date(apiToken.expiresAt);
		// token has expired
		if (expirationDate < currentDate) {
			throw new UnauthorizedError('Token expired');
		}
	}

	// update lastUsedAt
	await strapi.entityService.update('admin::api-token', apiToken.id, {
		data: {
			lastUsedAt: currentDate,
		},
	});

	return apiToken.name;
}

module.exports = {
	jwt,
	apiToken,
};
