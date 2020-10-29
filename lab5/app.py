import json
import logging

from flask import Flask, render_template, request

from xml_database import XMLDatabase

app = Flask(__name__)

db = XMLDatabase('persons.xml')
db_schema = ['person_id', 'name', 'second_name', 'surname', 'phone']

logging.basicConfig(level=logging.INFO)


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html', db=db, db_schema=db_schema)


@app.route('/insert_item', methods=['POST'])
def insert_item():
    record = json.loads(request.data)
    db.insert(record)
    db.dump()
    return ""


@app.route('/delete_item', methods=['POST'])
def delete_item():
    person_id = json.loads(request.data)['person_id']
    db.delete(person_id)
    db.dump()
    return ""


@app.route('/edit_item', methods=['POST'])
def edit_item():
    record = json.loads(request.data)
    db.edit(**record)
    db.dump()
    return ""


if __name__ == '__main__':
    app.run()
