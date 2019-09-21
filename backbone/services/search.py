import requests

FLASK_APP = "localhost://search:5000>"


def create_e_ebook(id,
                   title,
                   author,
                   keywords,
                   publication_year,
                   filename,
                   user,
                   category,
                   language):
    files = {"file": filename}
    additional_data = {
        "id": id,
        "title": title,
        "author": author,
        "keywords": keywords,
        "publication_year": publication_year,
        "user_username": user.username,
        "category_id": category.id,
        "category_name": category.name,
        "language_id": language.id,
        "language_name": language.name
    }
    return requests.post(
        f"{FLASK_APP}/create", files=files, data=additional_data
    )


def delete_e_book(id):
    return requests.delete(f"{FLASK_APP}/delete/{id}")
