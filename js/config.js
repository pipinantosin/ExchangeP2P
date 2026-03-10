// ===============================
// GLOBAL CONFIG + PAYMENTS LOADER
// ===============================

window.APP_CONFIG = {};
window.CONFIG_READY = false;

window.PAYMENTS = [];
window.PAYMENTS_READY = false;

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
            PRICES: {
                SIDRA: pricesData.sidra,
                PI: pricesData.pi
            }
        };
        window.CONFIG_READY = true;
        console.log("CONFIG LOADED", window.APP_CONFIG);

        // --- Load payments.json ---
        const resPayments = await fetch("./data/payments.json");
        if (!resPayments.ok) throw new Error("payments.json tidak ditemukan");
        const paymentsData = await resPayments.json();

        // Save global payments
        window.PAYMENTS = paymentsData.map(p => ({
            name: p.name,
            logo: p.logo,
            type: p.type
        }));
        window.PAYMENTS_READY = true;
        console.log("PAYMENTS LOADED", window.PAYMENTS);

    } catch (err) {
        console.error("Gagal load config/payments:", err);
    }
})();