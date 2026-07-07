const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  // The fully encrypted cipher text (even the database admin can't read it)
  encryptedContent: {
    type: String,
    required: true,
  },
  // Initialization Vector - a random string used during the encryption process.
  // We need this exact same string to decrypt the note later.
  iv: {
    type: String,
    required: true,
  },
  // Automatically delete notes after 24 hours if they haven't been read/destroyed
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // 86400 seconds = 24 hours
  },
});

module.exports = mongoose.model('Note', noteSchema);
