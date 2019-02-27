FROM python:3.6

WORKDIR /opt/superdesk
COPY server/requirements.txt .
RUN pip install -r requirements.txt

COPY server/ ./server
COPY docker/Procfile-dev ./server/Procfile

COPY ./docker/start.sh /opt/superdesk/start.sh
WORKDIR /opt/superdesk/server

RUN python manage.py app:initialize_data; \
    python manage.py users:create -u admin -p admin -e 'admin@example.com' --admin ; \
    python manage.py register_local_themes ;
CMD honcho start

EXPOSE 5000
EXPOSE 5001



