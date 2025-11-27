import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../Alimentacion.css";

const metas = { bajar: "Bajar peso", mantener: "Mantener peso", subir: "Subir peso" };
const actividades = { sedentaria: "Sedentaria", ligera: "Ligera", moderada: "Moderada", intensa: "Intensa" };

export default function Alimentacion() {
    const { dispatch } = useGlobalReducer();

    const [form, setForm] = useState({ sexo: "m", edad: "", peso: "", altura: "", actividad: "sedentaria", meta: "mantener" });
    const [dietas, setDietas] = useState([]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.edad || !form.peso || !form.altura || isNaN(form.edad) || isNaN(form.peso) || isNaN(form.altura)) {
            alert("Por favor llena todos los campos numéricos correctamente.");
            return;
        }

        try {
            const res = await fetch("https://obscure-space-engine-97xg9964jx9j2xxv9-3001.app.github.dev/api/dietas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error en el servidor");

            console.log("Data recibida del backend:", data);
            setDietas(data.dietas);
            //dispatch({ type: "setAlimentacion", payload: { form, dietas: data.dietas } });
        } catch (error) {
            alert("Error: " + error.message);
        }
    }

    return (
        <div className="alimentacion-container">
            <h1>Generador de Dietas</h1>
            <form className="alimentacion-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Sexo:</label>
                    <select name="sexo" value={form.sexo} onChange={handleChange}>
                        <option value="m">Masculino</option>
                        <option value="f">Femenino</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Edad:</label>
                    <input type="number" name="edad" min="1" value={form.edad} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Peso (kg):</label>
                    <input type="number" name="peso" min="1" value={form.peso} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Altura (cm):</label>
                    <input type="number" name="altura" min="1" value={form.altura} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Actividad física:</label>
                    <select name="actividad" value={form.actividad} onChange={handleChange}>
                        {Object.entries(actividades).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Meta:</label>
                    <select name="meta" value={form.meta} onChange={handleChange}>
                        {Object.entries(metas).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn-submit">Generar Dietas</button>
            </form>

            {dietas.length > 0 && (
                <div className="dietas-result">
                    <h2>Dietas Generadas</h2>
                    {dietas.map((d) => (
                        <div key={d.id} className="dieta-card">
                            <h3>Opción {d.id} - {d.meta}</h3>
                            <p><strong>Calorías estimadas:</strong> {d.calorias} kcal</p>
                            <ul>
                                <li><strong>Desayuno:</strong> {d.desayuno}</li>
                                <li><strong>Almuerzo:</strong> {d.almuerzo}</li>
                                <li><strong>Cena:</strong> {d.cena}</li>
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
