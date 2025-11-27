"""
Rutas del API para el módulo de Perfil Corporal
Maneja datos corporales, medidas y historial de progreso
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, PerfilCorporal, HistorialProgreso
from datetime import datetime
from sqlalchemy.exc import IntegrityError

# ========== CREAR BLUEPRINT ==========
perfil_bp = Blueprint('perfil', __name__)

# ========== OBTENER PERFIL CORPORAL ==========


@perfil_bp.route('/', methods=['GET'])
@jwt_required()
def get_perfil():
    """
    Obtiene el perfil corporal del usuario autenticado
    GET /api/perfil
    Headers: Authorization: Bearer <token>
    Returns: Perfil con datos básicos y medidas
    """
    try:
        # Obtener ID del usuario
        usuario_id = get_jwt_identity()

        # Buscar perfil (crear uno si no existe)
        perfil = PerfilCorporal.query.filter_by(usuario_id=usuario_id).first()

        if not perfil:
            # Crear perfil vacío si no existe
            perfil = PerfilCorporal(usuario_id=usuario_id)
            db.session.add(perfil)
            db.session.commit()

        return jsonify(perfil.to_dict()), 200

    except Exception as e:
        print(f"Error al obtener perfil: {str(e)}")
        return jsonify({'success': False, 'message': 'Error al cargar perfil'}), 500


# ========== ACTUALIZAR PERFIL CORPORAL ==========
@perfil_bp.route('/', methods=['PUT'])
@jwt_required()
def update_perfil():
    """
    Actualiza el perfil corporal del usuario
    PUT /api/perfil
    Headers: Authorization: Bearer <token>
    Body (JSON):
    {
        "peso": 75.5,
        "altura": 175,
        "edad": 28,
        "genero": "masculino",
        "medidas": {
            "cuello": 38,
            "pecho": 95,
            ...
        }
    }
    """
    try:
        # Obtener ID del usuario
        usuario_id = get_jwt_identity()

        # Buscar o crear perfil
        perfil = PerfilCorporal.query.filter_by(usuario_id=usuario_id).first()
        if not perfil:
            perfil = PerfilCorporal(usuario_id=usuario_id)
            db.session.add(perfil)

        # Obtener datos del request
        data = request.get_json()

        # Actualizar datos básicos
        if 'peso' in data:
            perfil.peso = float(data['peso'])
        if 'altura' in data:
            perfil.altura = int(data['altura'])
        if 'edad' in data:
            perfil.edad = int(data['edad'])
        if 'genero' in data:
            perfil.genero = data['genero']

        # Actualizar medidas corporales
        if 'medidas' in data:
            medidas = data['medidas']
            if 'cuello' in medidas:
                perfil.cuello = float(medidas['cuello'])
            if 'pecho' in medidas:
                perfil.pecho = float(medidas['pecho'])
            if 'cintura' in medidas:
                perfil.cintura = float(medidas['cintura'])
            if 'cadera' in medidas:
                perfil.cadera = float(medidas['cadera'])
            if 'musloIzq' in medidas:
                perfil.muslo_izq = float(medidas['musloIzq'])
            if 'musloDer' in medidas:
                perfil.muslo_der = float(medidas['musloDer'])
            if 'pantorrillaIzq' in medidas:
                perfil.pantorrilla_izq = float(medidas['pantorrillaIzq'])
            if 'pantorrillaDer' in medidas:
                perfil.pantorrilla_der = float(medidas['pantorrillaDer'])
            if 'brazoIzq' in medidas:
                perfil.brazo_izq = float(medidas['brazoIzq'])
            if 'brazoDer' in medidas:
                perfil.brazo_der = float(medidas['brazoDer'])
            if 'antebrazoIzq' in medidas:
                perfil.antebrazo_izq = float(medidas['antebrazoIzq'])
            if 'antebrazoDer' in medidas:
                perfil.antebrazo_der = float(medidas['antebrazoDer'])

        # Actualizar fecha de registro
        perfil.fecha_registro = datetime.utcnow()

        # Guardar cambios
        db.session.commit()

        return jsonify(perfil.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error al actualizar perfil: {str(e)}")
        return jsonify({'success': False, 'message': 'Error al actualizar perfil'}), 500


# ========== OBTENER HISTORIAL DE PROGRESO ==========
@perfil_bp.route('/historial', methods=['GET'])
@jwt_required()
def get_historial():
    """
    Obtiene el historial de progreso del usuario
    GET /api/perfil/historial
    Headers: Authorization: Bearer <token>
    Returns: Lista de registros históricos ordenados por fecha
    """
    try:
        # Obtener ID del usuario
        usuario_id = get_jwt_identity()

        # Consultar historial ordenado por fecha
        historial = HistorialProgreso.query.filter_by(usuario_id=usuario_id)\
            .order_by(HistorialProgreso.fecha.asc()).all()

        # Convertir a diccionario
        historial_dict = [registro.to_dict() for registro in historial]

        return jsonify(historial_dict), 200

    except Exception as e:
        print(f"Error al obtener historial: {str(e)}")
        return jsonify({'success': False, 'message': 'Error al cargar historial'}), 500


# ========== AGREGAR REGISTRO AL HISTORIAL ==========
@perfil_bp.route('/historial', methods=['POST'])
@jwt_required()
def add_registro_historial():
    """
    Agrega un nuevo registro al historial de progreso
    POST /api/perfil/historial
    Headers: Authorization: Bearer <token>
    Body (JSON):
    {
        "fecha": "2025-01-15",
        "peso": 75.5,
        "grasaCorporal": 18.5,
        "musculo": 65.0,
        "imc": 24.7
    }
    """
    try:
        # Obtener ID del usuario
        usuario_id = get_jwt_identity()

        # Obtener datos del request
        data = request.get_json()

        # Validar campo peso (requerido)
        if 'peso' not in data or 'fecha' not in data:
            return jsonify({'success': False, 'message': 'Peso y fecha son requeridos'}), 400

        # Convertir fecha
        fecha = datetime.strptime(data['fecha'], '%Y-%m-%d').date()

        # Crear nuevo registro
        nuevo_registro = HistorialProgreso(
            usuario_id=usuario_id,
            fecha=fecha,
            peso=float(data['peso']),
            grasa_corporal=float(data.get('grasaCorporal', 0)),
            musculo=float(data.get('musculo', 0)),
            imc=float(data.get('imc', 0))
        )

        # Guardar en base de datos
        db.session.add(nuevo_registro)
        db.session.commit()

        return jsonify(nuevo_registro.to_dict()), 201

    except ValueError as ve:
        return jsonify({'success': False, 'message': 'Formato de fecha inválido'}), 400
    except Exception as e:
        db.session.rollback()
        print(f"Error al agregar registro: {str(e)}")
        return jsonify({'success': False, 'message': 'Error al agregar registro'}), 500
