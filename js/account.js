// ===============================
// ACCOUNT & SETTINGS CONTROLLER
// ===============================

document.addEventListener("DOMContentLoaded", () => {


// ===============================
// ELEMENT
// ===============================

const accountBtn   = document.getElementById("openAccount");
const settingsBtn  = document.getElementById("openSettings");

const accountModal  = document.getElementById("accountModal");
const settingsModal = document.getElementById("settingsModal");

const paymentSelect = document.getElementById("paymentSelect");
const paymentLogo   = document.getElementById("paymentLogo");

const saveBtn = document.getElementById("saveAccount");

const nameInput    = document.getElementById("userName");
const accountInput = document.getElementById("accountNumber");
const sidraInput   = document.getElementById("sidraWallet");
const piInput      = document.getElementById("piWallet");
const addAccountBtn = document.getElementById("addAccount");
const accountList   = document.getElementById("accountList");

let accounts = JSON.parse(localStorage.getItem("bw_accounts")) || [];


// ===============================
// OPEN MODAL
// ===============================

if(accountBtn){

    accountBtn.onclick = () => {

    if(accountModal){
        accountModal.style.display = "flex";

        history.pushState(
            {accountModal:true},
            "",
            "#account"
        );
    }

    loadAccount();

};

}

if(settingsBtn){

    settingsBtn.onclick = () => {

    if(settingsModal){
        settingsModal.style.display = "flex";

        history.pushState(
            {settingsModal:true},
            "",
            "#settings"
        );
    }

};

}


// ===============================
// CLOSE MODAL CLICK OUTSIDE
// ===============================

window.onclick = (e) => {

    if(e.target === accountModal){
        accountModal.style.display = "none";
    }

    if(e.target === settingsModal){
        settingsModal.style.display = "none";
    }

};


async function initAccounts() {
    // tunggu load config + payments
    while(!window.CONFIG_READY || !window.PAYMENTS_READY) {
        await new Promise(r => setTimeout(r, 50));
    }

    const payments = window.PAYMENTS; // <-- ambil dari config.js

    // --------------------------
    // RENDER DROPDOWN BANK / EWALLET
    // --------------------------

    const selectedBank = document.getElementById("selectedBank");
    const selectedBankLogo = document.getElementById("selectedBankLogo");
    const selectedBankName = document.getElementById("selectedBankName");
    const bankOptions = document.getElementById("bankOptions");
    const bankSelect = document.getElementById("bankSelect");

    selectedBankLogo.src = "";
    selectedBankLogo.style.display = "none";
    selectedBankName.textContent = "Pilih Bank / E-Wallet";

    function renderBankOptions() {
        bankOptions.innerHTML = "";
        payments.forEach((p) => {
            const div = document.createElement("div");
            div.className = "bank-option";
            div.innerHTML = `<img src="${p.logo}" /> <span>${p.name}</span>`;
            div.onclick = () => {
                selectedBankLogo.src = p.logo;
                selectedBankLogo.style.display = "inline";
                selectedBankName.textContent = p.name;

                const paymentSelect = document.getElementById("paymentSelect");
                paymentSelect.value = p.name;

                if (typeof updatePlaceholder === "function") updatePlaceholder();
                bankOptions.style.display = "none";
            };
            bankOptions.appendChild(div);
        });
    }

    selectedBank.addEventListener("click", (e) => {
        e.stopPropagation();
        bankOptions.style.display = bankOptions.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
        if (!bankSelect.contains(e.target)) bankOptions.style.display = "none";
    });

    renderBankOptions();

    // --------------------------
    // LOAD PAYMENT DROPDOWN
    // --------------------------
    function loadPayments(){
        if(!bankSelect) return;
        const paymentSelect = document.getElementById("paymentSelect");
        paymentSelect.innerHTML = "";

        payments.forEach((p) => {
            const option = document.createElement("option");
            option.value = p.name;
            option.textContent = p.name;
            option.dataset.logo = p.logo;
            paymentSelect.appendChild(option);
        });

        if (typeof updateLogo === "function") updateLogo();
        if (typeof updatePlaceholder === "function") updatePlaceholder();
    }

    loadPayments();

    // --------------------------
    // RENDER ACCOUNTS
    // --------------------------
    window.renderAccounts = function() {
        const accountList = document.getElementById("accountList");
        if(!accountList) return;

        const accounts = JSON.parse(localStorage.getItem("bw_accounts")) || [];
        let selected = localStorage.getItem("bw_selected");

        if(accounts.length === 1 && !selected){
            localStorage.setItem("bw_selected", accounts[0].id);
            selected = accounts[0].id;
        }

        accountList.innerHTML = "";

        accounts.forEach((acc, index) => {
            const active = acc.id == selected;
            const bank = payments.find(p => p.name.toLowerCase() === acc.bank.toLowerCase());

            const div = document.createElement("div");
            div.className = "account-item";
            div.innerHTML = `
                <div class="acc-info">
                    <img class="bank-icon" src="${bank?.logo || 'images/payments/default.png'}">
                    <div>
                        <div class="acc-bank">${acc.bank}</div>
                        <div class="acc-number">${acc.number}</div>
                    </div>
                </div>
                <div class="acc-actions">
                    <button class="check-btn" onclick="selectAccount(${acc.id})">
                        <i class="fa-regular ${active ? 'fa-square-check' : 'fa-square'}"></i>
                    </button>
                    <button class="del-btn" onclick="removeAccount(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            accountList.appendChild(div);
        });
    };
}

initAccounts();
// ===============================
// UPDATE PAYMENT LOGO
// ===============================

function updateLogo(){

    if(!paymentSelect) return;

    const selected =
        paymentSelect.options[paymentSelect.selectedIndex];

    if(!selected) return;

    const logo = selected.dataset.logo;

    if(paymentLogo){

        paymentLogo.innerHTML =
        `<img src="${logo}" style="height:40px">`;

    }

}

paymentSelect.addEventListener("change", () => {

    updateLogo();
    updatePlaceholder();

});


// ===============================
// UPDATE PLACEHOLDER ACCOUNT
// ===============================

function updatePlaceholder(){

    if(!accountInput || !paymentSelect) return;

    const method = paymentSelect.value;

    if(method === "DANA" || method === "OVO" || method === "GOPAY"){

        accountInput.placeholder =
        "Contoh: 081234567890";

    }

    else if(
        method === "BCA" ||
        method === "BRI" ||
        method === "BNI" ||
        method === "MANDIRI"
    ){

        accountInput.placeholder =
        "Contoh: 1234567890 (Nomor Rekening)";

    }

    else{

        accountInput.placeholder =
        "Nomor rekening / ewallet";

    }

}

// ===============================
// ADD ACCOUNT
// ===============================

if(addAccountBtn){

addAccountBtn.onclick = () => {

    const bank = paymentSelect.value;
    const number = accountInput.value.trim();

    if(!number){
        alert("Isi nomor rekening dulu");
        return;
    }

    // reload data
    accounts = JSON.parse(localStorage.getItem("bw_accounts")) || [];

    // cek duplikat bank + nomor
    const exist = accounts.find(a => a.bank === bank && a.number === number);

    if(exist){
        alert("Akun ini sudah ada");
        return;
    }

    accounts.push({
    id: Date.now(),
    bank: bank,
    number: number
});

// auto select jika akun pertama
if(accounts.length === 1){

    localStorage.setItem("bw_selected",accounts[0].id);

}

    localStorage.setItem("bw_accounts",JSON.stringify(accounts));

    accountInput.value="";

    renderAccounts();


};

}
// ===============================
// AUTO FORMAT PHONE NUMBER
// ===============================

if(accountInput){

    accountInput.addEventListener("input", function(){

        let val = this.value.replace(/[^0-9]/g,"");

        if(val.startsWith("62")){
            val = "0" + val.substring(2);
        }

        this.value = val;

    });

}


// ===============================
// VALIDATE SIDRA WALLET
// ===============================

if(sidraInput){

    sidraInput.addEventListener("blur", function(){

        if(this.value && !this.value.startsWith("0x")){
            alert("Alamat SIDRA biasanya diawali 0x");
        }

    });

}


// ===============================
// VALIDATE PI WALLET
// ===============================

if(piInput){

    piInput.addEventListener("blur", function(){

        if(this.value && this.value.length < 20){
            alert("Alamat PI terlihat terlalu pendek");
        }

    });

}


// ===============================
// SAVE ACCOUNT DATA
// ===============================

if(saveBtn){

    saveBtn.onclick = () => {

        const name   = nameInput.value.trim();
        const acc    = accountInput.value.trim();
        const sidra  = sidraInput.value.trim();
        const pi     = piInput.value.trim();


        // VALIDASI SIDRA

        if(sidra && !sidra.startsWith("0x")){
            alert("Alamat SIDRA harus diawali 0x");
            return;
        }


        // VALIDASI PI

        if(pi && pi.length < 20){
            alert("Alamat PI tidak valid");
            return;
        }


        const data = {

            name: name,
            payment: paymentSelect.value,
            account: acc,
            sidra: sidra,
            pi: pi

        };


        localStorage.setItem(
            "bundawidya_account",
            JSON.stringify(data)
        );


        alert("Akun berhasil disimpan");


        if(accountModal){
            accountModal.style.display = "none";
        }


        // refresh preview jika ada

        if(typeof updatePreview === "function"){

            updatePreview(
                sellToken ? sellToken.value : "sidra",
                sellAmount ? parseFloat(sellAmount.value) || 0 : 0,
                0
            );

        }

    };

}


// ===============================
// LOAD ACCOUNT DATA
// ===============================

function loadAccount(){

    const data =
    JSON.parse(localStorage.getItem("bundawidya_account"));

    if(!data) return;

    if(nameInput)
        nameInput.value = data.name || "";

    if(accountInput)
        accountInput.value = data.account || "";

    if(sidraInput)
        sidraInput.value = data.sidra || "";

    if(piInput)
        piInput.value = data.pi || "";

    if(data.payment && paymentSelect){

        paymentSelect.value = data.payment;

        updateLogo();
        accounts = JSON.parse(localStorage.getItem("bw_accounts")) || [];

renderAccounts();

    }

}

});

window.removeAccount = function(index){

    let accounts = JSON.parse(localStorage.getItem("bw_accounts")) || [];
    let selected = localStorage.getItem("bw_selected");

    const removed = accounts[index]; // akun yang akan dihapus

    accounts.splice(index,1);

    localStorage.setItem(
        "bw_accounts",
        JSON.stringify(accounts)
    );

    // jika akun yang dihapus adalah yang sedang dicentang
    if(selected == removed?.id){

        if(accounts.length > 0){

            // otomatis pilih akun pertama
            localStorage.setItem("bw_selected", accounts[0].id);

        }else{

            // jika sudah tidak ada akun
            localStorage.removeItem("bw_selected");

        }

    }

    // refresh list
    if(typeof renderAccounts === "function"){
        renderAccounts();
    }

};

window.selectAccount = function(id){

    localStorage.setItem("bw_selected",id);

    renderAccounts();

};


const darkToggle = document.getElementById("darkToggle");

// ============================
// Load dark mode saat page dibuka
// ============================
const darkModeStored = localStorage.getItem("darkMode") === "true";

if(darkModeStored){
  document.body.classList.add("dark");
  darkToggle.checked = true; // sync toggle checkbox
}else{
  document.body.classList.remove("dark");
  darkToggle.checked = false;
}

// ============================
// Event toggle dark mode
// ============================
darkToggle.addEventListener("change", () => {
  if(darkToggle.checked){
    document.body.classList.add("dark");
    localStorage.setItem("darkMode", "true");
  }else{
    document.body.classList.remove("dark");
    localStorage.setItem("darkMode", "false");
  }
});
// ===============================
// BACK BUTTON MOBILE SUPPORT
// ===============================

window.addEventListener("popstate", () => {

const accountModal = document.getElementById("accountModal");
const settingsModal = document.getElementById("settingsModal");

if(accountModal && accountModal.style.display === "flex"){
accountModal.style.display = "none";
return;
}

if(settingsModal && settingsModal.style.display === "flex"){
settingsModal.style.display = "none";
return;
}

});

document.getElementById("clearStorageBtn").onclick = () => {

    const confirmClear = confirm(
        "⚠️ Semua data exchanger akan dihapus.\n\nLanjutkan?"
    );

    if(!confirmClear) return;

    // hapus data exchanger
    
    localStorage.removeItem("bundawidya_account");
    localStorage.removeItem("bw_accounts");
    localStorage.removeItem("bw_selected");
    localStorage.removeItem("bw_history");
    localStorage.removeItem("bw_user");
    localStorage.removeItem("bw_txid");

    alert("✅ Data exchanger berhasil dibersihkan");

    location.reload();

};