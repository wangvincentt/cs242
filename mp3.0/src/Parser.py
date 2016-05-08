import xml.etree.ElementTree as et
__author__ = 'jwang135'


class Parser():

    '''
        For each project, we have
        {'project':{date,summary,revision,{file_name:{size,type,version:{'author':,'info','date':} } } }
        For one file name, there are lots of commits
        We need a list to stores them
        For each commit
    '''

    @staticmethod
    def svn_list_parser(file_name):
        lst_file = open(file_name,'r').read()
        e_tree = et.fromstring(lst_file)
        # Each entry is actually the file
        files = {}
        projects = {}
        for entry in e_tree.iter('entry'):
            # Only access once to get the name
            for name in entry.iter('name'):
                file_name = name
            for size in entry.iter('size'):
                file_size = size
            my_commit = Parser.svn_list_get_commit(entry)
            if entry.attrib['kind'] != 'dir':
                file_test = file_name.text
                idx = file_test.rfind('/')
                tmp = file_test[idx+1:]
                if tmp.find('.java') == -1 and tmp.find('.py') == -1 and tmp.find('.txt') == -1 and tmp.find('.json') == -1:
                    continue
                files[file_test] = {}
                files[file_test]['version'] = {}
                files[file_test]['size'] = int(size.text)
                type_idx = file_name.text.rfind('.')
                type_name = file_name.text[type_idx+1:]
                files[file_test]['type'] = type_name
                files[file_test]['path'] = file_name.text
            else:
                project_idx = file_name.text.find('/')
                if project_idx == -1:
                    project_name = file_name.text
                    if project_name not in projects:
                        projects[project_name] = {}
                        projects[project_name]['files'] = {}
                        projects[project_name]['summary'] = ""
                        projects[project_name]['revision'] = my_commit['revision']
                        projects[project_name]['date'] = my_commit['date']
        for f in files:
            project_idx = files[f]['path'].find('/')
            file_idx = files[f]['path'].rfind('/')
            path = files[f]['path']
            file_name = path[file_idx+1:len(path)]
            project_name = files[f]['path'][0:project_idx]
            projects[project_name]['files'][file_name] = files[f]

        return projects

    '''
        Parse th svn list to get commit information
        finally get 'revision', 'author' and 'date' from the commit
    '''
    @staticmethod
    def svn_list_get_commit(entry):
        my_commit = {}
        for commit in entry.iter('commit'):
            my_commit['revision'] = int(commit.attrib['revision'])
            for author in commit.iter('author'):
                my_commit['author'] = author.text
            for date in commit.iter('date'):
                my_commit['date'] = date.text

        return my_commit

    '''
        Parse svn log file and add files to what we did for projects
        If there is a file missing, ie. delete by user, we kindly ignore it
    '''
    @staticmethod
    def svn_log_parse(file_name, project):
        lst_file = open(file_name,'r').read()
        e_tree = et.fromstring(lst_file)
        # Each entry is actually the file
        for log_entry in e_tree.iter('logentry'):
            revision = int(log_entry.attrib['revision'])
            for author in log_entry.iter('author'):
                my_author = author.text
            for date in log_entry.iter('date'):
                my_date = date.text
            for msg in log_entry.iter('msg'):
                my_info = msg.text
            for path in log_entry.iter('path'):
                kind = path.attrib['kind'];
                if kind != 'dir':
                    try:
                        my_path = path.text[len('/jwang135/'):]
                        project_idx = my_path.find('/')
                        project_name = my_path[0:project_idx]
                        f_idx = my_path.rfind('/')
                        my_path = my_path[f_idx+1: len(my_path)]
                        project[project_name]['files'][my_path]['version'][revision] = {}

                        project[project_name]['files'][my_path]['version'][revision]['author'] = my_author
                        project[project_name]['files'][my_path]['version'][revision]['date'] = my_date
                        project[project_name]['files'][my_path]['version'][revision]['info'] = my_info
                        if int(revision) == int(project[project_name]['revision']):
                            project[project_name]['summary'] = my_info
                    # If the file is deleted, just ignore it
                    except Exception:
                        continue

if __name__ == '__main__':
    projects = Parser.svn_list_parser('../Data/svn_list.xml')
    Parser.svn_log_parse('../Data/svn_log.xml',projects)
    print projects['mp1.0']
