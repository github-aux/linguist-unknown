var LinguistHighlighter = (function() {
  'use strict';

  const GITHUB_DEFAULT_COLOR = '#24292e';
  const DEFAULT_COLOR_KEY    = 'default.color';

  // helper in checking nested properties with keypath
  var objPrototype = Object.prototype;
  Object.defineProperty(objPrototype, "valueForKeyPath", {
    get : function(key) {
      return function(key) {
        return key.split(".").reduce(function(o, x) {
          return (o === undefined || typeof o === undefined || o === null) ? o : o[x];
        }, this);
    }},
    configurable: false
  });

  var Token = (function() {
    return function(value, pos, size, color) {
      this.value = value;
      this.pos = pos;
      this.size = size;
      this.color = color;
    };
  }());

  var Highlighter = (function() {
    var highlighter = function(langObj) {
      this.langObj = langObj;
      if (this.langObj && this.langObj.valueForKeyPath(DEFAULT_COLOR_KEY) === undefined) {
        // GitHub default color
        this.langObj.default = { color : GITHUB_DEFAULT_COLOR };
      }

      // it will be used for comments or any other multiline lexeme
      this.multilineObj = {
        active: false,
        begin_token: "",
        end_token: "",
        color: ""
      };
    };

    highlighter.prototype.draw = function(table) {
      var cells = table.querySelectorAll('tbody td');
      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        if (cell.id.indexOf("LC") !== -1) {
          var tokens = this.lexer(cell.innerText); // ignore GH spans
          cell.innerHTML = this.paint(tokens, cell.innerText);
        }
      }
    };

    highlighter.prototype.paint = function(tokens, code) {
      if (tokens.length === 0) {
        return this.getSpan(code, this.langObj.default.color);
      }

      var new_code = "";
      var next_pos = 0;
      var token_idx = 0;

      while (next_pos < code.length) {
        if (token_idx < tokens.length &&
          next_pos < tokens[token_idx].pos) {
          new_code += this.getSpan(code.substring(next_pos,
            tokens[token_idx].pos), this.langObj.default.color);
          next_pos = tokens[token_idx].pos;
        } else if(token_idx === tokens.length) {
          new_code += this.getSpan(code.substring(next_pos,
            code.length), this.langObj.default.color);
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
            if(token_color === this.langObj.default.color &&
              token_idx < tokens.length &&
              next_pos < tokens[token_idx].pos) {
              new_code += code.substring(next_pos,
                tokens[token_idx].pos);
              next_pos = tokens[token_idx].pos;
              neighborDefault = true;
            } else {
              neighborDefault = false;
            }

            // check if neighbor has same color
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

            // finding extra spaces in order to concatenate them to the color
            // once they do not interfer in the token itself
            while(code[next_pos] === " ") {
              new_code += " ";
              next_pos++;
            }
          }

          new_code += this.closeSpan();
        }
      }

      return new_code;
    };

    highlighter.prototype.openSpan = function(color) {
      return '<span style="color:' + color + ';">';
    };

    highlighter.prototype.closeSpan = function() {
      return '</span>';
    };

    highlighter.prototype.getSpan = function (value, color) {
      return this.openSpan(color) + value + this.closeSpan();
    };

    highlighter.prototype.isId = function(char, beginningId) {
      return (char >= 'a' && char <= 'z')
          || (char >= 'A' && char <= 'Z')
          ||  char === '_'
          || (!beginningId && this.isNumber(char));
    };

    highlighter.prototype.isNumber = function(char) {
      return char >= '0' && char <= '9';
    };

    highlighter.prototype.isLiteralString = function(char) {
      return char === "\"" || char === "'";
    };

    highlighter.prototype.isMultiline = function(code, idx) {
      var begin_multiline_comment = this.langObj.valueForKeyPath('comment.begin_multiline');
      var end_multiline_comment = this.langObj.valueForKeyPath('comment.end_multiline');

      var color_multiline = this.langObj.default.color;

      if (begin_multiline_comment !== undefined &&
          this.startsWith(begin_multiline_comment, code, idx)) {
        if (this.langObj.valueForKeyPath('comment.color') !== undefined) {
          color_multiline = this.langObj.comment.color;
        }

        if (end_multiline_comment === undefined) {
          end_multiline_comment = "";
        }

        this.multilineObj = {
          active: true,
          color: color_multiline,
          begin_token: begin_multiline_comment,
          end_token: end_multiline_comment
        };

        return true;
      }

      var still_looking_for = true;
      var highlighter = this;
      // check if it is operator or match any multiline definition
      this.langObj.group.every(function(obj){
        if (obj.multiline !== undefined) {
          if (obj.color !== undefined) {
            color_multiline = obj.color;
          }

          obj.multiline.every(function(multiline_obj){
            var begin_multiline = multiline_obj.valueForKeyPath('begin');
            var end_multiline = multiline_obj.valueForKeyPath('end');

            if (begin_multiline === undefined) {
              return true;
            }

            if (highlighter.startsWith(begin_multiline, code, idx)) {
              if (end_multiline === undefined) {
                end_multiline = "";
              }

              highlighter.multilineObj = {
                active: true,
                color: color_multiline,
                begin_token: begin_multiline,
                end_token: end_multiline
              };

              still_looking_for = false;
              return false;
            }

            return still_looking_for;
          });
        }

        return still_looking_for;
      });

      return !still_looking_for;
    };

    highlighter.prototype.startsWith = function(lexeme, code, idx) {
      return lexeme !== undefined &&
        code.substring(idx, code.length).startsWith(lexeme);
    };

    highlighter.prototype.matchRegex = function(regex, modifier, code, idx) {
      if (regex === undefined) {
        return null;
      }

      if (!regex.startsWith("^")) {
        regex = "^" + regex;
      }

      if (modifier === undefined) {
        modifier = "";
      }

      var regex_obj = new RegExp(regex, modifier);
      return code.substring(idx, code.length).match(regex_obj);
    };

    highlighter.prototype.getId = function(code, idx, callback) {
      var pos_id = idx;
      var id = code[idx];
      idx++;
      while(idx < code.length && this.isId(code[idx], false)) {
        id += code[idx];
        idx++;
      }

      callback(id, pos_id, this.langObj);
    };

    highlighter.prototype.getNumber = function(code, idx, callback) {
      var pos_id = idx;
      var number = code[idx];
      idx++;
      var next_int = this.getNextInt(code, idx);
      number += next_int.value;
      idx = next_int.idx;

      if (idx + 1 < code.length
       && code[idx] === '.'
       && this.isNumber(code[idx+1])) {
        number += code[idx];
        number += code[idx+1];
        idx += 2;
        next_int = this.getNextInt(code, idx);
        number += next_int.value;
        idx = next_int.idx;
      }

      if (idx < code.length && code[idx] === 'e') {
        if (idx + 1 < code.length && this.isNumber(code[idx+1])) {
          number += code[idx];
          number += code[idx+1];
          idx += 2;
          next_int = this.getNextInt(code, idx);
          number += next_int.value;
          idx = next_int.idx;
        } else if (idx + 2 < code.length
                   && (code[idx+1] === '+' || code[idx+1] === '-')
                   && this.isNumber(code[idx+2])) {
         number += code[idx];
         number += code[idx+1];
         number += code[idx+2];
         idx += 3;
         next_int = this.getNextInt(code, idx);
         number += next_int.value;
         idx = next_int.idx;
        }
      }

      callback(number, pos_id, this.langObj);
    };

    highlighter.prototype.getNextInt = function(code, idx) {
      var number = "";
      while (idx < code.length && this.isNumber(code[idx])) {
        number += code[idx];
        idx++;
      }

      return { value: number, idx: idx };
    };

    highlighter.prototype.getLiteralString = function(code, idx, callback) {
      var pos_str = idx;
      var str = code[idx++];
      while (idx < code.length && code[idx] !== code[pos_str]) {
        str += code[idx++];
      }

      if (!code[idx]) {
        return false;
      }

      str += code[idx];

      callback(str, pos_str, this.langObj);
    };

    highlighter.prototype.getMultiline = function(obj, code, idx, callback) {
        var pos = idx;
        idx += obj.begin_token.length;
        var still_looking_for = true;
        var lexeme = code.substring(pos, idx);
        while(idx < code.length &&
              !code.substring(idx, code.length).startsWith(obj.end_token)) {
            lexeme += code[idx];
            idx++;
        }

        if (idx < code.length) {
          lexeme += obj.end_token;
          still_looking_for = false;
        }

        callback(lexeme, pos, still_looking_for, this);
    };

    highlighter.prototype.lexer = function(code) {
      var single_line_comment = this.langObj.valueForKeyPath('comment.single_line');

      var tokens = Array();
      var i = 0;
      while (i < code.length) {
        if (code[i] === ' ' || code[i] === '\t' || code[i] === '\n'){
          i++;
          continue;
        }
        else if (this.multilineObj.active || this.isMultiline(code, i)) {
          this.multilineObj.active = true;
          this.getMultiline(
            this.multilineObj,
            code,
            i,
            function(mult, pos, lookingFor, highlighter) {
              highlighter.multilineObj.active = lookingFor;
              // reset begin token
              highlighter.multilineObj.begin_token = "";
              var color = highlighter.multilineObj.color;

              tokens.push(new Token(mult,
                pos, mult.length, color));
              i += mult.length;
            }
          );
        } else if (this.startsWith(single_line_comment, code, i)) {
          var comment = code.substring(i, code.length);
          var color_comment = this.langObj.default.color;
          if (this.langObj.valueForKeyPath('comment.color') !== undefined) {
            color_comment = this.langObj.comment.color;
          }

          tokens.push(new Token(comment, i, comment.length, color_comment));
          i += comment.length;
        } else if (this.isId(code[i], true)) {
          this.getId(code, i, function(id, pos, langObj){
            var color_id = langObj.default.color;
            var not_found = true;
            langObj.group.every(function(keys) {
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

            if (not_found && langObj.valueForKeyPath('identifier.color') !== undefined) {
              color_id = langObj.identifier.color;
            }

            tokens.push(new Token(id, pos, id.length, color_id));
            i += id.length;
          });
        } else if (this.isLiteralString(code[i])
          && this.getLiteralString(code, i, function(str, pos, langObj){
            var color_string = langObj.default.color;
            if (langObj.valueForKeyPath('string.color') !== undefined) {
              color_string = langObj.string.color;
            }

            tokens.push(new Token(str, pos, str.length, color_string));
            i += str.length;
          })){
          /*do nothing*/
        } else if (this.isNumber(code[i])) {
          this.getNumber(code, i, function(number, pos, langObj){
            var color_number = langObj.default.color;
            if (langObj.valueForKeyPath('number.color') !== undefined) {
              color_number = langObj.number.color;
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
          this.langObj.group.every(function(obj){
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
                  i
                );

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

          // we don't have any grammar or group for this object,
          // so we ignore it and go to the next one
          if (still_looking_for) {
            i++;
          }
        }
      }

      return tokens;
    };

    return highlighter;
  }());

  return {
    Highlighter: Highlighter,
    Token: Token
  };
}());

exports.LinguistHighlighter = LinguistHighlighter;
