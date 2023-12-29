# Installation & Configuration

::: info Note
This plugin is compatible with Strapi v4.x only. While it may work with the older Strapi versions, they are not supported. It is recommended to always use the latest version of Strapi.
:::

::: warning Data Transfer Compatibility
 If this plugin is active when the `strapi transfer` command is triggered, the transfer command will fail. You will need to **temporarily disable this plugin** or ensure that your websocket server is running on a different port than the Strapi server, or a on a specific route within Strapi to use the transfer command. See [issue-76](https://github.com/ComfortablyCoding/strapi-plugin-io/issues/76) for any additional informatin.
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
			// This will listen for all supported events on the article content type
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

Authentication is handled automatically by the plugin. Connections are added to rooms based on the name of role/token used in auth. Connections are placed in the Public Role room if no strategy is provided.

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
 * Connect as an authorized user using JWT.
 * Events will be received based on the role permissions.
 */

const { io } = require('socket.io-client');
// URL to your strapi instance
const SERVER_URL = 'http://localhost:1337';
// generated token returned after sign in
const JWT_TOKEN = '123456';

// connect the socket
const socket = io(SERVER_URL, {
	auth: {
		strategy: 'jwt',
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

```js [API Token]
/**
 * Connect as an authorized user using an API Token.
 * Events will be received based on the tokens permissions.
 */

const { io } = require('socket.io-client');
// URL to your strapi instance
const SERVER_URL = 'http://localhost:1337';

// API Token from Settings -> Global Settings -> API Tokens in the dashboard
const ACCESS_TOKEN = '123456';

// connect the socket
const socket = io(SERVER_URL, {
	auth: {
		strategy: 'apiToken',
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
