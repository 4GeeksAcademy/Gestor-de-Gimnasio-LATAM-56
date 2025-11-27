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
                "video": "https://www.youtube.com/shorts/oZQlr-lYc5Q?feature=share"
            },
            {
                "nombre": "Press banco ligero",
                "series": "3x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bench-press.jpg",
                "video": "https://www.youtube.com/shorts/0SJy6gPw_Ik?feature=share"
            },
            {
                "nombre": "Fondos asistidos",
                "series": "3x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Dips_2.jpg",
                "video": "https://www.youtube.com/shorts/3a3vg5UAcaU?feature=share"
            },
            {
                "nombre": "Press inclinado con mancuernas",
                "series": "3x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Incline-dumbbell-press.jpg",
                "video": "https://www.youtube.com/shorts/-zbesyTNztQ?feature=share"
            }
        ],

        "espalda": [
            {
                "nombre": "Jalones al pecho",
                "series": "3x15",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/3/33/Lat_pulldown.jpg",
                "video": "https://www.youtube.com/shorts/3e-76jcA91w?feature=share"
            },
            {
                "nombre": "Remo con mancuerna",
                "series": "3x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/0/0e/One-arm-dumbbell-row.jpg",
                "video": "https://www.youtube.com/shorts/qTOaWaCxB8U?feature=share"
            },
            {
                "nombre": "Peso muerto ligero",
                "series": "3x10",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/8/80/Deadlift.jpg",
                "video": "https://www.youtube.com/shorts/7BdVi5qJ7E4?feature=share"
            },
            {
                "nombre": "Remo en polea",
                "series": "3x15",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Seated-cable-row.jpg",
                "video": "https://www.youtube.com/shorts/I3Wi6GK0QMk?feature=share"
            }
        ],

        "piernas": [
            {
                "nombre": "Sentadilla ligera",
                "series": "3x20",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/8/88/Squats.jpg",
                "video": "https://www.youtube.com/shorts/7KsZTiJv5Rc?feature=share"
            },
            {
                "nombre": "Prensa",
                "series": "3x15",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/5/55/Leg-press-machine-2.jpg",
                "video": "https://www.youtube.com/shorts/HL2o7h5wxDQ?feature=share"
            },
            {
                "nombre": "Zancadas",
                "series": "3x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Lunges.jpg",
                "video": "https://www.youtube.com/shorts/OxYZ9OdmYEQ?feature=share"
            },
            {
                "nombre": "Elevación de talones",
                "series": "3x20",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/8/80/Standing-calf-raise.jpg",
                "video": "hhttps://www.youtube.com/shorts/Km4Jt6mLkIY?feature=share"
            }
        ],

        "brazos": [
            {
                "nombre": "Curl bíceps",
                "series": "3x15",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Biceps-curl-with-dumbbells.jpg",
                "video": "https://www.youtube.com/shorts/8YOUJTmCF_4?feature=share"
            },
            {
                "nombre": "Tríceps polea",
                "series": "3x15",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Tricep-pushdown.jpg",
                "video": "https://www.youtube.com/shorts/UvgO97CB_2M?feature=share"
            },
            {
                "nombre": "Curl martillo",
                "series": "3x15",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Hammer-curl.jpg",
                "video": "https://www.youtube.com/shorts/Xfp9_TCvba0?feature=share"
            }
        ],

        "hombros": [
            {
                "nombre": "Press militar",
                "series": "3x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Overhead-press.jpg",
                "video": "https://www.youtube.com/shorts/G0WZ6LgFE1c?feature=share"
            },
            {
                "nombre": "Elevaciones laterales",
                "series": "3x15",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Lateral-raises.jpg",
                "video": "https://www.youtube.com/shorts/UQkdNBpjFDo?feature=share"
            },
            {
                "nombre": "Elevaciones frontales",
                "series": "3x15",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/c/ce/Front-raise-barbell.jpg",
                "video": "https://www.youtube.com/shorts/jk7YrK79ciA?feature=share"
            }
        ],

        "abdomen": [
            {
                "nombre": "Crunch",
                "series": "3x20",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/9/99/Crunches.jpg",
                "video": "https://www.youtube.com/shorts/QOkXpF7rJXs?feature=share"
            },
            {
                "nombre": "Plancha",
                "series": "45s",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/3/31/Plank.jpg",
                "video": "https://www.youtube.com/shorts/3AM7L2k7BEw?feature=share"
            },
            {
                "nombre": "Elevación de piernas",
                "series": "3x15",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/1/10/Leg-raise.jpg",
                "video": "https://www.youtube.com/shorts/OtP14FBny08?feature=share"
            },
            {
                "nombre": "Mountain climbers o Escaladores",
                "series": "3x30 seg",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/8/84/Mountain-climbers.gif",
                "video": "https://www.youtube.com/shorts/BFUbeGXEcYk?feature=share"
            }
        ]
    },


    "ganar_masa": {
        "pecho": [
            {
                "nombre": "Press banca pesado",
                "series": "4x8",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bench-press.jpg",
                "video": "https://www.youtube.com/shorts/0SJy6gPw_Ik?feature=share"  # listo
            },
            {
                "nombre": "Aperturas con mancuernas",
                "series": "4x10",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Dumbbell-fly.jpg",
                "video": "https://www.youtube.com/shorts/C7Nq4DgV9Mg?feature=share"
            },
            {
                "nombre": "Fondos",
                "series": "3x10",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Dips_2.jpg",
                "video": "https://www.youtube.com/shorts/1fR3Ss8OFug?feature=share"
            },
            {
                "nombre": "Press inclinado con barra",
                "series": "4x8",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Incline-bench-press.jpg",
                "video": "https://www.youtube.com/shorts/-zbesyTNztQ?feature=share"
            }
        ],

        "espalda": [
            {
                "nombre": "Dominadas",
                "series": "4x6",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Pull-up.jpg",
                "video": "https://www.youtube.com/shorts/MPbRERVWkbg?feature=share"
            },
            {
                "nombre": "Remo con barra",
                "series": "4x8",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/7/70/Barbell-bent-over-row.jpg",
                "video": "https://www.youtube.com/shorts/VSdKfoQxj5o?feature=share"
            },
            {
                "nombre": "Jalon unilateral polea alta",
                "series": "4x6",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/8/80/Deadlift.jpg",
                "video": "https://www.youtube.com/shorts/L3isMvyckQU?feature=share"
            },
            {
                "nombre": "Jalón al pecho con agarre cerrado",
                "series": "4x8",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/3/33/Lat_pulldown.jpg",
                "video": "https://www.youtube.com/shorts/YR4Ytkhtihs?feature=share"
            }
        ],

        "piernas": [
            {
                "nombre": "Sentadilla",
                "series": "4x8",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/8/88/Squats.jpg",
                "video": "https://www.youtube.com/shorts/7KsZTiJv5Rc?feature=share"
            },
            {
                "nombre": "Prensa",
                "series": "4x10",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/5/55/Leg-press-machine-2.jpg",
                "video": "https://www.youtube.com/shorts/HL2o7h5wxDQ?feature=share"
            },
            {
                "nombre": "Peso muerto rumano",
                "series": "4x8",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Romanian-deadlift.jpg",
                "video": "https://www.youtube.com/shorts/0mUwMamTBaI?feature=share"
            },
            {
                "nombre": "Extensión de cuádriceps",
                "series": "4x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/a/a8/Leg-extension-machine.jpg",
                "video": "https://www.youtube.com/shorts/FtXooCm3wdQ?feature=share"
            }
        ],

        "brazos": [
            {
                "nombre": "Curl bíceps",
                "series": "4x10",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Biceps-curl-with-dumbbells.jpg",
                "video": "https://www.youtube.com/shorts/LrXGP_Tda-A?feature=share"
            },
            {
                "nombre": "Fondos en banco",
                "series": "4x10",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/3/39/Triceps-dips.jpg",
                "video": "https://www.youtube.com/shorts/cI6HMipOva4?feature=share"
            },
            {
                "nombre": "Curl concentrado",
                "series": "4x10",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Concentration-curl.jpg",
                "video": "https://www.youtube.com/shorts/oI7LxnEFmZU?feature=share"
            }
        ],

        "hombros": [
            {
                "nombre": "Press militar",
                "series": "4x8",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Overhead-press.jpg",
                "video": "https://www.youtube.com/shorts/G0WZ6LgFE1c?feature=share"
            },
            {
                "nombre": "Pájaros (elevaciones posteriores)",
                "series": "4x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/9/94/Rear-delt-fly.jpg",
                "video": "https://www.youtube.com/shorts/xhmvKbKq5as?feature=share"
            },
            {
                "nombre": "Elevaciones laterales",
                "series": "4x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Lateral-raises.jpg",
                "video": "https://www.youtube.com/shorts/UQkdNBpjFDo?feature=share"
            }
        ],

        "abdomen": [
            {
                "nombre": "Crunch con peso",
                "series": "4x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/9/99/Crunches.jpg",
                "video": "https://www.youtube.com/shorts/kKFpErPmh4g?feature=share"
            },
            {
                "nombre": "Plancha",
                "series": "1 minuto",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/3/31/Plank.jpg",
                "video": "https://www.youtube.com/shorts/3AM7L2k7BEw?feature=share"
            },
            {
                "nombre": "Rueda abdominal",
                "series": "3x10",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/e/e5/Ab-wheel.jpg",
                "video": "https://www.youtube.com/shorts/pTOsnzYMiXc?feature=share"
            },
            {
                "nombre": "Crunch inverso",
                "series": "4x12",
                "imagen": "https://upload.wikimedia.org/wikipedia/commons/0/03/Reverse-crunch.jpg",
                "video": "https://www.youtube.com/shorts/cRAXHYCQm2k?feature=share"
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
