import React from "react";
import "../Footer.css";

export const Footer = () => {
	return (
		<footer className="footer-glass">
			<div className="footer-content">

				{/* LOGO / MARCA */}
				<div className="footer-section">
					<h2 className="footer-logo">GymCloud</h2>
					<p className="footer-slogan">Transforma tu cuerpo, transforma tu vida</p>
				</div>

				{/* ENLACES */}
				<div className="footer-section">
					<h3>Enlaces</h3>
					<ul>
						<li>Inicio</li>
						<li>Clases</li>
						<li>Entrenadores</li>
						<li>Membresías</li>
						<li>Contacto</li>
					</ul>
				</div>

				{/* CONTACTO */}
				<div className="footer-section">
					<h3>Contacto</h3>
					<p>Calle Edison 3</p>
					<p>Madrid, España</p>
					<p>+1 234 567 890</p>
					<p>contacto@gymcloud.com</p>
				</div>

				{/* REDES SOCIALES */}
				<div className="footer-section">
					<h3>Síguenos</h3>
					<div className="footer-socials">
						<i className="fa-brands fa-instagram"></i>
						<i className="fa-brands fa-facebook"></i>
						<i className="fa-brands fa-tiktok"></i>
						<i className="fa-brands fa-youtube"></i>
					</div>
				</div>
			</div>

			<div className="footer-bottom">
				© {new Date().getFullYear()} GymCloud — Todos los derechos reservados.
			</div>
		</footer>
	);
};

export default Footer;
