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
  	refEvents.push().set({timestamp: timestamp, from: from, forwho: forwho, time: time, before: before, after: after, witness: witness, description: description}, function(error) { if (error) { console.log('Transaction failed abnormally!', error); } else { console.log('Transaction log succeed!'); }});
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
	

	if(time<0 && user.displayName != 'admin')
	{
		window.location.replace('transaction_negative.html');
	}
	else
	{
		if (forwho == "forteam") 
		{
			var success = null
			//find team
			var mysnapshot = null;
			var query = firebase.database().ref('users').orderByChild('name').equalTo(user.displayName);
			query.once('value', function(snapshot) { snapshot.forEach(function(childSnapshot) { mysnapshot = childSnapshot});});
			while (mysnapshot == null) {
				await sleep(100);
			}
			var team = mysnapshot.val().team;
			
			//get count of peopple in team and names
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
			
			//IMPORTANT CLACULATIONS
			forwho_full = 'TEAM ' + team ;
			result_time = time*1.2/count;
			
			//NOW WRITE TO DATABASE
			for (var i = names.length; i--; ) {
				var loop_success = null; 
				success = true
				
				//get time before
				var usersnapshot = null;
				var query = firebase.database().ref('users').orderByChild('name').equalTo(names[i]);
				query.once('value', function(snapshot) { snapshot.forEach(function(childSnapshot) { usersnapshot = childSnapshot});});
				while (usersnapshot == null) {
					await sleep(100);
				}
				var time_before = secondsToTimeString(usersnapshot.val().time);
				
				//write user
				var timeRef = firebase.database().ref('users/'+ names[i] + '/time');
				timeRef.transaction(function(currentTime) {return Number(currentTime) + Number(result_time);}, function(error, committed, snapshot) { if (error) { console.log('Transaction failed abnormally!', error); loop_success = false } else { console.log('Transaction log succeed!'); loop_success = true}});
				while (loop_success == null) {
					await sleep(100);
				}
				
				//get time after 
				var usersnapshot = null;
				var query = firebase.database().ref('users').orderByChild('name').equalTo(names[i]);
				query.once('value', function(snapshot) { snapshot.forEach(function(childSnapshot) { usersnapshot = childSnapshot});});
				while (usersnapshot == null) {
					await sleep(100);
				}
				var time_after = secondsToTimeString(usersnapshot.val().time);
				
				if(loop_success) 
				{
					//transaction logging
					var log_success = null;
					var description = description;
					var witness = witness;
					var after = time_after;
					var before = time_before;
					var time = result_time;
					var forwho = names[i];
					var from = user.displayName;
					var timestamp = ((((new Date().toISOString()).replace(":", "-")).replace(".", "_")).replace("T", "_")).replace(":", "-");
					var refEvents = firebase.database().ref("events");  
					refEvents.push().set({timestamp: timestamp, from: from, forwho: forwho, time: time, before: before, after: after, witness: witness, description: description}, function(error) { if (error) { console.log('Transaction failed abnormally!', error); log_success = false;} else { console.log('Transaction log succeed!'); log_success = true;}});
					while (log_success == null) {
						await sleep(100);
					}
					if (log_success == false)
					{
						success = false;
					}
				} 
				else
				{	
					success = false;
				}
			}
			
			//VERIFICATION AND REDIRECTION
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
			var success = null
		 	forwho_full = forsomebody;
			result_time = time*0.7;
			
			//get time before
			var usersnapshot = null;
			var query = firebase.database().ref('users').orderByChild('name').equalTo(forwho_full);
			query.once('value', function(snapshot) { snapshot.forEach(function(childSnapshot) { usersnapshot = childSnapshot});});
			while (usersnapshot == null) {
				await sleep(100);
			}
			var time_before = secondsToTimeString(usersnapshot.val().time);
			
			//write user
			var timeRef = firebase.database().ref('users/'+ forwho_full + '/time');
			timeRef.transaction(function(currentTime) {return Number(currentTime) + Number(result_time);}, function(error, committed, snapshot) { if (error) { console.log('Transaction failed abnormally!', error); success = false } else { console.log('Transaction log succeed!'); success = true}});
			while (success == null) {
				await sleep(100);
			}
			
			//get time after 
			var usersnapshot = null;
			var query = firebase.database().ref('users').orderByChild('name').equalTo(forwho_full);
			query.once('value', function(snapshot) { snapshot.forEach(function(childSnapshot) { usersnapshot = childSnapshot});});
			while (usersnapshot == null) {
				await sleep(100);
			}
			var time_after = secondsToTimeString(usersnapshot.val().time);
			
			//transaction logging
			var log_success = null;
			var description = description;
			var witness = witness;
			var after = time_after;
			var before = time_before;
			var time = result_time;
			var forwho = forwho_full;
			var from = user.displayName;
			var timestamp = ((((new Date().toISOString()).replace(":", "-")).replace(".", "_")).replace("T", "_")).replace(":", "-");
			var refEvents = firebase.database().ref("events");  
			refEvents.push().set({timestamp: timestamp, from: from, forwho: forwho, time: time, before: before, after: after, witness: witness, description: description}, function(error) { if (error) { console.log('Transaction failed abnormally!', error); log_success = false;} else { console.log('Transaction log succeed!'); log_success = true;}});
			while (log_success == null) {
				await sleep(100);
			}
			if (log_success == false)
			{
				success = false;
			}
			
			//VERIFICATION AND REDIRECTION
			if(success) 
			{
				window.location.replace('transaction_succed.html');
			} 
			else
			{	
				window.location.replace('transaction_failed.html');
			}
		} 
		else if (forwho == "giftforsomebody") 
		{
			var success = null
			var remove_success = null
		 	forwho_full = forsomebody;
			result_time = time*0.7;
			
			// REMOVE TIME TO USER
			//get time before
			var usersnapshot = null;
			var query = firebase.database().ref('users').orderByChild('name').equalTo(user.displayName);
			query.once('value', function(snapshot) { snapshot.forEach(function(childSnapshot) { usersnapshot = childSnapshot});});
			while (usersnapshot == null) {
				await sleep(100);
			}
			var time_before = secondsToTimeString(usersnapshot.val().time);
			
			//write user
			var timeRef = firebase.database().ref('users/'+ user.displayName + '/time');
			timeRef.transaction(function(currentTime) {return Number(currentTime) + Number(-time);}, function(error, committed, snapshot) { if (error) { console.log('Transaction failed abnormally!', error); remove_success = false } else { console.log('Transaction log succeed!'); remove_success = true}});
			while (remove_success == null) {
				await sleep(100);
			}
			
			//get time after 
			var usersnapshot = null;
			var query = firebase.database().ref('users').orderByChild('name').equalTo(user.displayName);
			query.once('value', function(snapshot) { snapshot.forEach(function(childSnapshot) { usersnapshot = childSnapshot});});
			while (usersnapshot == null) {
				await sleep(100);
			}
			var time_after = secondsToTimeString(usersnapshot.val().time);
			
			//transaction logging
			var log_success = null;
			var description = description;
			var witness = witness;
			var after = time_after;
			var before = time_before;
			var time = result_time;
			var forwho = user.displayName;
			var from = user.displayName;
			var timestamp = ((((new Date().toISOString()).replace(":", "-")).replace(".", "_")).replace("T", "_")).replace(":", "-");
			var refEvents = firebase.database().ref("events");  
			refEvents.push().set({timestamp: timestamp, from: from, forwho: forwho, time: -time, before: before, after: after, witness: witness, description: description}, function(error) { if (error) { console.log('Transaction failed abnormally!', error); log_success = false;} else { console.log('Transaction log succeed!'); log_success = true;}});
			while (log_success == null) {
				await sleep(100);
			}
			if (log_success == false)
			{
				remove_success = false;
			}
			
			// ADD TIME TO USER
			//get time before
			var usersnapshot = null;
			var query = firebase.database().ref('users').orderByChild('name').equalTo(forwho_full);
			query.once('value', function(snapshot) { snapshot.forEach(function(childSnapshot) { usersnapshot = childSnapshot});});
			while (usersnapshot == null) {
				await sleep(100);
			}
			var time_before = secondsToTimeString(usersnapshot.val().time);
			
			//write user
			var timeRef = firebase.database().ref('users/'+ forwho_full + '/time');
			timeRef.transaction(function(currentTime) {return Number(currentTime) + Number(result_time);}, function(error, committed, snapshot) { if (error) { console.log('Transaction failed abnormally!', error); success = false } else { console.log('Transaction log succeed!'); success = true}});
			while (success == null) {
				await sleep(100);
			}
			
			//get time after 
			var usersnapshot = null;
			var query = firebase.database().ref('users').orderByChild('name').equalTo(forwho_full);
			query.once('value', function(snapshot) { snapshot.forEach(function(childSnapshot) { usersnapshot = childSnapshot});});
			while (usersnapshot == null) {
				await sleep(100);
			}
			var time_after = secondsToTimeString(usersnapshot.val().time);
			
			//transaction logging
			var log_success = null;
			var description = description;
			var witness = witness;
			var after = time_after;
			var before = time_before;
			var time = result_time;
			var forwho = forwho_full;
			var from = user.displayName;
			var timestamp = ((((new Date().toISOString()).replace(":", "-")).replace(".", "_")).replace("T", "_")).replace(":", "-");
			var refEvents = firebase.database().ref("events");  
			refEvents.push().set({timestamp: timestamp, from: from, forwho: forwho, time: time, before: before, after: after, witness: witness, description: description}, function(error) { if (error) { console.log('Transaction failed abnormally!', error); log_success = false;} else { console.log('Transaction log succeed!'); log_success = true;}});
			while (log_success == null) {
				await sleep(100);
			}
			if (log_success == false)
			{
				success = false;
			}
			
			//VERIFICATION AND REDIRECTION
			if(success && remove_success) 
			{
				window.location.replace('transaction_succed.html');
			} 
			else
			{	
				window.location.replace('transaction_failed.html');
			}
		} 
		else
		{
			forwho_full = user.displayName;
			result_time = time;
			
			//get time before
			var usersnapshot = null;
			var query = firebase.database().ref('users').orderByChild('name').equalTo(forwho_full);
			query.once('value', function(snapshot) { snapshot.forEach(function(childSnapshot) { usersnapshot = childSnapshot});});
			while (usersnapshot == null) {
				await sleep(100);
			}
			var time_before = secondsToTimeString(usersnapshot.val().time);
			
			//write user
			var timeRef = firebase.database().ref('users/'+ forwho_full + '/time');
			timeRef.transaction(function(currentTime) {return Number(currentTime) + Number(result_time);}, function(error, committed, snapshot) { if (error) { console.log('Transaction failed abnormally!', error); success = false } else { console.log('Transaction log succeed!'); success = true}});
			while (success == null) {
				await sleep(100);
			}
			
			//get time after 
			var usersnapshot = null;
			var query = firebase.database().ref('users').orderByChild('name').equalTo(forwho_full);
			query.once('value', function(snapshot) { snapshot.forEach(function(childSnapshot) { usersnapshot = childSnapshot});});
			while (usersnapshot == null) {
				await sleep(100);
			}
			var time_after = secondsToTimeString(usersnapshot.val().time);
			
			//transaction logging
			var log_success = null;
			var description = description;
			var witness = witness;
			var after = time_after;
			var before = time_before;
			var time = result_time;
			var forwho = forwho_full;
			var from = user.displayName;
			var timestamp = ((((new Date().toISOString()).replace(":", "-")).replace(".", "_")).replace("T", "_")).replace(":", "-");
			var refEvents = firebase.database().ref("events");  
			refEvents.push().set({timestamp: timestamp, from: from, forwho: forwho, time: time, before: before, after: after, witness: witness, description: description}, function(error) { if (error) { console.log('Transaction failed abnormally!', error); log_success = false;} else { console.log('Transaction log succeed!'); log_success = true;}});
			while (log_success == null) {
				await sleep(100);
			}
			if (log_success == false)
			{
				success = false;
			}
			
			//VERIFICATION AND REDIRECTION
			if(success) 
			{
				window.location.replace('transaction_succed.html');
			} 
			else
			{	
				window.location.replace('transaction_failed.html');
			}
		}
	}
}