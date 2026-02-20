const express = require('express');
const { body } = require('express-validator');
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All user routes are protected

router.get('/profile', getProfile);

router.put(
  '/profile',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('bio').optional().isLength({ max: 200 }).withMessage('Bio cannot exceed 200 characters'),
  ],
  updateProfile
);

router.put('/change-password', changePassword);

module.exports = router;