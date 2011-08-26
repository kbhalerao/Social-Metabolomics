function(doc) {
  if(doc.OtherKeggIDs) {
  if(doc.KeggID == '') {
	emit(doc.Name, {KeggID: doc.KeggID, 
		OtherKeggIDs: doc.OtherKeggIDs, 
		Pathways: doc.Pathways
	});
  }}
}  

