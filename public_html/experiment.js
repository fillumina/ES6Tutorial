
var output;

(function() {
    var div= document.createElement("div");

    var body = document.getElementsByTagName("body")[0];
    body.appendChild(div);

    var title= document.createElement("h3");
    title.innerText = "Write your code here (use print() for output)";

    var textArea = document.createElement("textarea");
    textArea.style = "display: block; width: 100%; height: 10em";

    var execButton = document.createElement("button");
    execButton.innerText = "Execute";
    execButton.onclick = function() {
        eval(textArea.value);
    };

    var saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    saveButton.onclick = function() {
        saveTextAsFile(textArea.value);
    };

    output = document.createElement("div");

    div.appendChild(title);
    div.appendChild(textArea);
    div.appendChild(execButton);
    div.appendChild(saveButton);
    div.appendChild(this.output);
})();

function print(msg) {
    var p = document.createElement("p");
    p.innerText = msg;
    output.appendChild(p);
}

function saveTextAsFile(textToSave) {
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);

    var downloadLink = document.createElement("a");
    downloadLink.download = "experiment_.js";
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();
}