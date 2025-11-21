import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-expand-lg navbar-dark fixed-top text-white">
			<div className="container">
				<div className="d-flex align-items-center">
					<Link to="/">
						<img
							src="/logomejorado.png"
							alt="Logo del gimnasio"
							height="60"
							style={{ cursor: "pointer" }}
						/>
					</Link>
					<div className="dropdown">
						<button
							className="btn btn-secondary dropdown-toggle "
							type="button"
							id="dropdownMenuButton"
							data-bs-toggle="dropdown"
							aria-expanded="false"
							style={{ backgroundColor: "transparent", border: "none" }}
						>
							{/* Ícono tipo hamburguesa */}
							<span className="navbar-toggler-icon"></span>
						</button>

						<ul className="dropdown-menu dropdown-menu-end text-white" aria-labelledby="dropdownMenuButton">
							<li><Link className="dropdown-item" to="/">Inicio</Link></li>
							<li><Link className="dropdown-item" to="/training">Rutinas</Link></li>
							<li><button className="dropdown-item" type="button">Alimentación</button></li>
							<li><button className="dropdown-item" type="button">Objetivos</button></li>
							<li><button className="dropdown-item" type="button">Contacto</button></li>
						</ul>
					</div>

				</div>
				<div className="ml-auto">
					{/* AGREGADO: Botón de registro */}
					<Link to="/login">
						<button className="btn btn-glass me-2">Iniciar Sesión</button>
					</Link>
					<Link to="/register">
						<button className="btn btn-glass">Registrarse</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};