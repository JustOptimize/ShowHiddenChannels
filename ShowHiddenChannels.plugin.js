/**
 * @name ShowHiddenChannels
 * @displayName ShowHiddenChannels - Updater
 * @version 1.0.0
 * @author JustOptimize (Oggetto)
 * @authorId 619203349954166804
 * @source https://github.com/JustOptimize/ShowHiddenChannels
 * @description An updater for ShowHiddenChannels to let older versions update to the latest version.
 */

const config = {
	info: {
		name: "ShowHiddenChannels",
	},

	main: "ShowHiddenChannels.plugin.js",
	github_short: "JustOptimize/ShowHiddenChannels",
};

module.exports = class ShowHiddenChannels {
	constructor(meta) {
		this.api = new BdApi(meta.name);
	}

	start() {
		this.checkForUpdates();
	}

	stop() {}

	async checkForUpdates() {
		console.log(
			`Checking for updates`,
		);

		const releases_raw = await fetch(
			`https://api.github.com/repos/${config.github_short}/releases`,
		);
		if (!releases_raw || !releases_raw.ok) {
			return this.api.UI.showToast(
				"(ShowHiddenChannels) Failed to check for updates.",
				{
					type: "error",
				},
			);
		}

		let releases = await releases_raw.json();
		if (!releases || !releases.length) {
			return this.api.UI.showToast(
				"(ShowHiddenChannels) Failed to check for updates.",
				{
					type: "error",
				},
			);
		}

		// Remove releases that do not have in the assets a file named ShowHiddenChannels.plugin.js
		releases = releases.filter((m) =>
			m.assets.some((n) => n.name === config.main),
		);

		const latestRelease = releases.find((m) => !m.prerelease)?.tag_name?.replace("v", "");

		console.log(
			`Latest version: ${latestRelease}`,
		);

		if (!latestRelease) {
			this.api.UI.alert(
				config.info.name,
				"Failed to check for updates, version not found.",
			);

			return console.err("Failed to check for updates, version not found.");
		}

		const SHCContent = await this.api.Net.fetch(
			`https://github.com/JustOptimize/ShowHiddenChannels/releases/download/v${latestRelease}/${config.main}`,
		)
			.then((res) => res.text())
			.catch(() => {
				this.api.UI.showToast("Failed to fetch the latest version.", {
					type: "error",
				});
			});

		this.proceedWithUpdate(SHCContent, latestRelease);
	}

	async proceedWithUpdate(SHCContent, version) {
		console.log(
			`Update confirmed by the user, updating to version ${version}`,
		);

		function failed() {
			this.api.UI.showToast("(ShowHiddenChannels) Failed to update.", {
				type: "error",
			});
		}

		if (!SHCContent) return failed();

		if (!SHCContent.match(/(?<=version: ").*(?=")/)) {
			return failed();
		}

		try {
			const fs = require("fs");
			const path = require("path");

			await fs.writeFile(
				path.join(this.api.Plugins.folder, config.main),
				SHCContent,
				(err) => {
					if (err) return failed();
				},
			);

			this.api.UI.showToast(
				`ShowHiddenChannels updated to version ${version}`,
				{
					type: "success",
				},
			);
		} catch (err) {
			return failed();
		}
	}
}
