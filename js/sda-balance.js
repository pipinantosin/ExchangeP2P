const RPC_URL="https://node.sidrachain.com/";
const provider=new ethers.providers.JsonRpcProvider(RPC_URL);

function formatNumber(v){
 return Number(v).toLocaleString("id-ID",{minimumFractionDigits:2,maximumFractionDigits:2});
}

// ======================
// LOAD SDA
// ======================
async function loadSdaBalance(){

 const el=document.getElementById("sda-stock-value");

 const wallet=window.APP_CONFIG.WALLETS.SIDRA;

 document.getElementById("sda-wallet-icon").onclick=()=>{
  navigator.clipboard.writeText(wallet);
 };

 try{

  const balBN=await provider.getBalance(wallet);
  const bal=ethers.utils.formatEther(balBN);

  el.textContent=formatNumber(bal);

 }catch(e){

  el.textContent="Error";

 }

}

// ======================
// LOAD PI
// ======================
async function loadPiBalance(){

 const el=document.getElementById("pi-stock-value");

 const wallet=window.APP_CONFIG.WALLETS.PI;

 document.getElementById("pi-wallet-icon").onclick=()=>{
  navigator.clipboard.writeText(wallet);
 };

 // DETEKSI M ADDRESS
 if(wallet.startsWith("M")){
  el.textContent="Sub Address";
  return;
 }

 try{

  const res=await fetch(
  "https://api.mainnet.minepi.com/accounts/"+wallet
  );

  if(!res.ok){
   el.textContent="Wallet Error";
   return;
  }

  const data=await res.json();

  let bal=0;

  if(data.balances){
   data.balances.forEach(b=>{
    if(b.asset_type==="native"){
     bal=b.balance;
    }
   });
  }

  el.textContent=formatNumber(bal);

 }catch(e){

  el.textContent="Network Error";

 }

}

// ======================
// INIT
// ======================
async function initStockPanel(){

 while(!window.CONFIG_READY){
  await new Promise(r=>setTimeout(r,50));
 }

 loadSdaBalance();
 loadPiBalance();

 // AUTO REFRESH
 setInterval(()=>{

  loadSdaBalance();
  loadPiBalance();

 },15000);

}

document.addEventListener("DOMContentLoaded",initStockPanel);