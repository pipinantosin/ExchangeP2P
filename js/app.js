let dashboardMode = localStorage.getItem("dashboardMode") || "sell";

// ===============================
// DARK MODE
// ===============================

const toggle = document.getElementById("darkToggle");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

if (toggle) {

    toggle.onclick = () => {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme","dark");
        } else {
            localStorage.setItem("theme","light");
        }

    };

}


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
// INIT
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const tokenSelect = document.getElementById("sellToken");
    const tokenLogo   = document.getElementById("tokenLogo");
    const amountInput = document.getElementById("sellAmount");


    // ===============================
    // DEFAULT TOKEN SIDRA
    // ===============================

    if(tokenSelect){
        tokenSelect.value = "sidra";
    }



    // ===============================
    // RENDER HISTORY
    // ===============================

    if(typeof renderHistory === "function"){
        renderHistory();
    }


  


    updateTokenLogo();


    // ===============================
    // EVENT INPUT
    // ===============================

    if(amountInput){

        amountInput.addEventListener("input", () => {

            if(typeof updateEstimation === "function"){
                updateEstimation();
            }

            if(typeof calculate === "function"){
                calculate();
            }

        });

    }


    // ===============================
    // TOKEN CHANGE
    // ===============================

    if(tokenSelect){

        tokenSelect.addEventListener("change", () => {

            updateTokenLogo();

            if(typeof updateEstimation === "function"){
                updateEstimation();
            }

            if(typeof calculate === "function"){
                calculate();
            }

        });

    }


    // ===============================
    // RUN CALCULATION FIRST LOAD
    // ===============================

    if(typeof calculate === "function"){
        calculate();
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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(registration => {
        console.log("Service Worker registered:", registration.scope);
      })
      .catch(err => {
        console.log("Service Worker registration failed:", err);
      });
  });
}


const API_URL = "https://script.google.com/macros/s/AKfycbz1_5a_iSjvMwaCOFzjJvtiemWXKXydLJkhG3VUYDa7c-MAT-ibEFGN6NFjykzGyBGG/exec";

async function checkHash(hash){

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "checkHash",
      hash: hash
    })
  });

  return await res.json();
}

async function saveTx(data){

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "save",
      ...data
    })
  });

}



