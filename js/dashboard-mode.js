// ===============================
// DASHBOARD MODE CONTROLLER
// ===============================

document.addEventListener("DOMContentLoaded", () => {

const dashboard = document.querySelector(".dashboard");
const title = document.querySelector(".card h2");
const generateBtn = document.getElementById("generateBtn");
const estimateLabel = document.getElementById("estimateLabel");
const modeButtons = document.querySelectorAll(".mode-btn");

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


// ===============================
// TOGGLE BUTTON
// ===============================

modeButtons.forEach(btn => {

    btn.addEventListener("click", () => {

        const mode = btn.dataset.mode;

        applyMode(mode);

        modeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

    });

});


// ===============================
// LOAD MODE
// ===============================

const savedMode = localStorage.getItem("dashboard_mode") || "sell";

applyMode(savedMode);

modeButtons.forEach(btn => {
    if(btn.dataset.mode === savedMode){
        btn.classList.add("active");
    }
});

});