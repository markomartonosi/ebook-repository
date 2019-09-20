FROM python:3.7
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN apt update
RUN apt install build-essential libpoppler-cpp-dev pkg-config python3.7-dev -y
RUN mkdir /search
ADD . /search
ADD requirements.txt /search
WORKDIR /search
RUN pip install -r requirements.txt
ENV FLASK_APP app.py
ENV FLASK_ENV development
