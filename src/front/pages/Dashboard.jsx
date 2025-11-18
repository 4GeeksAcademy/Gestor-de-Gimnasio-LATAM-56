import React from "react";

const Dashboard = () => {
    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Dashboard</h1>

            {/* Sección de tarjetas de estadísticas */}
            <div className="row">
                <div className="col-md-4 mb-3">
                    <div className="card shadow">
                        <div className="card-body">
                            <h5 className="card-title">Usuarios Registrados</h5>
                            <p className="card-text fs-3 fw-bold text-primary">120</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card shadow">
                        <div className="card-body">
                            <h5 className="card-title">Planes Activos</h5>
                            <p className="card-text fs-3 fw-bold text-success">45</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card shadow">
                        <div className="card-body">
                            <h5 className="card-title">Clases del Día</h5>
                            <p className="card-text fs-3 fw-bold text-warning">8</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Otra sección */}
            <div className="mt-5">
                <h3 className="mb-3">Últimos movimientos</h3>
                <ul className="list-group">
                    <li className="list-group-item">Nuevo usuario registrado</li>
                    <li className="list-group-item">Pago recibido</li>
                    <li className="list-group-item">Clase agregada</li>
                    <li className="list-group-item">Actualización de perfil</li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
