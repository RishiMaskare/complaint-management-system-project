const express = require('express');
const { body } = require('express-validator');
const { createAdmin } = require('../controllers/adminController');
const adminSecretMiddleware = require('../middleware/adminSecretMiddleware');

const router = express.Router();

// Validation rules
const createAdminValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot be more than 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// Protected by secret key middleware
router.post(
  '/create',
  adminSecretMiddleware,
  createAdminValidation,
  createAdmin
);

module.exports = router;
