#!/bin/bash

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Function to start Kafka
start_kafka() {
    echo "🚀 Starting Kafka and Zookeeper..."
    docker-compose up -d
    echo "✅ Kafka is running on localhost:9092"
}

# Function to stop Kafka
stop_kafka() {
    echo "🛑 Stopping Kafka and Zookeeper..."
    docker-compose down
    echo "✅ Kafka has been stopped"
}

# Function to check Kafka status
check_kafka() {
    if docker-compose ps | grep -q "kafka.*Up"; then
        echo "✅ Kafka is running"
    else
        echo "❌ Kafka is not running"
    fi
}

# Function to create topics
create_topics() {
    echo "📝 Creating Kafka topics..."
    docker-compose exec kafka kafka-topics --create --if-not-exists \
        --bootstrap-server localhost:9092 \
        --topic expenses \
        --partitions 1 \
        --replication-factor 1

    docker-compose exec kafka kafka-topics --create --if-not-exists \
        --bootstrap-server localhost:9092 \
        --topic bookings \
        --partitions 1 \
        --replication-factor 1
    
    echo "✅ Topics created successfully"
}

# Function to list topics
list_topics() {
    echo "📋 Listing Kafka topics..."
    docker-compose exec kafka kafka-topics --list --bootstrap-server localhost:9092
}

# Main script
case "$1" in
    "start")
        check_docker
        start_kafka
        ;;
    "stop")
        stop_kafka
        ;;
    "status")
        check_kafka
        ;;
    "create-topics")
        check_docker
        create_topics
        ;;
    "list-topics")
        check_docker
        list_topics
        ;;
    "setup")
        check_docker
        start_kafka
        sleep 10  # Wait for Kafka to be ready
        create_topics
        ;;
    *)
        echo "Usage: $0 {start|stop|status|create-topics|list-topics|setup}"
        echo "  start         - Start Kafka and Zookeeper"
        echo "  stop          - Stop Kafka and Zookeeper"
        echo "  status        - Check if Kafka is running"
        echo "  create-topics - Create required Kafka topics"
        echo "  list-topics   - List all Kafka topics"
        echo "  setup         - Complete setup (start + create topics)"
        exit 1
        ;;
esac 