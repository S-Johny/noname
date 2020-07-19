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

function write_logs(from, forwho, time, witness, description) 
{
	var timestamp = ((((new Date().toISOString()).replace(":", "-")).replace(".", "_")).replace("T", "_")).replace(":", "-");
	var refEvents = firebase.database().ref("events");  
  	refEvents.push().set({timestamp: timestamp, from: from, forwho: forwho, time: time, witness: witness, description: description}, function(error) { if (error) { console.log('Transaction failed abnormally!', error); } else { console.log('Transaction log succeed!'); }});
}

function submit_to_firebase()
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
	
	if (forwho == "forteam") 
	{
		//make call synchronous by snapshot
		var snapshot = null;
		var query = firebase.database().ref('users').orderByChild('name').equalTo(user.displayName);
		firebaseRef.on('value', function(snap) { latestSnapshot = snap; });
		query.once('value', function(snapshot) { snapshot.forEach(function(childSnapshot) { snapshot = childSnapshot});});
		while (snapshot == null) {
			var team = snapshot.val().team;
		}
		
		var count = 0
		var query = firebase.database().ref('users').orderByChild('name').equalTo(user.displayName);
		query.once('value', function(snapshot) { snapshot.forEach(function(childSnapshot) {
    	var childData = childSnapshot.val();
		return childData.team
  			});
		});
		
		var query = firebase.database().ref('users').orderByChild('team').equalTo(team);
		query.once('value', function(snapshot) { snapshot.forEach(function(childSnapshot) {
 			count++
  			});
		});
		
		forwho_full = 'TEAM ' + team ;
		result_time = time*1.2/count;
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