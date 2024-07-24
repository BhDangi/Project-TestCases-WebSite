# app.py
# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
from config import config

app = Flask(__name__)
CORS(app)  # Enable CORS

@app.route('/testcases', methods=['GET'])
def get_testcases():
    connection = None
    testcases_records = []
    try:
        params = config()
        connection = psycopg2.connect(**params)
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM testcases")
        testcases_records = cursor.fetchall()
        cursor.close()
        connection.close()
    except (Exception, psycopg2.Error) as error:
        print("Error while fetching data from PostgreSQL", error)
        return jsonify({"error": str(error)}), 500
    return jsonify(testcases_records)

@app.route('/testcases', methods=['POST'])
def add_testcase():
    try:
        params = config()
        connection = psycopg2.connect(**params)
        cursor = connection.cursor()
        data = request.json
        query = """
            INSERT INTO testcases (estimate_time, module, priority, status)
            VALUES (%s, %s, %s, %s)
            RETURNING id;
        """
        cursor.execute(query, (data['estimate_time'], data['module'], data['priority'], data['status']))
        new_id = cursor.fetchone()[0]
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"id": new_id}), 201
    except (Exception, psycopg2.Error) as error:
        print("Error while adding data to PostgreSQL", error)
        return jsonify({"error": str(error)}), 500

@app.route('/testcases/<int:id>', methods=['PUT'])
def update_testcase(id):
    try:
        params = config()
        connection = psycopg2.connect(**params)
        cursor = connection.cursor()
        data = request.json
        query = """
            UPDATE testcases
            SET estimate_time = %s, module = %s, priority = %s, status = %s
            WHERE id = %s;
        """
        cursor.execute(query, (data['estimate_time'], data['module'], data['priority'], data['status'], id))
        connection.commit()
        cursor.close()
        connection.close()
        return '', 204
    except (Exception, psycopg2.Error) as error:
        print("Error while updating data in PostgreSQL", error)
        return jsonify({"error": str(error)}), 500

@app.route('/testcases/<int:id>', methods=['DELETE'])
def delete_testcase(id):
    try:
        params = config()
        connection = psycopg2.connect(**params)
        cursor = connection.cursor()
        query = "DELETE FROM testcases WHERE id = %s;"
        cursor.execute(query, (id,))

        connection.close()
        return jsonify({"id": new_id}), 201
    except (Exception, psycopg2.Error) as error:
        print("Error while adding data to PostgreSQL", error)
        return jsonify({"error": str(error)}), 500

if __name__ == "__main__":
    app.run(debug=True)
