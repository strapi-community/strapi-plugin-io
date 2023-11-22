# IO Class

The io class represents the server socket instance and is accessibe on the strapi object as $io. (e.g. strapi.$io).

## Methods

### Emit

The emit method sends data to all roles/tokens that have permission for the content types action that triggered the action. The current supported actions are `create`,`update`, and `delete`.

All auto events emitted are namespaced by the content types singularName followed by the action in the format of `singularName:action` (i.e. `article:create`).

The emit method will automatically `sanitize` and `transform` the output before sending to the appropriate rooms.

#### Signature

The emit function has the following signature

```js
/**
 *  - ctx -> emit context.
 *    - event -> the emit action (e.g. create, update etc), the permission for the role is based on this value.
 *    - schema -> the content type model for the data provided.
 *    - data -> data to be emitted.
 */
emit({ event, schema, data });
```

::: details Example

```js
// built in action
strapi.$io.emit({ event: 'update', schema, data });

// custom action
strapi.$io.emit({ event: 'customAction', schema, data });
```

:::

### Raw

The raw method lets you emit events with any name and data you may want.

::: warning
It will **NOT** sanitize or transform the data, whatever it receives will be emitted.
:::

The function has the following signature

```js
/**
 *  - ctx -> raw emit context.
 *    - event -> the event to emit.
 *    - rooms -> the rooms to emit to.
 *    - data -> data to be emitted.
 */
raw({ event, rooms, data });
```

::: details Example

```js
// emit to all rooms
strapi.$io.raw({ event: 'update:custom', data: { message: 'hello' } });

// emit to specific room
strapi.$io.raw({ event: 'lorem-ipsum', rooms: ['r1', 'r2'], data: { message: 'hello' } });
```

:::

### Event Signature

The events emitted from the `raw` and `emit` functions have the following event signature.

```js
socket.on(eventName, { data });
```

:::: code-group

```js [Server]
// ..
strapi.$io.emit({ event: 'create', schema, data });
//..
```

```js [Client]
// ..
socket.on('article:create', ({ data }) => {
	console.log({ data });
});
//..
```

::::
