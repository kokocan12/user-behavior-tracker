const elapsed = require('elapsed-time-logger');
const chalk = require('chalk');

const { compileTypescript } = require('./compile-typescript');
const { buildRollup } = require('./build-rollup');

class Builder {
  constructor() {
    this.tasks = [];
  }

  add(taskName, task) {
    this.tasks.push([taskName, task]);

    return this;
  }

  async run() {
    for (let i = 0; i < this.tasks.length; i += 1) {
      const taskName = this.tasks[i][0];
      const task = this.tasks[i][1];

      elapsed.start(taskName);
      // eslint-disable-next-line no-await-in-loop
      await task();
      elapsed.end(taskName, chalk.green(taskName) + chalk.bold.green(' complete in'));
    }
  }
}

const builder = new Builder();

builder.add('compile-typescript', compileTypescript).add('build-rollup', buildRollup).run();
