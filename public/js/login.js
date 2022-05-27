window.addEventListener('load', function() {
  console.log('loaded federated script');
  
  if (window.FederatedCredential) {
    navigator.credentials.get({
      federated: {
        providers: [
          'https://accounts.google.com',
          'https://www.facebook.com',
          'https://twitter.com'
        ]
      },
      mediation: 'required'
    })
    .then(function(credential) {
      console.log('got cred!');
      console.log(credential)
    
      if (!credential) { return; }
      
      switch (credential.provider) {
      case 'https://accounts.google.com':
        window.location.href = '/login/federated/google';
        return;
      }
    
    });
  }
  
});
