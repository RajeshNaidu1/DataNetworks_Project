const packetQueuedBar = document.querySelector('#packet-queued');
const packetLostBar = document.querySelector('#packet-lost');
const transmissionRateBar = document.querySelector('#transmission-input')
const currentSizeBar = document.getElementById("current-size")
const progressBar = document.querySelector('.progress');
const simulation = document.querySelector('.simulation');
const dataLeft = document.querySelector('#data-left');
const tokenInput = document.querySelector("#token-input")
const tokenProgressBar = document.querySelector("#tokens");
const tokenBar = document.querySelector("#token-count");

const dataSizeBar = document.querySelector("#Data-Size")

const startWrapper = document.querySelector('#start-wrapper')
const stopWrapper = document.querySelector('#stop-wrapper')
const startSimualtion = document.querySelector('#start-simulation')
const stopSimualtion = document.querySelector('#stop-simulation')

const Main = document.querySelector('.token-bucket');

const queue = [];//stores the packets sent from sender
const recieved = [];//stores the packet recieved to bucket  
const token = []; //stores the packets with tokens


const pass = false;
let id;

let transmissionRate = 5 //kbps 
let bucketSize = 400  
let currentSize = 0
let dataSize = dataSizeBar.value
let bucketTransmissionRate = 2
let maximumTransmissionRate = 15 //maximum 7mbps 
let packetQueued = 0
let packetLost = 0
let y = 0;
let x = 0;
let xr = 0;
let yt = 0;
let totalTokens = 5;
let tokenQueued = 0;
let currentTokens = 3;
dataLeft.value = dataSize
class LostPacket{
    constructor(obj){
        this.size = obj.size;
        this.element = document.createElement('div');
        this.element.innerText = this.size;
        this.element.classList.add("packet","to-out");
        this.x = 0;
        this.y = obj.y;
        this.element.style.top = `calc(150px + ${this.y}px)`;
    }
    sendOut(){
        const k = requestAnimationFrame(()=>{this.sendOut()})
        if(this.x <= -40){
            cancelAnimationFrame(k);
            this.element.remove();
        }
        this.x += -0.5
        this.element.style.transform = `translateX(${this.x}px)`;
    }
}


class SenderPacket{
    constructor(obj){
        this.size = obj.size;
        this.transmissionRate = [1,2,1.3,1.7,1.9]
        this.x = obj.x;
        this.y = 0;
        this.dy = this.transmissionRate[Math.floor(Math.random()*5)]
        this.dx = 0;
        this.element = document.createElement('div');
        this.element.innerText = this.size;
        this.element.classList.add("packet","to-queue");
        this.type == obj.type;
        updateDataLeft(this);
        this.element.style.left = `calc(22% + ${this.x}px)`
    }
    sendPacketToQueue(){
        const k = requestAnimationFrame(()=>{this.sendPacketToQueue()})
        if(this.y>=94.5){
            this.element.style.display="none"
            if(currentSize+this.size<=bucketSize){
                updatePacketQueued();
                updateProgressBar();            
                incrementCurrentSize(this);
                queue.push(this);
            }
            else updatePacketLost(this);
            cancelAnimationFrame(k);
        }
            this.y+=this.dy;
            this.element.style.transform = `translateY(${this.y}px)`;
    }
}


class TokenPacket{
    constructor(obj){
        this.size = obj.size;
        this.transmissionRate = [1,2,1.3,1.7,1.9]
        this.x = 0;
        this.y = obj.y;
        this.dx = 0.25;
        queue.shift();
        this.element = document.createElement('div');
        this.element.innerText = this.size;
        this.element.classList.add("packet","to-bucket");
        this.element.style.top = `calc(150px + ${this.y}px)`
        decreaseCurrentSize(this);
        updateProgressBar();
    }
    sendToBucket(){
        const k = requestAnimationFrame(()=>{this.sendToBucket()})
        if(this.x>=130.5){
            this.element.style.display="none";
            if(currentTokens>0) currentTokens-=1;
            cancelAnimationFrame(k)
            token.push(this);
            recieved.shift();
        }
            this.x+=this.dx
            this.element.style.transform = `translateX(${this.x}px)`
    }
}

class RecieverPacket{
    constructor(obj){
        this.element = document.createElement('div');
        this.size = obj.size;
        this.element.innerText = this.size;
        this.element.classList.add("packet","to-host");
        this.y=0;
        this.x=obj.x;
        this.dy = 0.5;
        this.element.style.left =`calc(65% + ${this.x}px)`;
    }
    sendToReciever(){
        const k = requestAnimationFrame(()=>{this.sendToReciever()})
        if(this.y>=94.5){
            this.display = "none";
            this.element.remove();
            cancelAnimationFrame(k);
        }
        this.y+=this.dy;
        this.element.style.transform = `translateY(${this.y}px)`;
    }
}

class Token{
    constructor(obj){
        this.y = obj.y;
        this.x = 0;
        tokenQueued++;
        this.element = document.createElement('div');
        this.element.classList.add("packet","token");
        this.element.style.top = `calc(120px + ${this.y}px)` 
    }
    sendToBucket(){
        const k = requestAnimationFrame(()=>{this.sendToBucket()})
        if(this.x<=-75){
            cancelAnimationFrame(k);
            currentTokens++;
            if(tokenQueued>0) tokenQueued--;
            this.element.remove();
        }
        this.x -= 1.5;
        this.element.style.transform = `translate(${this.x}px)`
    }

}

function updateDataLeft(packet){
    dataSize-=packet.size;
    if(dataSize<0){dataLeft.value=0}
    else{    
        dataLeft.value = dataSize
    }
}

function updatePacketLost(k){
    packetLost = packetLost + 1;
    packetLostBar.innerHTML = packetLost;
    if(y>80){y=0}
    else y+=30;
    const packet = new LostPacket({size:k.size,y:y});
    Main.appendChild(packet.element)
    packet.sendOut();
}

function updatePacketQueued(){
    packetQueued=queue.length;
    packetQueuedBar.innerHTML = packetQueued;
}

function updateProgressBar(){
    progressBar.style.height = 2*currentSize/bucketSize*100;
    currentSizeBar.innerText = currentSize;
}

function updateTokens(){
    tokenProgressBar.style.height = 100*2*currentTokens/totalTokens;
    tokenBar.innerText = currentTokens
    document.getElementById('total-tokens').innerHTML = totalTokens;
}

function incrementCurrentSize(packet){
    currentSize+=packet.size;
}

function decreaseCurrentSize(packet){
    currentSize-=packet.size;
}

function updateCurrentSize(){
    currentSize = queue.forEach((i)=>(currentSize+=i.size))
}

tokenInput.addEventListener('change',(e)=>{
    totalTokens = e.target.value;
    updateTokens();
})

dataSizeBar.addEventListener("change",(e)=>{
    dataSize = e.target.value;
    updateDataLeft();
})




function createSenderPacket(){
    if(x>=70){x=0;}
    else{x+=25;}
    var size = Math.floor(Math.random()*40)
    const packet = new SenderPacket({x:x,bucketTransmissionRate:bucketTransmissionRate,type:"queue",size:size});
    Main.appendChild(packet.element)
    packet.sendPacketToQueue();
}

function createTokenPacket(){
    if(y<=100){y+=25;}
    else y=0;
    if(recieved.length< currentTokens && currentTokens>0){
        const packet = new TokenPacket({size:queue[0].size,y:y});
        recieved.push(packet);
        packet.sendToBucket();
        updatePacketQueued();
        Main.appendChild(packet.element);
    }
}

function createToken(){
    if(yt<=100) yt+=25;
    else yt=0;
    const packet =  new Token({y:yt});
    Main.appendChild(packet.element);
    packet.sendToBucket();
}

function createRecieverPackets(){
    if(xr<=80){xr+=20;}
    else xr = 0; 
    for(let i=0;i<token.length;i++){
        const packet = new RecieverPacket({size:token[0].size,x:xr})
        Main.appendChild(packet.element);
        packet.sendToReciever();
        token.shift();
    }
}


//bucket to reciever packet here

setInterval(()=>{
    console.log("queue:",queue);
    console.log("recieved:",recieved)
},[1000])

function start(){
    stopWrapper.style.display = "flex"
    startWrapper.style.display = "none"
    const d = setInterval(()=>{
        if(dataLeft.value<=0 && recieved.length==0 && queue.length==0){clearInterval(d)}
        createRecieverPackets();
    },[1000/10])    

    //tokens are added here
const a = setInterval(()=>{
    if(dataLeft.value<=0 && currentSize<=0 && currentTokens==totalTokens){clearInterval(a)}
    if(currentTokens+tokenQueued<totalTokens) createToken();
    updateTokens();
},[1000/5]);


//sender packets from here
const b = setInterval(()=>{
    if(dataLeft.value<=0){
        clearInterval(b)
    }
    createSenderPacket();
},[1000/4])

//queue to bucket packet here
const c = setInterval(()=>{
    if(dataLeft.value<=0 && currentSize<=0 ){
        clearInterval(c)
    }
    if(currentSize>0 && currentTokens>0 ){createTokenPacket();};
},[1000/5])

}

function stop(){
    location.reload()
}

startSimualtion.addEventListener('click',(e)=>{
    start();
})

stopSimualtion.addEventListener('click',(e)=>{
    stop();
})