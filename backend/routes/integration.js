const express = require('express');
const router = express.Router();
const vyaparConnector = require('../../integration/vyaparConnector'); // Correct path to the existing connector

// In-memory store for Vyapar session tokens, mapping a user ID to their token.
// IMPORTANT: This is NOT secure for production. In a real app, store this encrypted in a database
// and associate it with the authenticated user session/ID.
const vyaparSessionStore = new Map(); 
const DEFAULT_USER_ID = 'static_test_user_123'; // Placeholder for user ID

/**
 * @route   POST /api/integration/vyapar/connect
 * @desc    Connect to Vyapar by authenticating and storing session token.
 * @access  Private (should be protected by auth middleware in a real app)
 */
router.post('/vyapar/connect', async (req, res) => {
  const { apiKey, businessName } = req.body;
  // const userId = req.user.id; // In a real app, get userId from auth middleware (e.g., JWT payload)

  if (!apiKey || !businessName) {
    return res.status(400).json({ success: false, message: 'Vyapar API key and business name are required.' });
  }

  try {
    console.log(`[IntegrationRoute] Attempting Vyapar auth for user: ${DEFAULT_USER_ID}`);
    const authResult = await vyaparConnector.authenticateVyapar(apiKey, businessName);

    if (authResult.success && authResult.sessionToken) {
      // SECURITY NOTE: Storing session token in-memory here for simulation.
      // In production: Encrypt and store this token in a database, associated with the userId.
      vyaparSessionStore.set(DEFAULT_USER_ID, authResult.sessionToken); 
      console.log(`[IntegrationRoute] Vyapar session token for user ${DEFAULT_USER_ID} stored (simulated). Token: ${authResult.sessionToken}`);
      
      // For simulation, we can send part of the token or user details back.
      // DO NOT send the full sessionToken back to the client in a real application unless strictly necessary
      // and the client can store it securely (which is hard in browsers).
      // It's better if the backend manages this token entirely.
      res.status(200).json({ 
        success: true, 
        message: 'Successfully connected to Vyapar and session initiated.',
        // vyaparUser: authResult.user // Optionally send back non-sensitive user details from Vyapar
      });
    } else {
      console.error(`[IntegrationRoute] Vyapar authentication failed for user ${DEFAULT_USER_ID}: ${authResult.error}`);
      res.status(401).json({ success: false, message: authResult.error || 'Vyapar authentication failed.' });
    }
  } catch (error) {
    console.error('[IntegrationRoute] Server error during Vyapar connect:', error);
    res.status(500).json({ success: false, message: 'Server error while connecting to Vyapar.' });
  }
});

/**
 * @route   GET /api/integration/vyapar/inventory
 * @desc    Fetch inventory data from Vyapar.
 * @access  Private (should be protected by auth middleware)
 */
router.get('/vyapar/inventory', async (req, res) => {
  // const userId = req.user.id; // In a real app, get userId from auth middleware
  
  // SECURITY NOTE: Retrieve the user-specific token.
  const userVyaparToken = vyaparSessionStore.get(DEFAULT_USER_ID);

  if (!userVyaparToken) {
    console.log(`[IntegrationRoute] No Vyapar session token found for user ${DEFAULT_USER_ID}. Please connect to Vyapar first.`);
    return res.status(403).json({ success: false, message: 'Vyapar not connected for this user. Please authenticate with Vyapar first.' });
  }

  try {
    console.log(`[IntegrationRoute] Fetching Vyapar inventory for user ${DEFAULT_USER_ID} using stored token.`);
    const inventoryResult = await vyaparConnector.fetchInventory(userVyaparToken);

    if (inventoryResult.success) {
      res.status(200).json({
        success: true,
        inventory: inventoryResult.inventory,
        message: `Successfully fetched ${inventoryResult.inventory?.length || 0} items.`
      });
    } else {
      // Handle potential token expiry or other Vyapar specific errors
      console.error(`[IntegrationRoute] Failed to fetch Vyapar inventory for user ${DEFAULT_USER_ID}: ${inventoryResult.error}`);
      if (inventoryResult.error && inventoryResult.error.toLowerCase().includes('token expired')) {
        // Optionally, clear the expired token from store
        vyaparSessionStore.delete(DEFAULT_USER_ID);
        return res.status(401).json({ success: false, message: 'Vyapar session token expired. Please reconnect.' });
      }
      res.status(502).json({ success: false, message: inventoryResult.error || 'Failed to fetch inventory from Vyapar.' });
    }
  } catch (error) {
    console.error('[IntegrationRoute] Server error during Vyapar inventory fetch:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching inventory from Vyapar.' });
  }
});

module.exports = router;
