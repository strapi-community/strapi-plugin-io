'use strict';

module.exports = {
	$schema: 'https://json.schemastore.org/eslintrc',
	extends: ['@strapi/eslint-config/back', 'plugin:prettier/recommended'],
	parserOptions: {
		ecmaVersion: 2020,
	},
	globals: {
		strapi: false,
	},
	rules: {
		'import/no-dynamic-require': 'off',
		'global-require': 'off',
		'prefer-destructuring': ['error', { AssignmentExpression: { array: false } }],
		'no-underscore-dangle': 'off',
		'no-use-before-define': 'off',
		'no-continue': 'warn',
		'no-process-exit': 'off',
		'no-loop-func': 'off',
		'max-classes-per-file': 'off',
		'no-param-reassign': [
			'error',
			{
				props: false,
			},
		],
	},
};
