# Overview

For an overview of clients to the fraud API, see the parent doc [CCCTC Documentation](../README.md#ccctc-documentation).
e
This module watches the [input-dir](./input-dir/) for JSON files that represent college fraud reports.  Valid reports are sent to CCCTC using the Fraud API.

This is an example integration where fraud reports saved into a directory trigger automatic updates to CCCTC using the Fraud API.


## Prerequisites 

   - Docker in required for the docker examples. [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

   - API Credentials obtained through Enabling Services

## Running the client

After completing the above and setting your credentials in the [properties file](./.env),  you should be able to run the client and interact with the API locally.

### Local Docker

To run all the dependencies and configuration in a docker environment follow these steps from this module's root folder: 

In a terminal, run these commands: 

- STEP 1: 

   `docker compose build`
   
   This sets up docker and builds the code.

- STEP 2: 

   `docker compose up install`

   This downloads and installs all the dependencoes and libraries

- STEP 3: 

   `docker compose up dev`

   This starts up the module in a docker container on your computer that monitors the `input-dir` for changes.
   
   In this mode, any changes to the source restarts the server for hot-reloading.

On startup, the client will test the configuration by trying to get an API token with the configs you saved in [properties](./.env).

The startup logs should look like this:
```
monitor-dir  | [nodemon] restarting due to changes...
monitor-dir  | [nodemon] starting `node server.js src/server.js`
monitor-dir  | Testing configs by getting a new token....
monitor-dir  | [TOKEN]: Fetching new token from https://auth.ci.ccctechcenter.org/auth/realms/API/protocol/openid-connect/token
monitor-dir  | {
monitor-dir  |   access_token: 'eyJhbGciOiJSU.....',
monitor-dir  |   expires_in: 300,
monitor-dir  |   refresh_expires_in: 1800,
monitor-dir  |   refresh_token: 'eyJhbGciOiJIUzI1N....',
monitor-dir  |   token_type: 'Bearer',
monitor-dir  |   'not-before-policy': 0,
monitor-dir  |   session_state: '12722d2d-dc66-4ab9-ab73-b2680e03d943',
monitor-dir  |   scope: 'email profile'
monitor-dir  | }

```

#### Submit a fraud report

An [example fraud report](./input-dir/example-fraud-report.json) is provided.  With docker running, you can edit and save this as a new file and you'll see log entries for fraud API calls to CCCTC.

```
monitor-dir  | Updated file: input-dir/example-fraud-report.json
monitor-dir  | [GRAPHQL]: Submitting fraud report:  {
monitor-dir  |   query: 'mutation FraudReportSubmit($input: FraudReportSubmitInput!) {         FraudReportSubmit(input: $input) { appId cccId fraudType }}',
monitor-dir  |   variables: {
monitor-dir  |     input: {
monitor-dir  |       cccId: 'AAA0001',
monitor-dir  |       fraudType: 'APPLICATION',
monitor-dir  |       appId: 1,
monitor-dir  |       reportedByMisCode: 'ZZ1'
monitor-dir  |     }
monitor-dir  |   }
monitor-dir  | }
monitor-dir  | [TOKEN]: Fetching new token...
monitor-dir  | [INPUT] result {
monitor-dir  |   FraudReportSubmit: { appId: 1, cccId: 'AAA0001', fraudType: 'APPLICATION' }
monitor-dir  | }
```

### Modifying the client

This is a simple client with code for the fraud API in [fraudAPI.js](./src/fraudAPI.js).

The directory monitor is in [server.js](./src/server.js).  Logic to validate the input and call 

### Local stack

For advanced users familiar with node, npm and Keycloak, you can use the below from the module root: 

`npm run dev`
