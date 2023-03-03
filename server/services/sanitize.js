'use strict';

// adapted from https://github.com/strapi/strapi/tree/main/packages/core/utils/lib/sanitize

const { traverseEntity, pipeAsync, sanitize } = require('@strapi/utils');

// constants
const ACTIONS_TO_VERIFY = ['find'];
const CREATED_BY_ATTRIBUTE = 'createdBy';
const UPDATED_BY_ATTRIBUTE = 'updatedBy';

/**
 * Sanitize data output with a provided schema for a specified role
 *
 * @param {Object} param
 * @param {Object} param.schema
 * @param {Object} param.data
 * @param {Object} param.ability
 * @param {Function} param.scopeFn
 */
async function output({ schema, data, ability, scopeFn }) {
	if (Array.isArray(data)) {
		return Promise.all(data.map((entry) => output(entry, schema, { ability })));
	}

	const transforms = [sanitize.sanitizers.defaultSanitizeOutput(schema)];

	transforms.push(traverseEntity(removeRestrictedRelations({ ability, scopeFn }), { schema }));

	// Apply sanitizers from registry if exists
	strapi.sanitizers
		.get('content-api.output')
		.forEach((sanitizer) => transforms.push(sanitizer(schema)));

	return pipeAsync(...transforms)(data);
}

/**
 * Removes relations that are not viewable by the provided ability.
 *
 * @param {Object} ability
 * @returns visitor processor function
 */
function removeRestrictedRelations({ ability, scopeFn }) {
	return async ({ data, key, attribute, schema }, { remove, set }) => {
		const isRelation = attribute.type === 'relation';

		if (!isRelation) {
			return;
		}

		const handleMorphRelation = async () => {
			const newMorphValue = [];

			for (const element of data[key]) {
				const scopes = ACTIONS_TO_VERIFY.map((action) => `${element.__type}.${action}`);
				const isAllowed = scopeFn({ scopes, ability });
				if (isAllowed) {
					newMorphValue.push(element);
				}
			}

			// If the new value is empty, remove the relation completely
			if (newMorphValue.length === 0) {
				remove(key);
			} else {
				set(key, newMorphValue);
			}
		};

		const handleRegularRelation = async () => {
			const scopes = ACTIONS_TO_VERIFY.map((action) => `${attribute.target}.${action}`);
			const isAllowed = scopeFn({ scopes, ability });

			// If the user does not have access to any of the scopes, then remove the field
			if (!isAllowed) {
				remove(key);
			}
		};

		const isMorphRelation = attribute.relation.toLowerCase().startsWith('morph');
		const isCreatorRelation = [CREATED_BY_ATTRIBUTE, UPDATED_BY_ATTRIBUTE].includes(key);

		// Polymorphic relations
		if (isMorphRelation) {
			await handleMorphRelation();
			return;
		}

		// Creator relations
		if (isCreatorRelation && schema.options.populateCreatorFields) {
			// do nothing
			return;
		}

		// Regular relations
		await handleRegularRelation();
	};
}

module.exports = {
	output,
};
