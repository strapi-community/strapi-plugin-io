# Installation & Configuration

::: info Note
This plugin is compatible with Strapi v4.x only. While it may work with the older Strapi versions, they are not supported. It is recommended to always use the latest version of Strapi.
:::

1. Install the plugin in the root directory of your strapi project.

:::: code-group

```bash [npm]
npm i strapi-plugin-io
```

```bash [yarn]
yarn add strapi-plugin-io
```

::::

2. Enable the plugin at `./config/plugins.js`.

```js
module.exports = ({ env }) => ({
	// ...
	io: {
		enabled: true,
		config: {
			// This will listen for all supported events on the artice content type
			contentTypes: ['api::article.article'],
		},
	},
	// ...
});
```

::: info Note
The plugins.js file does not exist by default, if this is a new project it will need to be created.
:::

3. Connect a client socket to listen for events.

::: info Note
Authentication is handled automatically by the plugin. Clients are added to rooms based on the role/token used during the socket handshake. The public room is whatever role is set as default in the [advanced settings of users-permissions plugin](https://docs.strapi.io/user-docs/settings/configuring-users-permissions-plugin-settings#configuring-advanced-settings).
:::

:::: code-group

```js [Public]
/**
 * Connect as a public user
 */

const { io } = require('socket.io-client');
// URL to your strapi instance
const SERVER_URL = 'http://localhost:1337';

// connect the socket
const socket = io(SERVER_URL);

//  wait until socket connects before adding event listeners
socket.on('connect', () => {
	socket.on('article:create', (data) => {
		console.log('article created!');
		console.log(data);
	});
	socket.on('article:update', (data) => {
		console.log('article updated!');
		console.log(data);
	});
	socket.on('article:delete', (data) => {
		console.log('article deleted!');
		console.log(data);
	});
});
```

```js [JWT]
/**
 * Connect as ac authorized user. Events will be received based on the role associated with it.
 */

const { io } = require('socket.io-client');
// URL to your strapi instance
const SERVER_URL = 'http://localhost:1337';
const JWT_TOKEN = '123456';

// connect the socket
const socket = io(SERVER_URL, {
	auth: {
		stragey: 'jwt' // jwt is the default strategy if none is provided
		token: JWT_TOKEN,
	},
});

//  wait until socket connects before adding event listeners
socket.on('connect', () => {
	socket.on('article:create', (data) => {
		console.log('article created!')
		console.log(data);
	});
	socket.on('article:update', (data) => {
		console.log('article updated!')
		console.log(data);
	});
	socket.on('article:delete', (data) => {
		console.log('article deleted!')
		console.log(data);
	});
});
```

```js [Access Token]
/**
 * Connect as ac authorized user. Events will be received based on the token type permissions associated with it.
 */

const { io } = require('socket.io-client');
// URL to your strapi instance
const SERVER_URL = 'http://localhost:1337';
const ACCESS_TOKEN = '123456';

// connect the socket
const socket = io(SERVER_URL, {
	auth: {
		stragey: 'apiToken' // jwt is the default strategy if none is provided
		token: ACCESS_TOKEN,
	},
});

//  wait until socket connects before adding event listeners
socket.on('connect', () => {
	socket.on('article:create', (data) => {
		console.log('article created!')
		console.log(data);
	});
	socket.on('article:update', (data) => {
		console.log('article updated!')
		console.log(data);
	});
	socket.on('article:delete', (data) => {
		console.log('article deleted!')
		console.log(data);
	});
});
```

::::
