
var express = require('express');
var router = express.Router();
var util = require('util');
var cloudinary = require('cloudinary');
var fs = require('fs');
var mongoose = require('mongoose');
var ProUser = require('./../models/prouser');

cloudinary.config({
  cloud_name: 'www-thelooks-net',
  api_key: '726719321665415',
  api_secret: 'j5AiV3E8h6pwgEDxRzawjBRYr_o'
});



// Render the home page.
router.get('/', function(req, res) {
  res.render('welcome', {title: 'Home', user: req.user});
});

// Render the home page.
router.get('/home', function(req, res) {
  res.render('index', {title: 'Home', user: req.user});
});



// Render the dashboard page.
router.get('/dashboard', function (req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/');
  }
  

  res.render('dashboard', {title: 'Dashboard', user: req.user});
});


// Render the upload test  page
router.get('/upload', function(req, res) {
	res.render('uploaddropzone', {title: 'Uploads', user: req.user});
});


router.get('/pro/new', function(req,res) {
  res.render('prouser', {title: 'Professional', user: req.user});
});

router.route('/prouser')
.post(function  (req,res) {
  
    
  var firstname,lastname = '';
  var nameRegex = /^([A-Za-z\u00C0-\u017F]*)\s(.*)/;
  var fullname = req.body.fullname;

  if (fullname) {

    var match = nameRegex.exec(fullname);
    if (match && match.length > 2) {
      firstname = match[1];
      lastname = match[2];
    }
   
  }

  var prouser = new ProUser({'firstName': firstname, 'lastName': lastname, 'emailId': req.body.email});    // create a new instance of the ProUser model

    
    // save the bear and check for errors
    prouser.save(function(err) {
      console.log(err);
      if (err) {
        res.send(err);
      }
      res.json({ message: prouser.id } );
    });
});





router.post('/upload', function(req,res) {

 console.log(req.body.filesize);
 var imageStream = fs.createReadStream(req.files.file.path, { encoding: 'binary' });
 var cloudStream = cloudinary.uploader.upload_stream(function(result) { console.log(result);res.redirect('/'); });

 imageStream.on('data', cloudStream.write).on('end', cloudStream.end);

});




module.exports = router;
