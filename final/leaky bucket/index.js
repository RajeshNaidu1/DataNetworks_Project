import React, { useEffect, useRef, useState } from 'react';
import './style.css'

let buffer = [];
let reciever = []
let currentSize = 0;
let max = 10;
let y = 0;
let dataSize = 1500

export default function LeakyBucket(){

    const [BucketSize,setBucketSize] = useState(400) //default bucket size is 3000kbps
    // const [dataSize,setDataSize] = useState(20)     //data to be transmitted
    const [currentSize,setCurrentSize] = useState(0);
    const transmissionRef = useRef(5);

    const [bucketTime,setBucketTime] = useState(0);
    const [hostTime,setHostTime] = useState(0);
    
    const yr = useRef(0);
    const y = useRef(0);
    const currentSizeRef = useRef(0);
    
    const [packetLost,setPacketLost] = useState(0)

    const [bucketTransmissionRate,setBucketTransmissionRate] = useState(1) //default buffer transmission rate is 5 bits 
    
    const [simulationSpeed,setSimulationSpeed] = useState(.5)
    
    // const [TransmissionRate,setTransmissionRate] = useState(5);  // maximum 30kbps by default

    const senderCanvasRef = useRef(null);
    const receiverCanvaRef = useRef(null);
    

    function randomPacketFlow(){
        var travelRate = Math.floor(Math.random()*max);
        transmissionRef.current=travelRate
        // setTransmissionRate(travelRate);
    }

    c
    

    function sendPacketToBuffer(){
        const canvas = senderCanvasRef.current;
        const c = canvas.getContext('2d');
        y.current+=transmissionRef.current*simulationSpeed;
        c.clearRect(0,0,canvas.width,canvas.height);
        c&&drawRect(c,canvas.width/2-6,y.current,10,12.5,'blue')
        const requestid = requestAnimationFrame(sendPacketToBuffer);
        if(y.current>=135){
            let temp = BucketSize
            let tempTransmission = transmissionRef.current
            y.current = 0;
            dataSize-=transmissionRef.current;
            // setDataSize((prev)=>(prev-TransmissionRate));
            console.log(dataSize)
            if(dataSize<=0){
                c.clearRect(0,0,canvas.width,canvas.height);
                cancelAnimationFrame(requestid);
            }
            if(currentSizeRef.current>temp-tempTransmission){setPacketLost(prev=>(prev+=1));}
            else{
                buffer.push(13);
                currentSizeRef.current+=transmissionRef.current;
                // setCurrentSize((prev)=>(prev+=TransmissionRate))
                // currentSize += TransmissionRate;                                  //every second 10kbps is added         
            }
        }
    }

    // function drawRecieverPackets(){
    //     const canvas = receiverCanvaRef.current;
    //     const c = canvas.getContext('2d');

    //     // y+=bucketTransmissionRate;
    //     // c.clearRect(0,0,canvas.width,canvas.height);
    //     // c&&drawRect(c,canvas.width/2-6,105,10,12.5,'blue')
    //     // const requestid = requestAnimationFrame(sendPacketToBuffer);
    //     // if(y>=28.5){
    //         // cancelAnimationFrame(requestid)
    //         // y = 10
    //         // console.log("sending to Buffer")    
    //     // }
    // }

    // function drawBufferPacket(){
    //     const canvas = senderCanvasRef.current;
    //     const c = canvas.getContext('2d');
    //     for(let i = 0;i<buffer.length;i++){
    //         if(buffer[i]<=28.5){
    //             buffer[i]++;
    //         }
    //     }
    //     c.clearRect(0,0,canvas.width,canvas.height);
    //     c&&drawRect(c,canvas.width/2-6,105,10,12.5,'blue')
    //     const requestid = requestAnimationFrame(sendPacketToBuffer);
    //     if(buffer.length==0){
    //         cancelAnimationFrame(requestid)
    //     }
    // }

    function sendPacketToHost(){
        const canvas = receiverCanvaRef.current;
        const c = canvas.getContext('2d');
        yr.current+=bucketTransmissionRate*simulationSpeed;
        c.clearRect(0,0,canvas.width,canvas.height);
        c&&drawRect(c,canvas.width/2-6,yr.current,10,12.5,'green');
        const hostid = requestAnimationFrame(sendPacketToHost);
        if(yr.current>=135){
            yr.current = 0;
            if(dataSize<=0 && currentSizeRef.current<=0){
                console.log("cancelling.....")
                console.log(currentSizeRef.current)
                c.clearRect(0,0,canvas.width,canvas.height);
                cancelAnimationFrame(hostid);
            }
            
            if(currentSize>BucketSize-bucketTransmissionRate){setPacketLost(prev=>(prev+=1));}
            currentSizeRef.current-=bucketTransmissionRate
            //every second 10kbps is added         
        }
    }

    // useEffect(()=>{
    //     const t1 =  setInterval(() => {
    //         sendPacketToBuffer();   
    //         console.log(dataSize)
    //     }, 1000);
    //     return () => {
    //         clearInterval(t1);
    //     };
    // },[])
    
    // useEffect(()=>{
    //     const t2 = setInterval(()=>{
    //         sendPacketToHost();  
    //         console.log("sending to reciever")  
    //     },[1000])
    //     return () => {
    //         clearInterval(t2);
    //     };
    // },[])

    useEffect(()=>{
        const t = setInterval(() => {
            randomPacketFlow();
            return () => {
                clearInterval(t)
            }
        },2000);
    },)

    useEffect(()=>{
        sendPacketToBuffer();
        sendPacketToHost();
    },[])

    // useEffect(()=>(
    //     setCurrentSize(currentSizeRef.current)
    // ),[currentSizeRef])
    

    return(
        <>
        <div className='transmission-Info'>
            Packet Transmission Info:<br/>
            <span>Packet Loss:&nbsp;{packetLost}</span>
        </div>
        <div className='buttons'>
            <input className='input' value={transmissionRef.current}></input>
        </div>
        <section className='simulation' style={{height:`auto`}}>
            <div className='leaky-bucket'>
            <canvas className="sender-canvas" ref={senderCanvasRef}></canvas>
            <div className='sender-leaky-bucket'>Sender</div>
            <div className="progress-bucket">
                <p className='text'>current size <br/>{currentSizeRef.current>=0?currentSizeRef.current:0} bits</p>
                <div className="progress"  data-color="green" style={{height:`${currentSizeRef.current/BucketSize*100}%`}}></div>
            </div>
            <canvas className="reciever-canvas" ref={receiverCanvaRef}></canvas>
            <div className='reciever-leaky-bucket'>Reciever</div>
            </div>
        </section>
        </>
    )


    
}