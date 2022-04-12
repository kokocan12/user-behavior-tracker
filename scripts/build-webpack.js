const exec = require('exec-sh').promise;

async function buildWebpack() {
  await exec('webpack --config ./webpack.development.js');
}

module.exports = {
  buildWebpack,
};
