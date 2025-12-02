import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import '../UserNavbar.css';

export const UserNavbar = () => {
	const navigate = useNavigate();
	const { store, dispatch } = useGlobalReducer();

	const handleLogout = () => {
		// Limpiar localStorage
		localStorage.removeItem("token");
		localStorage.removeItem("user");

		// Limpiar estado global
		dispatch({ type: "LOGOUT" });

		// Redirigir al home público
		navigate("/", { replace: true });
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-dark fixed-top text-white">
			<div className="container">
				<div className="d-flex align-items-center">
					<Link to="/userhome">
						<img
							src="/logo1.png"
							alt="Logo del gimnasio"
							height="90"
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
							<span className="navbar-toggler-icon"></span>
						</button>

						<ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
							<li><Link className="dropdown-item" to="/userhome">Inicio</Link></li>
							<li><Link className="dropdown-item" to="/training">Rutinas</Link></li>
							<li><Link className="dropdown-item" to="/alimentacion">Alimentación</Link></li>
							<li><Link className="dropdown-item" to="/objetivos">Objetivos</Link></li>
							<li><Link className="dropdown-item" to="/perfil-corporal">Perfil Corporal</Link></li>
							<li><Link className="dropdown-item" to="/contacto">Contacto</Link></li>
							<li><Link className="dropdown-item" to="/aboutus">About Us</Link></li>
							<li><hr className="dropdown-divider" /></li>
							<li>
								<button 
									className="dropdown-item text-danger" 
									onClick={handleLogout}
								>
									🚪 Cerrar Sesión
								</button>
							</li>
						</ul>
					</div>
				</div>

				<div className="ml-auto">
					<span className="text-white me-3">
						👤 {store.user?.nombre || "Usuario"}
					</span>
					<button 
						className="btn btn-glass text-white"
						onClick={handleLogout}
					>
						Cerrar Sesión
					</button>
				</div>
			</div>
		</nav>
	);
};