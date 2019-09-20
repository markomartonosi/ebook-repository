FROM python:3.7
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN mkdir /translate
ADD . /translate
ADD requirements.txt /translate
WORKDIR /translate
RUN pip install -r requirements.txt
ENV FLASK_APP app.py
ENV FLASK_ENV development
