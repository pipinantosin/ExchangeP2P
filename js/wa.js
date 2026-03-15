// ===============================
// WA.JS FINAL - CENTRALIZED CONFIG
// Template terbaru BW EXCHANGER
// ===============================

function isHashUsed(hash){

    try{
        const history =
        JSON.parse(localStorage.getItem("bw_history")) || [];

        return history.some(tx => tx.hash === hash);

    }catch{
        return false;
    }

}

(function () {

    // ===============================
    // CONFIG
    // ===============================

    function getWANumber() {
        return window.APP_CONFIG?.WHATSAPP?.DEFAULT || "";
    }

    function getReceiverWallet(token) {

        if (!window.APP_CONFIG) return "-";

        if (token === "sidra")
            return window.APP_CONFIG.WALLETS?.SIDRA || "-";

        if (token === "pi")
            return window.APP_CONFIG.WALLETS?.PI || "-";

        return "-";
    }


    // ===============================
    // LOAD USER PROFILE
    // ===============================

    function getUser() {

        try {
            return JSON.parse(localStorage.getItem("bw_user")) || {};
        } catch {
            return {};
        }

    }


    // ===============================
    // LOAD SELECTED ACCOUNT
    // ===============================

    function getSelectedAccount() {

        try {

            const accounts =
                JSON.parse(localStorage.getItem("bw_accounts")) || [];

            const selected =
                localStorage.getItem("bw_selected");

            return accounts.find(a => a.id == selected) || {};

        } catch {
            return {};
        }

    }


    // ===============================
    // GENERATE ID TRANSAKSI DARI HASH
    // ===============================

    function generateTxIDFromHash(hash){

    if(!hash || hash === "-")
        return "BW-UNKNOWN";

    return "BW-" + hash.slice(0,6).toUpperCase();
}


    // ===============================
    // OPEN WHATSAPP
    // ===============================

    window.openWA = function (text) {

        if (!text) return;

        const number = getWANumber();

        if (!number) {

            console.warn("WA number belum ada di config");
            return;

        }

        const url =
            "https://wa.me/" +
            number +
            "?text=" +
            encodeURIComponent(text);

        window.open(url, "_blank");

    };


    // ===============================
    // TEMPLATE VERIFIED
    // ===============================
function formatTxDate(ts){

    if(!ts) return "-";

    return new Date(ts * 1000).toLocaleString("id-ID",{
        day:"2-digit",
        month:"short",
        year:"numeric",
        hour:"2-digit",
        minute:"2-digit"
    });

}

    window.generateVerifiedText = function (tx) {

        const account = getSelectedAccount();
        const user =
JSON.parse(localStorage.getItem("bundawidya_account")) || {};

        const token =
            tx?.token ||
            document.getElementById("sellToken")?.value ||
            "-";

        const amount =
    tx?.value
        ? tx.value + " " + (tx.token || token).toUpperCase()
        : "-";

const receive =
    tx?.total
        ? "Rp " + Number(tx.total).toLocaleString("id-ID")
        : (document.getElementById("previewReceive")?.innerText || "-");

        const senderWallet =
            tx?.from ||
            document.getElementById("previewWallet")?.innerText ||
            "-";

        const hash =
            tx?.hash ||
            document.getElementById("txHashInput")?.value ||
            "-";
            
            const explorerLink =
hash && hash !== "-"
? (
    token?.toLowerCase() === "pi"
    ? "https://blockexplorer.minepi.com/tx/" + hash
    : "https://ledger.sidrachain.com/tx/" + hash
  )
: "-";
            
            const date =
    tx?.timestamp
    ? formatTxDate(tx.timestamp)
    : "-";

        const receiverWallet =
            getReceiverWallet(token);

        const id =
            generateTxIDFromHash(hash);

const shortHash = hash
? hash.slice(0,10) + "..." + hash.slice(-6)
: "-";

        return `🟢 *TRANSAKSI BARU - BW EXCHANGER*

🔹 ID Transaksi
${id}

🔹 Hash
${shortHash}

🕒 Waktu
${date}

━━━━━━━━━━━━━━━

💼 Wallet Pengirim
${senderWallet}

🪙 Token
${amount}

💰 Estimasi Rupiah
${receive}

📤 Wallet Exchanger
${receiverWallet}

━━━━━━━━━━━━━━━

💳 Metode Pembayaran
${account.bank || "-"}

🏦 Rekening / E-Wallet
${account.number || "-"}

👤 Nama
${user.name || "-"}

🔎 Explorer
${explorerLink}

━━━━━━━━━━━━━━━

🙏 Mohon diproses ya Bun.
Terima kasih 🙏

🌐 Dashboard
https://bit.ly/bundawidya-exchange`;
};


    // ===============================
    // TOMBOL WA VERIFIED
    // ===============================

    const sendVerifiedWA =
        document.getElementById("sendVerifiedWA");

    if (sendVerifiedWA) {

    sendVerifiedWA.addEventListener("click", () => {

        const tx = window.VERIFIED_TX;

        if (!tx) {

            if (typeof showWarning === "function") {
                showWarning("Transaksi belum diverifikasi!");
            } else {
                alert("Transaksi belum diverifikasi!");
            }

            return;
        }

        const account = getSelectedAccount();

        // ===============================
        // VALIDASI REKENING
        // ===============================

        if (!account || !account.bank || !account.number) {

            if (typeof showWarning === "function") {
                showWarning("Isi rekening pembayaran dulu di tombol DOMPET");
            } else {
                alert("Isi rekening pembayaran dulu di tombol DOMPET");
            }

            const modal = document.getElementById("accountModal");
            if (modal) modal.style.display = "flex";

            return;
        }

        const user =
            JSON.parse(localStorage.getItem("bundawidya_account")) || {};

       // ===============================
// SIMPAN HISTORY
// ===============================

if (typeof addHistory === "function") {

    addHistory({

        id: generateTxIDFromHash(tx.hash),
        hash: tx.hash,
        from: tx.from,
        token: tx.token,
        amount: tx.value,
        total: tx.total,
        status: "valid",
        payment: account.bank || "-",
        account: account.number || "-",
        name: user.name || "-",
        date: tx.timestamp * 1000

    });

}


        // ===============================
        // GENERATE TEXT WA
        // ===============================

        const text = generateVerifiedText(tx);

        openWA(text);

        // ===============================
        // RESET UI
        // ===============================

        sendVerifiedWA.style.display = "none";

        const hashInput = document.getElementById("txHashInput");
        if (hashInput) hashInput.value = "";

        const verifyCard = document.getElementById("txVerifyCard");
        if (verifyCard) verifyCard.style.display = "none";

    });

}
})();