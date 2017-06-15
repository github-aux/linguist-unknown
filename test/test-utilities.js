'use strict';

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

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

    it('should refresh the code table', function(done) {
      JSDOM.fromURL("https://github.com/github-aux/linguist-unknown/blob/chrome/examples/Brain/human_jump.brain").then(dom => {

        var o = Object.prototype;
        Object.defineProperty(o, "innerText", {
          get: function() {
            if (this.innerHTML === undefined)
              return "";
            return this.innerHTML;
          },
          configurable: true
        });
      
        global.document = dom.window.document.documentElement;
        // the comment below is a test for the innerText property
        /* var table = document.getElementsByClassName("blob-wrapper")[0]
                              .getElementsByTagName("table")[0];
        var cells = table.querySelectorAll('tbody td');
        for (var i = 0; i < cells.length; i++) {
          var cell = cells[i];
          if (cell.id.indexOf("LC") !== -1) {
             console.log(cell.innerText); // ignore GH spa
          }
        }*/
        
        var location = {
          hostname: "github.com",
          href: "https://github.com/github-aux/linguist-unknown/blob/chrome/examples/Brain/human_jump.brain",
          pathname: "/github-aux/linguist-unknown/blob/chrome/examples/Brain/human_jump.brain"
        };

        // check if it is not breaking
        utilities.refresh(location, function(langObj, table) {
          langObj.should.not.equal(null).and.should.not.equal(undefined);
          table.should.not.equal(null).and.should.not.equal(undefined);
          done();
        });
      }); 
    });
  });
});

