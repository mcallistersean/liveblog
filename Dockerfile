FROM python:3.6

WORKDIR /opt/superdesk
COPY server/requirements.txt .
RUN pip install -r requirements.txt

COPY server/ ./server
COPY docker/Procfile-dev ./server/Procfile

COPY ./docker/start.sh /opt/superdesk/start.sh
WORKDIR /opt/superdesk/server
CMD honcho -f Procfile start


