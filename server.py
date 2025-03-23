import http.server
import http.client
import socketserver
import json

api_url = "world.openfoodfacts.org"
api_path = "/api/v3/product/"

class EcoScanHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path[:self.path.find("?")] == "/barcode":
            params = {param.split("=")[0]:param.split("=")[1] for param in self.path[self.path.find("?") + 1:].split("&")}
            if "barcode" in params.keys():
                barcode = params["barcode"]
                url = f'/api/v3/product/{barcode}'
                connection = http.client.HTTPSConnection('world.openfoodfacts.org')
                connection.request('GET', url)
                response = connection.getresponse()

                while response.status == 301:
                    connection = http.client.HTTPSConnection(parsed_url.netloc)
                    connection.request('GET', parsed_url.path + ('?' + parsed_url.query if parsed_url.query else ''))
                    response = connection.getresponse()

                product_data = json.loads((response.read()).decode('utf-8'))
                instructions = []
                for packaging in product_data["product"]["packagings"]:
                    material = packaging["material"]["id"]
                    units = packaging["number_of_units"]
                    shape = packaging["shape"]["id"]
                    score = packaging["environmental_score_material_score"]
                    how = packaging["recycling"]["id"]
                    instruction = {"material":material,"units":units,"shape":shape,"how":how}  
                    instructions.append(instruction)
                # Respond to the original client
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(instructions).encode("utf-8"))
    
    def do_POST(self):
        """Handle POST requests."""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(b"POST received\n")
        self.wfile.write(b"Data: " + post_data)  # Echo back the POST data

PORT = 6968

# Set up and start the server
with socketserver.TCPServer(("", PORT), EcoScanHandler) as server:
    print(f"Serving at port {PORT}")
    server.serve_forever()