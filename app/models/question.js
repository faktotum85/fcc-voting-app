const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const questionSchema = new Schema({
  question: String,
  options: [{
    label: String,
    votes: {
      type: Number,
      default: 0
    }
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});
const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
