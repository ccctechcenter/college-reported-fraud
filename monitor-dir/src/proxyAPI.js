/**
 * Local proxy to CCCTC Fraud API using GraphQL
 */
const express = require("express");
const fetch = require('node-fetch')
const expressApp = express();

const { PORT, TOKEN_URL, API_URL, API_CLIENT_ID, API_USERNAME, API_PASSWORD } = process.env;

expressApp.use(express.json({ limit: "30mb", extended: true }));
expressApp.use(express.urlencoded({ limit: "30mb", extended: true }));
expressApp.listen(PORT, () => console.log(`Server is listening to PORT ${PORT}`));

// local endpoint: / for health
expressApp.get("/", (req, res) => {
  res.send("Server is running!");
});

// local endpoint: proxy to get Keycloak AUTH token
expressApp.get("/token", async (req, res) => {
  console.debug(`[TOKEN]: Fetching new token...`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("username", API_USERNAME);
  urlencoded.append("password", API_PASSWORD);
  urlencoded.append("grant_type", "password");
  urlencoded.append("client_id", API_CLIENT_ID);
  const token = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: urlencoded,
    redirect: 'follow'
  })
    .then(res => res.json())
    .then(res => {
      if( res.error ) {
        console.error('returned token ', res);
        throw Error( res.error )
      }
      return res
    })
    .catch(error => {
      console.error(`[ERROR TOKEN]: could not retrieve token due to: ${error}`);
    });
  res.send(token);
});

// local endpoint: proxy local calls to SuperGlue graph
expressApp.post("/graphql", async (req, res) => {
  const payload = req.body;

  console.debug(`[GRAPHQL]: Submitting fraud report: `, payload);

  const token = await fetch('http://localhost:' + PORT + '/token')
    .then(res => res.json())
    .catch(error => {
      console.error(`[GRAPHQL]: Failed to retrieve token: ${error}`);
    });
  if( !token ) throw Error("No token");

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append('Authorization', 'Bearer ' + token.access_token);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(payload),
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(res => {
      if (res.errors) return res.errors;
      if (res.data) return res.data;
      return res
    })
    .catch(error => console.log('GRAPHQL ERROR: ', error));

  res.send(response)
});
