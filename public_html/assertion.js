
var Logger = {

    log(id, ...msgs) {
        var element = document.getElementById(id);
        if (element !== undefined) {
            var text = "";
            for (let i=0; i<msgs.length; i++) {
                if (i == 0 && msgs.length > 1) {
                    text += "<B>" + msgs[i] + ":</B>" + " ";
                } else {
                    text += msgs[i] + " ";
                }
            }
            var html = element.innerHTML;
            var tagName = element.tagName;
            if (tagName === "OL" || tagName === "UL") {
                html = html + "<LI>" + text + "</LI>\n" ;
            } else {
                html = html + text + "<BR />\n" ;
            }
            element.innerHTML = html;
        }
    },

    end(id) {
        console.log("finished OK!");
        this.log(id, "finished", "<span style='color:green'>OK!</span>");
    }
};

var Assert = {

    throwError(msg, title = "") {
        var err = "ERROR: " + title + " " + msg;
        alert(err);
        console.log(err);
        throw new Error(err);
    },

    isDefined(expr) {
        if (expr === undefined) {
            this.throwError("undefined", arguments[1]);
        }
    },

    fail() {
        this.throwError("should't execute", arguments[0]);
    },

    isTrue(expr) {
        if (! expr) {
            this.throwError("is false", arguments[1]);
        }
    },

    isFalse(expr) {
        if (expr) {
            this.throwError("is true", arguments[1]);
        }
    },

    equals(a, b) {
        if (a !== b) {
            this.throwError("'" + a + "' != '" + b + "'", arguments[2]);
        }
    },

    differs(a, b) {
        if (a === b) {
            this.throwError("'" + a + "' == '" + b + "'", arguments[2]);
        }
    },

    isNull(expr) {
        if (expr !== null) {
            this.throwError("is not null", arguments[1]);
        }
    },

    isNotNull(expr) {
        if (expr === null) {
            this.throwError("is null", arguments[1]);
        }
    },

    isType(expr, type, msg) {
        this.equals(typeof expr, type, msg);
    },

    isString(expr) {
        this.isType(expr, "string", arguments[1]);
    },

    isNumber(expr) {
        this.isType(expr, "number", arguments[1]);
    },

    isObject(expr) {
        this.isType(expr, "object", arguments[1]);
    },

    isBoolean(expr) {
        this.isType(expr, "boolean", arguments[1]);
    },

    isUndefined(expr) {
        this.isType(expr, "undefined", arguments[1]);
    },

    isfunction(expr) {
        this.isType(expr, "function", arguments[1]);
    },

    isXml(expr) {
        this.isType(expr, "xml", arguments[1]);
    },

    isNotType(expr, type, msg) {
        this.differs(typeof expr, type, msg);
    }
};

// self test

var counter = 0;

try {
    Test.isDefined(this.a);
    fail();
} catch(e) {
    counter++;
}

try {
    var a = 1;
    Test.isUndefined(a);
} catch(e) {
    counter++;
}

try {
    fail();
    console.log("fail() failed!");
} catch(e) {
    counter++;
}

try {
    isTrue(false);
    fail();
} catch(e) {
    counter++;
}

try {
    isFalse(true);
    fail();
} catch(e) {
    counter++;
}

try {
    equals(1, 2);
    fail();
} catch(e) {
    counter++;
}

try {
    differs(1, 1);
    fail();
} catch(e) {
    counter++;
}

try {
    isNull(1);
    fail();
} catch(e) {
    counter++;
}

try {
    isNotNull(null);
    fail();
} catch(e) {
    counter++;
}

if (counter != 9) {
    this.throwError("not all tests succeed!");
}