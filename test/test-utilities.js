'use strict';

global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
global.jsyaml = require('../src/scripts-min/js-yaml.min.js');
global.LinguistHighlighter = require('../src/scripts/ling-highlighter.js').LinguistHighlighter;
var LinguistLoader = require('../src/scripts/ling-loader.js').LinguistLoader;

describe('Loader', function () {
  var utilities = new LinguistLoader.Utilities();
  describe('Utilities', function() {
    it('should get the possible filepath correctly', function (done) {
      var location = {
        pathname: "/github-aux/linguist-unknown/blob/chrome/examples/Brain/human_jump.brain"
      };

      var filepath = utilities.getPossibleFilepath(location);
      filepath.should.equal("https://raw.githubusercontent.com/github-aux/linguist-unknown/chrome/.linguist.yml");
      done();
    });

    it('should refresh table', function(done) {
      var location = {
        hostname: "github.com",
        href: "https://github.com/github-aux/linguist-unknown/blob/chrome/examples/Brain/human_jump.brain",
        pathname: "/github-aux/linguist-unknown/blob/chrome/examples/Brain/human_jump.brain"
      };

      // check if it is not breaking
      utilities.refresh(location, function(langObj, table){
        done();
      });
    });
  });
});

