import pdftotext

from .translate import translate
import cyrtranslit

import requests

ELASTICSEARCH_SERVER = "http://es:9200"


def delete(id):
    return requests.delete(f"{ELASTICSEARCH_SERVER}/ebook/_doc/{id}?pretty")

def create(
        id,
        title,
        author,
        keywords,
        publication_year,
        file,
        user_username,
        category_id,
        category_name,
        language_id,
        language_name: str,
):
    ebook_index = get_or_create_index()

    text = ""
    pdf = pdftotext.PDF(file)
    for i in range(0, len(pdf)):
        text += pdf[i]

    language_abbreviation = language_name[:2].lower()
    translated_title = get_translated_title(language_abbreviation, title)
    translated_content = get_translated_content(
        language_abbreviation,
        text.replace("\n", " ").replace(";", ".")
    )
    translated_keywords = get_translated_keywords(language_abbreviation,
                                                  keywords)

    # TODO: refactor
    new_book = {
        "title": translated_title,
        "orig_title": title,
        "author": author,
        "keywords": translated_keywords,
        "orig_keywords": keywords,
        "publication_year": publication_year,
        "content": translated_content,
        "user": user_username,
        "category": {"id": category_id, "name": category_name},
        "language": {"id": language_id, "name": language_name},
        "filename": file.filename,
    }
    return requests.put(f"{ELASTICSEARCH_SERVER}/{ebook_index}/{id}?pretty",
                        json=new_book)


# TODO: make single func

def get_translated_title(language_abbreviation, title):
    result = [title]
    translated_title = translate(language_abbreviation, title)
    result.append(translated_title["res"])
    if language_abbreviation == "en":
        transliterated_title = cyrtranslit.to_latin(translated_title["res"])
        if transliterated_title != title:
            result.append(transliterated_title)
    return result


def get_translated_content(language_abbreviation, content):
    """
    Translate content.

    :param content: ebook content
    :param language_abbreviation:
    :return: ["some content of book", "неки садржај књиге"]
    """
    translated_property = translate(language_abbreviation, content)
    return [content, translated_property["res"]]


def get_translated_keywords(language_abbreviation, keywords):
    """
    Merge keywords from the provided language and translated one.
    Runs transliteration - from cyrillic to latin in case of Serbian.


    :param language_abbreviation: eg. 'en', 'sr'.
    :param keywords: eg. ["epidemic", "flu"].
    :return: eg. ["epidemic", "flu", "епидемија", "грипа"].
    """
    keywords_data = []
    for keyword in keywords.split(","):
        translated_keyword = translate(language_abbreviation, keyword)
        keywords_data.append(keyword)
        keywords_data.append(translated_keyword["res"])
        if language_abbreviation == "en":
            keywords_data.append(
                cyrtranslit.to_latin(translated_keyword["res"]))
        else:
            keywords_data.append(cyrtranslit.to_latin(keyword))
    return keywords_data


def search(constructed_query_json):
    return requests.post(
        f"{ELASTICSEARCH_SERVER}/ebook/_search", json=constructed_query_json
    )


def get_or_create_index():
    """
    Creates ebook index if check returns 400(or doesn't return 200). If
    creation fails, raises exception.
    :return: formated string for elasticsearch querying, eg. ebook/_doc
    """
    if requests.head(f"{ELASTICSEARCH_SERVER}/ebook").status_code != 200:
        data = {
            "mappings": {
                "properties": {
                    "title": {
                        "type": "text"
                    },
                    "author": {
                        "type": "text"
                    },
                    "keywords": {
                        "type": "keyword"
                    },
                    "publication_year": {
                        "type": "integer"
                    },
                    "content": {
                        "type": "text",
                        "fields": {
                            "sr": {
                                "type": "text",
                                "analyzer": "serbian"
                            },
                            "en": {
                                "type": "text",
                                "analyzer": "english"
                            }
                        }
                    },
                    "user": {
                        "type": "text"
                    },
                    "category": {
                        "properties": {
                            "id": {
                                "type": "integer"
                            },
                            "name": {
                                "type": "text"
                            }
                        }
                    },
                    "language": {
                        "properties": {
                            "id": {
                                "type": "integer"
                            },
                            "name": {
                                "type": "text"
                            }
                        }
                    },
                    "filename": {
                        "type": "text"
                    }
                }
            }
        }
        if requests.put(
                f"{ELASTICSEARCH_SERVER}/ebook?pretty",
                json=data)\
                .status_code != 200:
            raise Exception("Couldn't update index mapping, try manually.")
    return "ebook/_doc"


def create_ebook_index():
    pass


def delete_ebook_index():
    return requests.delete(f"{ELASTICSEARCH_SERVER}/ebook/?pretty")
