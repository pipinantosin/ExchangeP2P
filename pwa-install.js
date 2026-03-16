let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {

  e.preventDefault();

  deferredPrompt = e;

  const btn = document.getElementById('installBtn');

  if(btn) btn.style.display = "block";

});

const btn = document.getElementById('installBtn');

if(btn){

btn.addEventListener('click', async () => {

  btn.style.display = "none";

  deferredPrompt.prompt();

  const result = await deferredPrompt.userChoice;

  console.log("Install result:", result.outcome);

  deferredPrompt = null;

});

}