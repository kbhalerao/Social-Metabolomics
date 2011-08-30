function(doc, req) {  
	var Mustache = require("vendor/couchapp/lib/mustache");	
	
	var context = {data : doc};
	
	return Mustache.to_html(this.templates.edit, context);
	// create a new document
}