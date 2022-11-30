const sender = document.querySelector('.sender-canvas');
const reciever = document.querySelector('.reciever-canvas');
const packetLostBar = document.querySelector('#packet-lost');
const transmissionRateBar = document.querySelector('#transmission-input')
const currentSizeBar = document.getElementById("current-size")
const progressBar = document.querySelector('.progress');
const simulation = document.querySelector('.simulation')
const dataLeft = document.querySelector('#data-left')
const totalDataSize = document.querySelector("#Data-size")
const bucketTransmissionBar = document.getElementById("bucket-transmission")

const startSimulation = document.querySelector('#start-simulation')
const stopSimulation = document.querySelector('#stop-simulation')
const start_wrapper = document.querySelector('#start-wrapper')
const stop_wrapper = document.querySelector('#stop-wrapper')

let transmissionRate = 5 //kbps 
let bucketSize = 400  //400kbps
let currentSize = 0
let dataSize = 1500
let bucketTransmissionRate = 2 //2kbps
let maximumTransmissionRate = 15 //maximum 7mbps 
let packetLost = 0
let y = 0;
let yr = 0;
let buffer = [];


function randomFlow(){
    transmissionRate = Math.floor(Math.random()*maximumTransmissionRate);
    if(transmissionRate!=0){    
        transmissionRateBar.value = transmissionRate;
    }
}



function updateDataLeft(){
    dataSize-=transmissionRate;
    if(dataSize<0){dataLeft.value=0}
    else{    
        dataLeft.value = dataSize
    }
}

function setBucketTransmissionRate(e){
    bucketTransmissionRate = e.target.value;
}

function drawRect(c,x,y,w,h,colour){
    if(colour) c.fillStyle = colour;
    else
    {
    c.fillStyle = "#FFFFFF"}
    
    c.beginPath();
    c.strokeStyle = "#000000";
    c.rect(x, y, w, h);
    c.closePath();
    c.stroke();
    c.fill();	
}

function sendToBucket(){
    const c = sender.getContext('2d');
    y+=transmissionRate;
    c.clearRect(0,0,sender.width,sender.height);
    drawRect(c,sender.width/2-6,y,10,12.5,'blue')
    const requestid = requestAnimationFrame(sendToBucket);
    if(y>=135){
        const id = setTimeout(()=>{
            randomFlow();
            if(dataSize<0) clearInterval(id)
        },[4000])
        y = 0;
        if(dataSize<=0){
            c.clearRect(0,0,sender.width,sender.height);
            cancelAnimationFrame(requestid);
        }
        if(currentSize+transmissionRate>bucketSize){updatePacketLost();}
        else{
            buffer.push(13);
            currentSize+=transmissionRate;        
        }
        updateDataLeft()
        updateProgressBar()
    }
}

function updatePacketLost(){
    packetLost+=1;
    packetLostBar.innerHTML = packetLost;
}

function updateProgressBar(){
    progressBar.style.height = 2*currentSize/bucketSize*100;
    currentSizeBar.innerText = currentSize;
}

function sendToHost(){
    const c = reciever.getContext('2d');
    yr+=bucketTransmissionRate;
    c.clearRect(0,0,reciever.width,reciever.height);
    drawRect(c,reciever.width/2-6,yr,10,12.5,'green');
    const hostid = requestAnimationFrame(sendToHost);
    if(yr>=135){
        yr = 0;
        if(dataSize<=0 && currentSize<=0){
            c.clearRect(0,0,reciever.width,reciever.height);
            cancelAnimationFrame(hostid);
        }
        currentSize-=bucketTransmissionRate    
        updateProgressBar()
    }
}

function createLost(){
    
}



function start(){
    start_wrapper.style.display = "none"
    stop_wrapper.style.display = "flex"
    sendToBucket();
    sendToHost()    
}
function stop(){
    location.reload()
}

startSimulation.addEventListener('click',()=>{start()})
stopSimulation.addEventListener('click',()=>{stop()})
bucketTransmissionBar.addEventListener('change',(e)=>{setBucketTransmissionRate(e)})
totalDataSize.addEventListener('change',(e)=>{dataSize = e.target.value})