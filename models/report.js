const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let reportSchema = new Schema({
  id: Number
}, {strict: false});

module.exports = mongoose.model('Reports', reportSchema);
