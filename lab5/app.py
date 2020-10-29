import json
import logging
import configparser

from flask import Flask, render_template, request

from xml_database import XMLDatabase

config = configparser.ConfigParser()
config.read('config.ini')

app = Flask(__name__)

db = XMLDatabase(config['settings']['db_path'])
db_schema = config['settings']['db_schema'].split(',')

logging.basicConfig(level=logging.INFO)


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html', db=db, db_schema=db_schema)


@app.route('/insert_item', methods=['POST'])
def insert_item():
    record = json.loads(request.data)
    db.insert(record)
    return ""


@app.route('/delete_item', methods=['POST'])
def delete_item():
    person_id = json.loads(request.data)['person_id']
    db.delete(person_id)
    return ""


@app.route('/edit_item', methods=['POST'])
def edit_item():
    record = json.loads(request.data)
    db.edit(**record)
    return ""


if __name__ == '__main__':
    app.run(port=config['setting']['port'])
    db.dump()
