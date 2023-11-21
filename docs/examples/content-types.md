# Content Types

The content type configuration controls which content types should emit events to client sockets. It accepts two formats, a string and an object.

The string format uses just the content types uid as the value and auto opts in to all events.

```js
module.exports = ({ env }) => ({
	// ...
	io: {
		enabled: true,
		config: {
			contentTypes: ['api:article.article'],
		},
	},
});
```

The object format provides better control over which events a content type should emit. It accepts a uid and the actions array that specifies the actions that should be emitted.

The accepted actions are `create`,`update`, and/or `delete`.

```js
module.exports = ({ env }) => ({
	// ...
	io: {
		enabled: true,
		config: {
			// the article content type will only emit create actions
			contentTypes: [{ uid: 'api:article.article', actions: ['create'] }],
		},
	},
});
```
