const express = require('express');
const { body } = require('express-validator');
const {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaint,
  deleteComplaint,
} = require('../controllers/complaintController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');

const router = express.Router();

// Validation rules
const createComplaintValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot be more than 1000 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Electricity', 'Water', 'Hostel', 'Cleanliness', 'Classroom', 'Other'])
    .withMessage('Invalid category'),
];

const updateComplaintValidation = [
  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Resolved'])
    .withMessage('Invalid status'),
  body('remarks')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Remarks cannot be more than 500 characters'),
];

// Routes
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  handleUploadError,
  createComplaintValidation,
  createComplaint
);

router.get('/', authMiddleware, getComplaints);
router.get('/:id', authMiddleware, getComplaint);

router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  updateComplaintValidation,
  updateComplaint
);

router.delete('/:id', authMiddleware, adminMiddleware, deleteComplaint);

module.exports = router;
