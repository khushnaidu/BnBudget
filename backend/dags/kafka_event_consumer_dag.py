"""
DAG Name: kafka_event_consumer

📌 Purpose:
This DAG triggers your Kafka consumer which reads from Kafka topics and inserts data into PostgreSQL.

Topics covered:
- bnbudget-expenses
- bnbudget-properties
- bnbudget-bookings
# - bnbudget-users (commented for future use)

Output tables:
- expenses, properties, bookings
# - users (for future use)
"""

from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import logging
import traceback
import os
import sys
# 🧠 Add your app directory to the Python path (so imports work inside Airflow)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../app")))
# 📦 Import the actual Kafka consumer function from your backend
from services.kafka.consumer import start_kafka_consumer
# 🧰 Default settings applied to all tasks in this DAG

default_args = {
    'owner': 'bnbudget-team',
    'depends_on_past': False,
    'email_on_failure': True,
    'email': ['your-alert@example.com'],
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
}
# 📅 Define the DAG
with DAG(
    dag_id='kafka_event_consumer',
    default_args=default_args,
    description='Runs Kafka consumer script to push data to PostgreSQL',
    schedule_interval=None,
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=["kafka", "postgres", "etl"]
) as dag:
    
# 🧠 Core function that runs inside Airflow — wraps your Kafka consumer
    def run_kafka_consumer():
        try:
            logging.info("Starting Kafka Consumer...")
            start_kafka_consumer()   # 🚀 This runs your Python consumer logic
            logging.info("Kafka Consumer finished successfully.")
        except Exception as e:
            # 🛑 Catch errors and print detailed traceback
            logging.error("Kafka Consumer failed: %s", str(e))
            logging.error(traceback.format_exc())
            raise

    # 🧱 Define the actual Airflow task
    consume_task = PythonOperator(
        task_id="consume_from_kafka",         # 🔧 Task name (must be unique)
        python_callable=run_kafka_consumer    # 🧠 Task function to call
    )
    # ▶️ Task execution order (if there were multiple tasks)
    consume_task
    consume_task

# ▶️ HOW TO RUN:
# - Start Airflow UI at http://localhost:8080
# - Enable this DAG, click 'Trigger DAG'
