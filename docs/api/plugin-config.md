# Plugin Configuration Options

## events

- type `object`
- default `{}`

> Defines the server side socket events to listen to.

The keys of the object will be used for the event names.

### Properties

#### handler

The handler property is the callback triggered when the event is emitted. It has the signature

```js
/**
 *  - ctx -> handler context.
 *    - strapi -> global strapi object.
 *    - socket -> access to the specific socket that triggered the event.
 *    - io -> access to the io class.
 *  - ...args -> arguments that were sent with the event.
 */
handler({ strapi, io, socket }, ...args);
```

::: details Example

```js
module.exports = ({ env }) => ({
	// ...
	io: {
		enabled: true,
		config: {
			events: {
				connection: {
					handler({ strapi, socket }) {
						// will log whenever a socket connects
						strapi.log.info(`[io] new connection with id ${socket.id}`);
					},
				},
				'custom-event-name': {
					handler({ strapi, socket }, x, y) {
						// will log whenever 'custom-event-name' is called by a socket
						strapi.log.info(`[io] hello from custom event location ${x} ${y}`);
					},
				},
			},
		},
	},
	// ...
});
```

:::

## socket

- type `object`
- default

```json
{
	"socket": {
		"serverOptions": {
			"cors": { "origin": "http://localhost:1337", "methods": ["GET"] }
		}
	}
}
```

> Defines the server side socket settings.

### Properties

#### serverOptions

The [IO Server Socket Options](https://socket.io/docs/v4/server-options/). It is passed directly with no modification.

::: details Example

```js
module.exports = ({ env }) => ({
	// ...
	io: {
		enabled: true,
		config: {
			socket: {
				serverOptions: {
					cors: { origin: 'http://localhost:1337', methods: ['GET'] },
				},
			},
		},
	},
	// ...
});
```

:::

## hooks

- type `object`
- default

```js
{
	hooks: {
		init() {},
	},
}
```

> Hooks are similar in concept to model lifecyces in strapi. They are functions called at specific points in the plugin lifecycle.

### Supported Hooks

##### init

The init hook is called right after the io `Server` instance is constructed. It is used to add any additional options to the io instance. A common use case for this are server [adapters](https://socket.io/docs/v4/adapter)

The init hook has the following signature

```js
/**
 *  - ctx -> hook context.
 *    - strapi -> global strapi object.
 *    - io -> access to the io class.
 */
init({ strapi, io });
```

::: details Example

```js
module.exports = ({ env }) => ({
	// ...
	io: {
		enabled: true,
		config: {
			hooks: {
				init({ io }) {
					// adds a redis adapter to the server scker
					const pubClient = createClient({ url: 'redis://localhost:6379' });
					const subClient = pubClient.duplicate();
					io.server().adapter(createAdapter(pubClient, subClient));
				},
			},
		},
	},
	// ...
});
```

:::