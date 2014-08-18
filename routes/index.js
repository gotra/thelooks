
var express = require('express');
var router = express.Router();
var util = require('util');

//var multipart = require('connect-multiparty');
//var multipartMiddleware = multipart();
//var flow = require('./../flow-node.js')('tmp/flow');
//var formidable = require('formidable');
var cloudinary = require('cloudinary');
var fs = require('fs');

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





router.post('/upload', function(req,res) {

 console.log(req.body.filesize);
 var imageStream = fs.createReadStream(req.files.file.path, { encoding: 'binary' });
 var cloudStream = cloudinary.uploader.upload_stream(function(result) { console.log(result);res.redirect('/'); });

 imageStream.on('data', cloudStream.write).on('end', cloudStream.end);

});




module.exports = router;
