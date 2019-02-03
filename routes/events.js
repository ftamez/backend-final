const express = require('express');
const router = express.Router();

// event Model
let Event = require('../models/event');
// User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_event', {
    title:'Add Event'
  });
});

// Add Submit POST Route
router.post('/add', function(req, res){
  req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_event', {
      title:'Add Event',
      errors:errors
    });
  } else {
    let event = new Event();
    event.title = req.body.title;
    event.author = req.user._id;
    event.body = req.body.body;
    event.eventImage = req.body.eventImage;

    event.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Event Added');
        res.redirect('/');
      }
    });
  }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Event.findById(req.params.id, function(err, event){
    if(event.author != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_event', {
      title:'Edit Event',
      event:event
    });
  });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
  let event = {};
  event.title = req.body.title;
  event.author = req.body.author;
  event.body = req.body.body;
  event.eventImage = req.body.eventImage;

  let query = {_id:req.params.id}

  Event.update(query, event, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Event Updated');
      res.redirect('/');
    }
  });
});

// Delete event
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Event.findById(req.params.id, function(err, event){
    if(event.author != req.user._id){
      res.status(500).send();
    } else {
      Event.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// Get Single event
router.get('/:id', function(req, res){
  Event.findById(req.params.id, function(err, event){
    User.findById(event.author, function(err, user){
      res.render('event', {
        event:event,
        author: user.name
      });
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
