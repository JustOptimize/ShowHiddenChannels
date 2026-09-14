// @ts-check

export const Logger = {
	isDebugging: false,
	_log: (type, color, ...x) => {
		const line = new Error().stack || "";
		const lines = line.split("\n");

		// console.debug does not work in stable
		const consoleMethod = type === "debug" ? "log" : type;

		console[consoleMethod](
			`%c SHC %c ${type.toUpperCase()} %c`,
			"background: #5968f0; color: white; font-weight: bold; border-radius: 5px;",
			`background: ${color}; color: black; font-weight: bold; border-radius: 5px; margin-left: 5px;`,
			"",
			...x,
			`\n\n${lines[3].substring(lines[3].indexOf("("), lines[3].lastIndexOf(")") + 1)}`,
		);
	},
	info: (...x) => {
		Logger._log("log", "#2f3781", ...x);
	},
	warn: (...x) => {
		Logger._log("warn", "#f0b859", ...x);
	},
	err: (...x) => {
		Logger._log("error", "#f05959", ...x);
	},
	debug: (...x) => {
		if (!Logger.isDebugging) return;

		Logger._log("debug", "#f05959", ...x);
	},
};

export let loaded_successfully = true;

let cachedModules = null;

const {
	React,
	ReactDOM,
	ReactUtils: ReactTools,
	DOM: DOMTools,
	ContextMenu,
	Utils: Utilities,
	// Webpack: WebpackModules,
	Components: { Tooltip, Text: TextElement },
} = BdApi;

// TODO: Add this to above when BdApi types are updated
/**
 * @type {typeof BdApi.Webpack & { getBySource: (source: string | RegExp, ...filters: string[]) => any, getMangled: (module: string | RegExp, filters: Record<string,  (...args: any[]) => boolean>) => any }}
 */
// @ts-expect-error
const WebpackModules = BdApi.Webpack;

export function getModules() {
	if (cachedModules) return cachedModules;
	loaded_successfully = true;
	const DiscordPermissions = WebpackModules.getModule((m) => m.ADD_REACTIONS, {
		searchExports: true,
	});
	const ImageResolver = WebpackModules.getByKeys(
		"getUserAvatarURL",
		"getGuildIconURL",
	);
	const UserStore = WebpackModules.getStore("UserStore");

	// DiscordModules
	const ChannelStore = WebpackModules.getStore("ChannelStore");
	const GuildStore = WebpackModules.getStore("GuildStore");
	const GuildRoleStore = WebpackModules.getStore("GuildRoleStore");

	const MessageActions = WebpackModules.getByKeys(
		"jumpToMessage",
		"_sendMessage",
		"fetchMessages", // This gets patched
	);
	const GuildChannelStore = WebpackModules.getStore("GuildChannelStore");
	const GuildMemberStore = WebpackModules.getByKeys("getMember");
	const NavigationUtils = WebpackModules.getMangled(
		"transitionTo - Transitioning to ",
		{
			transitionTo: WebpackModules.Filters.byStrings(
				"transitionTo - Transitioning to ",
			),
		},
	);

	if (!NavigationUtils?.transitionTo) {
		loaded_successfully = false;
		Logger.err("Failed to load NavigationUtils", NavigationUtils);
	}

	const LocaleManager = WebpackModules.getByKeys("setLocale");

	const DiscordConstants = {};

	DiscordConstants.Permissions = DiscordPermissions;

	DiscordConstants.ChannelTypes = WebpackModules.getModule(
		(x) => x.GUILD_VOICE,
		{
			searchExports: true,
		},
	);

	DiscordConstants.NOOP = () => {};

	if (
		!DiscordConstants.Permissions ||
		!DiscordConstants.ChannelTypes ||
		!DiscordConstants.NOOP
	) {
		loaded_successfully = false;
		Logger.err("Failed to load DiscordConstants", DiscordConstants);
	}

	const chat = WebpackModules.getByKeys("chat", "chatContent")?.chat;

	const Route = WebpackModules.getBySource(/.ImpressionTypes.PAGE,name:\w+,/);

	const ChannelItemRenderer = WebpackModules.getModule((m) =>
		m.render?.toString().includes(".ALL_MESSAGES"),
	);

	const ChannelItemUtils = WebpackModules.getMangled(
		/hasActiveThreads:[a-zA-Z]+=!1,/,
		{
			icon: WebpackModules.Filters.byRegex(/hasActiveThreads:[a-zA-Z]+=!1,/),
		},
	);

	const RolePill = WebpackModules.getMangled("overflow-more-roles-", {
		RolePill: (m) => m?.render != null,
	})?.RolePill;

	const ChannelPermissionStore = WebpackModules.getByKeys(
		"getChannelPermissions",
	);
	if (!ChannelPermissionStore?.can) {
		loaded_successfully = false;
		Logger.err("Failed to load ChannelPermissionStore", ChannelPermissionStore);
	}

	const fluxDispatcherHandlers = WebpackModules.getByKeys(
		"dispatch",
		"subscribe",
		{ searchExports: true },
	)?._actionHandlers._dependencyGraph;

	const PermissionStoreActionHandler =
		fluxDispatcherHandlers?.nodes[
			WebpackModules.getStore("PermissionStore")._dispatchToken
		].actionHandler;

	const ChannelListStoreActionHandler =
		fluxDispatcherHandlers?.nodes[
			WebpackModules.getStore("ChannelListStore")._dispatchToken
		].actionHandler;

	const container = WebpackModules.getByKeys(
		"container",
		"hubContainer",
	)?.container;

	const createChannelRecord = WebpackModules.getByKeys(
		"createChannelRecord",
	)?.createChannelRecord;

	const ChannelListStore = WebpackModules.getStore("ChannelListStore");
	const DEFAULT_AVATARS =
		WebpackModules.getByKeys("DEFAULT_AVATARS")?.DEFAULT_AVATARS;

	const { iconItem, actionIcon } = WebpackModules.getByKeys("iconItem") || {};

	const ReadStateStore = WebpackModules.getStore("ReadStateStore");
	const Voice = WebpackModules.getByKeys("getVoiceStateStats");

	const UserMentions = WebpackModules.getByKeys("handleUserContextMenu");

	const ProfileActions = WebpackModules.getMangled(
		"setFlag: user cannot be undefined",
		{
			fetchProfile: WebpackModules.Filters.byStrings(
				"USER_PROFILE_FETCH_START",
			),
		},
	);

	if (!ProfileActions.fetchProfile) {
		loaded_successfully = false;
		Logger.err("Failed to load ProfileActions", ProfileActions);
	}

	const PermissionUtils = WebpackModules.getMangled(
		".computeLurkerPermissionsAllowList()",
		{
			can: WebpackModules.Filters.byStrings("excludeGuildPermissions:"),
		},
	);

	const CategoryStore = WebpackModules.getByKeys(
		"isCollapsed",
		"getCollapsedCategories",
	);

	const modules = {
		/* Library */
		Utilities,
		DOMTools,
		Logger,
		ReactTools,

		/* Discord Modules (From lib) */
		ChannelStore,
		MessageActions,
		React,
		ReactDOM,
		GuildChannelStore,
		GuildMemberStore,
		LocaleManager,
		NavigationUtils,
		ImageResolver,
		UserStore,

		ContextMenu,
		Components: {
			Tooltip,
			TextElement,
		},

		/* Manually found modules */
		GuildStore,
		GuildRoleStore,
		DiscordConstants,
		chat,
		Route,
		ChannelItemRenderer,
		ChannelItemUtils,
		ChannelPermissionStore,
		PermissionStoreActionHandler,
		ChannelListStoreActionHandler,
		container,
		createChannelRecord,
		ChannelListStore,
		DEFAULT_AVATARS,
		iconItem,
		actionIcon,
		ReadStateStore,
		Voice,
		RolePill,
		UserMentions,
		ProfileActions,
		PermissionUtils,
		CategoryStore,
	};

	loaded_successfully = checkVariables(modules);
	cachedModules = modules;
	return modules;
}

export function UnloadModules() {
	cachedModules = null;
}

function checkVariables(modules) {
	for (const variable in modules) {
		if (!modules[variable]) {
			Logger.err(`Variable not found: ${variable}`);
		}
	}

	for (const component in modules.Components) {
		if (!modules.Components[component]) {
			Logger.err(`Component not found: ${component}`);
		}
	}

	if (!loaded_successfully) {
		Logger.err("Failed to load internal modules.");
		return false;
	}

	if (
		Object.values(modules).includes(undefined) ||
		Object.values(modules.Components).includes(undefined)
	) {
		Logger.err("Some modules are undefined.");
		return false;
	}

	Logger.info("All variables found.");
	return true;
}
