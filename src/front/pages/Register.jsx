import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BACKEND_URL from "../components/BackendURL.jsx";
import '../Login.css';

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

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            setTimeout(() => navigate('/login'), 1500);

        } catch (error) {
            setErrors({ submit: 'Error de conexión con el servidor' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box register-box">
                <div className="login-header">
                    <h2
                        onClick={() => navigate('/')}
                        style={{ cursor: 'pointer' }}
                    >
                        GYMCLOUD
                    </h2>
                    <p>Crear Cuenta</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className={errors.nombre ? 'input-error' : ''}
                            />
                            {errors.nombre && <span className="error-text">{errors.nombre}</span>}
                        </div>

                        <div className="form-group">
                            <label>Apellido</label>
                            <input
                                type="text"
                                name="apellido"
                                placeholder="Apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                className={errors.apellido ? 'input-error' : ''}
                            />
                            {errors.apellido && <span className="error-text">{errors.apellido}</span>}
                        </div>
                    </div>

                    <label>Correo electrónico</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'input-error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}

                    <label>Teléfono</label>
                    <input
                        type="tel"
                        name="telefono"
                        placeholder="Teléfono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className={errors.telefono ? 'input-error' : ''}
                    />
                    {errors.telefono && <span className="error-text">{errors.telefono}</span>}

                    <label>Fecha de Nacimiento</label>
                    <input
                        type="date"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        className={errors.fechaNacimiento ? 'input-error' : ''}
                    />
                    {errors.fechaNacimiento && <span className="error-text">{errors.fechaNacimiento}</span>}

                    <label>Contraseña</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'input-error' : ''}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    {errors.password && <span className="error-text">{errors.password}</span>}

                    <label>Confirmar contraseña</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? 'input-error' : ''}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}

                    {errors.submit && (
                        <div className="alert error">
                            <p>{errors.submit}</p>
                        </div>
                    )}

                    {success && (
                        <div className="alert success">
                            <p>¡Cuenta creada exitosamente!</p>
                        </div>
                    )}

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "⏳ Creando cuenta..." : "Crear Cuenta"}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        ¿Ya tienes cuenta?{' '}
                        <button onClick={() => navigate('/')} className="link">
                            Iniciar Sesión
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;