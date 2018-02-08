// cannot import from a non-module?
//import {Assert} from "./assertion.js";

var privateVariable = "Private Variable";

export var exportedVariable = "Exported Variable";

function privateFunction() {
    return "Private Function";
}

export function exportedFunction() {
    return "Exported Function";
}

class PrivateClass {
    name() {
        return "Private Class";
    }
}

export class PublicClass {
    name() {
        return "Public Class";
    }
}

var privateObject = {
    name: "Private Object"
};

export var exportedObject = {
    name: "Exported Object"
};

var otherExportedVariable1 = "Other Exported Variable 1";
var otherExportedVariable2 = "Other Exported Variable 2";
export { otherExportedVariable1, otherExportedVariable2 };

