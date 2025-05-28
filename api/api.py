from flask import Flask
from flask_cors import CORS
import os, datetime
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

@app.route('/time')
def get_time():
    current_time = datetime.datetime.now().isoformat()
    return {"time": current_time}

@app.route('/saveAutomaton', methods=['POST'])
def save_automaton():
    pass

# Initialize the database
db = SQLAlchemy(app)