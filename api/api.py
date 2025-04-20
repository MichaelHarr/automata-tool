from flask import Flask
from flask_cors import CORS
import os, datetime

app = Flask(__name__)
CORS(app)

@app.route('/time')
def get_time():
    current_time = datetime.datetime.now().isoformat()
    return {"time": current_time}
