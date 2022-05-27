window.onload = function() {
  console.log('loaded federated script');
  
  
  // https://developers.google.com/web/fundamentals/security/credential-management
  // https://developers.google.com/web/fundamentals/security/credential-management/retrieve-credentials
  
  
  navigator.credentials.get({ federated: {
       providers: [
         'https://accounts.google.com'
       ]
    } })
    .then(function(credential) {
      console.log('got cred!');
      console.log(credential)
      
      if (!credential) { return; }
      
      
    });
  
  
  /*
  var cred = new FederatedCredential({
    id:       'alice@gmail.com',                           // id in IdP
    provider: 'https://accounts.google.com', // A string representing IdP
    //name:     'Alice Smith',                         // name in IdP
  });
  
  navigator.credentials.store(cred)
    .then(function() {
      console.log('stored!');
    
      // https://stackoverflow.com/questions/503093/how-do-i-redirect-to-another-webpage/506004#506004
      //window.location.href = '/';
    });
  */
};
