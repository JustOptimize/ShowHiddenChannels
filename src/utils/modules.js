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
} = global.ZeresPluginLibrary;

const Tooltip = window.BdApi?.Components?.Tooltip;
const ContextMenu = window.BdApi?.ContextMenu;
const Utils = window.BdApi?.Utils;
const BetterWebpackModules = window.BdApi.Webpack;

const GuildStore = WebpackModules.getByProps('getGuild', 'getGuildCount', 'getGuildIds', 'getGuilds', 'isLoaded');
const DiscordConstants = WebpackModules.getByProps('Permissions', 'ChannelTypes');
const chat = WebpackModules.getByProps('chat', 'chatContent')?.chat;

const Route = WebpackModules.getModule((m) => m?.default?.toString().includes('.Route,{...'));

const ChannelItem = WebpackModules.getByProps('ChannelItemIcon');
const ChannelItemUtils = WebpackModules.getByProps('getChannelIconComponent', 'getChannelIconTooltipText', 'getSimpleChannelIconComponent');

const rolePill = WebpackModules.getByProps('rolePill', 'rolePillBorder')?.rolePill;
const ChannelPermissionStore = WebpackModules.getByProps('getChannelPermissions');

const PermissionStoreActionHandler = Utils?.findInTree(
    Dispatcher,
    (c) => c?.name == 'PermissionStore' && typeof c?.actionHandler?.CONNECTION_OPEN === 'function'
)?.actionHandler;
const ChannelListStoreActionHandler = Utils?.findInTree(
    Dispatcher,
    (c) => c?.name == 'ChannelListStore' && typeof c?.actionHandler?.CONNECTION_OPEN === 'function'
)?.actionHandler;

const container = WebpackModules.getByProps('container', 'hubContainer')?.container;
const Channel = WebpackModules.getByProps('ChannelRecordBase')?.ChannelRecordBase;

const ChannelListStore = WebpackModules.getByProps('getGuildWithoutChangingCommunityRows');
const DEFAULT_AVATARS = WebpackModules.getByProps('DEFAULT_AVATARS')?.DEFAULT_AVATARS;

const Icon = WebpackModules.getByProps('iconItem');
const [iconItem, actionIcon] = [Icon?.iconItem, Icon?.actionIcon];

const ReadStateStore = BetterWebpackModules.getStore('ReadStateStore');
const Voice = WebpackModules.getByProps('getVoiceStateStats');
const RolePill = WebpackModules.getByProps('MemberRole')?.MemberRole;
const UserMentions = WebpackModules.getByProps('handleUserContextMenu');
const ChannelUtils = WebpackModules.getByProps('renderTopic', 'HeaderGuildBreadcrumb', 'renderTitle');

const ProfileActions = WebpackModules.getByProps('fetchProfile', 'getUser');
const PermissionUtils = WebpackModules.getByProps('isRoleHigher', 'makeEveryoneOverwrite');

const CategoryStore = WebpackModules.getByProps('isCollapsed', 'getCollapsedCategories');

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
    for (const variable in UsedModules) {
        if (!UsedModules[variable]) {
            Logger.error('Variable not found: ' + variable);
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
