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
	var timestamp = (((new Date().toISOString()).replace(":", "-")).replace(".", "_")).replace("T", "_");
	var id = timestamp + '_' + Math.floor(Math.random() * 100000);
	var refEvents = firebase.database().ref("events");  
  	refEvents.push().set({timestamp: timestamp});
}

function submit_to_firebase()
{
	write_logs("me", "me", 60, "again me", "popisek");
	window.location.replace('index.html');
}