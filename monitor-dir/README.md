# Overview

For an overview of clients to the fraud API, see the parent doc [CCCTC Documentation](../README.md#ccctc-documentation).
e
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

Code using HTTP and using the fraud API is in [proxyAPI.js](./src/proxyAPI.js) where endpoints for `/token` and `/submit` exist.

The directory monitor logic is in [server.js](./src/server.js).  Logic to validate the input and proxy to express is detailed.







### Prerequisites 

   - Docker Desktop in required for the docker examples. [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

   - API Credentials obtained through Enabling Services

### Local Docker


Steps to set up local repo: 

  1. clone repo:  git clone https://github.com/bstout/college-reported-fraud.git

  Windows with wsl2: 
    1. sudo apt update && sudo apt upgrade

    2. Add Docker’s official GPG key:
      sudo install -m 0755 -d /etc/apt/keyrings
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
      sudo chmod a+r /etc/apt/keyrings/docker.gpg

      echo \
        "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
        sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

      sudo apt install docker.io

  2. docker compose build 

  3. docker compose up install 

  4. edit .env and fill out 
    API_CLIENT_ID=
    API_USERNAME=
    API_PASSWORD=

  4. docker compose up dev 

  5. Browser: http://localhost/
    
    `Server is running!`

  6. Browser:  http://localhost/token






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

