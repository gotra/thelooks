var express = require('express');
var router = express.Router();
var passport = require('passport');
var stormpath = require('stormpath');



//Register a new  user via social login
router.post('/socialsignup',function(req,res){

  passport.authenticate('stormpath')(req, res, function () {
          return res.redirect('/dashboard');
  });

});

// Register a new user to Stormpath.
router.post('/register', function(req, res) {

  var username = req.body.username;
  var password = req.body.password;
  var fullname = req.body.fullname;
  var firstname,lastname = '';
  var nameRegex = /^([A-Za-z\u00C0-\u017F]*)\s(.*)/;

  if (fullname) {

    var match = nameRegex.exec(fullname);
    if (match && match.length > 2) {
      firstname = match[1];
      lastname = match[2];
    }
   
  }
  


  // Grab user fields.
  if (!firstname || !lastname) {
    req.flash('error','Firstname and lastname required.');
    req.flash('title','Sign Up');
    return res.redirect('/');
  }

  if (!username || !password) {
    req.flash('error','Email and password required.');
    req.flash('title','Sign Up');
    return res.redirect('/');
  }

  // Initialize our Stormpath client.
  var apiKey = new stormpath.ApiKey(
    process.env['STORMPATH_API_KEY_ID'],
    process.env['STORMPATH_API_KEY_SECRET']
  );
  var spClient = new stormpath.Client({ apiKey: apiKey });

  // Grab our app, then attempt to create this user's account.
  var app = spClient.getApplication(process.env['STORMPATH_APP_HREF'], function(err, app) {
    if (err) throw err;

    app.createAccount({
      givenName: firstname,
      surname: lastname,
      username: username,
      email: username,
      password: password,
    }, function (err, createdAccount) {
      if (err) {
        req.flash('error',err.userMessage);
        req.flash('title','Sign Up');
        return res.redirect('/');
      } else {
        passport.authenticate('stormpath')(req, res, function () {
          return res.redirect('/dashboard');
        });
      }
    });
  });

});



// Render the home page.
router.get('/', function(req, res) {
  var _title = req.flash('title')[0]?req.flash('title')[0]:'Log In';
  res.render('welcome', {title: _title, error: req.flash('error')[0]});
});

// Authenticate a user.
router.post(
  '/login',
  passport.authenticate(
    'stormpath',
    {
      successRedirect: '/dashboard',
      failureRedirect: '/',
      failureFlash: 'Invalid email or password.',
    }
  )
);


// Logout the user, then redirect to the home page.
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


module.exports = router;