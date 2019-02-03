const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var multer = require('multer')
var fs = require('fs');

//storage management for the file
//that will be uploaded
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

//management of the storage and the file that will be uploaded 
//.single expects the name of the file input field
const upload = multer({ storage: storage }).single("file");

module.exports = upload;

// this is the config file for multer

// Photo Model
let Photo = require('../models/photo');
// User Model
let User = require('../models/user');

// Ruta Nueva Upload Photos
router.get('/add', ensureAuthenticated, function (req, res) {
  res.render('add_photo', {
    title: 'Add Photos'
  })
});

//-----Manage the post requests.
router.post("/add", (req, res, next) => {
  //let multer manage the requests
  //which are passed to the upload function
  //by the main request.
  //the function if everything went right
  //will upload the file without cheking if already exists



  // ---------- MULTER UPLOAD FUNCTION -------------
  upload(req, res, function (err) {
    // need to check if the req.file is set.
    if (req.file == null || req.file == undefined || req.file == "") {
      //redirect to the same url            
      res.redirect("/");

    } else {
      // An error occurred when uploading
      if (err) {
        console.log(err);
      } else {
        // Everything went fine
        //define what to do with the params
        //both the req.body and req.file(s) are accessble here
        console.log(req.file);


        //store the file name to mongodb    
        //we use the model to store the file.
        let photo = new Photo();
        photo.fieldname = req.file.fieldname;
        photo.originalname = req.file.originalname;
        photo.encoding = req.file.encoding;
        photo.mimetype = req.file.mimetype;
        photo.destination = req.file.destination;
        photo.filename = req.file.filename;
        photo.path = req.file.path;
        photo.size = req.file.size;

        //save the image
        photo.save(() => {
          if (err) {
            console.log(err);
          } else {
            //render the view again    
            res.redirect("/photos/add");

          }
        });

      }

    }

  });

});

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
