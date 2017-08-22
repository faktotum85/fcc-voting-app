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
  author: Schema.Types.ObjectId
});
const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
