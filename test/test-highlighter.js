'use strict';

var LinguistHighlighter = require('../src/scripts/ling-highlighter.js').LinguistHighlighter;

describe('HighLighter', function () {
  var highlighter = new LinguistHighlighter.Highlighter();

  describe('Span', function() {

    it('should get a partial span tag (opened) with color', function (done) {
      var span_tag = highlighter.openSpan("#FFFFFF");
      span_tag.should.equal("<span style=\"color:#FFFFFF;\">");
      done();
    });

    it('should get a partial span tag (closed)', function (done) {
      var span_tag = highlighter.closeSpan();
      span_tag.should.equal("</span>");
      done();
    });

    it('should get a full span tag with value and color', function (done) {
      var span_tag = highlighter.getSpan("test", "#000000");
      span_tag.should.equal("<span style=\"color:#000000;\">test</span>");
      done();
    });

  });

});

