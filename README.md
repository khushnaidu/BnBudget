# 🏠 BnBudget: Airbnb Property Management Dashboard

BnBudget is a full-stack application for managing Airbnb properties. It supports real-time booking and expense tracking, profitability reports, and dynamic visualizations — all designed for property owners and managers.

This project is built for demo purposes using synthetic data, simulated event streaming, and optional cloud deployment.

---

## 🚀 Tech Stack

| Layer      | Tech                                      |
| ---------- | ----------------------------------------- |
| Frontend   | React + Vite (deployed on Vercel)         |
| Backend    | Flask + SQLAlchemy + PostgreSQL           |
| Real-Time  | Apache Kafka (local simulation)           |
| Deployment | Docker, EC2 (optional), Cloudflare Tunnel |
| Auth       | Stateless (email-only, owner-based demo)  |

---

## ⚙️ Local Development Setup

### Step 1: Clone the Repo

```bash
git clone https://github.com/khushnaidu/BnBudget.git
cd BnBudget/backend
```

---

### Step 2: Build & Run the Backend with Docker

1. **Launch Docker Desktop**

2. **Build the backend image:**

```bash
docker build -t bnbudget-backend .
```

3. **Run the backend on port `5001` (maps to container’s 5000):**

```bash
docker run -p 5001:5000 --env-file .env bnbudget-backend
```

Your backend will now be accessible at `http://localhost:5001`.

---

### ✅ Optional: Remote Deployment on EC2

If deployed to an EC2 instance, update your frontend `.env` file with:

```env
REACT_APP_API_URL=http://<your-ec2-ip>:5000/api
```

---

## 🌐 Frontend Demo (Hosted)

The frontend is deployed using Vercel, with HTTPS proxy via Cloudflare Tunnel for the backend:

🔗 **Live Demo**: [https://bn-budget.vercel.app/login](https://bn-budget.vercel.app/login)

---

## 🔄 Real-Time Data Ingestion with Kafka

This system simulates Airbnb-style real-time property data using **Apache Kafka**.

### Kafka Architecture

- **Topics**:

  - `expenses` – property-related expenses
  - `bookings` – guest reservations

- **Data Structure**:
  - 20 properties (`ID: 1001–1020`)
  - 5 owners (`ID: 1–5`)
  - Realistic booking & expense simulations

---

## 📦 Kafka Setup & Execution

### 1. Start Kafka Infrastructure

```bash
cd backend/syntheticdata
./setup_kafka.sh setup
```

### 2. Run the Consumer (Terminal 1)

```bash
cd backend/syntheticdata
python kafka_consumer.py
```

### 3. Run the Producer (Terminal 2)

```bash
cd backend/syntheticdata
python kafka_data_generator.py
```

---

## 🔍 Verification

Use this script to confirm data is flowing into your database:

```bash
cd backend/syntheticdata
python verify_data.py
```

---

## ✨ Kafka Features

- **Synthetic Data Generation** for expenses & bookings
- **Live Logging** of ingested messages
- **Data Validation**:
  - Verifies property ID & ownership
  - Ensures referential integrity
- **Error Handling**:
  - Graceful rollback on DB errors
  - Recovery after partial failure
- **Tooling** for Kafka management, logs, and testing

---

## 🧪 Development Tips

- Edit `kafka_data_generator.py` to adjust generation patterns
- Edit `kafka_consumer.py` to change how data is processed or inserted
- Use `verify_data.py` to validate inserted data against constraints

---

## 🤝 Contributing

Pull requests and issue reports are welcome!  
Fork the repo, create a feature branch, and submit a PR.

---

## 📄 License

This project is for academic and demonstration purposes only.
