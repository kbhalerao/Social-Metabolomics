function(doc) {
    if(doc.Type == 'Pathway') {
	emit(doc.Name, {Prefix: doc.Path, Description: doc.Description, Family: doc.Family});
    }  
}
