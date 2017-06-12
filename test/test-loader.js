'use strict';

var LinguistLoader = require('../src/scripts/ling-loader.js').LinguistLoader;

describe('Loader', function () {
  describe('getPossibleFilepath', function() {
    it('should get the possible filepath correctly', function (done) {
      var location = {
        pathname: "/github-aux/linguist-unknown/blob/chrome/examples/Brain/human_jump.brain"
      };

      var filepath = new LinguistLoader.Utilities().getPossibleFilepath(location);
      filepath.should.equal("https://raw.githubusercontent.com/github-aux/linguist-unknown/chrome/.linguist.yml");
      done();
    });
  });
});

