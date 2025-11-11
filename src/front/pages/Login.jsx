import React, { useState } from 'react';

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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Guardar el token en localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                setSuccess('¡Login exitoso! Bienvenido ' + data.user.email);

                // Redirigir después de 1 segundo
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">
                        🏋️ GymCloud
                    </h2>
                    <p className="text-gray-600">Inicia sesión para continuar</p>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
                        <p className="font-semibold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-4">
                        <p className="font-semibold">¡Éxito!</p>
                        <p>{success}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !email || !password}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {loading ? '⏳ Iniciando sesión...' : '🔐 Iniciar Sesión'}
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        ¿No tienes cuenta?{' '}
                        <button className="text-blue-600 hover:text-blue-700 font-semibold underline">
                            Regístrate aquí
                        </button>
                    </p>
                </div>

                <div className="mt-4 text-center">
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>
            </div>
        </div>
    );
}