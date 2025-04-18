const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const VALID_TAGS = ['🧡', '😮', '😶', '💔'];
exports.VALID_TAGS = VALID_TAGS;
const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
exports.commentSchema = commentSchema;
const objSchema = new mongoose.Schema({
  _id: { type: Number, require: true },
  hostageName: { type: String },
  description: { type: String },
  lyrics: { type: String },
  audioLink: { type: String },
  imageLink: { type: String },
  returned: { type: Boolean },
  returned2: { type: Boolean },
  returnDate: { type: String, default: Date.now().toString() },
  returnDate2: { type: String },
  died:{type:Boolean},

  // createdAt: { type: Date, default: Date.now },
  likedBy: { type: [String], default: [], require: true },
  likesCount: { type: Number, default: 0, require: true },
  tags: {
    type: [String], require: true,
    validate: {
      validator: function (tags) {
        return tags.every(tag => VALID_TAGS.includes(tag));
      },
      message: "אחת או יותר מהתגיות אינן חוקיות."
    },
    default: []
  },
  comments: [commentSchema],
  data: { type: String },
});

module.exports = mongoose.model('myObj', objSchema);
