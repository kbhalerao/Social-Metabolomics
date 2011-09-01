function(doc, req) {  
    var Mustache = require("vendor/couchapp/lib/mustache");	
    if(doc) {}
    else {
        
        context = {user : req.userCtx.name};
    }
    return Mustache.to_html(this.templates.index, context, this.templates.partials.index);
}