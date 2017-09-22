'use strict';

global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
global.jsyaml = require('../src/scripts-min/js-yaml.min.js');
var LinguistLoader = require('../src/scripts/ling-loader.js').LinguistLoader;

describe('DownloadHelper', function () {
  it('should download and parse the YAML file properly', function (done) {
    var downloadHelper = new LinguistLoader.DownloadHelper();
    downloadHelper.load("https://raw.githubusercontent.com/github-aux/linguist-unknown/chrome/.linguist.yml", function(objs){
      objs.should.have.property('Brain').which.is.an.Object();
      objs.should.have.property('C').which.is.an.Object();
      objs.should.have.property('Brainfuck').which.is.an.Object();
      objs.should.have.property('Test').which.is.an.Object();

      objs.Brain.should.have.property('extensions');
      objs.Brain.extensions.should.containDeep([".brain", ".br"]);
      objs.Brain.should.have.property('default');
      objs.Brain.should.have.property('group');
      objs.Brain.grammar.should.matchEach(function(obj) {
        obj.should.have.property('color');
        obj.should.have.property('operators');
      });

      objs.Brainfuck.should.have.property('extensions');
      objs.Brainfuck.extensions.should.containDeep([".bf"]);
      // We are testing Brainfuck without the default, thus, the test below was wrong
      // objs.Brainfuck.should.have.property('default');
      objs.Brainfuck.should.have.property('group');

      objs.C.should.have.property('extensions');
      objs.C.extensions.should.containDeep([".c"]);
      objs.C.should.have.property('default');
      objs.C.should.have.property('group');

      objs.Test.should.have.property('extensions');
      objs.Test.extensions.should.containDeep([".test"]);
      objs.Test.should.have.property('default');
      objs.Test.should.have.property('group');

      objs.Test.group.should.matchAny(function(obj) {
        obj.should.have.property('color');
        obj.should.have.property('keywords');
      });

      objs.Test.group.should.matchAny(function(obj) {
        obj.should.have.property('color');
        obj.should.have.property('regexes');
        obj.regexes.should.matchEach(function(regexObj) {
          regexObj.should.have.property('regex');
          regexObj.should.have.property('modifier');
        });
      });

      done(); 
    });
  });
});

