window.addEventListener('load', function() {
  console.log('app load...');
  
  if (window.FederatedCredential) {
    var credential = new FederatedCredential({
      id:       'alice@gmail.com',                           // id in IdP
      provider: 'https://accounts.google.com', // A string representing IdP
      //name:     'Alice Smith',                         // name in IdP
    });
    
    navigator.credentials.store(credential)
      .then(function() {
        console.log('stored!');
      })
      .catch(function(error) {
        console.log(error)
      });
  }
  
});
