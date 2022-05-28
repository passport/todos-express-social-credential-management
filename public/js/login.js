window.addEventListener('load', function() {
  
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
      if (!credential) { return; }
      
      switch (credential.provider) {
      case 'https://accounts.google.com':
        window.location.href = '/login/federated/google';
        return;
      case 'https://www.facebook.com':
        window.location.href = '/login/federated/facebook';
        return;
      case 'https://twitter.com':
        window.location.href = '/login/federated/twitter';
        return;
      }
    });
  }
  
});
