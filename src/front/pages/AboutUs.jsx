import React from "react";
import { Code, Rocket, Heart, Users, Trophy, Zap, Github, Mail, Phone } from "lucide-react";
import "../AboutUs.css";

const AboutUs = () => {
    const team = [
        {
            nombre: "Andrés",
            rol: "Desarrollador Full Stack",
            especialidad: "Backend & Database Expert",
            email: "andres@gymcloud.com",
            telefono: "+1 111 111 111",
            imagen: "https://via.placeholder.com/150",
            facebook: "#",
            instagram: "#",
            linkedin: "#",
            github: "#",
            skills: ["Python", "Flask", "PostgreSQL"]
        },
        {
            nombre: "Fernando",
            rol: "Desarrollador Full Stack",
            especialidad: "Frontend & UX Specialist",
            email: "fernando@gymcloud.com",
            telefono: "+1 222 222 222",
            imagen: "https://via.placeholder.com/150",
            facebook: "#",
            instagram: "#",
            linkedin: "#",
            github: "#",
            skills: ["React", "JavaScript", "CSS"]
        },
        {
            nombre: "Juan Carlos",
            rol: "Desarrollador Full Stack",
            especialidad: "Integration & API Master",
            email: "juancarlos@gymcloud.com",
            telefono: "+1 333 333 333",
            imagen: "https://via.placeholder.com/150",
            facebook: "#",
            instagram: "#",
            linkedin: "#",
            github: "#",
            skills: ["Node.js", "APIs", "JWT"]
        }
    ];

    const stats = [
        { icon: <Code className="stat-icon" />, value: "3", label: "Desarrolladores Full Stack" },
        { icon: <Rocket className="stat-icon" />, value: "100%", label: "Pasión por el Código" },
        { icon: <Zap className="stat-icon" />, value: "∞", label: "Ideas Innovadoras" }
    ];

    return (
        <div className="about-wrapper">
            {/* Hero Section */}
            <div className="about-hero">
                <h1 className="about-title">
                    <Users className="icon-large" />
                    Nuestro Equipo
                </h1>
                <p className="about-subtitle">
                    Tres desarrolladores apasionados que transformaron una idea en realidad
                </p>
            </div>

            {/* Mission Section */}
            <div className="mission-section">
                <div className="mission-card">
                    <Heart className="mission-icon" />
                    <h2>Nuestra Misión</h2>
                    <p>
                        Crear soluciones tecnológicas innovadoras que faciliten la gestión de gimnasios
                        y mejoren la experiencia de entrenamiento de miles de usuarios.
                    </p>
                </div>

                <div className="mission-card">
                    <Rocket className="mission-icon" />
                    <h2>Nuestra Visión</h2>
                    <p>
                        Ser la plataforma líder en gestión deportiva en Latinoamérica,
                        democratizando el acceso a herramientas profesionales de fitness.
                    </p>
                </div>

                <div className="mission-card">
                    <Zap className="mission-icon" />
                    <h2>Nuestros Valores</h2>
                    <p>
                        Innovación constante, trabajo en equipo, código limpio y
                        compromiso con la excelencia en cada línea de código.
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="stats-container">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-box">
                        {stat.icon}
                        <h3>{stat.value}</h3>
                        <p>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Team Section */}
            <div className="team-section">
                <h2 className="section-title">Conoce al Equipo</h2>
                <p className="section-description">
                    Estudiantes de 4Geeks Academy que combinan creatividad,
                    habilidad técnica y pasión por el desarrollo web
                </p>

                <div className="about-team">
                    {team.map((miembro, index) => (
                        <div key={index} className="team-card">
                            <div className="card-image-wrapper">
                                <img src={miembro.imagen} alt={miembro.nombre} />
                                <div className="card-overlay">
                                    <Code size={40} />
                                </div>
                            </div>

                            <div className="card-content">
                                <h2>{miembro.nombre}</h2>
                                <p className="role">{miembro.rol}</p>
                                <p className="specialty">{miembro.especialidad}</p>

                                <div className="skills-badges">
                                    {miembro.skills.map((skill, idx) => (
                                        <span key={idx} className="skill-badge">{skill}</span>
                                    ))}
                                </div>

                                <div className="contact-info">
                                    <div className="info-item">
                                        <Phone size={16} />
                                        <span>{miembro.telefono}</span>
                                    </div>
                                    <div className="info-item">
                                        <Mail size={16} />
                                        <span>{miembro.email}</span>
                                    </div>
                                </div>

                                <div className="social-links">
                                    <a href={miembro.github} target="_blank" rel="noopener noreferrer" title="GitHub">
                                        <Github size={20} />
                                    </a>
                                    <a href={miembro.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                                        <i className="fa-brands fa-linkedin"></i>
                                    </a>
                                    <a href={miembro.instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
                                        <i className="fa-brands fa-instagram"></i>
                                    </a>
                                    <a href={miembro.facebook} target="_blank" rel="noopener noreferrer" title="Facebook">
                                        <i className="fa-brands fa-facebook"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tech Stack Section */}
            <div className="tech-stack">
                <h2 className="section-title">Tecnologías Utilizadas</h2>
                <div className="tech-grid">
                    <div className="tech-item">
                        <div className="tech-icon">⚛️</div>
                        <span>React</span>
                    </div>
                    <div className="tech-item">
                        <div className="tech-icon">🐍</div>
                        <span>Python/Flask</span>
                    </div>
                    <div className="tech-item">
                        <div className="tech-icon">🗄️</div>
                        <span>PostgreSQL</span>
                    </div>
                    <div className="tech-item">
                        <div className="tech-icon">🔐</div>
                        <span>JWT Auth</span>
                    </div>
                    <div className="tech-item">
                        <div className="tech-icon">🎨</div>
                        <span>CSS3</span>
                    </div>
                    <div className="tech-item">
                        <div className="tech-icon">⚡</div>
                        <span>Vite</span>
                    </div>
                </div>
            </div>

            {/* Footer Message */}
            <div className="footer-message">
                <Heart className="heart-icon" />
                <p>Desarrollado con pasión por estudiantes de 4Geeks Academy</p>
                <p className="footer-sub">De LATAM para el mundo 🌎</p>
            </div>
        </div>
    );
};

export default AboutUs;