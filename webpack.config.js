const webpack = require('webpack');
const path = require('path');
const envFile = require('node-env-file');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

try {
	envFile(path.join(__dirname, 'config/' + process.env.NODE_ENV + '.env'));
} catch(e){}

module.exports = {
	entry: './app/app.jsx',
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'bundle.js'
	},
	resolve: {
		alias: {
			app: path.resolve(__dirname, 'app'),
			actions: path.resolve(__dirname, 'app/actions'),
			api: path.resolve(__dirname, 'app/api'),
			components: path.resolve(__dirname, 'app/components'),
			reducers: path.resolve(__dirname, 'app/reducers'),
			router: path.resolve(__dirname, 'app/router'),
			store: path.resolve(__dirname, 'app/store'),
			tests: path.resolve(__dirname, 'app/tests')
		},
		extensions: ['.js', '.jsx']
	},
	plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        TEST_USER_EMAIL: JSON.stringify(process.env.TEST_USER_EMAIL),
        TEST_USER_PASSWORD: JSON.stringify(process.env.TEST_USER_PASSWORD)
      }
    })
  ],
	module: {
		loaders: [
			{
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015', 'stage-0']
				},
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/
			},
			{
				loader: 'style-loader!css-loader!stylus-loader',
				test: /\.styl$/
			}
		]
	},
	devtool: process.env.NODE_ENV === 'production' ? undefined : 'cheap-module-eval-source-map'
}
