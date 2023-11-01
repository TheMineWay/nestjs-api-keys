# NestJS API Keys

[![Node.js Package](https://github.com/TheMineWay/nestjs-api-keys/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/TheMineWay/nestjs-api-keys/actions/workflows/npm-publish.yml)

A NestJS API keys utility which allows you to secure APIs using an API Key based system.

This library only works in APIs made with NestJS.

## 0. Installing

Install the package using:

```bash
npm i nestjs-api-keys
```

or

```bash
yarn add nestjs-api-keys
```

## 1. Setup

First, you need to register the **ApiKeysModule**. You can do that by going to your **AppModule** and calling the **register** static method of the **ApiKeysModule** class:

```ts
@Module({
  imports: [
    ApiKeysModule.register({
      apiKeys: [],
    }),
  ],
})
export class AppModule {}
```

In the **apiKeys** array you need to provide all available _API Keys_.

```ts
ApiKeysModule.register({
    apiKeys: [
        {
            name: 'For reading users',   // Descriptive name
            keys: ['supersecretapikey'], // API keys composing this key
            permissions: ['users.read'], // Permissions given to this key
        },
    ],
}),
```

- **name:** allows you to provide a name to the API key for identification purposes (there is no functionality attached to the name).
- **keys:** an array where you provide all keys that compose the API key. Having more than one Key allows you to switch keys without downtime.
- **permissions:** an array where you place permissions as strings. Endpoints and controllers can require permissions, so you can assign them to api keys in here.

**REMEMBER: it is recommended that you DON'T provide directly here these values in production. You should get keys from a _.ENV_ file or any other secure source.**

In production you should (for example):

```ts
ApiKeysModule.register({
    apiKeys: JSON.parse(process.env.API_KEYS_JSON_STRING),
}),
```

### 1.0. Extra options

- **apiKeyHeader:** allows you to change the header name where **API key** is read. By default it is 'api-key'.

## 2. Protecting endpoints

You can secure any endpoint by using the **ApiKeyGuard** guard:

```ts
@UseGuards(
    ApiKeyGuard({
        permissions: ['users.read'],
    }),
)
@Get('users')
async getUsers() {
    // Fetch users
}
```
