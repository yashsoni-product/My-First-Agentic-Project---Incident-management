#!/usr/bin/env python3
"""
Production server for Maintenance Incident Management System
Simplified for reliable deployment
"""

import os
from flask import Flask, send_file, jsonify

# Create Flask app with simple configuration
app = Flask(__name__)

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def index():
    """Serve the main application page"""
    try:
        index_path = os.path.join(BASE_DIR, 'index.html')
        if os.path.exists(index_path):
            return send_file(index_path)
        else:
            return jsonify({'error': 'index.html not found', 'path': index_path}), 404
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/<filename>')
def serve_static(filename):
    """Serve static files (CSS, JS, etc.)"""
    try:
        # Basic security check
        if '..' in filename:
            return jsonify({'error': 'Invalid file path'}), 400
        
        file_path = os.path.join(BASE_DIR, filename)
        
        if os.path.exists(file_path):
            return send_file(file_path)
        else:
            return jsonify({'error': f'File not found: {filename}'}), 404
            
    except Exception as e:
        return jsonify({'error': f'Error serving {filename}: {str(e)}'}), 500

@app.route('/health')
def health_check():
    """Health check endpoint"""
    files_in_dir = os.listdir(BASE_DIR)
    return jsonify({
        'status': 'healthy',
        'application': 'Maintenance Incident Management System',
        'base_dir': BASE_DIR,
        'files': files_in_dir[:10]  # Show first 10 files
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    
    print("=== Server Startup ===")
    print(f"Base directory: {BASE_DIR}")
    print(f"Files available: {os.listdir(BASE_DIR)}")
    print(f"Starting on host 0.0.0.0, port {port}")
    
    app.run(host='0.0.0.0', port=port, debug=False)
