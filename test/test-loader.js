'use strict';

var Loader = require('../src/scripts/ling-loader.js').LinguistLoader;

describe('getPossibleFilepath', function () {
  it('should get the possible filepath correctly', function (done) {
    var location = {
        pathname: "/github-aux/linguist-unknown/blob/chrome/examples/Brain/human_jump.brain"
    };

    var filepath = new Loader.Utilities().getPossibleFilepath(location);
    filepath.should.equal("https://raw.githubusercontent.com/github-aux/linguist-unknown/chrome/.linguist.yml");
    done();
  });
});

