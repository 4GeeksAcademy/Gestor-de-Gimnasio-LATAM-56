import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
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

        // Limpiar error del campo cuando el usuario escribe
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
        if (!formData.password) newErrors.password = 'La contraseña es requerida';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
        if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
        if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';

        // Validación de contraseña
        if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Debe contener mayúsculas, minúsculas y números';
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
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            const response = await fetch(`${backendUrl}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    email: formData.email,
                    password: formData.password,
                    telefono: formData.telefono,
                    fechaNacimiento: formData.fechaNacimiento
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrar usuario');
            }

            setSuccess(true);
            setFormData({
                nombre: '',
                apellido: '',
                email: '',
                password: '',
                confirmPassword: '',
                telefono: '',
                fechaNacimiento: ''
            });

        } catch (error) {
            setErrors({ submit: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-vh-100 bg-dark d-flex align-items-center justify-content-center p-4">
                <div className="bg-light rounded-3 p-5 text-center shadow-lg">
                    <div className="bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                        <i className="fas fa-check text-white fa-2x"></i>
                    </div>
                    <h2 className="text-dark mb-3">¡Registro Exitoso!</h2>
                    <p className="text-muted mb-4">Tu cuenta ha sido creada correctamente. Bienvenido a GYMCLOUD.</p>
                    <Link
                        to="/"
                        className="btn btn-primary btn-lg px-4"
                    >
                        Ir al Inicio
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-dark d-flex align-items-center justify-content-center p-4">
            <div className="bg-light rounded-3 p-4 p-md-5 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
                {/* Header */}
                <div className="text-center mb-4">
                    <Link to="/" className="text-decoration-none">
                        <h1 className="h2 text-primary fw-bold">GYMCLOUD</h1>
                    </Link>
                    <h2 className="h3 text-dark mt-3">Crear Cuenta</h2>
                    <p className="text-muted">Únete a nuestra comunidad fitness</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Nombre y Apellido */}
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className={`form-control form-control-lg ${errors.nombre ? 'is-invalid' : ''}`}
                            />
                            {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                        </div>
                        <div className="col-md-6">
                            <input
                                type="text"
                                name="apellido"
                                placeholder="Apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                className={`form-control form-control-lg ${errors.apellido ? 'is-invalid' : ''}`}
                            />
                            {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <input
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            value={formData.email}
                            onChange={handleChange}
                            className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    {/* Teléfono */}
                    <div className="mb-3">
                        <input
                            type="tel"
                            name="telefono"
                            placeholder="Teléfono (10 dígitos)"
                            value={formData.telefono}
                            onChange={handleChange}
                            className={`form-control form-control-lg ${errors.telefono ? 'is-invalid' : ''}`}
                        />
                        {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                    </div>

                    {/* Fecha de Nacimiento */}
                    <div className="mb-3">
                        <input
                            type="date"
                            name="fechaNacimiento"
                            value={formData.fechaNacimiento}
                            onChange={handleChange}
                            className={`form-control form-control-lg ${errors.fechaNacimiento ? 'is-invalid' : ''}`}
                        />
                        {errors.fechaNacimiento && <div className="invalid-feedback">{errors.fechaNacimiento}</div>}
                    </div>

                    {/* Contraseña */}
                    <div className="mb-3">
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>

                    {/* Confirmar Contraseña */}
                    <div className="mb-4">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirmar contraseña"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`form-control form-control-lg ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        />
                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>

                    {/* Error de submit */}
                    {errors.submit && (
                        <div className="alert alert-danger" role="alert">
                            {errors.submit}
                        </div>
                    )}

                    {/* Botón de registro */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary btn-lg w-100 py-3 fw-bold"
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Creando cuenta...
                            </>
                        ) : (
                            'Crear Cuenta'
                        )}
                    </button>
                </form>

                {/* Enlace a login */}
                <div className="text-center mt-4">
                    <p className="text-muted">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/" className="text-primary text-decoration-none fw-bold">
                            Iniciar Sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;