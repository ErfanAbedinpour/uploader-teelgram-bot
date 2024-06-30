const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  user_id: { type: String, required: true },
  files: [{ type: mongoose.Types.ObjectId, ref: "files" }],
  username: { type: String, required: true },
}, {
  timestamps: true
})

const model = mongoose.model('users', schema)
module.exports = model;
