# Human-in-the-Loop AI Supervisor

A React/Node.js application that manages customer support tickets with AI-human collaboration. The system automatically handles queries with AI and escalates to human supervisors when needed.

## Features

- AI-powered initial customer interactions
- Human supervisor dashboard for ticket management
- LiveKit integration for real-time chat rooms
- Three ticket statuses:
  - `processing` (AI handling conversation)
  - `needs_human` (requires admin intervention)
  - `resolved` (ticket completed)
- Separate customer and admin portals

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- LiveKit account
- OpenAI API key
- Firebase project (for frontend)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
2. ```bash
   npm install
3. Create a .env file in the root directory (outside backend) with these configurations:
   ```bash
    LIVEKIT_API_KEY=your_livekit_api_key
    LIVEKIT_API_SECRET=your_livekit_api_secret
    LIVEKIT_URL=your_livekit_url (e.g., wss://your-domain.livekit.cloud)
    OPENAI_API_KEY=your_openai_key
    PORT=3001

4. Start the backend server:
   ```bash
   node server.js


### Frontend Setup

1. Navigate to the frontend directory::
   ```bash
   cd frontend
2. ```bash
   npm install
3. Create a .env file in the frontend directory with your Firebase config:
   ```bash
    REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    REACT_APP_FIREBASE_PROJECT_ID=your_project_id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    REACT_APP_FIREBASE_APP_ID=your_app_id
    REACT_APP_LIVEKIT_URL=your_livekit_url (must match backend)

4. Start the backend server:
   ```bash
   npm start
   


