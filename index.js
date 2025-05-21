console.log("ORDEK!");

// Utility functions for DOM manipulation
function getElementByXPath(xp) {
    return document.evaluate(xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function waitUntilXP(xp) {
    return new Promise((resolve) => {
        let interval = setInterval(() => {
            let element = getElementByXPath(xp);
            if (element) {
                clearInterval(interval);
                resolve(element);
            }
        }, 100);
    });
}

function waitUntilClassName(className) {
    return new Promise((resolve) => {
        let interval = setInterval(() => {
            let element = document.querySelector(`[class*="${className}"]`);
            if (element) {
                clearInterval(interval);
                resolve(element);
            }
        }, 100);
    });
}

async function removeByXP(elementXP) {
    let elToRemove = await waitUntilXP(elementXP);
    elToRemove = getElementByXPath(elementXP);
    elToRemove.remove();
}

async function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

// UI Helper Functions
function moveElementToTop(element) {
    let parent = element.parentElement;
    parent.insertBefore(element, parent.firstChild);
}

function animateSort(element) {
    element.classList.add("sorting");
    setTimeout(() => {
        element.classList.remove("sorting");
        moveElementToTop(element);
    }, 100);
}

// Steam Bar Customization
async function customSteamBar() {
    let contentBarXP = "/html/body/div[1]/div[7]/div[1]/div";
    let contentBar = await waitUntilXP(contentBarXP);
    contentBar = getElementByXPath(contentBarXP);

    // Style the content bar
    const barStyles = {
        position: "fixed",
        top: "5px",
        left: "5px",
        zI: "999",
        borderRadius: "5px",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        width: "610px",
        height: "75px"
    };
    
    Object.assign(contentBar.style, barStyles);

    // Create control buttons
    const controls = createSteamBarControls();
    contentBar.appendChild(controls.gizlemeButonDivs);
    contentBar.appendChild(controls.butonDibi);

    // Remove unnecessary elements
    await Promise.all([
        removeByXP("/html/body/div[1]/div[7]/div[1]/div/div[1]"), // logo
        removeByXP("/html/body/div[1]/div[7]/div[1]/div/div[2]/div/a"), // down steam
        removeByXP("/html/body/div[1]/div[7]/div[4]/div[1]/div[3]/div/h1/a"), // pazar <a>
        removeByXP("/html/body/div[1]/div[7]/div[4]/div[1]/div[3]/div/div[2]") // userinfo
    ]);

    // Style remaining elements
    await styleRemainingElements();
}

function createSteamBarControls() {
    const gizlemeButonDivs = document.createElement('div');
    gizlemeButonDivs.classList.add("gizleme-buton-divs");
    
    const gizlemeButton = document.createElement('button');
    gizlemeButton.classList.add("gizleme-butons");
    gizlemeButton.innerHTML = "{";

    const butonDibi = document.createElement('div');
    butonDibi.classList.add("buton-dibi");

    const buttonRight = createDirectionButton(">");
    const buttonLeft = createDirectionButton("<");
    buttonLeft.classList.add("sol-content");

    setupSteamBarEventListeners(gizlemeButton, buttonRight, buttonLeft);

    gizlemeButonDivs.appendChild(gizlemeButton);
    butonDibi.appendChild(buttonLeft);
    butonDibi.appendChild(buttonRight);

    return { gizlemeButonDivs, butonDibi };
}

function createDirectionButton(content) {
    const button = document.createElement('button');
    button.classList.add("sag-sol-content");
    button.innerHTML = content;
    return button;
}

function setupSteamBarEventListeners(gizlemeButton, buttonRight, buttonLeft) {
    buttonRight.addEventListener('click', () => {
        const contentBar = gizlemeButton.closest('div');
        contentBar.style.left = "unset";
        contentBar.style.right = "5px";
        gizlemeButton.parentElement.style.right = "unset";
        gizlemeButton.parentElement.style.left = "2px";
        gizlemeButton.innerHTML = "}";
    });

    buttonLeft.addEventListener('click', () => {
        const contentBar = gizlemeButton.closest('div');
        contentBar.style.right = "unset";
        contentBar.style.left = "5px";
        gizlemeButton.parentElement.style.left = "unset";
        gizlemeButton.parentElement.style.right = "2px";
        gizlemeButton.innerHTML = "{";
    });

    gizlemeButton.addEventListener('click', () => {
        const contentBar = gizlemeButton.closest('div');
        handleGizlemeButtonClick(contentBar, gizlemeButton);
    });
}

function handleGizlemeButtonClick(contentBar, gizlemeButton) {
    const isLeft = contentBar.style.left === "5px";
    const isRight = contentBar.style.right === "5px";
    const isLeftHidden = contentBar.style.left === "-594px";
    const isRightHidden = contentBar.style.right === "-594px";

    if (isLeft) {
        // soldayken açıkta -> sol gizli
        contentBar.style.right = "unset";
        contentBar.style.left = "-594px";
        gizlemeButton.parentElement.style.left = "unset";
        gizlemeButton.parentElement.style.right = "2px";
        gizlemeButton.innerHTML = "}";
    } else if (isRight) {
        // sağdayken açıkta -> sağ gizli
        contentBar.style.left = "unset";
        contentBar.style.right = "-594px";
        gizlemeButton.parentElement.style.right = "unset";
        gizlemeButton.parentElement.style.left = "2px";
        gizlemeButton.innerHTML = "{";
    } else if (isLeftHidden) {
        // soldayken gizli -> sol açık
        contentBar.style.left = "5px";
        contentBar.style.right = "unset";
        gizlemeButton.parentElement.style.left = "unset";
        gizlemeButton.parentElement.style.right = "2px";
        gizlemeButton.innerHTML = "{";
    } else if (isRightHidden) {
        // sağdayken gizli -> sağ açık
        contentBar.style.right = "5px";
        contentBar.style.left = "unset";
        gizlemeButton.parentElement.style.right = "unset";
        gizlemeButton.parentElement.style.left = "2px";
        gizlemeButton.innerHTML = "}";
    }
}

// Main function to handle different pages
async function main() {
    const pageURL = window.location.href.toLowerCase();
    console.log("Current page URL:", pageURL);

    try {
        if (pageURL.includes("pricempire.com/comparison/legacy")) {
            await handlePriceEmpireComparisonPage();
        } else if (pageURL.includes("pricempire.com/item/csgo/skin/") && pageURL.endsWith("%20%20%20%20%20")) {
            await handlePriceEmpireItemPage();
        } else if (pageURL.includes("steamcommunity.com/market/listings/730/")) {
            await handleSteamMarketPage();
        } else if (pageURL.includes("buff.163.com/goods/")) {
            await handleBuffGoodsPage();
        } else if (pageURL.includes("meter.net/ping-test")) {
            await handlePingTestPage();
        }

        if (pageURL.endsWith("?bgjs-ordek")) {
            await handleBgjsOrdekPage(pageURL);
        }
    } catch (error) {
        console.error("Error in main function:", error);
    }
}

// Start the extension
main();

