const express = require('express');
const Note = require('../models/Note');
const { encrypt, decrypt } = require('../utils/encryption');
const router = express.Router();

// @route   POST /api/notes
// @desc    Create a new encrypted note
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Note content is required' });
    }

    // 1. Encrypt the raw text
    const { iv, encryptedData } = encrypt(content);

    // 2. Save ONLY the encrypted data and the IV to the database
    const newNote = new Note({
      encryptedContent: encryptedData,
      iv: iv,
    });

    const savedNote = await newNote.save();

    // 3. Return the unique ID to the user so they can share the link
    res.status(201).json({ id: savedNote._id });
  } catch (error) {
    console.error('Error creating note:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   GET /api/notes/:id
// @desc    Read and immediately destroy an encrypted note
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // 1. Find the note in the database
    const note = await Note.findById(req.params.id);

    // 2. If it doesn't exist (or was already read), return an error
    if (!note) {
      return res.status(404).json({ error: 'Note not found or has already been read/destroyed.' });
    }

    // 3. Temporarily store the encrypted details in memory
    const { encryptedContent, iv } = note;

    // 4. BURN AFTER READING: Immediately delete it from the database!
    await Note.findByIdAndDelete(req.params.id);

    // 5. Decrypt the content back to plain text
    const decryptedContent = decrypt(encryptedContent, iv);

    // 6. Return the plain text to the user
    res.json({ content: decryptedContent });
  } catch (error) {
    console.error('Error retrieving note:', error.message);
    // Return a generic 404 to avoid leaking valid vs invalid ID structures to hackers
    res.status(404).json({ error: 'Note not found or has already been read/destroyed.' });
  }
});

module.exports = router;
