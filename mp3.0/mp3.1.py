
'''
@author: Jwang135
'''
from src.Parser import Parser
from flask import render_template
from flask import Flask, request
from flask.ext.mongoengine import MongoEngine
from src.comment import Comment
from src import db

from mongoengine.errors import ValidationError
from bson.objectid import ObjectId

app = Flask(__name__)
app.config.from_object('src.configue')
db.init_app(app)

projects = Parser.svn_list_parser('Data/svn_list.xml')
Parser.svn_log_parse('Data/svn_log.xml',projects)


# Learn from https://github.com/mukichou/cs242-1 and xyu37
@app.route('/')
def home_page():
    return render_template('index.html',projects=projects)


@app.route('/mp1')
def assignment_page(name=None):
    return render_template('projects.html',
                           projects=projects,
                           name=name)


@app.route('/mp2')
def assignment_page2(name=None):
    return render_template('projects_2.html',
                           projects=projects,
                           name=name)

    
@app.route('/<name>/files')
def file_page(name=None,filename=None):
    return render_template('file.html',
                           name=name,
                           filename=filename,
                           projects=projects)


@app.route('/<name>/<file>')
def show_file(name=None,file = None):
    tmp = "https://subversion.ews.illinois.edu/svn/sp16-cs242/jwang135/"
    file_path = tmp + projects[name]['files'][file]['path']
    return render_template('showfile.html',
                           name=name,
                           file = file,
                           projects=projects,
                           url = file_path)


@app.route('/comment',methods=['GET','POST'])
def comment():
    '''

    Used to comment
    Get for get comments from database
    Post for post comments and push to database
    '''
    if request.method == 'POST':
        comments = post_comments()
        print "1"
    else:
        comments = get_comments()
        print "2"
    return render_template('comment.html',comments=comments)


def get_comments():
    return get_comment_helper(Comment.objects)


def get_comment_helper(comments):
    '''
    For each comment, get its id, author, contend, date, parent and children info
    and store those comments into a list
    we return that list finally
    '''
    '''
    :param comments:
    :return:
    '''
    res = []
    for comment in comments:
        data = {
            'id': str(comment.id),
            'author': str(comment.author),
            'content': str(comment.content),
            'date': str(comment.date),
            'parent': str(comment.parent),
            'children': get_comment_helper(comment.children)

        }
        res.append(data)

    return res


# def filter_word(phase):
#     bad_words = ['fuck','ass','bitch','hole']
#     replacement = '****'
#     res = ''
#     for bad in bad_words:
#         idx = phase.find(bad)
#         if idx!= -1:
#             res = phase[0:idx-1] + replacement + filter_word(phase[idx + len(bad)])
#     return res

# cite from xyu37
def post_comments():
    author = request.form['author']
    parent_id = request.form['parent']
    content = request.form['content']
    # author = filter_word(author)
    # content = filter_word(content)
    if not ObjectId.is_valid(parent_id):
        comment = Comment(author=author,content=content)
        comment.save()
        return get_comments()
    try:
        parent_comment = Comment.objects(id=parent_id)
    except ValidationError:
        comment = Comment(author=author,content=content)
        comment.save()
        return get_comments()
    comment = Comment(author=author,content=content,parent=parent_id)
    comment.save()
    parent_comment.update_one(push__children=comment)
    return get_comments()

if __name__ == '__main__':
    app.run(debug=False,host='0.0.0.0')
