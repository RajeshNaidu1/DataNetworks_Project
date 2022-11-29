const sender = document.querySelector(".sender")
const reciever = document.querySelector(".reciever")
const main = document.querySelector(".goback-N")

const e2e_delay = document.getElementById('e2e-delay')
let packet_speed,time_out;
const timerOut = document.getElementById('Time-out')

e2e_delay.addEventListener('change',(e)=>{
    packet_speed = Math.max(e.target.value/10,0.5)
})

timerOut.addEventListener('change',(e)=>{
    time_out = e.target.value
})

class Packet{
    constructor(obj){
        this.type = obj.type;
        this.seqNo = obj.seqNo;
        this.ackNo = obj.type=="ack"?this.seqNo:""
        this.element = document.createElement('div');
        this.y = obj.y||0
        this.x = obj.x||0
        this.dy = obj.dy||0.5
        this.element.classList.add('block',this.type);
        this.element.innerHTML = this.seqNo
        this.element.style.transform = `translate(${this.x*30}px,${this.y}px)`
    }
    sendToReciver(){
        if(this.type==="recieve"){
            const id = requestAnimationFrame(()=>this.sendToReciver())
            if(this.y>=290){
                cancelAnimationFrame(id)
                this.element.remove()
                recievingHost.recievePacket(this);
            }
            this.y+=this.dy;
            this.element.style.transform = `translate(${this.x*30}px,${this.y}px)`    
        }
    }
    sendToHost(){
        if(this.type==="ack"){
            const id = requestAnimationFrame(()=>this.sendToHost())
            if(this.y>=290){
                cancelAnimationFrame(id)
                this.element.remove()
                sendingHost.recieveAcknowledgment(this)
            }
            this.element.style.transform = `translate(${this.x*30}px,-${this.y}px)`    
            this.y += this.dy;
        }
    }
}

class Window{
    constructor(obj){
        this.type = obj.type
        this.size = 1
        this.x = obj.x
        this.element = document.createElement('div')
        this.element.classList.add('window',this.type)
        this.element.style.width = `${30*this.size}px`;
    }
    slideWindow(x){
        this.x = x
        this.element.style.transform = `translateY(-50%) translateX(${this.x*30}px)`
    }
}

class Sender{
    constructor(obj){
        this.size = 1
        this.timerOut = obj.timerOut||15  
        this.xPos = 0
        this.packet_sent = 0
        this.packet_sent_successfully = 0
        this.sent = []
        this.expected_acknowledgement_no = 0
        this.initialize()
    }
    initialize(){
        this.element = sender
        this.Window = new Window({size:this.size,type:"sender",x:0})
        this.element.append(this.Window.element)
        //adding 100 packets at the start
        this.seqNo = 0 //only for initializing packets
        for(let i=0;i<100;i++){
            const packet = new Packet({type:'send',seqNo:this.seqNo,})
            if(this.seqNo==this.size) this.seqNo=0
            else this.seqNo++
            this.element.append(packet.element)
        }

    }
    sendPacket(){
        // window full condition 
        if(this.sent.length<this.size){
            // this.slideHost();
            console.log(this.xPos)

            this.timer = new Timer({value:this.timerOut,x:this.xPos*30})
            this.timer.start()
            // recievingHost.slideHost(this.packetSent);
            const packet = new Packet({type:"recieve",seqNo:this.seqNo,x:this.xPos,dy:packet_speed})
            this.sent.push(packet)
            main.appendChild(packet.element)
            main.appendChild(this.timer.element)
            packet.sendToReciver()
            this.startTimer()
            if(this.seqNo==this.size) {
                this.seqNo=0;
            }
            else {
                this.seqNo++;
            }
        }
    }
    slideHost(){
    //         if(Math.floor(this.packetNo*30)>=450){
    //             sender.style.transform = `translateX(${-30*this.packetSent-1}px)`
    //             reciever.style.transform = `translateX(${-30*this.packetSent-1}px)`
    //             this.packetNo = 0;
    //         }
        }

    retransmitPackets(){
        for(let i in this.sent){
            const packet = new Packet({type:"recieve",seqNo:this.sent[i].seqNo})
            main.appendChild(packet.element)
            packet.sendToReciver()
        }
    }
    recieveAcknowledgment(packet){
        if(packet.ackNo==this.expected_acknowledgement_no){
            this.xPos++
            this.sent.splice(0, 1);

            console.log(this.sent)
            this.timer.element.remove();
            this.packet_sent++;
            if(this.expected_acknowledgement_no==this.size){ this.expected_acknowledgement_no = 0;}
            else this.expected_acknowledgement_no ++
            this.sendPacket();
            this.Window.slideWindow(this.packet_sent)
        }
        else{
            this.retransmitPackets();
        }
    }
    startTimer(){
        const id = requestAnimationFrame(()=>this.startTimer())
        if(this.timerOut==this.timer.currentTime){
            cancelAnimationFrame(id);
            this.timer.stop();
            this.retransmitPackets();
        }
    }
    updatePackets(){
        const packet = this.element.querySelector(".block")
    }
}

class Timer{
    constructor(obj){
        this.value = obj.value
        this.currentTime = 0
        this.x = obj.x
        this.y = 0
        this.element = document.createElement("canvas")
        this.element.width = 30
        this.element.height = 30
        this.context = this.element.getContext('2d');
        this.context.beginPath()
        this.context.textAlign                = 'center';
        this.context.textBaseline             = 'middle';
        this.context.fillStyle                = 'white';
        this.context.font = "10px monospace"
        this.context.fillText(this.currentTime,this.element.width/2,this.element.height/2);
        this.context.arc(this.x, this.y, this.radius, (Math.PI*1.5), (Math.PI)*(this.currentTime/this.value)+(Math.PI*1.5), true);
        this.context.lineTo(this.x,this.y); 
        this.context.fill();
        this.context.stroke();
        this.element.classList.add("timer")
        this.element.style.transform = `translateX(${this.x}px)`
    }
    start(){
        setTimeout(()=>{
            this.context.clearRect(0,0,this.element.width,this.element.height)
            this.context.fillText(this.currentTime,this.element.width/2,this.element.height/2);
            this.context.arc(this.x, this.y, this.radius, (Math.PI*1.5), (Math.PI)*(this.currentTime/this.value)+(Math.PI*1.5), true);
            const id = requestAnimationFrame(()=>this.start())
            this.currentTime+=0.125
            if(this.value==this.currentTime){
                cancelAnimationFrame(id)
                this.stop();
            }
        },[125])
    }
    stop(){
        this.element.remove();
    }
}

class Reciever{
    constructor(){
        this.size = 1
        this.ackNo = 0 
        this.packetNo = 0
        this.packetRecieved = 0
        this.element = reciever
        this.initialize()
    }
    initialize(){
        this.Window = new Window({size:this.size,type:"reciever",x:0})
        this.element.append(this.Window.element)

        for(let i=0;i<100;i++){
            const packet = new Packet({type:'empty',seqNo:""})
            if(this.seqNo==this.size) this.seqNo=0
            else this.seqNo++
            this.element.append(packet.element)
        }

    }
    sendAcknowledgement(){
        const packet = new Packet({type:"ack",seqNo:this.ackNo,x:this.packetNo,dy:packet_speed});
        this.updatePackets();
        this.slideWindow();
        main.append(packet.element)
        packet.sendToHost();
        //add condition here
        this.packetNo++
    }
    retransmitAcknowledgement(){
        const packet = new Packet({type:"ack",seqNo:this.ackNo,x:this.packetNo,dy:packet_speed});
        main.append(packet.element)
        packet.sendToHost();
    }
    recievePacket(packet){
        console.log("recieved:",packet.seqNo,this.ackNo)
        if(packet.seqNo==this.ackNo){
            this.packetRecieved++;
            // this.slideHost();
            this.sendAcknowledgement();
        }
        else{
            this.retransmitAcknowledgement();
        }
        if(this.ackNo<sendingHost.size) this.ackNo++
        else this.ackNo = 0
    }
    updatePackets(){
        const packets = this.element.querySelectorAll(".block.empty")
        packets[0].classList.replace("empty","recieved")
        packets[0].innerHTML = this.ackNo
    }
    slideWindow(){
        this.Window.slideWindow(this.packetRecieved)
    }
    slideHost(x){
        if(Math.floor(this.packetNo*30)>=450){
            this.packetNo = 0;
        }
    }
}

const sendingHost = new Sender({size:4,timerOut:time_out})
const recievingHost = new Reciever({size:3})


const id = setInterval(()=>{
    console.log(sendingHost.packet_sent)
    if(sendingHost.packet_sent==16){clearInterval(id)}
    sendingHost.sendPacket();
},[1000/2])

class goBackN{
    constructor(){
        this.packetSent = 0
        this.packetRecieved = 0
        this.sentPackets = []
        this.slideCount = 0
    }
    slideHosts(){

    }
    resetHostParams(){

    }
    start(){

    }
    stop(){

    }
}


// const timer = new Timer({value:13,x:30})
// main.append(timer.element)
// timer.start()

