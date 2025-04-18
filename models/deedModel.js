const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const deedSchema = new mongoose.Schema({
  _id:{type:Number,require:true},
  description:{ type: String },
  imageLink: {type:String },
  lastAdding: {type:String,default:Date.now().toString()},
  addedCount: { type: Number, default: 0,require:true  },
  data:{type:String},
});

module.exports = mongoose.model('myDeed', deedSchema);
