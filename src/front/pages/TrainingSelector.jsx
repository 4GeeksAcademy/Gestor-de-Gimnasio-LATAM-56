import React, { useState } from "react";
import "../Training.css";

const TrainingSelector = () => {
    const [objetivo, setObjetivo] = useState("");
    const [musculo, setMusculo] = useState("");
    const [resultado, setResultado] = useState(null);

    const obtenerRutina = async () => {
        try {
            const URL = import.meta.env.VITE_BACKEND_URL + "/api/training/rutina";

            const response = await fetch(URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ objetivo, musculo })
            });

            if (!response.ok) throw new Error("Error en la petición");

            const data = await response.json();
            setResultado(data);
        } catch (error) {
            console.error("Error en obtenerRutina:", error);
        }
    };

    const convertirYouTubeEmbed = (url) => {
        if (!url) return "";

        if (url.includes("shorts/")) {
            const id = url.split("shorts/")[1];
            return `https://www.youtube.com/embed/${id}`;
        }

        if (url.includes("watch?v=")) {
            const id = url.split("watch?v=")[1];
            return `https://www.youtube.com/embed/${id}`;
        }

        return url;
    };

    return (
        <div className="">

            <div className="modern-card p-4 mb-5 container mt-5">
                <h2 className="text-center mb-4 fw-bold text-white">
                    Selecciona tu rutina
                </h2>

                <div className="mb-3">
                    <label className="form-label text-white">Objetivo</label>
                    <select
                        className="form-select modern-select"
                        onChange={(e) => setObjetivo(e.target.value)}
                    >
                        <option value="">Selecciona...</option>
                        <option value="bajar_peso">Bajar de peso</option>
                        <option value="ganar_masa">Ganar masa muscular</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label text-white">Grupo muscular</label>
                    <select
                        className="form-select modern-select"
                        onChange={(e) => setMusculo(e.target.value)}
                    >
                        <option value="">Selecciona...</option>
                        <option value="pecho">Pecho</option>
                        <option value="espalda">Espalda</option>
                        <option value="piernas">Piernas</option>
                        <option value="brazos">Brazos</option>
                        <option value="hombros">Hombros</option>
                        <option value="abdomen">Abdomen</option>
                    </select>
                </div>

                <button
                    className="btn-glass w-100 mt-2"
                    onClick={obtenerRutina}
                    disabled={!objetivo || !musculo}
                >
                    Obtener rutina
                </button>
            </div>

            {resultado && (
                <div className="glass-card p-4">
                    <h4 className="text-white fw-bold text-capitalize mb-4">
                        Rutina para {resultado.musculo.replace("_", " ")}
                    </h4>

                    <div className="exercise-list">
                        {resultado.rutina.map((ejercicio, index) => (
                            <div key={index} className="exercise-item mb-4">
                                <h5 className="fw-bold text-white">{ejercicio.nombre}</h5>

                                <iframe
                                    width="100%"
                                    height="450"
                                    src={convertirYouTubeEmbed(ejercicio.video)}
                                    className="rounded glass-video"
                                    allowFullScreen
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                ></iframe>

                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default TrainingSelector;
