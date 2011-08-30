function(doc) {
    if(doc.Pathway_ID) {
	emit(doc.Pathway_ID, {Prefix: doc.Path, 
				Name: doc.Name, 
				Description: doc.Description, 
				Class: doc.Class});
    }  
}
