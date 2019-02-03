let mongoose = require('mongoose');

// Event Schema
let eventSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  },
  eventImage:{
    type: String,
    required: true
  }  
});

let Event = module.exports = mongoose.model('Event', eventSchema);