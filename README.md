# strapi-plugin-io

A plugin for [Strapi CMS](https://github.com/strapi/strapi) that provides the ability for [Socket IO](https://socket.io) integration

[![Downloads](https://img.shields.io/npm/dm/strapi-plugin-io?style=for-the-badge)](https://img.shields.io/npm/dm/strapi-plugin-io?style=for-the-badge)
[![Install size](https://img.shields.io/npm/l/strapi-plugin-io?style=for-the-badge)](https://img.shields.io/npm/l/strapi-plugin-io?style=for-the-badge)
[![Package version](https://img.shields.io/github/v/release/ComfortablyCoding/strapi-plugin-io?style=for-the-badge)](https://img.shields.io/github/v/release/ComfortablyCoding/strapi-plugin-io?style=for-the-badge)

## Requirements

The installation requirements are the same as Strapi itself and can be found in the documentation on the [Quick Start](https://strapi.io/documentation/developer-docs/latest/getting-started/quick-start.html) page in the Prerequisites info card.

### Supported Strapi versions

- v4.x.x

**NOTE**: While this plugin may work with the older Strapi versions, they are not supported, it is always recommended to use the latest version of Strapi.

## Installation

```sh
npm install strapi-plugin-io

# or

yarn add strapi-plugin-io
```

## Configuration

The plugin configuration is stored in a config file located at `./config/plugins.js`.

### Sample configuration

```javascript
module.exports = ({ env }) => ({
  // ...
  "io": {
    "enabled": true,
    "config": {
      "IOServerOptions" :{
        "cors": { "origin": "http://localhost:5000", "methods": ["GET"] },
      },
      "contentTypes": {
        "message": "*",
        "chat": ["create"]
      },
      "events": [
        {
          "name": "connection",
          "handler": ({ strapi }, socket) => {
            strapi.log.info(`[io] new connection with id ${socket.id}`);
          },
        },
        {
          "name": "hello",
          "handler": ({ strapi, socket }) => {
            strapi.log.info(`[io] hello ${socket.id}`);
          },
        },
        {
          "name": "hello-response",
          "handler": ({ strapi, socket }, callback) => {
            strapi.log.info(`[io] hello ${socket.id}`);
            callback("Hello, there!")
          },
        },
        {
          "name": "hello-response-data",
          "handler": ({ strapi, socket }, data, callback) => {
            strapi.log.info(`[io] hello ${socket.id}, data ${data}`);
            callback("Hello, there!")
          },
        },
      ]
    },
  },
  // ...
});
```

The above configuration will do the following:

  1. Set the IO server options.
  2. Emit all events for the messages content type and only the create event for the chats content type.
  3. Log the socket id of any newly connected sockets.

**IMPORTANT NOTE**: Make sure any sensitive data is stored in env files.

## The Complete Plugin Configuration Object

| Property | Description | Type | Default | Required |
| -------- | ----------- | ---- | ------- | -------- |
| IOServerOptions | The [Socket IO Server Options](https://socket.io/docs/v4/server-options). | Object | {} | No
| contentTypes | The Content Types to emit events for. A "*" can be used to listen for all content types and events. | Object `or` String | {} | No |
| contentTypes[apiName] | The events to listen for on the given content type. The apiName is the `singularName` in the [model schema](https://docs.strapi.io/developer-docs/latest/development/backend-customization/models.html#model-schema). The value can be an array of events or a "*" to listen for all. | Array `or` String | N/A | Yes |
| events | Any server server side events to listen for | Array | [] | No |
| events[x].name | The event name (case sensitive) | String | N/A | Yes |
| events[x].handler | The function to execute when the event is triggered. The handlers first argument is the ctx containing the strapi instance, the subsequent parameters are in the same order as in the client emit event. For the built in "connection" event the subsequent parameter is the socket. | Function | N/A | Yes
| publicRoleName | The name of the default role to be assigned to unauthenticated connections | String | "Public" | No

## Currently Supported Emit events

- `find`
- `findOne`
- `delete`
- `create`
- `update`
- `publish`
- `unpublish`

## Emit Syntax

All events emitted have the following syntax `singularName:action`.

## Emitting Custom Events

The server socket instance is attached to the strapi object. A custom event can be emitted like so

```javascript
strapi.$io.raw("customEvent", data);
```

The above emit will not verify any permissions before emitting. If you wish to make a verified event the emit function can be used.

```javascript
strapi.$io.emit("api::message.message.someCustomAction", data);
```

## Example Client Connections

Below are example client socket configurations.

### Unauthenticated User connection

```javascript
const { io } = require("socket.io-client");
const SERVER_URL = "http://localhost:1337";
const socket = io(SERVER_URL);

//  wait until socket connects before adding event listeners
socket.on("connect", () => {
  socket.on("message:update", (data) => {
    console.log(data)
  });
});
```

### Authenticated User connection

```javascript
const { io } = require("socket.io-client");
const SERVER_URL = "http://localhost:1337";
const JWT_TOKEN = "your users JWT token";

// token will be verified, connection will be rejected if not a valid JWT
const socket = io(SERVER_URL, {
  auth: { 
    token: JWT_TOKEN
  },
});

//  wait until socket connects before adding event listeners
socket.on("connect", () => {
  socket.on("message:update", (data) => {
    console.log(data)
  });
});
```

## Bugs

If any bugs are found please report them as a [Github Issue](https://github.com/ComfortablyCoding/strapi-plugin-io/issues)
