from api import db

class Automaton(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    data = db.Column(db.Text, nullable=False)


