// ===============================
// USER MODAL CONTROLLER
// ===============================

document.addEventListener("DOMContentLoaded", () => {


// ===============================
// ELEMENT
// ===============================

const modal   = document.getElementById("userModal");
const saveBtn = document.getElementById("saveUser");

const roleInput    = document.getElementById("userRole");
const nameInput    = document.getElementById("userName");
const paymentInput = document.getElementById("payment");
const sidraInput   = document.getElementById("sidraAddress");
const piInput      = document.getElementById("piAddress");


// jika modal tidak ada → stop script
if (!modal || !saveBtn) return;


// ===============================
// CEK DATA USER
// ===============================

if (!localStorage.getItem("bw_user")) {
    modal.style.display = "flex";
}


// ===============================
// SAVE USER
// ===============================

saveBtn.onclick = () => {

    const user = {

        role: roleInput ? roleInput.value : "",
        name: nameInput ? nameInput.value : "",
        payment: paymentInput ? paymentInput.value : "",
        sidra: sidraInput ? sidraInput.value : "",
        pi: piInput ? piInput.value : ""

    };


    localStorage.setItem(
        "bw_user",
        JSON.stringify(user)
    );


    modal.style.display = "none";


    if (typeof toast === "function") {
        toast("Data user tersimpan");
    }

};

});


// ===============================
// SAFE RENDER FUNCTION
// ===============================

if (typeof window.renderAccounts !== "function") {

    window.renderAccounts = function(){
        // fallback supaya tidak error
        console.log("renderAccounts not loaded");
    };

}

