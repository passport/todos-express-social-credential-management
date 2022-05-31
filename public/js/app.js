// https://www.quirksmode.org/js/cookies.html
function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

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

function eraseCookie(name) {
  createCookie(name,"",-1);
}

window.addEventListener('load', function() {
  
  var fc = readCookie('fc');
  eraseCookie('fc');
  
  if (window.FederatedCredential && fc) {
    var params = new URLSearchParams(decodeURIComponent(fc));
    var data = {
      id: params.get('id'),
      provider: params.get('provider')
    };
    if (params.has('name')) {
      data.name = params.get('name');
    }
    
    var credential = new FederatedCredential(data);
    navigator.credentials.store(credential)
    .catch(function(error) {
      console.log(error)
    });
  }
  
});
