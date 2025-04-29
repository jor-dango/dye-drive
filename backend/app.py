import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from dotenv import load_dotenv
import os
import base64
from inference_sdk import InferenceHTTPClient

# Initialize the flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for mobile app requests

# Load environment variables
load_dotenv()
api_key = os.getenv("CV_KEY")
print("api key is:", api_key)
# Initialize Roboflow client
CLIENT = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key=api_key
)

# Route to process images from mobile app
@app.route('/process-image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    # Get the image file
    image_file = request.files['image']
    
    try:
        # Convert image to OpenCV format to get dimensions
        # This will help calculate the boundaries
        img_bytes = image_file.read()
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Calculate bounds for the middle third
        img_width = img.shape[1]
        FIRST_BOUND = img_width / 3
        SECOND_BOUND = img_width / 3 * 2
        
        # Reset file pointer to beginning of file before sending to Roboflow
        image_file.seek(0)
        
        # Send to Roboflow
        # Encode image to base64
        image_base64 = base64.b64encode(img_bytes).decode("utf-8")
        response = CLIENT.infer(image_base64, model_id="traffic-lights-2-x0i7e/1")
        prediction = response
        print(prediction)


        # Parse and display the result
        if 'predictions' in prediction: 
            result = {
                'success': True,
                'prediction': None
            }
            
            if 'predictions' in prediction and prediction['predictions']:
                traffic_light_color = ""
                image_detected = False
               
                for light in prediction['predictions']: 
                    if light["x"] > FIRST_BOUND and (light["x"]) < SECOND_BOUND:
                        traffic_light_color = light['class']
                        image_detected = True
                        
                        # Add detected image info to result
                        result['prediction'] = {
                            'detected': True,
                            'color': traffic_light_color,
                            'position': {
                                'x': light['x'],
                                'y': light['y']
                            },
                            'confidence': light['confidence']
                        }
                        print(f"Traffic light color detected: {traffic_light_color}")
                
                if not image_detected:
                    result['prediction'] = {
                        'color': "null",
                        'detected': False,
                        'message': 'No traffic image detected in the middle section.'
                    }
                    print("No traffic light detected in the middle section.")
            else:
                result['prediction'] = {
                    'color': "null",
                    'detected': False,
                    'message': 'No traffic light detected.'
                }
                print("No traffic light detected.")
            print('result is: ', result)
            return jsonify(result)
        else:
            print(f"Error in prediction request: {response.status_code}")
            return jsonify({
                'success': False,
                'error': f'Roboflow API error: {response.status_code}'
            }), 500
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Main function to run the Flask app
if __name__ == '__main__':
    # Add this import here to avoid issues if numpy isn't available
    import numpy as np
    app.run(host='0.0.0.0', port=80, debug=True)