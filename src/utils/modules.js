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

const DiscordConstants = WebpackModules?.getModule((m) =>
    Object.values(m).some((c) => {
        key = Object.keys(m).find((k) => m[k] === c);
        return c.ADMINISTRATOR && c.VIEW_CHANNEL && c.SEND_MESSAGES;
    })
);

console.log(DiscordConstants, key);

DiscordConstants.Permissions = DiscordConstants[key];

// Search for channeltypes key
key = undefined;
Object.keys(DiscordConstants).find((k) => {
    key = k;
    return DiscordConstants[k]?.toString()?.includes('GUILD_TEXT');
});

DiscordConstants.ChannelTypes = {
    GUILD_TEXT: 0,
    DM: 1,
    GUILD_VOICE: 2,
    GROUP_DM: 3,
    GUILD_CATEGORY: 4,
    GUILD_ANNOUNCEMENT: 5,
    ANNOUNCEMENT_THREAD: 10,
    PUBLIC_THREAD: 11,
    PRIVATE_THREAD: 12,
    GUILD_STAGE_VOICE: 13,
    GUILD_DIRECTORY: 14,
    GUILD_FORUM: 15,
    GUILD_MEDIA: 16,
};

console.log('asda', DiscordConstants);

// const DiscordConstants = {

const chat = WebpackModules?.getByProps('chat', 'chatContent')?.chat;

const Route = WebpackModules.getModule((m) =>
    // /.ImpressionTypes.PAGE,name:\w+,/
    Object.values(m).some((c) => c?.toString?.()?.includes('ImpressionTypes.PAGE'))
);

const RouteKey = Object.keys(Route).find((k) => {
    if (Route[k]?.toString?.().includes('ImpressionTypes.PAGE')) {
        return true;
    }
});

const ChannelItem = WebpackModules.getModule((m) =>
    Object.values(m).some((c) => c?.toString?.()?.includes('.iconContainerWithGuildIcon,'))
);
const ChannelItemKey = Object.keys(ChannelItem).find((k) => {
    return ChannelItem[k]?.toString()?.includes('.ALL_MESSAGES');
});

const ChannelItemUtils = WebpackModules?.getModule((m) =>
    Object.keys(m).some((k) => {
        if (!m[k]) return false;

        return m[k]?.toString()?.includes('.Messages.CHANNEL_TOOLTIP_RULES');
        // return Object.values(m[k]).some((c) => c?.toString()?.includes('.Messages.CHANNEL_TOOLTIP_RULES'));
    })
);

console.log(ChannelItemUtils);

const ChannelItemUtilsKey = Object.keys(ChannelItemUtils).find((k) => {
    return ChannelItemUtils[k]?.toString()?.includes('.AnnouncementsWarningIcon');
});

const RolePillClasses = WebpackModules?.getByProps('rolePill', 'rolePillBorder');
const rolePill = RolePillClasses?.rolePill;

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
    RouteKey,
    ChannelItem,
    ChannelItemKey,
    ChannelItemUtils,
    ChannelItemUtilsKey,
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
