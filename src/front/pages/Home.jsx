import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<div className="text-center mt-5">
			<h1 className="display-4 text-white">Gestor de GYM!!</h1>
			<div id="carouselExampleControls" className="carousel slide carousel-small" data-bs-ride="carousel">
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
			<div className="d-flex justify-content-center">
				<div className="card" style={{ width: "18rem" }}>
					<img src="/imagen-card3.jpg" className="card-img-top" alt="Clases" />
					<div className="card-body">
						<h5 className="card-title">Clases</h5>
						<p className="card-text">Disfruta de clases de grupo divertidas y efectivas.</p>
						<a href="#" className="btn btn-primary">Ver más cosas</a>
					</div>
				</div>
				<div>
					<div className="card" style={{ width: "18rem" }}>
						<img src="/imagen-card3.jpg" className="card-img-top" alt="Clases" />
						<div className="card-body">
							<h5 className="card-title">Clases</h5>
							<p className="card-text">Disfruta de clases de grupo divertidas y efectivas.</p>
							<a href="#" className="btn btn-primary">Ver más</a>
						</div>
					</div>
				</div>
				<div>
					<div className="card" style={{ width: "18rem" }}>
						<img src="/imagen-card3.jpg" className="card-img-top" alt="Clases" />
						<div className="card-body">
							<h5 className="card-title">Clases</h5>
							<p className="card-text">Disfruta de clases de grupo divertidas y efectivas.</p>
							<a href="#" className="btn btn-primary">Ver más</a>
						</div>
					</div>
				</div>

			</div>



		</div>
	);
}; 