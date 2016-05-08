
'''
@author: Jwang135
'''
from src.Parser import Parser
from flask import render_template
from flask import Flask
app = Flask(__name__)

projects = Parser.svn_list_parser('Data/svn_list.xml')
Parser.svn_log_parse('Data/svn_log.xml',projects)

# Learn from https://github.com/mukichou/cs242-1
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
    print file_path
    return render_template('showfile.html',
                           name=name,
                           file = file,
                           projects=projects,
                           url = file_path)

if __name__ == '__main__':
    app.run(debug=False,host='0.0.0.0')
