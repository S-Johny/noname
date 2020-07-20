// set the date we're counting down to
var target_date_object = new Date();	
target_date_object.setUTCDate(20);
target_date_object.setUTCFullYear(2020);
target_date_object.setUTCHours(18);
target_date_object.setUTCMilliseconds(0);
target_date_object.setUTCMinutes(46);
target_date_object.setUTCMonth(6);
target_date_object.setUTCSeconds(0);
var target_date = target_date_object.getTime();
 
// variables for time units
var days, hours, minutes, seconds, miliseconds;
 
//variable for sound
var SoundStartTime = new Date();
var SoundFirstTime = true;

function zeroPad(num, size) 
{
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

var audioElement = document.createElement('audio');
audioElement.setAttribute('src', 'assets/audio/backgroundsound.ogg');
audioElement.load()
audioElement.addEventListener("load", function() {
    alert('Loading done!')
    audioElement.play();
}, true);

function CountDown() 
{
    // find the amount of "seconds" between now and target
    var current_date = new Date().getTime();
    var current_date_object = new Date();
    var miliseconds_left = Math.abs(target_date - current_date);
 
    // do some time calculations
    days = parseInt(miliseconds_left / 86400000);
    miliseconds_left = miliseconds_left % 86400000;
     
    hours = parseInt(miliseconds_left / 3600000);
    miliseconds_left = miliseconds_left % 3600000;
     
    minutes = parseInt(miliseconds_left / 60000);
    miliseconds_left = parseInt(miliseconds_left % 60000);

    seconds = parseInt(miliseconds_left / 1000);
    miliseconds = parseInt(miliseconds_left % 1000);
     
	// get tag element
	var countdown = document.getElementById("countdown");

    // format countdown string + set tag value
    countdown.innerHTML = zeroPad(days, 2) + ":" + zeroPad(hours, 2) + ":" + zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2) + "." + zeroPad(miliseconds, 3) + "";  
	
    //play or stop sound of clock
    var magicNumber = 7600;
    var magicNumber2 = 930;  
   // if ((((((new Date()).getTime) - (SoundStartTime.getTime())) > magicNumber) || SoudnFirstTime) && miliseconds > magicNumber2)
   //(((new Date()).getTime) - (SoundStartTime.getTime())) > magicNumber) ||
   /*((current_date - (SoundStartTime.getTime())) > magicNumber) ||*/
   if ((((current_date - (SoundStartTime.getTime())) > magicNumber) || SoundFirstTime) && miliseconds > magicNumber2)
   {
    	sound = document.getElementById('clock');
    	if (!SoundFirstTime)
    	{
	    	sound.pause();
	    	sound.currentTime = 0;
    	}
    	else
    	{
    		sound.volume=0.5;	
    	}	
    	sound.play();
    	SoundStartTime = new Date();
    	SoundFirstTime = false;
   }	    
}

// update the tag with id "countdown"
setInterval(function (){CountDown()},30);