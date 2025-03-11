import os
import base64
import requests
import json
import argparse
from pathlib import Path
from pprint import pprint

# Parse command line arguments
parser = argparse.ArgumentParser(description='Test FatSecret Image Recognition API')
parser.add_argument('--image', type=str, help='Path to image file')
parser.add_argument('--region', type=str, default='Italy', help='Region for food localization')
parser.add_argument('--language', type=str, default='it', help='Language code')
args = parser.parse_args()

# Base URL for API requests
BASE_URL = "http://localhost:8000"

def test_image_recognition_api():
    """Test the image recognition API with a sample image"""
    # If no image path is provided, use a default sample image path
    image_path = args.image if args.image else os.path.join('data', 'sample_food.jpg')
    
    # Check if the image file exists
    if not os.path.exists(image_path):
        print(f"Error: Image file not found at {image_path}")
        print("Please provide a valid image path using --image argument")
        return
    
    print(f"\n--- Testing Image Recognition API with image: {image_path} ---")
    print(f"Region: {args.region}, Language: {args.language}")
    
    # Read and encode the image
    with open(image_path, 'rb') as image_file:
        image_binary = image_file.read()
        image_base64 = base64.b64encode(image_binary).decode('utf-8')
    
    # Send request to API
    url = f"{BASE_URL}/api/image-recognition/process"
    payload = {
        "image_base64": image_base64,
        "region": args.region,
        "language": args.language
    }
    
    print("\nSending request to API...")
    try:
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            data = response.json()
            
            # Print response info
            print("\nResponse received successfully!")
            data_source = "Test Mock Data" if data.get("status") == "mock_response" else "FatSecret API"
            print(f"Data Source: {data_source}")
            
            # Print recognized foods
            if "food_response" in data and data["food_response"]:
                print("\nRecognized Foods:")
                for i, food in enumerate(data["food_response"], 1):
                    print(f"\n{i}. {food.get('food_entry_name', 'Unknown Food')}")
                    
                    # Print serving information if available
                    if "suggested_serving" in food:
                        serving = food["suggested_serving"]
                        print(f"   Serving: {serving.get('serving_description', 'N/A')}")
                    
                    # Print nutritional information if available
                    if "eaten" in food and "total_nutritional_content" in food["eaten"]:
                        nutrition = food["eaten"]["total_nutritional_content"]
                        print("   Nutritional Content:")
                        print(f"     - Calories: {nutrition.get('calories', 'N/A')} kcal")
                        print(f"     - Carbs: {nutrition.get('carbohydrate', 'N/A')} g")
                        print(f"     - Protein: {nutrition.get('protein', 'N/A')} g")
                        print(f"     - Fat: {nutrition.get('fat', 'N/A')} g")
            else:
                print("\nNo foods recognized in the image.")
                
            # Save response to file for debugging
            with open('image_recognition_response.json', 'w') as f:
                json.dump(data, f, indent=2)
                print("\nDetailed response saved to 'image_recognition_response.json'")
        else:
            print(f"Error: API returned status code {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"Error: {str(e)}")
        print("\nMake sure the backend server is running at http://localhost:8000")

def test_image_upload_api():
    """Test the image upload endpoint using a multipart form request"""
    # If no image path is provided, use a default sample image path
    image_path = args.image if args.image else os.path.join('data', 'sample_food.jpg')
    
    # Check if the image file exists
    if not os.path.exists(image_path):
        print(f"Error: Image file not found at {image_path}")
        print("Please provide a valid image path using --image argument")
        return
    
    print(f"\n--- Testing Image Upload API with image: {image_path} ---")
    print(f"Region: {args.region}, Language: {args.language}")
    
    # Prepare the multipart form data
    url = f"{BASE_URL}/api/image-recognition/upload"
    files = {
        'file': (Path(image_path).name, open(image_path, 'rb'), 'image/jpeg')
    }
    data = {
        'region': args.region,
        'language': args.language
    }
    
    print("\nSending upload request to API...")
    try:
        response = requests.post(url, files=files, data=data)
        
        if response.status_code == 200:
            data = response.json()
            
            # Print response info
            print("\nResponse received successfully!")
            data_source = "Test Mock Data" if data.get("status") == "mock_response" else "FatSecret API"
            print(f"Data Source: {data_source}")
            
            # Print recognized foods
            if "food_response" in data and data["food_response"]:
                print("\nRecognized Foods:")
                for i, food in enumerate(data["food_response"], 1):
                    print(f"\n{i}. {food.get('food_entry_name', 'Unknown Food')}")
                    
                    # Print serving information if available
                    if "suggested_serving" in food:
                        serving = food["suggested_serving"]
                        print(f"   Serving: {serving.get('serving_description', 'N/A')}")
                    
                    # Print nutritional information if available
                    if "eaten" in food and "total_nutritional_content" in food["eaten"]:
                        nutrition = food["eaten"]["total_nutritional_content"]
                        print("   Nutritional Content:")
                        print(f"     - Calories: {nutrition.get('calories', 'N/A')} kcal")
                        print(f"     - Carbs: {nutrition.get('carbohydrate', 'N/A')} g")
                        print(f"     - Protein: {nutrition.get('protein', 'N/A')} g")
                        print(f"     - Fat: {nutrition.get('fat', 'N/A')} g")
            else:
                print("\nNo foods recognized in the image.")
                
            # Save response to file for debugging
            with open('image_upload_response.json', 'w') as f:
                json.dump(data, f, indent=2)
                print("\nDetailed response saved to 'image_upload_response.json'")
        else:
            print(f"Error: API returned status code {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"Error: {str(e)}")
        print("\nMake sure the backend server is running at http://localhost:8000")

if __name__ == "__main__":
    # Create the data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    # Test both API endpoints
    test_image_recognition_api()
    test_image_upload_api()
