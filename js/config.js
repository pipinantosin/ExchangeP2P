// ===============================
// GLOBAL CONFIG + PAYMENTS LOADER
// ===============================

window.APP_CONFIG = {};
window.CONFIG_READY = false;

window.PAYMENTS = [];
window.PAYMENTS_READY = false;


// ===============================
// LOAD CONFIG
// ===============================

(async function loadGlobalConfig() {
    try {

        // --- Load prices.json ---
        const resPrices = await fetch("./data/prices.json");
        if (!resPrices.ok) throw new Error("prices.json tidak ditemukan");
        const pricesData = await resPrices.json();

        window.APP_CONFIG = {

            WHATSAPP: { DEFAULT: pricesData.wa_number },

            WALLETS: {
                SIDRA: pricesData.wallets?.sidra,
                PI: pricesData.wallets?.pi
            },

            TOKENS: {
                SIDRA: {
                    symbol: pricesData.sidra.name,
                    price: pricesData.sidra.normal_price,
                    logo: pricesData.sidra.logo
                },
                PI: {
                    symbol: pricesData.pi.name,
                    price: pricesData.pi.normal_price,
                    logo: pricesData.pi.logo
                }
            },

            // ===============================
            // CURRENCY SYSTEM
            // ===============================

            CURRENCY: {

                DEFAULT: "IDR",

                RATE: {
    IDR: 1,
    USD: 1,
    USDT: 1,
    PI: 1,
    EUR: 1,
    CNY: 1,
    MYR: 1,
    VND: 1,
    SAR: 1,
    AED: 1,
    GBP: 1,
    // tambahkan mata uang lain sesuai kebutuhan
}

            }

        };

        window.CONFIG_READY = true;
        console.log("CONFIG LOADED", window.APP_CONFIG);


        // ===============================
        // LOAD PAYMENTS
        // ===============================

        const resPayments = await fetch("./data/payments.json");
        if (!resPayments.ok) throw new Error("payments.json tidak ditemukan");
        const paymentsData = await resPayments.json();

        window.PAYMENTS = paymentsData.map(p => ({
            name: p.name,
            logo: p.logo,
            type: p.type
        }));

        window.PAYMENTS_READY = true;

        console.log("PAYMENTS LOADED", window.PAYMENTS);


        // ===============================
        // LOAD ONLINE RATE
        // ===============================

        loadOnlineRates();


    } catch (err) {
        console.error("Gagal load config/payments:", err);
    }
})();


// ======================================
// LOAD ONLINE CURRENCY RATE
// ======================================

window.loadOnlineRates = function () {

    const CACHE_KEY = "currencyRatesCache";
    const TTL = 1000 * 60 * 60 * 6; // 6 jam

    try {

        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");

        if (cached.time && Date.now() - cached.time < TTL && cached.data) {

            APP_CONFIG.CURRENCY.RATE = Object.assign(
                {},
                APP_CONFIG.CURRENCY.RATE,
                cached.data
            );

            console.log("Currency rate from cache:", cached.data);

            return;

        }

    } catch (e) {}



    const API = "https://open.er-api.com/v6/latest/IDR";


    fetch(API)
        .then(r => r.json())
        .then(res => {

            if (!res || !res.rates) return;

            const map = {};

            const supportedCurrencies = ["USD","USDT","EUR","CNY","MYR","VND","SAR","AED","GBP"];

supportedCurrencies.forEach(cur => {
    if(res.rates[cur]){
        map[cur] = Number((1 / res.rates[cur]).toFixed(4));

        // Khusus USDT, biar sama rate USD
        if(cur === "USD") map["USDT"] = map["USD"];
    }
});

            APP_CONFIG.CURRENCY.RATE = Object.assign(
                {},
                APP_CONFIG.CURRENCY.RATE,
                map
            );

            localStorage.setItem(CACHE_KEY, JSON.stringify({
                time: Date.now(),
                data: map
            }));

            console.log("Currency rate updated:", map);

        })
        .catch(err => console.warn("Rate online gagal, pakai lokal", err));

};


// ======================================
// FORMAT PRICE BY CURRENCY
// ======================================

window.formatPriceByCurrency = function(priceIdr, currency){

    const cfg = APP_CONFIG.CURRENCY;

    const cur = (currency || cfg.DEFAULT).toUpperCase();

    if(cur === "IDR"){

        return "Rp " + Number(priceIdr).toLocaleString("id-ID");

    }

    const rate = cfg.RATE[cur];

    if(!rate){

        return "Rp " + Number(priceIdr).toLocaleString("id-ID");

    }

    const converted = priceIdr / rate;

    if(cur === "PI"){

        return "PI " + converted.toFixed(2);

    }

    return cur + " " + converted.toFixed(2);

};


// ======================================
// GET SELECTED CURRENCY
// ======================================

window.getSelectedCurrency = function(){

    return localStorage.getItem("currency") || "IDR";

};