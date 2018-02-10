
// receive the messages
self.addEventListener("message", function(event) {
    if (event.data == "start") {
        postMessage("received");
    }
    //self.close();
});
