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
	var forwho = document.forms.zaznamenat.elements.prokoho.value
	var time = document.forms.zaznamenat.elements.time.value
	var witness = document.forms.zaznamenat.elements.witness.value
	var description = document.forms.zaznamenat.elements.description.value
	write_logs("me", forwho, time, witness, description);
	var timeRef = firebase.database().ref('users/Petr Kus/time');
	timeRef.transaction(function(currentTime) {return currentTime + time;}, function(error, committed, snapshot) { if (error) { console.log('Transaction failed abnormally!', error); } else { console.log('Transaction log succeed!'); window.location.replace('index.html'); }});
}