// ===============================
// INIT PROVIDER
// ===============================
const RPC_URL = "https://node.sidrachain.com/";
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// ===============================
// FORMAT BALANCE DENGAN TITIK RIBU
// ===============================
function formatNumber(value) {
    return Number(value).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ===============================
// LOAD BALANCE SDA DINAMIS
// ===============================
async function loadSdaBalance() {
    const balanceEl = document.getElementById("sda-stock-value");
    const walletIconEl = document.getElementById("sda-wallet-icon");

    if (!balanceEl || !walletIconEl) return;

    balanceEl.textContent = "Loading...";

    // Tunggu sampai config siap
    while (!window.CONFIG_READY) {
        await new Promise(r => setTimeout(r, 50));
    }

    const SDA_WALLET = window.APP_CONFIG.WALLETS.SIDRA; // ambil dari prices.json
    walletIconEl.addEventListener("click", () => {
        navigator.clipboard.writeText(SDA_WALLET);
        alert("Wallet SDA disalin: " + SDA_WALLET);
    });

    try {
        const balBN = await provider.getBalance(SDA_WALLET);
        const balEther = ethers.utils.formatEther(balBN);
        balanceEl.textContent = formatNumber(balEther);
    } catch (err) {
        console.error("Gagal load SDA balance:", err);
        balanceEl.textContent = "Error";
    }
}

// ===============================
// AUTO LOAD
// ===============================
document.addEventListener("DOMContentLoaded", loadSdaBalance);