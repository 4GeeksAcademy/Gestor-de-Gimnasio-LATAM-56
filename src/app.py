"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.training_routes import training
from api.alimentacion_routes import alimentacion
from api.objetivos_routes import objetivos_bp
from api.perfil_corporal_routes import perfil_bp

app = Flask(__name__)
app.url_map.strict_slashes = False

# CORS (ajusta orígenes si quieres más seguridad)
CORS(app,
     resources={r"/*": {"origins": "*"}},
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     supports_credentials=True)

# Environment
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../dist/')

# Database configuration
db_url = os.getenv("DATABASE_URL")
if db_url:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
migrate = Migrate(app, db)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'cambiar-esto-en-produccion')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
jwt = JWTManager(app)

# Register blueprints AFTER initializing DB and JWT
app.register_blueprint(training, url_prefix="/api/training")
app.register_blueprint(alimentacion, url_prefix="/api")
app.register_blueprint(objetivos_bp, url_prefix="/api/objetivos")
app.register_blueprint(perfil_bp, url_prefix="/api/perfil")
app.register_blueprint(api, url_prefix="/api")

# Sitemap
@app.route('/')
def sitemap():
    return generate_sitemap(app)

# Health check
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "environment": ENV}), 200

# Error handlers
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Serve frontend static files (if exist)
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if os.path.isdir(static_file_dir):
        if not os.path.isfile(os.path.join(static_file_dir, path)):
            path = 'index.html'
        response = send_from_directory(static_file_dir, path)
        response.cache_control.max_age = 0
        return response
    return jsonify({"message": "Frontend not built yet"}), 404

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
