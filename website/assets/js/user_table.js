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
			content +='<th style="width: 1.5%">ORG</th>';
			content +='<th style="width: 5%">JMENO</th>';
			content +='<th style="width: 5%">TELEFON</th>';
			content +='<th style="width: 5%">EMAIL</th>';
			content +='<th style="width: 5%">KOMUNIKACNI KANALY</th>';
			content +='<th style="width: 4%">TEAM</th>';
			content +='<th style="width: 4%">CASOVY BANK</th>';
			content +='<th style="width: 1.5%">INTERNET</th>';
			content +='<th style="width: 1.5%";">POWERBANK</th>';
			content +='<th style="width: 2%">PONOZKY</th>';
			content +='<th style="width: 1.5%">SPACAK</th>';
			content +='<th style="width: 1.5%">EROUSKA</th>';
			content +='<th style="width: 1.5%">ODKUD ZACINA</th>';
			content +='<th style="width: 9%">POZNAVACI ZNAK</th>';
			content +='<th style="width: 2%">KAMARADI FB</th>';
			content +='<th style="width: 9%">KAMARADI</th>';
			content +='<th style="width: 1%">SPANI V PRIRODE (1-5)</th>';
			content +='<th style="width: 9%">OTAZKA CO SE CHCE ZEPTAT</th>';
			content +='<th style="width: 9%">NEJCENEJSI VEC</th>';
			content +='<th style="width: 9%">OBLIBENE JIDLO</th>';
			content +='<th style="width: 9%">OBLIBENE MISTO</th>';
			content +='<th style="width: 4%">JMENO AKCE</th>';
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