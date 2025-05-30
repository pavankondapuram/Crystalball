const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

/**
 * @route   POST /api/auth/request-otp
 * @desc    Request an OTP for a given mobile number
 * @access  Public
 */
router.post('/request-otp', async (req, res) => {
  const { mobileNumber } = req.body;

  if (!mobileNumber) {
    return res.status(400).json({ success: false, message: 'Mobile number is required.' });
  }

  try {
    const result = await authService.generateOtp(mobileNumber);
    if (result.success) {
      res.status(200).json(result);
    } else {
      // Use a more specific status code if appropriate, e.g., 400 for validation error
      res.status(400).json(result); 
    }
  } catch (error) {
    console.error('Error in /request-otp route:', error);
    res.status(500).json({ success: false, message: 'Server error while requesting OTP.' });
  }
});

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify an OTP for a given mobile number
 * @access  Public
 */
router.post('/verify-otp', async (req, res) => {
  const { mobileNumber, otp } = req.body;

  if (!mobileNumber || !otp) {
    return res.status(400).json({ success: false, message: 'Mobile number and OTP are required.' });
  }

  try {
    const result = await authService.verifyOtp(mobileNumber, otp);
    if (result.success) {
      // In a real app, you might set a cookie or send back user details with the token
      res.status(200).json(result);
    } else {
      // 400 for invalid OTP, expired, max attempts etc.
      // 401 could also be used if it's strictly an authentication failure
      res.status(400).json(result); 
    }
  } catch (error) {
    console.error('Error in /verify-otp route:', error);
    res.status(500).json({ success: false, message: 'Server error while verifying OTP.' });
  }
});

module.exports = router;
