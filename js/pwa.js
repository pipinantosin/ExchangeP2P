let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {

  e.preventDefault();
  deferredPrompt = e;

  installBtn.style.display = "flex";

});

installBtn.addEventListener("click", async () => {

  if (!deferredPrompt) return;

  installBtn.style.display = "none";

  deferredPrompt.prompt();

  const result = await deferredPrompt.userChoice;

  if (result.outcome === "accepted") {

    console.log("User accepted install");

  } else {

    console.log("User dismissed install");

  }

  deferredPrompt = null;

});

window.addEventListener("appinstalled", () => {

  installBtn.style.display = "none";

  deferredPrompt = null;

});