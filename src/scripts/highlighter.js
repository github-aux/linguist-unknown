
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

    this.lexer = function(code) {
        var id = "";
        var i = 0;
        while (i < code.length) {
            /*if (this.isLetter(code[i])) {
            } else if (this.isNumber) {
            } else {*/
                this.langObj.grammar.every(function(obj){
                    if (obj.operators !== undefined) {
                        var found = false;
                        obj.operators.every(function(objOperator){
                            if (code.substring(i, code.length).startsWith(objOperator.operator)) {
                                var begin_color = '<span style="color:'+ obj.color+ ';">';
                                code = [code.slice(0, i), begin_color, code.slice(i)].join('');
                                i += objOperator.operator.length + begin_color.length;
                                var end_color = "</span>";
                                code = [code.slice(0, i), end_color, code.slice(i)].join('');
                                i += end_color.length;
                                i--; // that will be incremented at the end
                                found = true;
                                // break the callback
                                return false;
                            }

                            return true;
                        });

                        if (found) {
                            // break the parent callback
                            return false;
                        }
                    }

                    return true;
                });
           /* } */
           i++;
        }

        return code;
    };
}

