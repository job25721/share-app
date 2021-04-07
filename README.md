# SHARE APP

CPE CMU 2020 SENIOR PROJECT

## `Tech stack`

- React native (Typescript)
- NestJS
- GraphQL

## `Setup`

### share-application <br>

<br><b>require</b> <br>
<b>/android/app></b> -> google-services.json
<br>
<b>/ios</b> -> GoogleService-Info.plist
<br>
<b>/src</b> -> config.ts
<br>

```ts
src / config.ts;

const API_URL_ONLINE = "xx.xx.xxx.xx:xxxx";
const API_DEV = "xx.xx.xxx.xx:xxxx";
const API_LOCAL = "localhost:xxxx";

export default {
  api: API_LOCAL,
};
```

## `Commands`

- yarn android (run on android device)
- yarn ios (run on ios device)
- yarn start (start a react server)

### share-api

<br><b>require</b> <br> .env clone from .env.example

## `Commands`

- yarn start:dev (start hot reload server)
- yarn start:prod (start server from build)
- yarn build (build a server)
