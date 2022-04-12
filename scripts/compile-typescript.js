const exec = require('exec-sh').promise;

async function compileTypescript() {
  await exec('tsc');
}

module.exports = { compileTypescript };
