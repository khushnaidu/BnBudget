"""
DAG Name: kafka_postgres_sync_check

📌 Purpose:
Compare Kafka topic offset with Postgres row counts.
Logs a warning if lag is more than threshold (default: 100 rows)

Covered:
- bnbudget-expenses → expenses
- bnbudget-properties → properties
- bnbudget-bookings → bookings
# - bnbudget-users → users (commented for future use)
"""

from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import subprocess
import psycopg2
import logging

default_args = {
    'owner': 'bnbudget',
    'retries': 1,
    'retry_delay': timedelta(minutes=2),
    'email_on_failure': False
}

TOPIC_TABLE_MAP = {
    "bnbudget-expenses": "expenses",
    "bnbudget-properties": "properties",
    "bnbudget-bookings": "bookings",
    # "bnbudget-users": "users"  # future topic mapping
}

PG_CONFIG = {
    "host": "postgres-db",
    "port": 5432,
    "database": "bnbudget",
    "user": "bnbudget_user",
    "password": "AirBNB1234"
}

def kafka_postgres_sync_check():
    try:
        conn = psycopg2.connect(**PG_CONFIG)
        cursor = conn.cursor()

        for topic, table in TOPIC_TABLE_MAP.items():
            kafka_cmd = [
                "docker", "exec", "kafka",
                "kafka-run-class", "kafka.tools.GetOffsetShell",
                "--broker-list", "localhost:9092",
                "--topic", topic,
                "--time", "-1"
            ]
            result = subprocess.run(kafka_cmd, capture_output=True, text=True)
            offset_line = result.stdout.strip()
            offset = int(offset_line.split(":")[-1])
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            row_count = cursor.fetchone()[0]

            lag = offset - row_count
            logging.info(f"[Sync Check] Topic {topic} offset = {offset}, DB {table} count = {row_count}, Lag = {lag}")
            if lag > 100:
                logging.warning(f"[Lag Detected] {topic} → {table}, Lag = {lag} records")

        cursor.close()
        conn.close()
    except Exception as e:
        logging.error(f"Sync check failed: {e}")
        raise

with DAG(
    dag_id="kafka_postgres_sync_check",
    default_args=default_args,
    schedule_interval="*/30 * * * *",
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=["kafka", "postgres", "integrity"]
) as dag:

    sync_check_task = PythonOperator(
        task_id="verify_kafka_postgres_sync",
        python_callable=kafka_postgres_sync_check
    )

    sync_check_task

# ▶️ HOW TO RUN:
# - Automatically runs every 30 mins via Airflow scheduler
# - Check DAG logs for mismatch alerts
