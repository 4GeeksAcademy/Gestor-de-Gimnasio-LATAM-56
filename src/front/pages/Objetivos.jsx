import React, { useState } from 'react';
import { Target, TrendingUp, Award, Plus, X, Trash2, CheckCircle, Check, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../Objetivos.css';

const Objetivos = () => {
    const navigate = useNavigate();

    const [objetivos, setObjetivos] = useState([
        {
            id: 1,
            titulo: "Perder 10 kg",
            categoria: "peso",
            meta: 10,
            actual: 6,
            unidad: "kg",
            fechaInicio: "2025-01-01",
            fechaMeta: "2025-04-01",
            completado: false
        },
        {
            id: 2,
            titulo: "Correr 5k en 25 min",
            categoria: "resistencia",
            meta: 25,
            actual: 28,
            unidad: "min",
            fechaInicio: "2025-01-15",
            fechaMeta: "2025-03-15",
            completado: false
        },
        {
            id: 3,
            titulo: "Press de Banca 100kg",
            categoria: "fuerza",
            meta: 100,
            actual: 85,
            unidad: "kg",
            fechaInicio: "2025-01-10",
            fechaMeta: "2025-06-01",
            completado: false
        }
    ]);

    const [modalAbierto, setModalAbierto] = useState(false);
    const [nuevoObjetivo, setNuevoObjetivo] = useState({
        titulo: '',
        categoria: 'peso',
        meta: '',
        actual: '',
        unidad: 'kg',
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaMeta: ''
    });

    const categorias = {
        peso: { color: 'bg-blue-500', icon: '⚖️', nombre: 'Peso' },
        fuerza: { color: 'bg-red-500', icon: '💪', nombre: 'Fuerza' },
        resistencia: { color: 'bg-green-500', icon: '🏃', nombre: 'Resistencia' },
        flexibilidad: { color: 'bg-purple-500', icon: '🧘', nombre: 'Flexibilidad' },
        habitos: { color: 'bg-yellow-500', icon: '✅', nombre: 'Hábitos' }
    };

    const calcularProgreso = (obj) => {
        if (obj.categoria === 'resistencia') {
            const progreso = Math.max(0, ((obj.actual - obj.meta) / obj.actual) * 100);
            return Math.min(100, 100 - progreso);
        }
        return Math.min(100, (obj.actual / obj.meta) * 100);
    };

    const agregarObjetivo = () => {
        if (nuevoObjetivo.titulo && nuevoObjetivo.meta && nuevoObjetivo.actual) {
            setObjetivos([...objetivos, {
                ...nuevoObjetivo,
                id: Date.now(),
                completado: false,
                meta: parseFloat(nuevoObjetivo.meta),
                actual: parseFloat(nuevoObjetivo.actual)
            }]);
            setModalAbierto(false);
            setNuevoObjetivo({
                titulo: '',
                categoria: 'peso',
                meta: '',
                actual: '',
                unidad: 'kg',
                fechaInicio: new Date().toISOString().split('T')[0],
                fechaMeta: ''
            });
        }
    };

    const eliminarObjetivo = (id) => {
        setObjetivos(objetivos.filter(obj => obj.id !== id));
    };

    const actualizarProgreso = (id, nuevoValor) => {
        setObjetivos(objetivos.map(obj => {
            if (obj.id === id) {
                const actualizado = { ...obj, actual: parseFloat(nuevoValor) };
                const progreso = calcularProgreso(actualizado);
                if (progreso >= 100) {
                    actualizado.completado = true;
                }
                return actualizado;
            }
            return obj;
        }));
    };

    const marcarComoCompletado = (id) => {
        setObjetivos(objetivos.map(obj => {
            if (obj.id === id) {
                return { ...obj, completado: !obj.completado };
            }
            return obj;
        }));
    };

    const progresoGlobal = objetivos.length > 0
        ? objetivos.reduce((sum, obj) => sum + calcularProgreso(obj), 0) / objetivos.length
        : 0;

    const objetivosCompletados = objetivos.filter(obj => obj.completado).length;

    return (
        <div className="objetivos-container">
            <div className="objetivos-wrapper">
                {/* Header con botón */}
                <div className="objetivos-header-with-button">
                    <div className="objetivos-header-content">
                        <h1 className="objetivos-title">
                            <Target className="icon-large" />
                            Mis Objetivos
                        </h1>
                        <p className="objetivos-subtitle">Establece metas y alcanza tu mejor versión</p>
                    </div>
                    <button
                        className="btn-perfil-corporal-main"
                        onClick={() => navigate('/perfil-corporal')}
                    >
                        <User className="icon-small" />
                        <span>Mi Perfil Corporal</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card stat-blue">
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">Progreso Global</p>
                                <p className="stat-value">{Math.round(progresoGlobal)}%</p>
                            </div>
                            <TrendingUp className="stat-icon" />
                        </div>
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${progresoGlobal}%` }}
                            />
                        </div>
                    </div>

                    <div className="stat-card stat-green">
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">Completados</p>
                                <p className="stat-value">{objetivosCompletados}/{objetivos.length}</p>
                            </div>
                            <CheckCircle className="stat-icon" />
                        </div>
                        <div className="stat-text">
                            <p>{objetivosCompletados > 0 ? '¡Excelente trabajo!' : 'Comienza tu primera meta'}</p>
                        </div>
                    </div>

                    <div className="stat-card stat-purple">
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">Objetivos Activos</p>
                                <p className="stat-value">{objetivos.length - objetivosCompletados}</p>
                            </div>
                            <Award className="stat-icon" />
                        </div>
                        <div className="stat-text">
                            <p>Sigue así, ¡vas por buen camino!</p>
                        </div>
                    </div>
                </div>

                {/* Botón Agregar */}
                <div className="objetivos-actions">
                    <h2 className="section-title">Tus Objetivos</h2>
                    <button
                        onClick={() => setModalAbierto(true)}
                        className="btn-add-objetivo"
                    >
                        <Plus className="icon-small" />
                        Nuevo Objetivo
                    </button>
                </div>

                {/* Lista de Objetivos */}
                <div className="objetivos-grid">
                    {objetivos.map(obj => {
                        const progreso = calcularProgreso(obj);
                        const cat = categorias[obj.categoria];

                        return (
                            <div
                                key={obj.id}
                                className={`objetivo-card ${obj.completado ? 'objetivo-completado' : ''}`}
                            >
                                {obj.completado && (
                                    <div className="badge-completado">
                                        <CheckCircle className="icon-small" />
                                        ¡COMPLETADO!
                                    </div>
                                )}

                                <div className="objetivo-header">
                                    <div className="objetivo-info">
                                        <div className={`categoria-icon ${cat.color}`}>
                                            {cat.icon}
                                        </div>
                                        <div>
                                            <h3 className="objetivo-titulo">{obj.titulo}</h3>
                                            <span className="categoria-nombre">{cat.nombre}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => eliminarObjetivo(obj.id)}
                                        className="btn-delete"
                                    >
                                        <Trash2 className="icon-small" />
                                    </button>
                                </div>

                                <div className="objetivo-progreso">
                                    <div className="progreso-labels">
                                        <span>Progreso</span>
                                        <span className="progreso-porcentaje">{Math.round(progreso)}%</span>
                                    </div>
                                    <div className="progreso-bar-bg">
                                        <div
                                            className={`progreso-bar ${cat.color}`}
                                            style={{ width: `${progreso}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="objetivo-actualizar">
                                    <label>Actualizar progreso:</label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            value={obj.actual}
                                            onChange={(e) => actualizarProgreso(obj.id, e.target.value)}
                                            className="input-progreso"
                                            step="0.1"
                                            disabled={obj.completado}
                                        />
                                        <span className="unidad-badge">{obj.unidad}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => marcarComoCompletado(obj.id)}
                                    className={`btn-completar ${obj.completado ? 'btn-desmarcar' : ''}`}
                                >
                                    <Check className="icon-small" />
                                    {obj.completado ? 'Desmarcar como completado' : 'Marcar como completado'}
                                </button>

                                <div className="objetivo-footer">
                                    <div>
                                        <span className="footer-label">Meta</span>
                                        <span className="footer-value">{obj.meta} {obj.unidad}</span>
                                    </div>
                                    <div className="footer-right">
                                        <span className="footer-label">Fecha límite</span>
                                        <span className="footer-value">{new Date(obj.fechaMeta).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {objetivos.length === 0 && (
                    <div className="empty-state">
                        <Target className="empty-icon" />
                        <h3 className="empty-title">No tienes objetivos aún</h3>
                        <p className="empty-text">¡Crea tu primer objetivo y comienza tu transformación!</p>
                        <button
                            onClick={() => setModalAbierto(true)}
                            className="btn-add-objetivo"
                        >
                            <Plus className="icon-small" />
                            Crear Primer Objetivo
                        </button>
                    </div>
                )}

                {/* Modal Agregar Objetivo */}
                {modalAbierto && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">Nuevo Objetivo</h3>
                                <button
                                    onClick={() => setModalAbierto(false)}
                                    className="btn-close-modal"
                                >
                                    <X className="icon-small" />
                                </button>
                            </div>

                            <div className="modal-form">
                                <div className="form-group">
                                    <label>Título</label>
                                    <input
                                        type="text"
                                        value={nuevoObjetivo.titulo}
                                        onChange={(e) => setNuevoObjetivo({ ...nuevoObjetivo, titulo: e.target.value })}
                                        placeholder="Ej: Perder 5 kg"
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Categoría</label>
                                    <select
                                        value={nuevoObjetivo.categoria}
                                        onChange={(e) => setNuevoObjetivo({ ...nuevoObjetivo, categoria: e.target.value })}
                                        className="form-input"
                                    >
                                        {Object.entries(categorias).map(([key, val]) => (
                                            <option key={key} value={key}>{val.icon} {val.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Valor Actual</label>
                                        <input
                                            type="number"
                                            value={nuevoObjetivo.actual}
                                            onChange={(e) => setNuevoObjetivo({ ...nuevoObjetivo, actual: e.target.value })}
                                            className="form-input"
                                            step="0.1"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Meta</label>
                                        <input
                                            type="number"
                                            value={nuevoObjetivo.meta}
                                            onChange={(e) => setNuevoObjetivo({ ...nuevoObjetivo, meta: e.target.value })}
                                            className="form-input"
                                            step="0.1"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Unidad</label>
                                    <select
                                        value={nuevoObjetivo.unidad}
                                        onChange={(e) => setNuevoObjetivo({ ...nuevoObjetivo, unidad: e.target.value })}
                                        className="form-input"
                                    >
                                        <option value="kg">kg</option>
                                        <option value="min">minutos</option>
                                        <option value="reps">repeticiones</option>
                                        <option value="días">días</option>
                                        <option value="cm">cm</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Fecha Límite</label>
                                    <input
                                        type="date"
                                        value={nuevoObjetivo.fechaMeta}
                                        onChange={(e) => setNuevoObjetivo({ ...nuevoObjetivo, fechaMeta: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={agregarObjetivo}
                                className="btn-crear-objetivo"
                            >
                                Crear Objetivo
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Objetivos;