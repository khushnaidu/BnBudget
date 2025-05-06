# 📘 BnBudget: Kafka + Airflow + PostgreSQL + Metabase Integration

## 🔧 Services & Ports Overview

| Service              | Purpose                                   | Access URL / Port       |
| -------------------- | ----------------------------------------- | ----------------------- |
| Flask Backend        | Handles API logic                         | `http://localhost:5050` |
| PostgreSQL           | Stores all application data               | Port: `5432`            |
| Kafka                | Manages event streaming                   | Port: `9092`            |
| Zookeeper            | Coordinates Kafka brokers                 | Port: `2181`            |
| Kafka UI (Provectus) | Monitor topics, messages                  | `http://localhost:8081` |
| Airflow Webserver    | DAG scheduling UI                         | `http://localhost:8080` |
| Metabase Dashboard   | BI dashboard to visualize PostgreSQL data | `http://localhost:3000` |

---

## 🧠 What Each Component Does

### ✅ Kafka

* Acts as a message broker to stream data between services.
* Topics like `bnbudget-expenses`, `bnbudget-properties`, and `bnbudget-bookings` carry JSON payloads.
* Used for decoupled communication between data producers (scripts) and consumers (processors).

### ✅ Kafka UI (Provectus)

* GUI to inspect:

  * Topics
  * Partition data
  * JSON messages sent
* **Check immediately after a DAG triggers or a producer sends data**.

> Navigate to `http://localhost:8081`, select topic, and inspect messages.

### ✅ Kafka Producer Script (`producer.py`)

* Sends sample/mock JSON messages to Kafka topics.
* Simulates real-world application logs or events.

### ✅ Kafka Consumer Script (`consumer.py`)

* Subscribes to Kafka topics
* Inserts received messages into PostgreSQL tables (`expenses`, `bookings`, etc.)

### ✅ Airflow

* Orchestrates your Kafka consumer logic on a schedule or trigger.
* `kafka_event_consumer_dag.py` runs `consumer.py` as a PythonOperator.
* Can be manually triggered from Airflow UI at `localhost:8080` to test pipeline.

### ✅ Metabase

* Connects to PostgreSQL database
* Helps visualize data using charts, graphs, dashboards
* Used to validate that `Kafka → Consumer → Postgres` data landed correctly.

---

## ✅ How to Check Data in PostgreSQL via CLI

### 1. Open terminal inside container:

```bash
docker exec -it postgres-db psql -U bnbudget_user -d bnbudget
```

### 2. Check inserted data:

```sql
SELECT * FROM expenses;
SELECT * FROM properties;
SELECT * FROM bookings;
```

---

## 🔁 Useful Kafka CLI Commands

> Run inside the Kafka container:

```bash
docker exec -it kafka bash
```

### List Topics:

```bash
kafka-topics --bootstrap-server localhost:9092 --list
```

### Describe Topic:

```bash
kafka-topics --bootstrap-server localhost:9092 --describe --topic bnbudget-expenses
```

### Send message (manual test):

```bash
echo '{"property_id":1,"amount":300}' | kafka-console-producer \
  --broker-list localhost:9092 --topic bnbudget-expenses
```

### Read messages from topic:

```bash
kafka-console-consumer --bootstrap-server localhost:9092 \
  --topic bnbudget-expenses --from-beginning
```

---

## 🚀 Docker Commands

### Bring up all services:

```bash
docker-compose up --build
```

### Stop all services:

```bash
docker-compose down
```

### Run specific service (e.g. Kafka consumer):

```bash
docker-compose run kafka-consumer
```

### Rebuild a single service (e.g. backend):

```bash
docker-compose build backend
```

### Access container shell:

```bash
docker exec -it bnbudget-backend bash
```

---

## 🧪 Test Flow Summary

1. Start all services using Docker Compose
2. Trigger DAG from Airflow UI → triggers `consumer.py`
3. Inspect topic in Kafka UI (`localhost:8081`)
4. Check data in PostgreSQL using `psql`
5. View dashboards in Metabase (`localhost:3000`)



 
