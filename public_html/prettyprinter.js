var PrettyPrint = {

    /**
     *
     * @param string code  the javascript code to colorify (mandatory)
     * @param number spaces the spaces to remove at the beginning of each line
     * @param object color {comment, quote, keyword, number}
     * @param string style the style of the DIV including the code
     * @returns string return the colored html
     */
    toHtml: function(code,
            spaces = 0,
            color  = {
                comment: 'green',
                quote: 'red',
                number: 'blue',
                keyword: 'darkviolet'
            },
            style = "font-family: monospace; line-height: 1.1em") {
        if (code === undefined) {
            return;
        }
        var keywords = this.getKeywords();

        var result = "<DIV style='" + style + "'>\n";
        var quote = false;
        var doublequote = false;
        var start = 0;
        var comment = false;
        var mlComment = false;

        var l = code.length;
        for (var i=0; i<l; i++) {
            var c = code[i];

            if (!mlComment && c == "/" && i<l && code[i+1] == "*") {
                mlComment = true;
                start = i;
                i++;

            } else if (mlComment && c == "*" && i<l && code[i+1] == "/") {
                result += this.span(color.comment) +
                        code.slice(start, i+2) + "</span>";
                mlComment = false;
                start = i + 2;
                i++;

            } else if (!comment && !mlComment && c == "/" && i<l && code[i+1] == "/") {
                    comment = true;
                    start = i;
                    i++;

            } else if (!doublequote && !comment && !mlComment && c == "'") {
                if (quote) {
                    if (i - start > 0) {
                        result += this.span(color.quote) +
                                code.slice(start, i+1) + "</span>";
                    }
                    start = i + 1;
                } else {
                    start = i;
                }
                quote = !quote;

            } else if (!quote && !comment && !mlComment && c == '"') {
                if (doublequote) {
                    if (i - start > 0) {
                        result += this.span(color.quote) +
                                code.slice(start, i+1) + "</span>";
                    }
                    start = i + 1;
                } else {
                    start = i;
                }
                doublequote = !doublequote;

            } else if (c == "\n") {
                if (comment) {
                    result += this.span(color.comment) + code.slice(start, i) +
                            "</span>";
                    comment = false;

                } else if (mlComment) {
                    result += this.span(color.comment) + code.slice(start, i) +
                            "</span>";

                } else if (i - start > 0) {
                    result += this.markWord(code.slice(start, i), keywords,
                            color.keyword);

                }
                result += "<br />\n";
                start = i + 1;
                let s = true;
                for (let j=0; j<spaces; j++) {
                    if (code[i+1+j] != " ") {
                        s = false;
                        break;
                    }
                }
                if (s) {
                    i += spaces;
                    start = i + 1;
                }

            } else if (!quote && !doublequote && !comment && !mlComment) {
                if ("{}=+-/*~!@#$%^&()[]\\;:<>?.,`".indexOf(c) != -1) {
                    if (i - start > 0) {
                        result += this.markWord(code.slice(start, i),
                                keywords, color.keyword);
                    }
                    result += c.bold();
                    start = i + 1;

                } else if ("0123456789".indexOf(c) != -1) {
                    if (i + 1 - start > 0) {
                        let w = code.slice(start, i+1);
                        if (/^\d+$/.test(w)) {
                            result += this.span(color.number) + w + "</span>";
                        } else {
                            result += this.markWord(code.slice(start, i),
                                    keywords, color.keyword);
                        }
                    }
                    start = i + 1;

                } else if (c == " ") {
                    if (i - start > 0) {
                        result += this.markWord(
                                code.slice(start, i), keywords, color.keyword);
                    }
                    result += "&nbsp;";
                    start = i + 1;
                }
            }
        }
        result += code.slice(start, i) + "\n</DIV>\n"
        return result;
    },

    span: function(color) {
        return "<span style='color: " + color + ";'>";
    },

    markWord: function(word, keywords, color) {
        if (keywords.indexOf(word) > -1) {
            return this.span(color) + word + "</span>";
        }
        return word;
    },

    getKeywords: function() {
        return `abstract arguments await boolean
        break byte case catch
        char class const continue
        debugger default delete do
        double else enum eval
        export extends false final
        finally float for function
        goto if implements import
        in instanceof int interface
        let long native new
        null package private protected
        public return short static
        super switch synchronized this
        throw throws transient true
        try typeof var void
        volatile while with yield`
                .toString()
                .replace(/\s+/g," ")
                .split(" ");
    }


};

