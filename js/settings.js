// ===============================
// SETTINGS CONTROLLER
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    const currencySelect = document.getElementById("defaultCurrency"); // dropdown di settings
    const soundToggle = document.getElementById("soundToggle");
    const clearBtn = document.getElementById("clearStorageBtn");

    // ===============================
    // LOAD SETTINGS
    // ===============================
    const savedCurrency = localStorage.getItem("selectedCurrency") || "idr";
    const soundEnabled = localStorage.getItem("sound_enabled") === "true";

    if(currencySelect){
        currencySelect.value = savedCurrency;
    }

    if(soundToggle){
        soundToggle.checked = soundEnabled;
    }

    // ===============================
    // SAVE CURRENCY (Settings)
    // ===============================
    if(currencySelect){

        currencySelect.addEventListener("change", () => {

            // Simpan currency user ke localStorage
            localStorage.setItem("selectedCurrency", currencySelect.value);

            // Update langsung ticker & estimation
            if(typeof updateEstimation === "function") updateEstimation();
            if(typeof renderTicker === "function") renderTicker();

        });

    }

    // ===============================
    // SAVE SOUND
    // ===============================
    if(soundToggle){

        soundToggle.addEventListener("change", () => {

            localStorage.setItem(
                "sound_enabled",
                soundToggle.checked
            );

        });

    }

    // ===============================
    // CLEAR STORAGE
    // ===============================
    if(clearBtn){

        clearBtn.onclick = () => {

            if(confirm("Hapus semua data tersimpan?")){

                localStorage.clear();

                alert("Data berhasil dihapus");

                location.reload();

            }

        };

    }

});