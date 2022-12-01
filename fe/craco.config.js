const webpack = require('webpack');

module.exports = {
	webpack: {
		configure: {
			entry: './src/index.js',
			resolve: {
				fallback: {
					util: require.resolve('util/'),
					assert: require.resolve('assert/'),
					buffer: require.resolve('buffer/'),
					path: require.resolve('path-browserify'),
					stream: require.resolve('stream-browserify'),
					zlib: require.resolve('browserify-zlib'),
					process: require.resolve('process/browser'),
					// _stream_readable: require.resolve('readable-stream/')
				},
				// alias: {
				// 	_stream_readable: 'readable-stream/readable'
				// }
			},
			module: {
				rules: [
					{
						test: /\.m?js$/,
						resolve: {
							fullySpecified: false, // disable the behaviour
						},
					},
				],
			},
		},
		plugins: {
			add: [
				new webpack.ProvidePlugin({ 
					process: 'process/browser', 
				})
			]
		}
		// plugins: {
    //   add: [
    //     new webpack.DefinePlugin({
    //       process: {env: {}}
    //     })
    //   ]
    // }
	}
};