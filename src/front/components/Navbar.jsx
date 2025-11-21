import { Link } from "react-router-dom";
import '../Navbar.css';

export const Navbar = () => {

	return (
		<nav className="navbar navbar-expand-lg navbar-dark fixed-top text-white">
			<div className="container">
				<div className="d-flex align-items-center">
					<Link to="/">
						<img
							src="/logo1.png"
							alt="Logo del gimnasio"
							height="70"
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

						<ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
							<li><Link className="dropdown-item" to="/">Inicio</Link></li>
							<li><Link className="dropdown-item" to="/training">Rutinas</Link></li>
							<li><Link className="dropdown-item" to="/alimentacion">Alimentación</Link></li>
							<li><Link className="dropdown-item" to="/objetivos">Objetivos</Link></li>
							<li><Link className="dropdown-item" to="/contacto">Contacto</Link></li>
						</ul>
					</div>

				</div>
				<div className="ml-auto">
					<Link to="/login">
						<button className="btn btn-glass me-2 text-white">Iniciar Sesión</button>
					</Link>
					<Link to="/register">
						<button className="btn btn-glass text-white">Registrarse</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};