function generateQR(text){

const qrContainer = document.getElementById("qrcode");

if(!qrContainer) return;

qrContainer.innerHTML = "";

if(typeof QRCode !== "function"){
console.error("QRCode library belum dimuat");
return;
}

new QRCode(qrContainer,{
text: text,
width: 150,
height: 150
});

}