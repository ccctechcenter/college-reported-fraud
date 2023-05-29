# Overview

For an overview of clients to the fraud API, see the parent doc [CCCTC Documentation](../README.md#ccctc-documentation).

This module watches the [input-dir](./input-dir/) for JSON files that represent college fraud reports.  Valid reports are sent to CCCTC using the Fraud API.

This is an example integration where fraud reports saved into a directory trigger automatic updates to CCCTC using the Fraud API.

## Running the client

After completing the below [requirements](#prerequisites), you should be able to run the client.

In a terminal, run the [local docker](#local-docker) steps to start the module.

### Get API Token

Test your configuration by getting an API token.  Visit [http://localhost/token](http://localhost/token) to see something like: 

```JSON
{
   "access_token": "eyJhbGciOiJSU.....",
   "expires_in": 300,
   "refresh_expires_in": 1800,
   "refresh_token": "eyJhbGciOiJIUzI1NiI.....",
   "token_type": "Bearer",
   "not-before-policy": 0,
   "session_state": "9b2567c4-206d-4359-8f18-3cf9875fef7e",
   "scope": "email profile"
}
```

### Submit a fraud report

An [example fraud report](./input-dir/example-fraud-report.json) is provided.  With docker running, you can edit and save this as a new file and you'll see log entries for fraud API calls to CCCTC.

```
TODO: .... show example
```

### Modifying the client

Code using HTTP and using the fraud API is in [expressAPI.js](./src/expressAPI.js) where endpoints for `/token` and `/submit` exist.

The directory monitor logic is in [server.js](./src/server.js).  Logic to validate the input and proxy to express is detailed.







### Prerequisites 

   - Docker Desktop in required for the docker examples. [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

   - API Credentials obtained through Enabling Services

### Local Docker

To run all the dependencies and configuration in a docker environment follow these steps from this module's root folder: 

   - STEP 1: 
   
      `docker compose build`
      
      This sets up docker and builds the code.

   - STEP 2: 
   
      `docker compose up install`

      This downloads and installs all the dependencoes and libraries

   - STEP 3: 
   
      `docker compose up dev`

      This starts up the module in a docker container on your computer that monitors the `input-dir` and takes requests at `http://localhost`
      
      In this mode, any changes to the source restarts the server for hot-reloading.

### Local stack

For advanced users familiar with node and npm, you can use the below from the module root: 

`npm run dev`

___________________

# Table of Contents
[CCCTC documentation](#ccctc-documentation)

  [Introduction](#indtoruction)
      1. [sub 1](#example)
      Here is some 
   1. [MORE](#example)
      sub 2


# Table of Contents 1
1. [Example](#example)
2. [Example2](#example2)
3. [Third Example](#third-example)
4. [Fourth Example](#fourth-example)


## Example
## Example2
## Third Example
## Fourth Example
