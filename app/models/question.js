const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
  question: String,
  options: [{
    label: String,
    votes: {
      type: Number,
      default: 0
    }
  }]
});
const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
