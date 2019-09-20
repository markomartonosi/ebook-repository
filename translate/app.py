import urllib.parse

from flask import Flask, jsonify
from flask_cors import cross_origin

from .services.google import en_to_sr, sr_to_en

import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)


@app.route("/translate/<string:lang>/<string:query>", methods=["GET"])
@cross_origin(origins=["http://localhosts:5000"])
def translate(lang, query):
    try:
        uri_encoded_query = urllib.parse.quote(query)
        if lang == "en":
            return jsonify(
                {"sl": "en", "tl": "sr", "res": en_to_sr(uri_encoded_query)}
            )
        return jsonify(
            {"sl": "sr", "tl": "en", "res": sr_to_en(uri_encoded_query)}
        )
    except Exception as e:
        logging.info(e)
        return jsonify({"en": query, "sr": query}), 500
