'use strict';

var should = require('should');
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

  describe("Lexer", function() {
    it("should identify identifiers", function(done) {
      highlighter.isId("1", true).should.equal(false);
      highlighter.isId("1", false).should.equal(true);
      highlighter.isId("%", true).should.equal(false);
      highlighter.isId("%", false).should.equal(false);
      highlighter.isId("a", true).should.equal(true);
      highlighter.isId("a", false).should.equal(true);
      highlighter.isId("A", true).should.equal(true);
      highlighter.isId("A", false).should.equal(true);
      highlighter.isId("z", true).should.equal(true);
      highlighter.isId("z", false).should.equal(true);
      highlighter.isId("Z", true).should.equal(true);
      highlighter.isId("Z", false).should.equal(true);
      highlighter.isId(" ", true).should.equal(false);
      highlighter.isId(" ", false).should.equal(false);
      highlighter.isId("_", true).should.equal(true);
      highlighter.isId("_", false).should.equal(true);
      done();
    });

    it("should identify numbers", function(done) {
      highlighter.isNumber("a").should.equal(false);
      highlighter.isNumber("$").should.equal(false);
      highlighter.isNumber("0").should.equal(true);
      highlighter.isNumber("9").should.equal(true);
      highlighter.isNumber("+", "1").should.equal(true);
      highlighter.isNumber("-", "9").should.equal(true);
      done();
    });

    it("should identify literal strings", function(done) {
      highlighter.isLiteralString(" ").should.equal(false);
      highlighter.isLiteralString("a").should.equal(false);
      highlighter.isLiteralString("\"").should.equal(true);
      highlighter.isLiteralString("'").should.equal(true);
      done();
    });

    it("should identify custom lexemes", function(done) {
      highlighter.startsWith("test", "test1221 dsdshds", 0).should.equal(true);
      highlighter.startsWith("test", "test1221 dsdshds", 1).should.equal(false);
      highlighter.startsWith("test", "aaatest1221", 3).should.equal(true);
      highlighter.startsWith("==!%a5", "test1221 dsdshds==!%a5", 16).should.equal(true);

      done();
    });

    it("should identify regexes", function(done) {
      highlighter
        .matchRegex("#(?:[0-9a-fA-F]{3}){1,2}", "", "if color ~= #FFF", 12)
        .should.be.instanceof(Array)
        .and.matchAny(function(value) { value.should.equal("#FFF") });

      should.not.exist(highlighter.matchRegex("#(?:[0-9a-fA-F]{3}){1,2}", "", "if color ~= #FFF", 0));

       highlighter
        .matchRegex("^#(?:[0-9a-fA-F]{3}){1,2}", "", "if color ~= #F00BAF dsdds", 12)
        .should.be.instanceof(Array)
        .and.matchAny(function(value) { value.should.equal("#F00BAF"); });

      done();
    });

    it("should extract identifiers out of a code", function(done) {
      highlighter.getId("******_******", 6, function(id, pos, langObj) {
        id.should.equal("_");
      });

      highlighter.getId("******___669******", 6, function(id, pos, langObj) {
        id.should.equal("___669");
      });

      highlighter.getId("******my%var******", 6, function(id, pos, langObj) {
        id.should.equal("my");
      });

      highlighter.getId("******my_var_is_beautiful******", 6, function(id, pos, langObj) {
        id.should.equal("my_var_is_beautiful");
      });

      highlighter.getId("******_1_1_1_BLAH111******", 6, function(id, pos, langObj) {
        id.should.equal("_1_1_1_BLAH111");
      });

      done();
    });

    it("should extract numbers out of code", function(done) {
      highlighter.getNumber("******1_1_1_BLAH111******", 6, function(number, pos, langObj) {
        number.should.equal("1");
      });

      highlighter.getNumber("******1.3333333******", 6, function(number, pos, langObj) {
        number.should.equal("1.3333333");
      });

      highlighter.getNumber("******111111a******", 6, function(number, pos, langObj) {
        number.should.equal("111111");
      });

      done();
    });

    it("should extract literal strings out of code", function(done) {
      highlighter.getLiteralString("******\"my beautiful string\"******", 6, function(str, pos, langObj) {
        str.should.equal("\"my beautiful string\"");
      });

      highlighter.getLiteralString("******\"******", 6, null).should.equal(false);

      highlighter.getLiteralString("******'c'******", 6, function(str, pos, langObj) {
        str.should.equal("'c'");
      });

      done();
    });

    it("should extract multiline comments", function(done) {
      highlighter.getMultilineComment("*/", "******/*aaaaaaaaa*/", 6, function(comment, pos, looking, obj) {
        comment.should.equal("/*aaaaaaaaa*/");
      });

      highlighter.getMultilineComment("*/", "******aaaaaaaaa", 0, function(comment, pos, looking, obj) {
        comment.should.equal("******aaaaaaaaa");
      });

      highlighter.getMultilineComment("*/", "*/*****aaaaaaaaa", 0, function(comment, pos, looking, obj) {
        comment.should.equal("*/");
      });

      done();
    });
  });
});

