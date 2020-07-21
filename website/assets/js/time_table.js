function CountDown(id,running,starttime,time) 
{
	time_start= starttime;
	time_now= parseInt((new Date().getTime()) / 1000) ;
	
	id_countdown = "time_" + id;
	var countdown = document.getElementById(id_countdown);
	
	// find the amount of "seconds" between now and target
	if (running == "true")
	{
		seconds_left = time - (time_now - time_start);
		if (seconds_left <=0)
		{
			seconds_left = 0;
		}	
	}
	else
	{
		seconds_left = time;	
	}
	
    countdown.innerHTML = secondsToTimeString(seconds_left);
}

// PRINT TABLE WHEN USER IS LOGED-IN
firebase.auth().onAuthStateChanged(user => {
	if(user) {
		  var query = firebase.database().ref("users").orderByValue('name');
		  query.once("value")
		  .then(function(snapshot) { 
			var id_number = 0
			var content = '';
			content +='<table style="width:100%" id="user_table" class="digital">';
			content +='<tr id="tr">';
			content +='<th>JMENO</th>';
			content +='<th>CAS</th>';
			content +='<th>TEAM</th>';
			content +='<th>ORG</th>';
			content +='</tr>';

			snapshot.forEach(function(user) {		
		      var value = user.val();
			  if(value.name != 'admin' && value.org != 'ANO')
			  {
				  content +='<tr>';
			      content += '<td>' + value.name + '</td>';
			      content += "<td id='time_" + id_number + "'><script>setInterval(function (){CountDown(" + id_number + ",'" + value.running + "'," + value.starttime +"," + value.time +")}, 1000);</script></td>";
			      content += '<td>' + value.team + '</td>';
				  content += '<td>' + value.org + '</td>';
			      content += '</tr>';
			      id_number++
			  }
			});
			snapshot.forEach(function(user) {		
		      var value = user.val();
			  if(value.name != 'admin' && value.org != 'NE')
			  {
				  content +='<tr>';
			      content += '<td>' + value.name + '</td>';
			      content += "<td id='time_" + id_number + "'><script>setInterval(function (){CountDown(" + id_number + ",'" + value.running + "'," + value.starttime +"," + value.time +")}, 1000);</script></td>";
			      content += '<td>' + value.team + '</td>';
				  content += '<td>' + value.org + '</td>';
			      content += '</tr>';
			      id_number++
			  }
			});
		content +='</table>';
		$('#one').append(content);
		});
	}
});