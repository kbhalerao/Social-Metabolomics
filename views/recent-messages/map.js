function(doc) {
  if(doc.message) {
  emit(doc.created_at, doc);}
}