const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let projectSchema = new Schema({
    name: String,
    id: Number,
    serial: Number,
    currentIndex: Number
});

module.exports = mongoose.model('Projects', projectSchema);
