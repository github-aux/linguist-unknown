'use strict';

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var should = require('should');
const { Highlighter } = require('../src/scripts/ling-highlighter.js').LinguistHighlighter;

describe('HighLighter', function () {
  var highlighter = new Highlighter();
  var langObjs = {
    C:
     { extensions: [ '.c' ],
       default_color: '#24292e',
       comment_color: '#969896',
       id_color: '#7b9c0e',
       number_color: '#745296',
       string_color: '#8B9EB7',
       single_line_comment: '//',
       begin_multiline_comment: '/*',
       end_multiline_comment: '*/',
       grammar:
        [ { color: '#a71d5d',
            keywords: [ 'include', 'void', 'int', 'float' ] },
          { color: '#FF1053',
            keywords: [ 'printf', 'putchar', 'getchar' ] } ] },
    Brain:
     { extensions: [ '.br', '.brain' ],
       default_color: '#969896',
       grammar:
        [ { color: '#a71d5d',
            operators: [ '>', '<', '^', '&lt;', '&gt;' ] },
          { color: '#333333',
            operators: [ '[', ']', '{', '}', '?', ':', ';', '!' ] },
          { color: '#0086b3',
            operators: [ '+', '-', '*', '/', '%', '_' ] },
          { color: '#795da3', operators: [ '.', ',', '$', '#' ] } ] },
    Brainfuck:
     { extensions: [ '.bf' ],
       grammar:
        [ { color: '#BF211E', operators: [ '>', '<', '&lt;', '&gt;' ] },
          { color: '#B744B8', operators: [ '[', ']' ] },
          { color: '#69A197', operators: [ '+', '-' ] },
          { color: '#F9DC5C', operators: [ '.', ',' ] } ] },
    Test:
     { extensions: [ '.test' ],
       default_color: '#FF8272',
       comment_color: '#969896',
       id_color: '#FF99FF',
       number_color: '#FF6600',
       string_color: '#333300',
       single_line_comment: '//',
       begin_multiline_comment: '/*',
       end_multiline_comment: '*/',
       grammar:
        [ { color: '#72EEBB',
            keywords: [ 'for', 'while' ],
            regexes: [ { regex: '&(amp;)/[^/]*/([\\S]?)*', modifier: '' } ] },
          { color: '#FF00FF',
            keywords: [ 'if', 'else', 'switch', 'let' ] } ] }
  };

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

  describe('Painting', function() {
    it('should create the right tokens according to the chosen language', function (done) {
      var tks1 = new Highlighter(langObjs.Brain).lexer("++ blah +#$ {!}");
      tks1.should.containDeepOrdered([
        { value: '+', pos: 0, size: 1, color: '#0086b3' },
        { value: '+', pos: 1, size: 1, color: '#0086b3' },
        { value: 'blah', pos: 3, size: 4, color: '#969896' },
        { value: '+', pos: 8, size: 1, color: '#0086b3' },
        { value: '#', pos: 9, size: 1, color: '#795da3' },
        { value: '$', pos: 10, size: 1, color: '#795da3' },
        { value: '{', pos: 12, size: 1, color: '#333333' },
        { value: '!', pos: 13, size: 1, color: '#333333' },
        { value: '}', pos: 14, size: 1, color: '#333333' }
      ]);

      var tks2 = new Highlighter(langObjs.Brainfuck).lexer("+[>+] blah blah blah");
      tks2.should.containDeepOrdered([
        { value: '+', pos: 0, size: 1, color: '#69A197' },
        { value: '[', pos: 1, size: 1, color: '#B744B8' },
        { value: '>', pos: 2, size: 1, color: '#BF211E' },
        { value: '+', pos: 3, size: 1, color: '#69A197' },
        { value: ']', pos: 4, size: 1, color: '#B744B8' },
        { value: 'blah', pos: 6, size: 4, color: '#24292e' },
        { value: 'blah', pos: 11, size: 4, color: '#24292e' },
        { value: 'blah', pos: 16, size: 4, color: '#24292e' }
      ]);

      var tks3 = new Highlighter(langObjs.Test).lexer("/* comment */  ==== if huhdufd let fdjijfdf == !!!!! while for let for for for rfrereer ===");
      tks3.should.containDeepOrdered([
        { value: '/* comment */', pos: 0, size: 13, color: '#969896' },
        { value: 'if', pos: 20, size: 2, color: '#FF00FF' },
        { value: 'huhdufd', pos: 23, size: 7, color: '#FF99FF' },
        { value: 'let', pos: 31, size: 3, color: '#FF00FF' },
        { value: 'fdjijfdf', pos: 35, size: 8, color: '#FF99FF' },
        { value: 'while', pos: 53, size: 5, color: '#72EEBB' },
        { value: 'for', pos: 59, size: 3, color: '#72EEBB' },
        { value: 'let', pos: 63, size: 3, color: '#FF00FF' },
        { value: 'for', pos: 67, size: 3, color: '#72EEBB' },
        { value: 'for', pos: 71, size: 3, color: '#72EEBB' },
        { value: 'for', pos: 75, size: 3, color: '#72EEBB' },
        { value: 'rfrereer', pos: 79, size: 8, color: '#FF99FF' }
      ]);

      var tks4 = new Highlighter(langObjs.Test).lexer("///* comment */  ==== if huhdufd let fdjijfdf == !!!!! while for let for for for rfrereer ===");
      tks4.should.containDeepOrdered([{
        value: '///* comment */  ==== if huhdufd let fdjijfdf == !!!!! while for let for for for rfrereer ===',
        pos: 0,
        size: 93,
        color: '#969896'
      }]);      

      done();
    });

    it('should paint the tokens with spans', function(done) {
      var h = new Highlighter(langObjs.Test);
      var code = "/* comment */  ==== if huhdufd let fdjijfdf == !!!!! while for let for for for rfrereer ===";
      var tks = h.lexer(code);
      h.paint(tks, code).should.equal('<span style="color:#969896;">/* comment */</span><span style="color:#FF8272;">  ==== </span><span style="color:#FF00FF;">if</span><span style="color:#FF8272;"> </span><span style="color:#FF99FF;">huhdufd</span><span style="color:#FF8272;"> </span><span style="color:#FF00FF;">let</span><span style="color:#FF8272;"> </span><span style="color:#FF99FF;">fdjijfdf</span><span style="color:#FF8272;"> == !!!!! </span><span style="color:#72EEBB;">while</span><span style="color:#FF8272;"> </span><span style="color:#72EEBB;">for</span><span style="color:#FF8272;"> </span><span style="color:#FF00FF;">let</span><span style="color:#FF8272;"> </span><span style="color:#72EEBB;">for</span><span style="color:#FF8272;"> </span><span style="color:#72EEBB;">for</span><span style="color:#FF8272;"> </span><span style="color:#72EEBB;">for</span><span style="color:#FF8272;"> </span><span style="color:#FF99FF;">rfrereer</span><span style="color:#FF8272;"> ===</span>');

      var h2 = new Highlighter(langObjs.C);
      var code2 = 'void b_debug(int idx, int *cells) {printf("Index Pointer: %d Value at Index Pointer: %d\n",idx,cells[idx]);';
      var tks2 = h2.lexer(code2);
      h2.paint(tks2, code2).should.equal('<span style="color:#a71d5d;">void</span><span style="color:#24292e;"> </span><span style="color:#7b9c0e;">b_debug</span><span style="color:#24292e;">(</span><span style="color:#a71d5d;">int</span><span style="color:#24292e;"> </span><span style="color:#7b9c0e;">idx</span><span style="color:#24292e;">, </span><span style="color:#a71d5d;">int</span><span style="color:#24292e;"> *</span><span style="color:#7b9c0e;">cells</span><span style="color:#24292e;">) {</span><span style="color:#FF1053;">printf</span><span style="color:#24292e;">(</span><span style="color:#8B9EB7;">"Index Pointer: %d Value at Index Pointer: %d\n"</span><span style="color:#24292e;">,</span><span style="color:#7b9c0e;">idx</span><span style="color:#24292e;">,</span><span style="color:#7b9c0e;">cells</span><span style="color:#24292e;">[</span><span style="color:#7b9c0e;">idx</span><span style="color:#24292e;">]);</span>');

      var h3 = new Highlighter(langObjs.Brain);
      var code3 = '++++>>>>{?Blah----:jaca;}#';
      var tks3 = h3.lexer(code3);
      h3.paint(tks3, code3).should.equal('<span style="color:#0086b3;">++++</span><span style="color:#a71d5d;">>>>></span><span style="color:#333333;">{?</span><span style="color:#969896;">Blah</span><span style="color:#0086b3;">----</span><span style="color:#333333;">:</span><span style="color:#969896;">jaca</span><span style="color:#333333;">;}</span><span style="color:#795da3;">#</span>');
      done();
    });

    it('should draw on the table properly', function(done) {
      JSDOM.fromURL("https://github.com/github-aux/linguist-unknown/blob/chrome/examples/C/io.c").then(dom => {

        var o = Object.prototype;
        Object.defineProperty(o, "innerText", {
          get: function() {
            if (this.innerHTML === undefined)
              return "";
            return this.innerHTML;
          },
          set: function(value) {
            this.innerHTML = value;
          },
          configurable: true
        });

        global.document = dom.window.document.documentElement;
        var table = document.getElementsByClassName("blob-wrapper")[0]
                              .getElementsByTagName("table")[0];
        table.should.not.equal(null).and.should.not.equal(undefined);
        var cells = table.querySelectorAll('tbody td');
        for (var i = 0; i < cells.length; i++) {
          var cell = cells[i];
          if (cell.id.indexOf("LC") !== -1) {
            console.log(cell.innerText);
            cell.innerText.should.not.containEql('<span style="color'); 
          }
        }

        new Highlighter(langObjs.C).draw(table);

        for (var i = 0; i < cells.length; i++) {
          var cell = cells[i];
          if (cell.id.indexOf("LC") !== -1) {
            cell.innerText.should.containEql('<span style="color');
          }
        }

      
        done();
      });
    });
  });
});

