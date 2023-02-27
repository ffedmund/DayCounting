`use strict`
const together_date = [2022,12,2];
function refreshTime(){
    var datetime = countingDays();
    // console.log(datetime);
    document.getElementById("time").textContent = datetime; //it will print on html page
}

function countingDays(){
    var temp;
    var counts = 0;
    var curYear = new Date().getFullYear();
    var curMonth = (new Date().getMonth()+1);
    var curDate = new Date().getDate();
    var yeardiff = curYear - together_date[0];

    counts = yeardiff*365;
    temp = (together_date[1]-1)*30+(together_date[2]-1)+Math.floor(together_date[1]/2)-((together_date[0]%4===0)?1:2);
    counts -= temp;
    temp = (curMonth-1)*30+(curDate)+Math.floor(curMonth/2)-((curMonth>2)?((curYear%4===0)?1:2):0);
    counts += temp;
    console.log(temp);
    return counts;
}
setInterval(refreshTime, 100);