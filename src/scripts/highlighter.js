
function Token(value, pos, size, color) {
    this.value = value;
    this.pos = pos;
    this.size = size;
    this.color = color;
}

function Highlighter(langObj) {
    this.langObj = langObj;
    this.isMultilineComment = false;

    this.draw = function() {
        var table = document.getElementsByClassName("blob-wrapper")[0].getElementsByTagName("table")[0];
        var cells = table.querySelectorAll('tbody td');
        for (var i = 0, cell; cell = cells[i]; i++) {
            if (cell.id.indexOf("LC") !== -1) {
                var tokens = this.lexer(cell.innerHTML);
                console.log(tokens);
            }
        }
    };

    this.isId = function(char, beginningId) {
        return (char >= 'a' && char <= 'z') ||
               (char >= 'A' && char <= 'Z') ||
               (char == '_') ||
               (!beginningId && this.isNumber(char));
    };

    this.isNumber = function(char) {
        return (char >= '0' && char <= '9') || char == '.';
    };

    this.isLiteralString = function(char) {
        return char == "\"" || char == "'";
    };

    this.startsWith = function(lexeme, code, idx) {
        return lexeme !== undefined &&
               code.substring(idx, code.length).startsWith(lexeme);
    };

    this.getId = function(code, idx, callback) {
        var pos_id = idx;
        var id = code[idx];
        idx++;
        while(idx < code.length && this.isId(code[idx], false)) {
            id += code[idx];
            idx++;
        }

        callback(id, pos_id, this.langObj);
    };

    this.getNumber = function(code, idx, callback) {
        var number = code.substring(idx, code.length)
                         .match(new RegExp("[-+]?[0-9]*\.?[0-9]"))[0];
        callback(number, idx, this.langObj);
    };

    this.getLiteralString = function(code, idx, callback) {
        var pos_str = idx;
        var str = code[idx];
        do {
            idx++;
            str += code[idx];
        } while (idx < code.length && code[idx] != code[pos_str]);

        callback(str, pos_str, this.langObj);
    };

    this.getMultilineComment = function(endLexeme, code, idx, callback) {
        var pos_comment = idx;
        var stillLookingFor = true;
        var comment = "";
        while(idx < code.length &&
              !code.substring(idx, code.length).startsWith(endLexeme)) {
            comment += code[idx];
            idx++;
        }

        if (idx < code.length) {
          comment += endLexeme;
          stillLookingFor = false;
        }

        callback(comment, pos_comment, stillLookingFor, this);
    };

    this.lexer = function(code) {
        var tokens = Array();
        var i = 0;
        while (i < code.length) {
            if (this.isMultilineComment ||
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
                    langObj.grammar.every(function(keys) {
                        var not_found = true;
                        if (keys.keywords !== undefined) {
                            keys.keywords.every(function(keyObj) {
                                if (keyObj.keyword.valueOf() == id.valueOf()) {
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
              // we don't have any grammar for this object,
              // so we ignore it and go to the next one
              i++;
            }
        }

        return tokens;
    };
}

// this.langObj.grammar.every(function(obj){
//     if (obj.operators !== undefined) {
//         var found = false;
//         obj.operators.every(function(objOperator){
//             if (code.substring(i, code.length).startsWith(objOperator.operator)) {
//                 var begin_color = '<span style="color:'+ obj.color+ ';">';
//                 code = [code.slice(0, i), begin_color, code.slice(i)].join('');
//                 i += objOperator.operator.length + begin_color.length;
//                 var end_color = "</span>";
//                 code = [code.slice(0, i), end_color, code.slice(i)].join('');
//                 i += end_color.length;
//                 i--; // that will be incremented at the end
//                 found = true;
//                 // break the callback
//                 return false;
//             }
//
//             return true;
//         });
//
//         if (found) {
//             // break the parent callback
//             return false;
//         }
//     }
//
//     return true;
// });
