// Background Script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "LetmeGoogle") {
        fetch(request.url)
            .then(response => response.text())
            .then(html => {
                chrome.tabs.sendMessage(sender.tab.id, {
                    message: "websiteHTMLsourceToIndex",
                    webSource: html
                });
            })
            .catch(error => {
                console.error('Error fetching webpage:', error);
            });
    }
}); 