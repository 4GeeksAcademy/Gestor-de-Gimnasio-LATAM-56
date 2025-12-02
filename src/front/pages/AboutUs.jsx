import React from "react";
import "../AboutUs.css";

const AboutUs = () => {
    const team = [
        { nombre: "Andrés", rol: "Desarrollador Full Stack", email: "andres@gymcloud.com", telefono: "+1 111 111 111", imagen: "https://via.placeholder.com/150", facebook: "#", instagram: "#", linkedin: "#" },
        { nombre: "Fernando", rol: "Desarrollador Full Stack", email: "fernando@gymcloud.com", telefono: "+1 222 222 222", imagen: "https://via.placeholder.com/150", facebook: "#", instagram: "#", linkedin: "#" },
        { nombre: "Juan Carlos", rol: "Desarrollador Full Stack", email: "juancarlos@gymcloud.com", telefono: "+1 333 333 333", imagen: "https://via.placeholder.com/150", facebook: "#", instagram: "#", linkedin: "#" }
    ];

    return (
        <div className="about-wrapper">
            <h1 className="about-title">Nuestro Equipo</h1>
            <div className="about-team">
                {team.map((miembro, index) => (
                    <div key={index} className="team-card">
                        <img src={miembro.imagen} alt={miembro.nombre} />
                        <h2>{miembro.nombre}</h2>
                        <p>{miembro.rol}</p>
                        <div className="info-item"><i className="fa-solid fa-phone"></i>{miembro.telefono}</div>
                        <div className="info-item"><i className="fa-solid fa-envelope"></i>{miembro.email}</div>
                        <div className="social-links">
                            <a href={miembro.facebook} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook"></i></a>
                            <a href={miembro.instagram} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram"></i></a>
                            <a href={miembro.linkedin} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin"></i></a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutUs;
