const fs = require('fs-extra');

function readFile(file) {
  return fs.readFile(file, 'utf8');
}

module.exports = {
  readFile
};
