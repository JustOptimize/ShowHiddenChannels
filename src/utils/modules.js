const FallbackLibrary = {
    Logger: {
        info: console.info,
        warn: console.warn,
        err: console.error,
    },
    Settings: {},
    DiscordModules: {},
};

const filterBySource = (WebpackModules, source) => {
    return WebpackModules.getModule(
        (m) =>
            (typeof m === 'object' && m?.toString?.()?.includes(source)) ||
            Object.values(m).some(
                (c) =>
                    c &&
                    ((typeof c === 'object' &&
                        (c?.toString?.()?.includes(source) || Object.values(c).some((v) => v?.toString?.()?.includes(source)))) ||
                        c?.toString?.()?.includes(source))
            )
    );
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

const Tooltip = window.BdApi?.Components?.Tooltip;
const ContextMenu = window.BdApi?.ContextMenu;
const Utils = window.BdApi?.Utils;
const BetterWebpackModules = window.BdApi.Webpack;

const GuildStore = WebpackModules?.getByProps('getGuild', 'getGuildCount', 'getGuildIds', 'getGuilds', 'isLoaded');

const DiscordConstants = WebpackModules?.getModule((m) => m?.Plq?.ADMINISTRATOR && m?.Plq?.VIEW_CHANNEL && m?.Plq?.SEND_MESSAGES);
DiscordConstants.Permissions = DiscordConstants.Permissions || DiscordConstants.Plq;
DiscordConstants.ChannelTypes = DiscordConstants.ChannelTypes || DiscordConstants.d4z;

const chat = WebpackModules?.getByProps('chat', 'chatContent')?.chat;

const Route = WebpackModules.getModule((m) =>
    Object.values(m).some((c) => ['impressionName', 'impressionProperties', 'disableTrack'].every((s) => c?.toString().includes(s)))
);

const ChannelItem = WebpackModules.getModule((m) =>
    Object.values(m).some((c) => c?.toString?.()?.includes('.iconContainerWithGuildIcon,'))
);

// const ChannelItemUtils = WebpackModules?.getByProps(
//     'getChannelIconComponent',
//     'getChannelIconTooltipText',
//     'getSimpleChannelIconComponent'
// );
const ChannelItemUtils = filterBySource(WebpackModules, '.Messages.CHANNEL_TOOLTIP_RULES');

const RolePillClasses = WebpackModules?.getByProps('rolePill', 'rolePillBorder');
const rolePill = RolePillClasses?.rolePill;
const RolePill = filterBySource(WebpackModules, '.Messages.USER_PROFILE_REMOVE_ROLE,');

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
const Channel = WebpackModules?.getModule((m) => m?.Sf?.prototype?.isManaged)?.Sf;

const ChannelListStore = WebpackModules?.getByProps('getGuildWithoutChangingCommunityRows');
const DEFAULT_AVATARS = WebpackModules?.getByProps('DEFAULT_AVATARS')?.DEFAULT_AVATARS;

const Icon = WebpackModules?.getByProps('iconItem');
const [iconItem, actionIcon] = [Icon?.iconItem, Icon?.actionIcon];

const ReadStateStore = BetterWebpackModules.getStore('ReadStateStore');
const Voice = WebpackModules?.getByProps('getVoiceStateStats');

const UserMentions = WebpackModules?.getByProps('handleUserContextMenu');
const ChannelUtils = filterBySource(WebpackModules, '.guildBreadcrumbIcon,');

// const ProfileActions = WebpackModules?.getByProps('fetchProfile', 'getUser');
const ProfileActions = filterBySource(WebpackModules, 'UserProfileModalActionCreators');
// const PermissionUtils = WebpackModules?.getByProps('isRoleHigher', 'makeEveryoneOverwrite');
const PermissionUtils = filterBySource(WebpackModules, '.computeLurkerPermissionsAllowList()');

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
    ChannelItemUtils,
    rolePill,
    ChannelPermissionStore,
    PermissionStoreActionHandler,
    ChannelListStoreActionHandler,
    container,
    Channel,
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
