import http.server
import http.client
import socketserver
import json
import google.generativeai as genai


#url and path used for openfoodfacts.org API
api_url = "world.openfoodfacts.org"
api_path = "/api/v3/product/"

GEMINI_API_KEY = "AIzaSyA5lO6r-NK1kDgQh_zIVgYY--YRUv0CJec" #API_key used for GEMINI API

class EcoScanHandler(http.server.BaseHTTPRequestHandler): #create a class that acts as a server handling requests

    def do_OPTIONS(self):
        """Handles CORS preflight requests."""
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")  # Allow requests from any domain
        self.end_headers()

        if self.path[:self.path.find("?")] == "/barcode":
            params = {param.split("=")[0]:param.split("=")[1] for param in self.path[self.path.find("?") + 1:].split("&")}
            if "barcode" in params.keys():
                barcode = params["barcode"]
                response = self.api_parser(barcode)
                self.wfile.write(json.dumps(response).encode("utf-8"))
                    
        if self.path[:self.path.find("?")] == "/explain":
            params = {param.split("=")[0]:param.split("=")[1] for param in self.path[self.path.find("?") + 1:].split("&")}
            if "barcode" in params.keys():
                barcode = params["barcode"]
                response = self.api_parser(barcode)
                llm_response = llm_prompter(response)

                self.wfile.write(llm_response.encode("utf-8"))

    def api_parser(self, barcode):
        url = f'/api/v3/product/{barcode}'
        connection = http.client.HTTPSConnection('world.openfoodfacts.org')
        connection.request('GET', url)
        response = connection.getresponse()

        while response.status == 301:
            connection = http.client.HTTPSConnection(url.netloc)
            connection.request('GET', url.path + ('?' + url.query if url.query else ''))
            response = connection.getresponse()

        product_data = json.loads((response.read()).decode('utf-8'))
        product_name = "No product name available"
        if product_data["product"]["product_name"]:
            product_name = product_data["product"]["product_name"]
        instructions = {"name": product_name, "images":{},"materials":[]} 
        instructions = {"images":{},"materials":[]}
        for i in range(len(product_data["product"]["packagings"])):
            pd = product_data["product"]
            p = pd["packagings"][i]
            e = pd["ecoscore_data"]["adjustments"]["packaging"]["packagings"][i]
            material = p["material"]["id"] if "material" in p.keys() and "id" in p["material"].keys() else None
            units = p["number_of_units"] if "number_of_units" in p.keys() else None
            shape = p["shape"]["id"] if "shape" in p.keys() and "id" in p["shape"] else None
            how = p["recycling"]["id"] if "recycling" in p.keys() and "id" in p["recycling"].keys() else None
            score = e["environmental_score_material_score"] if "environmental_score_material_score" in e.keys() else None
            image = pd["image_url"]
            instruction = {"material": material,"units":units,"shape":shape,"score":score,"how":how}
            instructions["materials"].append(instruction)
        if len(instructions) == 0:
            instruction = {"material": None,"units":None,"shape":None,"score":None,"how":None}
            instructions.append(instruction)
        return instructions

def llm_prompter(instruction_list):
    material_set = set(["aluminum", "cardboard", "recycled-cardboard", "plastic"])
    materials = ""
    for dict1 in instruction_list["materials"]:
        if "material" in dict1:
            if dict1["material"] is not None:
                materials += dict1["material"]
            if dict1["material"] not in material_set and dict1["material"] is not None:
                material_set.add(dict1["material"])
        if "en" in dict1 and dict1["en"] in material_set:
            materials += dict1["en"]
    prompt_list = list("""You are working as a backend developer for a software service that lists ways to recycle the packaging of certain food products based 
    off of the materials the packaging is made of. Give me a detailed explanation in the format of a json file on the steps required to properly dispose of or recycle 
    a product packaged with the given materials: """)

    for material in materials:
        prompt_list.append(material)
    prompt = " ".join(prompt_list)

    model = genai.GenerativeModel("gemini-2.0-flash")
    genai.configure(api_key = GEMINI_API_KEY)

    response = (model.generate_content(prompt)).text
    response = response[7:-4].strip()


    return response



PORT = 6968
# Set up and start the server
with socketserver.TCPServer(("", PORT), EcoScanHandler) as server:
    print(f"Serving at port {PORT}")
    server.serve_forever()