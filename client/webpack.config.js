const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
	optimization: {
		minimizer: new UglifyJsPlugin({
			uglifyOptions: {
				warnings: false,
				parse: {},
				compress: {},
				mangle: true, // Note `mangle.properties` is `false` by default.
				output: null,
				toplevel: false,
				nameCache: null,
				ie8: false,
				keep_fnames: false,
			},
		}),
	},
	plugins: [new Dotenv()],
};
