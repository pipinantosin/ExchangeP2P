function toast(msg){

const t=document.createElement("div")

t.className="toast"

t.innerText=msg

document.body.appendChild(t)

setTimeout(()=>{

t.remove()

},3000)

}