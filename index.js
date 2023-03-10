`use strict`
const title_array = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Monthiversary","Anniversary"]
const together_date = [2022,12,2];
const sor9head_num = 5;
var isBigDay = false;
var imageNum = 1;
let width = window.innerWidth;

function refreshTime(){
    console.log(width);
    var datetime = countingDays();
    const show_days = (new Date().getDate() === together_date[2])?((new Date().getMonth()+1 === together_date[1])?8:7):new Date().getDay();
    document.getElementById("time").innerText = datetime + " days" + ((countingDays()%100 == 0)?"!!":""); //it will print on html page
    if(show_days>6)document.getElementById("title").classList.add("long-text");
    document.getElementById("title").textContent = title_array[show_days];

    var dateString = new Date().toLocaleString();
    const formattedString = dateString.replace(" ","\n");
    document.getElementById("clock").innerText = formattedString; //it will print on html page
    
    if((countingDays()%100 == 0 || new Date().getDate() === together_date[2]) && !isBigDay){
        isBigDay = true;
        for(let i = 0; i < 3; i++){
            var parent = document.getElementById('effect');
            var customElement = bigday();
            parent.appendChild(customElement);
        }
    }
}

function countingDays(){
    var temp;
    var counts = 0;
    var curYear = new Date().getFullYear();
    var curMonth = (new Date().getMonth()+1);
    var curDate = new Date().getDate();
    var yeardiff = curYear - together_date[0];

    counts = yeardiff*365+(Math.floor(curYear/4)-Math.floor(together_date[0]/4));
    temp = (together_date[1]-1)*30+(together_date[2]-1)+Math.floor(together_date[1]/2)-((together_date[0]%4===0)?1:2);
    counts -= temp;
    temp = (curMonth-1)*30+(curDate)+Math.floor(curMonth/2)-((curMonth>2)?((curYear%4===0)?1:2):0);
    counts += temp;
    return counts;
}

function bigday(){
    var fireworkTag = document.createElement("div");
    fireworkTag.className = "firework";
    console.log(fireworkTag);
    return fireworkTag;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function changeImage(image){
    imageNum = getRandomInt(sor9head_num);
    image.src = "image/sor9head_"+((imageNum+1<10)?"0":"")+(++imageNum)+".PNG";
    image.classList.add("active");
    setTimeout(() => { image.classList.remove("active");}, 300);
}

setInterval(refreshTime, 100);