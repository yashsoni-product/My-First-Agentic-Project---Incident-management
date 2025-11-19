#!/usr/bin/env python3
"""
WSGI entry point for Render deployment
"""

from server import app

# WSGI callable for gunicorn
application = app

if __name__ == "__main__":
    import os
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=False)