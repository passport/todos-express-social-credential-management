window.addEventListener('load', function() {
  console.log('app load...');
  console.log(document.cookie);
  
  // https://www.quirksmode.org/js/cookies.html
  function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }
  
  
  if (window.FederatedCredential) {
    var c = readCookie('fc');
    
    console.log(c)
    console.log(decodeURIComponent(c));
    
    var params = new URLSearchParams(decodeURIComponent(c));
    //var params = new URLSearchParams(null);
    console.log(params);
    console.log(params.get('provider'));
    console.log(params.get('id'))
    console.log(params.get('name'))
    
    var credential = new FederatedCredential({
      id: params.get('id'),
      provider: params.get('provider'),
      name: params.get('name')
    });
    
    /*
    var credential = new FederatedCredential({
      id:       'alice@gmail.com',                           // id in IdP
      provider: 'https://accounts.google.com', // A string representing IdP
      //name:     'Alice Smith',                         // name in IdP
    });
    */
    
    navigator.credentials.store(credential)
      .then(function() {
        console.log('stored!');
      })
      .catch(function(error) {
        console.log(error)
      });
  }
  
});
