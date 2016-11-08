/**
  * wait until the doc is ready to obey orders
  */
  var sessionID;
  var sessionDuration;
  var elapsedTime=0;
document.addEventListener("DOMContentLoaded",function(e){
  /**
    * once content is loaded
    * bind slider functionality - to update text box
    * bind text box functionality - to update slider
    * bind button click to start/stop clock
    */
  setupSlideHandlers();
  setupKeyHandlers();
  setupOnOff();
});


function setupSlideHandlers(){
  /**
    * deduce if the slider under change is pomodoro slider OR break slider
    * get the respective text box
    * assign value from slider to text box
    */
  var  slideHandler=function(event){
    var textClass=(this.className.includes("pomodori"))?".pomodori_text":".break_text";
    var textBox=document.querySelector(textClass);
    textBox.value=this.value;
  }

  //assign slide handler to both pomodoro slider and break slider
  var session_slide=document.querySelector('.pomodori_slide');
  session_slide.oninput=slideHandler; //will update text box live (as the user changes input)
  session_slide.onchange=slideHandler;
  var break_slide=document.querySelector('.break_slide');
  break_slide.oninput=slideHandler;
  break_slide.onchange=slideHandler;
}

/**
  * handle input keys to text box
  * handle space bar to start / stop button
  */
function setupKeyHandlers(){
  /**
    * detect which text box is being changed
    * get the handle for corresponding slider
    * update slider value with text box value
    */
  var keyHandler=function(event){
    var slideClass=(this.className.includes("pomodori"))?".pomodori_slide":".break_slide";
    var slide=document.querySelector(slideClass);
    slide.value=this.value;
  }
  //assign keyhandler to both the text boxes
  var session_text=document.querySelector('.pomodori_text');
  var break_text=document.querySelector('.break_text');
  session_text.onkeyup=keyHandler;
  break_text.onkeyup=keyHandler;
  //document level key handler
  //look out for space bar and simulate onoff click (start/stop)
  document.onkeypress=function(event){
    if(event.key==' ')
      document.querySelector('.onoff').click();
  };
}

/**
  * core functionality of the web app here
  * handle timer start and stop based on button click
  */
function setupOnOff(){
  //all the handles to elements  necessary to run the show
  var onOff=document.querySelector('.onoff');
  var status=document.querySelector('.current_status');
  var countDown=document.querySelector('.countdown');
  var pomodori_text=document.querySelector('.pomodori_text');
  var break_text=document.querySelector('.break_text');
  var onOff=document.querySelector('.onoff');

  /**
    * set up status,prep user with a clock tick and set off timer
    * set interval to 1s(1000ms) to call update timer
    * keep the session id handy to timeout the interval loop
    */
  function startTimer(){
    status.innerText="Pomodoro counting down";
    clock_tick();
    sessionDuration=Number.parseInt(pomodori_text.value)*60;
    sessionID=window.setInterval(updateTimer,1000);
    window.setTimeout(pomodoroTimeout,sessionDuration*1000);
  };

  /**
    * time out the session after set limit (play a chime)
    * start break time
    * stop with a chime at the end of break time
    */
  function pomodoroTimeout(){
    chime(); //end of main session
    elapsedTime=0; //start breaktime again from 0
    clearInterval(sessionID); //stop the main session
    status.innerText="Take a break to recharge..";
    //start break session
    sessionDuration=Number.parseInt(break_text.value)*60; //convert to seconds
    sessionID=window.setInterval(updateTimer,1000); //callback every 1 second

    /**
      * timeout for break session
      */
    window.setTimeout(function(){
      chime(); //show that the user is done
      elapsedTime=0; //reset elapsedTime
      clearInterval(sessionID);
      onOff.innerText="Start";
      onOff.classList.toggle("start");
      onOff.classList.toggle("stop");
      status.innerText="Ready for another session?";
      countDown.innerText=pomodori_text.value + ":00";
    },sessionDuration*1000);
    onOff.classList.toggle("start");
    onOff.classList.toggle("stop");
  }

  /**
    * key calculation
    * keep updating the elapsedTime
    * subtract elapsedTime from overall duration
    * keep the time field (countDown) updated
    */
  function updateTimer(){
    elapsedTime++;
    var remaining=sessionDuration-elapsedTime;
    var remainingMinutes=parseInt(remaining/60);
    var remainingSeconds=remaining % 60;
    countDown.innerText=remainingMinutes + ":" + remainingSeconds;
  };

  /**
    * start timer during on/off button click
    * ensure proper innerText is set up
    */
  onOff.onclick=function(){
    if(this.innerText=='Start' || this.innerText=='Restart') {
      this.innerText='Stop';
      startTimer();
    }else{
      elapsedTime=0;
      clearInterval(sessionID);
      this.innerText='Restart';
    }
    onOff.classList.toggle("start");
    onOff.classList.toggle("stop");
  };
  
  function clock_tick(){
    var ticktick=new Audio("public/audio/big-clock-ticking.ogg");
    ticktick.play();
  }
  function chime(){
    var chime=new Audio("public/audio/chime.ogg");
    chime.play();
  }
}
