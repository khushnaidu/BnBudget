"""
DAG Name: kafka_lag_monitor

📌 Purpose:
Periodically check Kafka consumer lag using CLI inside the Kafka container.

This helps monitor real-time message delay in Kafka pipeline.
"""

from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import subprocess
import logging

default_args = {
    'owner': 'bnbudget',
    'retries': 1,
    'retry_delay': timedelta(minutes=2),
    'email_on_failure': False
}

def check_kafka_lag():
    try:
        result = subprocess.run(
            ["docker", "exec", "kafka", "kafka-consumer-groups", "--bootstrap-server", "localhost:9092", "--describe", "--group", "bnbudget-group"],
            capture_output=True, text=True, check=True
        )
        output = result.stdout
        logging.info("[Kafka Lag Monitor] Output:\n%s", output)
    except Exception as e:
        logging.error("Error during lag check: %s", str(e))
        raise

with DAG(
    dag_id="kafka_lag_monitor",
    default_args=default_args,
    schedule_interval="*/15 * * * *",
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=["kafka", "monitor"]
) as dag:

    monitor_task = PythonOperator(
        task_id="check_consumer_lag",
        python_callable=check_kafka_lag
    )

    monitor_task

# ▶️ HOW TO RUN:
# - This DAG runs automatically every 15 mins in Airflow
# - View logs in Airflow UI for lag output
