'use strict';

const bootstrap = require('./bootstrap');
const config = require('./config');
const middlewares = require('./middlewares');
const services = require('./services');

module.exports = {
	bootstrap,
	config,
	services,
	middlewares,
};
