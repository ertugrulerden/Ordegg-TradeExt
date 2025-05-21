// Steam Market Page Handler
async function handleSteamMarketPage() {
    await removeUnnecessaryElements();
    const divEl = await getMainContainer();
    await customSteamBar();
    
    const { profitPercDiv, convertDiv } = createUIElements();
    setupProfitCalculation(profitPercDiv);
    setupPriceCalculation(convertDiv);
    
    appendElementsToContainer(divEl, convertDiv, profitPercDiv);
    removeAds();
}

async function removeUnnecessaryElements() {
    const removeGereksizDiv = await waitUntilXP("/html/body/div[1]/div[7]/div[4]/div[1]/div[4]/div[1]/div[3]/div[5]/div[1]");
    removeGereksizDiv.remove();
}

async function getMainContainer() {
    return await waitUntilXP("/html/body/div[1]/div[7]/div[4]/div[1]/div[4]/div[1]/div[3]/div[4]/div");
}

function createUIElements() {
    const profitPercDiv = document.createElement('div');
    profitPercDiv.classList.add('profit-perc-div');

    const convertDiv = document.createElement('div');
    convertDiv.classList.add('convert-div');
    Object.assign(convertDiv.style, {
        width: "fit-content",
        height: "fit-content",
        marginLeft: "0px",
        marginTop: "0px",
        marginBottom: "0px",
        padding: "0px"
    });

    return { profitPercDiv, convertDiv };
}

function setupProfitCalculation(profitPercDiv) {
    const profitPercFROM = createProfitInput(" FROM ");
    const profitPercTO = createProfitInput(" TO ");
    const profitP = document.createElement('p');
    profitP.classList.add('profit-perc-p');

    setupProfitInputListeners(profitPercFROM, profitPercTO, profitP);

    profitPercDiv.appendChild(profitPercFROM);
    profitPercDiv.appendChild(profitPercTO);
    profitPercDiv.appendChild(profitP);
}

function createProfitInput(placeholder) {
    const input = document.createElement('input');
    input.classList.add('profit-perc-input');
    input.type = "number";
    input.placeholder = placeholder;
    return input;
}

function setupProfitInputListeners(fromInput, toInput, profitDisplay) {
    const updateProfit = () => {
        const profit = ((toInput.value - fromInput.value) / fromInput.value) * 100;
        profitDisplay.innerHTML = `Profit : ${profit.toFixed(2)}%`;
    };

    fromInput.addEventListener('input', updateProfit);
    toInput.addEventListener('input', updateProfit);
}

function setupPriceCalculation(convertDiv) {
    const inputItemCount = createItemCountInput();
    const buttonBuff = createGetPriceButton();
    const totalPrice = createTotalPriceDisplay();

    setupGetPriceButtonListener(buttonBuff, inputItemCount, totalPrice);

    convertDiv.appendChild(inputItemCount);
    convertDiv.appendChild(buttonBuff);
    convertDiv.appendChild(totalPrice);
}

function createItemCountInput() {
    const input = document.createElement('input');
    input.classList.add('input-boxes');
    input.type = "number";
    Object.assign(input.style, {
        width: "100px",
        height: "45px",
        border: "none",
        borderRadius: "5px",
        backgroundColor: "#0a0e0f",
        placeholder: "item",
        color: "white",
        fontWeight: "bold",
        appearance: "textfield",
        MozAppearance: "textfield",
        resize: "none",
        outline: "none",
        overflow: "hidden",
        marginTop: "10px"
    });
    return input;
}

function createGetPriceButton() {
    const button = document.createElement('button');
    button.innerHTML = "getPrice()";
    button.classList.add('buff-button');
    Object.assign(button.style, {
        width: "fit-content",
        height: "45px",
        marginLeft: "10px",
        marginTop: "10px",
        marginBottom: "0px",
        padding: "10px",
        fontSize: "15px",
        fontWeight: "bold",
        color: "white",
        backgroundColor: "#0a0e0f",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        outline: "none",
        fontFamily: "monospace",
        textAlign: "center"
    });
    return button;
}

function createTotalPriceDisplay() {
    const totalPrice = document.createElement('p');
    totalPrice.innerHTML = "Total : ";
    Object.assign(totalPrice.style, {
        fontSize: "20px",
        fontWeight: "bold",
        color: "white",
        fontFamily: "monospace",
        textAlign: "left",
        marginTop: "1px",
        marginBottom: "1px",
        padding: "10px"
    });
    return totalPrice;
}

function setupGetPriceButtonListener(button, inputItemCount, totalPrice) {
    button.addEventListener('click', async () => {
        let total = 0;
        let totalScannedItem = 0;
        let i = 2;

        while (totalScannedItem < parseInt(inputItemCount.value)) {
            const priceElement = await getPriceElement(i);
            if (isValidPriceElement(priceElement)) {
                const price = parsePrice(priceElement);
                total += price;
                totalScannedItem++;
                updateTotalPriceDisplay(totalPrice, total, totalScannedItem, inputItemCount.value, i);
            }
            i++;
        }

        updateFinalTotalPrice(totalPrice, total, inputItemCount.value);
    });
}

async function getPriceElement(index) {
    const xpath = `/html/body/div[1]/div[7]/div[4]/div[1]/div[4]/div[1]/div[3]/div[6]/div[1]/div[${index}]/div[2]/div[2]/span/div/div[1]`;
    return await waitUntilXP(xpath);
}

function isValidPriceElement(element) {
    const className = element.className;
    return className === "price_with" || className === "market_listing_price market_listing_price_with_fee";
}

function parsePrice(element) {
    return parseFloat(element.textContent
        .replaceAll(/\s+/g, "")
        .replaceAll("TL", "")
        .replaceAll(".", "")
        .replaceAll(",", "."));
}

function updateTotalPriceDisplay(totalPrice, total, totalScannedItem, itemCount, index) {
    totalPrice.innerHTML = `Total : <span style="font-size: 16px;"> ${total.toFixed(2)}  |  rate:(${((total.toFixed(2))/itemCount).toFixed(2)})</span> <br> <${"🦆".repeat(index-1)}>`;
}

function updateFinalTotalPrice(totalPrice, total, itemCount) {
    totalPrice.innerHTML = `<span style="text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);">Total :</span> <span style="color: green; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);"> ${total.toFixed(2)}</span> <span style="text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);">TL</span> <span style="font-size: 15px; margin-left: 6px;">rate:(${((total.toFixed(2))/itemCount).toFixed(2)})</span>`;
}

function appendElementsToContainer(container, ...elements) {
    elements.forEach(element => container.appendChild(element));
}

function removeAds() {
    const adXPaths = [
        "/html/body/div[1]/div[7]/div[4]/div[1]/div[4]/div/div[2]/div/div[4]/div[1]",
        "/html/body/div[1]/div[7]/div[4]/div[1]/div[4]/div/div[2]/div/div[4]/div[2]",
        "/html/body/div[1]/div[7]/div[4]/div[1]/div[4]/div/div[2]/div/div[4]/div[3]",
        "/html/body/div[1]/div[7]/div[4]/div[1]/div[4]/div/div[2]/div/div[4]/div[4]",
        "/html/body/div[1]/div[7]/div[4]/div[1]/div[4]/div[1]/div[2]/div/div[4]/span"
    ];
    
    adXPaths.forEach(xpath => removeByXP(xpath));
} 