#!/bin/bash
# Alternative startup for Render - try gunicorn directly

echo "=== Trying Gunicorn Startup ==="
echo "PORT: $PORT"
echo "Current directory: $(pwd)"
echo "Python files:"
ls -la *.py

echo "=== Starting with Gunicorn ==="
gunicorn wsgi:application --bind 0.0.0.0:$PORT --workers 1 --timeout 120