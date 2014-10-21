var express = require('express');
var router = express.Router();
//var mongoose = require('mongoose');
var ProAlbum = require('./../models/proalbum');

// This is for a album
router.route('/proalbum')
.post(function  (req,res) {
  var proAlbumEntry = new ProAlbum();
  parseRequest(req,proAlbumEntry);
  // set current date before saving the entry
  proAlbumEntry.creationDate = Date.now();
  proAlbumEntry.save(function(err){callbackSaveOrUpdate(err,res,proAlbumEntry);});
})
.get(function (req,res){
        // retrieve some parameters from the request object
        var tagged = req.param("tagged"),
            pageNumber = req.param("pagenum"),
            pageSize = req.param("pagesize"),
            recAfterDate = req.param("afterdate");

   var query = ProAlbum.find();
        if (typeof tagged !== 'undefined') {
            query.where('tagged').equals(tagged);
        }
        pageNumber = pageNumber || 1 ;
        pageSize = pageSize || 50 ;

        query.skip((pageNumber-1)*pageSize).limit(pageSize);

        if (typeof recAfterDate !== 'undefined') {

            //todo check for the things which do not match
            var match = recAfterDate.match(/^(\d+)-(\d+)-(\d+)T(\d+)\:(\d+)\:(\d+).(\d+)Z$/)
            if (match) {
                var date = new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6], match[7])
                query.where('creationDate').lte(date);
            }

        }


        //todo add the date parameter to avoid performance bottleneck in production

        query.sort('-creationDate');

        query.exec(function(err,proAlbumEntries){
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
  ProAlbum.findById(req.params.proalbumentryid,function(err,proAlbumEntry){callbackFind(err,proAlbumEntry,res);});
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
      var tagged = gender && hairColor && hairLength && hairStyle;
      if (tagged) {
        proAlbumEntry.tagged = true;
      }
      else {
        proAlbumEntry.tagged = false;
      }

      
      

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
