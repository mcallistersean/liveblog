#!/bin/sh
python app_init_elastic.py;
python manage.py app:initialize_data ;
python manage.py users:create -u admin -p admin -e 'admin@example.com' --admin ;
python manage.py register_local_themes ;
python manage.py register_bloglist ;
