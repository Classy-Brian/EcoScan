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
                for i in range(len(product_data["product"]["packagings"])):
                    p = product_data["product"]["packagings"][i]
                    e = product_data["product"]["ecoscore_data"]["adjustments"]["packaging"]["packagings"][i]
                    material = p["material"]["id"] if "material" in p.keys() and "id" in p["material"].keys() else None
                    units = p["number_of_units"] if "number_of_units" in p.keys() else None
                    shape = p["shape"]["id"] if "shape" in p.keys() and "id" in p["shape"] else None
                    how = p["recycling"]["id"] if "recycling" in p.keys() and "id" in p["recycling"].keys() else None
                    score = e["environmental_score_material_score"] if "environmental_score_material_score" in e.keys() else None
                    instruction = {"material": material,"units":units,"shape":shape,"score":score,"how":how}  
                    instructions.append(instruction)
                # Respond to the original client
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(instructions).encode("utf-8"))

PORT = 6967

# Set up and start the server
with socketserver.TCPServer(("", PORT), EcoScanHandler) as server:
    print(f"Serving at port {PORT}")
    server.serve_forever()