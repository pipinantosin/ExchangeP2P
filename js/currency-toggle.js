window.currencySelect = document.getElementById("currencySelect");

if (window.currencySelect) {
    window.currencySelect.addEventListener("change", () => {
        localStorage.setItem("selectedCurrency", window.currencySelect.value);

        // ✨ Tambahkan baris ini supaya ticker & estimation update langsung
        updateEstimation();
        renderTicker();
    });
}

currencySelect.addEventListener("change", ()=>{

let value = parseFloat(document.getElementById("sellAmount").value) || 0;

let price = window.PRICE?.SDA || 0; // harga token
let usdtRate = window.PRICE?.USDT_IDR || 15500;

let rupiah = value * price;

if(currencySelect.value === "idr"){

document.getElementById("rupiahPreview").innerText =
"Rp " + rupiah.toLocaleString("id-ID");

}else{

let usdt = rupiah / usdtRate;

document.getElementById("rupiahPreview").innerText =
usdt.toFixed(2);

}

});