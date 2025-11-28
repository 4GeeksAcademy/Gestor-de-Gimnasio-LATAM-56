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
							height="90"
							style={{ cursor: "pointer" }}
						/>
					</Link>
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