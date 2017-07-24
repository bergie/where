/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const nodext = require('nodext');
const express = require('express');
const path = require('path');

const Cls = (exports.extension = class extension extends nodext.Extension {
  static initClass() {
    this.prototype.config = {};
    this.prototype.name = 'where';
  }

  configure(server) {
    const srcPath = path.resolve(__dirname, '../src');
    server.use(this.config.urlPrefix, express.compiler({
      src: srcPath,
      dest: srcPath,
      enable: ['coffeescript']}));
    return server.use(this.config.urlPrefix, express.static(srcPath));
  }
});
Cls.initClass();
