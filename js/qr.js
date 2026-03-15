function generateQR(text){

const qrContainer =
document.getElementById("qrcode")

qrContainer.innerHTML=""

new QRCode(qrContainer,{

text:text,
width:150,
height:150

})

}