import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useNavigate } from "react-router-dom";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL;

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

			const response = await fetch(backendUrl + "/api/hello");
			const data = await response.json();

			if (response.ok) dispatch({ type: "set_hello", payload: data.message });

			return data;

		} catch (error) {
			if (error.message)
				throw new Error(
					`Could not fetch the message from the backend.
					Please check if the backend is running and the backend port is public.`
				);
		}
	};

	useEffect(() => {
		loadMessage();
	}, []);

	const handleCardClick = (path) => {
		const token = localStorage.getItem("token");

		if (!token) {
			alert("⚠️ Debes iniciar sesión para acceder a esta sección");
			navigate("/login");
		} else {
			navigate(path);
		}
	};

	return (
		<div className="text-center mt-5">

			{/* Carousel */}
			<div id="carouselExampleControls" className="carousel slide carousel-big" data-bs-ride="carousel">
				<div className="carousel-inner">
					<div className="carousel-item active">
						<img src="/imagen1.jpg" className="d-block w-100" alt="..." />
					</div>
					<div className="carousel-item">
						<img src="/imagen2.jpg" className="d-block w-100" alt="..." />
					</div>
					<div className="carousel-item">
						<img src="/imagen3.jpg" className="d-block w-100" alt="..." />
					</div>
				</div>

				<button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
					<span className="carousel-control-prev-icon" aria-hidden="true"></span>
					<span className="visually-hidden">Previous</span>
				</button>

				<button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
					<span className="carousel-control-next-icon" aria-hidden="true"></span>
					<span className="visually-hidden">Next</span>
				</button>
			</div>

			<div className="d-flex flex-column align-items-center gap-4 mt-4">

				<div className="card-small d-flex align-items-center">
					<img src="/rutinas.png" className="card-small-img" alt="Rutinas" />
					<div className="card-small-body">
						<h5 className="card-small-title">Rutinas</h5>
						<p className="card-small-text">
							Accede a programas de entrenamiento diseñados con precisión para maximizar
							tus resultados. Descubre rutinas elegantes, eficientes y adaptadas a tus
							objetivos, creadas para elevar tu rendimiento y transformar tu cuerpo con
							un enfoque moderno y profesional.
						</p>
						<button
							onClick={() => handleCardClick("/training")}
							className="btn-home-small"
						>
							Ver más
						</button>
					</div>
				</div>

				<div className="card-small d-flex align-items-center">
					<img src="/alimentacion.png" className="card-small-img" alt="Alimentación" />
					<div className="card-small-body">
						<h5 className="card-small-title">Alimentación</h5>
						<p className="card-small-text">
							Explora una guía nutricional cuidadosamente elaborada para optimizar tu
							bienestar. Aprende a equilibrar tus comidas, seleccionar ingredientes de
							calidad y crear hábitos sostenibles que impulsen una vida más saludable,
							energética y sofisticada.
						</p>
						<button
							onClick={() => handleCardClick("/alimentacion")}
							className="btn-home-small"
						>
							Ver más
						</button>
					</div>
				</div>

				<div className="card-small d-flex align-items-center">
					<img src="/objetivos.png" className="card-small-img" alt="Objetivos" />
					<div className="card-small-body">
						<h5 className="card-small-title">Objetivos</h5>
						<p className="card-small-text">
							Establece metas claras y personalizadas con una metodología enfocada en la
							excelencia. Diseña tu camino hacia una mejor versión de ti mismo mediante
							herramientas de seguimiento, planificación estratégica y una visión
							orientada a resultados reales y mas duraderos.
						</p>
						<button
							onClick={() => handleCardClick("/objetivos")}
							className="btn-home-small"
						>
							Ver más
						</button>
					</div>
				</div>

			</div>

		</div>
	);
};