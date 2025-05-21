console.log("bg.js is running");


chrome.browserAction.onClicked.addListener(buttonClicked);

function buttonClicked(tab){
    console.log("button clicked");

    let msg = {
        txt: "hello"
    }
    chrome.tabs.sendMessage(tab.id, msg);
    
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("Message received in background script:", message);
  
    sendResponse({ response: "Message received successfully!" });
});



// alma
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === "LetmeGoogle") {
        window.open(request.url, "_blank");
        window.focus();
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === "websiteHTMLsource") {
        let webSource = request.webSource;

        //gonderme
        chrome.tabs.query({}, function(tabs) {

            tabs.forEach(function(tab) {
                chrome.tabs.sendMessage(tab.id, {
                    message: "websiteHTMLsourceToIndex",
                    webSource: webSource
                });
            });

        });

    }
});



// gonderme
// chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//     const activeTab = tabs[0];
//     chrome.tabs.sendMessage(activeTab.id, { message: "Merhaba from background script!" });
// });
  


