// ===============================
// DASHBOARD MODE CONTROLLER
// ===============================

document.addEventListener("DOMContentLoaded", () => {

const dashboard = document.querySelector(".dashboard");

const title = document.getElementById("dashboardTitle");
const generateBtn = document.getElementById("generateBtn");
const estimateLabel = document.getElementById("estimateLabel");

const previewSendLabel = document.getElementById("previewSendLabel");
const previewReceiveLabel = document.getElementById("previewReceiveLabel");

const modeButtons = document.querySelectorAll(".mode-btn");


// ===============================
// APPLY MODE
// ===============================

function applyMode(mode){

// ===============================
// MODE CLASS
// ===============================

dashboard.classList.remove("sell-mode","buy-mode");

if(mode === "buy"){
dashboard.classList.add("buy-mode");
}else{
dashboard.classList.add("sell-mode");
}


// ===============================
// TITLE
// ===============================

if(title){

if(mode === "buy"){

title.innerHTML =
'<i class="fa-solid fa-arrow-up"></i> <span data-lang="buy_token"></span>';

}else{

title.innerHTML =
'<i class="fa-solid fa-arrow-down"></i> <span data-lang="sell_token"></span>';

}

}


// ===============================
// GENERATE BUTTON
// ===============================

if(generateBtn){

if(mode === "buy"){
generateBtn.setAttribute("data-lang","create_buy_order");
}else{
generateBtn.setAttribute("data-lang","create_sell_order");
}

}


// ===============================
// ESTIMATE LABEL
// ===============================

if(estimateLabel){

if(mode === "buy"){
estimateLabel.setAttribute("data-lang","estimate_pay");
}else{
estimateLabel.setAttribute("data-lang","estimate_receive");
}

}


// ===============================
// PREVIEW LABEL
// ===============================

if(previewSendLabel){

if(mode === "buy"){
previewSendLabel.setAttribute("data-lang","you_pay");
}else{
previewSendLabel.setAttribute("data-lang","you_send");
}

}

if(previewReceiveLabel){

if(mode === "buy"){
previewReceiveLabel.setAttribute("data-lang","you_receive_token");
}else{
previewReceiveLabel.setAttribute("data-lang","you_receive");
}

}


// ===============================
// SAVE MODE
// ===============================

localStorage.setItem("dashboard_mode", mode);


// ===============================
// REFRESH LANGUAGE
// ===============================

if(typeof refreshLanguage === "function"){
refreshLanguage();
}

}


// ===============================
// BUTTON CLICK
// ===============================

modeButtons.forEach(btn => {

btn.addEventListener("click", () => {

const mode = btn.dataset.mode;

applyMode(mode);

// ACTIVE BUTTON
modeButtons.forEach(b => b.classList.remove("active"));
btn.classList.add("active");

});

});


// ===============================
// LOAD SAVED MODE
// ===============================

const savedMode = localStorage.getItem("dashboard_mode") || "sell";

applyMode(savedMode);

modeButtons.forEach(btn=>{
if(btn.dataset.mode === savedMode){
btn.classList.add("active");
}
});

});


// ===============================
// MODE TOGGLE (SELL / BUY)
// ===============================

document.addEventListener("DOMContentLoaded", () => {

const modeButtons = document.querySelectorAll(".mode-btn");
const title = document.getElementById("modeTitle");
const estimateLabel = document.getElementById("estimateLabel");

modeButtons.forEach(btn => {

btn.addEventListener("click", () => {

modeButtons.forEach(b => b.classList.remove("active"));
btn.classList.add("active");

const mode = btn.dataset.mode;

// ===============================
// UPDATE TITLE
// ===============================

if(mode === "sell"){

title.setAttribute("data-lang","sell_token");

if(estimateLabel){
estimateLabel.setAttribute("data-lang","estimate_receive");
}

}else{

title.setAttribute("data-lang","buy_token");

if(estimateLabel){
estimateLabel.setAttribute("data-lang","estimate_pay");
}

}

// ===============================
// REFRESH LANGUAGE
// ===============================

refreshLanguage();

});

});

});