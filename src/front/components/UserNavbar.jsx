import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../UserNavbar.css";

export const UserNavbar = () => {
    const navigate = useNavigate();

    const logout = () => {
        // Remueve token o datos del usuario
        localStorage.removeItem("token");
        localStorage.removeItem("user");

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
