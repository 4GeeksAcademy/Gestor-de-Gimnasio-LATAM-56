from flask import Blueprint, jsonify, request

training = Blueprint("training", __name__)


@training.route("/", methods=["GET"])
def training_home():
    return jsonify({"message": "Training endpoint OK"})


RUTINAS = {
    "bajar_peso": {
        "pecho": [
            {
                "nombre": "Flexiones",
                "series": "3x15",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/5/53/Pushup.jpg",
                "video": "https://www.youtube.com/watch?v=_l3ySVKYVJ8"
            },
            {
                "nombre": "Press banco ligero",
                "series": "3x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bench-press.jpg",
                "video": "https://www.youtube.com/watch?v=rT7DgCr-3pg"
            },
            {
                "nombre": "Fondos asistidos",
                "series": "3x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Dips_2.jpg",
                "video": "https://www.youtube.com/watch?v=2z8JmcrW-As"
            },
            {
                "nombre": "Press inclinado con mancuernas",
                "series": "3x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Incline-dumbbell-press.jpg",
                "video": "https://www.youtube.com/watch?v=8iPEnn-ltC8"
            }
        ],

        "espalda": [
            {
                "nombre": "Jalones al pecho",
                "series": "3x15",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/3/33/Lat_pulldown.jpg",
                "video": "https://www.youtube.com/watch?v=CAwf7n6Luuc"
            },
            {
                "nombre": "Remo con mancuerna",
                "series": "3x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/0/0e/One-arm-dumbbell-row.jpg",
                "video": "https://www.youtube.com/watch?v=pYcpY20QaE8"
            },
            {
                "nombre": "Peso muerto ligero",
                "series": "3x10",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/8/80/Deadlift.jpg",
                "video": "https://www.youtube.com/watch?v=op9kVnSso6Q"
            },
            {
                "nombre": "Remo en polea",
                "series": "3x15",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Seated-cable-row.jpg",
                "video": "https://www.youtube.com/watch?v=GZbfZ033f74"
            }
        ],

        "piernas": [
            {
                "nombre": "Sentadilla ligera",
                "series": "3x20",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/8/88/Squats.jpg",
                "video": "https://www.youtube.com/watch?v=aclHkVaku9U"
            },
            {
                "nombre": "Prensa",
                "series": "3x15",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/5/55/Leg-press-machine-2.jpg",
                "video": "https://www.youtube.com/watch?v=IZxyjW7MPJQ"
            },
            {
                "nombre": "Zancadas",
                "series": "3x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Lunges.jpg",
                "video": "https://www.youtube.com/watch?v=QOVaaN3jP8U"
            },
            {
                "nombre": "Elevación de talones",
                "series": "3x20",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/8/80/Standing-calf-raise.jpg",
                "video": "https://www.youtube.com/watch?v=YMmgqO8Jo-k"
            }
        ],

        "brazos": [
            {
                "nombre": "Curl bíceps",
                "series": "3x15",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Biceps-curl-with-dumbbells.jpg",
                "video": "https://www.youtube.com/watch?v=ykJmrZ5v0Oo"
            },
            {
                "nombre": "Tríceps polea",
                "series": "3x15",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Tricep-pushdown.jpg",
                "video": "https://www.youtube.com/watch?v=2-LAMcpzODY"
            },
            {
                "nombre": "Curl martillo",
                "series": "3x15",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Hammer-curl.jpg",
                "video": "https://www.youtube.com/watch?v=zC3nLlEvin4"
            }
        ],

        "hombros": [
            {
                "nombre": "Press militar",
                "series": "3x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Overhead-press.jpg",
                "video": "https://www.youtube.com/watch?v=qEwKCR5JCog"
            },
            {
                "nombre": "Elevaciones laterales",
                "series": "3x15",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Lateral-raises.jpg",
                "video": "https://www.youtube.com/watch?v=3VcKaXpzqRo"
            },
            {
                "nombre": "Elevaciones frontales",
                "series": "3x15",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/c/ce/Front-raise-barbell.jpg",
                "video": "https://www.youtube.com/watch?v=-t7fuZ0KhDA"
            }
        ],

        "abdomen": [
            {
                "nombre": "Crunch",
                "series": "3x20",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/9/99/Crunches.jpg",
                "video": "https://www.youtube.com/watch?v=MKmrqcoCZ-M"
            },
            {
                "nombre": "Plancha",
                "series": "45s",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/3/31/Plank.jpg",
                "video": "https://www.youtube.com/watch?v=pSHjTRCQxIw"
            },
            {
                "nombre": "Elevación de piernas",
                "series": "3x15",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/1/10/Leg-raise.jpg",
                "video": "https://www.youtube.com/watch?v=JB2oyawG9KI"
            },
            {
                "nombre": "Mountain climbers",
                "series": "3x30 seg",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/8/84/Mountain-climbers.gif",
                "video": "https://www.youtube.com/watch?v=cnyTQDSE884"
            }
        ]
    },


    "ganar_masa": {
        "pecho": [
            {
                "nombre": "Press banca pesado",
                "series": "4x8",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bench-press.jpg",
                "video": "https://www.youtube.com/watch?v=rT7DgCr-3pg"
            },
            {
                "nombre": "Aperturas con mancuernas",
                "series": "4x10",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Dumbbell-fly.jpg",
                "video": "https://www.youtube.com/watch?v=eozdVDA78K0"
            },
            {
                "nombre": "Fondos",
                "series": "3x10",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Dips_2.jpg",
                "video": "https://www.youtube.com/watch?v=2z8JmcrW-As"
            },
            {
                "nombre": "Press inclinado con barra",
                "series": "4x8",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Incline-bench-press.jpg",
                "video": "https://www.youtube.com/watch?v=SrqOu55lrYU"
            }
        ],

        "espalda": [
            {
                "nombre": "Dominadas",
                "series": "4x6",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Pull-up.jpg",
                "video": "https://www.youtube.com/shorts/BT3CSQKeEww"
            },
            {
                "nombre": "Remo con barra",
                "series": "4x8",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/7/70/Barbell-bent-over-row.jpg",
                "video": "https://www.youtube.com/watch?v=vT2GjY_Umpw"
            },
            {
                "nombre": "Peso muerto",
                "series": "4x6",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/8/80/Deadlift.jpg",
                "video": "https://www.youtube.com/watch?v=op9kVnSso6Q"
            },
            {
                "nombre": "Jalón cerrado",
                "series": "4x8",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/3/33/Lat_pulldown.jpg",
                "video": "https://www.youtube.com/watch?v=sl-u6H2L6GQ"
            }
        ],

        "piernas": [
            {
                "nombre": "Sentadilla",
                "series": "4x8",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/8/88/Squats.jpg",
                "video": "https://www.youtube.com/watch?v=aclHkVaku9U"
            },
            {
                "nombre": "Prensa",
                "series": "4x10",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/5/55/Leg-press-machine-2.jpg",
                "video": "https://www.youtube.com/watch?v=IZxyjW7MPJQ"
            },
            {
                "nombre": "Peso muerto rumano",
                "series": "4x8",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Romanian-deadlift.jpg",
                "video": "https://www.youtube.com/watch?v=2SHsk9AzdjA"
            },
            {
                "nombre": "Extensión de cuádriceps",
                "series": "4x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/a/a8/Leg-extension-machine.jpg",
                "video": "https://www.youtube.com/watch?v=yRSpu0tG8sA"
            }
        ],

        "brazos": [
            {
                "nombre": "Curl bíceps",
                "series": "4x10",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Biceps-curl-with-dumbbells.jpg",
                "video": "https://www.youtube.com/watch?v=ykJmrZ5v0Oo"
            },
            {
                "nombre": "Tríceps en banco",
                "series": "4x10",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/3/39/Triceps-dips.jpg",
                "video": "https://www.youtube.com/watch?v=0326dy_-CzM"
            },
            {
                "nombre": "Curl concentrado",
                "series": "4x10",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Concentration-curl.jpg",
                "video": "https://www.youtube.com/watch?v=0AUGkch3tzc"
            }
        ],

        "hombros": [
            {
                "nombre": "Press militar",
                "series": "4x8",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Overhead-press.jpg",
                "video": "https://www.youtube.com/watch?v=qEwKCR5JCog"
            },
            {
                "nombre": "Pájaros (elevaciones posteriores)",
                "series": "4x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/9/94/Rear-delt-fly.jpg",
                "video": "https://www.youtube.com/watch?v=6yMdhi9NsXA"
            },
            {
                "nombre": "Elevaciones laterales",
                "series": "4x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Lateral-raises.jpg",
                "video": "https://www.youtube.com/watch?v=3VcKaXpzqRo"
            }
        ],

        "abdomen": [
            {
                "nombre": "Crunch con peso",
                "series": "4x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/9/99/Crunches.jpg",
                "video": "https://www.youtube.com/watch?v=MKmrqcoCZ-M"
            },
            {
                "nombre": "Plancha",
                "series": "1 minuto",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/3/31/Plank.jpg",
                "video": "https://www.youtube.com/watch?v=pSHjTRCQxIw"
            },
            {
                "nombre": "Rueda abdominal",
                "series": "3x10",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/e/e5/Ab-wheel.jpg",
                "video": "https://www.youtube.com/watch?v=xrS5n7ber1Y"
            },
            {
                "nombre": "Crunch inverso",
                "series": "4x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/0/03/Reverse-crunch.jpg",
                "video": "https://www.youtube.com/watch?v=hyv14e2QDq0"
            }
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
