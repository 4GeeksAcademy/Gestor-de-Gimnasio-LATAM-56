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

print("📌 .env loaded from:", ENV_FILE)  # Debug — quítalo luego
print("DATABASE_URL:", os.getenv("DATABASE_URL"))  # Debug
print("FLASK_DEBUG:", os.getenv("FLASK_DEBUG"))    # Debug

# ---------------------------------------

app = Flask(__name__)
app.url_map.strict_slashes = False

# ---------------------------------------
# CORS
# ---------------------------------------
CORS(app,
     resources={r"/*": {"origins": "*"}},
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
else:
    print("⚠️ WARNING: DATABASE_URL not found. Using SQLite fallback.")
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

# ---------------------------------------
# JWT CONFIG
# ---------------------------------------
app.config['JWT_SECRET_KEY'] = os.getenv(
    'JWT_SECRET_KEY', 'cambiar-esto-en-produccion')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=20)
jwt = JWTManager(app)

# ---------------------------------------
# REGISTER BLUEPRINTS
# ---------------------------------------
app.register_blueprint(training, url_prefix="/api/training")
app.register_blueprint(alimentacion, url_prefix="/api")
app.register_blueprint(objetivos_bp, url_prefix="/api/objetivos")
app.register_blueprint(perfil_bp, url_prefix="/api/perfil")
app.register_blueprint(api, url_prefix="/api")

# ---------------------------------------
# ROUTES
# ---------------------------------------


@app.route('/')
def sitemap():
    return generate_sitemap(app)


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "environment": ENV}), 200


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
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
    app.run(host='0.0.0.0', port=PORT, debug=True)
