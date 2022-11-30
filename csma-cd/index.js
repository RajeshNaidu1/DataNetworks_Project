var canvas1=document.querySelector('#s1s2')
var c1=canvas1.getContext('2d');

var canvas2=document.querySelector('#s2s3')
var c2=canvas2.getContext('2d');

var canvas3=document.querySelector('#s3')
var c3=canvas3.getContext('2d');

var canvas4=document.querySelector('#s1s3')
var c4=canvas4.getContext('2d');

var canvas5=document.querySelector('#last1')
var c5=canvas5.getContext('2d');

var canvas6=document.querySelector('#last2')
var c6=canvas6.getContext('2d');

const modal = document.getElementById("myModal");
const modalMessage1 = document.querySelector(".modal-content p")
// const modalMessage2 = document.querySelector(".modal-content h4")

const station1 = document.getElementById("station1")
const station2 = document.getElementById("station2")
const station3 = document.getElementById("station3")

let msg = "";
function showModal(msg){
    modalMessage1.innerText = msg;
    modal.style.display = "inline-block"
    setTimeout(closeDialog,10000)
    // modalMessage1.innerText = "You may retransmit now";
    // modal.style.display = "inline-block"
    // setInterval(closeDialog,3000);
}
function closeDialog(){
    modal.style.display = "none";

}
// function showModal1(msg1){
//     modalMessage1.innerText = msg1;
//     modal.style.display = "inline-block"
//     setTimeout(closeDialog1,2000)
// }
// function closeDialog1(){
//     modal.style.display = "none";
// }

function myFunction() {
    var x1 = station1.selectedIndex;
    var x2 = station2.selectedIndex;
    var x3 = station3.selectedIndex;
    
    var y1 = document.querySelectorAll("#station1 option")[x1].value;
    var y2 = document.querySelectorAll("#station2 option")[x2].value;
    var y3 =document.querySelectorAll("#station3 option")[x3].value;
    let lineBusy=false



    // console.log(`${x1}:${y1} ${x2}:${y2} ${x3}:${y3}`)
    while(lineBusy==false){
        if((y1=='s2'||y1=='s3')&&y2=='s0'&&y3=='s0'){
            // alert("No Collison detected");
            if(y1=='s2'){
                station1to2();
            }
            else if(y1=='s3'){
                station1to3();
            }
        }
        else if((y2=='s1'||y2=='s3')&&y1=='s0'&&y3=='s0'){
            // alert("No Collison detected");
            if(y2=='s3'){
                station2to3();
            }
            else if(y2=='s1'){
                station2to1();
            }
        }
        else if((y3=='s2'||y3=='s1')&&y1=='s0'&&y2=='s0'){
            // alert("No Collison detected");
            if(y3=='s1'){
                station3to1();
            }
            else if(y3=='s2'){
                station3to2();
            }
        }
        else if(y1=='s2'&&y2=='s1'&&y3=='s0'){
            station1func_only12();
            station2func_only12();
            // alert("Collison Detected");
        }
        else if(y1=='s3'&&y2=='s1'&&y3=='s0'){
            station1func_only12();
            station2func_only12();
            // alert("Collison Detected");
        }
        else if(y2=='s3'&&y3=='s2'&&y1=='s0'){
            // alert("Collison Detected");
            station2func_only23();
            station3func_only23();
        }
        else if(y2=='s3'&&y3=='s1'&&y1=='s0'){
            // alert("Collison Detected");
            station2func_only23();
            station3func_only23();
        }
        else if(y1=='s3'&&y3=='s1'&&y2=='s0'){
            // alert("Collison Detected");
            station1func_only13();
            station3func_only13()
        }
        else if(y3=='s2'&&y2=='s1'&&y1=='s0'){
            // alert("No Collison Detected");
            stationfunc_only23();
            station1func_only23()
        }
        else if(y1=='s2'&&y2=='s3'&&y3=='s0'){
            // alert("No Collison Detected");
            station2func_only123();
            station3func_only12();
        }
        else if(y1=='s2'&&y2=='s0'&&y3=='s1'){
            station1func_only13();
            station3func_only13();
        }
        else if((y1=='s2'||y1=='s3')&&(y2=='s3'||y2=='s1')&&(y3=='s2'||y3=='s1')){
            showModal("Collison detected wait for 10sec");
            // showModal1("You can retransmit now");
        }
        lineBusy=true;
    }
}
// from 1 to 2 only
var pos1to2=20
function station1to2(){
    var dx = 0.5; 
        // console.log(i);
        const id = requestAnimationFrame(station1to2);  
        c4.clearRect(0,0,innerWidth,innerHeight);    
        c4.beginPath()
        c4.fillStyle = "white";
        c4.fillRect(pos1to2,20,10,10)
        if(pos1to2>=130||pos1to2<0){
            dx=0;
            showModal("No collison detected");
            cancelAnimationFrame(id)
        }
        pos1to2=pos1to2+dx;
        // if(index==positions.length-1){cancelAnimationFrame(id)}
}
//from 1 to 3 only
var pos1to3=20
function station1to3(){
    var dx = 0.5; 
    const id = requestAnimationFrame(station1to3);
    c4.clearRect(0,0,innerWidth,innerHeight)
    c4.beginPath()
    c4.fillStyle = "white";
    c4.fillRect(pos1to3,20,10,10)
    if(pos1to3>=250||pos1to3<0){
        dx=0;
        showModal("No collison detected");
        cancelAnimationFrame(id)
    }
    pos1to3=pos1to3+dx;
}
// from 2 to 3 only
var pos2to3=180
function station2to3(){
    var dx = 0.5; 
    const id = requestAnimationFrame(station2to3);
    c4.clearRect(0,0,innerWidth,innerHeight)
    // console.log(pos1);
    c4.beginPath()
    c4.fillStyle = "white";
    c4.fillRect(pos2to3,20,10,10)
    if(pos2to3>=270||pos2to3<0){
        dx=0;
        showModal("No collison detected");
        cancelAnimationFrame(id)
    }
    pos2to3=pos2to3+dx;
}
//from 2 to 1 only
var pos2to1=140
function station2to1(){
    var dx = 0.5; 
    const id = requestAnimationFrame(station2to1);
    // console.log(pos1)
    c4.clearRect(0,0,innerWidth,innerHeight)
    c4.beginPath()
    c4.fillStyle = "white";
    c4.fillRect(pos2to1,20,10,10)
    if(pos2to1==30||pos2to1<0){
        dx=0;
        showModal("No collison detected");
        cancelAnimationFrame(id)
    }
    pos2to1=pos2to1-dx;
}

//from 3 to 1 only
var pos3to1=260
function station3to1(){
    var dx = 0.5; 
    const id = requestAnimationFrame(station3to1);
    console.log(pos3to1)
    c4.clearRect(0,0,innerWidth,innerHeight)
    c4.beginPath()
    c4.fillStyle = "white";
    c4.fillRect(pos3to1,20,10,10)
    if(pos3to1==30||pos3to1<0){
        showModal("No collison detected");
        cancelAnimationFrame(id)
        dx=0;
    }
    pos3to1=pos3to1-dx;
}

//from 3 to 2 only 
var pos3to2=260
function station3to2(){
    var dx = 0.5; 
    const id = requestAnimationFrame(station3to2);
    console.log(pos3to2)
    c4.clearRect(0,0,innerWidth,innerHeight)
    c4.beginPath()
    c4.fillStyle = "white";
    c4.fillRect(pos3to2,20,10,10)
    if(pos3to2==150||pos3to2<0){
        showModal("No collison detected");
        cancelAnimationFrame(id)
        dx=0;
    }
    pos3to2=pos3to2-dx;
}

// station 1 and 2 at once -- begin
  
var pos1and2=20;
function station1func_only12(){
    var dx = 1.5; 
    const id = requestAnimationFrame(station1func_only12);
    c1.clearRect(0,0,innerWidth,innerHeight)
    c1.beginPath()
    c1.fillStyle = "white";
    c1.fillRect(pos1and2,20,10,10)
    if(pos1and2>=290||pos1and2<0){
        showModal("Collison detected wait for 10sec");
        // showModal1("You can retransmit now");
        cancelAnimationFrame(id)
        dx=0;
    }
    pos1and2=pos1and2+dx;
}
var pos2and1=100;
function station2func_only12(){
    var dx = 0.5; 
    const id = requestAnimationFrame(station2func_only12);
    c2.clearRect(0,0,innerWidth,innerHeight)
    c2.beginPath()
    c2.fillStyle = "white";
    c2.fillRect(pos2and1,20,10,10)
    if(pos2and1<=0){
        cancelAnimationFrame(id)
        dx=0;
    }
    pos2and1=pos2and1-dx;
}
// station 1 and 2 at once -- end

// station 2 and 3 at once -- begin
var pos1=150;
function station2func_only23(){
    var dx = 0.8; 
    const id = requestAnimationFrame(station2func_only23);
    c2.clearRect(0,0,innerWidth,innerHeight)
    c2.beginPath()
    c2.fillStyle = "white";
    c2.fillRect(pos1,20,10,10)
    if(pos1>=290||pos1<0){
        cancelAnimationFrame(id)
        dx=0;
    }
    pos1=pos1+dx;
}
var pos2=100;
function station3func_only23(){
    var dx = 0.5; 
    const id = requestAnimationFrame(station3func_only23);
    c3.clearRect(0,0,innerWidth,innerHeight)
    c3.beginPath()
    c3.fillStyle = "white";
    c3.fillRect(pos2,20,10,10)
    if(pos2<=0){
        showModal("Collison detected wait for 10sec");
        // showModal1("You can retransmit now");
        cancelAnimationFrame(id)
        dx=0;
    }
    pos2=pos2-dx;
}
// // station 2 and 3 at once -- end

// station 3 and 1 at once -- begin
var pos1to3only=20;
function station1func_only13(){
    var dx = 0.5; 
    const id = requestAnimationFrame(station1func_only13);
    c5.clearRect(0,0,innerWidth,innerHeight)
    c5.beginPath()
    c5.fillStyle = "white";
    c5.fillRect(pos1to3only,20,10,10)
    if(pos1to3only>=290||pos1to3only<0){
        showModal("Collison detected wait for 10sec");
        // showModal1("You can retransmit now");
        cancelAnimationFrame(id)
        dx=0;
    }
    pos1to3only=pos1to3only+dx;
}
var pos3to1only=270;
function station3func_only13(){
    var dx = 0.5; 
    const id = requestAnimationFrame(station3func_only13);
    c6.clearRect(0,0,innerWidth,innerHeight)
    c6.beginPath()
    c6.fillStyle = "white";
    c6.fillRect(pos3to1only,20,10,10)
    if(pos3to1only<=0){
        showModal("Collison detected wait for 10sec");
        // showModal1("You can retransmit now");
        cancelAnimationFrame(id)
        dx=0;
    }
    pos3to1only=pos3to1only-dx;
}
// // station 3 and 1 at once -- end

// station 1 to 2 and 2 to 3 at once -- begin
var position1to2=20;
function station2func_only123(){
    var dx = 0.5; 
    const id = requestAnimationFrame(station2func_only123);
    c5.clearRect(0,0,innerWidth,innerHeight)
    c5.beginPath()
    c5.fillStyle = "white";
    c5.fillRect(position1to2,20,10,10)
    if(position1to2>=290||position1to2<0){
        cancelAnimationFrame(id)
        showModal("No Collison detected");
        dx=0;
    }
    position1to2=position1to2+dx;
}
var position2to3=20;
function station3func_only12(){
    var dx = 0.5; 
    const id = requestAnimationFrame(station3func_only12);
    c6.clearRect(0,0,innerWidth,innerHeight)
    c6.beginPath()
    c6.fillStyle = "white";
    c6.fillRect(position2to3,20,10,10)
    if(position2to3>=250||position2to3<0){
        cancelAnimationFrame(id)
        dx=0;
    }
    position2to3=position2to3+dx;
}
// station 1 to 2 and 2 to 3 at once -- end

// station 3 to 2 and 2 to 1 at once -- begin
var position3to2=290;
function stationfunc_only23(){
    var dx = 0.5; 
    const id = requestAnimationFrame(stationfunc_only23);
    c5.clearRect(0,0,innerWidth,innerHeight)
    c5.beginPath()
    c5.fillStyle = "white";
    c5.fillRect(position3to2,20,10,10)
    if(position3to2==0){
        cancelAnimationFrame(id)
        showModal("No Collison detected");
        dx=0;
    }
    position3to2=position3to2-dx;
}
var position2to1=290;
function station1func_only23(){
    var dx = 0.5; 
    const id = requestAnimationFrame(station1func_only23);
    c6.clearRect(0,0,innerWidth,innerHeight)
    c6.beginPath()
    c6.fillStyle = "white";
    c6.fillRect(position2to1,20,10,10)
    if(position2to1==0){
        cancelAnimationFrame(id)
        dx=0;
    }
    position2to1=position2to1-dx;
}
// station 3 to 2 and 2 to 1 at once -- end

