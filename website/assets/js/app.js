// Set the configuration for your app
// TODO: Replace with your project's config object
var firebaseConfig = {
    apiKey: "AIzaSyDRaZcA60yey3fJ07FGh0xRwLaNkF_MP08",
    authDomain: "noname-459cb.firebaseapp.com",
    databaseURL: "https://noname-459cb.firebaseio.com",
    projectId: "noname-459cb",
    storageBucket: "noname-459cb.appspot.com",
    messagingSenderId: "795449313701",
    appId: "1:795449313701:web:1b11e5f95ce2cd28c4c04c",
    measurementId: "G-GYKZ6WZ1Y2"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function zeroPad(num, size) 
{
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

function secondsToTimeString(seconds_left)
{
	// do some time calculations
    days = parseInt(seconds_left / 86400);
    seconds_left = seconds_left % 86400;
    
    hours = parseInt(seconds_left / 3600);
    seconds_left = seconds_left % 3600;
    
    minutes = parseInt(seconds_left / 60);
    seconds_left = parseInt(seconds_left % 60);

    seconds = seconds_left;
    // format countdown string + set tag value
    return zeroPad(days, 3) + ":" + zeroPad(hours, 2) + ":" + zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2);
}

function write_logs(from, forwho, time, before, after, witness, description) 
{
	var timestamp = ((((new Date().toISOString()).replace(":", "-")).replace(".", "_")).replace("T", "_")).replace(":", "-");
	var refEvents = firebase.database().ref("events");  
  	refEvents.push().set({timestamp: timestamp, from: from, forwho: forwho, time: time, before:before, after:after, witness: witness, description: description}, function(error) { if (error) { console.log('Transaction failed abnormally!', error); } else { console.log('Transaction log succeed!'); }});
}

async function get_time_of_user(user) 
{
	var mysnapshot = null;
	var query = firebase.database().ref('users').orderByChild('name').equalTo(user);
	query.once('value', function(snapshot) { snapshot.forEach(function(childSnapshot) { mysnapshot = childSnapshot});});
	while (mysnapshot == null) {
		await sleep(100);
	}
	
	var time = mysnapshot.val().time;
	return secondsToTimeString(time);
}

async function submit_to_firebase()
{
	var forwho = document.forms.zaznamenat.elements.prokoho.value;
	var forsomebody = document.forms.zaznamenat.elements.names.value;
	var time = Number(document.forms.zaznamenat.elements.time.value)*60;
	var witness = document.forms.zaznamenat.elements.witness.value;
	var description = document.forms.zaznamenat.elements.description.value;
	var user = firebase.auth().currentUser;
	var forwho_full = '';
	var result_time = 0;
	
	// block when time is less than zero?
	
	var success = null
	if (forwho == "forteam") 
	{
		//make some calls synchronous way
		var mysnapshot = null;
		var query = firebase.database().ref('users').orderByChild('name').equalTo(user.displayName);
		query.once('value', function(snapshot) { snapshot.forEach(function(childSnapshot) { mysnapshot = childSnapshot});});
		while (mysnapshot == null) {
			await sleep(100);
		}
		var team = mysnapshot.val().team;
		
		var count = 0;
		var names = [];
		var query = firebase.database().ref('users').orderByChild('team').equalTo(team);
		query.once('value', function(snapshot) { snapshot.forEach(function(childSnapshot) {
 			count++;
			names.push(childSnapshot.val().name);
  			});
		});
		
		while (count == 0) {
			await sleep(100);
		}
		
		forwho_full = 'TEAM ' + team ;
		result_time = time*1.2/count;
		
		for (var i = names.length; i--; ) {
			var loop_success = null; 
			success = True
			var timeRef = firebase.database().ref('users/'+ names[i] + '/time');
			var time_before = get_time_of_user(names[i])
			timeRef.transaction(function(currentTime) {return Number(currentTime) + Number(result_time);}, function(error, committed, snapshot) { if (error) { console.log('Transaction failed abnormally!', error); loop_success = False } else { console.log('Transaction log succeed!'); loop_success = True}});
			while (loop_success == null) {
				await sleep(100);
			}
			var time_after = get_time_of_user(names[i])
			
			if(loop_success) 
			{
				write_logs(user.displayName, names[i], result_time, time_before, time_after, witness, description);
			} 
			else
			{	
				success = False;
			}
		}
		
		if(success) 
		{
			window.location.replace('transaction_succed.html');
		} 
		else
		{	
			window.location.replace('transaction_failed.html');
		}	
	}
	else if (forwho == "forsomebody") 
	{
	 	forwho_full = forsomebody;
		result_time = time*0.7;
		write_logs(user.displayName, forwho_full, result_time, witness, description);
		var timeRef = firebase.database().ref('users/'+ forwho_full + '/time');
		timeRef.transaction(function(currentTime) {return Number(currentTime) + Number(result_time);}, function(error, committed, snapshot) { if (error) { console.log('Transaction failed abnormally!', error); window.location.replace('transaction_failed.html'); } else { console.log('Transaction log succeed!'); window.location.replace('transaction_succed.html'); }});
	} 
	else if (forwho == "giftforsomebody") 
	{
	 	forwho_full = forsomebody;
		result_time = time*0.7;
		write_logs(user.displayName, user.displayName, -time, witness, description);
		var timeRef = firebase.database().ref('users/'+ user.displayName + '/time');
		timeRef.transaction(function(currentTime) {return Number(currentTime) + Number(-time);}, function(error, committed, snapshot) { if (error) { console.log('Transaction failed abnormally!', error); window.location.replace('transaction_failed.html'); } else { console.log('Transaction log succeed!');}});
		write_logs(user.displayName, forwho_full, result_time, witness, description);
		var timeRef = firebase.database().ref('users/'+ forwho_full + '/time');
		timeRef.transaction(function(currentTime) {return Number(currentTime) + Number(result_time);}, function(error, committed, snapshot) { if (error) { console.log('Transaction failed abnormally!', error); window.location.replace('transaction_failed.html'); } else { console.log('Transaction log succeed!'); window.location.replace('transaction_succed.html'); }});
	} 
	else
	{
		forwho_full = user.displayName;
		result_time = time;
		write_logs(user.displayName, forwho_full, result_time, witness, description);
		var timeRef = firebase.database().ref('users/'+ forwho_full + '/time');
		timeRef.transaction(function(currentTime) {return Number(currentTime) + Number(result_time);}, function(error, committed, snapshot) { if (error) { console.log('Transaction failed abnormally!', error); window.location.replace('transaction_failed.html'); } else { console.log('Transaction log succeed!'); window.location.replace('transaction_succed.html'); }});
	}
}