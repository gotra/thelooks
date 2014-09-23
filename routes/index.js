
var express = require('express');
var router = express.Router();
var util = require('util');
var cloudinary = require('cloudinary');
var fs = require('fs');
var ProUser = require('./../models/prouser');
var ProAlbum = require('./../models/proalbum');
var crypto =  require('crypto');
var querystring = require('querystring');

cloudinary.config({
  cloud_name: 'www-thelooks-net',
  api_key: '726719321665415',
  api_secret: 'j5AiV3E8h6pwgEDxRzawjBRYr_o'
});





// Render the home page.
router.get('/home', function(req, res) {
  res.render('index', {title: 'Home', user: req.user});
});

// Render the home page.
router.get('/test', function(req, res) {
  res.render('test', {title: 'Home', user: req.user});
});



// Render the dashboard page.
router.get('/dashboard', function (req, res) {
  /* if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/');
  } */


  //todo to retrieve images from backend, then point to cloudinary database
  var imageObjectArray = [{imagename:'A-1.jpg'},
    {imagename:'A-2.jpg'},
    {imagename:'A-3.jpg'},
    {imagename:'A-4.jpg'},
    {imagename:'A-5.jpg'},
    {imagename:'A-7.jpg'},
  ];

  

  res.render('dashboard', {title: 'Dashboard', user: req.user, images: imageObjectArray});
});


// the administrator page
router.get('/admin', function(req, res) {
  res.render('admin', {title: 'Administrate', user: req.user});
});

// the admindtration tag page
router.get('/tag', function(req, res) {
 
  ProAlbum.find(function(err,proAlbumEntries){
    if (err) {
      console.log(err);

    }
   
    res.render('tag', {title: 'Administrate', user: req.user, images: proAlbumEntries});

  });
  
});

// Render the upload page
router.get('/upload', function(req, res) {
	res.render('uploaddropzone', {title: 'Uploads', user: req.user});
});

// Render the upload test  page
router.get('/uploadjq', function(req, res) {
  res.render('uploadjquery', {title: 'Uploads', user: req.user, cloudinary: cloudinary});
});

//send the signature
router.get('/image/signature', function(req,res){
  //var tobehashed = querystring.stringify({timesatmp=})
  var _ts = Math.round(Date.now()/1000);
  var _hash = querystring.stringify({timestamp: _ts + 'j5AiV3E8h6pwgEDxRzawjBRYr_o'});
  var generator = crypto.createHash('sha1');
  generator.update(_hash);
  var _signature = generator.digest('hex');
  res.json({"timestamp": _ts, "api_key": '726719321665415'  , "signature": _signature});
});

//TODO to be remoed

router.get('/pro/new', function(req,res) {
  res.render('prouser', {title: 'Professional', user: req.user, prouser: new ProUser()});
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
})
.get(function (req,res){
  ProUser.find(function(err,prousers){
    if (err) {
      console.log(err);
      req.flash('error',err);
      res.redirect('/error');
     
    }
    else {
       res.render('prouserlist', {title: 'Professional', user: req.user, prouserlist: prousers});
    }
      

  });
});


router.route('/prouser/:prouserid')
.get(function(req,res){
  ProUser.findById(req.params.prouserid,function(err,prouser){
    if (err) {
       console.log(err);
      req.flash('error',{status:'err.name',stack:err.message});
      res.redirect('/error');
    }
    else {
       console.log(prouser);
      res.render('prouser',{title: 'Professional', user: req.user, prouser: prouser});
    }
      
  });

});

// ------- End to be removed




router.post('/upload', function(req,res) {

 console.log(req.body.filesize);
 var imageStream = fs.createReadStream(req.files.file.path, { encoding: 'binary' });
 var cloudStream = cloudinary.uploader.upload_stream(function(result) { console.log(result);res.redirect('/'); });

 imageStream.on('data', cloudStream.write).on('end', cloudStream.end);

});

router.get('/error',function(req,res){

  res.render('error', { messages: req.flash('error') });

});


module.exports = router;
