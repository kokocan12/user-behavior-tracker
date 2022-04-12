const exec = require('exec-sh').promise;
const elapsed = require('elapsed-time-logger');
const chalk = require('chalk');

async function buildTypescript() {
  elapsed.start('complie-typescript');
  exec('tsc -w');
  elapsed.end('complie-typescript', chalk.bold.green('complie-typescript complete'));
}

buildTypescript();
