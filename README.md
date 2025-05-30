# AI-Powered Demand Forecasting and Inventory Optimization System

This project is a comprehensive system designed to predict product demand using artificial intelligence and help businesses optimize their inventory management. It features mobile OTP authentication, inventory management capabilities, and integrations with external services.

## Overview

The system is structured into the following key components:

- **Frontend**: A React Native mobile application providing the user interface for authentication, viewing inventory data, managing integrations, and displaying demand forecasts.
- **Backend**: An Express.js server that handles API requests, business logic (including OTP generation/verification), and serves as a bridge to external integrations like Vyapar.
- **AI Model**: Python-based machine learning models for demand forecasting (details in `aimodel/` directory).
- **Integration Layer**: Connectors for interacting with external systems like Vyapar and notification services like WhatsApp.

## Key Features

### Authentication

User authentication is handled via a **Mobile Number + OTP (One-Time Password)** flow:
1.  The user enters their mobile number in the app.
2.  The backend generates a 6-digit OTP.
3.  **Simulation**: Currently, this OTP is:
    *   Logged to the backend console for easy access during development.
    *   Sent via a mock WhatsApp notification (logged to console, no actual message sent).
4.  The user enters the received OTP into the app.
5.  The backend verifies the OTP. If valid, the user is authenticated, and a session (simulated with a dummy token) is established.

### Integrations

The system is designed to integrate with external services:

#### 1. WhatsApp Notifications
- **Purpose**: Used for sending OTPs to users during the authentication process.
- **Status**: The WhatsApp notification service (`backend/services/notificationService.js`) is currently a **mock**. It logs the message content and recipient to the console instead of dispatching a real WhatsApp message. For actual deployment, this would need to be configured with a WhatsApp Business API provider.

#### 2. Vyapar App Integration
- **Purpose**: Allows users to connect their Vyapar account to synchronize inventory data with this application.
- **Process**:
    1.  The user provides their Vyapar API Key and Business Name/ID via the mobile app.
    2.  The backend receives these credentials and uses the `integration/vyaparConnector.js` to authenticate with Vyapar's (simulated) API.
    3.  If authentication is successful, a (simulated) session token is stored by the backend.
    4.  The user can then fetch their inventory data from Vyapar through the app, which requests it from our backend. The backend, in turn, uses the stored token to fetch data from Vyapar.
- **Status**: The Vyapar connector (`integration/vyaparConnector.js`) is currently a **mock**. It simulates API responses for authentication and inventory fetching without making real calls to Vyapar.

## Getting Started (Conceptual)

To run this application with full, real functionality (beyond the current simulations), you would need to:

1.  **Configure API Keys & Endpoints**:
    *   **WhatsApp**: Obtain credentials from a WhatsApp Business API provider and configure them in `backend/services/notificationService.js` (or via environment variables). Update the service to make real API calls.
    *   **Vyapar**: Obtain actual API credentials from Vyapar. Update `integration/vyaparConnector.js` to use the real Vyapar API endpoints and handle authentication/data fetching with these credentials.
2.  **Backend Setup**:
    *   Install Node.js dependencies: `cd backend && npm install`
    *   Run the backend server: `npm start`
3.  **Frontend Setup**:
    *   Install React Native dependencies: `cd frontend && npm install`
    *   Run the mobile application: `npm run android` or `npm run ios` (requires appropriate mobile development environment setup).
4.  **AI Model**:
    *   Set up the Python environment for the AI model as per `aimodel/requirements.txt`.
    *   Train the model using `aimodel/train.py`. The prediction endpoint/logic would need to be active for the backend to use it.

*(Note: The above setup instructions are conceptual and assume a typical development workflow. Actual commands and configurations might vary based on the final deployment strategy.)*

## Contributing

(Placeholder for contribution guidelines)

## License

(Placeholder for license information)
