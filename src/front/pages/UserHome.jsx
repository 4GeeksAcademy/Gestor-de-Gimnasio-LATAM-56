import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { UserNavbar } from "../components/UserNavbar";

export const UserHome = () => {

    useEffect(() => {
        // Aquí puedes cargar datos del usuario si deseas
    }, []);

    return (
        <div>

            <UserNavbar />

            <div className="text-center mt-4">

                <h2 className="text-white mb-4">Bienvenido de nuevo 💪</h2>

                {/* Carousel */}
                <div id="carouselUser" className="carousel slide carousel-big" data-bs-ride="carousel">
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
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselUser" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon"></span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselUser" data-bs-slide="next">
                        <span className="carousel-control-next-icon"></span>
                    </button>
                </div>

                <div className="d-flex flex-column align-items-center gap-4 mt-4">

                    <div className="card-small d-flex align-items-center">
                        <img src="/rutinas.png" className="card-small-img" alt="Rutinas" />
                        <div className="card-small-body">
                            <h5 className="card-small-title">Tus Rutinas</h5>
                            <p className="card-small-text">
                                Accede rápidamente a tus entrenamientos y continúa tu progreso.
                            </p>
                            <Link to="/training" className="btn-home-small">Entrar</Link>
                        </div>
                    </div>

                    <div className="card-small d-flex align-items-center">
                        <img src="/alimentacion.png" className="card-small-img" alt="Alimentación" />
                        <div className="card-small-body">
                            <h5 className="card-small-title">Plan de Alimentación</h5>
                            <p className="card-small-text">
                                Tu guía alimenticia personalizada basada en tus objetivos.
                            </p>
                            <Link to="/alimentacion" className="btn-home-small">Entrar</Link>
                        </div>
                    </div>

                    <div className="card-small d-flex align-items-center">
                        <img src="/objetivos.png" className="card-small-img" alt="Objetivos" />
                        <div className="card-small-body">
                            <h5 className="card-small-title">Tu Progreso</h5>
                            <p className="card-small-text">
                                Analiza tu rendimiento, metas completadas y próximos objetivos.
                            </p>
                            <Link to="/objetivos" className="btn-home-small">Entrar</Link>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
};
