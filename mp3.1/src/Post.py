'''
@author: jwang135/Jialiang
'''

from src import db
from datetime import datetime

'''
    source:http://docs.mongoengine.org/projects/flask-mongoengine/en/latest/
'''

class User(db.Document):
    user_id = db.StringField(required=True)
    text = db.StringField(required=True)
    curr_time = db.DateTimeField(default=datetime.now, blank=True)
    next = db.ListField(db.ReferenceField('Employee', reverse_delete_rule=1))