import http.server
import socketserver
import json
import os
from pathlib import Path

PORT = 8000
DB_FILE = Path(__file__).parent / 'database.json'

def ensure_db_exists():
    """Ensures the database.json file exists with a default structure."""
    if not DB_FILE.exists():
        print(f"'{DB_FILE}' not found, creating a new one.")
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump({"trips": [], "templates": []}, f, indent=4)

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    """A custom request handler to serve static files and handle API requests."""

    def do_GET(self):
        """Handle GET requests."""
        if self.path == '/api/trips' or self.path == '/api/templates':
            self.handle_api_get()
        else:
            # Serve static files
            super().do_GET()

    def do_POST(self):
        """Handle POST requests."""
        if self.path == '/api/trips' or self.path == '/api/templates':
            self.handle_api_post()
        else:
            self.send_error(404, "File Not Found")

    def handle_api_get(self):
        """Handles GET requests to API endpoints."""
        try:
            with open(DB_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            key = self.path.split('/')[-1] # 'trips' or 'templates'
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data.get(key, [])).encode('utf-8'))

        except Exception as e:
            self.send_error(500, f"Server error: {e}")

    def handle_api_post(self):
        """Handles POST requests to API endpoints."""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            new_item = json.loads(post_data)

            with open(DB_FILE, 'r+', encoding='utf-8') as f:
                db_data = json.load(f)
                key = self.path.split('/')[-1] # 'trips' or 'templates'
                
                if key in db_data:
                    db_data[key].append(new_item)
                else:
                    db_data[key] = [new_item]
                
                f.seek(0)
                f.truncate()
                json.dump(db_data, f, indent=4, ensure_ascii=False)

            self.send_response(201, "Created")
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "item": new_item}).encode('utf-8'))

        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON")
        except Exception as e:
            self.send_error(500, f"Server error: {e}")

if __name__ == "__main__":
    ensure_db_exists()
    
    with socketserver.TCPServer(("", PORT), MyHttpRequestHandler) as httpd:
        print("Serving at port", PORT)
        print(f"URL: http://localhost:{PORT}")
        httpd.serve_forever()
