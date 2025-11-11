import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-dark bg-none">
			<div className="container">
				<div>
					<img src="/logo3.png" alt="Logo del gimnasio" height="50" />
				</div>
				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-primary me-2">Check the Context in action</button>
					</Link>
					{/* AGREGADO: Botón de registro */}
					<Link to="/login">
						<button className="btn btn-info me-2">Iniciar Sesión</button>
					</Link>
					<Link to="/register">
						<button className="btn btn-success">Registrarse</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};