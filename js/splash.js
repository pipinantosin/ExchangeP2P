document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splashScreen");

  // Jika splash sudah pernah tampil, langsung hapus
  if (!splash || localStorage.getItem("splashShown")) {
    if (splash) splash.remove();
    return;
  }

  const displayDuration = 3000; // tampil minimal 3 detik
  const fadeDuration = 600;     // fade out 0.6 detik

  // Tetap tampil sampai durasi selesai
  setTimeout(() => {
    splash.classList.add("fade-out");
    setTimeout(() => splash.remove(), fadeDuration);
  }, displayDuration);

  localStorage.setItem("splashShown", "true");
});