import React, { useState, useEffect } from 'react';
import { User, Save, TrendingUp, Calendar, Target, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../PerfilCorporal.css';

// Detectar automáticamente la URL del backend
const getBackendURL = () => {
    if (import.meta.env.VITE_BACKEND_URL) {
        return import.meta.env.VITE_BACKEND_URL;
    }
    
    if (window.location.hostname.includes('github.dev')) {
        const baseUrl = window.location.hostname.replace('-3000.', '-3001.');
        return `https://${baseUrl}`;
    }
    
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

    useEffect(() => {
        cargarPerfil();
    }, []);

    const cargarPerfil = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            console.log('🔗 Backend URL:', API_URL);
            console.log('🔑 Token exists:', !!token);
            
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

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Error response:', errorData);
                
                if (response.status === 401 || response.status === 422) {
                    setError('Sesión expirada. Por favor inicia sesión nuevamente.');
                    localStorage.removeItem('token');
                    setTimeout(() => navigate('/login'), 2000);
                    return;
                }
                
                throw new Error('Error al cargar perfil');
            }

            const data = await response.json();
            console.log('✅ Perfil cargado:', data);
            
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
            console.error('❌ Error completo:', err);
            setError('No se pudo cargar el perfil');
        } finally {
            setLoading(false);
        }
    };

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

            console.log('✅ Perfil guardado');
            alert('Perfil guardado exitosamente');
            await cargarPerfil();
        } catch (err) {
            console.error('Error:', err);
            alert(`Error: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const calcularIMC = () => {
        if (perfil.peso && perfil.altura) {
            const alturaMetros = perfil.altura / 100;
            const imc = perfil.peso / (alturaMetros * alturaMetros);
            return imc.toFixed(1);
        }
        return '-';
    };

    const clasificacionIMC = (imc) => {
        if (imc < 18.5) return { texto: 'Bajo peso', color: 'stat-yellow' };
        if (imc < 25) return { texto: 'Normal', color: 'stat-green' };
        if (imc < 30) return { texto: 'Sobrepeso', color: 'stat-orange' };
        return { texto: 'Obesidad', color: 'stat-red' };
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

    if (loading) {
        return (
            <div className="objetivos-container">
                <div className="objetivos-wrapper">
                    <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando perfil...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="objetivos-container">
                <div className="objetivos-wrapper">
                    <p style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</p>
                    <button onClick={cargarPerfil}>Reintentar</button>
                </div>
            </div>
        );
    }

    const imc = calcularIMC();
    const clasificacion = imc !== '-' ? clasificacionIMC(parseFloat(imc)) : null;

    return (
        <div className="objetivos-container">
            <div className="objetivos-wrapper">
                {/* Header */}
                <div className="objetivos-header-with-button">
                    <div className="objetivos-header-content">
                        <h1 className="objetivos-title">
                            <User className="icon-large" />
                            Mi Perfil Corporal
                        </h1>
                        <p className="objetivos-subtitle">Registra tus medidas y controla tu progreso</p>
                    </div>
                    <button
                        onClick={() => navigate('/objetivos')}
                        className="btn-perfil-corporal-main"
                    >
                        <Target className="icon-small" />
                        <span>Mis Objetivos</span>
                    </button>
                </div>

                {/* Stats Cards - Similar a Objetivos */}
                <div className="stats-grid">
                    <div className="stat-card stat-blue">
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">Peso Actual</p>
                                <p className="stat-value">{perfil.peso || '-'} kg</p>
                            </div>
                            <Activity className="stat-icon" />
                        </div>
                    </div>

                    <div className={`stat-card ${clasificacion?.color || 'stat-green'}`}>
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">IMC</p>
                                <p className="stat-value">{imc}</p>
                            </div>
                            <TrendingUp className="stat-icon" />
                        </div>
                        {clasificacion && (
                            <div className="stat-text">
                                <p>{clasificacion.texto}</p>
                            </div>
                        )}
                    </div>

                    <div className="stat-card stat-purple">
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">Altura</p>
                                <p className="stat-value">{perfil.altura || '-'} cm</p>
                            </div>
                            <User className="stat-icon" />
                        </div>
                    </div>
                </div>

                {/* Botón Guardar */}
                <div className="objetivos-actions">
                    <h2 className="section-title">Datos Personales</h2>
                    <button
                        onClick={guardarPerfil}
                        disabled={saving}
                        className="btn-add-objetivo"
                    >
                        <Save className="icon-small" />
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>

                {/* Datos Básicos - Cards estilo Objetivos */}
                <div className="objetivos-grid">
                    <div className="objetivo-card">
                        <div className="objetivo-header">
                            <div className="objetivo-info">
                                <div className="categoria-icon bg-blue-500">👤</div>
                                <h3 className="objetivo-titulo">Información Básica</h3>
                            </div>
                        </div>

                        <div className="objetivo-actualizar">
                            <label>Peso (kg)</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    value={perfil.peso}
                                    onChange={(e) => handleInputChange('peso', e.target.value)}
                                    className="input-progreso"
                                    step="0.1"
                                    placeholder="75.5"
                                />
                                <span className="unidad-badge">kg</span>
                            </div>
                        </div>

                        <div className="objetivo-actualizar">
                            <label>Altura (cm)</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    value={perfil.altura}
                                    onChange={(e) => handleInputChange('altura', e.target.value)}
                                    className="input-progreso"
                                    placeholder="175"
                                />
                                <span className="unidad-badge">cm</span>
                            </div>
                        </div>

                        <div className="objetivo-actualizar">
                            <label>Edad</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    value={perfil.edad}
                                    onChange={(e) => handleInputChange('edad', e.target.value)}
                                    className="input-progreso"
                                    placeholder="28"
                                />
                                <span className="unidad-badge">años</span>
                            </div>
                        </div>

                        <div className="objetivo-actualizar">
                            <label>Género</label>
                            <select
                                value={perfil.genero}
                                onChange={(e) => handleInputChange('genero', e.target.value)}
                                className="input-progreso"
                                style={{ width: '100%' }}
                            >
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Medidas Corporales */}
                <div className="objetivos-actions" style={{ marginTop: '2rem' }}>
                    <h2 className="section-title">Medidas Corporales (cm)</h2>
                </div>

                <div className="objetivos-grid">
                    {/* Card Torso */}
                    <div className="objetivo-card">
                        <div className="objetivo-header">
                            <div className="objetivo-info">
                                <div className="categoria-icon bg-red-500">💪</div>
                                <h3 className="objetivo-titulo">Torso</h3>
                            </div>
                        </div>

                        <div className="objetivo-actualizar">
                            <label>Cuello</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    value={perfil.medidas.cuello}
                                    onChange={(e) => handleMedidaChange('cuello', e.target.value)}
                                    className="input-progreso"
                                    step="0.1"
                                    placeholder="38"
                                />
                                <span className="unidad-badge">cm</span>
                            </div>
                        </div>

                        <div className="objetivo-actualizar">
                            <label>Pecho</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    value={perfil.medidas.pecho}
                                    onChange={(e) => handleMedidaChange('pecho', e.target.value)}
                                    className="input-progreso"
                                    step="0.1"
                                    placeholder="95"
                                />
                                <span className="unidad-badge">cm</span>
                            </div>
                        </div>

                        <div className="objetivo-actualizar">
                            <label>Cintura</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    value={perfil.medidas.cintura}
                                    onChange={(e) => handleMedidaChange('cintura', e.target.value)}
                                    className="input-progreso"
                                    step="0.1"
                                    placeholder="85"
                                />
                                <span className="unidad-badge">cm</span>
                            </div>
                        </div>

                        <div className="objetivo-actualizar">
                            <label>Cadera</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    value={perfil.medidas.cadera}
                                    onChange={(e) => handleMedidaChange('cadera', e.target.value)}
                                    className="input-progreso"
                                    step="0.1"
                                    placeholder="100"
                                />
                                <span className="unidad-badge">cm</span>
                            </div>
                        </div>
                    </div>

                    {/* Card Brazos */}
                    <div className="objetivo-card">
                        <div className="objetivo-header">
                            <div className="objetivo-info">
                                <div className="categoria-icon bg-green-500">💪</div>
                                <h3 className="objetivo-titulo">Brazos</h3>
                            </div>
                        </div>

                        <div className="objetivo-actualizar">
                            <label>Brazo Izquierdo</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    value={perfil.medidas.brazoIzq}
                                    onChange={(e) => handleMedidaChange('brazoIzq', e.target.value)}
                                    className="input-progreso"
                                    step="0.1"
                                    placeholder="35"
                                />
                                <span className="unidad-badge">cm</span>
                            </div>
                        </div>

                        <div className="objetivo-actualizar">
                            <label>Brazo Derecho</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    value={perfil.medidas.brazoDer}
                                    onChange={(e) => handleMedidaChange('brazoDer', e.target.value)}
                                    className="input-progreso"
                                    step="0.1"
                                    placeholder="35"
                                />
                                <span className="unidad-badge">cm</span>
                            </div>
                        </div>

                        <div className="objetivo-actualizar">
                            <label>Antebrazo Izquierdo</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    value={perfil.medidas.antebrazoIzq}
                                    onChange={(e) => handleMedidaChange('antebrazoIzq', e.target.value)}
                                    className="input-progreso"
                                    step="0.1"
                                    placeholder="28"
                                />
                                <span className="unidad-badge">cm</span>
                            </div>
                        </div>

                        <div className="objetivo-actualizar">
                            <label>Antebrazo Derecho</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    value={perfil.medidas.antebrazoDer}
                                    onChange={(e) => handleMedidaChange('antebrazoDer', e.target.value)}
                                    className="input-progreso"
                                    step="0.1"
                                    placeholder="28"
                                />
                                <span className="unidad-badge">cm</span>
                            </div>
                        </div>
                    </div>

                    {/* Card Piernas */}
                    <div className="objetivo-card">
                        <div className="objetivo-header">
                            <div className="objetivo-info">
                                <div className="categoria-icon bg-purple-500">🦵</div>
                                <h3 className="objetivo-titulo">Piernas</h3>
                            </div>
                        </div>

                        <div className="objetivo-actualizar">
                            <label>Muslo Izquierdo</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    value={perfil.medidas.musloIzq}
                                    onChange={(e) => handleMedidaChange('musloIzq', e.target.value)}
                                    className="input-progreso"
                                    step="0.1"
                                    placeholder="55"
                                />
                                <span className="unidad-badge">cm</span>
                            </div>
                        </div>

                        <div className="objetivo-actualizar">
                            <label>Muslo Derecho</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    value={perfil.medidas.musloDer}
                                    onChange={(e) => handleMedidaChange('musloDer', e.target.value)}
                                    className="input-progreso"
                                    step="0.1"
                                    placeholder="55"
                                />
                                <span className="unidad-badge">cm</span>
                            </div>
                        </div>

                        <div className="objetivo-actualizar">
                            <label>Pantorrilla Izquierda</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    value={perfil.medidas.pantorrillaIzq}
                                    onChange={(e) => handleMedidaChange('pantorrillaIzq', e.target.value)}
                                    className="input-progreso"
                                    step="0.1"
                                    placeholder="38"
                                />
                                <span className="unidad-badge">cm</span>
                            </div>
                        </div>

                        <div className="objetivo-actualizar">
                            <label>Pantorrilla Derecha</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    value={perfil.medidas.pantorrillaDer}
                                    onChange={(e) => handleMedidaChange('pantorrillaDer', e.target.value)}
                                    className="input-progreso"
                                    step="0.1"
                                    placeholder="38"
                                />
                                <span className="unidad-badge">cm</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón Guardar Footer */}
                <div className="objetivos-actions" style={{ marginTop: '2rem' }}>
                    <button
                        onClick={guardarPerfil}
                        disabled={saving}
                        className="btn-add-objetivo"
                        style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}
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