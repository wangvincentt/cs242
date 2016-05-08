from src import db
from datetime import datetime


class Comment(db.Document):
    parent = db.StringField(default='')
    children = db.ListField(db.ReferenceField('Comment'))
    content = db.StringField(required=True,default='This guy does not level anything')
    author = db.StringField(required=True,default='Woodley')
    date = db.DateTimeField(default=datetime.now())

