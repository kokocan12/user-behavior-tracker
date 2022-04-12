const exec = require('exec-sh').promise;

async function buildTypescript() {
  await exec('tsc');
}

module.exports = { buildTypescript };
