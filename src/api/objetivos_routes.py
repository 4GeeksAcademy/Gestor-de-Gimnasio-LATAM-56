"""
Rutas del API para el módulo de Objetivos del Gimnasio
Maneja CRUD completo de objetivos personales de fitness
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, Objetivo
from datetime import datetime
from sqlalchemy.exc import IntegrityError

# ========== CREAR BLUEPRINT ==========
objetivos_bp = Blueprint('objetivos', __name__)

# ========== OBTENER TODOS LOS OBJETIVOS DEL USUARIO ==========
@objetivos_bp.route('/', methods=['GET'])
@jwt_required()
def get_objetivos():
    """
    Obtiene todos los objetivos del usuario autenticado
    GET /api/objetivos
    Headers: Authorization: Bearer <token>
    Returns: Lista de objetivos en formato JSON
    """
    try:
        # Obtener ID del usuario desde el token JWT
        usuario_id = get_jwt_identity()
        
        # Consultar objetivos del usuario
        objetivos = Objetivo.query.filter_by(usuario_id=usuario_id).all()
        
        # Convertir a diccionario
        objetivos_dict = [obj.to_dict() for obj in objetivos]
        
        return jsonify(objetivos_dict), 200
        
    except Exception as e:
        print(f"Error al obtener objetivos: {str(e)}")
        return jsonify({'success': False, 'message': 'Error al cargar objetivos'}), 500


# ========== CREAR NUEVO OBJETIVO ==========
@objetivos_bp.route('/', methods=['POST'])
@jwt_required()
def create_objetivo():
    """
    Crea un nuevo objetivo para el usuario
    POST /api/objetivos
    Headers: Authorization: Bearer <token>
    Body (JSON):
    {
        "titulo": "Perder 10kg",
        "categoria": "peso",
        "meta": 10,
        "actual": 0,
        "unidad": "kg",
        "fechaInicio": "2025-01-01",
        "fechaMeta": "2025-04-01"
    }
    """
    try:
        # Obtener ID del usuario
        usuario_id = get_jwt_identity()
        
        # Obtener datos del request
        data = request.get_json()
        
        # Validar campos requeridos
        campos_requeridos = ['titulo', 'categoria', 'meta', 'actual', 'unidad', 'fechaMeta']
        if not all(campo in data for campo in campos_requeridos):
            return jsonify({'success': False, 'message': 'Campos requeridos faltantes'}), 400
        
        # Convertir fechas de string a datetime
        fecha_inicio = datetime.strptime(data.get('fechaInicio', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d').date()
        fecha_meta = datetime.strptime(data['fechaMeta'], '%Y-%m-%d').date()
        
        # Crear nuevo objetivo
        nuevo_objetivo = Objetivo(
            usuario_id=usuario_id,
            titulo=data['titulo'],
            categoria=data['categoria'],
            meta=float(data['meta']),
            actual=float(data['actual']),
            unidad=data['unidad'],
            fecha_inicio=fecha_inicio,
            fecha_meta=fecha_meta,
            completado=False
        )
        
        # Guardar en base de datos
        db.session.add(nuevo_objetivo)
        db.session.commit()
        
        return jsonify(nuevo_objetivo.to_dict()), 201
        
    except ValueError as ve:
        return jsonify({'success': False, 'message': 'Formato de fecha inválido'}), 400
    except Exception as e:
        db.session.rollback()
        print(f"Error al crear objetivo: {str(e)}")
        return jsonify({'success': False, 'message': 'Error al crear objetivo'}), 500


# ========== ACTUALIZAR OBJETIVO ==========
@objetivos_bp.route('/<int:objetivo_id>', methods=['PUT'])
@jwt_required()
def update_objetivo(objetivo_id):
    """
    Actualiza un objetivo existente (progreso o estado de completado)
    PUT /api/objetivos/<id>
    Headers: Authorization: Bearer <token>
    Body (JSON):
    {
        "actual": 5.5,
        "completado": false
    }
    """
    try:
        # Obtener ID del usuario
        usuario_id = get_jwt_identity()
        
        # Buscar objetivo
        objetivo = Objetivo.query.filter_by(id=objetivo_id, usuario_id=usuario_id).first()
        
        if not objetivo:
            return jsonify({'success': False, 'message': 'Objetivo no encontrado'}), 404
        
        # Obtener datos del request
        data = request.get_json()
        
        # Actualizar campos si están presentes
        if 'actual' in data:
            objetivo.actual = float(data['actual'])
            objetivo.fecha_ultima_actualizacion = datetime.utcnow()
        
        if 'completado' in data:
            objetivo.completado = bool(data['completado'])
            if objetivo.completado:
                objetivo.fecha_completado = datetime.utcnow()
            else:
                objetivo.fecha_completado = None
        
        # Guardar cambios
        db.session.commit()
        
        return jsonify(objetivo.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error al actualizar objetivo: {str(e)}")
        return jsonify({'success': False, 'message': 'Error al actualizar objetivo'}), 500


# ========== ELIMINAR OBJETIVO ==========
@objetivos_bp.route('/<int:objetivo_id>', methods=['DELETE'])
@jwt_required()
def delete_objetivo(objetivo_id):
    """
    Elimina un objetivo
    DELETE /api/objetivos/<id>
    Headers: Authorization: Bearer <token>
    """
    try:
        # Obtener ID del usuario
        usuario_id = get_jwt_identity()
        
        # Buscar objetivo
        objetivo = Objetivo.query.filter_by(id=objetivo_id, usuario_id=usuario_id).first()
        
        if not objetivo:
            return jsonify({'success': False, 'message': 'Objetivo no encontrado'}), 404
        
        # Eliminar objetivo
        db.session.delete(objetivo)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Objetivo eliminado correctamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error al eliminar objetivo: {str(e)}")
        return jsonify({'success': False, 'message': 'Error al eliminar objetivo'}), 500