from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json
from datetime import datetime
import os
import pytz

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Database configuration
DATABASE = 'treatments.db'

def get_israel_time():
    """Get current time in Israel timezone."""
    israel_tz = pytz.timezone('Asia/Jerusalem')
    return datetime.now(israel_tz)

def get_db_connection():
    """Create a database connection."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # This enables column access by name
    return conn

def init_db():
    """Initialize the database with the treatments table."""
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
    """Validate treatment data."""
    errors = []
    
    if not data.get('patient_name') or not data['patient_name'].strip():
        errors.append('Patient name is required')
    
    if not data.get('treatment_type') or data['treatment_type'].lower() not in ['physiotherapy', 'ultrasound', 'stimulation']:
        errors.append('Valid treatment type is required (Physiotherapy, Ultrasound, or Stimulation)')
    
    if not data.get('treatment_date'):
        errors.append('Treatment date is required')
    else:
        try:
            # Validate date format
            datetime.strptime(data['treatment_date'], '%Y-%m-%d')
        except ValueError:
            errors.append('Invalid date format. Use YYYY-MM-DD')
    
    return errors

@app.route('/treatments', methods=['POST'])
def create_treatment():
    """Create a new treatment record."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate input data
        validation_errors = validate_treatment_data(data)
        if validation_errors:
            return jsonify({'errors': validation_errors}), 400
        
        # Insert into database
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
    """Get all treatment records."""
    try:
        conn = get_db_connection()
        treatments = conn.execute('''
            SELECT id, patient_name, treatment_type, treatment_date, notes, created_at
            FROM treatments
            ORDER BY treatment_date DESC, created_at DESC
        ''').fetchall()
        conn.close()
        
        # Convert to list of dictionaries
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
    """Delete a treatment record."""
    try:
        conn = get_db_connection()
        
        # Check if treatment exists
        treatment = conn.execute(
            'SELECT id FROM treatments WHERE id = ?', (treatment_id,)
        ).fetchone()
        
        if not treatment:
            conn.close()
            return jsonify({'error': 'Treatment not found'}), 404
        
        # Delete the treatment
        conn.execute('DELETE FROM treatments WHERE id = ?', (treatment_id,))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Treatment deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'message': 'Treatment Tracker API is running'}), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({'error': 'Method not allowed'}), 405

if __name__ == '__main__':
    # Initialize database
    init_db()
    print("Database initialized successfully")
    
    # Run the application
    print("Starting Treatment Tracker API server...")
    print("API available at: http://localhost:5000")
    print("Health check: http://localhost:5000/health")
    app.run(debug=True, host='0.0.0.0', port=5000)