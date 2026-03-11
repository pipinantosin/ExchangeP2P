// ===============================
// HELPER
// ===============================

function formatDate(ts){
return new Date(ts*1000).toLocaleString(
"id-ID",
{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}
);
}


// ===============================
// ELEMENTS
// ===============================
const sellAmountInput = document.getElementById("sellAmount");
const generateBtn     = document.getElementById("generateBtn");
const generatedLinkEl = document.getElementById("generatedLink");
const linkSection     = document.getElementById("linkSection");
const txHashInput     = document.getElementById("txHashInput");
const verifyBtn       = document.getElementById("verifyTxBtn");
const sendWAButton    = document.getElementById("sendVerifiedWA");

const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const step4 = document.getElementById("step4");

// ===============================
// WORKFLOW HELPER
// ===============================
function clearWorkflow(){
  generateBtn?.classList.remove("workflow-blink");
  generatedLinkEl?.classList.remove("workflow-blink");
  verifyBtn?.classList.remove("workflow-blink");
  sendWAButton?.classList.remove("workflow-blink");
}

function highlightGenerate(){ clearWorkflow(); generateBtn?.classList.add("workflow-blink"); }
function highlightLink(){ clearWorkflow(); generatedLinkEl?.classList.add("workflow-blink"); }
function highlightVerify(){ clearWorkflow(); verifyBtn?.classList.add("workflow-blink"); }
function highlightWA(){ clearWorkflow(); sendWAButton?.classList.add("workflow-blink"); }

// ===============================
// STEP 1: INPUT AMOUNT
// ===============================
sellAmountInput.addEventListener("input", () => {
  const amount = parseFloat(sellAmountInput.value);
  if(amount && amount > 0){
    generateBtn.disabled = false;
    step1?.classList.add("active");
    highlightGenerate();
  } else {
    generateBtn.disabled = true;
    step1?.classList.remove("active");
  }
});

// ===============================
// STEP 2: CLICK GENERATE
// ===============================
generateBtn.addEventListener("click", () => {
  step2?.classList.add("active");
  linkSection.style.display = "block"; // pastikan link terlihat
  highlightLink();

  // generate link
  const token = document.getElementById("sellToken").value;
  const amount = parseFloat(sellAmountInput.value);
  const sidraWallet = window.APP_CONFIG?.WALLETS?.SIDRA || "0x";
  const link = `https://www.sidrachain.com/wallets/send?to=${sidraWallet}&amount=${amount}&currency=SDA`;

  generatedLinkEl.href = link;

  if(typeof QRCode === "function"){
    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"), {
      text: link,
      width: 150,
      height: 150
    });
  }
});

// ===============================
// STEP 3: CLICK LINK
// ===============================
generatedLinkEl.addEventListener("click", () => {
  txHashInput.disabled = false;
  verifyBtn.disabled = false;
  step3?.classList.add("active");
  highlightVerify();
});

// ===============================
// STEP 4: VERIFY HASH
// ===============================
verifyBtn.addEventListener("click", async () => {
  const txHash = txHashInput.value.trim();
  const verifyMessage = document.getElementById("verifyMessage");

  if(!txHash) return alert("Masukkan hash transaksi");

  verifyMessage.innerText = "Memverifikasi...";
  verifyMessage.style.color = "black";

  try {
    // verifikasi transaksi blockchain
    const tx = await verifyTxFull(txHash);
    window.VERIFIED_TX = tx;
    
    const token = document.getElementById("sellToken").value;
const price = getTokenPrice(token, tx.value); // ambil harga token
const receive = tx.value * price;

document.getElementById("previewSend").innerText = tx.value + " " + token.toUpperCase();
document.getElementById("previewReceive").innerText = "Rp " + receive.toLocaleString("id-ID");
document.getElementById("previewWallet").innerText = tx.from;

const accounts = JSON.parse(localStorage.getItem("bw_accounts")) || [];
const selected = localStorage.getItem("bw_selected");
const account = accounts.find(a => a.id == selected) || {};

document.getElementById("previewPayment").innerText =
  (account.bank || "-") + " • " + (account.number || "-");

    verifyMessage.innerText = "Transaksi valid ✅";
    verifyMessage.style.color = "green";

    step4?.classList.add("active");
    sendWAButton.style.display = "block";
    highlightWA();

  } catch (e) {
    console.error(e);
    verifyMessage.innerText = e.toString();
    verifyMessage.style.color = "red";
    sendWAButton.style.display = "none";
  }
});

// ===============================
// CLICK WA BUTTON
// ===============================
sendWAButton.addEventListener("click", () => {
  const tx = window.VERIFIED_TX;
  if(!tx) return alert("Transaksi belum diverifikasi!");

  // ambil account
  const accounts = JSON.parse(localStorage.getItem("bw_accounts")) || [];
  const selected = localStorage.getItem("bw_selected");
  const account = accounts.find(a => a.id == selected);

  if(!account?.bank || !account?.number){
    alert("Isi rekening pembayaran dulu di tombol DOMPET");
    const modal = document.getElementById("accountModal");
    if(modal) modal.style.display = "flex";
    return;
  }

  // generate WA text
  const text = window.generateVerifiedText(tx);
  window.openWA(text);

  // reset UI
  sendWAButton.style.display = "none";
  txHashInput.value = "";
  document.getElementById("txVerifyCard").style.display = "none";
});