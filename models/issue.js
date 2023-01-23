const mongoose = require('mongoose')

const issueSchema = new mongoose.Schema({
  project: {
    type: String,
    required: true
  },
  issue_title: {
    type: String,
    required: true
  },
  issue_text: {
    type: String,
    required: true
  },
  created_on: {
    type: Date,
    required: true
  },
  created_by: {
    type: String,
    required: true
  },
  updated_on: {
    type: Date,
    required: true
  },
  assigned_to: {
    type: String,
    required: false,
    default: ''
  },
  open: {
    type: Boolean,
    required: true,
    default: true
  },
  status_text: {
    type: String,
    required: false,
    default: ''
  }
})

module.exports = mongoose.model('Issues', issueSchema)