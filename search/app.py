import json

from flask import Flask, request, jsonify
from flask_cors import cross_origin
from query import construct_es_query
from services.elasticsearch import create as do_create
from services.elasticsearch import search as do_search
from services.elasticsearch import delete as do_delete

app = Flask(__name__)


@app.route("/healthcheck")
def healthcheck():
    return "ok"


@app.route("/api/search", methods=["POST"])
@cross_origin(origins=["http://localhost:3000"])
def search():
    json_data = json.loads(request.data)
    constructed_query_json = construct_es_query(
        json_data["query"], json_data["filters"]
    )
    search_results = do_search(constructed_query_json)
    return search_results.json()


@app.route("/create", methods=["POST"])
@cross_origin(origins=["http://localhost:8000"])
def create():
    data = dict(request.form)
    create_result = do_create(
        data["id"],
        data["title"],
        data["author"],
        data["keywords"],
        data["publication_year"],
        request.files["file"],
        data["user_username"],
        data["category_id"],
        data["category_name"],
        data["language_id"],
        data["language_name"],
    )
    return create_result.json(), 201


@app.route("/delete/<int:id>", methods=["DELETE", ])
@cross_origin(origins=["http://localhost:8000"])
def delete(id):
    do_delete(id)
    return jsonify({"success": True})
