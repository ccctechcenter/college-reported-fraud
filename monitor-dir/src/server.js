/**
 * main module for server startup/init
 */
const chokidar = require('chokidar');
const fs = require('fs');
const joi = require('joi')
const fetch = require('node-fetch')
require('dotenv').config()
require('./proxyAPI');

const { PORT } = process.env;

const schema = joi.object({
  appId: joi.number().integer(),
  cccId: joi.string().alphanum().min(7).max(7),
  fraudType: joi.string().valid('APPLICATION', 'ENROLLMENT', 'FINANCIAL'),
  reportedByMisCode: joi.string().alphanum().min(3).max(3).required(),
  federatedAid: joi.number(),
  ccpgAid: joi.number(),
  localAid: joi.number(),
  otherAid: joi.number(),
});

/**
 * Handles new or updated JSON input files representing a valid fraud report
 * 
 * @param {String} path to file
 */
async function handleInputfileChange(path) {
  try {
    const content = await fs.readFileSync(path, 'utf8');
    const obj = JSON.parse(content);

    //error is set if value fails to validate against the schema
    const { value, error } = schema.validate(obj);
    if (error) throw error;

    // send to proxy  
    const graphql = {
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

    const result = await fetch('http://localhost:' + PORT + '/graphql', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(graphql)
    })
      .then(res => res.json())
      .catch(err => console.error("[INPUT] error: ", err));

    console.log('[INPUT] result', result);

  } catch (error) {
    console.error(error);
  }
}

// Initialize watcher/monitor on directory
const watcher = chokidar.watch('input-dir', {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  ignoreInitial: true,      // startup clean
  depth: 0,                 // ignore subdirectories
  persistent: true
});

// watch for add or change events
watcher
  .on('change', async (path) => {
    console.log(`Updated file: ${path}`);
    handleInputfileChange(path);
  })
  .on('add', async (path) => {
    console.log(`New file: ${path}`);
    handleInputfileChange(path)
  });


