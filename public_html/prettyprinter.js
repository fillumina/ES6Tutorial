/**
 * PrettyPrint by Francesco Illuminati fillumina_at_gmail.com
 *
 * @type type
 */

var PrettyPrint = {

    /**
     * Searches for javascripts in the page and add their codes in a div
     * just before the SCRIPT tag (or into the passed elem if they are
     * defined in the HEAD).
     *
     * @param elemForExternalScripts elemForExternalScripts element to write external js into
     * @param string titleStyle css style of the src
     * @param string divStyle   css style of the div containing the code
     * @returns undefined
     */
    showScripts(elemForExternalScripts,
            titleStyle = "font-size: 14pt",
            divStyle = "border: black solid 1px") {
        var scripts = document.getElementsByTagName("SCRIPT");
        for (let elem of scripts) {
            this.displayScript(elem, elemForExternalScripts, titleStyle, divStyle);
        }
    },

    /**
     * Reads the javascript contained in the specified SCRIPT tag
     * (either directly or linked by SRC=), formats it and writes it
     * in the innerHTML of the given destination.
     *
     * @param element scriptTag
     * @param element destinationElement
     * @param string titleStyle
     * @param string divStyle
     * @returns undefined
     */
    displayScript(scriptElement, destinationElement,
            titleStyle = "font-size: 14pt",
            divStyle = "border: black solid 1px") {
        let code = null;
        if (scriptElement['src'] !== "") {
            let src = scriptElement['src'];
            if (scriptElement.parentNode === document.head) {
                scriptElement = destinationElement;
                if (scriptElement === undefined) {
                    return; // don't show head script
                }
            }
            this.addDivWithCodeBeforeElement(scriptElement,
                "<div style='" + titleStyle + "'>" + src + "</div>");
            code = this.load(src);
        } else {
            code = scriptElement.innerHTML;

        }
        this.addDivWithCodeBeforeElement(
                scriptElement, this.formatCode(code), divStyle);
    },

    /**
     * Gets a script linked by the URL and display into the given element.
     *
     * @param {type} url
     * @param {type} destinationElement
     * @param {type} titleStyle
     * @param {type} divStyle
     * @returns {undefined}
     */
    displayScriptFromUrl(url, destinationElement,
            titleStyle = "font-size: 14pt",
            divStyle = "border: black solid 1px") {
        let code = null;
        if (url !== undefined) {
            this.addDivWithCodeBeforeElement(destinationElement,
                "<div style='" + titleStyle + "'>" +  + "</div>");
            code = this.load(url);
        }
        this.addDivWithCodeBeforeElement(
                destinationElement, this.formatCode(code), divStyle);
    },

    /**
     * Return a (eventually) formatted colorized HTML version of the code.
     *
     * @param string code the code to prettify
     * @returns string the pretty html version of the code
     */
    formatCode(code) {
        if (code !== "") {
            let pretty = null;
            if (this.isMinified(code)) {
                pretty = this.prettyPrint(code);
            } else {
                pretty = code;
            }
            return this.colorize(pretty);
        }
    },

    encodeEntities(rawString) {
        var result = rawString.replace(/&/g, "&amp;");
        result = result.replace(/</g, "&lt;");
        return result;
    },

    isMinified(code) {
        if (typeof code === "string") {
            return this.lineFeedAfterSemicolonCounter(code) / code.length < 0.01;
        }
        return false;
    },

    /**
     * Synchronously reads and returns a text file.
     *
     * @param string url
     * @returns string the content of the passed URL
     */
    load(url) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, false);
        xmlHttp.send();
        return xmlHttp.responseText;
    },

    addDivWithCodeBeforeElement(element, code, style="") {
        var div = document.createElement("DIV");
        div.style = style;
        div.innerHTML = code;
        element.parentNode.insertBefore(div, element);
    },

    addTitleBeforeElement(element, title) {
        var div = document.createElement("DIV");
        div.innerHTML = title;
        element.parentNode.insertBefore(div, element);
    },

    /**
     * Pretty print a minified or unformatted Javascript text.
     *
     * @param string code the javascript code to format
     * @param number tab number of spaces in a tab (default 4)
     * @returns string the formatted code (no HTML)
     */
    prettyPrint: function(code, tab=4) {
        if (code === undefined) {
            return;
        }
        let l = code.length;

        let quote = false;
        let dblquote = false;
        let mlquote = false;
        let comment = false;
        let mlcomment = false;
        let property = false;
        let linestart = true;

        let result = "";
        let indent = 0;
        for (let i=0; i<l; i++) {
            let c = code[i];

            let reserved = quote || dblquote || mlquote || comment || mlcomment;

            switch (c) {
                case ":":
                    linestart = false;
                    if (!reserved) {
                        property = true;
                    }
                    result += c;
                    break;

                case "'":
                    linestart = false;
                    if (!dblquote && !mlquote && !comment && !mlcomment) {
                        quote = !quote;
                    }
                    result += c;
                    break;

                case '"':
                    linestart = false;
                    if (!quote && !mlquote && !comment && !mlcomment) {
                        dblquote = !dblquote;
                    }
                    result += c;
                    break;

                case "`":
                    linestart = false;
                    if (!dblquote && !quote && !comment && !mlcomment) {
                        mlquote = !mlquote;
                    }
                    result += c;
                    break;


                case "/":
                    linestart = false;
                    if (!quote && !dblquote && !mlquote) {
                        result += c;
                        let next = code[i+1];
                        if (!comment && !mlcomment && next == "/") {
                            comment = true;
                        } else if (!comment && !mlcomment && next == "*") {
                            mlcomment = true;
                        } else if (mlcomment && i>1 && code[i-1] == "*") {
                            mlcomment = false;
                            if (next == "\n") {
                                result += this.newline(indent, tab);
                            }
                        }
                    } else {
                        result += c;
                    }
                    break;


                case "{":
                    if (!reserved) {
                        indent++;
                        result += "{" + this.newline(indent, tab);
                    }
                    linestart = true;
                    break;

                case "}":
                    if (!reserved) {
                        indent--;
                        result += this.newline(indent, tab);
                        result += c;
                        if (i+1<l) {
                            let next = code[i+1];
                            switch (next) {
                                case ",":
                                case ")":
                                case ";":
                                    result += next;
                                    i++;
                                    break;
                            }
                        }
                        if (indent === 0) {
                            result += "\n";
                        }
                        result += this.newline(indent, tab);
                    }
                    linestart = true;
                    break;

                case ",":
                    if (!property) {
                        result += c;
                        break;
                    }
                case ";":
                    result += c;
                    if (!reserved) {
                        result += this.newline(indent, tab);
                        linestart = true;
                    }
                    break;

                case " ":
                    if (!linestart) {
                        result += c;
                    }
                    break;

                case "\n":
                    property = false;
                    linestart = true;
                    if (reserved) {
                        result += this.newline(indent, tab);
                    }
                    if (comment) {
                        comment = false;
                    }
                    break;

                case "<":
                    result += "&lt;";
                    break;

                case ">":
                    result += "&gt;";
                    break;

                case "&":
                    result += "&amp;";
                    break;

                default:
                    linestart = false;
                    result += c;
            }
        }
        return result;
    },

    newline(times, spaces) {
        let result = "\n";
        let max = times * spaces;
        for (let i=0; i<max ; i++) {
            result += " ";
        }
        return result;
    },

    lineFeedAfterSemicolonCounter(code) {
        let counter = 0;
        let l = code.length;
        for (let i=0; i<l; i++) {
            if (code[i] == ";" && i+1<l && code[i+1] == "\n") {
                counter++;
            }
        }
        return counter;
    },


    /**
     * Colorizes a code according to Javascript rules.
     *
     * @param string code  the javascript code to colorize (mandatory)
     * @param object color {comment, quote, keyword, number}
     * @param string style the style of the DIV including the code
     * @param number spaces left spaces to remove (if omitted is autosensed)
     * @returns string return the colorized HTML
     */
    colorize: function(code, /* needed parameter containing the actual code */
            color  = {
                comment: 'green',
                quote: 'red',
                number: 'blue',
                keyword: 'darkviolet'
            },
            style = "font-family: monospace; line-height: 1.1em",
            spaces = 0) {
        if (code === undefined) {
            return;
        }
        code = this.encodeEntities(code);

        var keywords = this.getKeywords();
        var spaces = spaces || this.autosenseLeftMarginSpaces(code);

        var result = "<DIV style='" + style + "'>\n";
        var quote = false;
        var doublequote = false;
        var mlQuote = false;
        var start = 0;
        var comment = false;
        var mlComment = false;

        var l = code.length;
        for (var i=0; i<l; i++) {
            var c = code[i];

            var quoted = quote || doublequote || mlQuote;
            var commented = comment || mlComment;

            if (!mlComment && !quoted && c == "/" && i<l && code[i+1] == "*") {
                mlComment = true;
                start = i;
                i++;

            } else if (mlComment && c == "*" && i<l && code[i+1] == "/") {
                result += this.span(color.comment, code.slice(start, i+2));
                mlComment = false;
                start = i + 2;
                i++;

            } else if (!commented && !quote && !doublequote && c == "`") {
                if (mlQuote) {
                    if (i - start > 0) {
                        result += this.span(color.quote, code.slice(start, i+1));
                    }
                    mlQuote = false;
                    start = i + 1;
                } else {
                    mlQuote = true;
                    start = i;
                }
                i++;

            } else if (!commented && c == "/" && i<l && code[i+1] == "/") {
                comment = true;
                start = i;
                i++;

            } else if (!doublequote && !comment && !mlComment && c == "'") {
                if (quote) {
                    if (i - start > 0) {
                        result += this.span(color.quote, code.slice(start, i+1));
                    }
                    start = i + 1;
                } else {
                    start = i;
                }
                quote = !quote;

            } else if (!quote && !comment && !mlComment && c == '"') {
                if (doublequote) {
                    if (i - start > 0) {
                        result += this.span(color.quote, code.slice(start, i+1));
                    }
                    start = i + 1;
                } else {
                    start = i;
                }
                doublequote = !doublequote;

            } else if (c == "\n") {
                if (comment) {
                    result += this.span(color.comment, code.slice(start, i));
                    comment = false;

                } else if (mlComment) {
                    result += this.span(color.comment, code.slice(start, i));

                } else if (mlQuote) {
                    result += this.span(color.quote, code.slice(start, i));

                } else if (i - start > 0) {
                    result += this.markWord(code.slice(start, i), keywords,
                            color.keyword);

                }
                result += "<br />\n";
                start = i + 1;

                // capture empty lines
                for (let j=i+1; j<l; j++) {
                    let cj = code[j];
                    if (cj == "\n") {
                        i = j;
                        start = i + 1;
                        result += "<br />\n";

                    } else if (cj != " " ) {
                        i += spaces;
                        start = i + 1;
                        break;
                    }
                }

            } else if (!quoted && !commented) {
                if (c == "&") {
                    for (let j=3; j<l-i; j++) {
                        if (code[i+j] == ";") {
                            i += j+1;
                            break;
                        }
                    }
                } else if ("{}=+-/*~!@#$%^()[]\\;:<>?.,`".indexOf(c) != -1) {
                    if (i - start > 0) {
                        result += this.markWord(code.slice(start, i),
                                keywords, color.keyword);
                    }
                    result += c.bold();
                    start = i + 1;

                } else if ("0123456789".indexOf(c) != -1) {
                    let j=1;
                    for (; j<l-i; j++) {
                        if ("0123456789+-.Ee".indexOf(code[i+j]) == -1) {
                            break;
                        }
                    }
                    if (i + j - start > 0) {
                        let w = code.slice(start, i+j);
                        if (/-?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/.test(w)) {
                            result += this.span(color.number, w);
                        } else {
                            result += this.markWord(code.slice(start, i),
                                    keywords, color.keyword);
                        }
                        start = i + j;
                        i += j - 1;
                    }

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

    autosenseLeftMarginSpaces(code) {
        let l = code.length;
        let min = 100;
        let spaces = 0;
        for (let i=0; i<l; i++) {
            let c = code[i];
            if (c == "\n") {
                spaces = 0;
            } else if (c != " ") {
                if (min > spaces) {
                    min = spaces;
                }
            }
            spaces++;
        }
        return min == 0 ? 0 : min - 1;
    },

    span: function(color, txt) {
        return "<span style='color: " + color + ";'>" +
                txt.replace(/\ /g, "&nbsp;") + "</span>";
    },

    markWord: function(word, keywords, color) {
        if (keywords.indexOf(word) > -1) {
            return this.span(color, word);
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

