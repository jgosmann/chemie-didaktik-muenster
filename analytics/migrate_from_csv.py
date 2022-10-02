import csv
import json
import os
from csv import Dialect

from deta import Deta

deta = Deta(os.environ["DETA_PROJECT_KEY"])


class MigrationCsvDialect(Dialect):
    delimiter = ";"
    doublequote = True
    quotechar = "'"
    quoting = csv.QUOTE_MINIMAL
    lineterminator = "\r\n"


def migrate_clicks():
    base = deta.Base("click_counts")

    with open("clicks.csv", newline="", encoding="utf-8") as csvfile:
        reader = iter(csv.reader(csvfile, dialect=MigrationCsvDialect()))
        header = {col: i for i, col in enumerate(next(reader))}
        for row in reader:
            base.put(
                {"count": int(row[header["click_count"]])},
                key=f"{row[header['domain_name']]} {row[header['absolute_path']]}",
            )


def migrate_users():
    base = deta.Base("users")

    with open("users.csv", newline="", encoding="utf-8") as csvfile:
        reader = iter(csv.reader(csvfile, dialect=MigrationCsvDialect()))
        header = {col: i for i, col in enumerate(next(reader))}
        for row in reader:
            base.put(
                {
                    "username": row[header["username"]],
                    "realname": row[header["realname"]],
                    "comment": row[header["comment"]],
                    "password_hash": json.loads(row[header["password_hash"]]),
                },
                key=row[header["username"]],
            )
