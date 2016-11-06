/**
  * wait until the doc is ready to obey orders
  */
  var sessionID;
  var sessionStart;
  var sessionDuration;
document.addEventListener("DOMContentLoaded",function(e){
  console.log('content ready');
  setupSlideHandlers();
  setupKeyHandlers();
  setupOnOff();
});

function setupSlideHandlers(){
  var  slideHandler=function(event){
    var textClass=(this.className.includes("pomodori"))?".pomodori_text":".break_text";
    var textBox=document.querySelector(textClass);
    textBox.value=this.value;
  }
  var session_slide=document.querySelector('.pomodori_slide');
  session_slide.oninput=slideHandler;
  session_slide.onchange=slideHandler;
  var break_slide=document.querySelector('.break_slide');
  break_slide.oninput=slideHandler;
  break_slide.onchange=slideHandler;
}
function setupKeyHandlers(){
  var keyHandler=function(event){
    var slideClass=(this.className.includes("pomodori"))?".pomodori_slide":".break_slide";
    var slide=document.querySelector(slideClass);
    slide.value=this.value;
  }
  var session_text=document.querySelector('.pomodori_text');
  var break_text=document.querySelector('.break_text');
  session_text.onkeyup=keyHandler;
  break_text.onkeyup=keyHandler;
  document.onkeypress=function(event){
    if(event.key==' ')
      document.querySelector('.onoff').click();
  };
}

function setupOnOff(){
  var onOff=document.querySelector('.onoff');
  var status=document.querySelector('.current_status');
  var countDown=document.querySelector('.countdown');
  var pomodori_text=document.querySelector('.pomodori_text');
  var break_text=document.querySelector('.break_text');
  var onOff=document.querySelector('.onoff');

  function startTimer(){
    status.innerText="Pomodoro session counting down";
    sessionDuration=Number.parseInt(pomodori_text.value)*60000;
    sessionID=window.setInterval(updateTimer,1000);
    window.setTimeout(pomodoroTimeout,sessionDuration);
    sessionStart=new Date();
    sessionStart=sessionStart.getTime();
    console.log('session start:'+sessionStart);
  };

  function pomodoroTimeout(){
    clearInterval(sessionID);
    status.innerText="Take a break to recharge..";
    sessionDuration=Number.parseInt(break_text.value)*60000;
    sessionStart=new Date();
    sessionStart=sessionStart.getTime();
    sessionID=window.setInterval(updateTimer,1000);
    window.setTimeout(function(){
      clearInterval(sessionID);
      onOff.innerText="Start";
      status.innerText="Ready for another session?";
      countDown.innerText=pomodori_text.value + ":00";
    },sessionDuration);
  }
  function updateTimer(){
    var elapsedTime=new Date();
    elapsedTime=elapsedTime.getTime()-sessionStart;
    var remaining=sessionDuration-elapsedTime;
    var remainingMinutes=parseInt(remaining/60000);
    var remainingSeconds=parseInt((remaining-(remainingMinutes*60000))/1000)
    countDown.innerText=remainingMinutes + ":" + remainingSeconds;
  };
  onOff.onclick=function(){
    if(this.innerText=='Start') {
      this.innerText='Stop';
      startTimer();
    }else{
      clearInterval(sessionID);
      this.innerText='Start';
    }
  };
}
