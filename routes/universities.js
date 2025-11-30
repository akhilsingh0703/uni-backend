const express = require('express');
const UniversityController = require('../controllers/UniversityController');

const router = express.Router();

// GET /api/universities - Get all universities
router.get('/', UniversityController.getAllUniversities);

// GET /api/universities/:id - Get university by ID
router.get('/:id', UniversityController.getUniversityById);

// POST /api/universities - Add a new university
router.post('/', UniversityController.addUniversity);

// PUT /api/universities/:id - Update university by ID
router.put('/:id', UniversityController.updateUniversity);

// DELETE /api/universities/:id - Delete university by ID
router.delete('/:id', UniversityController.deleteUniversity);

module.exports = router;
