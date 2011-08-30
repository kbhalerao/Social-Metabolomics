$db = $.couch.db("couchdb/metabolomics");
dbget_uri = 'http://www.genome.jp/dbget-bin/www_bget?'
var pathwayList = [];
kopattern = /(map|ko)\d{5}/ig;
path_num = /\d{5}/i;

show_uri = 'http://abe-bhaleraolab.age.uiuc.edu/couchdb/metabolomics/_design/metabolomics/_show/compound/'
function makeButtons() {
    
    $("div#items").empty();
    
    //$("div#items").append('<div id="add_new"><button type="button" id="add_new">Add a new metabolite</button><p></p></div>');  
    // Create a new interface to add / remove metabolites.
    
    $db.view("metabolomics/known_keggIDs", {
        success: function(data) {
            $("div#items").append('<table>');
            for (i in data.rows) {  
                doc_id = data.rows[i].id;  
                name = data.rows[i].key;  
                keggID = data.rows[i].value.KeggID;  
                html = '<div><tr>' +  
                '<td><input class="check" type="checkbox" id="' + doc_id + '">' + 
                name + '</input></td> '+  
                //'<td>' + name + '</td> ' +  
                //'<td>' + keggID + '</td> ' +  
                '<td><a href="#" class="edit" id="' + doc_id + '">edit</a></td> '+  
                '</tr></div>';  
                $("div#items").append(html);
            }
            $("div#items").append("</table>");
			//$ui(":checkbox").button();
			//console.log($ui(":checkbox"));
        }});
}

function addUpdateForm(target, existingDoc) {  
    html = '<form name="update" id="update" action=""> <table>' +  
    //'<tr><td>Name:</td><td>' + (existingDoc ? existingDoc.Name : "") + '</td></tr>' +  
    '<tr><td>KeggID:</td><td>' + (existingDoc ? existingDoc.KeggID : "") + '</td></tr>' +  
    '<tr><td>In Pathways:</td><td>'+ (existingDoc ? existingDoc.Pathways : 'unknown') + '</td></tr>' +  
    '<tr><td>HMDB Accession Number:</td><td> <input type="text" name="hmdb_id" id="hmdb_id"/ value="' +  
    (existingDoc ? existingDoc.HMDB_id : "") + '"></td></tr>' + 
    '<tr><td>Notes:</td><td> <textarea rows="4" cols="40" name="Notes" id="Notes">' + 
    (existingDoc ? existingDoc.Notes : "") + '</textarea></td></tr>' +
    '<tr><td><input type="submit" name="submit" class="update" value="' +
    (existingDoc?"Update":"Add") + '"/></td><td>' +   
    '<input type="submit" name="cancel" class="cancel" value="Cancel"/></td></tr>' +   
    //'<tr><td><a href="' + show_uri + existingDoc._id + '">Full document</a>' + '</td><td></td></tr>' +
    '</table></form>';  
    target.append(html);  
    target.children("form#update").data("existingDoc", existingDoc);  
}  

function updatePathways(doc, state) {
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
    
    $("div#profile").empty();
    $("div#profile").append('<table id="tab"><tr><th>KO/MAP</th><th>Count</th><th>Name</th><th>Class</th></tr>');
    for(path in pathwayList) {
        path_key = path.match(path_num);
        times = pathwayList[path];
        if(times > 0) {
            uri = 'http://abe-bhaleraolab.age.uiuc.edu/couchdb/metabolomics/_design/metabolomics/_view/pathways?key="';
            uri = uri + path_key + '"';
            $.getJSON(uri, function(data) {
                
                obj = data.rows;
                path_name = obj[0]["key"];
                row = obj[0].value;
                $("table#tab").append('<tr><td>' + 
                    '<a href=' + dbget_uri + row.Prefix+path_name + '>' + row.Prefix+path_name +  '</a></td>' +
                    '<td align="center">' + pathwayList[row.Prefix+path_name] + "</td><td>" +
                    row.Name + "</td><td>" + "  " + row.Class + 
                    '</td></tr>');
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
    
    $("div#items").click(function(event) {
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

});	    