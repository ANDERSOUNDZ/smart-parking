from http.server import BaseHTTPRequestHandler, HTTPServer
import json

espacios = [
    {"id": 1, "ocupado": False},
    {"id": 2, "ocupado": True},
    {"id": 3, "ocupado": False}
]

class ServidorParking(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/espacios":
            respuesta = json.dumps(espacios).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(respuesta)
        else:
            self.send_error(404, "Ruta no encontrada")

servidor = HTTPServer(("localhost", 8000), ServidorParking)
print("SmartParking ejecutándose en http://localhost:8000")
servidor.serve_forever()