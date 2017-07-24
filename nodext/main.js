nodext = require 'nodext'
express = require 'express'
path = require 'path'

class exports.extension extends nodext.Extension
  config: {}
  name: 'where'

  configure: (server) ->
    srcPath = path.resolve __dirname, '../src'
    server.use @config.urlPrefix, express.compiler
      src: srcPath
      dest: srcPath
      enable: ['coffeescript']
    server.use @config.urlPrefix, express.static srcPath
