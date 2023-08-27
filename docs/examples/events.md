# Events

The events configuration registers [server side events](https://socket.io/docs/v4/server-api/#events) that can be listened to.

## Supported Events

### Connection Event

The connection event is automatically triggered by this plugin any time a client is connected.

##### Plugin Configuration

```js
module.exports = ({ env }) => ({
	// ...
	io: {
		enabled: true,
		config: {
			contentTypes: ['api::article.article'],
			events: [
				{
					name: 'connection',
					handler: ({ strapi }, socket) => {
						// will log every time a client connects
						strapi.log.info(`[io] a new client with id ${socket.id} has connected`);
					},
				},
			],
		},
	},
});
```

## Custom Events

Custom server side events can be registered this way as well. It will be up to you to emit them client side.

The example below will update the relevant users name with the provided data each time the client calls emit for the `update-user-name` event.

##### Plugin Configuration

```js
module.exports = ({ env }) => ({
	// ...
	io: {
		enabled: true,
		config: {
			contentTypes: ['api::article.article'],
			events: [
				{
					name: 'update-user-name',
					handler: ({ strapi }, socket, name) => {
						strapi.log.info(`[io] trigger update for socket ${socket.id}.`);

						// update the respective users name.
						strapi.entityService.update('plugin::users-permissions.user', id, {
							data: {
								name,
							},
						});
					},
				},
			],
		},
	},
});
```

##### Client Socket

Once an event is setup it can then be triggered by socket on the client side.

```js
const id = 123;
const name = 'lorem ipsum';
socket.emit('update-user-name', socket, id, name);
```
