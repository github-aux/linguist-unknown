'use strict';

global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
global.jsyaml = require('../src/scripts-min/js-yaml.min.js');
var LinguistLoader = require('../src/scripts/ling-loader.js').LinguistLoader;

describe('Matching urls', function () {
  it('should try to match urls extensions', function(done) {
   var downloadHelper = new LinguistLoader.DownloadHelper();
    downloadHelper.load("https://raw.githubusercontent.com/github-aux/linguist-unknown/chrome/.linguist.yml", function(objs){  
      var utils = new LinguistLoader.Utilities();
      utils.tryMatchUrlExtension("https://github.com/DestructHub/ProjectEuler/blob/master/Problem001/Haskell/solution_1.hs", objs, function(langObj){
        langObj.extensions.should.containDeep([".hs"]);
      });

      utils.tryMatchUrlExtension("https://github.com/github-aux/linguist-unknown/blob/chrome/examples/Brain/human_jump.brain", objs, function(langObj){
        langObj.extensions.should.containDeep([".brain", ".br"]);
      });

      done();
    });
  });
});
