// PRINT TABLE EVENTS WHEN USER IS LOGED-IN
firebase.auth().onAuthStateChanged(user => {
	if(user) {
		  var query = firebase.database().ref("events").orderByKey();
		  query.once("value")
		  .then(function(snapshot) { 
			var id_number = 0
			var content = '';			
			content +='</table>';
			snapshot.forEach(function(event) {
		      var value = event.val();
			  var line = '';
			  line +='<tr>';
			  line += '<td>' + value.description + '</td>';
		      line += '<td>' + value.from + '</td>';
			  line += '<td>' + value.forwho + '</td>';
			  line += '<td>' + value.time/60 + 'min </td>';
			  line += '<td>' + value.before + '</td>';
			  line += '<td>' + value.after + '</td>';
	          line += '<td>' + value.witness + '</td>';
			  line += '<td>' + value.timestamp + ' (UTC)</td>';
		      line += '</tr>';
			  content = line + content;
		  });
			content ='</tr>'+ content;
			content ='<th>CASOVY OTISK (UTC)</th>'+ content;
			content ='<th>SVEDEK</th>'+ content;
			content ='<th>PO</th>'+ content;
			content ='<th>PRED</th>'+ content;
			content ='<th>CAS</th>'+ content;
			content ='<th>PRIJEMCE</th>'+ content;
			content ='<th>ZADAVATEL</th>'+ content;
			content ='<th>POPIS</th>'+ content;
			content ='<tr id="tr">'+ content;
			content ='<table style="width:100%" id="event_table">'+ content;
		$('#one').append(content);
		});
	}
});