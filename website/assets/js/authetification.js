function log_out() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
	}).catch(function(error) {
	  // An error happened.
	});
};



  initApp = function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var uid = user.uid;
        var phoneNumber = user.phoneNumber;
        var providerData = user.providerData;
        user.getIdToken().then(function(accessToken) {
          document.getElementById('sign-in-status').textContent = 'Přihlášen/a jako: ' + displayName + '   ';
          document.getElementById('sign-in').textContent = 'ODHLÁSIT';
		  document.getElementById('sign-in').onclick = function () {log_out();};
          $('#menu_links').append('<li><a href="include.html">ZAZNAMENAT</a></li>');
        });
      } else {
        // User is signed out.
        document.getElementById('sign-in-status').textContent = 'Nejsi přihlášen/a   ';
        document.getElementById('sign-in').textContent = 'PŘIHLÁSIT';
        document.getElementById('account-details').textContent = 'null';
      }
    }, function(error) {
      console.log(error);
    });
  };

  window.addEventListener('load', function() {
    initApp();
  });