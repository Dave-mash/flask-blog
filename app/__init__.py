import os
from flask import Flask 
from flask_cors import CORS

from instance.config import app_config
from app.database import InitializeDb

def create_app(config_name='development', db_url=os.getenv('FLASK_DATABASE_URI')):
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(app_config[config_name])
    app.url_map.strict_slashes = False

    from app.api.v1.views.posts_views import v1 as post_v1
    from app.api.v1.views.comments_views import v1 as comment_v1
    from app.api.v1.views.users_views import v1 as user_v1
    
    app.register_blueprint(user_v1)
    app.register_blueprint(post_v1)
    app.register_blueprint(comment_v1)

    db = InitializeDb(db_url)
    db.create_tables()

    return app, db