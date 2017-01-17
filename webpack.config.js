var webpack = require('webpack')
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var Bourbon = require('node-bourbon')
var Neat = require('node-neat')

var config = require('./env.config')


module.exports = {
	entry: [
		'./src/index.js',
		'./src/scss/main.scss'
	],

	output: {
		path: path.join(__dirname, 'build'),
		filename: 'bundle.js',
	},

	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react', 'stage-0'],
				},
				include: __dirname,
			},
			{
				test: /\.json$/,
				exclude: /node_modules/,
				loader: 'json-loader',
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
			},
			{
			    test: /\.(png|gif|jpg|cur|pdf)$/,
			    loader: "url-loader"
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('style.css', {
			allChunks: true,
		}),
		new webpack.DefinePlugin({
			'process.env': config
		})
	],
	sassLoader: {
		includePaths: Bourbon.with(Neat.includePaths)
	},

	resolve: {
		extensions: ['', '.js', '.jsx', '.pdf']
	}
}
