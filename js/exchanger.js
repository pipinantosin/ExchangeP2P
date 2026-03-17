// =================================
// ELEMENT
// =================================

const sellAmount   = document.getElementById("sellAmount");
const sellToken    = document.getElementById("sellToken");
const rupiahPreview = document.getElementById("rupiahPreview");

const previewSend    = document.getElementById("previewSend");
const previewReceive = document.getElementById("previewReceive");
const previewPayment = document.getElementById("previewPayment");
const previewWallet  = document.getElementById("previewWallet");

const sidraWallet = window.APP_CONFIG?.WALLETS?.SIDRA;



// ===============================
// CALCULATE
// ===============================
function calculate(){

    if(!prices) return;

    const amount = parseFloat(sellAmount.value);

    if(!amount || isNaN(amount)){
        rupiahPreview.innerText = "";
        return;
    }

    const token = sellToken.value;

    if(!prices[token]) return;

    const data = prices[token];

    let price = data.normal_price;

    // RULE MIN SELL
    if(amount < data.min_sell){
        price = data.below_min_price;
    }

    const total = amount * price;

    // ===============================
    // OUTPUT ESTIMATION
    // ===============================
    const selectedCurrency = currencySelect?.value || "idr";

    if(selectedCurrency.toLowerCase() === "usdt"){

        // pakai live rate dari config
        const usdtRate = window.APP_CONFIG?.CURRENCY?.RATE?.USDT || 15500;

        const usdt = total / usdtRate;

        rupiahPreview.innerText =
            usdt.toFixed(2) + " USDT";

    }else{

        rupiahPreview.innerText =
            "Rp " + total.toLocaleString("id-ID");

    }

    updatePreview(token, amount, total);

}
// =================================
// PREVIEW
// =================================

function updatePreview(token, amount, total){

    const mode = localStorage.getItem("dashboard_mode") || "sell";

    // ===============================
    // AMBIL TOKEN ICON DARI prices.json
    // ===============================

    let tokenIcon = "";

    if(prices[token] && prices[token].logo){
        tokenIcon = `<img src="${prices[token].logo}" class="tx-icon">`;
    }

    const usdtIcon = `<img src="images/usdt.png" class="tx-icon">`;

   // ===============================
// FORMAT CURRENCY
// ===============================
let moneyText = "";
let moneyHTML = "";

const selectedCurrency = currencySelect?.value?.toLowerCase() || "idr";

if(selectedCurrency === "usdt"){

    // ambil live rate dari config, fallback ke 15500 jika belum siap
    const usdtRate = window.APP_CONFIG?.CURRENCY?.RATE?.USDT || 15500;

    const usdt = total / usdtRate;

    moneyText = usdt.toFixed(2) + " USDT";
    moneyHTML = `${usdtIcon} ${moneyText}`;

}else{

    moneyText = "Rp " + total.toLocaleString("id-ID");
    moneyHTML = moneyText;

}

const tokenHTML = `${tokenIcon} ${amount} ${token.toUpperCase()}`;

    // ===============================
    // MODE SELL
    // ===============================

    if(mode === "sell"){

        if(previewSend){
            previewSend.innerHTML =
                amount > 0 ? tokenHTML : "-";
        }

        if(previewReceive){
            previewReceive.innerHTML = moneyHTML;
        }

    }

    // ===============================
    // MODE BUY
    // ===============================

    if(mode === "buy"){

        if(previewSend){
            previewSend.innerHTML = moneyHTML;
        }

        if(previewReceive){
            previewReceive.innerHTML =
                amount > 0 ? tokenHTML : "-";
        }

    }

    // ===============================
    // LOAD SELECTED ACCOUNT
    // ===============================

    const accounts =
        JSON.parse(localStorage.getItem("bw_accounts")) || [];

    const selected =
        localStorage.getItem("bw_selected");

    const account =
        accounts.find(a => a.id == selected) || {};

    if(previewPayment){
        previewPayment.innerText =
            (account.bank || "-") +
            " • " +
            (account.number || "-");
    }

    if(previewWallet){

        if(token === "SDA"){
            previewWallet.innerText =
                account.sidra || "-";
        }

        else if(token === "pi"){
            previewWallet.innerText =
                account.pi || "-";
        }

        else{
            previewWallet.innerText = "-";
        }

    }

}

function updateCurrencyIcon(){

    const icon = document.getElementById("currencyIcon");
    if(!icon || !currencySelect) return;

    if(currencySelect.value === "usdt"){
        icon.src = "images/usdt.png";
        icon.style.display = "inline";
    }else{
        icon.style.display = "none"; // IDR tidak pakai icon
    }

}
// =================================
// EVENT INPUT
// =================================

if(sellAmount){
    sellAmount.addEventListener("input", calculate);
}

if(sellToken){
    sellToken.addEventListener("change", calculate);
}


// =================================
// GENERATE TRANSACTION
// =================================

document.getElementById("generateBtn").onclick = () => {

    const amount = parseFloat(sellAmount.value);

    if(!amount){
        toast("Masukkan jumlah token");
        return;
    }

    const token = sellToken.value;

    if(token === "sidra"){

        const link =
            "https://www.sidrachain.com/wallets/send?to=" +
            sidraWallet +
            "&amount=" +
            amount +
            "&currency=SDA";

        generatedLink.innerHTML =
            `<a href="${link}" target="_blank">Kirim Sidra</a>`;

        generateQR(link);

    }

    addHistory({
        token: token,
        amount: amount,
        total: rupiahPreview.innerText
    });

    toast("Transaksi dibuat");

};


// ===============================
// LOAD ACCOUNT PREVIEW
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    updatePreview("-", 0, 0);

});

document.addEventListener("DOMContentLoaded", () => {

    updateCurrencyIcon();
    updateEstimation();

});