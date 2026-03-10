// ===============================
// BUNDAWIDYA HISTORY SYSTEM PREMIUM
// ===============================

const HISTORY_KEY = "bw_history";

// GET HISTORY
function getHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
    catch { return []; }
}

// SAVE HISTORY
function saveHistory(data) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(data));
}

// ADD HISTORY
function addHistory(tx) {
    if(!tx?.hash) return;

    let history = getHistory();
    if(history.some(h=>h.hash===tx.hash)) return;

    const order = {
        id: tx.id || generateOrderID(tx.hash),
        hash: tx.hash,
        from: tx.from || "-",
        token: (tx.token || "SDA").toUpperCase(),
        amount: Number(tx.value || tx.amount || 0),
        total: Number(tx.total || 0),
        status: tx.status || "waiting",
        date: Date.now()
    };

    history.unshift(order);
    saveHistory(history);
    renderHistory();
}

// REMOVE HISTORY
function removeHistory(hash){
    let history = getHistory();
    history = history.filter(h=>h.hash!==hash);
    saveHistory(history);
    renderHistory();
}

// UPDATE BADGE
function updateHistoryBadge(){
    const badge = document.getElementById("historyBadge");
    if(!badge) return;
    badge.innerText = getHistory().length;
}

// RENDER HISTORY
function renderHistory(){
    const container = document.getElementById("history");
    if(!container) return;
    const history = getHistory();
    container.innerHTML="";

    if(history.length===0){
        container.innerHTML='<div class="history-empty">Belum ada transaksi</div>';
        updateHistoryBadge();
        return;
    }

    history.forEach(tx=>{
        const id = tx.id || "-";
        const token = tx.token || "-";
        const amount = tx.amount || 0;
        const total = tx.total || 0;
        const hash = tx.hash || "-";
        const status = tx.status || "waiting";
        const date = tx.date ? new Date(tx.date).toLocaleString("id-ID") : "-";
        const wallet = tx.from || "-";

        const card = document.createElement("div");
        card.className = "history-card";
        card.innerHTML = `
            <div class="history-row">
                <span class="history-id">${id}</span>
                <span class="history-status status-${status}">${status}</span>
            </div>
            <div class="history-row history-mid">
                <span class="history-token">${amount} ${token}</span>
                <span class="history-rp">Rp ${Number(total).toLocaleString("id-ID")}</span>
            </div>
            <div class="history-bottom">
                <span class="history-wallet">${wallet}</span>
                <span class="history-date">${date}</span>
            </div>
            <div class="history-actions">
                <button class="copyBtn"><i class="fa-regular fa-copy"></i> Copy Hash</button>
                <button class="waBtn"><i class="fa-brands fa-whatsapp"></i> Send WA</button>
                <button class="removeBtn"><i class="fa-solid fa-trash"></i> Hapus</button>
            </div>
        `;
        container.appendChild(card);

        const USER = JSON.parse(localStorage.getItem("bundawidya_account")) || {};

        card.querySelector(".copyBtn").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(hash);
        alert("Hash berhasil dicopy!");
    } catch (err) {
        console.error("Gagal copy hash:", err);
        alert("Gagal copy hash. Silakan coba manual.");
    }
});
        card.querySelector(".waBtn").addEventListener("click",()=>{
            const waNumber = window.APP_CONFIG?.WHATSAPP?.DEFAULT || "6200000000000";
            const receiverWallet = (token.toLowerCase()==="sidra") ? window.APP_CONFIG?.WALLETS?.SIDRA||"-" : window.APP_CONFIG?.WALLETS?.PI||"-";

            // Template WA profesional, sopan, ringkas
            const waText = `
🟢 *CEK TRANSAKSI BW EXCHANGER*

🔹 *ID Transaksi:* ${id}
🔹 *Hash Blockchain:* ${hash}
🔹 *Wallet Pengirim:* ${wallet}

🪙 *Token:* ${amount} ${token}
💰 *Estimasi Rupiah:* Rp ${Number(total).toLocaleString("id-ID")}

👤 *Nama Pengirim:* ${USER.name || "-"}

🙏 Mohon ditindaklanjuti segera, terima kasih.
`;

            window.open(
                `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`,
                "_blank"
            );
        });
        card.querySelector(".removeBtn").addEventListener("click",()=>{if(confirm("Hapus transaksi ini dari history?")) removeHistory(hash);});
    });

    updateHistoryBadge();
}

// OPEN/CLOSE PANEL
function initHistoryPanel(){
    const btn = document.getElementById("openHistory");
    const panel = document.querySelector(".history-panel");
    const closeBtn = document.querySelector(".history-header .closeHistory");
    if(!btn || !panel) return;
    btn.addEventListener("click",()=>panel.classList.add("open"));
    if(closeBtn) closeBtn.addEventListener("click",()=>panel.classList.remove("open"));
}

// INIT
document.addEventListener("DOMContentLoaded",()=>{
    renderHistory();
    initHistoryPanel();
});