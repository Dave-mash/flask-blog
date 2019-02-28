"""
This module sets up all the post endpoints
Author: Dave
"""

from flask import request, jsonify, make_response, Blueprint

from app.api.v1.utils.posts_validator import PostValidator
from app.api.v1.models.posts import Post, AuthenticationRequired
from app.api.v1.models.users import User, AuthenticationRequired

v1 = Blueprint('postv1', __name__, url_prefix='/api/v1/')


""" This route fetches all posts """
@v1.route("/posts", methods=['GET'])
def get():
    posts = Post().fetch_posts('(title, body, created_on)', 'True = True')
    posts_list = []

    for post in posts:
        posts_list.append(post[0])

    return make_response(jsonify({
        "status": 200,
        "posts": posts_list
    }), 200)


""" This route posts a post """
@v1.route("/<int:userId>/posts", methods=['POST'])
@AuthenticationRequired
def post(userId):
    data = request.get_json()
    
    if PostValidator().post_fields(data):
        return make_response(jsonify(PostValidator().post_fields(data)), 400)
    else:
        validate_post = PostValidator(data)
        validation_methods = [
            validate_post.valid_post,
            validate_post.data_exists
        ]

        for error in validation_methods:
            if error():
                return make_response(jsonify({
                    "error": error()
                }), 422)
            
        user = User().fetch_specific_user('id', f"id = {userId}")

        post = {
            "author_id": userId,
            "title": data['title'],
            "body": data['body']
        }
        
        if user:

            post_model = Post(post)
            post_model.save_post()

            return make_response(jsonify({
                "status": 201,
                "message": "You have successfully posted a post",
                "data": [{
                    "title": data['title'],
                    "body": data['body'],
                    "user": userId
                }]
            }), 201)
        else:
            return make_response(jsonify({
                "error": "Please create an account first!",
                "status": 403
            }), 403)


""" This route updates a post """
@v1.route("/<int:userId>/posts/<int:postId>", methods=['PUT'])
@AuthenticationRequired
def edit_post(postId, userId):
    data = request.get_json()
    
    if PostValidator().post_fields(data):
        return make_response(jsonify(PostValidator().post_fields(data)), 400)
    else:
        validate_post = PostValidator(data)
        validation_methods = [
            validate_post.valid_post,
            validate_post.data_exists
        ]

        for error in validation_methods:
            if error():
                return make_response(jsonify({
                    "error": error()
                }), 422)

    if Post().fetch_specific_post('author_id', f"id = {postId}")[0] == userId:

        post = Post().update_post(postId, data)

        if isinstance(post, dict):
            return make_response(post)
        else:
            return make_response(jsonify({
                "message": "You have successfully updated this post",
                "status": 200
            }), 200)
    else:
        return make_response(jsonify({
            "error": "You are not authorized to perform this action!",
            "status": 401
        }), 401)


""" This route deletes a post """
@v1.route("<int:userId>/posts/<int:postId>", methods=['DELETE'])
@AuthenticationRequired
def delete_post(postId, userId):

    if Post().fetch_specific_post('author_id', f"id = {postId}")[0] == userId:
        
        post = Post().delete_post(postId)

        if isinstance(post, dict):
            return make_response(jsonify(post), 404)
        else:
            return make_response(jsonify({
                "error": 'post was deleted successfully',
                "status": 200
            }), 200)
    else:
        return make_response(jsonify({
            "error": "You are not authorized to perform this action!",
            "status": 401
        }), 401)