let deferredPrompt;

const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {

e.preventDefault();

deferredPrompt = e;

installBtn.style.display = "flex";

});


installBtn.addEventListener("click", async () => {

if (!deferredPrompt) return;

deferredPrompt.prompt();

const result = await deferredPrompt.userChoice;

console.log("PWA install:", result.outcome);

deferredPrompt = null;

installBtn.style.display = "none";

});


window.addEventListener("appinstalled", () => {

console.log("PWA installed");

installBtn.style.display = "none";

});