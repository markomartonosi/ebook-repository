FROM python:3.7
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN mkdir /backbone
WORKDIR /backbone
ADD requirements.txt /backbone/
RUN pip install -r requirements.txt
ADD . /backbone/
RUN apt update
RUN apt install python3.7-dev default-libmysqlclient-dev -y
