const webpackConfig = require('./webpack.config.js');

module.exports = (config) => {
	config.set({
		browsers: ['Chrome'],
		singleRun: true,
		frameworks: ['mocha'],
		files: ['app/tests/**/*.test.jsx'],
		preprocessors: {
			'app/tests/**/*.test.jsx': ['webpack', 'sourcemap']
		},
		proxies:  {
	    '/': 'http://localhost:3000/'
	  },
		reporters: ['mocha'],
		client: {
			mocha: {
				timeout: '5000'
			}
		},
		webpack: webpackConfig,
		webpackServer: {
			noInfo: true
		}
	});
};
