// Placeholder for API service
// In a real app, you would use fetch or a library like Axios to make API calls

// TODO: Replace with your actual backend API base URL
const API_BASE_URL = 'http://localhost:3000/api'; // Example
// For Vyapar related endpoints, assuming they are under a specific path like /vyapar
// This is a frontend simulation, actual backend will handle the Vyapar API calls.

export const fetchForecast = async (location) => {
  // Simulate API call
  console.log(`Fetching forecast for ${location}`);
  // Example of how it might look with a real API call:
  /*
  try {
    const response = await fetch(`${API_BASE_URL}/forecast?location=${location}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch forecast:", error);
    throw error; // Re-throw to allow caller to handle
  }
  */
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        temperature: `${Math.floor(Math.random() * 30) + 10}°C`,
        condition: 'Sunny', // Placeholder
      });
    }, 1000);
  });
};

export const fetchOtherData = async () => {
  // Simulate another API call
  console.log('Fetching other data');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: 'Some other data',
      });
    }, 500);
  });
};

/**
 * Requests an OTP from the backend.
 * @param {string} mobileNumber - The user's mobile number.
 * @returns {Promise<Object>} Backend response (e.g., { success: true, message: 'OTP sent' })
 */
export const requestOtp = async (mobileNumber) => {
  console.log(`Requesting OTP for ${mobileNumber} via API...`);
  // Simulate API call to backend/routes/auth.js (or similar)
  // In a real app:
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/request-otp`, { // Corrected to use API_BASE_URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Request OTP API error:', error);
    // Simulating a more specific error for frontend to handle if backend is down
    if (error.message.includes('Failed to fetch')) {
        return { success: false, message: 'Cannot connect to server. Please try again later.' };
    }
    throw error; // Re-throw for other types of errors
  }
  
  // Simulated response (fallback if actual fetch is commented out):
  /*
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mobileNumber && mobileNumber.length >= 10) { // Basic validation for simulation
        resolve({ success: true, message: 'OTP sent successfully (simulated).' });
      } else {
        reject(new Error('Invalid mobile number for OTP request (simulated).'));
      }
    }, 1000);
  });
  */
};

/**
 * Verifies the OTP with the backend.
 * @param {string} mobileNumber - The user's mobile number.
 * @param {string} otp - The OTP entered by the user.
 * @returns {Promise<Object>} Backend response (e.g., { success: true, token: 'jwt_token', message: 'Login successful' })
 */
export const verifyOtp = async (mobileNumber, otp) => {
  console.log(`Verifying OTP ${otp} for ${mobileNumber} via API...`);
  // Simulate API call to backend/routes/auth.js (or similar)
  // In a real app:
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, { // Corrected to use API_BASE_URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber, otp }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Verify OTP API error:', error);
    if (error.message.includes('Failed to fetch')) {
        return { success: false, message: 'Cannot connect to server. Please try again later.' };
    }
    throw error;
  }
  
  // Simulated response (fallback if actual fetch is commented out):
  /*
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate OTP '123456' as valid for any number for now
      if (otp === '123456') {
        resolve({ success: true, token: `simulated_jwt_token_for_${mobileNumber}`, message: 'Login successful (simulated).' });
      } else {
        reject(new Error('Invalid OTP (simulated).'));
      }
    }, 1000);
  });
  */
};


/**
 * Sends Vyapar credentials to the backend for authentication and storage.
 * @param {Object} credentials - { apiKey, businessName }
 * @returns {Promise<Object>} Backend response (e.g., { success: true, message: 'Vyapar connected' })
 */
export const connectVyapar = async (credentials) => {
  console.log('Connecting Vyapar with credentials:', credentials);
  // This will call a backend endpoint that then uses integration/vyaparConnector.js
  // For now, simulate the backend call.
  /*
  try {
    const response = await fetch(`${API_BASE_URL}/vyapar/connect`, { // Example endpoint
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${userAuthToken}` // If user needs to be authenticated
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Connect Vyapar API error:', error);
    if (error.message.includes('Failed to fetch')) {
        return { success: false, message: 'Cannot connect to server for Vyapar integration.' };
    }
    throw error;
  }
  */
  // Simulated response:
  return new Promise((resolve) => {
    setTimeout(() => {
      if (credentials.apiKey && credentials.businessName) {
        // Simulate a check, e.g. if API key has a certain format or length
        if (credentials.apiKey === "testkey123") {
            resolve({ success: true, message: 'Vyapar successfully connected (simulated).' });
        } else {
            resolve({ success: false, message: 'Invalid API Key or Business Name (simulated).' });
        }
      } else {
        resolve({ success: false, message: 'API Key and Business Name are required (simulated).' });
      }
    }, 1000);
  });
};

/**
 * Fetches inventory data from the backend (which gets it from Vyapar).
 * @returns {Promise<Object>} Backend response (e.g., { success: true, inventory: [...] })
 */
export const getInventory = async () => {
  console.log('Fetching inventory data from backend...');
  // This will call a backend endpoint that then uses integration/vyaparConnector.js to fetch inventory
  // For now, simulate the backend call.
  /*
  try {
    const response = await fetch(`${API_BASE_URL}/vyapar/inventory`, { // Example endpoint
      method: 'GET',
      headers: {
        // 'Authorization': `Bearer ${userAuthToken}` // If user needs to be authenticated
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Get Inventory API error:', error);
    if (error.message.includes('Failed to fetch')) {
        return { success: false, message: 'Cannot connect to server to fetch inventory.' };
    }
    throw error;
  }
  */
  // Simulated response:
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockInventory = [
        { id: 'vyapar_item_S1', name: 'Product Alpha (Simulated)', quantity: 120, price: 12.50, unit: 'pcs', category: 'Gadgets' },
        { id: 'vyapar_item_S2', name: 'Product Beta (Simulated)', quantity: 70, price: 30.99, unit: 'pcs', category: 'Home Goods' },
        { id: 'vyapar_item_S3', name: 'Service Gamma (Simulated)', quantity: null, price: 200.00, unit: 'hr', category: 'Consulting', type: 'service' },
        { id: 'vyapar_item_S4', name: 'Material Delta (Simulated)', quantity: 600, price: 3.00, unit: 'kg', category: 'Supplies' },
      ];
      resolve({ success: true, inventory: mockInventory });
    }, 1000);
  });
};
