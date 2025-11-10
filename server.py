import http.server
import socketserver
import json
import sqlite3
from pathlib import Path

PORT = 8000
DB_FILE = Path(__file__).parent / 'database.db'

def init_db():
    """Initializes the database and creates tables if they don't exist."""
    try:
        con = sqlite3.connect(DB_FILE)
        cur = con.cursor()
        
        # Create trips table
        cur.execute('''
            CREATE TABLE IF NOT EXISTS trips (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                data TEXT NOT NULL,
                saved_at TEXT NOT NULL
            )
        ''')
        
        # Create templates table
        cur.execute('''
            CREATE TABLE IF NOT EXISTS templates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                data TEXT NOT NULL,
                saved_at TEXT NOT NULL
            )
        ''')
        
        con.commit()
        con.close()
        print(f"Database '{DB_FILE}' initialized successfully.")
    except Exception as e:
        print(f"Error initializing database: {e}")

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    """A custom request handler to serve static files and handle API requests."""

    def do_GET(self):
        """Handle GET requests."""
        if self.path == '/api/trips' or self.path == '/api/templates':
            self.handle_api_get()
        else:
            super().do_GET()

    def do_POST(self):
        """Handle POST requests."""
        if self.path == '/api/trips' or self.path == '/api/templates':
            self.handle_api_post()
        else:
            self.send_error(404, "File Not Found")

    def handle_api_get(self):
        """Handles GET requests to API endpoints using SQLite."""
        table_name = self.path.split('/')[-1]
        if table_name not in ['trips', 'templates']:
            self.send_error(404, "Invalid API endpoint")
            return

        try:
            con = sqlite3.connect(DB_FILE)
            con.row_factory = sqlite3.Row
            cur = con.cursor()
            
            cur.execute(f"SELECT * FROM {table_name} ORDER BY saved_at DESC")
            rows = cur.fetchall()
            con.close()

            # Convert rows to list of dicts, parsing the 'data' field from JSON string
            results = []
            for row in rows:
                results.append({
                    'id': row['id'],
                    'name': row['name'],
                    'data': json.loads(row['data']),
                    'savedAt': row['saved_at']
                })

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(results).encode('utf-8'))

        except Exception as e:
            self.send_error(500, f"Server error on GET: {e}")

    def handle_api_post(self):
        """Handles POST requests to API endpoints using SQLite."""
        table_name = self.path.split('/')[-1]
        if table_name not in ['trips', 'templates']:
            self.send_error(404, "Invalid API endpoint")
            return
            
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            new_item = json.loads(post_data)

            # The 'data' field should be stored as a JSON string
            name = new_item.get('name')
            data_str = json.dumps(new_item.get('data', {}), ensure_ascii=False)
            saved_at = new_item.get('savedAt')

            if not all([name, data_str, saved_at]):
                 self.send_error(400, "Missing required fields: name, data, savedAt")
                 return

            con = sqlite3.connect(DB_FILE)
            cur = con.cursor()
            cur.execute(f"INSERT INTO {table_name} (name, data, saved_at) VALUES (?, ?, ?)",
                        (name, data_str, saved_at))
            con.commit()
            new_id = cur.lastrowid
            con.close()

            self.send_response(201, "Created")
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {"status": "success", "id": new_id}
            self.wfile.write(json.dumps(response).encode('utf-8'))

        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON")
        except Exception as e:
            self.send_error(500, f"Server error on POST: {e}")

if __name__ == "__main__":
    init_db()
    
    with socketserver.TCPServer(("", PORT), MyHttpRequestHandler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        httpd.serve_forever()