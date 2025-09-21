# Digital Health Treatment Tracker

A web application for healthcare providers to track patient treatments with a React frontend and Flask backend.

## Features

- Create new treatment records with patient details
- View all treatments in a clean, organized list
- Delete treatments as needed
- Responsive design for desktop and mobile
- Input validation and error handling

## Project Structure

```
health-tracker/
├── backend/          # Flask API server
├── frontend/         # React application
└── README.md
```

## Setup Instructions

### Backend (Flask)
1. Navigate to the backend directory
2. Install dependencies: `pip install -r requirements.txt`
3. Run the server: `python app.py`

### Frontend (React)
1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## API Endpoints

- `POST /treatments` - Create a new treatment
- `GET /treatments` - Get all treatments
- `DELETE /treatments/:id` - Delete a treatment

## Technology Stack

- **Frontend**: React, CSS3
- **Backend**: Flask, SQLite
- **Communication**: REST API