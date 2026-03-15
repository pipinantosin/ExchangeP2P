let LANG_DATA = {};

// ===============================
// LOAD LANGUAGE FILE
// ===============================

async function loadLanguageFile(){

    const res = await fetch("data/lang.json");
    LANG_DATA = await res.json();

    const savedLang = localStorage.getItem("lang") || "id";

    applyLanguage(savedLang);

}

// ===============================
// APPLY LANGUAGE
// ===============================

function applyLanguage(lang){

    if(!LANG_DATA[lang]) return;

    document.querySelectorAll("[data-lang]").forEach(el=>{

        const key = el.getAttribute("data-lang");

        if(LANG_DATA[lang][key]){
            el.textContent = LANG_DATA[lang][key];
        }

    });

    localStorage.setItem("lang",lang);

}

// ===============================
// LANGUAGE SWITCH
// ===============================

document.addEventListener("DOMContentLoaded",()=>{

    const select = document.getElementById("languageSelect");

    if(select){

        const savedLang = localStorage.getItem("lang") || "id";

        select.value = savedLang;

        select.addEventListener("change",(e)=>{
            applyLanguage(e.target.value);
        });

    }

    loadLanguageFile();

});

function refreshLanguage(){
    const savedLang = localStorage.getItem("lang") || "id";
    applyLanguage(savedLang);
}

