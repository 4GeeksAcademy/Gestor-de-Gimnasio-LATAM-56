import React, { useState } from "react";

const TrainingSelector = () => {
    const [objetivo, setObjetivo] = useState("");
    const [musculo, setMusculo] = useState("");
    const [resultado, setResultado] = useState(null);

    const obtenerRutina = async () => {
        try {
            const URL = import.meta.env.VITE_BACKEND_URL + "/api/training/rutina";

            console.log("Llamando a:", URL);

            const response = await fetch(URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ objetivo, musculo })
            });

            if (!response.ok) {
                throw new Error("Error en la petición");
            }

            const data = await response.json();
            console.log("Respuesta backend:", data);

            setResultado(data);
        } catch (error) {
            console.error("Error en obtenerRutina:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Selecciona tu rutina</h2>

            <div className="mb-3">
                <label className="form-label">Objetivo</label>
                <select className="form-select" onChange={(e) => setObjetivo(e.target.value)}>
                    <option value="">Selecciona...</option>
                    <option value="bajar_peso">Bajar de peso</option>
                    <option value="ganar_masa">Ganar masa muscular</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Grupo muscular</label>
                <select className="form-select" onChange={(e) => setMusculo(e.target.value)}>
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
                className="btn btn-primary w-100"
                onClick={obtenerRutina}
                disabled={!objetivo || !musculo}
            >
                Obtener rutina
            </button>

            {resultado && (
                <div className="card mt-4">
                    <div className="card-body">
                        <h4 className="card-title text-capitalize">
                            Rutina para {resultado.musculo.replace("_", " ")}
                        </h4>
                        <ul>
                            {resultado.rutina.map((ej, index) => (
                                <li key={index}>{ej}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainingSelector;
