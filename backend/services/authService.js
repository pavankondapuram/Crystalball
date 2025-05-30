const notificationService = require('./notificationService'); // Import NotificationService

// In-memory store for OTPs.
// In a production environment, use Redis or a database for persistence and scalability.
// Structure: { "mobileNumber": { otp: "123456", expiresAt: timestamp, attempts: 0 } }
const otpStore = new Map();

const OTP_EXPIRY_MINUTES = 5; // OTPs expire in 5 minutes
const MAX_VERIFY_ATTEMPTS = 3; // Max attempts to verify an OTP

/**
 * Generates a random 6-digit OTP.
 * @returns {string} The generated OTP.
 */
function generateRandomOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generates an OTP, stores it, and simulates sending it via WhatsApp.
 * @param {string} mobileNumber - The user's mobile number.
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function generateOtp(mobileNumber) {
  if (!mobileNumber || !/^\d{10,15}$/.test(mobileNumber)) {
    return { success: false, message: 'Valid mobile number is required (10-15 digits).' };
  }

  const otp = generateRandomOtp();
  const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;

  otpStore.set(mobileNumber, { otp, expiresAt, attempts: 0 });

  // Log OTP for debugging/simulation (as before)
  console.log(`[AuthService] OTP for ${mobileNumber}: ${otp} (Expires: ${new Date(expiresAt).toLocaleTimeString()})`);

  // Attempt to send OTP via WhatsApp
  try {
    const whatsappMessage = `Your OTP is: ${otp}`;
    const notificationResult = await notificationService.sendWhatsAppMessage(mobileNumber, whatsappMessage);
    
    if (notificationResult.success) {
      console.log(`[AuthService] OTP WhatsApp notification initiated for ${mobileNumber}. Message ID: ${notificationResult.messageId}`);
      return { success: true, message: 'OTP generated and WhatsApp notification sent (simulated).' };
    } else {
      console.warn(`[AuthService] OTP generated for ${mobileNumber}, but WhatsApp notification failed: ${notificationResult.error}`);
      // Decide if this is a critical failure or if OTP generation is still considered "successful"
      // For now, let's say it's not critical, the console log above still "delivered" the OTP for simulation.
      return { success: true, message: 'OTP generated (WhatsApp failed, see logs).' };
    }
  } catch (error) {
    console.error(`[AuthService] Error calling notificationService for ${mobileNumber}:`, error);
    // Similar decision: is this critical?
    return { success: true, message: 'OTP generated (WhatsApp encountered an exception, see logs).' };
  }
}

/**
 * Verifies the provided OTP against the stored OTP.
 * @param {string} mobileNumber - The user's mobile number.
 * @param {string} otp - The OTP provided by the user.
 * @returns {Promise<{success: boolean, message: string, token?: string}>}
 */
async function verifyOtp(mobileNumber, otp) {
  if (!mobileNumber || !otp) {
    return { success: false, message: 'Mobile number and OTP are required.' };
  }

  const storedEntry = otpStore.get(mobileNumber);

  if (!storedEntry) {
    return { success: false, message: 'No OTP request found for this mobile number or OTP expired. Please request a new OTP.' };
  }

  if (Date.now() > storedEntry.expiresAt) {
    otpStore.delete(mobileNumber); // Clean up expired OTP
    return { success: false, message: 'OTP has expired. Please request a new one.' };
  }

  if (storedEntry.attempts >= MAX_VERIFY_ATTEMPTS) {
    otpStore.delete(mobileNumber); // OTP invalidated after too many attempts
    return { success: false, message: 'Maximum verification attempts reached. Please request a new OTP.' };
  }

  if (storedEntry.otp === otp) {
    otpStore.delete(mobileNumber); // OTP is valid, remove it after use

    // In a real application, generate a JWT token here.
    // For now, a simple success message and a dummy token.
    // const token = jwt.sign({ mobileNumber }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
    const token = `dummy-jwt-token-for-${mobileNumber}-${Date.now()}`;
    
    console.log(`OTP verified for ${mobileNumber}. Token: ${token}`);
    return { success: true, message: 'OTP verified successfully. Login successful.', token };
  } else {
    storedEntry.attempts += 1;
    otpStore.set(mobileNumber, storedEntry); // Update attempts count
    const remainingAttempts = MAX_VERIFY_ATTEMPTS - storedEntry.attempts;
    return { 
        success: false, 
        message: `Invalid OTP. ${remainingAttempts > 0 ? `${remainingAttempts} attempts remaining.` : 'No attempts remaining. Request a new OTP.'}` 
    };
  }
}

module.exports = {
  generateOtp,
  verifyOtp,
  // For testing or admin purposes, you might want to inspect the store
  // getOtpStore: () => otpStore 
};
