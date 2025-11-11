import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BACKEND_URL from "../components/BackendURL.jsx"; // ← IMPORTA LA URL

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: '',
        telefono: '',
        fechaNacimiento: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
        if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
        if (!formData.email.trim()) newErrors.email = 'El email es requerido';
        if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
        if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Debe tener al menos 8 caracteres';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Debe contener mayúsculas, minúsculas y números';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const response = await fetch(`${BACKEND_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    email: formData.email.toLowerCase(),
                    password: formData.password,
                    telefono: formData.telefono,
                    fechaNacimiento: formData.fechaNacimiento
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ submit: data.message || 'Error al registrar usuario' });
                return;
            }

            setSuccess(true);
            setTimeout(() => navigate('/'), 1500);

        } catch (error) {
            setErrors({ submit: 'Error de conexión con el servidor' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-vh-100 bg-dark d-flex align-items-center justify-content-center p-4">
            <div className="bg-light rounded-3 p-4 p-md-5 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>

                <div className="text-center mb-4">
                    <h1 className="h2 text-primary fw-bold">GYMCLOUD</h1>
                    <h2 className="h3 text-dark mt-2">Crear Cuenta</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className={`form-control form-control-lg ${errors.nombre ? 'is-invalid' : ''}`} />
                            {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                        </div>

                        <div className="col-md-6">
                            <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} className={`form-control form-control-lg ${errors.apellido ? 'is-invalid' : ''}`} />
                            {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
                        </div>
                    </div>

                    <div className="mb-3">
                        <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`} />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                        <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} className={`form-control form-control-lg ${errors.telefono ? 'is-invalid' : ''}`} />
                        {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                    </div>

                    <div className="mb-3">
                        <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} className={`form-control form-control-lg ${errors.fechaNacimiento ? 'is-invalid' : ''}`} />
                        {errors.fechaNacimiento && <div className="invalid-feedback">{errors.fechaNacimiento}</div>}
                    </div>

                    <div className="mb-3">
                        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`} />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>

                    <div className="mb-4">
                        <input type="password" name="confirmPassword" placeholder="Confirmar contraseña" value={formData.confirmPassword} onChange={handleChange} className={`form-control form-control-lg ${errors.confirmPassword ? 'is-invalid' : ''}`} />
                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>

                    {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

                    <button type="submit" disabled={isLoading} className="btn btn-primary btn-lg w-100 py-3 fw-bold">
                        {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-muted">¿Ya tienes cuenta? <Link to="/" className="fw-bold">Iniciar Sesión</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
