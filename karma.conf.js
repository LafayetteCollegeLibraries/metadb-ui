const webpack = require('webpack')

module.exports = function(config) {
	config.set({

	// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['mocha'],


		// list of files / patterns to load in the browser
		files: [
			'test.webpack.js'
		],


		// list of files to exclude
		exclude: [
		],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'test.webpack.js': [ 'webpack', 'sourcemap' ],
		},

		webpack: {
			module: {
				loaders: [
					{
						test: /\.jsx?$/,
						loader: 'babel-loader',
						query: {
							presets: ['es2015', 'react']
						},
					},
					{
						test: /\.json$/,
						loader: 'json-loader',
					},
					{
						test: /\.txt$/,
						loader: 'raw-loader',
					},
					{
						test: /\.css$/,
						loader: 'css-loader',
					},
				],
			},

			externals: {
				'react/addons': true,
				'react/lib/ExecutionEnvironment': true,
				'react/lib/ReactContext': true,
			},

			plugins: [
				new webpack.DefinePlugin({
					'process.env': {
						API_BASE_URL: JSON.stringify('http://example.org'),
						AUTH_BASE_URL: JSON.stringify('http://auth.example.org/ns'),
						SEARCH_BASE_URL: JSON.stringify('/catalog.json'),
					},
				})
			],

			devtool: '#inline-source-map',

			node: {
				fs: 'empty',
			}
		},
		webpackServer: {
			noInfo: true,
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['mocha', 'coverage'],

		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: [
			'PhantomJS',
		],

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,

		coverageReporter: {
			type: 'html',
			dir: 'coverage/',
			file: 'coverage.html'
		}
	})
}
