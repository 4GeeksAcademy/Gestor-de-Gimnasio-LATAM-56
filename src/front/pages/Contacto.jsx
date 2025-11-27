import React from "react";
import "../Contacto.css";

const Contacto = () => {
    return (
        <div className="contact-wrapper">
            <div className="contact-card">

                {/* PANEL IZQUIERDO */}
                <div className="contact-info-panel">
                    <h2>Información de contacto</h2>
                    <p>Si tenés alguna pregunta, no dudes en escribirnos.</p>

                    <div className="info-item">
                        <i className="fa-solid fa-phone"></i>
                        <span>+1 234 567 890</span>
                    </div>

                    <div className="info-item">
                        <i className="fa-solid fa-envelope"></i>
                        <span>contacto@gymcloud.com</span>
                    </div>

                    <div className="info-item">
                        <i className="fa-solid fa-location-dot"></i>
                        <span>Calle Falsa 123, Ciudad, País</span>
                    </div>

                    <div className="info-hours">
                        <p><strong>Horario:</strong></p>
                        <p>Lunes a Viernes</p>
                        <p>09:00 AM – 06:00 PM</p>
                    </div>

                    <div className="social-links">
                        <i className="fa-brands fa-facebook"></i>
                        <i className="fa-brands fa-instagram"></i>
                        <i className="fa-brands fa-tiktok"></i>
                        <i className="fa-brands fa-youtube"></i>
                    </div>
                </div>

                {/* PANEL DERECHO */}
                <form className="contact-form">
                    <h1>Contacto</h1>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Nombre</label>
                            <input type="text" placeholder="Tu nombre" />
                        </div>

                        <div className="form-group">
                            <label>Apellido</label>
                            <input type="text" placeholder="Tu apellido" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="tu@email.com" />
                    </div>

                    <div className="form-group">
                        <label>Teléfono</label>
                        <input type="text" placeholder="+1 234 567 890" />
                    </div>

                    <div className="form-group">
                        <label>Mensaje</label>
                        <textarea placeholder="Escribe tu mensaje..."></textarea>
                    </div>

                    <button className="send-btn">Enviar mensaje</button>
                </form>

            </div>
        </div>
    );
};

export default Contacto;
