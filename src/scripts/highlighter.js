var LinguistHighlighter = (function() {

  var Token = (function() {
      var Token = function(value, pos, size, color) {
          this.value = value;
          this.pos = pos;
          this.size = size;
          this.color = color;
      };

      return Token;
  }());

  var Highlighter = (function() {
      var Highlighter = function(langObj) {
          this.langObj = langObj;
          this.isMultilineComment = false;
      };

      Highlighter.prototype.draw = function() {
          var table = document.getElementsByClassName("blob-wrapper")[0]
                              .getElementsByTagName("table")[0];
          var cells = table.querySelectorAll('tbody td');
          for (var i = 0; i < cells.length; i++) {
              var cell = cells[i];
              if (cell.id.indexOf("LC") !== -1) {
                  var tokens = this.lexer(cell.innerHTML);
                  cell.innerHTML = this.paint(tokens, cell.innerHTML);
              }
          }
      };

      Highlighter.prototype.paint = function(tokens, code) {
          if (tokens.length === 0) {
              return this.getSpan(code, this.langObj.default_color);
          }

          var new_code = "";
          var next_pos = 0;
          var token_idx = 0;

          while (next_pos < code.length) {
              if (token_idx < tokens.length &&
                  next_pos < tokens[token_idx].pos) {
                  new_code += this.getSpan(code.substring(next_pos,
                      tokens[token_idx].pos), this.langObj.default_color);
                  next_pos = tokens[token_idx].pos;
              } else if (token_idx === tokens.length) {
                  new_code += this.getSpan(code.substring(next_pos,
                      code.length), this.langObj.default_color);
                  next_pos = code.length;
              } else {
                  var token_color = tokens[token_idx].color
                  new_code += this.openSpan(token_color);
                  new_code += tokens[token_idx].value;
                  next_pos += tokens[token_idx].value.length;
                  token_idx++;

                  var neighborDefault = true;
                  var neighborSameColor = true;

                  while(neighborDefault || neighborSameColor) {
                      if(token_color === this.langObj.default_color &&
                          token_idx < tokens.length &&
                          next_pos < tokens[token_idx].pos) {
                          new_code += code.substring(next_pos,
                                       tokens[token_idx].pos);
                          next_pos = tokens[token_idx].pos;
                          neighborDefault = true;
                      } else {
                          neighborDefault = false;
                      }

                      if(token_idx < tokens.length &&
                          next_pos === tokens[token_idx].pos &&
                          tokens[token_idx].color === token_color) {
                          new_code += tokens[token_idx].value;
                          next_pos += tokens[token_idx].value.length;
                          token_idx++;
                          neighborSameColor = true;
                      } else {
                          neighborSameColor = false;
                      }
                  }

                  new_code += this.closeSpan();
              }
          }

          return new_code;
      };

      Highlighter.prototype.openSpan = function(color) {
          return '<span style="color:' + color + ';">';
      };

      Highlighter.prototype.closeSpan = function () {
          return '</span>';
      };

      Highlighter.prototype.getSpan = function (value, color) {
          return this.openSpan(color) + value + this.closeSpan();
      };

      Highlighter.prototype.isId = function(char, beginningId) {
          return (char >= 'a' && char <= 'z') ||
                 (char >= 'A' && char <= 'Z') ||
                 (char === '_') ||
                 (!beginningId && this.isNumber(char));
      };

      Highlighter.prototype.isNumber = function(char) {
          return (char >= '0' && char <= '9');
      };

      Highlighter.prototype.isLiteralString = function(char) {
          return char === "\"" || char === "'";
      };

      Highlighter.prototype.startsWith = function(lexeme, code, idx) {
          return lexeme !== undefined &&
                 code.substring(idx, code.length).startsWith(lexeme);
      };

      Highlighter.prototype.matchRegex = function(regex, modifier, code, idx) {
          if (!regex.startsWith("^")) {
            regex = "^" + regex;
          }

          if (modifier === undefined) {
              modifier = "";
          }

          var regex_obj = new RegExp(regex, modifier);
          return code.substring(idx, code.length).match(regex_obj);
      };

      Highlighter.prototype.getId = function(code, idx, callback) {
          var pos_id = idx;
          var id = code[idx];
          idx++;
          while(idx < code.length && this.isId(code[idx], false)) {
              id += code[idx];
              idx++;
          }

          callback(id, pos_id, this.langObj);
      };

      Highlighter.prototype.getNumber = function(code, idx, callback) {
          var number = code.substring(idx, code.length)
                           .match(new RegExp("^[-+]?[0-9]*\.?[0-9]+"))[0];
          callback(number, idx, this.langObj);
      };

      Highlighter.prototype.getLiteralString = function(code, idx, callback) {
          var pos_str = idx;
          var str = code[idx];
          do {
              idx++;
              str += code[idx];
          } while (idx < code.length && code[idx] !== code[pos_str]);

          callback(str, pos_str, this.langObj);
      };

      Highlighter.prototype.getMultilineComment = function(endLexeme, code, idx, callback) {
          var pos_comment = idx;
          var still_looking_for = true;
          var comment = "";
          while(idx < code.length &&
                !code.substring(idx, code.length).startsWith(endLexeme)) {
              comment += code[idx];
              idx++;
          }

          if (idx < code.length) {
            comment += endLexeme;
            still_looking_for = false;
          }

          callback(comment, pos_comment, still_looking_for, this);
      };

      Highlighter.prototype.lexer = function(code) {
          var tokens = Array();
          var i = 0;
          while (i < code.length) {
              if (code[i] === ' ' || code[i] === '\t' || code[i] === '\n'){
                  i++;
                  continue;
              }
              else if (this.isMultilineComment ||
                  this.startsWith(this.langObj.begin_multiline_comment,
                      code,
                      i)) {
                  this.isMultilineComment = true;
                  this.getMultilineComment(
                      this.langObj.end_multiline_comment,
                      code,
                      i,
                      function(mult_comment, pos, lookingFor, highlighter){
                          highlighter.isMultilineComment = lookingFor;
                          var color_comment = highlighter.langObj.default_color;
                          if (highlighter.langObj.comment_color !== undefined) {
                              color_comment = highlighter.langObj.comment_color;
                          }

                          tokens.push(new Token(mult_comment,
                              pos, mult_comment.length, color_comment));
                          i += mult_comment.length;
                  });
              } else if (this.startsWith(this.langObj.single_line_comment,
                  code,
                  i)) {
                  var comment = code.substring(i, code.length);
                  var color_comment = this.langObj.default_color;
                  if (this.langObj.comment_color !== undefined) {
                      color_comment = this.langObj.comment_color;
                  }

                  tokens.push(new Token(comment, i, comment.length, color_comment));
                  i += comment.length;
              } else if (this.isId(code[i], true)) {
                  this.getId(code, i, function(id, pos, langObj){
                      var color_id = langObj.default_color;
                      var not_found = true;
                      langObj.grammar.every(function(keys) {
                          if (keys.keywords !== undefined) {
                              keys.keywords.every(function(keyObj) {
                                  if (keyObj.valueOf() === id.valueOf()) {
                                      color_id = keys.color;
                                      not_found = false;
                                      return false;
                                  }

                                  return true;
                              });
                          }

                          // false stops the "loop"
                          return not_found;
                      });

                      if (not_found && langObj.id_color !== undefined) {
                          color_id = langObj.id_color;
                      }

                      tokens.push(new Token(id, pos, id.length, color_id));
                      i += id.length;
                  });
              } else if (this.isLiteralString(code[i])){
                  this.getLiteralString(code, i, function(str, pos, langObj){
                      var color_string = langObj.default_color;
                      if (langObj.string_color !== undefined) {
                          color_string = langObj.string_color;
                      }

                      tokens.push(new Token(str, pos, str.length, color_string));
                      i += str.length;
                  });
              } else if (this.isNumber(code[i])) {
                  this.getNumber(code, i, function(number, pos, langObj){
                      var color_number = langObj.default_color;
                      if (langObj.number_color !== undefined) {
                          color_number = langObj.number_color;
                      }

                      tokens.push(new Token(number,
                          pos,
                          number.length,
                          color_number));
                      i += number.length;
                  });
              } else {
                  var still_looking_for = true;
                  var highlighter = this;
                  // check if it is operator or match any regex
                  this.langObj.grammar.every(function(obj){
                      if (obj.operators !== undefined) {
                          obj.operators.every(function(operator){
                              if (highlighter.startsWith(operator,
                                  code,
                                  i)) {
                                  tokens.push(new Token(operator,
                                      i,
                                      operator.length,
                                      obj.color));
                                  i += operator.length;
                                  still_looking_for = false;
                                  return false;
                              }

                              return true;
                          });
                      }

                      if (still_looking_for && obj.regexes !== undefined) {
                          obj.regexes.every(function(regexObj){
                            var matched_regex = highlighter.matchRegex(
                                regexObj.regex,
                                regexObj.modifier,
                                code,
                                i);
                            if (matched_regex !== null) {
                                tokens.push(new Token(matched_regex[0],
                                    i,
                                    matched_regex[0].length,
                                    obj.color));
                                i += matched_regex[0].length;
                                still_looking_for = false;
                                return false;
                            }

                            return true;
                          });
                      }

                      return still_looking_for;
                  });

                  // we don't have any grammar for this object,
                  // so we ignore it and go to the next one
                  if (still_looking_for) {
                    i++;
                  }
              }
          }

          return tokens;
      };

      return Highlighter;
  }());

  return {
    Highlighter: Highlighter
  };
}());
