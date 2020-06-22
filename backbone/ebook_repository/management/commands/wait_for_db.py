import time

import MySQLdb
from django.core.management import BaseCommand
from django.db import connections, DEFAULT_DB_ALIAS
from MySQLdb._exceptions import OperationalError as mysql_operational_error
from django.db.utils import OperationalError as django_operational_error


class Command(BaseCommand):
    def handle(self, *args, **options):
        db_conn = None
        while not db_conn:
            try:
                default_database = connections.databases[DEFAULT_DB_ALIAS]
                db_conn = MySQLdb.connect(
                    default_database["HOST"],
                    default_database["USER"],
                    default_database["PASSWORD"],
                    default_database["NAME"]
                )
                self.stdout.write("Connection to database service established!")
            except (django_operational_error, mysql_operational_error):
                self.stdout.write("Database service is down. Retrying to connect in 10 sec ...")  # noqa E501
                time.sleep(10)
