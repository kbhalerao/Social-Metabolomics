function(doc) {
   if(doc.KeggID) {
	emit(doc.Name, {KeggID: doc.KeggID, 
		OtherKeggIDs: doc.OtherKeggIDs, 
		Pathways: doc.Pathways, 
		HMDB_id: doc.HMDB_id
	});  
  }
}
