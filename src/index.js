// Import page handlers
import { handlePriceEmpireComparisonPage } from './pages/priceEmpireComparison.js';
import { handleSteamMarketPage } from './pages/steamMarket.js';
import { handleBuffGoodsPage } from './pages/buffGoods.js';
import { handlePingTestPage } from './pages/pingTest.js';

// Utility functions
function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function getElementByXPath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

async function waitUntilXP(xpath) {
    while (true) {
        const element = getElementByXPath(xpath);
        if (element) return element;
        await sleep(0.1);
    }
}

function removeByXP(xpath) {
    const element = getElementByXPath(xpath);
    if (element) element.remove();
}

// Main function to handle different pages
async function main() {
    const currentUrl = window.location.href;

    if (currentUrl.includes('pricempire.com')) {
        if (currentUrl.includes('/compare')) {
            await handlePriceEmpireComparisonPage();
        }
    } else if (currentUrl.includes('steamcommunity.com')) {
        if (currentUrl.includes('/market/listings')) {
            await handleSteamMarketPage();
        }
    } else if (currentUrl.includes('buff.163.com')) {
        if (currentUrl.includes('/goods/')) {
            await handleBuffGoodsPage();
        }
    } else if (currentUrl.includes('ping-test')) {
        await handlePingTestPage();
    }
}

// Start the extension
main(); 