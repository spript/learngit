var path = require('path');
var config = require('../config');
var utils = require('./utils');
var webpack = require('webpack');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var env = config.build.env;

var outputPath = config.build.assetsRoot;
var outputPublicPath = config.build.assetsPublicPath;
var outputIndex = config.build.index;

if (env === 'bDev') {
	outputPath = config.bDev.assetsRoot;
	outputPublicPath = config.bDev.assetsPublicPath;
	outputIndex = config.bDev.index;
} else if (env === 'pre') {
	outputPath = config.pre.assetsRoot;
	outputPublicPath = config.pre.assetsPublicPath;
	outputIndex = config.pre.index;
}

var webpackConfig = merge(baseWebpackConfig, {
	module: {
		loaders: utils.styleLoaders({ sourceMap: config.build.productionSourceMap, extract: true })
	},
	devtool: config.build.productionSourceMap ? '#source-map' : false,
	output: {
		path: outputPath,
		publicPath: outputPublicPath,
		filename: utils.assetsPath('js/[name].[chunkhash].js'),
		chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
	},
	vue: {
		loaders: utils.cssLoaders({
			sourceMap: config.build.productionSourceMap,
			extract: true
		})
	},
	plugins: [
		// http://vuejs.github.io/vue-loader/en/workflow/production.html
		new webpack.DefinePlugin({
			'process.env': {
        		NODE_ENV: JSON.stringify(env)
      		}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		// extract css into its own file
		new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash].css')),
		// see https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			filename: outputIndex,
			template: 'index.html',
			inject: true,
			minify: {
				removeComments: false,
				collapseWhitespace: false,
				//removeAttributeQuotes: true
				removeAttributeQuotes: false
			},
			chunksSortMode: 'dependency'
		}),
		// split vendor js into its own file
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function(module, count) {
				// any required modules inside node_modules are extracted to vendor
				return (
					module.resource &&
					/\.js$/.test(module.resource) &&
					module.resource.indexOf(
						path.join(__dirname, '../node_modules')
					) === 0
				);
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			chunks: ['vendor']
		})
	]
});

if (config.build.productionGzip) {
	var CompressionWebpackPlugin = require('compression-webpack-plugin');

	webpackConfig.plugins.push(
		new CompressionWebpackPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp(
				'\\.(' +
				config.build.productionGzipExtensions.join('|') +
				')$'
			),
			threshold: 10240,
			minRatio: 0.8
		})
	);
}

module.exports = webpackConfig;
