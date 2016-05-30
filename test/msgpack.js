
var assert = require('assert');
var http = require('http');
var request = require('supertest');

var bodyParser = require('..');


describe('bodyParser.json()', function(){
  
});

function createServer(opts){
  var _bodyParser = typeof opts !== 'function'
    ? bodyParser.json(opts)
    : opts

  return http.createServer(function(req, res){
    _bodyParser(req, res, function(err){
      res.statusCode = err ? (err.status || 500) : 200;
      res.end(err ? err.message : JSON.stringify(req.body));
    })
  })
}
