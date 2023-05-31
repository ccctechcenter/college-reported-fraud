/**
 * main module for server startup/init
 */
require('dotenv').config()

const chokidar = require('chokidar');
const fs = require('fs');
const joi = require('joi')
const { getNewToken, sendFraudReport } = require('./fraudAPI')

const { API_CLIENT_ID, API_USERNAME, API_PASSWORD } = process.env;

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

    const result = await sendFraudReport( value );

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


/**
 * If settings in .env file are configured, try to get a token on startup
 */
if (API_CLIENT_ID && API_USERNAME && API_PASSWORD) {
  console.log("Testing configs by getting a new token....");

  getNewToken().then( tok => console.log(tok));
}
