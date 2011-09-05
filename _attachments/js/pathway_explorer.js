if(window.location.hostname == 'abe-bhaleraolab.age.uiuc.edu') {
	$.couch.urlPrefix = 'http://abe-bhaleraolab.age.uiuc.edu/couchdb';
	}
$db = $.couch.db("metabolomics");
dbget_uri = 'http://www.genome.jp/dbget-bin/www_bget?'
var pathwayList = [];
kopattern = /(map|ko)\d{5}/ig;
path_num = /\d{5}/i;

compound_show_uri = '_show/compound/';
pathway_show_uri = '_show/pathway/';

function makeButtons() {
    
    $("div#metabolites").empty();
        
    $db.view("metabolomics/known_keggIDs", {
        success: function(data) {
            $("div#metabolites").append('<table>');
            for (i in data.rows) {  
                doc_id = data.rows[i].id;  
                name = data.rows[i].key;  
                keggID = data.rows[i].value.KeggID;  
                html = '<div><tr>' +  
                '<td><input class="check" type="checkbox" id="' + doc_id + '">&nbsp;&nbsp;' + 
                '<a title="Kegg ID ' + keggID + ' Add your insights" href="' +
                compound_show_uri + doc_id + '">' + name + '</a></input></td> '+  
                '</tr></div>';  
                $("div#metabolites").append(html);
            }
            $("div#metabolites").append("</table>");
        }});
}

function updatePathways(doc, state, cb) {
    pathstring = doc.Pathways;
    pathways = pathstring.match(kopattern);	 
    if(state == true) { //add to table
        for(path in pathways) {
            if(pathwayList[pathways[path]] == undefined) {
                pathwayList[pathways[path]] = 1;
            }
            else {
                num = pathwayList[pathways[path]];
                num = num+1;
                pathwayList[pathways[path]] = num;
            }
        }
    }
    else { // remove from table
        for(path in pathways) {
            num = pathwayList[pathways[path]];
            num = num -1;
            pathwayList[pathways[path]] = num;
        }
    }
    
    $("div#pathways").empty();
    $('div#dynatext').empty();
    $('div#wordcloud').empty();
    $("div#pathways").append('<table id="tab"><tr><th>KO/MAP</th><th>Count</th><th>Name</th><th>Class</th></tr>');
    for(path in pathwayList) {
        path_key = path.match(path_num);
        times = pathwayList[path];
        if(times > 0) {
            uri = '_view/pathways?key="';
            uri = uri + path_key + '"';
            $.getJSON(uri, function(data) {
                
                obj = data.rows;
                path_name = obj[0]["key"];
                row = obj[0].value;
                if(row.Description != "") {
                    $("div#dynatext").append(
                    	'<p><a href="' + pathway_show_uri + obj[0]["id"] + '"' +
                    	' title="Add your insights">' + 
                    	row.Prefix+path_name + '</a>: <em>(' + row.Name + ')</em> ' +
                    	row.Description + '</p>');
                }
                $("table#tab").append('<tr><td>' + 
                    '<a href="' + pathway_show_uri + obj[0]["id"] + '">' + row.Prefix+path_name +  '</a></td>' +
                    '<td align="center">' + pathwayList[row.Prefix+path_name] + "</td><td>" +
                    row.Name + "</td><td>" + "  " + row.Class + 
                    '</td></tr>');
                $("#dynatext").dynaCloud('#wordcloud');
                });
            }
        }
}

$(document).ready(function() {
    makeButtons();
    $("button#add_new").click(function(event) {     
				$("form#update").remove();  
				$("button#add").hide();  
				addUpdateForm($("div#add_new"));  
			});
    
    $("div#metabolites").click(function(event) {
        $tgt = $(event.target);
        if($tgt.attr("type") == "checkbox") {
            id = $tgt.attr("id");
            state = $tgt.attr("checked");
            $db.openDoc(id, { success: function(doc) {  
            updatePathways(doc, state); 
            }});
        }
        if ($tgt.hasClass("edit")) { 
            id = $tgt.attr("id");
            $("button#add").show();  
            $("form#update").remove();  
            $db.openDoc(id, { success: function(doc) {  
            addUpdateForm($tgt.parent(), doc);  
            }});  
        }	
    });
    
    $("input.cancel").live('click', function(event) {  
    			$("button#add").show();  
   				$("form#update").remove();  
    			return false;  
  		 	});   
  		 	
    $("input.update").live('click', function(event) {  
            var $tgt = $(event.target);  
            var $form = $tgt.parents("form#update");  
            var $doc = $form.data('existingDoc') || {};   
            $doc.HMDB_id = $.trim($form.find("input#hmdb_id").val());
            $doc.Notes = $.trim($form.find("textarea#Notes").val());
            $db.saveDoc(  
                $doc,  
                {success: function() {  
                $("button#add").show();  
                $("form#update").remove();  
                makeButtons();  
                }});  
            return false;  
           });  
    
    // add stopwords to $.stopWords
    app_stopwords = {
		'aa' : true, 
		'aas' : true,
		'md' : true, 
		'atp' : true, 
		'pathway' : true,
		'cycle' : true
		};
	$.extend($.wordStats.stopWords, app_stopwords);
	
});	    