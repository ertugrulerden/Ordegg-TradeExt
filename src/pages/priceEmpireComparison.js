// Price Empire Comparison Page Handler
async function handlePriceEmpireComparisonPage() {
    const convertingFrom = await getConvertingFrom();
    const inputsDiv = createInputsContainer();
    const { inputTotalBal, inputTotalFromBal, sortByRateBtn } = createInputElements(convertingFrom);
    
    appendInputsToContainer(inputsDiv, inputTotalBal, inputTotalFromBal, sortByRateBtn);
    await setupReloadButton();
    await loadItems(convertingFrom);
}

async function getConvertingFrom() {
    const element = await waitUntilXP("/html/body/app-root/app-shell/div/comparison-legacy/div[2]/div[1]/base-select[1]/div/div/span");
    return element.innerText.toLowerCase();
}

function createInputsContainer() {
    const inputsDiv = document.createElement('div');
    Object.assign(inputsDiv.style, {
        height: "50px",
        width: "fit-content",
        margin: "0px",
        padding: "0px"
    });
    return inputsDiv;
}

function createInputElements(convertingFrom) {
    const inputTotalBal = createInputBox({
        width: "120px",
        height: "50px",
        backgroundColor: "#2b0a7f",
        placeholder: convertingFrom.includes("buff") ? "Balance (¥)" : "Balance (TL)"
    });

    const inputTotalFromBal = createInputBox({
        width: "120px",
        height: "38px",
        backgroundColor: "#20085e",
        marginLeft: "15px",
        placeholder: convertingFrom.includes("buff") ? "BalanceFrom (TL)" : "BalanceFrom (¥)"
    });

    const sortByRateBtn = createSortButton();

    return { inputTotalBal, inputTotalFromBal, sortByRateBtn };
}

function createInputBox(styles) {
    const input = document.createElement('input');
    input.classList.add('input-boxes');
    input.type = "number";
    Object.assign(input.style, {
        border: "none",
        borderRadius: "5px",
        color: "white",
        fontWeight: "bold",
        appearance: "textfield",
        MozAppearance: "textfield",
        resize: "none",
        outline: "none",
        overflow: "hidden",
        textAlign: "center",
        ...styles
    });
    return input;
}

function createSortButton() {
    const button = document.createElement('button');
    button.classList.add('sort-btn');
    button.innerText = "Sort by Rate";
    Object.assign(button.style, {
        marginLeft: "20px",
        marginTop: "0px",
        marginBottom: "0px",
        padding: "10px",
        fontSize: "15px",
        fontWeight: "bold",
        color: "white",
        backgroundColor: "#2b0a7f",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
        outline: "none",
        transition: "all 0.25s ease-in-out"
    });
    return button;
}

function appendInputsToContainer(container, ...elements) {
    elements.forEach(element => container.appendChild(element));
}

async function setupReloadButton() {
    const reloadButtonDiv = await waitUntilXP("/html/body/app-root/app-shell/div/comparison-legacy/div[2]/div[2]");
    const reloadButton = document.createElement('button');
    reloadButton.classList.add('button', 'reload');
    reloadButton.innerText = "Reload";
    reloadButton.addEventListener("click", () => loadItems());
    reloadButtonDiv.appendChild(reloadButton);
}

// ... rest of the price empire comparison functionality ... 