FROM python:3.7.7-slim

COPY requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip install -r requirements.txt

COPY . /app

RUN chmod -R 777 /app

ENV TZ="Asia/Jakarta"

ENTRYPOINT ["./gunicorn.sh"]