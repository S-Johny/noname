function zeroPad(num, size) 
{
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

function CountDown(id,running,starttime,time) 
{
	time_start= starttime;
	time_now= parseInt((new Date().getTime()) / 1000) ;
	
	id_countdown = "time_" + id;
	var countdown = document.getElementById(id_countdown);
	
	// find the amount of "seconds" between now and target
	if (running == "true")
	{
		seconds_left = cash - (time_now - time_start);
		if (seconds_left <=0)
		{
			seconds_left = 0;
		}	
	}
	else
	{
		seconds_left = time;	
	}
	
    // do some time calculations
    days = parseInt(seconds_left / 86400);
    seconds_left = seconds_left % 86400;
    
    hours = parseInt(seconds_left / 3600);
    seconds_left = seconds_left % 3600;
    
    minutes = parseInt(seconds_left / 60);
    seconds_left = parseInt(seconds_left % 60);

    seconds = seconds_left;
    // format countdown string + set tag value
    countdown.innerHTML = zeroPad(days, 3) + ":" + zeroPad(hours, 2) + ":" + zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2);
}

// Set the configuration for your app
// TODO: Replace with your project's config object
  var config = {
    apiKey: "AIzaSyDRaZcA60yey3fJ07FGh0xRwLaNkF_MP08",
    authDomain: "noname-459cb.firebaseapp.com",
    databaseURL: "https://noname-459cb.firebaseio.com/"
  };
  firebase.initializeApp(config);

  //get an element
  var object = document.getElementById('object');

  // Get a reference to the database service
  var database = firebase.database();

  var query = firebase.database().ref("users").orderByKey();
  query.once("value")
  .then(function(snapshot) { 
	snapshot.forEach(function(user) {
	  var id_number = 0
	  var content = '';
      var value = user.val();
	  content +='<tr>';
      content += '<td>' + value.name + '</td>';
      content += "<td id='time_" + id_number + "'><script>setInterval(function (){CountDown(" + id_number + ",'" + value.running + "'," + value.starttime +"," + value.time +")}, 1000);</script></td>";
      content += '<td>' + value.team + '</td>';
      content += '</tr>';
      $('#user_table').append(content);
      id_number++
  });
});