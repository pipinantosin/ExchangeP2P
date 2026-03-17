const RPC_URL = "https://node.sidrachain.com/";
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// ======================
// REQUEST NOTIFICATION PERMISSION
// ======================
if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
        console.log("Notification permission:", permission);
    });
}

// ======================
// FORMAT ANGKA
// ======================
function formatNumber(v){
  return Number(v).toLocaleString("id-ID",{minimumFractionDigits:2,maximumFractionDigits:2});
}

// ======================
// TOAST
// ======================
function showToast(msg){
  let container = document.getElementById("toast-container");
  if(!container){
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.position = "fixed";
    container.style.top = "10px";
    container.style.right = "10px";
    container.style.zIndex = "9999";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.style.background = "#333";
  toast.style.color = "#fff";
  toast.style.padding = "8px 12px";
  toast.style.marginTop = "6px";
  toast.style.borderRadius = "6px";
  toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(()=>toast.remove(),4000);
}

// ======================
// PUSH NOTIFICATION
// ======================
function showPushNotification(title, msg) {
    if ('serviceWorker' in navigator && Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(reg => {
            reg.showNotification(title, {
                body: msg,
                icon: 'images/sda.png'
            });
        });
    }
}

// ======================
// LOAD SDA BALANCE
// ======================
async function loadSdaBalance(){
  const el = document.getElementById("sda-stock-value");
  const wallet = window.APP_CONFIG.WALLETS.SIDRA;

  document.getElementById("sda-wallet-icon").onclick = ()=>{
    navigator.clipboard.writeText(wallet);
    showToast("SDA wallet copied!");
  };

  try{
    const balBN = await provider.getBalance(wallet);
    const bal = ethers.utils.formatEther(balBN);
    el.textContent = formatNumber(bal);
  }catch(e){
    el.textContent = "Error";
    console.log("SDA balance error:", e);
  }
}

// ======================
// LOAD PI BALANCE
// ======================
async function loadPiBalance(){
  const el = document.getElementById("pi-stock-value");
  const wallet = window.APP_CONFIG.WALLETS.PI;

  document.getElementById("pi-wallet-icon").onclick = ()=>{
    navigator.clipboard.writeText(wallet);
    showToast("PI wallet copied!");
  };

  if(wallet.startsWith("M")){
    el.textContent="Sub Address";
    return;
  }

  try{
    const res = await fetch(`https://api.mainnet.minepi.com/accounts/${wallet}`);
    if(!res.ok){ el.textContent="Wallet Error"; return; }
    const data = await res.json();
    let bal = 0;
    if(data.balances) data.balances.forEach(b=>{if(b.asset_type==="native") bal=b.balance;});
    el.textContent = formatNumber(bal);
  }catch(e){
    el.textContent = "Network Error";
    console.log("PI balance error:", e);
  }
}

// ======================
// DETEKSI SDA MASUK
// ======================
let lastBlock = 0;
let seenTx = new Set();

async function detectSDAIncoming(){
    const wallet = window.APP_CONFIG.WALLETS.SIDRA;
    if(!wallet) return;

    try{
        const block = await provider.getBlockNumber();
        if(lastBlock === 0){ lastBlock = block; return; }

        for(let i = lastBlock + 1; i <= block; i++){
            const blk = await provider.getBlockWithTransactions(i);
            blk.transactions.forEach(tx => {
                if(tx.to && tx.to.toLowerCase() === wallet.toLowerCase()){
                    if(seenTx.has(tx.hash)) return;
                    seenTx.add(tx.hash);
                    const amount = ethers.utils.formatEther(tx.value);

                    // Toast saat tab aktif
                    showToast(` Dana Masuk SDA: ${formatNumber(amount)}`);

                    // Push notification
                    showPushNotification('Dana Masuk SDA', ` ${formatNumber(amount)} SDA masuk`);

                    console.log("SDA TX:", tx);
                }
            });
        }

        lastBlock = block;
    }catch(e){
        console.log("SDA detect error:", e);
    }
}

// ======================
// INIT STOCK PANEL
// ======================
async function initStockPanel(){
  while(!window.CONFIG_READY){
    await new Promise(r => setTimeout(r,50));
  }

  loadSdaBalance();
  loadPiBalance();

  // AUTO REFRESH BALANCE
  setInterval(()=>{
    loadSdaBalance();
    loadPiBalance();
  },15000);

  // DETEKSI TRANSAKSI MASUK SDA
  setInterval(detectSDAIncoming,8000);
}

document.addEventListener("DOMContentLoaded", initStockPanel);