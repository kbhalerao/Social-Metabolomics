function(doc) {
    if(doc.KeggID != '') {
	emit(doc.Name, doc.KeggID);
	}
}
