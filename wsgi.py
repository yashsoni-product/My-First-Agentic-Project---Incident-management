#!/usr/bin/env python3
"""
WSGI entry point for Render deployment
"""

import os
import sys
from server import app

# Add current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# This is the WSGI application that gunicorn will use
application = app

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=False)