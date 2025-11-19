#!/usr/bin/env python3
"""
Production server for Maintenance Incident Management System
Optimized for Railway deployment
"""

import os
import mimetypes
from flask import Flask, send_from_directory, send_file, jsonify
from werkzeug.exceptions import NotFound

app = Flask(__name__)

# Set proper MIME types
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('text/html', '.html')

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def index():
    """Serve the main application page"""
    try:
        return send_file(os.path.join(BASE_DIR, 'index.html'))
    except FileNotFoundError:
        return jsonify({'error': 'Application not found'}), 404

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files (CSS, JS, images, etc.)"""
    try:
        # Security: prevent directory traversal
        if '..' in filename or filename.startswith('/'):
            return jsonify({'error': 'Invalid file path'}), 400
        
        file_path = os.path.join(BASE_DIR, filename)
        
        # Check if file exists
        if not os.path.exists(file_path):
            return jsonify({'error': 'File not found'}), 404
        
        # Set proper content type based on file extension
        if filename.endswith('.js'):
            return send_file(file_path, mimetype='application/javascript')
        elif filename.endswith('.css'):
            return send_file(file_path, mimetype='text/css')
        elif filename.endswith('.html'):
            return send_file(file_path, mimetype='text/html')
        elif filename.endswith(('.png', '.jpg', '.jpeg', '.gif', '.ico')):
            return send_file(file_path)
        else:
            return send_file(file_path)
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health_check():
    """Health check endpoint for Railway"""
    return jsonify({
        'status': 'healthy',
        'application': 'Maintenance Incident Management System',
        'version': '1.0.0'
    })

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Get port from environment variable (Render uses PORT, Railway uses PORT)
    port = int(os.environ.get('PORT', 10000))
    
    # Configure for production deployment (Render, Railway, etc.)
    print(f"Starting server on host 0.0.0.0, port {port}")
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)
