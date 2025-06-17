from flask import Flask, request, jsonify
from flask_cors import CORS
import os, datetime
from models import Automaton
from extensions import db
import json


app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
print("Connected to DB:", app.config['SQLALCHEMY_DATABASE_URI'])
app.logger.info(f"Connected to DB: {app.config['SQLALCHEMY_DATABASE_URI']}")

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/time')
def get_time():
    current_time = datetime.datetime.now().isoformat()
    app.logger.info(f"Current time: {current_time}")
    return {"time": current_time}

@app.route('/save', methods=['POST'])
def save_automaton():
    app.logger.info("Saving automaton...")
    data = request.get_json()
    name = data.get("name")
    automaton_data = data.get("data")

    new_automaton = Automaton(name=name, data=json.dumps(automaton_data))
    db.session.add(new_automaton)
    try:
        db.session.commit()
        app.logger.info("Commit successful")
    except Exception as e:
        app.logger.error(f"Error committing to DB: {e}")
        db.session.rollback()
        return {"status": "error", "message": str(e)}, 500

    return {"status": "success", "message": "Automaton saved!"}, 200

@app.route('/load', methods=['GET'])
def load_automata():
    app.logger.info("Loading automata from DB...")
    automata = Automaton.query.all()
    result = []
    for automaton in automata:
        result.append({
            "id": automaton.id,
            "name": automaton.name,
            "data": json.loads(automaton.data)
        })
    app.logger.info(f"Loaded {len(result)} automata")
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)