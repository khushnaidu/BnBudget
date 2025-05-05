## 🧠 Features in this Branch

This branch sets up and runs the following services via Docker Compose:

| Service            | Host Port | Description                             |
|--------------------|-----------|-----------------------------------------|
| Flask Backend      | 5050      | API server for BnBudget                 |
| PostgreSQL         | 5432      | Development database                    |
| Metabase           | 3000      | Business Intelligence Dashboard         |
| Airflow Web UI     | 8080      | DAG scheduling & monitoring             |
| Kafka Broker       | 9092      | Apache Kafka Messaging                  |
| Zookeeper          | 2181      | Kafka Coordination                      |
| Kafka UI           | 8081      | Kafka topic monitoring interface        |

# AirBnB Host Financial Management System

## Abstract
This research addresses the financial management challenges faced by AirBnB hosts who struggle with tracking property-related expenses and calculating accurate profitability. The proposed solution is a custom expense management system that integrates with AirBnB to automatically import booking data while providing robust expense tracking capabilities for cleaning, maintenance, utilities, and supplies. By combining automated income tracking with comprehensive expense management and analytical reporting tools, the system will enable hosts to gain clear visibility into their property profitability and make data-driven business decisions.

