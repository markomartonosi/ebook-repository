import requests
import json


# TODO: join in 1 function

def en_to_sr(query):
    srp_resp = requests.get(
        f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=sr&dt=t&q={query}")  # noqa
    return extract_reponse(srp_resp)


def sr_to_en(query):
    eng_resp = requests.get(
        f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=sr&tl=en&dt=t&q={query}")  # noqa
    return extract_reponse(eng_resp)


def extract_reponse(g_response):
    json_format = json.loads(g_response.content.decode())[0]
    response_size = len(json_format)
    if response_size == 1:
        return json_format[0][0]
    res = ""
    for part in range(0, response_size):
        res += json_format[part][0]
    return res
