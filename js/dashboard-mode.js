// ===============================
// DASHBOARD MODE CONTROLLER
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const modeSelect = document.getElementById("modeSelect");
    const dashboard = document.querySelector(".dashboard");
    const title = document.querySelector(".card h2");
    const generateBtn = document.getElementById("generateBtn");
    const estimateLabel = document.getElementById("estimateLabel");

    function applyMode(mode){

        if(mode === "buy"){

            dashboard.classList.add("buy-mode");
            dashboard.classList.remove("sell-mode");

            if(title){
                title.innerHTML =
                '<i class="fa-solid fa-arrow-up"></i> Beli Token';
            }

            if(generateBtn){
                generateBtn.textContent = "Buat Order Pembelian";
            }

            if(estimateLabel){
                estimateLabel.textContent = "Estimasi dibayar";
            }

        }else{

            dashboard.classList.add("sell-mode");
            dashboard.classList.remove("buy-mode");

            if(title){
                title.innerHTML =
                '<i class="fa-solid fa-arrow-down"></i> Jual Token';
            }

            if(generateBtn){
                generateBtn.textContent = "Membuat Transaksi";
            }

            if(estimateLabel){
                estimateLabel.textContent = "Estimasi diterima";
            }

        }

        localStorage.setItem("dashboard_mode", mode);
    }

    // saat dropdown berubah
    if(modeSelect){
        modeSelect.addEventListener("change", () => {
            applyMode(modeSelect.value);
        });
    }

    // load mode saat halaman dibuka
    const savedMode = localStorage.getItem("dashboard_mode") || "sell";

    if(modeSelect){
        modeSelect.value = savedMode;
    }

    applyMode(savedMode);

});