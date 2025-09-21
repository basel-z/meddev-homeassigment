"""
Digital Health Treatment Tracker API

A Flask-based REST API for managing medical treatment records.
Provides endpoints for creating, reading, and deleting treatment records
with SQLite database storage and timezone-aware timestamps.

Author: Health Tracker Development Team
Version: 1.0.0
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json
from datetime import datetime
import os
import pytz

# Initialize Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend communication

# Database configuration
DATABASE = 'treatments.db'  # SQLite database file for treatment records

def get_israel_time():
    """
    Get current time in Israel timezone.
    
    Returns:
        datetime: Current datetime object in Israel/Asia/Jerusalem timezone
        
    Note:
        Used for consistent timestamp creation across the application
        to ensure all records use the same timezone regardless of server location.
    """
    israel_tz = pytz.timezone('Asia/Jerusalem')
    return datetime.now(israel_tz)

def get_db_connection():
    """
    Create a database connection with row factory for named column access.
    
    Returns:
        sqlite3.Connection: Database connection object with row factory enabled
        
    Note:
        Row factory allows accessing columns by name (row['column_name'])
        instead of just by index, making code more readable and maintainable.
    """
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Enable column access by name
    return conn

def init_db():
    """
    Initialize the database with the treatments table.
    
    Creates the treatments table if it doesn't exist with the following schema:
    - id: Primary key (auto-increment)
    - patient_name: Patient's full name (required)
    - treatment_type: Type of treatment (Physiotherapy/Ultrasound/Stimulation)
    - treatment_date: Date when treatment was administered (YYYY-MM-DD format)
    - notes: Optional notes about the treatment
    - created_at: Timestamp when record was created (ISO format with timezone)
    
    Raises:
        sqlite3.Error: If database operation fails
    """
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS treatments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_name TEXT NOT NULL,
            treatment_type TEXT NOT NULL,
            treatment_date TEXT NOT NULL,
            notes TEXT,
            created_at TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def validate_treatment_data(data):
    """
    Validate treatment data before database insertion.
    
    Args:
        data (dict): Dictionary containing treatment data with keys:
            - patient_name: Patient's name (required, non-empty string)
            - treatment_type: Treatment type (required, must be valid type)
            - treatment_date: Treatment date (required, YYYY-MM-DD format)
            - notes: Optional notes (string)
    
    Returns:
        list: List of validation error messages. Empty list if valid.
        
    Validation Rules:
        - patient_name: Required, must not be empty or whitespace-only
        - treatment_type: Must be one of: 'physiotherapy', 'ultrasound', 'stimulation'
        - treatment_date: Required, must be valid YYYY-MM-DD format
    """
    errors = []
    
    # Validate patient name
    if not data.get('patient_name') or not data['patient_name'].strip():
        errors.append('Patient name is required')
    
    # Validate treatment type
    valid_types = ['physiotherapy', 'ultrasound', 'stimulation']
    if not data.get('treatment_type') or data['treatment_type'].lower() not in valid_types:
        errors.append('Valid treatment type is required (Physiotherapy, Ultrasound, or Stimulation)')
    
    # Validate treatment date
    if not data.get('treatment_date'):
        errors.append('Treatment date is required')
    else:
        try:
            # Validate date format (YYYY-MM-DD)
            datetime.strptime(data['treatment_date'], '%Y-%m-%d')
        except ValueError:
            errors.append('Invalid date format. Use YYYY-MM-DD')
    
    return errors

@app.route('/treatments', methods=['POST'])
def create_treatment():
    """
    Create a new treatment record.
    
    Endpoint: POST /treatments
    Content-Type: application/json
    
    Request Body:
        {
            "patient_name": "string (required)",
            "treatment_type": "string (required) - Physiotherapy|Ultrasound|Stimulation",
            "treatment_date": "string (required) - YYYY-MM-DD format",
            "notes": "string (optional)"
        }
    
    Returns:
        201: Success response with treatment ID
            {
                "message": "Treatment created successfully",
                "id": integer
            }
        400: Validation error response
            {
                "error": "No data provided"
            } OR {
                "errors": ["validation error message", ...]
            }
        500: Server error response
            {
                "error": "Server error: error message"
            }
    
    Raises:
        Exception: For database connection or insertion errors
    """
    try:
        # Parse JSON request body
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate input data
        validation_errors = validate_treatment_data(data)
        if validation_errors:
            return jsonify({'errors': validation_errors}), 400
        
        # Insert into database with timezone-aware timestamp
        conn = get_db_connection()
        israel_time = get_israel_time().isoformat()
        cursor = conn.execute('''
            INSERT INTO treatments (patient_name, treatment_type, treatment_date, notes, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            data['patient_name'].strip(),
            data['treatment_type'],
            data['treatment_date'],
            data.get('notes', '').strip(),
            israel_time
        ))
        
        treatment_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Treatment created successfully',
            'id': treatment_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/treatments', methods=['GET'])
def get_treatments():
    """
    Retrieve all treatment records.
    
    Endpoint: GET /treatments
    
    Returns:
        200: Success response with list of treatments
            [
                {
                    "id": integer,
                    "patient_name": "string",
                    "treatment_type": "string",
                    "treatment_date": "string (YYYY-MM-DD)",
                    "notes": "string",
                    "created_at": "string (ISO format with timezone)"
                },
                ...
            ]
        500: Server error response
            {
                "error": "Server error: error message"
            }
    
    Note:
        Results are ordered by treatment_date DESC, created_at DESC
        to show most recent treatments first.
    
    Raises:
        Exception: For database connection or query errors
    """
    try:
        conn = get_db_connection()
        treatments = conn.execute('''
            SELECT id, patient_name, treatment_type, treatment_date, notes, created_at
            FROM treatments
            ORDER BY treatment_date DESC, created_at DESC
        ''').fetchall()
        conn.close()
        
        # Convert sqlite3.Row objects to list of dictionaries for JSON serialization
        treatments_list = []
        for treatment in treatments:
            treatments_list.append({
                'id': treatment['id'],
                'patient_name': treatment['patient_name'],
                'treatment_type': treatment['treatment_type'],
                'treatment_date': treatment['treatment_date'],
                'notes': treatment['notes'],
                'created_at': treatment['created_at']
            })
        
        return jsonify(treatments_list), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/treatments/<int:treatment_id>', methods=['DELETE'])
def delete_treatment(treatment_id):
    """
    Delete a specific treatment record.
    
    Endpoint: DELETE /treatments/{treatment_id}
    
    Args:
        treatment_id (int): The ID of the treatment to delete (from URL path)
    
    Returns:
        200: Success response
            {
                "message": "Treatment deleted successfully"
            }
        404: Treatment not found
            {
                "error": "Treatment not found"
            }
        500: Server error response
            {
                "error": "Server error: error message"
            }
    
    Note:
        This is a hard delete operation - the record is permanently removed
        from the database and cannot be recovered.
    
    Raises:
        Exception: For database connection or query errors
    """
    try:
        conn = get_db_connection()
        
        # Check if treatment exists before attempting deletion
        treatment = conn.execute(
            'SELECT id FROM treatments WHERE id = ?', (treatment_id,)
        ).fetchone()
        
        if not treatment:
            conn.close()
            return jsonify({'error': 'Treatment not found'}), 404
        
        # Delete the treatment record
        conn.execute('DELETE FROM treatments WHERE id = ?', (treatment_id,))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Treatment deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint for monitoring and load balancing.
    
    Endpoint: GET /health
    
    Returns:
        200: Service is healthy
            {
                "status": "healthy",
                "message": "Treatment Tracker API is running"
            }
    
    Note:
        This endpoint can be used by monitoring systems, load balancers,
        or deployment scripts to verify the API is running and responsive.
    """
    return jsonify({'status': 'healthy', 'message': 'Treatment Tracker API is running'}), 200

@app.errorhandler(404)
def not_found(error):
    """
    Handle 404 Not Found errors.
    
    Args:
        error: The error object (automatically passed by Flask)
    
    Returns:
        JSON response with 404 status code
            {
                "error": "Endpoint not found"
            }
    """
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    """
    Handle 405 Method Not Allowed errors.
    
    Args:
        error: The error object (automatically passed by Flask)
    
    Returns:
        JSON response with 405 status code
            {
                "error": "Method not allowed"
            }
    """
    return jsonify({'error': 'Method not allowed'}), 405

if __name__ == '__main__':
    """
    Application entry point.
    
    Initializes the database and starts the Flask development server.
    
    Configuration:
        - Debug mode: Enabled for development
        - Host: 0.0.0.0 (accessible from all network interfaces)
        - Port: 5000 (default Flask port)
    
    Note:
        In production, this should be replaced with a proper WSGI server
        like Gunicorn or uWSGI.
    """
    # Initialize database on startup
    init_db()
    print("Database initialized successfully")
    
    # Start the Flask development server
    print("Starting Treatment Tracker API server...")
    print("API available at: http://localhost:5000")
    print("Health check: http://localhost:5000/health")
    print("Available endpoints:")
    print("  POST /treatments - Create new treatment")
    print("  GET /treatments - Get all treatments")
    print("  DELETE /treatments/{id} - Delete treatment")
    print("  GET /health - Health check")
    
    app.run(debug=True, host='0.0.0.0', port=5000)