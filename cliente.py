import requests

url = "http://localhost:8000/espacios"

respuesta = requests.get(url, timeout=5)

if respuesta.status_code == 200:
    espacios = respuesta.json()

    for espacio in espacios:
        estado = "Ocupado" if espacio["ocupado"] else "Disponible"
        print(f"Espacio {espacio['id']}: {estado}")
else:
    print("Error al consultar el servidor")