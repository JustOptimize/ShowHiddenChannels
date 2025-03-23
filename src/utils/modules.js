// @ts-check

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

/**
 * @type {null | string}
 */
const key = null;
let loaded_successfully_internal = true;

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
 * @type {typeof BdApi.Webpack & { getBySource: (source: string | RegExp, ...filters: string[]) => any, getMangled: (module: string, filters: Record<string,  (...args: any[]) => boolean>) => any }}
 */
// @ts-ignore
const WebpackModules = BdApi.Webpack;

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
const GuildChannelStore = WebpackModules.getStore("GuildChannelStore");
const GuildMemberStore = WebpackModules.getByKeys("getMember");
const NavigationUtils = WebpackModules.getMangled(
	"transitionTo - Transitioning to ",
	{
		transitionTo: BdApi.Webpack.Filters.byStrings(
			"transitionTo - Transitioning to ",
		),
	},
);

if (!NavigationUtils.transitionTo) {
	loaded_successfully_internal = false;
	Logger.err("Failed to load NavigationUtils", NavigationUtils);
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
	Logger.err("Failed to load DiscordConstants", DiscordConstants);
}

const chat = WebpackModules.getByKeys("chat", "chatContent")?.chat;

const Route = WebpackModules.getBySource(/.ImpressionTypes.PAGE,name:\w+,/);

const ChannelItem = WebpackModules.getBySource(
	"forceInteractable",
	"unreadImportant:void 0)}),",
);
const ChannelItemKey = Object.keys(ChannelItem).find((k) => {
	return ChannelItem[k]?.toString()?.includes(".ALL_MESSAGES");
});

const ChannelItemUtils = WebpackModules.getMangled(".ToS;", {
	icon: WebpackModules.Filters.byStrings(",textFocused:"),
});

const RolePill = WebpackModules.getBySource(".roleRemoveButton,")?.Z;

const ChannelPermissionStore = WebpackModules.getByKeys(
	"getChannelPermissions",
);
if (!ChannelPermissionStore?.can) {
	loaded_successfully_internal = false;
	Logger.err("Failed to load ChannelPermissionStore", ChannelPermissionStore);
}

const fluxDispatcherHandlers = BdApi.Webpack.getByKeys("dispatch", "subscribe")
	._actionHandlers._dependencyGraph;

const PermissionStoreActionHandler =
	fluxDispatcherHandlers.nodes[
		BdApi.Webpack.getStore("PermissionStore")._dispatchToken
	].actionHandler;

const ChannelListStoreActionHandler =
	fluxDispatcherHandlers.nodes[
		BdApi.Webpack.getStore("ChannelListStore")._dispatchToken
	].actionHandler;

const container = WebpackModules.getByKeys(
	"container",
	"hubContainer",
)?.container;

const ChannelRecordBase = WebpackModules.getMangled("isManaged(){return null", {
	ChannelRecordBase: WebpackModules.Filters.byStrings(
		"isManaged(){return null",
	),
})?.ChannelRecordBase;

const ChannelListStore = WebpackModules.getStore("ChannelListStore");
const DEFAULT_AVATARS =
	WebpackModules.getByKeys("DEFAULT_AVATARS")?.DEFAULT_AVATARS;

const { iconItem, actionIcon } = WebpackModules.getByKeys("iconItem") || {};

const ReadStateStore = WebpackModules.getStore("ReadStateStore");
const Voice = WebpackModules.getByKeys("getVoiceStateStats");

const UserMentions = WebpackModules.getByKeys("handleUserContextMenu");

const ChannelUtils = WebpackModules.getMangled(".guildBreadcrumbIcon,", {
	renderTopic: WebpackModules.Filters.byStrings(".GROUP_DM:return null"),
});
if (!ChannelUtils?.renderTopic) {
	loaded_successfully_internal = false;
	Logger.err("Failed to load ChannelUtils", ChannelUtils);
}

const ProfileActions = WebpackModules.getMangled(
	"setFlag: user cannot be undefined",
	{
		fetchProfile: WebpackModules.Filters.byStrings("USER_PROFILE_FETCH_START"),
	},
);

if (!ProfileActions.fetchProfile) {
	loaded_successfully_internal = false;
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

const UsedModules = {
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
	Dispatcher,

	ContextMenu,
	Components: {
		Tooltip,
		TextElement,
	},

	/* Manually found modules */
	GuildStore,
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
	for (const variable in UsedModules) {
		if (!UsedModules[variable]) {
			Logger.err(`Variable not found: ${variable}`);
		}
	}

	for (const component in UsedModules.Components) {
		if (!UsedModules.Components[component]) {
			Logger.err(`Component not found: ${component}`);
		}
	}

	if (!loaded_successfully_internal) {
		Logger.err("Failed to load internal modules.");
		return false;
	}

	if (
		Object.values(UsedModules).includes(undefined) ||
		// @ts-ignore
		Object.values(UsedModules.Components).includes(undefined)
	) {
		return false;
	}

	Logger.info("All variables found.");
	return true;
}

export const loaded_successfully = checkVariables();
export const ModuleStore = UsedModules;
export default ModuleStore;
