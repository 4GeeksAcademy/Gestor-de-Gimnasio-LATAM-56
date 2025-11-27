import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../UserNavbar.css";
import useGlobalReducer from "../hooks/useGlobalReducer";


export const UserNavbar = () => {
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();


    const logout = () => {
        // Remueve token o datos del usuario
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
        navigate("/"); // lleva al home público
    };

    return (
        <nav className="navbar user-navbar navbar-expand-lg">
            <div className="container-fluid">

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
                        <li><Link className="dropdown-item" to="/perfil-corporal">Perfil Corporal</Link></li>
                        <li><Link className="dropdown-item" to="/contacto">Contacto</Link></li>
                    </ul>
                </div>



                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarUser">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarUser">
                    <ul className="navbar-nav ms-auto">

                        <Link className="navbar-brand" to="/dashboard">
                            Mi Cuenta
                        </Link>

                        <li className="nav-item">
                            <Link className="nav-link" to="/perfil">Perfil</Link>
                        </li>

                        <li className="nav-item">
                            <button className="btn btn-glass ms-2" onClick={logout}>
                                Cerrar sesión
                            </button>
                        </li>

                    </ul>
                </div>

            </div>
        </nav>

    );
};
