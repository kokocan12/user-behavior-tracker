const exec = require('exec-sh').promise;

async function buildRollup() {
  await exec('rollup --config rollup.config.js');
}

module.exports = {
  buildRollup,
};
