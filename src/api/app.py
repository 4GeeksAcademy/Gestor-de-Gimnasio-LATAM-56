"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

from api.perfil_corporal_routes import perfil_bp
from api.objetivos_routes import objetivos_bp
from api.alimentacion_routes import alimentacion
from api.training_routes import training
from api.routes import api
from api.models import db
from api.utils import APIException, generate_sitemap

from datetime import timedelta
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from flask import Flask, jsonify, send_from_directory

import os
from dotenv import load_dotenv
from pathlib import Path

# ---------------------------------------
# 🔥 Load .env correctly from root folder
# ---------------------------------------

BASE_DIR = Path(__file__).resolve().parents[1]   # /src → project root
ENV_FILE = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_FILE, override=True)

print("=" * 60)
print("🚀 CONFIGURACIÓN DEL SERVIDOR")
print("=" * 60)
print("📌 .env loaded from:", ENV_FILE)
print("🗄️  DATABASE_URL:", os.getenv("DATABASE_URL")[:30] + "..." if os.getenv("DATABASE_URL") else "Not set")
print("🔧 FLASK_DEBUG:", os.getenv("FLASK_DEBUG"))
print("🔐 JWT_SECRET_KEY:", "✓ Configured" if os.getenv("JWT_SECRET_KEY") else "⚠️  Using default")
print("=" * 60)

# ---------------------------------------
# FLASK APP INITIALIZATION
# ---------------------------------------
app = Flask(__name__)
app.url_map.strict_slashes = False

# ---------------------------------------
# CORS - CONFIGURACIÓN CRÍTICA PARA FRONTEND
# ---------------------------------------
CORS(app,
     resources={r"/api/*": {"origins": "*"}},  # Solo rutas /api/*
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     supports_credentials=True)

# ---------------------------------------
# ENVIRONMENT
# ---------------------------------------
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"

static_file_dir = os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    '../dist/'
)

# ---------------------------------------
# DATABASE CONFIG (PostgreSQL via Neon)
# ---------------------------------------
db_url = os.getenv("DATABASE_URL")

if db_url:
    # Convert old postgres:// to postgresql://
    db_url = db_url.replace("postgres://", "postgresql://")
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    print("✅ Database configured: PostgreSQL (Neon)")
else:
    print("⚠️  WARNING: DATABASE_URL not found. Using SQLite fallback.")
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)
migrate = Migrate(app, db)

# ---------------------------------------
# JWT CONFIG
# ---------------------------------------
app.config['JWT_SECRET_KEY'] = os.getenv(
    'JWT_SECRET_KEY', 'super-secret-key-change-in-production-123')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)  # 24 horas para desarrollo
jwt = JWTManager(app)

# ---------------------------------------
# REGISTER BLUEPRINTS (ORDEN IMPORTANTE)
# ---------------------------------------
print("\n📦 Registrando Blueprints...")

# Rutas principales
app.register_blueprint(api, url_prefix="/api")
print("✓ /api/* (auth, users)")

# Módulos específicos
app.register_blueprint(training, url_prefix="/api/training")
print("✓ /api/training")

app.register_blueprint(alimentacion, url_prefix="/api/alimentacion")
print("✓ /api/alimentacion")

app.register_blueprint(objetivos_bp, url_prefix="/api/objetivos")
print("✓ /api/objetivos")

app.register_blueprint(perfil_bp, url_prefix="/api/perfil")
print("✓ /api/perfil")

print("=" * 60)

# ---------------------------------------
# ROUTES
# ---------------------------------------


@app.route('/')
def sitemap():
    """Página principal - muestra todas las rutas disponibles"""
    return generate_sitemap(app)


@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint para verificar que el servidor está funcionando"""
    return jsonify({
        "status": "ok",
        "environment": ENV,
        "database": "connected" if db_url else "fallback",
        "jwt": "configured"
    }), 200


@app.route('/api/test', methods=['GET'])
def test_api():
    """Endpoint de prueba simple"""
    return jsonify({
        "message": "API funcionando correctamente",
        "timestamp": "2025-12-01"
    }), 200


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    """Manejo de errores personalizados de la API"""
    return jsonify(error.to_dict()), error.status_code


@app.errorhandler(404)
def not_found(error):
    """Manejo de rutas no encontradas"""
    return jsonify({"error": "Ruta no encontrada", "status": 404}), 404


@app.errorhandler(500)
def internal_error(error):
    """Manejo de errores internos del servidor"""
    return jsonify({"error": "Error interno del servidor", "status": 500}), 500


# ---------------------------------------
# SERVE STATIC FILES (FRONTEND)
# ---------------------------------------
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    """Sirve el frontend compilado"""
    if os.path.isdir(static_file_dir):
        if not os.path.isfile(os.path.join(static_file_dir, path)):
            path = 'index.html'
        response = send_from_directory(static_file_dir, path)
        response.cache_control.max_age = 0
        return response
    return jsonify({"message": "Frontend not built yet"}), 404


# ---------------------------------------
# RUN SERVER
# ---------------------------------------
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    
    print("\n" + "=" * 60)
    print(f"🚀 Starting server on http://localhost:{PORT}")
    print(f"🌍 Environment: {ENV}")
    print(f"📊 Health check: http://localhost:{PORT}/health")
    print(f"📋 API Routes: http://localhost:{PORT}/")
    print("=" * 60 + "\n")
    
    app.run(host='0.0.0.0', port=PORT, debug=(ENV == "development"))