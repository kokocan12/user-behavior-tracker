const exec = require('exec-sh').promise;
const fs = require('fs-extra');

async function buildForNetlify() {
  await exec('yarn build');
  await exec('parcel build demo/index.html --out-dir demo-build');
  fs.copy('demo/_redirects', 'demo-build/_redirects');
}

buildForNetlify();
