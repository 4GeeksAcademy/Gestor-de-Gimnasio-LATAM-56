# src/api/routes.py
from flask import Blueprint, request, jsonify
from api.models import db, User, Usuario
from api.utils import APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from sqlalchemy.exc import IntegrityError
import traceback

api = Blueprint('api', __name__)
CORS(api)

# Rutas de prueba


@api.route('/hello', methods=['GET', 'POST'])
def handle_hello():
    return jsonify({"message": "Hello! Backend funcionando."}), 200


@api.route('/test', methods=['GET'])
def test_connection():
    return jsonify({"message": "Backend conectado correctamente"}), 200

# REGISTRO


@api.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No se enviaron datos'}), 400

        campos_requeridos = ['nombre', 'apellido', 'email',
                             'password', 'telefono', 'fechaNacimiento']
        faltantes = [
            c for c in campos_requeridos if c not in data or not data[c]]

        if faltantes:
            return jsonify({'success': False, 'message': f'Campos faltantes: {", ".join(faltantes)}'}), 400

        nombre = data['nombre'].strip()
        apellido = data['apellido'].strip()
        email = data['email'].strip().lower()
        password = data['password']
        telefono = data['telefono'].strip()
        fecha_nacimiento_str = data['fechaNacimiento']

        if not Usuario.validar_email(email):
            return jsonify({'success': False, 'message': 'Email inválido'}), 400
        if Usuario.query.filter_by(email=email).first():
            return jsonify({'success': False, 'message': 'Este email ya está registrado'}), 409
        if not Usuario.validar_telefono(telefono):
            return jsonify({'success': False, 'message': 'Teléfono inválido'}), 400

        es_valida, msg_err = Usuario.validar_password(password)
        if not es_valida:
            return jsonify({'success': False, 'message': msg_err}), 400

        try:
            fecha_nacimiento = datetime.strptime(
                fecha_nacimiento_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'success': False, 'message': 'Formato de fecha inválido (YYYY-MM-DD)'}), 400

        nuevo_usuario = Usuario(
            nombre=nombre,
            apellido=apellido,
            email=email,
            telefono=telefono,
            fecha_nacimiento=fecha_nacimiento
        )
        nuevo_usuario.set_password(password)

        db.session.add(nuevo_usuario)
        db.session.commit()

        # 🔥 FIX: Convertir ID a string para JWT
        token = create_access_token(identity=str(nuevo_usuario.id))

        return jsonify({
            'success': True,
            'message': 'Usuario registrado exitosamente',
            'usuario': nuevo_usuario.to_dict(),
            'access_token': token,
            'user': nuevo_usuario.to_dict(),
            'token': token
        }), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Email duplicado'}), 409

    except Exception as e:
        db.session.rollback()
        print("Error en /api/register:", e)
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno'}), 500


# CHECK EMAIL
@api.route('/check-email', methods=['POST'])
def check_email():
    try:
        data = request.get_json()
        if not data or 'email' not in data:
            return jsonify({'success': False, 'message': 'Email no proporcionado'}), 400

        email = data['email'].strip().lower()
        if not Usuario.validar_email(email):
            return jsonify({'success': False, 'message': 'Email inválido'}), 400

        existe = Usuario.query.filter_by(email=email).first() is not None
        return jsonify({'success': True, 'disponible': not existe}), 200

    except Exception as e:
        print("Error en /api/check-email:", e)
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno'}), 500


# LOGIN
@api.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No se enviaron datos'}), 400

        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        usuario = Usuario.query.filter_by(email=email).first()

        if not usuario:
            return jsonify({'success': False, 'message': 'Credenciales inválidas'}), 401

        if not usuario.check_password(password):
            return jsonify({'success': False, 'message': 'Credenciales inválidas'}), 401

        if not usuario.activo:
            return jsonify({'success': False, 'message': 'Usuario inactivo'}), 403

        # 🔥 FIX: Convertir ID a string para JWT
        token = create_access_token(identity=str(usuario.id))

        return jsonify({
            'success': True,
            'message': 'Login exitoso',
            'usuario': usuario.to_dict(),
            'access_token': token,
            'user': usuario.to_dict(),
            'token': token
        }), 200

    except Exception as e:
        print("Error en /api/login:", e)
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno'}), 500


# PROFILE
@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        # 🔥 FIX: Convertir de string a int
        uid = int(get_jwt_identity())
        usuario = Usuario.query.get(uid)
        if not usuario:
            return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404

        return jsonify({'success': True, 'usuario': usuario.to_dict()}), 200

    except Exception as e:
        print("Error en /profile:", e)
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno'}), 500


@api.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        # 🔥 FIX: Convertir de string a int
        uid = int(get_jwt_identity())
        usuario = Usuario.query.get(uid)
        if not usuario:
            return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404

        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'Sin datos'}), 400

        if 'nombre' in data:
            usuario.nombre = data['nombre'].strip()
        if 'apellido' in data:
            usuario.apellido = data['apellido'].strip()
        if 'telefono' in data and Usuario.validar_telefono(data['telefono']):
            usuario.telefono = data['telefono'].strip()

        db.session.commit()
        return jsonify({'success': True, 'usuario': usuario.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        print("Error en /profile PUT:", e)
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno'}), 500


# USERS
@api.route('/users', methods=['GET'])
def get_all_users():
    try:
        usuarios = Usuario.query.all()
        return jsonify({'success': True, 'usuarios': [u.to_dict() for u in usuarios]}), 200
    except Exception as e:
        print("Error en users:", e)
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno'}), 500


@api.route('/validate-token', methods=['GET'])
@jwt_required()
def validate_token():
    try:
        # 🔥 FIX: Convertir de string a int
        uid = int(get_jwt_identity())
        usuario = Usuario.query.get(uid)
        if not usuario:
            return jsonify({'success': False, 'message': 'Token inválido'}), 401

        return jsonify({'success': True, 'usuario': usuario.to_dict()}), 200
    except Exception as e:
        print("Error en /api/validate-token:", e)
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Token inválido'}), 401
