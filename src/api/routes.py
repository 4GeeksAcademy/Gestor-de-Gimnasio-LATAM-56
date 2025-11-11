# src/api/routes.py
"""
Rutas del API: registro, login, ver usuarios, etc.
Este archivo está pensado para funcionar con el modelo Usuario definido en models.py
"""
from flask import Blueprint, request, jsonify
from api.models import db, User, Usuario
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from sqlalchemy.exc import IntegrityError

api = Blueprint('api', __name__)

# Allow CORS requests to this API blueprint (refuerzo)
CORS(api)

# --------------------------------
# RUTAS DE PRUEBA
# --------------------------------


@api.route('/hello', methods=['GET', 'POST'])
def handle_hello():
    return jsonify({"message": "Hello! Backend funcionando."}), 200


@api.route('/test', methods=['GET'])
def test_connection():
    return jsonify({"message": "Backend conectado correctamente"}), 200

# --------------------------------
# REGISTRO DE USUARIO
# --------------------------------


@api.route('/register', methods=['POST'])
def register():
    """
    Endpoint de registro de usuario para el gimnasio.
    Body esperado (JSON):
    {
        "nombre":"Juan",
        "apellido":"Pérez",
        "email":"juan@example.com",
        "password":"Password123",
        "telefono":"5512345678",
        "fechaNacimiento":"1990-01-01"
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No se enviaron datos'}), 400

        # Campos requeridos
        campos_requeridos = ['nombre', 'apellido', 'email',
                             'password', 'telefono', 'fechaNacimiento']
        campos_faltantes = [
            campo for campo in campos_requeridos if campo not in data or not data[campo]]

        if campos_faltantes:
            return jsonify({'success': False, 'message': f'Campos faltantes: {", ".join(campos_faltantes)}'}), 400

        # Extraer y limpiar
        nombre = data['nombre'].strip()
        apellido = data['apellido'].strip()
        email = data['email'].strip().lower()
        password = data['password']
        telefono = data['telefono'].strip()
        fecha_nacimiento_str = data['fechaNacimiento']

        # Validaciones básicas
        if len(nombre) < 2 or len(apellido) < 2:
            return jsonify({'success': False, 'message': 'Nombre y apellido deben tener al menos 2 caracteres'}), 400

        if not Usuario.validar_email(email):
            return jsonify({'success': False, 'message': 'Email inválido'}), 400

        if Usuario.query.filter_by(email=email).first():
            return jsonify({'success': False, 'message': 'Este email ya está registrado'}), 409

        if not Usuario.validar_telefono(telefono):
            return jsonify({'success': False, 'message': 'Teléfono inválido. Debe tener 10 dígitos'}), 400

        es_valida, mensaje_error = Usuario.validar_password(password)
        if not es_valida:
            return jsonify({'success': False, 'message': mensaje_error}), 400

        # Validar fecha de nacimiento y calcular edad
        try:
            fecha_nacimiento = datetime.strptime(
                fecha_nacimiento_str, '%Y-%m-%d').date()
            hoy = datetime.now().date()
            edad = hoy.year - fecha_nacimiento.year - \
                ((hoy.month, hoy.day) < (fecha_nacimiento.month, fecha_nacimiento.day))

            if edad < 16:
                return jsonify({'success': False, 'message': 'Debes tener al menos 16 años para registrarte'}), 400
            if edad > 100:
                return jsonify({'success': False, 'message': 'Fecha de nacimiento inválida'}), 400

        except ValueError:
            return jsonify({'success': False, 'message': 'Formato de fecha inválido. Usa YYYY-MM-DD'}), 400

        # Crear usuario (usar el modelo Usuario)
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

        # Generar token JWT (usa el id del usuario)
        access_token = create_access_token(identity=nuevo_usuario.id)

        return jsonify({
            'success': True,
            'message': 'Usuario registrado exitosamente',
            'usuario': nuevo_usuario.to_dict(),
            'access_token': access_token
        }), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Error al registrar usuario. El email puede estar duplicado'}), 409
    except Exception as e:
        db.session.rollback()
        # Log en el servidor para debugging
        print("Error en /api/register:", str(e))
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

# --------------------------------
# CHECK EMAIL (disponibilidad)
# --------------------------------


@api.route('/check-email', methods=['POST'])
def check_email():
    try:
        data = request.get_json()
        if not data or 'email' not in data:
            return jsonify({'success': False, 'message': 'Email no proporcionado'}), 400

        email = data['email'].strip().lower()
        if not Usuario.validar_email(email):
            return jsonify({'success': False, 'message': 'Email inválido'}), 400

        usuario_existe = Usuario.query.filter_by(
            email=email).first() is not None
        return jsonify({'success': True, 'disponible': not usuario_existe}), 200
    except Exception as e:
        print("Error en /api/check-email:", e)
        return jsonify({'success': False, 'message': 'Error al verificar email'}), 500

# --------------------------------
# LOGIN
# --------------------------------


@api.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No se enviaron datos'}), 400

        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not email or not password:
            return jsonify({'success': False, 'message': 'Email y contraseña son requeridos'}), 400

        usuario = Usuario.query.filter_by(email=email).first()
        if not usuario:
            return jsonify({'success': False, 'message': 'Credenciales inválidas'}), 401

        if not usuario.check_password(password):
            return jsonify({'success': False, 'message': 'Credenciales inválidas'}), 401

        if not usuario.activo:
            return jsonify({'success': False, 'message': 'Usuario inactivo. Contacte al administrador'}), 403

        access_token = create_access_token(identity=usuario.id)
        return jsonify({
            'success': True,
            'message': 'Login exitoso',
            'usuario': usuario.to_dict(),
            'access_token': access_token,
            'token': access_token,  # Para compatibilidad con login.jsx
            'user': usuario.to_dict()  # Para compatibilidad con login.jsx
        }), 200

    except Exception as e:
        print("Error en /api/login:", e)
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

# --------------------------------
# PROFILE (ejemplo) y otros
# --------------------------------


@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        usuario_id = get_jwt_identity()
        usuario = Usuario.query.get(usuario_id)
        if not usuario:
            return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404
        return jsonify({'success': True, 'usuario': usuario.to_dict()}), 200
    except Exception as e:
        print("Error en /api/profile GET:", e)
        return jsonify({'success': False, 'message': 'Error al obtener perfil'}), 500


@api.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        usuario_id = get_jwt_identity()
        usuario = Usuario.query.get(usuario_id)
        if not usuario:
            return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404

        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No se enviaron datos'}), 400

        if 'nombre' in data and data['nombre']:
            usuario.nombre = data['nombre'].strip()

        if 'apellido' in data and data['apellido']:
            usuario.apellido = data['apellido'].strip()

        if 'telefono' in data and data['telefono']:
            if Usuario.validar_telefono(data['telefono']):
                usuario.telefono = data['telefono'].strip()
            else:
                return jsonify({'success': False, 'message': 'Teléfono inválido'}), 400

        db.session.commit()
        return jsonify({'success': True, 'message': 'Perfil actualizado exitosamente', 'usuario': usuario.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        print("Error en /api/profile PUT:", e)
        return jsonify({'success': False, 'message': 'Error al actualizar perfil'}), 500


@api.route('/users', methods=['GET'])
def get_all_users():
    try:
        usuarios = Usuario.query.all()
        return jsonify({'success': True, 'total': len(usuarios), 'usuarios': [u.to_dict() for u in usuarios]}), 200
    except Exception as e:
        print("Error en /api/users:", e)
        return jsonify({'success': False, 'message': 'Error al obtener usuarios'}), 500


@api.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_by_id(user_id):
    try:
        usuario = Usuario.query.get(user_id)
        if not usuario:
            return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404
        return jsonify({'success': True, 'usuario': usuario.to_dict()}), 200
    except Exception as e:
        print("Error en /api/users/<id>:", e)
        return jsonify({'success': False, 'message': 'Error al obtener usuario'}), 500


@api.route('/validate-token', methods=['GET'])
@jwt_required()
def validate_token():
    try:
        usuario_id = get_jwt_identity()
        usuario = Usuario.query.get(usuario_id)
        if not usuario or not usuario.activo:
            return jsonify({'success': False, 'message': 'Token inválido o usuario inactivo'}), 401
        return jsonify({'success': True, 'message': 'Token válido', 'usuario': usuario.to_dict()}), 200
    except Exception as e:
        print("Error en /api/validate-token:", e)
        return jsonify({'success': False, 'message': 'Token inválido'}), 401
