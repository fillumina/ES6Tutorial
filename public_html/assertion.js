
class StopWatch {
    constructor() {
        this.timer = performance.now();
    }

    start() {
        this.timer = performance.now();
    }

    /**
     *
     * @returns the time elapsed in milliseconds (approximated)
     */
    stop() {
        var now = performance.now();
        var elapsed = now - this.timer;
        this.timer = now;
        return elapsed;
    }
};

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


function expects(title, array) {
    var title = title;
    var array = array;
    var index = 0;
    this.push = function(value) {
        if (index >= array.length) {
            var msg = "'" + title +
                "' pushed '" + value +
                "' past expected [" + array + "]";
            Logger.log("log", "EXPECTS", msg);
            Assert.throwError(msg);
        }
        Assert.equals(value, array[index], title + " index=" + index);
        index++;
        if (index === array.length) {
            Logger.log("log", "EXPECTED", title, JSON.stringify(array), "OK!");
        }
    };
    this.check = function() {
        if (index !== array.length) {
            var msg = title + " missing " +
                    JSON.stringify(array.slice(index, array.length));
            Logger.log("log", "EXPECTED", msg, "ERROR");
            Assert.throwError(msg);
        }
    };
}

function ExpectsFactory() {
    var expectsArray = [];

    this.expects = function(title, ...array) {
        var e = new expects(title, array);
        expectsArray.push(e);
        return e;
    };

    this.checkAllInMs = function(time) {
        setTimeout( function() {
            expectsArray.forEach( e => e.check() );
        }, time);
        Logger.log("log", "EXPECTS OK");
    };
}


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

    objectEquals(o1, o2) {
        if (typeof o1 !== "object") {
            this.throwError("first param not an object");
        }
        if (typeof o2 !== "object") {
            this.throwError("second param not an object");
        }
        for (var p in o1) {
            if (typeof o1[p] === "object") {
                this.objectEquals(o1[p], o2[p]);
            } else {
                this.equals(o1[p], o2[p],
                    "objects different at property '" + p + "': ");
            }
        }
        for (var p in o2) {
            if (typeof o2[p] === "object") {
                this.objectEquals(o1[p], o2[p]);
            } else {
                this.equals(o1[p], o2[p],
                    "objects different at property '" + p + "': ");
            }
        }
    },

    arrayEmpty(array) {
        if (typeof array !== "object") {
            this.throwError("array is not an object", arguments[0]);
        }
        if (array.length !== 0) {
            this.throwError("array is not empty", arguments[0]);
        }
    },

    arrayEquals(array, elements) {
        if (typeof array !== "object") {
            this.throwError("first param undefined");
        }
        if (typeof elements !== "object") {
            this.throwError("second param undefined");
        }
        if (array.length != elements.length) {
            this.throwError("array length mismatch: " +
                    array.length + " != " + elements.length);
        }
        for (var i=0; i<array.length; i++) {
            this.equals(array[i], elements[i],
                "array different at index " + i + ": ");
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
            this.throwError(JSON.stringify(a) + " != " +
                    JSON.stringify(b), arguments[2]);
        }
    },

    differs(a, b) {
        if (a === b) {
            this.throwError(JSON.stringify(a) + " == " +
                    JSON.stringify(b), arguments[2]);
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

if (counter !== 9) {
    this.throwError("not all tests succeeded!");
}