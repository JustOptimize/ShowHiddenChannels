const path = require("node:path");
const webpack = require("webpack");
const pluginConfig = require("./src/config.json");
const process = require("node:process");
const fs = require("node:fs");

const meta = (() => {
	const lines = ["/**"];
	for (const key in pluginConfig) {
		if (key === "changelog") continue;

		lines.push(` * @${key} ${pluginConfig[key]}`);
	}
	lines.push(" */");
	return lines.join("\n");
})();

module.exports = {
	mode: "development",
	target: "node",
	devtool: false,
	entry: "./src/index.js",
	output: {
		filename: "ShowHiddenChannels.plugin.js",

		path: path.join(__dirname, "dist"),

		libraryTarget: "commonjs2",
		libraryExport: "default",
		compareBeforeEmit: false,
	},
	resolve: {
		extensions: [".js", ".css", ".jsx"],
	},
	module: {
		rules: [
			{ test: /\.css$/, use: "raw-loader" },
			{ test: /\.jsx$/, exclude: /node_modules/, use: "babel-loader" },
		],
	},
	plugins: [
		new webpack.BannerPlugin({ raw: true, banner: meta }),
		{
			apply: (compiler) => {
				compiler.hooks.assetEmitted.tap(
					"ShowHiddenChannels",
					(filename, info) => {
						console.info(`\n\nℹ️  Plugin built as ${filename}\n`);

						const userConfig = (() => {
							if (process.platform === "win32") return process.env.APPDATA;

							if (process.platform === "darwin") {
								return path.join(
									process.env.HOME,
									"Library",
									"Application Support",
								);
							}

							if (process.env.XDG_CONFIG_HOME) {
								return process.env.XDG_CONFIG_HOME;
							}

							return path.join(process.env.HOME, "Library", ".config");
						})();

						const bdFolder = path.join(userConfig, "BetterDiscord");
						fs.copyFileSync(
							info.targetPath,
							path.join(bdFolder, "plugins", filename),
						);
						console.info("\n\n✅ Copied to BD folder\n");
					},
				);
			},
		},
		new webpack.DefinePlugin({
			__VERSION__: JSON.stringify(pluginConfig.version),
		}),
		new webpack.DefinePlugin({
			__CHANGELOG__: JSON.stringify(pluginConfig.changelog),
		}),
	],
};
