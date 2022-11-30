var ctoa=document.getElementsByClassName("C toA")
var ctob=document.getElementsByClassName("C toB")
var btoa=document.getElementsByClassName("B toA")
var btoc=document.getElementsByClassName("B toC")
var atob=document.getElementsByClassName("A toB")
var atoc=document.getElementsByClassName("A toC")

var dist1=document.getElementsByClassName("dist1")
var dist2=document.getElementsByClassName("dist2")
var dist3=document.getElementsByClassName("dist3")
var dist4=document.getElementsByClassName("dist4")

const second_line=document.getElementById('second-line')
const first_line=document.getElementById('first-line')

const modalMessage=document.querySelector(".myModal h1")
let infinity;
const infinityBar=document.getElementById("infinity")

infinityBar.addEventListener('change',(e)=>{
    infinity=e.target.value
})

var c=0;
let tableA = 0; 
let tableC = 0;

function define_infinity(){
    c=1
}
function split_horizon(){
    c=2
}

function action1(){
    modalMessage.innerText="Connection between A and B is lost"
    first_line.style.backgroundColor='rgb(157, 252, 204)';
    atob[0].style.display = "none";
    atoc[0].style.display = "none";
    const id=requestAnimationFrame(action1);
    dist3[0].innerHTML = tableC;
    dist4[0].innerHTML = tableC;
    if(c==0||c==1){
        tableC+=1;
        if(c==0&&tableC==10000000000) cancelAnimationFrame(id)
        if(c==1&&tableC==infinity) cancelAnimationFrame(id)
    }
    if(c==2){
        dist3[0].innerHTML = "Not Reachable";
        dist4[0].innerHTML = "Not Reachable";
    }
}

function action2(){
    second_line.style.backgroundColor='rgb(157, 252, 204)';
    ctoa[0].style.display = "none";
    ctob[0].style.display = "none";
    const id = requestAnimationFrame(action2)
    dist1[0].innerHTML = tableA;
    dist2[0].innerHTML = tableA;
    if(c==0||c==1){
        tableA+=1;
        if(c==0&&tableA==10000000000) cancelAnimationFrame(id)
        if(c==1&&tableA==infinity) cancelAnimationFrame(id)
    }
    if(c==2){
        dist1[0].innerHTML = "Not Reachable";
        dist2[0].innerHTML = "Not Reachable";
    }
}