import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-dark bg-none">
			<div className="container">
				<div className="d-flex align-items-center">
					<Link to="/">
						<img
							src="/logo3.png"
							alt="Logo del gimnasio"
							height="50"
							style={{ cursor: "pointer" }}
						/>
					</Link>
					<div className="dropdown">
						<button
							className="btn btn-secondary dropdown-toggle"
							type="button"
							id="dropdownMenuButton"
							data-bs-toggle="dropdown"
							aria-expanded="false"
							style={{ backgroundColor: "transparent", border: "none" }}
						>
							{/* Ícono tipo hamburguesa */}
							<span className="navbar-toggler-icon"></span>
						</button>

						<ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
							<li><button className="dropdown-item" type="button">Inicio</button></li>
							<li><button className="dropdown-item" type="button">Rutinas</button></li>
							<li><button className="dropdown-item" type="button">Alimentación</button></li>
							<li><button className="dropdown-item" type="button">Contacto</button></li>
						</ul>
					</div>

				</div>
				<div className="ml-auto">
					{/* AGREGADO: Botón de registro */}
					<Link to="/login">
						<button className="btn btn-info me-2">Iniciar Sesión</button>
					</Link>
					<Link to="/register">
						<button className="btn btn-info">Registrarse</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};