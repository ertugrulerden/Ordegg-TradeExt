// Buff Goods Page Handler
async function handleBuffGoodsPage() {
    const itemName = await getItemName();
    const divToButton = await getButtonContainer();
    
    const { buttonBuffHistory, inputItemCount, totalPrice } = createUIElements();
    setupBuffHistoryButton(buttonBuffHistory, itemName);
    setupItemCountInput(inputItemCount, totalPrice);
    
    appendElementsToContainer(divToButton, buttonBuffHistory, inputItemCount, totalPrice);
}

async function getItemName() {
    const element = await waitUntilXP("/html/body/div[6]/div/div[1]/div[2]/div[1]/h1");
    return element.innerText;
}

async function getButtonContainer() {
    return await waitUntilXP("/html/body/div[6]/div/div[2]/div");
}

function createUIElements() {
    const buttonBuffHistory = createBuffHistoryButton();
    const inputItemCount = createItemCountInput();
    const totalPrice = createTotalPriceDisplay();
    
    return { buttonBuffHistory, inputItemCount, totalPrice };
}

function createBuffHistoryButton() {
    const button = document.createElement('button');
    button.classList.add('buff-history-button');
    button.innerHTML = "buffHistory()";
    return button;
}

function createItemCountInput() {
    const input = document.createElement('input');
    input.type = "number";
    input.placeholder = "Item Count";
    Object.assign(input.style, {
        width: "90px",
        height: "20px",
        marginLeft: "0px",
        marginTop: "5px",
        marginBottom: "10px",
        padding: "10px",
        fontSize: "15px",
        fontWeight: "bold",
        color: "white",
        backgroundColor: "#a9a297",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        outline: "none",
        fontFamily: "monospace",
        textAlign: "center",
        textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)"
    });
    return input;
}

function createTotalPriceDisplay() {
    const totalPrice = document.createElement('p');
    totalPrice.innerHTML = "Total : ";
    Object.assign(totalPrice.style, {
        color: "white",
        fontWeight: "bold",
        fontSize: "20px",
        textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
        margin: "0px",
        padding: "0px",
        fontFamily: "monospace"
    });
    return totalPrice;
}

function setupBuffHistoryButton(button, itemName) {
    button.addEventListener('click', () => {
        copyToClipboard(itemName);
        window.open(`https://cantry.dev/pricehistory?items=${itemName}%29`, '_blank');
    });
}

function setupItemCountInput(input, totalPrice) {
    input.addEventListener('input', async () => {
        let totalScannedItem = 0;
        let total = 0;
        let i = 2;

        while (totalScannedItem < input.value) {
            if (i === 12) {
                i = 2;
                await clickNextPage();
            }

            const price = await getPriceForItem(i);
            total += price;
            i++;
            totalScannedItem++;
            updateTotalPriceDisplay(totalPrice, totalScannedItem);
        }

        updateFinalTotalPrice(totalPrice, total, totalScannedItem);
    });
}

async function clickNextPage() {
    const nextPage = await waitUntilXP("/html/body/div[6]/div/div[7]/div/ul/li[12]/a");
    nextPage.click();
}

async function getPriceForItem(index) {
    const priceTD = await waitUntilXP(`/html/body/div[6]/div/div[7]/table/tbody/tr[${index}]/td[5]`);
    const priceText = priceTD.querySelector("div").querySelector("strong").innerHTML;
    return parseFloat(priceText
        .replaceAll(" ", "")
        .replaceAll("¥", "")
        .replaceAll("<small>", "")
        .replaceAll("</small>", ""));
}

function updateTotalPriceDisplay(totalPrice, totalScannedItem) {
    totalPrice.innerHTML = `Total : <${"🦆".repeat(totalScannedItem)}> `;
}

function updateFinalTotalPrice(totalPrice, total, totalScannedItem) {
    totalPrice.innerHTML = `Total : ${total.toFixed(2)} ¥  <span style="font-size: 17px;">rate:(${(total/totalScannedItem).toFixed(2)}¥)</span>`;
}

function copyToClipboard(text) {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
}

function appendElementsToContainer(container, ...elements) {
    elements.forEach(element => container.appendChild(element));
} 