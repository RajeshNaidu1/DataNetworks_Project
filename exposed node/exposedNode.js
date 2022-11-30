const SenderInputBar = document.getElementById("input-sender")
const RecieverInputBar = document.getElementById("input-reciever")

const Senderinfo = document.getElementById("msg-info-sender")
const Recieverinfo = document.getElementById("msg-info-reciever")

const nonCollison = document.getElementById("start")
const collison = document.getElementById("start-collision")

console.log("loaded")

const nodes = {}
const label = ["A","B","C","D"]

class Node{
    constructor(label,range){
        this.label = label;
        this.range = range;
        this.element = document.getElementById(this.label)
        this.coverage = this.element.querySelector(".coverage")
        this.wave = document.createElement("div")
        this.wave.classList.add("wave")
        this.coverage.style.width = range;
        this.coverage.style.height = range; 
        this.element.appendChild(this.wave)
        this.radius = 0;
        this.dr = 1
    }
    sendData(){
        this.wave.style.display = "inline"
        const id = requestAnimationFrame(()=>this.sendData());
        if(this.radius==this.range){ 
            setTimeout(()=>{this.wave.remove()},[500])
            cancelAnimationFrame(id);}
        this.radius+=this.dr
        console.log(this.radius,this.range)
        this.wave.style.width = this.radius
        this.wave.style.height = this.radius
    }
}

const A = new Node("A",250)
const B = new Node("B",400)
const C = new Node("C",200)
const D = new Node("D",300)

nodes["A"] = A
nodes["B"] = B
nodes["C"] = C
nodes["D"] = D


let sender;
let reciever;

function updateTransmissionInfo(){
    Senderinfo.innerText = SenderInputBar.value;
    Recieverinfo.innerText = RecieverInputBar.value
}

RecieverInputBar.addEventListener("click",()=>{
    reciever = nodes[RecieverInputBar.value];
    updateTransmissionInfo()
})

SenderInputBar.addEventListener("change",()=>{
    sender = nodes[SenderInputBar.value];
    RecieverInputBar.innerHTML=""
    label.forEach((i)=>{
        if(sender.label!=i){
            const k = document.createElement("option")
            k.value = i;
            k.innerText = i;
            RecieverInputBar.appendChild(k);
        }
    })
    updateTransmissionInfo()
    RecieverInputBar.disabled = false;
})


nonCollison.addEventListener('click',()=>{
    sender.sendData();
})

collison.addEventListener('click',()=>{
   nodes["A"].sendData()
   nodes["B"].sendData()
   nodes["C"].sendData()
   nodes["D"].sendData()
})
