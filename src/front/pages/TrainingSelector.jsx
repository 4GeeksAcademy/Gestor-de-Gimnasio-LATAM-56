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

    // Convertir links de YouTube a embed
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

    // Detectar si es video
    const esVideo = (media) => {
        if (!media || typeof media !== "string") return false;
        return media.includes("youtube") || media.includes(".mp4");
    };

    return (
        <div className="modern-page-wrapper">
            <h2 className="text-center mb-4 fw-bold text-white">
                Selecciona tu rutina
            </h2>

            {/* SELECTS */}
            <div className="mb-3 modern">
                <label className="form-label text-white">Objetivo</label>
                <select className="form-select modern-select2" onChange={(e) => setObjetivo(e.target.value)}>
                    <option value="">Selecciona...</option>
                    <option value="bajar_peso">Bajar de peso</option>
                    <option value="ganar_masa">Ganar masa muscular</option>
                </select>
            </div>

            <div className="mb-3 modern">
                <label className="form-label text-white">Grupo muscular</label>
                <select className="form-select modern-select2" onChange={(e) => setMusculo(e.target.value)}>
                    <option value="">Selecciona...</option>
                    <option value="pecho">Pecho</option>
                    <option value="espalda">Espalda</option>
                    <option value="piernas">Piernas</option>
                    <option value="brazos">Brazos</option>
                    <option value="hombros">Hombros</option>
                    <option value="abdomen">Abdomen</option>
                </select>
            </div>

            {/* BOTÓN */}
            <div>
                <button
                    className="btn btn-glass2 mt-2"
                    onClick={obtenerRutina}
                    disabled={!objetivo || !musculo}
                >
                    Obtener rutina
                </button>
            </div>


            {/* RESULTADOS */}
            {resultado && (
                <div className="glass-card mt-4">
                    <div className="card-body text-white">
                        <h4 className="card-title text-capitalize fw-bold">
                            Rutina para {resultado.musculo.replace("_", " ")}
                        </h4>

                        <div className="exercise-list mt-3">
                            {resultado.rutina.map((ejercicio, index) => (
                                <div key={index} className="exercise-item mb-4">
                                    <h5 className="fw-bold">{ejercicio.nombre}</h5>

                                    {esVideo(ejercicio.video) ? (
                                        <iframe
                                            width="100%"
                                            height="250"
                                            src={convertirYouTubeEmbed(ejercicio.video)}
                                            className="rounded glass-video"
                                            allowFullScreen
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                        ></iframe>
                                    ) : (
                                        <img
                                            src={ejercicio.imagen}
                                            alt={ejercicio.nombre}
                                            className="img-fluid rounded glass-img"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainingSelector;
