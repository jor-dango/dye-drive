from flask import Flask, request

app = Flask(__name__)

@app.before_request
def log_request_info():
    print(f"Received {request.method} request to {request.path}")

@app.route('/', methods=['GET', 'POST'])
def home():
    return 'Flask is running!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
