const sender = document.querySelector(".sender")
const reciever = document.querySelector(".reciever")
const main = document.querySelector(".goback-N")



class Packet{
    constructor(obj){
        this.type = obj.type;
        this.seqNo = obj.seqNo;
        this.ackNo = obj.type=="ack"?this.seqNo:""
        this.element = document.createElement('div');
        this.y = obj.y||0
        this.x = obj.x||0
        this.element.classList.add('block',this.type);
        this.element.innerHTML = this.seqNo
        this.element.style.transform = `translate(${this.x*30}px,${this.y}px)`
    }
    sendToReciver(){
        if(this.type==="recieve"){
            const id = requestAnimationFrame(()=>this.sendToReciver())
            if(this.y>=290){
                cancelAnimationFrame(id)
                const dimension = this.element.getClientRects()[0];
                console.log(dimension)
                this.element.remove()
                recievingHost.recievePacket(this);
                sendingHost.slideHost()
                recievingHost.slideHost()
            }
            this.y+=0.75;
            this.element.style.transform = `translate(${this.x*30}px,${this.y}px)`    
        }
    }
    sendToHost(){
        if(this.type==="ack"){
            const id = requestAnimationFrame(()=>this.sendToHost())
            if(this.y>=290){
                cancelAnimationFrame(id)
                this.element.remove()
                sendingHost.recieveAcknowledgment(this.ackNo)
            }
            this.element.style.transform = `translate(${this.x*30}px,-${this.y}px)`    
            this.y = this.y + 1;
        }
    }
}

class Window{
    constructor(obj){
        this.type = obj.type
        this.size = obj.size
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
        this.size = obj.size
        this.timerOut = obj.timerOut||15  
        this.Window = new Window({size:this.size,type:"sender",x:0})
        this.sent = []
        this.packetNo = 0
        this.packetSent = 0
        this.element = sender
        this.element.append(this.Window.element)
        this.seqNo = 0 //only for initializing packets
        //adding 100 packets at the start
        for(let i=0;i<100;i++){
            const packet = new Packet({type:'send',seqNo:this.seqNo})
            if(this.seqNo==this.size-1) this.seqNo=0
            else this.seqNo++
            this.element.append(packet.element)
        }
    }
    sendPacket(){
        // window full condition 
        if(this.sent.length<this.size){
            this.slideHost();
            recievingHost.slideHost(this.packetSent);
            const packet = new Packet({type:"recieve",seqNo:this.seqNo,x:this.packetNo})
            main.appendChild(packet.element)
            packet.sendToReciver()
            // this.startTimer()
            if(this.seqNo==this.size-1) this.seqNo=0
            else this.seqNo++
            this.sent.push(packet) 
            this.packetNo++
        }
    }
    slideHost(){
            if(Math.floor(this.packetNo*30)>=450){
                sender.style.transform = `translateX(${-30*this.packetSent-1}px)`
                this.packetNo = 0;
            }
        }
    retransmitPackets(){
        for(let i in this.sent){
            const packet = new Packet({type:"recieve",seqNo:i.seqNo})
            main.appendChild(packet.element)
            packet.sendToReciver()
        }
    }
    recieveAcknowledgment(ackNo){
        if(ackNo==this.sent[0].seqNo){
            this.sent.shift();
            this.packetSent++;
            this.sendPacket();
            this.Window.slideWindow(this.packetSent)
        }
        else{
            this.retransmitPackets();
        }
    }
    startTimer(){
        const id = requestAnimationFrame(()=>this.startTimer())
        if(this.timerOut==0){
            cancelAnimationFrame(id);
            this.retransmitPackets();
        }
        else{
            this.timerOut-=0.25
        }
    }
    updatePackets(){
        const packet = this.element.querySelector(".block")

    }
}

class Reciever{
    constructor(){
        this.size = 1
        this.timers = Array(this.size).fill(0)
        this.Window = new Window({size:this.size,type:"reciever",x:0})
        this.ackNo = 0 
        this.packetNo = 0
        this.packetRecieved = 0
        this.element = reciever
        this.element.append(this.Window.element)
        //adding 100 packets at the start
        for(let i=0;i<100;i++){
            const packet = new Packet({type:'empty',seqNo:""})
            if(this.seqNo==this.size-1) this.seqNo=0
            else this.seqNo++
            this.element.append(packet.element)
        }
    }
    sendAcknowledgement(){
        const packet = new Packet({type:"ack",seqNo:this.ackNo,x:this.packetNo});
        this.updatePackets();
        this.slideWindow();
        main.append(packet.element)
        packet.sendToHost();
        //add condition here
        this.packetNo++
    }
    retransmitAcknowledgement(){
        const packet = new Packet({type:"ack",seqNo:this.ackNo,x:this.packetNo});
        main.append(packet.element)
        console.log("inside")
        packet.sendToHost();
    }
    recievePacket(packet){
        if(packet.seqNo==this.ackNo){
            this.packetRecieved++;
            this.slideHost();
            this.sendAcknowledgement();
        }
        else{
            this.retransmitAcknowledgement();
        }
        if(this.ackNo<sendingHost.size-1) this.ackNo++
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
            sender.style.transform = `translateX(${-30*x-1}px)`
            this.packetNo = 0;
        }
    }
}

const sendingHost = new Sender({size:4})
const recievingHost = new Reciever({size:3})


setInterval(()=>{
    sendingHost.sendPacket();
},[1000/2])


