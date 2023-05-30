/**
 * Local proxy to CCCTC Fraud API using GraphQL
 */
const fetch = require('node-fetch')

const { TOKEN_URL, API_URL, API_CLIENT_ID, API_USERNAME, API_PASSWORD } = process.env;


/**
 * Get CCCTC API token
 */
exports.getNewToken = async () => {
  console.debug(`[TOKEN]: Fetching new token from `+ TOKEN_URL );

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
      if (res.error) {
        console.error('returned token ', res);
        throw Error(res.error)
      }
      return res
    })
    .catch(error => {
      console.error(`[ERROR TOKEN]: could not retrieve token due to: ${error}`);
    });
    return token;
}

/**
 * Submits a fraud report to CCCTC
 * 
 * @param {JSON} value college report
 */
exports.sendFraudReport = async (value) => {
  // send to legit  
  const payload = {
    query: "mutation FraudReportSubmit($input: FraudReportSubmitInput!) { \
      FraudReportSubmit(input: $input) { appId cccId fraudType }}",
    variables: {
      "input": {
        "cccId": value.cccId,
        "fraudType": value.fraudType,
        "appId": value.appId,
        "reportedByMisCode": value.reportedByMisCode
      }
    }
  };

  console.debug(`[GRAPHQL]: Submitting fraud report: `, payload);

  const token = await this.getNewToken();
  if (!token) throw Error("No token");

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

    return response;
}


