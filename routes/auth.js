var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');
var FacebookStrategy = require('passport-facebook');
var TwitterStrategy = require('passport-twitter');
var querystring = require('querystring');
var db = require('../db');


function jitProvision(provider, profile, cb) {
  db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
    provider,
    profile.id
  ], function(err, row) {
    if (err) { return cb(err); }
    if (!row) {
      db.run('INSERT INTO users (name) VALUES (?)', [
        profile.displayName
      ], function(err) {
        if (err) { return cb(err); }
        var id = this.lastID;
        db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
          id,
          provider,
          profile.id
        ], function(err) {
          if (err) { return cb(err); }
          var user = {
            id: id,
            name: profile.displayName
          };
          return cb(null, user);
        });
      });
    } else {
      db.get('SELECT * FROM users WHERE id = ?', [ row.user_id ], function(err, row) {
        if (err) { return cb(err); }
        if (!row) { return cb(null, false); }
        return cb(null, row);
      });
    }
  });
}

passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: [ 'email' ]
}, function verify(issuer, profile, cb) {
  return jitProvision(issuer, profile, function(err, user) {
    if (err) { return cb(err); }
    var cred = {
      id: profile.id,
      provider: 'https://accounts.google.com'
    };
    if (profile.emails && profile.emails[0]) {
      cred.id = profile.emails[0].value;
    }
    if (profile.displayName) {
      cred.name = profile.displayName;
    }
    return cb(null, user, { credential: cred });
  });
}));

passport.use(new FacebookStrategy({
  clientID: process.env['FACEBOOK_CLIENT_ID'],
  clientSecret: process.env['FACEBOOK_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/facebook',
  scope: [ 'public_profile', 'email' ],
  state: true
}, function verify(accessToken, refreshToken, profile, cb) {
  return jitProvision('https://www.facebook.com', profile, function(err, user) {
    if (err) { return cb(err); }
    var cred = {
      id: profile.id,
      provider: 'https://www.facebook.com'
    };
    if (profile.emails && profile.emails[0]) {
      cred.id = profile.emails[0].value;
    }
    if (profile.displayName) {
      cred.name = profile.displayName;
    }
    return cb(null, user, { credential: cred });
  });
}));

passport.use(new TwitterStrategy({
  consumerKey: process.env['TWITTER_CONSUMER_KEY'],
  consumerSecret: process.env['TWITTER_CONSUMER_SECRET'],
  callbackURL: '/oauth/callback/twitter'
}, function verify(token, tokenSecret, profile, cb) {
  return jitProvision('https://twitter.com', profile, function(err, user) {
    if (err) { return cb(err); }
    var cred = {
      id: profile.id,
      provider: 'https://twitter.com'
    };
    if (profile.username) {
      cred.id = profile.username;
    }
    if (profile.emails && profile.emails[0]) {
      cred.id = profile.emails[0].value;
    }
    if (profile.displayName) {
      cred.name = profile.displayName;
    }
    return cb(null, user, { credential: cred });
  });
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


function setFederatedCredentialCookie(req, res, next) {
  console.log('SETTING COOKIE');
  console.log(req.authInfo);
  
  var credential = req.authInfo.credential;
  if (!credential) { return next(); }
  
  console.log('SET IT!');
  res.cookie('fc', querystring.stringify(credential));
  next();
}

var router = express.Router();

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/login/federated/google', passport.authenticate('google'));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
  failureRedirect: '/login'
}), setFederatedCredentialCookie, function(req, res, next) {
  res.redirect('/');
});

router.get('/login/federated/facebook', passport.authenticate('facebook'));

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  failureRedirect: '/login'
}), setFederatedCredentialCookie, function(req, res, next) {
  res.redirect('/');
});

router.get('/login/federated/twitter', passport.authenticate('twitter'));

router.get('/oauth/callback/twitter', passport.authenticate('twitter', {
  failureRedirect: '/login'
}), setFederatedCredentialCookie, function(req, res, next) {
  res.redirect('/');
});

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
