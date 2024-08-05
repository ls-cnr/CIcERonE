from flask import Flask, request, jsonify
from database import get_mental_space_lattice, update_mental_space_lattice
from llm_functions import generate_new_lattice, query_implicit_knowledge
from dotenv import load_dotenv
import os

#load_dotenv()
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

app = Flask(__name__)

FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Server is up and running"}), 200


@app.route('/update_mental_space', methods=['POST'])
def update_mental_space():
    data = request.json
    project_id = data['project_id']
    source = data['source']
    interview = data['interview']

    current_lattice = get_mental_space_lattice(project_id)
    new_lattice = generate_new_lattice(current_lattice, source, interview)
    update_success = update_mental_space_lattice(project_id, new_lattice)

    return jsonify({"success": update_success})


@app.route('/query_implicit_knowledge', methods=['POST'])
def query_implicit_knowledge_route():
    data = request.json
    project_id = data['project_id']

    lattice = get_mental_space_lattice(project_id)
    response = query_implicit_knowledge(lattice)

    return jsonify({"response": response})


#if __name__ == '__main__':
#    app.run(host='127.0.0.1', port=FLASK_PORT, debug=True)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=int(os.getenv('FLASK_PORT', 5000)), debug=True)