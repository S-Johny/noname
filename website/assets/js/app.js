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
	  var content = '';
      var value = user.val();
	  content +='<tr>';
      content += '<td>' + value.name + '</td>';
      content += '<td>' + value.time + '</td>';
      content += '</tr>';
      $('#user_table').append(content);
  });
});