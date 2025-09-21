# Backend - Flask API Server

This is the Flask backend for the Digital Health Treatment Tracker application.

## Features

- REST API endpoints for treatment management
- SQLite database for data persistence
- Input validation and error handling
- CORS support for frontend communication

## API Endpoints

### Create Treatment
- **POST** `/treatments`
- **Body**: JSON object with treatment data
```json
{
  "patient_name": "John Doe",
  "treatment_type": "Physiotherapy",
  "treatment_date": "2025-09-21",
  "notes": "Patient responded well to treatment"
}
```

### Get All Treatments
- **GET** `/treatments`
- **Response**: Array of treatment objects

### Delete Treatment
- **DELETE** `/treatments/:id`
- **Response**: Success/error message

### Health Check
- **GET** `/health`
- **Response**: API status

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the server:
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## Database

Uses SQLite database (`treatments.db`) with the following schema:

```sql
CREATE TABLE treatments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_name TEXT NOT NULL,
    treatment_type TEXT NOT NULL,
    treatment_date TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```