let deferredPrompt;
const installBtn = document.getElementById("installBtn");

// Detect install availability
window.addEventListener("beforeinstallprompt", (e) => {

  e.preventDefault();

  deferredPrompt = e;

  if (installBtn) {
    installBtn.style.display = "flex";
  }

});

// Click install
if (installBtn) {

  installBtn.addEventListener("click", async () => {

    if (!deferredPrompt) return;

    installBtn.style.display = "none";

    deferredPrompt.prompt();

    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      console.log("PWA installed");
    } else {
      console.log("Install cancelled");
    }

    deferredPrompt = null;

  });

}

// Hide after install
window.addEventListener("appinstalled", () => {

  console.log("App installed");

  if (installBtn) {
    installBtn.style.display = "none";
  }

  deferredPrompt = null;

});