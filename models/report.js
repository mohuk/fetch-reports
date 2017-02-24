const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let reportSchema = new Schema({
  _id: {
    id: Number,
    reportIndex: Number
  }
}, {strict: false});

module.exports = mongoose.model('Reports', reportSchema);
