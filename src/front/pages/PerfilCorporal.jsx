import React, { useState, useEffect } from 'react';
import { User, Save, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../PerfilCorporal.css';

// Detectar automáticamente la URL del backend
const getBackendURL = () => {
    // Si hay variable de entorno, usarla
    if (import.meta.env.VITE_BACKEND_URL) {
        return import.meta.env.VITE_BACKEND_URL;
    }

    // Si estamos en GitHub Codespaces
    if (window.location.hostname.includes('github.dev')) {
        const baseUrl = window.location.hostname.replace('-3000.', '-3001.');
        return `https://${baseUrl}`;
    }

    // Localhost por defecto
    return 'http://localhost:3001';
};

const API_URL = getBackendURL();

const PerfilCorporal = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [perfil, setPerfil] = useState({
        peso: '',
        altura: '',
        edad: '',
        genero: 'masculino',
        medidas: {
            cuello: '',
            pecho: '',
            cintura: '',
            cadera: '',
            musloIzq: '',
            musloDer: '',
            pantorrillaIzq: '',
            pantorrillaDer: '',
            brazoIzq: '',
            brazoDer: '',
            antebrazoIzq: '',
            antebrazoDer: ''
        }
    });

    // 🔥 CARGAR PERFIL AL MONTAR EL COMPONENTE
    useEffect(() => {
        cargarPerfil();
    }, []);

    const cargarPerfil = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                setError('No estás autenticado. Por favor inicia sesión.');
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_URL}/api/perfil`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar perfil');
            }

            const data = await response.json();

            // Mapear datos del backend al estado local
            setPerfil({
                peso: data.peso || '',
                altura: data.altura || '',
                edad: data.edad || '',
                genero: data.genero || 'masculino',
                medidas: {
                    cuello: data.cuello || '',
                    pecho: data.pecho || '',
                    cintura: data.cintura || '',
                    cadera: data.cadera || '',
                    musloIzq: data.muslo_izq || '',
                    musloDer: data.muslo_der || '',
                    pantorrillaIzq: data.pantorrilla_izq || '',
                    pantorrillaDer: data.pantorrilla_der || '',
                    brazoIzq: data.brazo_izq || '',
                    brazoDer: data.brazo_der || '',
                    antebrazoIzq: data.antebrazo_izq || '',
                    antebrazoDer: data.antebrazo_der || ''
                }
            });

            setError(null);
        } catch (err) {
            console.error('Error:', err);
            setError('No se pudo cargar el perfil');
        } finally {
            setLoading(false);
        }
    };

    // 🔥 GUARDAR PERFIL EN EL BACKEND
    const guardarPerfil = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/api/perfil`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    peso: parseFloat(perfil.peso) || 0,
                    altura: parseInt(perfil.altura) || 0,
                    edad: parseInt(perfil.edad) || 0,
                    genero: perfil.genero,
                    medidas: {
                        cuello: parseFloat(perfil.medidas.cuello) || 0,
                        pecho: parseFloat(perfil.medidas.pecho) || 0,
                        cintura: parseFloat(perfil.medidas.cintura) || 0,
                        cadera: parseFloat(perfil.medidas.cadera) || 0,
                        musloIzq: parseFloat(perfil.medidas.musloIzq) || 0,
                        musloDer: parseFloat(perfil.medidas.musloDer) || 0,
                        pantorrillaIzq: parseFloat(perfil.medidas.pantorrillaIzq) || 0,
                        pantorrillaDer: parseFloat(perfil.medidas.pantorrillaDer) || 0,
                        brazoIzq: parseFloat(perfil.medidas.brazoIzq) || 0,
                        brazoDer: parseFloat(perfil.medidas.brazoDer) || 0,
                        antebrazoIzq: parseFloat(perfil.medidas.antebrazoIzq) || 0,
                        antebrazoDer: parseFloat(perfil.medidas.antebrazoDer) || 0
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al guardar perfil');
            }

            const data = await response.json();
            console.log('Perfil guardado:', data);

            alert('Perfil guardado exitosamente');

            // Recargar perfil
            await cargarPerfil();
        } catch (err) {
            console.error('Error:', err);
            alert(`Error al guardar el perfil: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    // Calcular IMC
    const calcularIMC = () => {
        if (perfil.peso && perfil.altura) {
            const alturaMetros = perfil.altura / 100;
            const imc = perfil.peso / (alturaMetros * alturaMetros);
            return imc.toFixed(1);
        }
        return '-';
    };

    // Clasificación del IMC
    const clasificacionIMC = (imc) => {
        if (imc < 18.5) return { texto: 'Bajo peso', color: 'text-yellow-600' };
        if (imc < 25) return { texto: 'Normal', color: 'text-green-600' };
        if (imc < 30) return { texto: 'Sobrepeso', color: 'text-orange-600' };
        return { texto: 'Obesidad', color: 'text-red-600' };
    };

    const handleInputChange = (field, value) => {
        setPerfil(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleMedidaChange = (medida, value) => {
        setPerfil(prev => ({
            ...prev,
            medidas: {
                ...prev.medidas,
                [medida]: value
            }
        }));
    };

    // 🔥 MOSTRAR LOADING
    if (loading) {
        return (
            <div className="perfil-container">
                <div className="perfil-wrapper">
                    <p style={{ textAlign: 'center', padding: '2rem', fontSize: '1.2rem' }}>Cargando perfil...</p>
                </div>
            </div>
        );
    }

    // 🔥 MOSTRAR ERROR
    if (error) {
        return (
            <div className="perfil-container">
                <div className="perfil-wrapper">
                    <p style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</p>
                    <button onClick={cargarPerfil} style={{ display: 'block', margin: '0 auto' }}>Reintentar</button>
                </div>
            </div>
        );
    }

    const imc = calcularIMC();
    const clasificacion = imc !== '-' ? clasificacionIMC(parseFloat(imc)) : null;

    return (
        <div className="perfil-container">
            <div className="perfil-wrapper">
                {/* Header */}
                <div className="perfil-header">
                    <div>
                        <h1 className="perfil-title">
                            <User className="icon-large" />
                            Mi Perfil Corporal
                        </h1>
                        <p className="perfil-subtitle">Registra tus medidas y controla tu progreso</p>
                    </div>
                    <button
                        onClick={guardarPerfil}
                        disabled={saving}
                        className="btn-guardar"
                    >
                        <Save className="icon-small" />
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>

                {/* Datos Básicos */}
                <div className="perfil-section">
                    <h2 className="section-title">Datos Básicos</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Peso (kg)</label>
                            <input
                                type="number"
                                value={perfil.peso}
                                onChange={(e) => handleInputChange('peso', e.target.value)}
                                className="form-input"
                                step="0.1"
                                placeholder="75.5"
                            />
                        </div>
                        <div className="form-group">
                            <label>Altura (cm)</label>
                            <input
                                type="number"
                                value={perfil.altura}
                                onChange={(e) => handleInputChange('altura', e.target.value)}
                                className="form-input"
                                placeholder="175"
                            />
                        </div>
                        <div className="form-group">
                            <label>Edad</label>
                            <input
                                type="number"
                                value={perfil.edad}
                                onChange={(e) => handleInputChange('edad', e.target.value)}
                                className="form-input"
                                placeholder="28"
                            />
                        </div>
                        <div className="form-group">
                            <label>Género</label>
                            <select
                                value={perfil.genero}
                                onChange={(e) => handleInputChange('genero', e.target.value)}
                                className="form-input"
                            >
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* IMC Card */}
                {imc !== '-' && (
                    <div className="imc-card">
                        <div className="imc-content">
                            <div>
                                <p className="imc-label">Índice de Masa Corporal (IMC)</p>
                                <p className="imc-value">{imc}</p>
                                {clasificacion && (
                                    <p className={`imc-clasificacion ${clasificacion.color}`}>
                                        {clasificacion.texto}
                                    </p>
                                )}
                            </div>
                            <TrendingUp className="imc-icon" />
                        </div>
                    </div>
                )}

                {/* Medidas Corporales */}
                <div className="perfil-section">
                    <h2 className="section-title">Medidas Corporales (cm)</h2>

                    {/* Torso */}
                    <div className="medidas-grupo">
                        <h3 className="grupo-title">Torso</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Cuello</label>
                                <input
                                    type="number"
                                    value={perfil.medidas.cuello}
                                    onChange={(e) => handleMedidaChange('cuello', e.target.value)}
                                    className="form-input"
                                    step="0.1"
                                    placeholder="38"
                                />
                            </div>
                            <div className="form-group">
                                <label>Pecho</label>
                                <input
                                    type="number"
                                    value={perfil.medidas.pecho}
                                    onChange={(e) => handleMedidaChange('pecho', e.target.value)}
                                    className="form-input"
                                    step="0.1"
                                    placeholder="95"
                                />
                            </div>
                            <div className="form-group">
                                <label>Cintura</label>
                                <input
                                    type="number"
                                    value={perfil.medidas.cintura}
                                    onChange={(e) => handleMedidaChange('cintura', e.target.value)}
                                    className="form-input"
                                    step="0.1"
                                    placeholder="85"
                                />
                            </div>
                            <div className="form-group">
                                <label>Cadera</label>
                                <input
                                    type="number"
                                    value={perfil.medidas.cadera}
                                    onChange={(e) => handleMedidaChange('cadera', e.target.value)}
                                    className="form-input"
                                    step="0.1"
                                    placeholder="100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Brazos */}
                    <div className="medidas-grupo">
                        <h3 className="grupo-title">Brazos</h3>
                        <div className="form-grid-2cols">
                            <div className="form-group">
                                <label>Brazo Izquierdo</label>
                                <input
                                    type="number"
                                    value={perfil.medidas.brazoIzq}
                                    onChange={(e) => handleMedidaChange('brazoIzq', e.target.value)}
                                    className="form-input"
                                    step="0.1"
                                    placeholder="35"
                                />
                            </div>
                            <div className="form-group">
                                <label>Brazo Derecho</label>
                                <input
                                    type="number"
                                    value={perfil.medidas.brazoDer}
                                    onChange={(e) => handleMedidaChange('brazoDer', e.target.value)}
                                    className="form-input"
                                    step="0.1"
                                    placeholder="35"
                                />
                            </div>
                            <div className="form-group">
                                <label>Antebrazo Izquierdo</label>
                                <input
                                    type="number"
                                    value={perfil.medidas.antebrazoIzq}
                                    onChange={(e) => handleMedidaChange('antebrazoIzq', e.target.value)}
                                    className="form-input"
                                    step="0.1"
                                    placeholder="28"
                                />
                            </div>
                            <div className="form-group">
                                <label>Antebrazo Derecho</label>
                                <input
                                    type="number"
                                    value={perfil.medidas.antebrazoDer}
                                    onChange={(e) => handleMedidaChange('antebrazoDer', e.target.value)}
                                    className="form-input"
                                    step="0.1"
                                    placeholder="28"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Piernas */}
                    <div className="medidas-grupo">
                        <h3 className="grupo-title">Piernas</h3>
                        <div className="form-grid-2cols">
                            <div className="form-group">
                                <label>Muslo Izquierdo</label>
                                <input
                                    type="number"
                                    value={perfil.medidas.musloIzq}
                                    onChange={(e) => handleMedidaChange('musloIzq', e.target.value)}
                                    className="form-input"
                                    step="0.1"
                                    placeholder="55"
                                />
                            </div>
                            <div className="form-group">
                                <label>Muslo Derecho</label>
                                <input
                                    type="number"
                                    value={perfil.medidas.musloDer}
                                    onChange={(e) => handleMedidaChange('musloDer', e.target.value)}
                                    className="form-input"
                                    step="0.1"
                                    placeholder="55"
                                />
                            </div>
                            <div className="form-group">
                                <label>Pantorrilla Izquierda</label>
                                <input
                                    type="number"
                                    value={perfil.medidas.pantorrillaIzq}
                                    onChange={(e) => handleMedidaChange('pantorrillaIzq', e.target.value)}
                                    className="form-input"
                                    step="0.1"
                                    placeholder="38"
                                />
                            </div>
                            <div className="form-group">
                                <label>Pantorrilla Derecha</label>
                                <input
                                    type="number"
                                    value={perfil.medidas.pantorrillaDer}
                                    onChange={(e) => handleMedidaChange('pantorrillaDer', e.target.value)}
                                    className="form-input"
                                    step="0.1"
                                    placeholder="38"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón Guardar Footer */}
                <div className="perfil-footer">
                    <button
                        onClick={guardarPerfil}
                        disabled={saving}
                        className="btn-guardar-footer"
                    >
                        <Save className="icon-small" />
                        {saving ? 'Guardando...' : 'Guardar Todos los Cambios'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PerfilCorporal;