// ===============================
// RATE CONVERSION
// ===============================

const USDT_RATE = 15500; // 1 USDT = Rp15500

// ===============================
// GLOBAL PRICE DATA
// ===============================

let prices = {};
let pricesLoaded = false;


// ===============================
// ELEMENT
// ===============================

const tokenSelect = document.getElementById("sellToken");
window.currencySelect = document.getElementById("currencySelect");

currencySelect.addEventListener("change", () => {
    localStorage.setItem("currency", currencySelect.value);
});
const tokenLogo   = document.getElementById("tokenLogo");


// ===============================
// FORMAT RUPIAH
// ===============================

function rupiah(num){
    return "Rp " + Number(num).toLocaleString("id-ID");
}


// ===============================
// LOAD PRICE JSON
// ===============================

async function loadPrices(){

    try{

        const res = await fetch("data/prices.json");
        prices = await res.json();

        pricesLoaded = true;

        populateTokenDropdown();
        renderTicker();
        updateEstimation();

    }catch(e){

        console.error("price error", e);

    }

}


// ===============================
// POPULATE TOKEN DROPDOWN
// ===============================

function populateTokenDropdown(){

    if(!tokenSelect) return;

    tokenSelect.innerHTML = "";

    Object.keys(prices).forEach(key => {

        if(key === "wa_number" || key === "wallets") return;

        const token = prices[key];

        const option = document.createElement("option");

        option.value = key;
        option.textContent = token.name || key.toUpperCase();

        tokenSelect.appendChild(option);

    });

    // DEFAULT SIDRA
    if(prices.sidra){
        tokenSelect.value = "sidra";
    }

    updateTokenLogo();

}


// ===============================
// UPDATE TOKEN LOGO
// ===============================

function updateTokenLogo(){

    if(!tokenSelect || !tokenLogo) return;

    const token = tokenSelect.value;

    if(prices[token] && prices[token].logo){
        tokenLogo.src = prices[token].logo;
    }

}


// ===============================
// RENDER TEXT BERJALAN (TICKER)
// ===============================

function renderTicker(){

    if(!pricesLoaded) return;

    const ticker = document.getElementById("tickerTrack");

    if(!ticker) return;

    ticker.innerHTML = "";

    let itemsHTML = "";

    Object.keys(prices).forEach(key => {

        if(key === "wa_number" || key === "wallets") return;

        const data = prices[key];

        itemsHTML += `
        <div class="ticker-item">

            <img src="${data.logo}" class="ticker-icon">

            <span class="ticker-token">
            ${data.name || key.toUpperCase()}
            </span>

            <span class="ticker-price">
            ${rupiah(data.normal_price)}
            </span>

            <span class="ticker-sep">•</span>

            <span class="ticker-rule">
            Jual < ${data.min_sell} =
            ${rupiah(data.below_min_price)}
            </span>

        </div>
        `;

    });

    // DUPLIKASI isi ticker agar loop halus
    ticker.innerHTML = itemsHTML + itemsHTML;

}
// ===============================
// AMBIL HARGA TOKEN
// ===============================

function getTokenPrice(token, amount){

    if(!pricesLoaded) return 0;

    const data = prices[token];

    if(!data) return 0;

    if(amount < data.min_sell){
        return data.below_min_price;
    }

    return data.normal_price;

}


// ===============================
// UPDATE ESTIMASI
// ===============================

function updateEstimation(){

    if(!pricesLoaded) return;

    const amountInput = document.getElementById("sellAmount");
    const estimateBox = document.getElementById("rupiahPreview");

    if(!amountInput || !estimateBox || !tokenSelect) return;

    const amount = parseFloat(amountInput.value);

    if(!amount || isNaN(amount)){
        estimateBox.innerText = "Rp 0";
        return;
    }

    const token = tokenSelect.value;

    if(!prices[token]){
        estimateBox.innerText = "Rp 0";
        return;
    }

    const data = prices[token];

    let price = data.normal_price;

    if(amount < data.min_sell){
        price = data.below_min_price;
    }

    const total = amount * price;

    if(isNaN(total)){
        estimateBox.innerText = "Rp 0";
        return;
    }

    // ===============================
    // CURRENCY MODE
    // ===============================

    if(currencySelect && currencySelect.value === "usdt"){

        const usdt = total / USDT_RATE;

        estimateBox.innerText =
            usdt.toFixed(2) + " USDT";

    }else{

        estimateBox.innerText =
            "Rp " + total.toLocaleString("id-ID");

    }

}

// ===============================
// INIT
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const amountInput = document.getElementById("sellAmount");


    // ===============================
    // LOAD PRICE
    // ===============================

    if(typeof loadPrices === "function"){
        loadPrices();
    }


    // ===============================
    // RENDER HISTORY
    // ===============================

    if(typeof renderHistory === "function"){
        renderHistory();
    }


    // ===============================
    // INPUT AMOUNT
    // ===============================

    if(amountInput){

        amountInput.addEventListener("input", () => {

            if(typeof updateEstimation === "function"){
                updateEstimation();
            }

            if(typeof calculate === "function"){
                calculate();
            }

        });

    }


    // ===============================
    // TOKEN CHANGE
    // ===============================

    if(tokenSelect){

        tokenSelect.addEventListener("change", () => {

            updateTokenLogo();
            updateEstimation();

            if(typeof calculate === "function"){
                calculate();
            }

        });

    }


    // ===============================
    // CURRENCY CHANGE
    // ===============================

    currencySelect.addEventListener("change", () => {

    updateCurrencyIcon();

    if(typeof updateEstimation === "function"){
        updateEstimation();
    }

    if(typeof calculate === "function"){
        calculate();
    }

});

    // ===============================
    // FIRST CALCULATION
    // ===============================

    if(typeof calculate === "function"){
        calculate();
    }

});