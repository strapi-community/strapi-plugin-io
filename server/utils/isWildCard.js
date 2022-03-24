'use strict';

const isWildCard = (value) => typeof value === 'string' && value === '*';

module.exports = {
	isWildCard,
};
