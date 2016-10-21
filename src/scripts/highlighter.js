
function Token(value, pos, size, color) {
    this.value = value;
    this.pos = pos;
    this.size = size;
    this.color = color;
}

function Highlighter(langObj) {
    this.langObj = langObj;

    this.draw = function() {
        var table = document.getElementsByClassName("blob-wrapper")[0].getElementsByTagName("table")[0];
        var cells = table.querySelectorAll('tbody td');
        for (var i = 0, cell; cell = cells[i]; i++) {
            if (cell.id.indexOf("LC") !== -1) {
                cell.innerHTML = this.lexer(cell.innerHTML);
            }
        }
    };

    this.isLetter = function(char) {
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
    };

    this.isNumber = function(char) {
        return (char >= '0' && char <= '9') || char == '.';
    };

    this.isLiteralString = function(char) {
        return char == "\"" || char == "'";
    };

    this.getLiteralString = function(code, idx, callback) {
        var pos_str = idx;
        var str = code[idx];
        do {
            idx++;
            str += code[idx];
        } while(idx < code.length && !code[pos_str]);

        callback(str, pos_str);
    };

    this.lexer = function(code) {
        var tokens = Array();
        var i = 0;
        while (i < code.length) {
            if (this.isLetter(code[i])) {
                //var id
            } else if (this.isLiteralString(code[i])){
                this.getLiteralString(code, i, function(str, pos){
                    var color_string = this.langObj.default_color;
                    if (this.langObj.string_color !== undefined) {
                        color_string = this.langObj.string_color;
                    }
                    
                    tokens.push(new Token(str, pos_str, str.length, string_color));
                    i += str.length;
                    i--;
                });
            } else if (this.isNumber(code[i])) {
                var number = code.substring(i, code.length)
                                 .match(new RegExp("[-+]?[0-9]*\.?[0-9]"))[0];
                var colorNumber = this.langObj.default_color;
                if (this.langObj.number_color !== undefined) {
                    colorNumber = this.langObj.number_color;
                }

                tokens.push(new Token(number, i, number.length, colorNumber));
                i += number.length;
                i--;
            } else {

            }
            i++;
        }

        return code;
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
