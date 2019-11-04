'use strict';

const path = require('path');

module.exports = {
  mode: 'development',
  entry: './test/test_datetimeWrapper.js',
  output: {
    path: path.join(__dirname, 'tmp'),
    filename: '_test.js'
  }
};
