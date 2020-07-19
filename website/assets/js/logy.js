// PRINT TABLE EVENTS WHEN USER IS LOGED-IN
firebase.auth().onAuthStateChanged(user => {
	if(user) {
		  var query = firebase.database().ref("events").orderByKey();
		  query.once("value")
		  .then(function(snapshot) { 
			var id_number = 0
			var content = '';
			content +='<table style="width:100%" id="event_table">';
			content +='<tr id="tr">';
			content +='<th>CASOVY OTISK (UTC)</th>';
			content +='<th>ZADAVATEL</th>';
			content +='<th>PRIJEMCE</th>';
			content +='<th>CAS</th>';
			content +='<th>PRED</th>';
			content +='<th>PO</th>';
			content +='<th>SVEDEK</th>';
			content +='<th>POPIS</th>';
			
			snapshot.forEach(function(event) {
		      var value = event.val();
			  content +='<tr>';
		      content += '<td>' + value.timestamp + ' (UTC)</td>';
		      content += '<td>' + value.from + '</td>';
			  content += '<td>' + value.forwho + '</td>';
			  content += '<td>' + value.time/60 + 'min </td>';
			  content += '<td>' + value.before + '</td>';
			  content += '<td>' + value.after + '</td>';
	          content += '<td>' + value.witness + '</td>';
			  content += '<td>' + value.description + '</td>';
		      content += '</tr>';
		  });
		content +='</table>';
		$('#one').append(content);
		});
	}
});