'use strict';

var LinguistHighlighter = require('../src/scripts/ling-highlighter.js').LinguistHighlighter;

describe('Token', function () {
  it('should have a value, a position, a color and a size', function (done) {
    var token = new LinguistHighlighter.Token("if", 5, 2, "#F00BaF");
    token.should.have.property('value');
    token.should.have.property('pos');
    token.should.have.property('color');
    token.should.have.property('size');
    done();
  });
});
