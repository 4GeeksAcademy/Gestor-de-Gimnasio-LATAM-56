import React, { useState } from 'react';
import '../Login.css'; // 

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                setSuccess('¡Login exitoso! Bienvenido ' + data.user.email);

                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            } else {
                setError(data.error || 'Error al iniciar sesión');
            }
        } catch (err) {
            setError('Error de conexión. Verifica que el backend esté corriendo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h2>🏋️ GymCloud</h2>
                    <p>Inicia sesión para continuar</p>
                </div>

                {error && (
                    <div className="alert error">
                        <p><strong>Error:</strong> {error}</p>
                    </div>
                )}

                {success && (
                    <div className="alert success">
                        <p><strong>Éxito:</strong> {success}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                    />

                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />

                    <button type="submit" disabled={loading || !email || !password}>
                        {loading ? '⏳ Iniciando sesión...' : '🔐 Iniciar Sesión'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        ¿No tienes cuenta?{' '}
                        <button className="link">Regístrate aquí</button>
                    </p>
                </div>
            </div>
        </div>
    );
}
