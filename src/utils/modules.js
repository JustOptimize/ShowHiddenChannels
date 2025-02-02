const FallbackLibrary = {
    Logger: {
        info: console.info,
        warn: console.warn,
        err: console.error,
    },
    Settings: {},
    DiscordModules: {},
};

const {
    WebpackModules,
    Utilities,
    DOMTools,
    Logger,
    ReactTools,
    Modals,

    Settings: { SettingField, SettingPanel, SettingGroup, Switch, RadioGroup },

    DiscordModules: {
        ChannelStore,
        MessageActions,
        TextElement,
        React,
        ReactDOM,
        GuildChannelsStore,
        GuildMemberStore,
        NavigationUtils,
        ImageResolver,
        UserStore,
        Dispatcher,
        DiscordPermissions,
    },
} = global.ZeresPluginLibrary ?? FallbackLibrary;

let key = null;
let loaded_successfully_internal = true;

const Tooltip = window.BdApi?.Components?.Tooltip;
const ContextMenu = window.BdApi?.ContextMenu;
const Utils = window.BdApi?.Utils;
const BetterWebpackModules = window.BdApi.Webpack;

const GuildStore = WebpackModules?.getByProps('getGuild', 'getGuildCount', 'getGuildIds', 'getGuilds', 'isLoaded');
const LocaleManager = WebpackModules?.getByProps('setLocale');

const DiscordConstants = {};

DiscordConstants.Permissions = DiscordPermissions;

DiscordConstants.ChannelTypes = Object.values(
    WebpackModules?.getModule(
        (m) =>
            m &&
            typeof m === 'object' &&
            !Array.isArray(m) &&
            Object.values(m).some((v) => v?.ADMINISTRATOR) &&
            Object.values(m).some((v) => v?.GUILD_VOICE)
    )
).find((c) => c.GUILD_VOICE);

DiscordConstants.NOOP = () => {};

if (!DiscordConstants.Permissions || !DiscordConstants.ChannelTypes || !DiscordConstants.NOOP) {
    loaded_successfully_internal = false;
    console.error('Failed to load DiscordConstants', DiscordConstants);
}

const chat = WebpackModules?.getByProps('chat', 'chatContent')?.chat;

const Route = WebpackModules.getModule((m) => /.ImpressionTypes.PAGE,name:\w+,/.test(m?.Z?.toString()));

const ChannelItem = WebpackModules.getModule(
    (m) =>
        m &&
        typeof m === 'object' &&
        Object.values(m).some((c) => c && typeof c === 'function' && c?.toString?.()?.includes('.iconContainerWithGuildIcon,'))
);
const ChannelItemKey = Object.keys(ChannelItem).find((k) => {
    return ChannelItem[k]?.toString()?.includes('.ALL_MESSAGES');
});

const ChannelItemUtils = WebpackModules?.getModule(
    (m) =>
        m &&
        typeof m === 'object' &&
        Object.keys(m).some((k) => m[k] && typeof m[k] === 'function' && m[k]?.toString()?.includes('["/7EhaW"]') || m[k]?.toString()?.includes('.Messages.CHANNEL_TOOLTIP_RULES'))
);

const ChannelItemUtilsKey = Object.keys(ChannelItemUtils || {}).find((k) => {
    return ChannelItemUtils[k]?.toString()?.includes(',textFocused:');
});

const RolePill = WebpackModules?.getModule(
    (m) =>
        m &&
        typeof m === 'object' &&
        Object.values(m).some((c) => c && typeof c === 'function' && c?.toString()?.includes('.u3RVsL') || c?.toString()?.includes('.Messages.USER_PROFILE_REMOVE_ROLE'))
);

const ChannelPermissionStore = WebpackModules?.getByProps('getChannelPermissions');
if (!ChannelPermissionStore?.can) {
    loaded_successfully_internal = false;
    console.error('Failed to load ChannelPermissionStore', ChannelPermissionStore);
}

const PermissionStoreActionHandler = Utils?.findInTree(
    Dispatcher,
    (c) => c?.name === 'PermissionStore' && typeof c?.actionHandler?.CONNECTION_OPEN === 'function'
)?.actionHandler;
const ChannelListStoreActionHandler = Utils?.findInTree(
    Dispatcher,
    (c) => c?.name === 'ChannelListStore' && typeof c?.actionHandler?.CONNECTION_OPEN === 'function'
)?.actionHandler;

const container = WebpackModules?.getByProps('container', 'hubContainer')?.container;

// const Channel = WebpackModules?.getByProps('ChannelRecordBase')?.ChannelRecordBase;
const ChannelRecordBase = WebpackModules?.getModule((m) => m?.Sf?.prototype?.isManaged)?.Sf;

const ChannelListStore = BetterWebpackModules.getStore("ChannelListStore");
const DEFAULT_AVATARS = WebpackModules?.getByProps('DEFAULT_AVATARS')?.DEFAULT_AVATARS;

const Icon = WebpackModules?.getByProps('iconItem');
const [iconItem, actionIcon] = [Icon?.iconItem, Icon?.actionIcon];

const ReadStateStore = BetterWebpackModules.getStore('ReadStateStore');
const Voice = WebpackModules?.getByProps('getVoiceStateStats');

const UserMentions = WebpackModules?.getByProps('handleUserContextMenu');
const ChannelUtils = {
    renderTopic: WebpackModules?.getModule(
        (m) =>
            m &&
            typeof m === 'object' &&
            Object.keys(m).find((k) => {
                key = k;
                return m[k] && typeof m[k] === 'function' && m[k]?.toString()?.includes('.GROUP_DM:return null');
            })
    )?.[key],
};
if (!ChannelUtils.renderTopic) {
    loaded_successfully_internal = false;
    console.error('Failed to load ChannelUtils', ChannelUtils);
}

const ProfileActions = {
    fetchProfile: WebpackModules?.getModule(
        (m) =>
            m &&
            typeof m === 'object' &&
            Object.keys(m).find((k) => {
                key = k;
                return m[k] && typeof m[k] === 'function' && m[k]?.toString()?.includes('USER_PROFILE_FETCH_START');
            })
    )?.[key],
};
if (!ProfileActions.fetchProfile) {
    loaded_successfully_internal = false;
    console.error('Failed to load ProfileActions', ProfileActions);
}

const PermissionUtilsModule = WebpackModules?.getModule((m) =>
    Object.values(m).some((c) => c && typeof c === 'function' && c?.toString()?.includes('.computeLurkerPermissionsAllowList()'))
);

Object.keys(PermissionUtilsModule).find((k) => {
    key = k;
    return PermissionUtilsModule[k]?.toString()?.includes('excludeGuildPermissions:');
});
const PermissionUtils = {
    can: PermissionUtilsModule?.[key],
};

const CategoryStore = WebpackModules?.getByProps('isCollapsed', 'getCollapsedCategories');

const UsedModules = {
    /* Library */
    Utilities,
    DOMTools,
    Logger,
    ReactTools,
    Modals,

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
    Utils,

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
        Logger.err('ZeresPluginLibrary not found.');
        return false;
    }

    for (const variable in UsedModules) {
        if (!UsedModules[variable]) {
            Logger.err(`Variable not found: ${variable}`);
        }
    }

    if (!loaded_successfully_internal) {
        Logger.err('Failed to load internal modules.');
        return false;
    }

    if (Object.values(UsedModules).includes(undefined)) {
        return false;
    }

    Logger.info('All variables found.');
    return true;
}

export const loaded_successfully = checkVariables();
export const ModuleStore = UsedModules;
