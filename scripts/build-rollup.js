const exec = require('exec-sh').promise;

async function buildRollup() {
  await exec('rollup dist/esm/index.js --file dist/bundle.js --format iife --name Tracker');
}

module.exports = {
  buildRollup,
};
