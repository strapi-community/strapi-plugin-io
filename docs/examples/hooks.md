# Hooks

The hooks configuration enables custom code to be triggered at specific pre-determined time.

## Supported Hooks

### Init

The init hook triggerd immeditialy after the server side socket is initialized. It is useful for attaching additional information to the socket.

The following example attaches a redis [adapter](https://socket.io/docs/v4/adapter/) to the server socket.

```js
module.exports = ({ env }) => ({
	// ...
	io: {
		enabled: true,
		config: {
			contentTypes: ['api::article.article'],
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
});
```
