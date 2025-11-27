from flask import Blueprint, request, jsonify

alimentacion = Blueprint('alimentacion', __name__)

# --------------------
# Calcular calorías
# --------------------


def calcular_calorias(data):
    peso = data.get("peso")
    altura = data.get("altura")
    edad = data.get("edad")
    sexo = data.get("sexo")
    actividad = data.get("actividad")
    meta = data.get("meta")

    if sexo == "m":
        tmb = 66 + 13.7 * peso + 5 * altura - 6.8 * edad
    else:
        tmb = 655 + 9.6 * peso + 1.8 * altura - 4.7 * edad

    factores_actividad = {
        "sedentaria": 1.2,
        "ligera": 1.375,
        "moderada": 1.55,
        "intensa": 1.725,
    }

    calorias_mantenimiento = tmb * factores_actividad.get(actividad, 1.2)

    if meta == "bajar":
        calorias_mantenimiento -= 500
    elif meta == "subir":
        calorias_mantenimiento += 500

    return round(calorias_mantenimiento)


# --------------------
# Base de comidas
# --------------------
comidas = {
    "desayuno": [
        "Avena con leche y fruta",
        "Huevos revueltos con pan integral",
        "Yogur con granola y miel",
    ],
    "almuerzo": [
        "Pechuga de pollo con arroz y ensalada",
        "Pasta integral con verduras",
        "Carne magra con quinoa y verduras al vapor",
    ],
    "cena": [
        "Ensalada de atún con aguacate",
        "Sopa de verduras y pan integral",
        "Pescado a la plancha con verduras",
    ],
}


def generar_dietas(calorias, meta):
    metas = {
        "bajar": "Bajar peso",
        "mantener": "Mantener peso",
        "subir": "Subir peso",
    }
    dietas = []
    for i in range(3):
        dietas.append({
            "id": i + 1,
            "calorias": calorias,
            "meta": metas.get(meta, "Mantener peso"),
            "desayuno": comidas["desayuno"][i % len(comidas["desayuno"])],
            "almuerzo": comidas["almuerzo"][(i + 1) % len(comidas["almuerzo"])],
            "cena": comidas["cena"][(i + 2) % len(comidas["cena"])],
        })
    return dietas

# --------------------
# ENDPOINT PRINCIPAL
# --------------------


@alimentacion.route("/dietas", methods=["POST"])
def api_dietas():
    data = request.get_json()

    required_fields = ["sexo", "edad", "peso", "altura", "actividad", "meta"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Faltan datos en la solicitud"}), 400

    try:
        data["edad"] = int(data["edad"])
        data["peso"] = float(data["peso"])
        data["altura"] = float(data["altura"])
    except:
        return jsonify({"error": "Datos numéricos inválidos"}), 400

    calorias = calcular_calorias(data)
    dietas = generar_dietas(calorias, data["meta"])
    return jsonify({"dietas": dietas})
