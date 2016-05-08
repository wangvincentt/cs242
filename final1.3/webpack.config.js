var path = require('path')
module.exports = {
	entry: path.resolve(__dirname, 'www/js/main.js'),
	output: {
		path: path.resolve(__dirname, 'www/'),
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			 { test: /\.(js|jsx)$/, include: [path.resolve(__dirname, 'www/js')], exclude: [/node_modules/], loader: 'babel' }
		]
	}
}
