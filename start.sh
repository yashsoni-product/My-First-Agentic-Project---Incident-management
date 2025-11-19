#!/bin/bash
# Render startup script

echo "Starting Maintenance Incident Management System..."
echo "PORT: $PORT"
echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la

# Run the Flask server
python server.py