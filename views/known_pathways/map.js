function(doc) {
  if(doc.KeggID) {
  emit(doc.Name, {KeggID: doc.KeggID,  
		Pathways: doc.Pathways
	});
  }  
}
