const express = require('express');
const router = express.Router();
const { getAllContent, saveContent } = require('../controllers/contentController');

router.get('/all', getAllContent);
router.put('/:id', saveContent);

module.exports = router;
