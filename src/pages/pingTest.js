// Ping Test Page Handler
async function handlePingTestPage() {
    const div = await getMainContainer();
    const { iframeDiv, iframe } = createIframeElements();
    const { button, minimizeBtn, header, removeButton, getWebBtn } = createControlButtons();
    
    setupIframeContent(iframe);
    setupButtonListeners(minimizeBtn, removeButton, getWebBtn, iframe);
    setupMessageListener(iframe);
    
    appendElementsToContainer(div, iframeDiv, iframe, button, minimizeBtn, header, removeButton, getWebBtn);
}

async function getMainContainer() {
    return await waitUntilXP("/html/body/div[1]/div[3]/div[3]/div[1]");
}

function createIframeElements() {
    const iframeDiv = document.createElement('div');
    iframeDiv.classList.add("iframe");
    iframeDiv.style.overflow = "hidden";

    const iframe = document.createElement('iframe');
    iframe.classList.add("iframe");

    return { iframeDiv, iframe };
}

function createControlButtons() {
    const button = createButton("Ping");
    const minimizeBtn = createButton("Minimize");
    const header = createHeader();
    const removeButton = createButton("Remove");
    const getWebBtn = createButton("Get Web");

    return { button, minimizeBtn, header, removeButton, getWebBtn };
}

function createButton(text) {
    const button = document.createElement('button');
    button.classList.add("button-iframe");
    button.innerHTML = text;
    return button;
}

function createHeader() {
    const header = document.querySelector("p");
    header.innerHTML = "Ping Test";
    Object.assign(header.style, {
        fontSize: "18px",
        top: "0px",
        margin: "2px",
        padding: "0px",
        position: "absolute"
    });
    return header;
}

function setupIframeContent(iframe) {
    const pageSource = document.documentElement.outerHTML;
    iframe.srcdoc = pageSource;
}

function setupButtonListeners(minimizeBtn, removeButton, getWebBtn, iframe) {
    minimizeBtn.addEventListener('click', () => {
        const iframeDiv = minimizeBtn.parentElement;
        if (iframeDiv.style.width === "300px") {
            Object.assign(iframeDiv.style, {
                width: "50vw",
                height: "70vh",
                top: "30px"
            });
        } else {
            Object.assign(iframeDiv.style, {
                width: "300px",
                height: "25px",
                top: "0px"
            });
        }
    });

    removeButton.addEventListener('click', async () => {
        const iframeDiv = removeButton.parentElement;
        iframeDiv.style.opacity = "0";
        await sleep(0.3);
        iframeDiv.remove();
    });

    getWebBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ 
            message: "LetmeGoogle",
            url: "https://steamcommunity.com/market/listings/730/Dual%20Berettas%20%7C%20Switch%20Board%20(Battle-Scarred)?utm_source=pricempire.com?bgjs-ordek"
        });
    });
}

function setupMessageListener(iframe) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.message === "websiteHTMLsourceToIndex") {
            console.log("websiteHTMLsourceToIndex received - index.js");
            console.log(request.webSource);
            iframe.srcdoc = request.webSource;
        }
    });
}

function appendElementsToContainer(container, ...elements) {
    elements.forEach(element => container.appendChild(element));
} 