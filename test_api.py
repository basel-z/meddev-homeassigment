import requests
import json

# Test the Flask API endpoints

BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_get_treatments():
    """Test getting all treatments"""
    print("Testing GET /treatments...")
    response = requests.get(f"{BASE_URL}/treatments")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_create_treatment():
    """Test creating a new treatment"""
    print("Testing POST /treatments...")
    treatment_data = {
        "patient_name": "John Doe",
        "treatment_type": "Physiotherapy",
        "treatment_date": "2025-09-21",
        "notes": "Patient responded well to treatment session"
    }
    
    response = requests.post(
        f"{BASE_URL}/treatments", 
        json=treatment_data,
        headers={"Content-Type": "application/json"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()
    
    if response.status_code == 201:
        return response.json().get("id")
    return None

def test_delete_treatment(treatment_id):
    """Test deleting a treatment"""
    if not treatment_id:
        print("No treatment ID to delete")
        return
        
    print(f"Testing DELETE /treatments/{treatment_id}...")
    response = requests.delete(f"{BASE_URL}/treatments/{treatment_id}")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_invalid_treatment():
    """Test creating an invalid treatment"""
    print("Testing invalid treatment creation...")
    invalid_data = {
        "patient_name": "",  # Invalid - empty name
        "treatment_type": "InvalidType",  # Invalid - not in allowed types
        "treatment_date": "invalid-date",  # Invalid - bad date format
        "notes": "Some notes"
    }
    
    response = requests.post(
        f"{BASE_URL}/treatments", 
        json=invalid_data,
        headers={"Content-Type": "application/json"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

if __name__ == "__main__":
    print("=== Testing Health Treatment Tracker API ===\n")
    
    try:
        # Test all endpoints
        test_health_check()
        test_get_treatments()
        
        # Create a test treatment
        treatment_id = test_create_treatment()
        
        # Get treatments again to see the new one
        test_get_treatments()
        
        # Test validation
        test_invalid_treatment()
        
        # Delete the test treatment
        test_delete_treatment(treatment_id)
        
        # Get treatments again to confirm deletion
        test_get_treatments()
        
        print("=== All API tests completed successfully! ===")
        
    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to the API server.")
        print("Make sure the Flask server is running on http://localhost:5000")
    except Exception as e:
        print(f"ERROR: {e}")