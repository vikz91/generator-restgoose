'use strict'

var env = process.env.NODE_ENV || 'development'

var cfg = require('./' + env)

module.exports = cfg
