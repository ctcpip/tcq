# Intro
TCQ is quite an old app and for to make it to work on contemporary systems, we are utilizing Docker to run the application in a containerized environment.

Apart from this, it was somewhat tightly coupled to CosmosDB - via the introduction of an adapter layer, this got now runtime configurable, so you can use either CosmosDB or MongoDB as a backend, or you can even write your own adapter for a different database.

## Adapters
Adapters are used to abstract the database layer, so you can use different databases without changing the application code. They are dynamically loaded on runtime, based on _filename conventions_ and passed _environment_ variables.

Currently, there are "things" that need to be _adapted_:
* `db` - the database connection and operations
* `session-store` - the session store for user sessions

Both used to be hardcoded to CosmosDB, but now you can choose between `cosmosdb` and `mongodb` as the database adapter.

### Configuring Adapters
For configuring the adapters, the following environment variables are used:
* `TCQ_DB_ADAPTER` - the database adapter to use, either `cosmos-db` or `mongodb`, 
  this will load the corresponding _db adapter_ from [./src/server/adapters/db](./src/server/adapters/db), by convention, the file should be named `<adapter>.db.adapter.ts` (e.g. `cosmos-db.db.adapter.ts` or `mongodb.db.adapter.ts`).
* `TCQ_SESSION_STORE_ADAPTER` - the session store adapter to use, either `cosmos-db` or `mongodb`, 
  this will load the corresponding _session store adapter_ from [./src/server/adapters/session-store](./src/server/adapters/session-store), by convention, the file should be named `<adapter>.session-store.adapter.ts` (e.g. `cosmos-db.session-store.adapter.ts` or `mongodb.session-store.adapter.ts`).

Adapters can have their own configuration, which can be set via environment variables, for example, _currently_ the `mongodb` adapters require the following environment variables to be set:
* `TCQ_DB_MONGODB_URI` for connecting to mongodb, e.g. `mongodb://db:27017/`
* `TCQ_DB_MONGODB_DB` for the db name, e.g. `tcq-reloaded-dev`
* `TCQ_SESSION_STORE_MONGODB_URI` for connecting to mongodb, `mongodb://db:27017/`
* `TCQ_SESSION_STORE_MONGODB_DATABASE` for the db name, e.g. `tcq-reloaded-dev`

### Implementing a Custom Adapter
Currently adapters are pretty simple, they just have to export a set of functions that are used by the application, have a look at the existing adapters in [./src/server/adapters/db](./src/server/adapters/db) and [./src/server/adapters/session-store](./src/server/adapters/session-store) to get an idea of how they work.

## Local Development Setup

### Building
You either need a _build-enabled_ Node 10.19.0 or you can use the provided _dockerized_ _builder_ to build the application. The latter is recommended, as it will ensure that the build works in a consistent environment.

For initially building the _builder_ (quis custodiet ipsos custodes), simply run `docker compose build builder`, this will create `tc39/tcq-reloaded-builder` that has all the necessary dependencies to build the application and enable the following commands to work:

* `npm run docker:npm` - runs `npm` in the builder container, so you can run any npm command inside the container
* `npm run docker:build-frontend` - builds the frontend application
* `npm run docker:build-backend` - builds the backend application
* `npm run docker:build-production` - builds both the frontend and backend applications for production

For actually building the application, you need to run the following commands:

```bash
npm run docker:npm install
npm run docker:npm run postinstall
npm run docker:build-production
```

### Running locally
* You need a GitHub OAuth app with `clientId` and `clientSecret`, these need to be set in `.env-development` that you can copy over from `.env-template` and set `TCQ_LOCAL_GH_SECRET`, `TCQ_LOCAL_GH_ID` and `TCQ_SESSION_SECRET`. Its `callbackUrl` _should_ be set to `http://localhost:3000/auth/github/callback`.
* You can easily provide a local MongoDB instance via `docker compose` as well, simply uncomment `TCQ_SESSION_STORE_*` and `TCQ_DB_*`  (see above for adapters)

If you have a proper build **and** database (e.g. `docker compose up db`), you can then run a dev container with `docker compose up dev` and access the application at `http://localhost:3000`.

## Deployment

### AWS
#### Using AWS Copilot
You can use [AWS Copilot](https://aws.github.io/copilot-cli/) to deploy the application to AWS, this will create a new ECS service with a load balancer and all the necessary resources. You can follow the [AWS Copilot documentation](https://aws.github.io/copilot-cli/docs/) for more information on how to set it up. Once setup, some secrets need to be set in the AWS Secrets Manager, these are:

* `TCQ_GH_SECRET` - the GitHub OAuth client secret
* `TCQ_SESSION_SECRET` - the session secret for signing cookies
* `TCQ_GH_ID` - the GitHub OAuth client ID

**and** because currently the _copilot application_ is configured (in [./copilot/tcq/manifest.yml](./copilot/tcq/manifest.yml)) to use MongoDB as the database, you also need to set the following secrets:
* `TCQ_DB_MONGODB_URI` - must be a MongoDB URI for connecting to the database
* `TCQ_SESSION_STORE_MONGODB_URI` - must be a MongoDB URI for connecting to the session store

They can be set via the AWS Copilot CLI with the following commands:
```bash
copilot secret init --name TCQ_GH_SECRET
copilot secret init --name TCQ_SESSION_SECRET
copilot secret init --name TCQ_GH_ID
copilot secret init --name TCQ_DB_MONGODB_URI
copilot secret init --name TCQ_SESSION_STORE_MONGODB_URI
```
> **N.B.** Currently the supplied [./copilot/tcq/manifest.yml](./copilot/tcq/manifest.yml) is hard-coded to deploy at `tcq.ninja`, if you want to deploy it to a different domain, you need to change the manifest file accordingly.
