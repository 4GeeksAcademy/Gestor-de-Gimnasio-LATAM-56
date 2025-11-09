"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Usuario
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime
from sqlalchemy.exc import IntegrityError

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# ============================================
# RUTAS EXISTENTES


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


@api.route('/test', methods=['GET'])
def test_connection():
    return jsonify({"message": "Backend conectado correctamente"}), 200

# ============================================


@api.route('/register', methods=['POST'])
def register():
    """
    Endpoint de registro de usuario para el gimnasio
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({'success': False, 'message': 'No se enviaron datos'}), 400

        # Validar campos requeridos
        campos_requeridos = ['nombre', 'apellido', 'email',
                             'password', 'telefono', 'fechaNacimiento']
        campos_faltantes = [
            campo for campo in campos_requeridos if campo not in data or not data[campo]]

        if campos_faltantes:
            return jsonify({'success': False, 'message': f'Campos faltantes: {", ".join(campos_faltantes)}'}), 400

        # Extraer y limpiar datos
        nombre = data['nombre'].strip()
        apellido = data['apellido'].strip()
        email = data['email'].strip().lower()
        password = data['password']
        telefono = data['telefono'].strip()
        fecha_nacimiento_str = data['fechaNacimiento']

        # Validaciones
        if len(nombre) < 2 or len(apellido) < 2:
            return jsonify({'success': False, 'message': 'Nombre y apellido deben tener al menos 2 caracteres'}), 400

        if not Usuario.validar_email(email):
            return jsonify({'success': False, 'message': 'Email inválido'}), 400

        # Verificar si el email ya existe
        if Usuario.query.filter_by(email=email).first():
            return jsonify({'success': False, 'message': 'Este email ya está registrado'}), 409

        if not Usuario.validar_telefono(telefono):
            return jsonify({'success': False, 'message': 'Teléfono inválido. Debe tener 10 dígitos'}), 400

        es_valida, mensaje_error = Usuario.validar_password(password)
        if not es_valida:
            return jsonify({'success': False, 'message': mensaje_error}), 400

        # Validar fecha de nacimiento
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

        # Crear usuario
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

        return jsonify({
            'success': True,
            'message': 'Usuario registrado exitosamente',
            'usuario': nuevo_usuario.to_dict()
        }), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Error al registrar usuario. El email puede estar duplicado'}), 409
    except Exception as e:
        db.session.rollback()
        print(f"Error en registro: {str(e)}")
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500


@api.route('/check-email', methods=['POST'])
def check_email():
    """Verifica si un email ya está registrado"""
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
        print(f"Error en check-email: {str(e)}")
        return jsonify({'success': False, 'message': 'Error al verificar email'}), 500
