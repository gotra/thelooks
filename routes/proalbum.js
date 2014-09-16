var express = require('express');
var router = express.Router();
//var mongoose = require('mongoose');
var ProAlbum = require('./../models/proalbum');

// This is for a album
router.route('/proalbum')
.post(function  (req,res) {
  var proAlbumEntry = new ProAlbum();
  parseRequest(req,proAlbumEntry);
  // save the bear and check for errors
  proAlbumEntry.save(function(err){callbackSaveOrUpdate(err,res,proAlbumEntry);});
})
.get(function (req,res){
  ProAlbum.find(function(err,proAlbumEntries){
    if (err) {
      console.log(err);
      res.status(500);
      res.json({data:{error:err,success:'false'}});
     
    }
    else {
       res.json({data: proAlbumEntries});
    }
      

  });
});


router.route('/proalbum/:proalbumentryid')
.get(function(req,res){
  ProAlbum.findById(req.params.proalbumentryid,function(err,proAlbumEntry){callbackFind(err,proAlbumEntry,res)});
})
.put(function(req,res){
  ProAlbum.findById(req.params.proalbumentryid,function(err,proAlbumEntry){
    if (err) {
      res.status(500);
      res.json({error:'cannot find docment to update'});
    }
    else {
      parseRequest(req,proAlbumEntry);
      proAlbumEntry.save(callbackSaveOrUpdate(err,res,proAlbumEntry));

    }
      
  });

})
.delete(function(req,res) {
   ProAlbum.findById(req.params.proalbumentryid,function(err,proAlbumEntry){
    if (err) {
       
      res.status(500);
      res.json({error:err});
    }
    else if (proAlbumEntry) {
      proAlbumEntry.remove(function(err){
        if(err) {
          res.json({error:err});
        }
        else {
          res.send();
        }
        
      });
    }
    else {
      res.status(404);
     res.json({error:{message:'the resource does not exist or has been removed'}});
    }
      
});
 });

var parseRequest = function(req,proAlbumEntry) {

      var gender = req.body.gender;
      var hairColor = req.body.hairColor;
      var hairStyle = req.body.hairStyle;
      var hairLength = req.body.hairLength;
      var imageId = req.body.imageId;
      if (gender) proAlbumEntry.gender = gender;
      if (hairColor) proAlbumEntry.hairColor = hairColor;
      if (hairStyle) proAlbumEntry.hairStyle = hairStyle;
      if (hairLength) proAlbumEntry.hairLength = hairLength;
      if (imageId) proAlbumEntry.imageId = imageId;

};

var callbackSaveOrUpdate = function(err,res,entry) { 
  if (err) {
    if (err.name == 'ValidationError') {
      res.status(400);
    }
    else {
      res.status(500);
    }
    res.json({error: err});
  }
  else {
    res.json({ data: entry } );
  }
};

var callbackFind = function(err,proAlbumEntry, res) {
  if (err) {
       console.log(err);
      res.status(500);
      res.json({error:err});
  }
  else if (!proAlbumEntry) {
    res.status(404);
    res.send();
  }
  else {      
        res.json({data: proAlbumEntry});

    }
};
module.exports = router;
