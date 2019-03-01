"""
This module serves as a database mock-up for the project
"""

import os
import jwt
import datetime
from functools import wraps, update_wrapper
from flask import jsonify, request

from app import create_app
from app.database import InitializeDb

class BaseModel:
    """ This class defines all the methods reusable in all the models """

    def __init__(self, table_name='', database=os.getenv('FLASK_DATABASE_URI')):
        # if os.getenv('APP_SETTINGS') == 'testing':
        app = Flask(__name__)
        self.table_name = table_name
        self.database = InitializeDb(database)


    @staticmethod
    def encode_auth_token(user_id):
        """ This method generates authentication token """

        app, database = create_app()

        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
                'iat': datetime.datetime.utcnow(),
                'sub': user_id
            }
            return jwt.encode(
                payload,
                app.config.get('SECRET_KEY'),
                algorithm='HS256'
            )
        except Exception as e:
            return e


    def blacklisted(self):
        pass


    @staticmethod
    def decode_auth_token(auth_token):
        """ This method takes in token and decodes it """

        app, database = create_app()

        try:
            payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'))
            return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'


    def grab_all_items(self, cols, condition, name=''):
        """ This method fetches all items """
        name = name if name else self.table_name

        return self.database.fetch_all(
            "SELECT row_to_json({}) FROM {} WHERE {};".format(cols, name, condition)
        )


    def grab_items_by_name(self, column, condition, name=''):
        """ This method fetches an item by name """
        name = name if name else self.table_name
        
        return self.database.fetch_one(
            "SELECT {} FROM {} WHERE {}".format(column, name, condition)
        )


    def add_item(self, keys, values, name=''):
        """ This method adds an item """
        name = name if name else self.table_name

        return self.database.execute(
            "INSERT INTO {} ({}) VALUES {};".format(name, keys, values)
        )


    def delete_item(self, condition, name=''):
        """ This method defines the delete item query """
        name = name if name else self.table_name
        
        return self.database.update(
            "DELETE FROM {} WHERE {}".format(name, condition)
        )

       
    def update_item(self, updates, condition, name=''):
        """ This method defines the update item query """
        name = name if name else self.table_name

        return self.database.update(
            "UPDATE {} SET {} WHERE {}".format(name, updates, condition)
        )


class AuthenticationRequired:
    """ This decorator class validates the token """

    def __init__(self, f):
        self.f = f
        update_wrapper(self, f)

    def __call__(self, *args, **kwargs):
        auth_header = request.headers.get('Authorization')

        if not auth_header or len(auth_header) < 8 or " " not in auth_header:
            return jsonify({ "error": "Please log in first!" }), 403

        auth_token = auth_header.split(" ")[1]

        if isinstance(BaseModel().decode_auth_token(auth_token), str):
            return jsonify({ "error": BaseModel().decode_auth_token(auth_token) })
        
        return self.f(*args, **kwargs)
