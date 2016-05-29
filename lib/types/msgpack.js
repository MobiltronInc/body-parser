/*!
 * body-parser
 * Copyright(c) 2016 Vassilios Karakoidas
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 */

var bytes = require('bytes')
var debug = require('debug')('body-parser:msgpack')
var read = require('../read')
var typeis = require('type-is')
var msgpack = require('msgpack-lite')

/**
 * Module exports.
 */

module.exports = raw

function msgpack(options) {
  var opts = options || {};

  var inflate = opts.inflate !== false
  var limit = typeof opts.limit !== 'number'
    ? bytes.parse(opts.limit || '100kb')
    : opts.limit
  var type = opts.type || 'application/x-msgpack'
  var verify = opts.verify || false

  if (verify !== false && typeof verify !== 'function') {
    throw new TypeError('option verify must be function')
  }

  // create the appropriate type checking function
  var shouldParse = typeof type !== 'function'
    ? typeChecker(type)
    : type

  function parse(buf) {
    return buf
  }

  return function msgpackParser(req, res, next) {
    if (req._body) {
      return debug('body already parsed'), next()
    }

    req.body = req.body || {}

    // skip requests without bodies
    if (!typeis.hasBody(req)) {
      return debug('skip empty body'), next()
    }

    debug('content-type %j', req.headers['content-type'])

    // determine if request should be parsed
    if (!shouldParse(req)) {
      return debug('skip parsing'), next()
    }

    // read
    read(req, res, next, parse, debug, {
      encoding: null,
      inflate: inflate,
      limit: limit,
      verify: verify
    })
  }

}
