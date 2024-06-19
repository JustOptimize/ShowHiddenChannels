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
        LocaleManager,
        NavigationUtils,
        ImageResolver,
        UserStore,
        Dispatcher,
    },
} = global.ZeresPluginLibrary ?? FallbackLibrary;

let key = null;

const Tooltip = window.BdApi?.Components?.Tooltip;
const ContextMenu = window.BdApi?.ContextMenu;
const Utils = window.BdApi?.Utils;
const BetterWebpackModules = window.BdApi.Webpack;

const GuildStore = WebpackModules?.getByProps('getGuild', 'getGuildCount', 'getGuildIds', 'getGuilds', 'isLoaded');

// const DiscordConstants = WebpackModules?.getModule((m) => m?.Plq?.ADMINISTRATOR && m?.Plq?.VIEW_CHANNEL && m?.Plq?.SEND_MESSAGES);
// DiscordConstants.Permissions = DiscordConstants.Permissions || DiscordConstants.Plq;
// DiscordConstants.ChannelTypes = DiscordConstants.ChannelTypes || DiscordConstants.d4z;

const DiscordConstants = WebpackModules?.getModule((m) => m?.Plq?.ADMINISTRATOR && m?.Plq?.VIEW_CHANNEL && m?.Plq?.SEND_MESSAGES);

const chat = WebpackModules?.getByProps('chat', 'chatContent')?.chat;

const Route = WebpackModules.getModule((m) =>
    // /.ImpressionTypes.PAGE,name:\w+,/
    Object.values(m).some((c) => c?.toString?.()?.includes('ImpressionTypes.PAGE'))
);

key = undefined;
Object.keys(Route).find((k) => {
    if (Route[k]?.toString?.().includes('ImpressionTypes.PAGE')) {
        key = k;
        return true;
    }
});
const RouteKey = key;

key = undefined;
const ChannelItem = WebpackModules.getModule((m) =>
    Object.values(m).some((c) => c?.toString?.()?.includes('.iconContainerWithGuildIcon,'))
);
Object.keys(ChannelItem).find((k) => {
    key = k;
    return ChannelItem[k]?.toString()?.includes('.ALL_MESSAGES');
});
const ChannelItemKey = key;

// const ChannelItemUtils = filterBySource(WebpackModules, '.Messages.CHANNEL_TOOLTIP_RULES');
const ChannelItemUtils = WebpackModules?.getModule((m) =>
    Object.keys(m).find((k) => {
        key = k;
        return m[k]?.toString()?.includes('.Messages.CHANNEL_TOOLTIP_RULES');
    })
)?.[key];

const RolePillClasses = WebpackModules?.getByProps('rolePill', 'rolePillBorder');
const rolePill = RolePillClasses?.rolePill;
// const RolePill = filterBySource(WebpackModules, '.Messages.USER_PROFILE_REMOVE_ROLE,');
const RolePill = WebpackModules?.getModule((m) =>
    Object.values(m).some((c) => c?.toString()?.includes('.Messages.USER_PROFILE_REMOVE_ROLE,'))
);

const ChannelPermissionStore = WebpackModules?.getByProps('getChannelPermissions');

const PermissionStoreActionHandler = Utils?.findInTree(
    Dispatcher,
    (c) => c?.name == 'PermissionStore' && typeof c?.actionHandler?.CONNECTION_OPEN === 'function'
)?.actionHandler;
const ChannelListStoreActionHandler = Utils?.findInTree(
    Dispatcher,
    (c) => c?.name == 'ChannelListStore' && typeof c?.actionHandler?.CONNECTION_OPEN === 'function'
)?.actionHandler;

const container = WebpackModules?.getByProps('container', 'hubContainer')?.container;

// const Channel = WebpackModules?.getByProps('ChannelRecordBase')?.ChannelRecordBase;
const ChannelRecordBase = WebpackModules?.getModule((m) => m?.Sf?.prototype?.isManaged)?.Sf;

const ChannelListStore = WebpackModules?.getByProps('getGuildWithoutChangingCommunityRows');
const DEFAULT_AVATARS = WebpackModules?.getByProps('DEFAULT_AVATARS')?.DEFAULT_AVATARS;

const Icon = WebpackModules?.getByProps('iconItem');
const [iconItem, actionIcon] = [Icon?.iconItem, Icon?.actionIcon];

const ReadStateStore = BetterWebpackModules.getStore('ReadStateStore');
const Voice = WebpackModules?.getByProps('getVoiceStateStats');

const UserMentions = WebpackModules?.getByProps('handleUserContextMenu');
const ChannelUtils = {
    renderTopic: WebpackModules?.getModule((m) =>
        Object.keys(m).find((k) => {
            key = k;
            return m[k]?.toString()?.includes('.guildBreadcrumbIcon,');
        })
    )?.[key],
};

// const ProfileActions = WebpackModules?.getByProps('fetchProfile', 'getUser');
const ProfileActions = {
    fetchProfile: WebpackModules?.getModule((m) =>
        Object.keys(m).find((k) => {
            key = k;
            return m[k]?.toString()?.includes('USER_PROFILE_FETCH_START');
        })
    )?.[key],
};

const PermissionUtilsModule = WebpackModules?.getModule((m) =>
    Object.values(m).some((c) => c?.toString()?.includes('.computeLurkerPermissionsAllowList()'))
);

Object.keys(PermissionUtilsModule).find((k) => {
    key = k;
    console.log(k, PermissionUtilsModule[k]?.toString());
    return PermissionUtilsModule[k]?.toString()?.includes('excludeGuildPermissions:');
});
const PermissionUtils = {
    can: PermissionUtilsModule?.[key],
};

console.log(PermissionUtils);

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
    RouteKey,
    ChannelItem,
    ChannelItemKey,
    ChannelItemUtils,
    rolePill,
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
            Logger.err('Variable not found: ' + variable);
        }
    }

    if (Object.values(UsedModules).includes(undefined)) {
        return false;
    }

    Logger.info('All variables found.');
    return true;
}

export const loaded_successfully = checkVariables();
export const ModuleStore = UsedModules;
