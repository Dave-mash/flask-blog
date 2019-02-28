"""
This module validates incoming comments
"""

class CommentsValidator:

    def __init__(self, comment):
        self.comment = comment

    def post_fields(self, data):
        
        try:
            comment
        except:
            return {
                "error": "No value provided for the comment field!",
                "status": 400
            }

    def valid_comment(self):
        if not len(self.comment):
            return "Your comment is too short. Try being abit more descriptive"