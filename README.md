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
        "cors": { origin: "http://localhost:5000", methods: ["GET"] },
      }
      "contentTypes": {
        "messages": *,
        "chats":["create"]
      },
    },
  },
  // ...
});
```

This will emit all events for the messages content type and only the create event for the chats content type.

**IMPORTANT NOTE**: Make sure any sensitive data is stored in env files.

## The Complete Plugin Configuration Object

| Property | Description | Type | Default | Required |
| -------- | ----------- | ---- | ------- | -------- |
| IOServerOptions | The [Socket IO Server Options](https://socket.io/docs/v4/server-options). | Object | {} | No
| contentTypes | The Content Types to emit events for. A "*" can be used to listen for all content types and events. | Object `or` String | {} | No |
| contentTypes[apiName] | The events to listen for on the given content type. The apiName is the `singularName` in the [model schema](https://docs.strapi.io/developer-docs/latest/development/backend-customization/models.html#model-schema). The value can be an array of events or a "*" to listen for all. | Array `or` String | N/A | Yes |

### Currently Supported Emit events

- `find`
- `findOne`
- `delete`
- `create`
- `update`
- `publish`
- `unpublish`
- `bulkDelete`

## Emit Syntax

All events emitted have the following syntax `singularName:action`.

## Bugs

If any bugs are found please report them as a [Github Issue](https://github.com/ComfortablyCoding/strapi-plugin-io/issues)
