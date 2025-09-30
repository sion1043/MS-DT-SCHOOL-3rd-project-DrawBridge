import os
import json
import time
import logging
from datetime import datetime, timezone, timedelta
import azure.functions as func
import psycopg2
from psycopg2.extras import RealDictCursor
 
KST = timezone(timedelta(hours=9))
app = func.FunctionApp()
 
def _get_conn():
    return psycopg2.connect(
        host=os.environ["PG_HOST"],
        port=os.environ.get("PG_PORT", "5432"),
        dbname=os.environ["PG_DB"],
        user=os.environ["PG_USER"],
        password=os.environ["PG_PASSWORD"],
        sslmode=os.environ.get("PG_SSLMODE", "require"),
        connect_timeout=10
    )