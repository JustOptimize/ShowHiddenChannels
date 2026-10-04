// Executed inside the actual Discord renderer by the integration test.
// Keep this contract aligned with the methods and exports used in src/.
const methods = {
	Utilities: ["findInTree"],
	DOMTools: ["addStyle", "removeStyle"],
	ReactTools: ["getInternalInstance", "getOwnerInstance"],
	React: ["createElement", "memo", "useState", "useEffect"],
	ContextMenu: ["patch", "unpatch", "buildItem"],
	ChannelStore: ["getChannel", "getMutableGuildChannelsForGuild"],
	MessageActions: ["fetchMessages"],
	GuildChannelStore: ["getChannels"],
	GuildMemberStore: ["getMember", "isMember"],
	LocaleManager: ["setLocale"],
	NavigationUtils: ["transitionTo"],
	ImageResolver: ["getGuildIconURL"],
	UserStore: ["getUser"],
	GuildStore: ["getGuild", "getGuilds"],
	GuildRoleStore: ["getRolesSnapshot"],
	Route: ["A"],
	ChannelItemRenderer: ["render"],
	ChannelItemUtils: ["icon"],
	ChannelPermissionStore: ["can"],
	PermissionStoreActionHandler: ["CONNECTION_OPEN"],
	ChannelListStoreActionHandler: ["CONNECTION_OPEN"],
	ChannelListStore: ["getGuild"],
	ReadStateStore: [
		"getGuildChannelUnreadState",
		"getMentionCount",
		"getUnreadCount",
		"hasTrackedUnread",
		"hasUnread",
		"hasUnreadPins",
	],
	Voice: ["getChannelId"],
	UserMentions: ["react"],
	ProfileActions: ["fetchProfile"],
	PermissionUtils: ["can"],
	CategoryStore: ["isCollapsed"],
};

function inspect(modules) {
	const checks = [];
	const check = (name, expected, value, valid) =>
		checks.push({
			name,
			expected,
			actual: value == null ? String(value) : typeof value,
			passed: valid,
		});
	const at = (path) =>
		path.split(".").reduce((value, key) => value?.[key], modules);
	// Also check new top-level loader exports until their contract is added here.
	for (const [name, value] of Object.entries(modules)) {
		check(name, "resolved export", value, value != null);
	}
	for (const [group, names] of Object.entries(methods)) {
		for (const name of names) {
			const path = `${group}.${name}`;
			check(path, "function", at(path), typeof at(path) === "function");
		}
	}
	for (const path of ["createChannelRecord", "DiscordConstants.NOOP"]) {
		check(path, "function", at(path), typeof at(path) === "function");
	}
	for (const name of [
		"chat",
		"container",
		"iconItem",
		"actionIcon",
		"LocaleManager._chosenLocale",
	]) {
		check(
			name,
			"nonempty string",
			at(name),
			typeof at(name) === "string" && at(name).length > 0,
		);
	}
	for (const name of [
		"DM",
		"GROUP_DM",
		"GUILD_TEXT",
		"GUILD_VOICE",
		"GUILD_CATEGORY",
		"GUILD_STAGE_VOICE",
		"GUILD_FORUM",
	]) {
		const path = `DiscordConstants.ChannelTypes.${name}`;
		check(path, "number", at(path), typeof at(path) === "number");
	}
	for (const name of ["VIEW_CHANNEL", "CONNECT"]) {
		const path = `DiscordConstants.Permissions.${name}`;
		check(path, "bigint", at(path), typeof at(path) === "bigint");
	}
	for (const path of [
		"Components.Tooltip",
		"Components.TextElement",
		"RolePill",
	]) {
		const value = at(path);
		check(
			path,
			"React component",
			value,
			typeof value === "function" ||
				(value != null &&
					typeof value === "object" &&
					[Symbol.for("react.memo"), Symbol.for("react.forward_ref")].includes(
						value.$$typeof,
					)),
		);
	}
	for (const name of ["STANDARD", "HEADER_PRIMARY", "HEADER_SECONDARY"]) {
		const path = `Components.TextElement.Colors.${name}`;
		check(path, "defined color", at(path), at(path) != null);
	}
	for (const name of ["SIZE_14", "SIZE_16", "SIZE_24", "SIZE_32"]) {
		const path = `Components.TextElement.Sizes.${name}`;
		check(path, "defined size", at(path), at(path) != null);
	}
	check(
		"DEFAULT_AVATARS",
		"nonempty array of URLs",
		modules.DEFAULT_AVATARS,
		Array.isArray(modules.DEFAULT_AVATARS) &&
			modules.DEFAULT_AVATARS.length > 0 &&
			modules.DEFAULT_AVATARS.every(
				(url) => typeof url === "string" && url.length > 0,
			),
	);
	return checks;
}

module.exports = async () => {
	const deadline = Date.now() + 10000;
	// Wait on the API and logged-in store, rather than a private performance marker.
	while (
		typeof BdApi === "undefined" ||
		document.readyState !== "complete" ||
		!BdApi.Webpack.getStore("UserStore")?.getCurrentUser()
	) {
		if (Date.now() >= deadline)
			throw new Error(
				"Discord Stable must be logged in and BetterDiscord loaded (waited 10s)",
			);
		await new Promise((resolve) => setTimeout(resolve, 250));
	}
	const channel = window.DiscordNative.app.getReleaseChannel();
	if (channel !== "stable")
		throw new Error(`Expected Discord Stable, received ${channel}`);
	const versions = {
		channel,
		discord: window.DiscordNative.app.getVersion(),
		build: window.GLOBAL_ENV?.BUILD_NUMBER ?? "unknown",
		hash: window.GLOBAL_ENV?.VERSION_HASH ?? "unknown",
		betterDiscord: BdApi.version,
	};
	const loader = require("../src/utils/modules.js");
	// Lazy chunks may arrive after login. Retry fresh discovery for a bounded time;
	// persistent incompatibilities still return the exact failed contracts.
	let modules;
	let checks;
	do {
		loader.UnloadModules();
		try {
			modules = loader.getModules();
			checks = inspect(modules);
		} catch (error) {
			checks = [
				{
					name: "module discovery",
					expected: "successful loader execution",
					actual: String(error),
					passed: false,
				},
			];
		}
		if (checks.every((check) => check.passed) && loader.loaded_successfully)
			break;
		if (Date.now() >= deadline) break;
		await new Promise((resolve) => setTimeout(resolve, 500));
	} while (Date.now() < deadline);

	if (checks.every((check) => check.passed)) {
		// Exercise the real factory used for synthetic categories without touching stores.
		try {
			const record = modules.createChannelRecord({
				id: "shc_test_hidden",
				guild_id: "shc_test",
				name: "Hidden Channels",
				type: modules.DiscordConstants.ChannelTypes.GUILD_CATEGORY,
				permission_overwrites: [],
			});
			Object.defineProperty(record, "position", { value: 1, writable: true });
			record.position = 2;
			checks.push({
				name: "createChannelRecord category behavior",
				expected: "category fields and writable position",
				passed:
					record.id === "shc_test_hidden" &&
					record.guild_id === "shc_test" &&
					record.name === "Hidden Channels" &&
					record.type ===
						modules.DiscordConstants.ChannelTypes.GUILD_CATEGORY &&
					record.position === 2,
			});
		} catch (error) {
			checks.push({
				name: "createChannelRecord category behavior",
				passed: false,
				actual: String(error),
			});
		}
	}
	return { versions, loaded: loader.loaded_successfully, checks };
};
