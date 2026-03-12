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




