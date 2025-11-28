import React, { useState, useEffect } from 'react';
import { User, Scale, Ruler, Calendar, TrendingUp, Save, Edit2, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from "../components/BackendURL.jsx";
import '../PerfilCorporal.css';

const PerfilCorporal = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [perfilActual, setPerfilActual] = useState({
        peso: 0,
        altura: 0,
        edad: 0,
        genero: 'masculino',
        fechaRegistro: new Date().toISOString().split('T')[0]
    });

    const [medidas, setMedidas] = useState({
        cuello: 0,
        pecho: 0,
        cintura: 0,
        cadera: 0,
        musloIzq: 0,
        musloDer: 0,
        pantorrillaIzq: 0,
        pantorrillaDer: 0,
        brazoIzq: 0,
        brazoDer: 0,
        antebrazoDer: 0,
        antebrazoIzq: 0
    });

    const [historial, setHistorial] = useState([]);

    const [editando, setEditando] = useState(false);
    const [modalHistorial, setModalHistorial] = useState(false);
    const [nuevoRegistro, setNuevoRegistro] = useState({
        fecha: new Date().toISOString().split('T')[0],
        peso: '',
        grasaCorporal: '',
        musculo: '',
        imc: ''
    });

    // ========== CARGAR DATOS AL INICIO ==========
    useEffect(() => {
        cargarPerfil();
        cargarHistorial();
    }, []);

    // ========== CARGAR PERFIL ==========
    const cargarPerfil = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('⚠️ Debes iniciar sesión');
                navigate('/login');
                return;
            }

            const response = await fetch(`${BACKEND_URL}/api/perfil/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                alert('⚠️ Sesión expirada. Inicia sesión nuevamente.');
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            const data = await response.json();

            if (response.ok) {
                setPerfilActual({
                    peso: data.peso || 0,
                    altura: data.altura || 0,
                    edad: data.edad || 0,
                    genero: data.genero || 'masculino',
                    fechaRegistro: data.fechaRegistro || new Date().toISOString().split('T')[0]
                });

                if (data.medidas) {
                    setMedidas({
                        cuello: data.medidas.cuello || 0,
                        pecho: data.medidas.pecho || 0,
                        cintura: data.medidas.cintura || 0,
                        cadera: data.medidas.cadera || 0,
                        musloIzq: data.medidas.musloIzq || 0,
                        musloDer: data.medidas.musloDer || 0,
                        pantorrillaIzq: data.medidas.pantorrillaIzq || 0,
                        pantorrillaDer: data.medidas.pantorrillaDer || 0,
                        brazoIzq: data.medidas.brazoIzq || 0,
                        brazoDer: data.medidas.brazoDer || 0,
                        antebrazoIzq: data.medidas.antebrazoIzq || 0,
                        antebrazoDer: data.medidas.antebrazoDer || 0
                    });
                }
            }
        } catch (error) {
            console.error('Error al cargar perfil:', error);
            alert('❌ Error al cargar perfil. Verifica tu conexión.');
        } finally {
            setLoading(false);
        }
    };

    // ========== CARGAR HISTORIAL ==========
    const cargarHistorial = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${BACKEND_URL}/api/perfil/historial`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setHistorial(data);
            }
        } catch (error) {
            console.error('Error al cargar historial:', error);
        }
    };

    // ========== GUARDAR PERFIL ==========
    const handleSavePerfil = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${BACKEND_URL}/api/perfil/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    peso: perfilActual.peso,
                    altura: perfilActual.altura,
                    edad: perfilActual.edad,
                    genero: perfilActual.genero,
                    medidas: {
                        cuello: medidas.cuello,
                        pecho: medidas.pecho,
                        cintura: medidas.cintura,
                        cadera: medidas.cadera,
                        musloIzq: medidas.musloIzq,
                        musloDer: medidas.musloDer,
                        pantorrillaIzq: medidas.pantorrillaIzq,
                        pantorrillaDer: medidas.pantorrillaDer,
                        brazoIzq: medidas.brazoIzq,
                        brazoDer: medidas.brazoDer,
                        antebrazoIzq: medidas.antebrazoIzq,
                        antebrazoDer: medidas.antebrazoDer
                    }
                })
            });

            if (response.ok) {
                alert('✅ Perfil actualizado exitosamente');
                setEditando(false);
                cargarPerfil(); // Recargar datos
            } else {
                alert('❌ Error al guardar perfil');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error de conexión al guardar perfil');
        }
    };

    // ========== AGREGAR REGISTRO HISTORIAL ==========
    const agregarRegistroHistorial = async () => {
        if (!nuevoRegistro.peso || !nuevoRegistro.fecha) {
            alert('⚠️ El peso y la fecha son obligatorios');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const alturaMetros = perfilActual.altura / 100;
            const imcCalculado = (parseFloat(nuevoRegistro.peso) / (alturaMetros * alturaMetros)).toFixed(1);

            const response = await fetch(`${BACKEND_URL}/api/perfil/historial`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fecha: nuevoRegistro.fecha,
                    peso: parseFloat(nuevoRegistro.peso),
                    grasaCorporal: parseFloat(nuevoRegistro.grasaCorporal) || 0,
                    musculo: parseFloat(nuevoRegistro.musculo) || 0,
                    imc: parseFloat(imcCalculado)
                })
            });

            if (response.ok) {
                alert('✅ Registro agregado exitosamente');
                setNuevoRegistro({
                    fecha: new Date().toISOString().split('T')[0],
                    peso: '',
                    grasaCorporal: '',
                    musculo: '',
                    imc: ''
                });
                setModalHistorial(false);
                cargarHistorial(); // Recargar historial
            } else {
                const data = await response.json();
                alert('❌ Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error de conexión al agregar registro');
        }
    };

    // ========== CÁLCULOS ==========
    const calcularIMC = () => {
        if (perfilActual.altura === 0) return 0;
        const alturaMetros = perfilActual.altura / 100;
        return (perfilActual.peso / (alturaMetros * alturaMetros)).toFixed(1);
    };

    const obtenerCategoriaIMC = (imc) => {
        if (imc < 18.5) return { texto: 'Bajo peso', color: '#3b82f6' };
        if (imc < 25) return { texto: 'Normal', color: '#22c55e' };
        if (imc < 30) return { texto: 'Sobrepeso', color: '#f59e0b' };
        return { texto: 'Obesidad', color: '#ef4444' };
    };

    const imc = calcularIMC();
    const categoriaIMC = obtenerCategoriaIMC(imc);
    const ultimoPeso = historial.length > 0 ? historial[historial.length - 1].peso : perfilActual.peso;
    const diferenciaPeso = perfilActual.peso - ultimoPeso;

    // ========== LOADING STATE ==========
    if (loading) {
        return (
            <div className="perfil-corporal-container">
                <div className="text-center text-white">
                    <h2>Cargando perfil...</h2>
                </div>
            </div>
        );
    }

    // ========== RENDER ==========
    return (
        <div className="perfil-corporal-container">
            <div className="perfil-wrapper">
                {/* Header */}
                <div className="perfil-header">
                    <div>
                        <h1 className="perfil-title">
                            <User className="title-icon" />
                            Perfil Corporal
                        </h1>
                        <p className="perfil-subtitle">Registra y monitorea tus medidas corporales</p>
                    </div>
                    <button
                        className="btn-editar-perfil"
                        onClick={() => setEditando(!editando)}
                    >
                        {editando ? <X size={20} /> : <Edit2 size={20} />}
                        {editando ? 'Cancelar' : 'Editar'}
                    </button>
                </div>

                {/* Stats Rápidas */}
                <div className="stats-rapidas">
                    <div className="stat-card-rapida peso">
                        <Scale className="stat-icon-rapida" />
                        <div className="stat-info">
                            <span className="stat-label-rapida">Peso Actual</span>
                            <span className="stat-value-rapida">{perfilActual.peso} kg</span>
                            {diferenciaPeso !== 0 && (
                                <span className={`stat-cambio ${diferenciaPeso < 0 ? 'positivo' : 'negativo'}`}>
                                    {diferenciaPeso > 0 ? '+' : ''}{diferenciaPeso.toFixed(1)} kg
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="stat-card-rapida altura">
                        <Ruler className="stat-icon-rapida" />
                        <div className="stat-info">
                            <span className="stat-label-rapida">Altura</span>
                            <span className="stat-value-rapida">{perfilActual.altura} cm</span>
                        </div>
                    </div>

                    <div className="stat-card-rapida imc">
                        <TrendingUp className="stat-icon-rapida" />
                        <div className="stat-info">
                            <span className="stat-label-rapida">IMC</span>
                            <span className="stat-value-rapida">{imc}</span>
                            <span className="stat-categoria" style={{ color: categoriaIMC.color }}>
                                {categoriaIMC.texto}
                            </span>
                        </div>
                    </div>

                    <div className="stat-card-rapida fecha">
                        <Calendar className="stat-icon-rapida" />
                        <div className="stat-info">
                            <span className="stat-label-rapida">Última Actualización</span>
                            <span className="stat-value-rapida">
                                {new Date(perfilActual.fechaRegistro).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Datos Básicos */}
                <div className="seccion-datos">
                    <h2 className="seccion-titulo">Datos Básicos</h2>
                    <div className="datos-grid">
                        <div className="dato-item">
                            <label>Peso (kg)</label>
                            <input
                                type="number"
                                value={perfilActual.peso}
                                onChange={(e) => setPerfilActual({ ...perfilActual, peso: parseFloat(e.target.value) || 0 })}
                                disabled={!editando}
                                className="dato-input"
                                step="0.1"
                            />
                        </div>

                        <div className="dato-item">
                            <label>Altura (cm)</label>
                            <input
                                type="number"
                                value={perfilActual.altura}
                                onChange={(e) => setPerfilActual({ ...perfilActual, altura: parseInt(e.target.value) || 0 })}
                                disabled={!editando}
                                className="dato-input"
                            />
                        </div>

                        <div className="dato-item">
                            <label>Edad</label>
                            <input
                                type="number"
                                value={perfilActual.edad}
                                onChange={(e) => setPerfilActual({ ...perfilActual, edad: parseInt(e.target.value) || 0 })}
                                disabled={!editando}
                                className="dato-input"
                            />
                        </div>

                        <div className="dato-item">
                            <label>Género</label>
                            <select
                                value={perfilActual.genero}
                                onChange={(e) => setPerfilActual({ ...perfilActual, genero: e.target.value })}
                                disabled={!editando}
                                className="dato-input"
                            >
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Medidas Corporales */}
                <div className="seccion-datos">
                    <h2 className="seccion-titulo">Medidas Corporales (cm)</h2>

                    {/* Tren Superior */}
                    <h3 className="subseccion-titulo">Tren Superior</h3>
                    <div className="medidas-grid">
                        <div className="medida-item">
                            <label>Cuello</label>
                            <input
                                type="number"
                                value={medidas.cuello}
                                onChange={(e) => setMedidas({ ...medidas, cuello: parseFloat(e.target.value) || 0 })}
                                disabled={!editando}
                                className="medida-input"
                                step="0.5"
                            />
                        </div>

                        <div className="medida-item">
                            <label>Pecho</label>
                            <input
                                type="number"
                                value={medidas.pecho}
                                onChange={(e) => setMedidas({ ...medidas, pecho: parseFloat(e.target.value) || 0 })}
                                disabled={!editando}
                                className="medida-input"
                                step="0.5"
                            />
                        </div>

                        <div className="medida-item">
                            <label>Cintura</label>
                            <input
                                type="number"
                                value={medidas.cintura}
                                onChange={(e) => setMedidas({ ...medidas, cintura: parseFloat(e.target.value) || 0 })}
                                disabled={!editando}
                                className="medida-input"
                                step="0.5"
                            />
                        </div>

                        <div className="medida-item">
                            <label>Cadera</label>
                            <input
                                type="number"
                                value={medidas.cadera}
                                onChange={(e) => setMedidas({ ...medidas, cadera: parseFloat(e.target.value) || 0 })}
                                disabled={!editando}
                                className="medida-input"
                                step="0.5"
                            />
                        </div>
                    </div>

                    {/* Brazos */}
                    <h3 className="subseccion-titulo">Brazos</h3>
                    <div className="medidas-grid">
                        <div className="medida-item">
                            <label>Brazo Izquierdo</label>
                            <input
                                type="number"
                                value={medidas.brazoIzq}
                                onChange={(e) => setMedidas({ ...medidas, brazoIzq: parseFloat(e.target.value) || 0 })}
                                disabled={!editando}
                                className="medida-input"
                                step="0.5"
                            />
                        </div>

                        <div className="medida-item">
                            <label>Brazo Derecho</label>
                            <input
                                type="number"
                                value={medidas.brazoDer}
                                onChange={(e) => setMedidas({ ...medidas, brazoDer: parseFloat(e.target.value) || 0 })}
                                disabled={!editando}
                                className="medida-input"
                                step="0.5"
                            />
                        </div>

                        <div className="medida-item">
                            <label>Antebrazo Izquierdo</label>
                            <input
                                type="number"
                                value={medidas.antebrazoIzq}
                                onChange={(e) => setMedidas({ ...medidas, antebrazoIzq: parseFloat(e.target.value) || 0 })}
                                disabled={!editando}
                                className="medida-input"
                                step="0.5"
                            />
                        </div>

                        <div className="medida-item">
                            <label>Antebrazo Derecho</label>
                            <input
                                type="number"
                                value={medidas.antebrazoDer}
                                onChange={(e) => setMedidas({ ...medidas, antebrazoDer: parseFloat(e.target.value) || 0 })}
                                disabled={!editando}
                                className="medida-input"
                                step="0.5"
                            />
                        </div>
                    </div>

                    {/* Piernas */}
                    <h3 className="subseccion-titulo">Piernas</h3>
                    <div className="medidas-grid">
                        <div className="medida-item">
                            <label>Muslo Izquierdo</label>
                            <input
                                type="number"
                                value={medidas.musloIzq}
                                onChange={(e) => setMedidas({ ...medidas, musloIzq: parseFloat(e.target.value) || 0 })}
                                disabled={!editando}
                                className="medida-input"
                                step="0.5"
                            />
                        </div>

                        <div className="medida-item">
                            <label>Muslo Derecho</label>
                            <input
                                type="number"
                                value={medidas.musloDer}
                                onChange={(e) => setMedidas({ ...medidas, musloDer: parseFloat(e.target.value) || 0 })}
                                disabled={!editando}
                                className="medida-input"
                                step="0.5"
                            />
                        </div>

                        <div className="medida-item">
                            <label>Pantorrilla Izquierda</label>
                            <input
                                type="number"
                                value={medidas.pantorrillaIzq}
                                onChange={(e) => setMedidas({ ...medidas, pantorrillaIzq: parseFloat(e.target.value) || 0 })}
                                disabled={!editando}
                                className="medida-input"
                                step="0.5"
                            />
                        </div>

                        <div className="medida-item">
                            <label>Pantorrilla Derecha</label>
                            <input
                                type="number"
                                value={medidas.pantorrillaDer}
                                onChange={(e) => setMedidas({ ...medidas, pantorrillaDer: parseFloat(e.target.value) || 0 })}
                                disabled={!editando}
                                className="medida-input"
                                step="0.5"
                            />
                        </div>
                    </div>

                    {editando && (
                        <button className="btn-guardar-perfil" onClick={handleSavePerfil}>
                            <Save size={20} />
                            Guardar Cambios
                        </button>
                    )}
                </div>

                {/* Historial de Progreso */}
                <div className="seccion-datos">
                    <div className="historial-header">
                        <h2 className="seccion-titulo">Historial de Progreso</h2>
                        <button className="btn-agregar-registro" onClick={() => setModalHistorial(true)}>
                            <Plus size={18} />
                            Nuevo Registro
                        </button>
                    </div>

                    {historial.length === 0 ? (
                        <div className="text-center text-white py-4">
                            <p>No hay registros en el historial. ¡Agrega el primero!</p>
                        </div>
                    ) : (
                        <div className="historial-tabla-container">
                            <table className="historial-tabla">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Peso (kg)</th>
                                        <th>Grasa (%)</th>
                                        <th>Músculo (kg)</th>
                                        <th>IMC</th>
                                        <th>Cambio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historial.map((registro, index) => {
                                        const cambio = index > 0 ? registro.peso - historial[index - 1].peso : 0;
                                        return (
                                            <tr key={registro.id}>
                                                <td>{new Date(registro.fecha).toLocaleDateString()}</td>
                                                <td>{registro.peso}</td>
                                                <td>{registro.grasaCorporal || '-'}</td>
                                                <td>{registro.musculo || '-'}</td>
                                                <td>{registro.imc}</td>
                                                <td>
                                                    {index > 0 && (
                                                        <span className={`cambio-badge ${cambio < 0 ? 'positivo' : 'negativo'}`}>
                                                            {cambio > 0 ? '+' : ''}{cambio.toFixed(1)}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal Nuevo Registro */}
                {modalHistorial && (
                    <div className="modal-overlay-perfil">
                        <div className="modal-historial">
                            <div className="modal-header-perfil">
                                <h3>Nuevo Registro de Progreso</h3>
                                <button onClick={() => setModalHistorial(false)} className="btn-close-perfil">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="modal-body-perfil">
                                <div className="form-group-perfil">
                                    <label>Fecha</label>
                                    <input
                                        type="date"
                                        value={nuevoRegistro.fecha}
                                        onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, fecha: e.target.value })}
                                        className="form-input-perfil"
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className="form-group-perfil">
                                    <label>Peso (kg) *</label>
                                    <input
                                        type="number"
                                        value={nuevoRegistro.peso}
                                        onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, peso: e.target.value })}
                                        className="form-input-perfil"
                                        step="0.1"
                                        placeholder="75.5"
                                    />
                                </div>

                                <div className="form-group-perfil">
                                    <label>Grasa Corporal (%)</label>
                                    <input
                                        type="number"
                                        value={nuevoRegistro.grasaCorporal}
                                        onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, grasaCorporal: e.target.value })}
                                        className="form-input-perfil"
                                        step="0.1"
                                        placeholder="18.5"
                                    />
                                </div>

                                <div className="form-group-perfil">
                                    <label>Músculo (kg)</label>
                                    <input
                                        type="number"
                                        value={nuevoRegistro.musculo}
                                        onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, musculo: e.target.value })}
                                        className="form-input-perfil"
                                        step="0.1"
                                        placeholder="65.0"
                                    />
                                </div>
                            </div>

                            <button className="btn-guardar-registro" onClick={agregarRegistroHistorial}>
                                <Save size={18} />
                                Guardar Registro
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PerfilCorporal;