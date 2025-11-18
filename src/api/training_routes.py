from flask import Blueprint, jsonify, request

training = Blueprint("training", __name__)


@training.route("/", methods=["GET"])
def training_home():
    return jsonify({"message": "Training endpoint OK"})


RUTINAS = {
    "bajar_peso": {
        "pecho": [
            "Flexiones 3x15",
            "Press banco ligero 3x12",
            "Fondos asistidos 3x12",
            "Press inclinado con mancuernas 3x12"
        ],
        "espalda": [
            "Jalones al pecho 3x15",
            "Remo con mancuerna 3x12",
            "Peso muerto ligero 3x10",
            "Remo en polea 3x15"
        ],
        "piernas": [
            "Sentadilla ligera 3x20",
            "Prensa 3x15",
            "Zancadas 3x12",
            "Elevación de talones 3x20"
        ],
        "brazos": [
            "Curl bíceps 3x15",
            "Tríceps polea 3x15",
            "Curl martillo 3x15"
        ],
        "hombros": [
            "Press militar 3x12",
            "Elevaciones laterales 3x15",
            "Elevaciones frontales 3x15"
        ],
        "abdomen": [
            "Crunch 3x20",
            "Plancha 45s",
            "Elevación de piernas 3x15",
            "Mountain climbers 3x30 seg"
        ]
    },

    "ganar_masa": {
        "pecho": [
            "Press banca pesado 4x8",
            "Aperturas 4x10",
            "Fondos 3x10",
            "Press inclinado con barra 4x8"
        ],
        "espalda": [
            "Dominadas 4x6",
            "Remo barra 4x8",
            "Peso muerto 4x6",
            "Jalón cerrado 4x8"
        ],
        "piernas": [
            "Sentadilla 4x8",
            "Prensa 4x10",
            "Peso muerto rumano 4x8",
            "Extensión de cuádriceps 4x12"
        ],
        "brazos": [
            "Curl bíceps 4x10",
            "Tríceps banco 4x10",
            "Curl concentrado 4x10"
        ],
        "hombros": [
            "Press militar 4x8",
            "Pájaros 4x12",
            "Elevaciones laterales con mancuernas 4x12"
        ],
        "abdomen": [
            "Crunch con peso 4x12",
            "Plancha 1 minuto",
            "Rueda abdominal 3x10",
            "Crunch inverso 4x12"
        ]
    }
}


@training.route("/rutina", methods=["POST"])
def obtener_rutina():
    data = request.get_json()
    objetivo = data.get("objetivo")
    musculo = data.get("musculo")

    if objetivo not in RUTINAS or musculo not in RUTINAS[objetivo]:
        return jsonify({"error": "Opción no válida"}), 400

    return jsonify({
        "objetivo": objetivo,
        "musculo": musculo,
        "rutina": RUTINAS[objetivo][musculo]
    })
