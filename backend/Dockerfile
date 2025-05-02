# backend/Dockerfile

# Use an official slim Python image as a base
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies for building Python packages
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies file and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend codebase into the container
COPY . .

# Expose the Flask default port
EXPOSE 5000

# Default command to run when the container starts
CMD ["python", "run.py"]

# Notes:
# - This Dockerfile is for the Flask backend only.
# - For production, consider using Gunicorn instead of the built-in Flask dev server.
# - This image should be built from within the backend/ folder by Docker Compose.
