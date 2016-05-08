import unittest
from src.Parser import Parser


class MyTestCase(unittest.TestCase):
    def setUp(self):
        filename = 'Data/svn_list_test.xml'
        self.projects = Parser.svn_list_parser(filename)
        self.assertEqual(self.projects['mp1.0']['revision'],3986)
        self.assertEqual( self.projects['mp1.0']['files']['King.java'],{'path': 'mp1.0/src/ChessPiece/King.java', 'version': {}, 'type': 'java', 'size': 741})
        log_name = 'Data/svn_log_test.xml'
        Parser.svn_log_parse(log_name,self.projects)
        self.assertEqual (self.projects['mp1.0']['files']['King.java'],{'path': 'mp1.0/src/ChessPiece/King.java', 'version': {3984: {'date': '2016-02-06T22:14:38.403004Z', 'info': 'checkmate and stalemate\n', 'author': 'jwang135'}, 3700: {'date': '2016-02-05T07:46:32.189208Z', 'info': 'v_1 need implement checkmate and stalemate', 'author': 'jwang135'}, 3069: {'date': '2016-02-02T18:50:36.923623Z', 'info': 'First commit, not implement check and checkmate', 'author': 'jwang135'}}, 'type': 'java', 'size': 741})

    def test_multi_revision_file(self):
        self.assertEqual (self.projects['mp1.0']['files']['King.java']['version'],{3984: {'date': '2016-02-06T22:14:38.403004Z', 'info': 'checkmate and stalemate\n', 'author': 'jwang135'}, 3700: {'date': '2016-02-05T07:46:32.189208Z', 'info': 'v_1 need implement checkmate and stalemate', 'author': 'jwang135'}, 3069: {'date': '2016-02-02T18:50:36.923623Z', 'info': 'First commit, not implement check and checkmate', 'author': 'jwang135'}})

    def test_multi_revision_multi_file(self):
        self.assertEqual (self.projects['mp1.0']['files']['King.java']['version'],{3984: {'date': '2016-02-06T22:14:38.403004Z', 'info': 'checkmate and stalemate\n', 'author': 'jwang135'}, 3700: {'date': '2016-02-05T07:46:32.189208Z', 'info': 'v_1 need implement checkmate and stalemate', 'author': 'jwang135'}, 3069: {'date': '2016-02-02T18:50:36.923623Z', 'info': 'First commit, not implement check and checkmate', 'author': 'jwang135'}})
        self.assertEqual (self.projects['mp1.0']['files']['Knight.java']['version'],{3984: {'date': '2016-02-06T22:14:38.403004Z', 'info': 'checkmate and stalemate\n', 'author': 'jwang135'}, 3700: {'date': '2016-02-05T07:46:32.189208Z', 'info': 'v_1 need implement checkmate and stalemate', 'author': 'jwang135'}, 3069: {'date': '2016-02-02T18:50:36.923623Z', 'info': 'First commit, not implement check and checkmate', 'author': 'jwang135'}})

    def test_file_delete(self):
        #delete one file in 'mp1.0'
        self.assertTrue('.plugins/org.eclipse.ui.cheatsheets' not in self.projects['mp1.0']['files'])
        # Assume I delete all files in 'mp1.1'
        self.assertEqual(self.projects['mp1.1']['files'],{})
        # Assume I delete whole dir for 'mp1.2'
        self.assertTrue('mp1.2' not in  self.projects)


if __name__ == '__main__':
    unittest.main()
