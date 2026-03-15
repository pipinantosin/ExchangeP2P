function getLang(){
return localStorage.getItem("lang") || "id";
}

function t(key){
const lang = getLang();
return LANG_DATA?.[lang]?.[key] || key;
}

// ===============================
// OPEN INFO MODAL
// ===============================

function openInfo(type){

const modal = document.getElementById("infoModal");
const content = document.getElementById("infoContent");

modal.style.display = "flex";

// Tunggu config siap
const waitConfig = () => new Promise(r=>{
if(window.CONFIG_READY) r();
else setTimeout(()=>waitConfig().then(r),50);
});

waitConfig().then(()=>{

if(type === "scam"){

content.innerHTML = `
<h3>${t("scam_title")}</h3>
<ul>
<li>${t("scam_1")}</li>
<li>${t("scam_2")}</li>
<li>${t("scam_3")}</li>
</ul>
`;

}

// ===============================
// WALLET
// ===============================

if(type === "wallet"){

const sdaWallet = window.APP_CONFIG.WALLETS.SIDRA;
const piWallet = window.APP_CONFIG.WALLETS.PI;

content.innerHTML = `
<h3>${t("wallet_title")}</h3>

<p><b>Sidra</b></p>
<p>${sdaWallet}</p>

<p><b>Pi</b></p>
<p>${piWallet}</p>
`;

}

// ===============================
// CONTACT
// ===============================

if(type === "contact"){

const waNumber = window.APP_CONFIG.WHATSAPP.DEFAULT;

content.innerHTML = `
<h3>${t("contact_title")}</h3>

<p>WhatsApp : ${waNumber}</p>
<p>Telegram : @Victory_Pi</p>
<p>Facebook : Alexandria Pi Network</p>
`;

}

// ===============================
// GUIDE
// ===============================

if(type === "guide"){

content.innerHTML = `
<h3>${t("guide_title")}</h3>

<ol>
<li>${t("guide_1")}</li>
<li>${t("guide_2")}</li>
<li>${t("guide_3")}</li>
<li>${t("guide_4")}</li>
<li>${t("guide_5")}</li>
</ol>
`;

}

});

}

// ===============================
// CLOSE MODAL
// ===============================

function closeInfo(){
document.getElementById("infoModal").style.display="none";
}