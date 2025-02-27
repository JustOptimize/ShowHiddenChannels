// @ts-check

const FallbackLibrary = {
	Settings: {},
};

const Logger = {
	isDebugging: false,
	_log: (type, color, ...x) => {
		const line = new Error().stack || "";
		const lines = line.split("\n");
		console[type](
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

const {
	Settings: { SettingField, SettingPanel, SettingGroup, Switch, RadioGroup },
} = global.ZeresPluginLibrary ?? FallbackLibrary;

/**
 * @type {null | string}
 */
let key = null;
let loaded_successfully_internal = true;

const React = BdApi.React;
const ReactDOM = BdApi.ReactDOM;
const ReactTools = BdApi.ReactUtils;
const DOMTools = BdApi.DOM;
const Tooltip = BdApi.Components?.Tooltip;
const ContextMenu = BdApi.ContextMenu;
/**
 * @type {typeof BdApi.Webpack & { getBySource: (source: string, ...filters: string[]) => any }}
 */
// @ts-ignore
const WebpackModules = BdApi.Webpack;

const Utilities = BdApi.Utils;

const DiscordPermissions = WebpackModules.getModule((m) => m.ADD_REACTIONS, {
	searchExports: true,
});
const Dispatcher = WebpackModules.getByKeys("dispatch", "subscribe");
const ImageResolver = WebpackModules.getByKeys(
	"getUserAvatarURL",
	"getGuildIconURL",
);
const UserStore = WebpackModules.getStore("UserStore");

// DiscordModules
const ChannelStore = WebpackModules.getStore("ChannelStore");
const GuildStore = WebpackModules.getStore("GuildStore");
const MessageActions = WebpackModules.getByKeys(
	"jumpToMessage",
	"_sendMessage",
	"fetchMessages", // This gets patched
);
const TextElement = WebpackModules.getModule(
	(m) => m?.Sizes?.SIZE_32 && m.Colors,
);
const GuildChannelsStore = WebpackModules.getByKeys(
	"getChannels",
	"getDefaultChannel",
);
const GuildMemberStore = WebpackModules.getByKeys("getMember");
const NavigationUtils = {
	transitionTo: WebpackModules.getModule(
		(m) => m?.toString?.().includes(`"transitionTo - Transitioning to "`),
		{ searchExports: true },
	),
};
if (!NavigationUtils.transitionTo) {
	loaded_successfully_internal = false;
	console.error("Failed to load NavigationUtils", NavigationUtils);
}

const LocaleManager = WebpackModules.getByKeys("setLocale");

const DiscordConstants = {};

DiscordConstants.Permissions = DiscordPermissions;

DiscordConstants.ChannelTypes = WebpackModules.getModule((x) => x.GUILD_VOICE, {
	searchExports: true,
});

DiscordConstants.NOOP = () => {};

if (
	!DiscordConstants.Permissions ||
	!DiscordConstants.ChannelTypes ||
	!DiscordConstants.NOOP
) {
	loaded_successfully_internal = false;
	console.error("Failed to load DiscordConstants", DiscordConstants);
}

const chat = WebpackModules.getByKeys("chat", "chatContent")?.chat;

const Route = WebpackModules.getModule((m) =>
	/.ImpressionTypes.PAGE,name:\w+,/.test(m?.Z?.toString()),
);

const ChannelItem = WebpackModules.getBySource(
	"forceInteractable",
	"unreadImportant:void 0)}),",
);
const ChannelItemKey = Object.keys(ChannelItem).find((k) => {
	return ChannelItem[k]?.toString()?.includes(".ALL_MESSAGES");
});

const ChannelItemUtils = WebpackModules?.getModule(
	(m) =>
		m &&
		typeof m === "object" &&
		Object.keys(m).some(
			(k) =>
				(m[k] &&
					typeof m[k] === "function" &&
					m[k]?.toString()?.includes('["/7EhaW"]')) ||
				m[k]?.toString()?.includes(".Messages.CHANNEL_TOOLTIP_RULES"),
		),
);

const ChannelItemUtilsKey = Object.keys(ChannelItemUtils || {}).find((k) => {
	return ChannelItemUtils[k]?.toString()?.includes(",textFocused:");
});

const RolePill = WebpackModules.getBySource(".roleRemoveButton,");

const ChannelPermissionStore = WebpackModules.getByKeys(
	"getChannelPermissions",
);
if (!ChannelPermissionStore?.can) {
	loaded_successfully_internal = false;
	console.error(
		"Failed to load ChannelPermissionStore",
		ChannelPermissionStore,
	);
}

const PermissionStoreActionHandler = Utilities?.findInTree(
	Dispatcher,
	(c) =>
		c?.name === "PermissionStore" &&
		typeof c?.actionHandler?.CONNECTION_OPEN === "function",
)?.actionHandler;
const ChannelListStoreActionHandler = Utilities?.findInTree(
	Dispatcher,
	(c) =>
		c?.name === "ChannelListStore" &&
		typeof c?.actionHandler?.CONNECTION_OPEN === "function",
)?.actionHandler;

const container = WebpackModules.getByKeys(
	"container",
	"hubContainer",
)?.container;

// const Channel = BetterWebpackModules.getByKeys('ChannelRecordBase')?.ChannelRecordBase;
const ChannelRecordBase = WebpackModules?.getModule(
	(m) => m?.Sf?.prototype?.isManaged,
)?.Sf;

const ChannelListStore = WebpackModules.getStore("ChannelListStore");
const DEFAULT_AVATARS =
	WebpackModules.getByKeys("DEFAULT_AVATARS")?.DEFAULT_AVATARS;

const Icon = WebpackModules.getByKeys("iconItem");
const [iconItem, actionIcon] = [Icon?.iconItem, Icon?.actionIcon];

const ReadStateStore = WebpackModules.getStore("ReadStateStore");
const Voice = WebpackModules.getByKeys("getVoiceStateStats");

const UserMentions = WebpackModules.getByKeys("handleUserContextMenu");
const ChannelUtils = {
	renderTopic: WebpackModules?.getModule(
		(m) =>
			m &&
			typeof m === "object" &&
			Object.keys(m).find((k) => {
				key = k;
				return (
					m[k] &&
					typeof m[k] === "function" &&
					m[k]?.toString()?.includes(".GROUP_DM:return null")
				);
			}),
	)?.[key || ""],
};
if (!ChannelUtils.renderTopic) {
	loaded_successfully_internal = false;
	console.error("Failed to load ChannelUtils", ChannelUtils);
}

const ProfileActions = {
	fetchProfile: WebpackModules?.getModule(
		(m) =>
			m &&
			typeof m === "object" &&
			Object.keys(m).find((k) => {
				key = k;
				return (
					m[k] &&
					typeof m[k] === "function" &&
					m[k]?.toString()?.includes("USER_PROFILE_FETCH_START")
				);
			}),
	)?.[key || ""],
};
if (!ProfileActions.fetchProfile) {
	loaded_successfully_internal = false;
	console.error("Failed to load ProfileActions", ProfileActions);
}

const PermissionUtilsModule = WebpackModules?.getModule((m) =>
	Object.values(m).some(
		(c) =>
			c &&
			typeof c === "function" &&
			c?.toString()?.includes(".computeLurkerPermissionsAllowList()"),
	),
);

Object.keys(PermissionUtilsModule).find((k) => {
	key = k;
	return PermissionUtilsModule[k]
		?.toString()
		?.includes("excludeGuildPermissions:");
});
const PermissionUtils = {
	can: PermissionUtilsModule?.[key || ""],
};

const CategoryStore = WebpackModules.getByKeys(
	"isCollapsed",
	"getCollapsedCategories",
);

const UsedModules = {
	/* Library */
	Utilities,
	DOMTools,
	Logger,
	ReactTools,

	/* Settings */
	SettingField,
	SettingPanel,
	SettingGroup,
	Switch,
	RadioGroup,

	/* Discord Modules (From lib) */
	ChannelStore,
	MessageActions,
	TextElement,
	React,
	ReactDOM,
	GuildChannelsStore,
	GuildMemberStore,
	LocaleManager,
	NavigationUtils,
	ImageResolver,
	UserStore,
	Dispatcher,

	/* BdApi */
	Tooltip,
	ContextMenu,

	/* Manually found modules */
	GuildStore,
	DiscordConstants,
	chat,
	Route,
	ChannelItem,
	ChannelItemKey,
	ChannelItemUtils,
	ChannelItemUtilsKey,
	ChannelPermissionStore,
	PermissionStoreActionHandler,
	ChannelListStoreActionHandler,
	container,
	ChannelRecordBase,
	ChannelListStore,
	DEFAULT_AVATARS,
	iconItem,
	actionIcon,
	ReadStateStore,
	Voice,
	RolePill,
	UserMentions,
	ChannelUtils,
	ProfileActions,
	PermissionUtils,
	CategoryStore,
};

function checkVariables() {
	if (!global.ZeresPluginLibrary) {
		Logger.err("ZeresPluginLibrary not found.");
		return false;
	}

	for (const variable in UsedModules) {
		if (!UsedModules[variable]) {
			Logger.err(`Variable not found: ${variable}`);
		}
	}

	if (!loaded_successfully_internal) {
		Logger.err("Failed to load internal modules.");
		return false;
	}

	if (Object.values(UsedModules).includes(undefined)) {
		return false;
	}

	Logger.info("All variables found.");
	return true;
}

export const loaded_successfully = checkVariables();
export const ModuleStore = UsedModules;
