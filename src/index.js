// @ts-check
/** @typedef {import('./discord').SHCChannel} SHCChannel */
/** @typedef {{ props?: { channel?: SHCChannel }, renderHeaderToolbar?: (...a: any[]) => any, shcToolbarWrapped?: boolean }} ChannelViewInstance */
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
		}

		semverGt(a, b) {
			const parse = (v) => {
				const [base, pre] = v.split("-pre");
				return {
					parts: base.split(".").map(Number),
					pre: pre !== undefined ? Number(pre) : null,
				};
			};
			const av = parse(a);
			const bv = parse(b);
			for (let i = 0; i < Math.max(av.parts.length, bv.parts.length); i++) {
				const diff = (av.parts[i] ?? 0) - (bv.parts[i] ?? 0);
				if (diff !== 0) return diff > 0;
			}
			// stable > pre-release; higher pre number wins between two pre-releases
			if (av.pre === null && bv.pre !== null) return true;
			if (av.pre !== null && bv.pre === null) return false;
			return av.pre !== null && av.pre > bv.pre;
		}

		async checkForUpdates() {
			const { Logger } = require("./utils/modules");

			Logger.debug(
				`Checking for updates, current version: ${config.info.version}`,
			);

			const releases_raw = await fetch(
				`https://api.github.com/repos/${config.github_short}/releases`,
			);
			if (!releases_raw?.ok) {
				return this.api.UI.showToast(
					"(ShowHiddenChannels) Failed to check for updates.",
					{
						type: "error",
					},
				);
			}

			let releases = await releases_raw.json();
			if (!releases?.length) {
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

			const latestStable = releases
				.find((m) => !m.prerelease)
				?.tag_name?.replace("v", "");
			const latestPreRelease = releases
				.find((m) => m.prerelease)
				?.tag_name?.replace("v", "");
			const latestRelease =
				this.settings.usePreRelease && latestPreRelease && latestStable
					? this.semverGt(latestPreRelease, latestStable)
						? latestPreRelease
						: latestStable
					: this.settings.usePreRelease && latestPreRelease
						? latestPreRelease
						: latestStable;

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

			if (!this.semverGt(latestRelease, config.info.version)) {
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
			const { Logger } = require("./utils/modules");

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
			} catch (_err) {
				return failed();
			}
		}

		async start() {
			const { Logger } = require("./utils/modules");

			Logger.info(`Starting plugin...`);

			await new Promise((resolve) => {
				const start = Date.now();
				const interval = setInterval(() => {
					const container = BdApi.Webpack.getByKeys(
						"container",
						"hubContainer",
					)?.container;
					if (container) {
						clearInterval(interval);
						resolve();
					} else if (Date.now() - start >= 10000) {
						clearInterval(interval);
						Logger.error("Timed out waiting for container module after 10s");
						resolve();
					}
				}, 500);
			});

			Logger.info(`Checking for updates...`);

			Logger.isDebugging = this.settings.debugMode;

			if (this.settings.checkForUpdates) {
				await this.checkForUpdates();
			}

			// First call to the modules loader
			const { ChannelPermissionStore } =
				require("./utils/modules").getModules();

			this.can =
				ChannelPermissionStore.can.__originalFunction ??
				ChannelPermissionStore.can;

			const { loaded_successfully } = require("./utils/modules");

			if (loaded_successfully) {
				this.doStart();
			} else {
				this.api.UI.showConfirmationModal(
					`(SHC v${config.info.version}) Broken Modules`,
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
			const { DOMTools } = require("./utils/modules").getModules();

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
			const { Lockscreen } = require("./components/Lockscreen");
			const { HiddenChannelIcon } = require("./components/HiddenChannelIcon");
			const Patcher = this.api.Patcher;

			const {
				/* Library */
				Utilities,
				ReactTools,
				// DOMTools,
				// Logger,

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
				ChannelItemRenderer,
				ChannelItemUtils,
				ChannelPermissionStore,
				// PermissionStoreActionHandler,
				// ChannelListStoreActionHandler,
				// container,
				createChannelRecord,
				ChannelListStore,
				iconItem,
				actionIcon,
				ReadStateStore,
				Voice,
				CategoryStore,
			} = require("./utils/modules").getModules();

			// Check for needed modules
			if (
				!createChannelRecord ||
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

					const [channel] = /** @type {[SHCChannel]} */ (args);
					return this.isHidden(channel)
						? {
								mentionCount: 0,
								unread: false,
							}
						: res;
				},
			);

			Patcher.after(ReadStateStore, "getMentionCount", (_, args, res) => {
				if (this.settings.MarkUnread) return res;

				return this.isHidden(ChannelStore.getChannel(args[0])) ? 0 : res;
			});

			Patcher.after(ReadStateStore, "getUnreadCount", (_, args, res) => {
				if (this.settings.MarkUnread) return res;

				return this.isHidden(ChannelStore.getChannel(args[0])) ? 0 : res;
			});

			Patcher.after(ReadStateStore, "hasTrackedUnread", (_, args, res) => {
				if (this.settings.MarkUnread) return res;

				return res && !this.isHidden(ChannelStore.getChannel(args[0]));
			});

			Patcher.after(ReadStateStore, "hasUnread", (_, args, res) => {
				if (this.settings.MarkUnread) return res;

				return res && !this.isHidden(ChannelStore.getChannel(args[0]));
			});

			Patcher.after(ReadStateStore, "hasUnreadPins", (_, args, res) => {
				if (this.settings.MarkUnread) return res;

				return res && !this.isHidden(ChannelStore.getChannel(args[0]));
			});

			//* Make hidden channel visible
			Patcher.after(ChannelPermissionStore, "can", (_, args, res) => {
				const [permission, channel] = /** @type {[bigint, SHCChannel]} */ (
					args
				);
				if (!this.isHidden(channel)) return res;

				if (permission === DiscordConstants.Permissions.VIEW_CHANNEL) {
					return (
						!this.settings.blacklistedGuilds[channel.guild_id] &&
						this.settings.channels[DiscordConstants.ChannelTypes[channel.type]]
					);
				}

				if (permission === DiscordConstants.Permissions.CONNECT) {
					return false;
				}

				return res;
			});

			if (!Voice || !Route) {
				this.api.UI.showToast(
					"(SHC) Voice or Route modules are missing, channel lockscreen won't work.",
					{
						type: "warning",
					},
				);
			}

			// Swap only the message area and the members sidebar of Discord's own
			// Channel view, so its native header (name, topic, "See More") stays.
			// The class isn't exported, so grab it by walking the fiber tree up
			// from a rendered channel.
			let channelViewPatched = false;

			const { GUILD_VOICE, GUILD_STAGE_VOICE } = DiscordConstants.ChannelTypes;
			const isVoiceLike = (type) =>
				type === GUILD_VOICE || type === GUILD_STAGE_VOICE;

			const patchChannelView = (ChannelView) => {
				channelViewPatched = true;

				// render() calls both renderChat and renderCall, so gate each by
				// type or a text channel gets two lock screens.
				const swapWhen = (wantVoice) => (self, args, original) => {
					const channel = self?.props?.channel;
					if (
						isVoiceLike(channel?.type) === wantVoice &&
						this.isHidden(channel) &&
						channel?.id !== Voice?.getChannelId()
					) {
						return React.createElement(Lockscreen, {
							chat,
							channel,
							settings: this.settings,
						});
					}
					return original.apply(self, args);
				};

				Patcher.instead(ChannelView.prototype, "renderChat", swapWhen(false));
				if (typeof ChannelView.prototype.renderCall === "function") {
					Patcher.instead(ChannelView.prototype, "renderCall", swapWhen(true));
				}

				Patcher.instead(
					ChannelView.prototype,
					"renderSidebar",
					(self, args, original) =>
						this.isHidden(
							/** @type {ChannelViewInstance} */ (self)?.props?.channel,
						)
							? null
							: original.apply(self, args),
				);

				// renderHeaderToolbar is a per-instance arrow field, so wrap it on
				// each instance from the prototype render(). Drop every toolbar
				// button except mute for hidden channels (threads, pins and the
				// member toggle do nothing when you can't read the channel).
				Patcher.before(ChannelView.prototype, "render", (self) => {
					const view = /** @type {ChannelViewInstance} */ (self);
					if (view.shcToolbarWrapped) return;
					view.shcToolbarWrapped = true;

					const original = view.renderHeaderToolbar;
					if (typeof original !== "function") return;

					view.renderHeaderToolbar = (...toolbarArgs) => {
						const items = original.apply(view, toolbarArgs);
						if (!this.isHidden(view.props?.channel) || !Array.isArray(items)) {
							return items;
						}
						return items.filter((item) => item?.key === "notifications");
					};
				});
			};

			const captureChannelView = () => {
				if (channelViewPatched) return true;

				for (const sel of [
					'[class*="chatContent"]',
					'[class*="chat_"]',
					'[class*="content_"]',
				]) {
					const node = document.querySelector(sel);
					if (!node) continue;

					let fiber = ReactTools.getInternalInstance(node);
					for (let depth = 0; fiber && depth < 100; depth++) {
						const instance = fiber.stateNode;
						if (
							typeof instance?.renderChat === "function" &&
							typeof instance?.renderSidebar === "function"
						) {
							patchChannelView(instance.constructor);
							return true;
						}
						fiber = fiber.return;
					}
				}

				return false;
			};

			captureChannelView();
			this.captureViewTimeout = setTimeout(captureChannelView, 3000);

			// Fail-safe: until the Channel view is patched (or if it never is,
			// e.g. a Discord refactor), replace the whole routed page instead.
			Patcher.after(Route, "A", (_, _args, res) => {
				if (!Voice || !Route) return res;
				if (captureChannelView()) return res;

				const channelId = res.props?.computedMatch?.params?.channelId;
				const guildId = res.props?.computedMatch?.params?.guildId;
				const channel = ChannelStore?.getChannel(channelId);

				if (
					guildId &&
					this.isHidden(channel) &&
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
				(instance, args, res) => {
					const [fetchConfig] = /** @type {[{channelId: string}]} */ (args);
					if (this.isHidden(ChannelStore.getChannel(fetchConfig.channelId))) {
						return;
					}

					return res.call(instance, fetchConfig);
				},
			);

			if (this.settings.hiddenChannelIcon) {
				if (!ChannelItemRenderer) {
					this.api.UI.showToast(
						"(SHC) ChannelItemRenderer module is missing, channel lock icon won't be shown.",
						{
							type: "warning",
						},
					);
				}

				Patcher.after(ChannelItemRenderer, "render", (_, args, res) => {
					const [instance] =
						/** @type {[{channel: SHCChannel, connected: boolean}]} */ (args);
					if (!this.isHidden(instance?.channel)) {
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
							DiscordConstants.ChannelTypes.GUILD_VOICE && !instance.connected;
					if (!isInCallInThisChannel) {
						return res;
					}

					const wrapper = Utilities.findInTree(
						res,
						(channel) =>
							channel?.props?.className?.includes("shc-hidden-channel-type-2"),
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
				});
			}

			//* Remove lock icon from hidden voice channels
			if (!ChannelItemUtils?.icon) {
				this.api.UI.showToast(
					"(SHC) ChannelItemUtils is missing, voice channel lock icon won't be removed.",
					{
						type: "warning",
					},
				);
			} else {
				Patcher.before(ChannelItemUtils, "icon", (_, args) => {
					const [channel, , opts] =
						/** @type {[SHCChannel, any, {locked: boolean}]} */ (args);
					if (!opts) return;

					if (this.isHidden(channel) && opts.locked) {
						opts.locked = false;
					}
				});
			}

			//* Manually collapse hidden channel category
			if (!ChannelStore?.getChannel || !GuildChannelStore?.getChannels) {
				this.api.UI.showToast(
					"(SHC) ChannelStore or GuildChannelStore are missing, extra category settings won't work.",
					{
						type: "warning",
					},
				);
			}

			Patcher.after(ChannelStore, "getChannel", (_, args, res) => {
				const [channelId] = /** @type {[string]} */ (args);
				const guild_id = channelId?.replace("_hidden", "");
				const isHiddenCategory = channelId?.endsWith("_hidden");

				if (
					this.settings.sort !== "extra" ||
					!isHiddenCategory ||
					this.settings.blacklistedGuilds[guild_id]
				) {
					return res;
				}

				const HiddenCategoryChannel = createChannelRecord({
					guild_id: guild_id,
					id: channelId,
					name: "Hidden Channels",
					type: DiscordConstants.ChannelTypes.GUILD_CATEGORY,
					permission_overwrites: [],
				});

				return HiddenCategoryChannel;
			});

			Patcher.after(
				ChannelStore,
				"getMutableGuildChannelsForGuild",
				(_, args, GuildChannels) => {
					const [guildId] = /** @type {[string]} */ (args);
					if (!GuildChannelStore?.getChannels) return;

					if (
						this.settings.sort !== "extra" ||
						this.settings.blacklistedGuilds[guildId]
					) {
						return;
					}

					const hiddenCategoryId = `${guildId}_hidden`;
					const HiddenCategoryChannel = createChannelRecord({
						guild_id: guildId,
						id: hiddenCategoryId,
						name: "Hidden Channels",
						type: DiscordConstants.ChannelTypes.GUILD_CATEGORY,
						permission_overwrites: [],
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
			Patcher.after(ChannelListStore, "getGuild", (_, args, res) => {
				const [guildId] = /** @type {[string]} */ (args);
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
			const { ContextMenu } = require("./utils/modules").getModules();

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

		/**
		 * @param {SHCChannel} [channel]
		 * @returns {boolean}
		 */
		isHidden(channel) {
			// PermissionStore.can also takes guilds, which have no channel type
			if (typeof channel?.type !== "number") return false;

			const { DiscordConstants } = require("./utils/modules").getModules();
			const { DM, GROUP_DM } = DiscordConstants.ChannelTypes;

			if ([DM, GROUP_DM].includes(channel.type)) return false;

			// Skip the top "channels" with the guides, role select etc
			if (["browse", "customize", "guide"].includes(channel.id)) return false;

			return !this.can(DiscordConstants.Permissions.VIEW_CHANNEL, channel);
		}

		sortChannels(category) {
			if (!category || category.isCollapsed) return;

			const channelArray = Object.values(category.channels);

			const calculatePosition = (record) => {
				return (
					record.position +
					(record.isGuildVocal() ? 1000 : 0) +
					(this.isHidden(record) ? 10000 : 0)
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
				const filteredChannelRecords = channelRecords.filter(
					([channelID, channelRecord]) => {
						const isHidden = hiddenChannels.channels.some(
							(m) => m.id === channelID,
						);
						if (
							isHidden &&
							!this.hiddenChannelCache[guildId].some((m) => m[0] === channelID)
						) {
							this.hiddenChannelCache[guildId].push([channelID, channelRecord]);
						}
						return !isHidden;
					},
				);
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
			const { ChannelStore, DiscordConstants } =
				require("./utils/modules").getModules();

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
					this.isHidden(m) &&
					m.type !== DiscordConstants.ChannelTypes.GUILD_CATEGORY,
			);

			const ChannelsAndCount = {
				channels: hiddenChannels,
				amount: hiddenChannels.length,
			};
			return ChannelsAndCount;
		}

		rerenderChannels() {
			const {
				container,
				PermissionStoreActionHandler,
				ChannelListStoreActionHandler,
			} = require("./utils/modules").getModules();

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

			const { ReactTools } = require("./utils/modules").getModules();

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
			const { DOMTools, ContextMenu } = require("./utils/modules").getModules();
			const { UnloadModules } = require("./utils/modules");

			clearTimeout(this.captureViewTimeout);
			this.api.Patcher.unpatchAll();
			DOMTools.removeStyle(config.info.name);
			ContextMenu?.unpatch("guild-context", this.processContextMenu);
			this.rerenderChannels();
			UnloadModules();
		}

		getSettingsPanel() {
			const { Logger, React } = require("./utils/modules").getModules();
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
			const { Logger } = require("./utils/modules");

			this.api.Data.save("settings", this.settings);
			Logger.debug("Settings saved.", this.settings);
			this.rerenderChannels();
		}
	};
})();
