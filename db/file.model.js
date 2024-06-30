const mongoose = require('mongoose')
const jdate = require('jalali-date')

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "users"
  },
  file_id: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true,
  },
  filePath: { type: String, required: true },
}, {
  timestamps: true
})

const model = mongoose.model('files', schema);

module.exports = model;
