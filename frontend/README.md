# Frontend - React Application

This is the React frontend for the Digital Health Treatment Tracker application.

## Features

- Clean, responsive user interface
- Create new treatment records with form validation
- View treatments in both card and table layouts
- Delete treatments with confirmation
- Real-time error handling and loading states
- Mobile-first responsive design

## Components

### App.js
Main application component that manages state and coordinates between child components.

### TreatmentForm.js
Form component for creating new treatment records with:
- Patient name input with validation
- Treatment type dropdown (Physiotherapy, Ultrasound, Stimulation)
- Date picker with future date prevention
- Optional notes textarea
- Real-time validation and error handling

### TreatmentList.js
Component for displaying treatments with:
- Card view for mobile devices
- Table view for desktop
- Delete functionality with confirmation
- Empty state when no treatments exist
- Loading states and error handling

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

The app will open at `http://localhost:3000`

## API Integration

The frontend communicates with the Flask backend through the `treatmentService` in `services/api.js`:

- Uses axios for HTTP requests
- Handles errors gracefully
- Provides clean interface for CRUD operations

## Responsive Design

- Mobile-first approach
- Card layout on small screens
- Table layout on desktop
- Accessible design with proper focus states
- Print styles included