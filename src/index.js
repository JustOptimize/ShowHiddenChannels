import styles from "./styles.css";

const config = {
	info: {
		name: "ShowHiddenChannels",
		authors: [
			{
				name: "JustOptimize (Oggetto)",
			},
		],
		description:
			"A plugin which displays all hidden Channels and allows users to view information about them, this won't allow you to read them (impossible).",
		version: __VERSION__,
		github: "https://github.com/JustOptimize/ShowHiddenChannels",
	},

	changelog: __CHANGELOG__,

	main: "ShowHiddenChannels.plugin.js",
	github_short: "JustOptimize/ShowHiddenChannels",
};

export default (() => {
	// biome-ignore lint/security/noGlobalEval: This is a necessary evil
	const RuntimeRequire = eval("require");

	const { Lockscreen } = require("./components/Lockscreen");
	const { HiddenChannelIcon } = require("./components/HiddenChannelIcon");

	const {
		ModuleStore: {
			/* Library */
			Utilities,
			DOMTools,
			Logger,
			ReactTools,

			/* Discord Modules (From lib) */
			ChannelStore,
			MessageActions,
			React,
			GuildChannelStore,
			NavigationUtils,

			/* BdApi */
			ContextMenu,

			/* Manually found modules */
			DiscordConstants,
			chat,
			Route,
			ChannelItem,
			ChannelItemKey,
			ChannelItemUtils,
			ChannelPermissionStore,
			PermissionStoreActionHandler,
			ChannelListStoreActionHandler,
			container,
			ChannelRecordBase,
			ChannelListStore,
			iconItem,
			actionIcon,
			ReadStateStore,
			Voice,
			CategoryStore,
		},
	} = require("./utils/modules");

	const defaultSettings = {
		hiddenChannelIcon: "lock",
		sort: "native",
		showPerms: true,
		showAdmin: "channel",
		MarkUnread: false,

		checkForUpdates: true,
		usePreRelease: false,

		shouldShowEmptyCategory: false,
		debugMode: false,

		channels: {
			GUILD_TEXT: true,
			GUILD_VOICE: true,
			GUILD_ANNOUNCEMENT: true,
			GUILD_STORE: true,
			GUILD_STAGE_VOICE: true,
			GUILD_FORUM: true,
		},

		blacklistedGuilds: {},
	};

	return class ShowHiddenChannels {
		constructor(meta) {
			this.meta = meta;
			this.api = new BdApi(meta.name);

			this.hiddenChannelCache = {};

			this.collapsed = {};
			this.processContextMenu = this?.processContextMenu?.bind(this);
			this.settings = Object.assign(
				{},
				defaultSettings,
				this.api.Data.load("settings"),
			);

			this.can =
				ChannelPermissionStore.can.__originalFunction ??
				ChannelPermissionStore.can;

			Logger.isDebugging = this.settings.debugMode;
		}

		async checkForUpdates() {
			Logger.debug(
				`Checking for updates, current version: ${config.info.version}`,
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

			const latestRelease = this.settings.usePreRelease
				? releases[0]?.tag_name?.replace("v", "")
				: releases.find((m) => !m.prerelease)?.tag_name?.replace("v", "");

			Logger.debug(
				`Latest version: ${latestRelease}, pre-release: ${!!this.settings.usePreRelease}`,
			);

			if (!latestRelease) {
				this.api.UI.alert(
					config.info.name,
					"Failed to check for updates, version not found.",
				);

				return Logger.err("Failed to check for updates, version not found.");
			}

			if (latestRelease <= config.info.version) {
				return Logger.info("No updates found.");
			}

			this.api.UI.showConfirmationModal(
				"Update available",
				`ShowHiddenChannels has an update available. Would you like to update to version ${latestRelease}?`,
				{
					confirmText: "Update",
					cancelText: "Cancel",
					danger: false,

					onConfirm: async () => {
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
					},

					onCancel: () => {
						this.api.UI.showToast("Update cancelled.", {
							type: "info",
						});
					},
				},
			);
		}

		async proceedWithUpdate(SHCContent, version) {
			Logger.debug(
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
				const fs = RuntimeRequire("fs");
				const path = RuntimeRequire("path");

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

		start() {
			if (this.settings.checkForUpdates) {
				this.checkForUpdates();
			}

			const { loaded_successfully } = require("./utils/modules");

			if (loaded_successfully) {
				this.doStart();
			} else {
				this.api.UI.showConfirmationModal(
					"(SHC) Broken Modules",
					"ShowHiddenChannels has detected that some modules are broken, would you like to start anyway? (This might break the plugin or Discord itself)",
					{
						confirmText: "Start anyway",
						cancelText: "Cancel",
						danger: true,

						onConfirm: () => {
							this.doStart();
						},

						onCancel: () => {
							this.api.Plugins.disable("ShowHiddenChannels");
						},
					},
				);
			}
		}

		doStart() {
			const savedVersion = this.api.Data.load("version");
			if (savedVersion !== this.meta.version) {
				this.api.UI.showChangelogModal({
					title: this.meta.name,
					subtitle: `v${this.meta.version}`,
					changes: config.changelog,
				});
				this.api.Data.save("version", config.info.version);
			}

			DOMTools.addStyle(config.info.name, styles);
			this.Patch();
			this.rerenderChannels();
		}

		Patch() {
			const Patcher = this.api.Patcher;

			// Check for needed modules
			if (
				!ChannelRecordBase ||
				!DiscordConstants ||
				!ChannelStore ||
				!ChannelPermissionStore?.can ||
				!ChannelListStore?.getGuild ||
				!DiscordConstants?.ChannelTypes
			) {
				return this.api.UI.showToast(
					"(SHC) Some crucial modules are missing, aborting. (Wait for an update)",
					{
						type: "error",
					},
				);
			}

			Patcher.instead(ChannelRecordBase.prototype, "isHidden", (channel) => {
				return (
					![1, 3].includes(channel.type) &&
					!this.can(DiscordConstants.Permissions.VIEW_CHANNEL, channel)
				);
			});

			if (!ReadStateStore) {
				this.api.UI.showToast(
					"(SHC) ReadStateStore module is missing, channels will be marked as unread.",
					{
						type: "warning",
					},
				);
			}

			Patcher.after(
				ReadStateStore,
				"getGuildChannelUnreadState",
				(_, args, res) => {
					if (this.settings.MarkUnread) return res;

					return args[0]?.isHidden()
						? {
								mentionCount: 0,
								unread: false,
							}
						: res;
				},
			);

			Patcher.after(ReadStateStore, "getMentionCount", (_, args, res) => {
				if (this.settings.MarkUnread) return res;

				return ChannelStore.getChannel(args[0])?.isHidden() ? 0 : res;
			});

			Patcher.after(ReadStateStore, "getUnreadCount", (_, args, res) => {
				if (this.settings.MarkUnread) return res;

				return ChannelStore.getChannel(args[0])?.isHidden() ? 0 : res;
			});

			Patcher.after(ReadStateStore, "hasTrackedUnread", (_, args, res) => {
				if (this.settings.MarkUnread) return res;

				return res && !ChannelStore.getChannel(args[0])?.isHidden();
			});

			Patcher.after(ReadStateStore, "hasUnread", (_, args, res) => {
				if (this.settings.MarkUnread) return res;

				return res && !ChannelStore.getChannel(args[0])?.isHidden();
			});

			Patcher.after(ReadStateStore, "hasUnreadPins", (_, args, res) => {
				if (this.settings.MarkUnread) return res;

				return res && !ChannelStore.getChannel(args[0])?.isHidden();
			});

			//* Make hidden channel visible
			Patcher.after(
				ChannelPermissionStore,
				"can",
				(_, [permission, channel], res) => {
					if (!channel?.isHidden?.()) return res;

					if (permission === DiscordConstants.Permissions.VIEW_CHANNEL) {
						return (
							!this.settings.blacklistedGuilds[channel.guild_id] &&
							this.settings.channels[
								DiscordConstants.ChannelTypes[channel.type]
							]
						);
					}

					if (permission === DiscordConstants.Permissions.CONNECT) {
						return false;
					}

					return res;
				},
			);

			if (!Voice || !Route) {
				this.api.UI.showToast(
					"(SHC) Voice or Route modules are missing, channel lockscreen won't work.",
					{
						type: "warning",
					},
				);
			}

			Patcher.after(Route, "Z", (_, _args, res) => {
				if (!Voice || !Route) return res;

				const channelId = res.props?.computedMatch?.params?.channelId;
				const guildId = res.props?.computedMatch?.params?.guildId;
				const channel = ChannelStore?.getChannel(channelId);

				if (
					guildId &&
					channel?.isHidden?.() &&
					channel?.id !== Voice.getChannelId()
				) {
					res.props.render = () =>
						React.createElement(Lockscreen, {
							chat,
							channel,
							settings: this.settings,
						});
				}

				return res;
			});

			//* Stop fetching messages if the channel is hidden
			if (!MessageActions?.fetchMessages) {
				this.api.UI.showToast(
					"(SHC) MessageActions module is missing, this mean that the plugin could be detected by Discord.",
					{
						type: "warning",
					},
				);
			}

			Patcher.instead(
				MessageActions,
				"fetchMessages",
				(instance, [fetchConfig], res) => {
					if (ChannelStore.getChannel(fetchConfig.channelId)?.isHidden?.()) {
						return;
					}

					return res.call(instance, fetchConfig);
				},
			);

			if (this.settings.hiddenChannelIcon) {
				if (!ChannelItem || !ChannelItemKey) {
					this.api.UI.showToast(
						"(SHC) ChannelItem/ChannelItemKey module is missing, channel lock icon won't be shown.",
						{
							type: "warning",
						},
					);
				}

				Patcher.after(
					ChannelItem,
					ChannelItemKey ?? "default",
					(_, [instance], res) => {
						if (!instance?.channel?.isHidden()) {
							return res;
						}

						const item = res?.props?.children?.props;
						if (item?.className) {
							item.className += ` shc-hidden-channel shc-hidden-channel-type-${instance.channel.type}`;
						}

						const children = Utilities.findInTree(
							res,
							(m) =>
								m?.props?.onClick?.toString().includes("stopPropagation") &&
								m.type === "div",
							{
								walkable: ["props", "children", "child", "sibling"],
								maxRecursion: 100,
							},
						);

						if (children.props?.children) {
							children.props.children = [
								React.createElement(HiddenChannelIcon, {
									icon: this.settings.hiddenChannelIcon,
									iconItem: iconItem,
									actionIcon: actionIcon,
								}),
							];
						}

						const isInCallInThisChannel =
							instance.channel.type ===
								DiscordConstants.ChannelTypes.GUILD_VOICE &&
							!instance.connected;
						if (!isInCallInThisChannel) {
							return res;
						}

						const wrapper = Utilities.findInTree(
							res,
							(channel) =>
								channel?.props?.className?.includes(
									"shc-hidden-channel-type-2",
								),
							{
								walkable: ["props", "children", "child", "sibling"],
								maxRecursion: 100,
							},
						);

						if (!wrapper) {
							return res;
						}

						wrapper.props.onMouseDown = () => {};
						wrapper.props.onMouseUp = () => {};

						const mainContent = wrapper?.props?.children[1]?.props?.children;

						if (!mainContent) {
							return res;
						}

						mainContent.props.onClick = () => {
							if (instance.channel?.isGuildVocal()) {
								NavigationUtils.transitionTo(
									`/channels/${instance.channel.guild_id}/${instance.channel.id}`,
								);
							}
						};
						mainContent.props.href = null;

						return res;
					},
				);
			}

			//* Remove lock icon from hidden voice channels
			if (!ChannelItemUtils?.icon) {
				this.api.UI.showToast(
					"(SHC) ChannelItemUtils is missing, voice channel lock icon won't be removed.",
					{
						type: "warning",
					},
				);
			}

			Patcher.before(ChannelItemUtils, "icon", (_, args) => {
				if (!args[2]) return;

				if (args[0]?.isHidden?.() && args[2].locked) {
					args[2].locked = false;
				}
			});

			//* Manually collapse hidden channel category
			if (!ChannelStore?.getChannel || !GuildChannelStore?.getChannels) {
				this.api.UI.showToast(
					"(SHC) ChannelStore or GuildChannelStore are missing, extra category settings won't work.",
					{
						type: "warning",
					},
				);
			}

			Patcher.after(ChannelStore, "getChannel", (_, [channelId], res) => {
				const guild_id = channelId?.replace("_hidden", "");
				const isHiddenCategory = channelId?.endsWith("_hidden");

				if (
					this.settings.sort !== "extra" ||
					!isHiddenCategory ||
					this.settings.blacklistedGuilds[guild_id]
				) {
					return res;
				}

				const HiddenCategoryChannel = new ChannelRecordBase({
					guild_id: guild_id,
					id: channelId,
					name: "Hidden Channels",
					type: DiscordConstants.ChannelTypes.GUILD_CATEGORY,
				});

				return HiddenCategoryChannel;
			});

			Patcher.after(
				ChannelStore,
				"getMutableGuildChannelsForGuild",
				(_, [guildId], GuildChannels) => {
					if (!GuildChannelStore?.getChannels) return;

					if (
						this.settings.sort !== "extra" ||
						this.settings.blacklistedGuilds[guildId]
					) {
						return;
					}

					const hiddenCategoryId = `${guildId}_hidden`;
					const HiddenCategoryChannel = new ChannelRecordBase({
						guild_id: guildId,
						id: hiddenCategoryId,
						name: "Hidden Channels",
						type: DiscordConstants.ChannelTypes.GUILD_CATEGORY,
					});

					const GuildCategories =
						GuildChannelStore.getChannels(guildId)[
							DiscordConstants.ChannelTypes.GUILD_CATEGORY
						];
					Object.defineProperty(HiddenCategoryChannel, "position", {
						value:
							(
								GuildCategories[GuildCategories.length - 1] || {
									comparator: 0,
								}
							).comparator + 1,
						writable: true,
					});

					if (!GuildChannels[hiddenCategoryId]) {
						GuildChannels[hiddenCategoryId] = HiddenCategoryChannel;
					}

					return GuildChannels;
				},
			);

			Patcher.after(GuildChannelStore, "getChannels", (_, [guildId], res) => {
				const GuildCategories =
					res[DiscordConstants.ChannelTypes.GUILD_CATEGORY];
				const hiddenCategoryId = `${guildId}_hidden`;
				const hiddenCategory = GuildCategories?.find(
					(m) => m.channel.id === hiddenCategoryId,
				);

				if (!hiddenCategory) return res;

				const OtherCategories = GuildCategories.filter(
					(m) => m.channel.id !== hiddenCategoryId,
				);
				const newComparator =
					(
						OtherCategories[OtherCategories.length - 1] || {
							comparator: 0,
						}
					).comparator + 1;

				Object.defineProperty(hiddenCategory.channel, "position", {
					value: newComparator,
					writable: true,
				});

				Object.defineProperty(hiddenCategory, "comparator", {
					value: newComparator,
					writable: true,
				});

				return res;
			});

			//* Custom category or sorting order
			Patcher.after(ChannelListStore, "getGuild", (_, [guildId], res) => {
				if (this.settings.blacklistedGuilds[guildId]) {
					return;
				}

				const guildChannels = res.guildChannels;
				const specialCategories = [
					guildChannels.favoritesCategory,
					guildChannels.recentsCategory,
					guildChannels.noParentCategory,
					guildChannels.voiceChannelsCategory,
				];

				switch (this.settings.sort) {
					case "bottom": {
						for (const category of specialCategories) {
							this.sortChannels(category);
						}

						for (const category of Object.values(guildChannels.categories)) {
							this.sortChannels(category);
						}

						break;
					}

					case "extra": {
						const hiddenCategoryId = `${guildId}_hidden`;
						const HiddenCategory =
							res.guildChannels.categories[hiddenCategoryId];
						const HiddenChannels = this.getHiddenChannelRecord(
							[
								...specialCategories,
								...Object.values(res.guildChannels.categories).filter(
									(category) => category.id !== hiddenCategoryId,
								),
							],
							guildId,
						);

						HiddenCategory.channels = Object.fromEntries(
							Object.entries(HiddenChannels.records).map(([id, channel]) => {
								channel.category = HiddenCategory;
								channel.record.parent_id = hiddenCategoryId;
								return [id, channel];
							}),
						);

						HiddenCategory.isCollapsed =
							res.guildChannels.collapsedCategoryIds[hiddenCategoryId] ??
							CategoryStore.isCollapsed(hiddenCategoryId);
						if (HiddenCategory.isCollapsed) {
							res.guildChannels.collapsedCategoryIds[hiddenCategoryId] = true;
						}

						HiddenCategory.shownChannelIds =
							res.guildChannels.collapsedCategoryIds[hiddenCategoryId] ||
							HiddenCategory.isCollapsed
								? []
								: HiddenChannels.channels
										.sort((x, y) => {
											const xPos = x.position + (x.isGuildVocal() ? 1e4 : 1e5);
											const yPos = y.position + (y.isGuildVocal() ? 1e4 : 1e5);
											return xPos - yPos;
										})
										.map((m) => m.id);
						break;
					}
				}

				if (this.settings.shouldShowEmptyCategory) {
					this.patchEmptyCategoryFunction([
						...Object.values(res.guildChannels.categories).filter(
							(m) => !m.id.includes("hidden"),
						),
					]);
				}

				return res;
			});

			//* add entry in guild context menu
			if (!ContextMenu?.patch) {
				this.api.UI.showToast("(SHC) ContextMenu is missing, skipping.", {
					type: "warning",
				});
			}

			ContextMenu?.patch("guild-context", this.processContextMenu);
		}

		processContextMenu(menu, { guild }) {
			const menuCategory = menu?.props?.children?.find((buttonCategory) => {
				const children = buttonCategory?.props?.children;
				return (
					Array.isArray(children) &&
					children.some((button) => button?.props?.id === "hide-muted-channels")
				);
			});

			if (!menuCategory || !guild) return;

			menuCategory.props.children.push(
				ContextMenu.buildItem({
					type: "toggle",
					label: "Disable SHC",
					checked: this.settings.blacklistedGuilds[guild.id],
					action: () => {
						this.settings.blacklistedGuilds[guild.id] =
							!this.settings.blacklistedGuilds[guild.id];
						this.saveSettings();
					},
				}),
			);
		}

		patchEmptyCategoryFunction(categories) {
			for (const category of categories) {
				if (!category.shouldShowEmptyCategory.__originalFunction) {
					category.shouldShowEmptyCategory = () => true;
				}
			}
		}

		sortChannels(category) {
			if (!category || category.isCollapsed) return;

			const channelArray = Object.values(category.channels);

			const calculatePosition = (record) => {
				return (
					record.position +
					(record.isGuildVocal() ? 1000 : 0) +
					(record.isHidden() ? 10000 : 0)
				);
			};

			category.shownChannelIds = channelArray
				.sort((x, y) => {
					const xPos = calculatePosition(x.record);
					const yPos = calculatePosition(y.record);
					return xPos - yPos;
				})
				.map((n) => n.id);
		}

		getHiddenChannelRecord(categories, guildId) {
			const hiddenChannels = this.getHiddenChannels(guildId);
			if (!hiddenChannels) return;

			if (!this.hiddenChannelCache[guildId]) {
				this.hiddenChannelCache[guildId] = [];
			}

			for (const category of categories) {
				const channelRecords = Object.entries(category.channels);
				const filteredChannelRecords = channelRecords
					.map(([channelID, channelRecord]) => {
						if (hiddenChannels.channels.some((m) => m.id === channelID)) {
							if (
								!this.hiddenChannelCache[guildId].some(
									(m) => m[0] === channelID,
								)
							) {
								this.hiddenChannelCache[guildId].push([
									channelID,
									channelRecord,
								]);
							}
							return false;
						}
						return [channelID, channelRecord];
					})
					.filter(Boolean);

				category.channels = Object.fromEntries(filteredChannelRecords);
				if (category.hiddenChannelIds) {
					category.hiddenChannelIds = category.hiddenChannelIds.filter((v) =>
						filteredChannelRecords.some(([id]) => id === v),
					);
				}

				if (category.shownChannelIds) {
					category.shownChannelIds = category.shownChannelIds.filter((v) =>
						filteredChannelRecords.some(([id]) => id === v),
					);
				}
			}

			return {
				records: Object.fromEntries(this.hiddenChannelCache[guildId]),
				...hiddenChannels,
			};
		}

		/**
		 * Retrieves the hidden channels for a given guild.
		 * @param {string} guildId - The ID of the guild.
		 * @returns {object} - An object containing the hidden channels and the amount of hidden channels.
		 */
		getHiddenChannels(guildId) {
			if (!guildId) {
				return {
					channels: [],
					amount: 0,
				};
			}

			const guildChannels =
				ChannelStore.getMutableGuildChannelsForGuild(guildId);
			const hiddenChannels = Object.values(guildChannels).filter(
				(m) =>
					m.isHidden() &&
					m.type !== DiscordConstants.ChannelTypes.GUILD_CATEGORY,
			);

			const ChannelsAndCount = {
				channels: hiddenChannels,
				amount: hiddenChannels.length,
			};
			return ChannelsAndCount;
		}

		rerenderChannels() {
			PermissionStoreActionHandler?.CONNECTION_OPEN();
			ChannelListStoreActionHandler?.CONNECTION_OPEN();

			this.forceUpdate(document.querySelector(`.${container}`));
		}

		/**
		 * Forces the rerender of a React element.
		 * @param {HTMLElement} element - The element to rerender.
		 * @returns {void}
		 */
		forceUpdate(element) {
			if (!element) return;

			const toForceUpdate = ReactTools.getOwnerInstance(element);
			const forceRerender = this.api.Patcher.instead(
				toForceUpdate,
				"render",
				() => {
					forceRerender();
					return null;
				},
			);

			toForceUpdate.forceUpdate(() => toForceUpdate.forceUpdate(() => {}));
		}

		stop() {
			this.api.Patcher.unpatchAll();
			DOMTools.removeStyle(config.info.name);
			ContextMenu?.unpatch("guild-context", this.processContextMenu);
			this.rerenderChannels();
		}

		getSettingsPanel() {
			const { SettingsPanel } = require("./components/SettingsPanel");

			return React.createElement(SettingsPanel, {
				settings: this.settings,
				onSettingsChange: (newSetting, value) => {
					this.settings = {
						...this.settings,
						[newSetting]: value,
					};
					Logger.debug(`Setting changed: ${newSetting} => ${value}`);
					this.saveSettings();
				},
			});
		}

		reloadNotification(
			coolText = "Reload Discord to apply changes and avoid bugs",
		) {
			this.api.UI.showConfirmationModal("Reload Discord?", coolText, {
				confirmText: "Reload",
				cancelText: "Later",
				onConfirm: () => {
					window.location.reload();
				},
			});
		}

		saveSettings() {
			this.api.Data.save("settings", this.settings);
			Logger.debug("Settings saved.", this.settings);
			this.rerenderChannels();
		}
	};
})();
