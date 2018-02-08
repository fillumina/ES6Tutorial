// this module is executed directly just like any other js but in this
// another module can be imported

import * as M from "./imported-module.js";

console.log("accessing module from module: " + M.exportedObject.name);
