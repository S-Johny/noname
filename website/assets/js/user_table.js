// PRINT TABLE WHEN USER IS LOGED-IN
firebase.auth().onAuthStateChanged(user => {
	if(user) {
		  var query = firebase.database().ref("users").orderByKey();
		  query.once("value")
		  .then(function(snapshot) { 
			var id_number = 0
			var content = '';
			content +='<table style="width:100%" id="user_table">';
			content +='<tr id="tr">';
			content +='<th>ORG</th>';
			content +='<th>JMENO</th>';
			content +='<th>TELEFON</th>';
			content +='<th>EMAIL</th>';
			content +='<th>KOMUNIKACNI KANALY</th>';
			content +='<th>TEAM</th>';
			content +='<th>CASOVY BANK</th>';
			content +='<th>INTERNET</th>';
			content +='<th>POWERBANK</th>';
			content +='<th>PONOZKY</th>';
			content +='<th>SPACAK</th>';
			content +='<th>EROUSKA</th>';
			content +='<th>ODKUD ZACINA</th>';
			content +='<th>POZNAVACI ZNAK</th>';
			content +='<th>KAMARADI FB</th>';
			content +='<th>KAMARADI</th>';
			content +='<th>SPANI V PRIRODE (1-5)</th>';
			content +='<th>OTAZKA CO SE CHCE ZEPTAT</th>';
			content +='<th>NEJCENEJSI VEC</th>';
			content +='<th>OBLIBENE JIDLO</th>';
			content +='<th>OBLIBENE MISTO</th>';
			content +='<th>JMENO AKCE</th>';
			content += '</tr>';
			
			snapshot.forEach(function(user) {		
		      var value = user.val();
			  if(value.name != 'admin')
			  {
				  content +='<tr>';
			      content += '<td>' + value.org + '</td>';
				  content += '<td>' + value.name + '</td>';
				  content += '<td>' + value.phone + '</td>';
				  content += '<td>' + value.email + '</td>';
				  content += '<td>' + value.communication + '</td>';
				  content += '<td>' + value.team + '</td>';
				  content += '<td>' + secondsToTimeString(value.time) + '</td>';
				  content += '<td>' + value.internet + '</td>';
				  content += '<td>' + value.powerbanka + '</td>';
				  content += '<td>' + value.sucks + '</td>';
				  content += '<td>' + value.spacak + '</td>';
				  content += '<td>' + value.erouska + '</td>';
				  content += '<td>' + value.startpoint + '</td>';
				  content += '<td>' + value.recognitionsign + '</td>';
				  content += '<td>' + value.firendsfb + '</td>';
				  content += '<td>' + value.firends + '</td>';
				  content += '<td>' + value.naturesleep + '</td>';
				  content += '<td>' + value.question + '</td>';
				  content += '<td>' + value.thethink + '</td>';
				  content += '<td>' + value.food + '</td>';
				  content += '<td>' + value.favoritplace + '</td>';
				  content += '<td>' + value.eventname + '</td>';
			      content += '</tr>';
			  }
		  });
		content +='</table>';
		$('#one').append(content);
		});
	}
});