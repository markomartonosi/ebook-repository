import json
import requests

TRANSLATE_URI = "http://localhost:5001"


def translate(lang, query):
    try:
        resp = requests.get(f"{TRANSLATE_URI}/translate/{lang}/{query}")
        return json.loads(resp.content)
    except Exception as e:
        return {"ex": e}
