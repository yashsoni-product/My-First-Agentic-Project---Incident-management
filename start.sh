#!/bin/bash
# Render startup script with fallback options

echo "=== Maintenance Incident Management System Startup ==="
echo "PORT: $PORT"
echo "Python version: $(python --version)"
echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la

echo "=== Checking Flask installation ==="
python -c "import flask; print(f'Flask version: {flask.__version__}')"

echo "=== Starting server ==="
# Try direct Flask server first
python server.py