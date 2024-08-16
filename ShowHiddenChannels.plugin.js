/**
 * @name ShowHiddenChannels
 * @displayName Show Hidden Channels (SHC)
 * @version 0.5.3
 * @author JustOptimize (Oggetto)
 * @authorId 619203349954166804
 * @source https://github.com/JustOptimize/ShowHiddenChannels
 * @description A plugin which displays all hidden Channels and allows users to view information about them, this won't allow you to read them (impossible).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/AdminRolesComponent.jsx":
/*!************************************************!*\
  !*** ./src/components/AdminRolesComponent.jsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const {
  TextElement,
  RolePill,
  DiscordConstants
} = (__webpack_require__(/*! ../utils/modules */ "./src/utils/modules.js").ModuleStore);
const React = BdApi.React;
const AdminRolesElement = ({
  guild,
  settings,
  roles
}) => {
  if (!settings['showAdmin']) return null;
  if (settings['showAdmin'] == 'channel') return null;
  const adminRoles = [];
  Object.values(roles).forEach(role => {
    if ((role.permissions & BigInt(8)) == BigInt(8) && (settings['showAdmin'] == 'include' || settings['showAdmin'] == 'exclude' && !role.tags?.bot_id)) {
      adminRoles.push(role);
    }
  });
  if (!adminRoles?.length) {
    return null;
  }
  return BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.INTERACTIVE_NORMAL,
    style: {
      borderTop: '1px solid var(--background-tertiary)',
      padding: 5
    }
  }, "Admin roles:", BdApi.React.createElement("div", {
    style: {
      paddingTop: 5
    }
  }, adminRoles.map(m => BdApi.React.createElement(RolePill, {
    key: m.id,
    canRemove: false,
    className: `shc-rolePill`,
    disableBorderColor: true,
    guildId: guild.id,
    onRemove: DiscordConstants.NOOP,
    role: m
  }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (React.memo(AdminRolesElement));

/***/ }),

/***/ "./src/components/ChannelRolesComponent.jsx":
/*!**************************************************!*\
  !*** ./src/components/ChannelRolesComponent.jsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ChannelRolesComponent)
/* harmony export */ });
const {
  TextElement,
  RolePill,
  DiscordConstants
} = (__webpack_require__(/*! ../utils/modules */ "./src/utils/modules.js").ModuleStore);
function ChannelRolesComponent({
  channel,
  guild,
  settings,
  roles
}) {
  const channelRoles = Object.values(channel.permissionOverwrites).filter(role => role !== undefined && role?.type == 0 && (
  //* 1024n = VIEW_CHANNEL permission
  //* 8n = ADMINISTRATOR permission
  //* If role is ADMINISTRATOR it can view channel even if overwrites deny VIEW_CHANNEL
  settings.showAdmin && (roles[role.id].permissions & BigInt(8)) == BigInt(8) ||
  //* If overwrites allow VIEW_CHANNEL (it will override the default role permissions)
  (role.allow & BigInt(1024)) == BigInt(1024) ||
  //* If role can view channel by default and overwrites don't deny VIEW_CHANNEL
  roles[role.id].permissions & BigInt(1024) && (role.deny & BigInt(1024)) == 0));
  return BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.INTERACTIVE_NORMAL,
    style: {
      borderTop: '1px solid var(--background-tertiary)',
      padding: 8
    }
  }, "Channel-specific roles:", BdApi.React.createElement("div", {
    style: {
      paddingTop: 8
    }
  }, !channelRoles?.length && BdApi.React.createElement("span", null, "None"), channelRoles?.length > 0 && channelRoles.map(m => BdApi.React.createElement(RolePill, {
    key: m.id,
    canRemove: false,
    className: `shc-rolePill`,
    disableBorderColor: true,
    guildId: guild.id,
    onRemove: DiscordConstants.NOOP,
    role: roles[m.id]
  }))));
}

/***/ }),

/***/ "./src/components/ForumComponent.jsx":
/*!*******************************************!*\
  !*** ./src/components/ForumComponent.jsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ForumComponent)
/* harmony export */ });
const TextElement = global.ZeresPluginLibrary?.DiscordModules?.TextElement;
function ForumComponent({
  channel
}) {
  if (channel.type != 15) return null;
  if (!channel.availableTags && !channel.topic) {
    return null;
  }
  return BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.HEADER_SECONDARY,
    size: TextElement.Sizes.SIZE_24,
    style: {
      margin: '16px auto',
      backgroundColor: 'var(--background-secondary)',
      padding: 24,
      borderRadius: 8,
      color: 'var(--text-normal)',
      fontWeight: 'bold',
      maxWidth: '40vw'
    }
  }, "Forum", BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.INTERACTIVE_NORMAL,
    size: TextElement.Sizes.SIZE_14,
    style: {
      marginTop: 24
    }
  }, channel.availableTags && channel.availableTags.length > 0 ? 'Tags: ' + channel.availableTags.map(tag => tag.name).join(', ') : 'Tags: No tags avaiable'), channel.topic && BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.INTERACTIVE_NORMAL,
    size: TextElement.Sizes.SIZE_14,
    style: {
      marginTop: 16
    }
  }, "Guidelines: ", channel.topic), !channel.topic && BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.INTERACTIVE_NORMAL,
    size: TextElement.Sizes.SIZE_14,
    style: {
      marginTop: 8
    }
  }, "Guidelines: No guidelines avaiable"));
}

/***/ }),

/***/ "./src/components/HiddenChannelIcon.jsx":
/*!**********************************************!*\
  !*** ./src/components/HiddenChannelIcon.jsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HiddenChannelIcon: () => (/* binding */ HiddenChannelIcon)
/* harmony export */ });
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const Tooltip = BdApi.Components.Tooltip;
const React = BdApi.React;
function HiddenChannelComponent({
  icon,
  iconItem,
  actionIcon
}) {
  return BdApi.React.createElement(Tooltip, {
    text: "Hidden Channel"
  }, props => BdApi.React.createElement("div", _extends({
    className: iconItem,
    style: {
      display: 'block'
    }
  }, props), icon == 'lock' && BdApi.React.createElement("svg", {
    className: actionIcon,
    viewBox: "0 0 24 24"
  }, BdApi.React.createElement("path", {
    fill: "currentColor",
    d: "M17 11V7C17 4.243 14.756 2 12 2C9.242 2 7 4.243 7 7V11C5.897 11 5 11.896 5 13V20C5 21.103 5.897 22 7 22H17C18.103 22 19 21.103 19 20V13C19 11.896 18.103 11 17 11ZM12 18C11.172 18 10.5 17.328 10.5 16.5C10.5 15.672 11.172 15 12 15C12.828 15 13.5 15.672 13.5 16.5C13.5 17.328 12.828 18 12 18ZM15 11H9V7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7V11Z"
  })), icon == 'eye' && BdApi.React.createElement("svg", {
    className: actionIcon,
    viewBox: "0 0 24 24"
  }, BdApi.React.createElement("path", {
    fill: "currentColor",
    d: "M12 5C5.648 5 1 12 1 12C1 12 5.648 19 12 19C18.352 19 23 12 23 12C23 12 18.352 5 12 5ZM12 16C9.791 16 8 14.21 8 12C8 9.79 9.791 8 12 8C14.209 8 16 9.79 16 12C16 14.21 14.209 16 12 16Z"
  }), BdApi.React.createElement("path", {
    fill: "currentColor",
    d: "M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
  }), BdApi.React.createElement("polygon", {
    fill: "currentColor",
    points: "22.6,2.7 22.6,2.8 19.3,6.1 16,9.3 16,9.4 15,10.4 15,10.4 10.3,15 2.8,22.5 1.4,21.1 21.2,1.3 "
  }))));
}
const HiddenChannelIcon = React.memo(HiddenChannelComponent);

/***/ }),

/***/ "./src/components/IconSwitchWrapper.jsx":
/*!**********************************************!*\
  !*** ./src/components/IconSwitchWrapper.jsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IconSwitchWrapper: () => (/* binding */ IconSwitchWrapper)
/* harmony export */ });
const React = BdApi.React;
function IconSwitchWrapper({
  icon,
  value,
  onChange,
  children,
  note
}) {
  const [enabled, setEnabled] = React.useState(value);
  return BdApi.React.createElement("div", null, BdApi.React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: '16px',
      marginTop: '16px'
    }
  }, BdApi.React.createElement("img", {
    src: icon,
    width: 48,
    height: 48,
    title: "Click to toggle",
    style: {
      borderRadius: '360px',
      cursor: 'pointer',
      border: enabled ? '3px solid green' : '3px solid grey',
      marginRight: '8px'
    },
    onClick: () => {
      onChange(!enabled);
      setEnabled(!enabled);
    }
  }), BdApi.React.createElement("div", {
    style: {
      maxWidth: '89%'
    }
  }, BdApi.React.createElement("div", {
    style: {
      fontSize: '20px',
      color: 'var(--header-primary)',
      fontWeight: '600'
    }
  }, children), BdApi.React.createElement("div", {
    style: {
      color: 'var(--header-secondary)',
      fontSize: '16px'
    }
  }, note))));
}

/***/ }),

/***/ "./src/components/Lockscreen.jsx":
/*!***************************************!*\
  !*** ./src/components/Lockscreen.jsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Lockscreen: () => (/* binding */ Lockscreen)
/* harmony export */ });
/* harmony import */ var _UserMentionsComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UserMentionsComponent */ "./src/components/UserMentionsComponent.jsx");
/* harmony import */ var _ChannelRolesComponent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ChannelRolesComponent */ "./src/components/ChannelRolesComponent.jsx");
/* harmony import */ var _AdminRolesComponent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AdminRolesComponent */ "./src/components/AdminRolesComponent.jsx");
/* harmony import */ var _ForumComponent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ForumComponent */ "./src/components/ForumComponent.jsx");
/* harmony import */ var _utils_date__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/date */ "./src/utils/date.js");
const React = BdApi.React;





const {
  TextElement,
  GuildStore,
  ChannelUtils
} = (__webpack_require__(/*! ../utils/modules */ "./src/utils/modules.js").ModuleStore);
const CHANNEL_TYPES = {
  0: 'text',
  2: 'voice',
  4: 'category',
  5: 'news',
  6: 'store',
  13: 'stage'
};
const Lockscreen = React.memo(({
  chat,
  channel,
  settings
}) => {
  const guild = GuildStore.getGuild(channel.guild_id);
  const guildRoles = GuildStore.getRoles(guild.id);
  return BdApi.React.createElement("div", {
    className: ['shc-hidden-chat-content', chat].filter(Boolean).join(' '),
    style: {
      justifyContent: 'center',
      alignItems: 'center'
    }
  }, BdApi.React.createElement("div", {
    className: "shc-hidden-notice"
  }, BdApi.React.createElement("img", {
    style: {
      WebkitUserDrag: 'none',
      maxHeight: 128,
      margin: '0 auto'
    },
    src: settings['hiddenChannelIcon'] == 'eye' ? 'https://raw.githubusercontent.com/JustOptimize/ShowHiddenChannels/main/assets/eye.png' : '/assets/755d4654e19c105c3cd108610b78d01c.svg'
  }), BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.HEADER_PRIMARY,
    size: TextElement.Sizes.SIZE_32,
    style: {
      marginTop: 20,
      fontWeight: 'bold'
    }
  }, `This is a hidden ${CHANNEL_TYPES[channel.type] ?? 'unknown'} channel`), BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.HEADER_SECONDARY,
    size: TextElement.Sizes.SIZE_16,
    style: {
      marginTop: 8
    }
  }, "You cannot see the contents of this channel. ", channel.topic && channel.type != 15 && 'However, you may see its topic.'), channel.topic && channel.type != 15 && (ChannelUtils?.renderTopic(channel, guild) || "ChannelUtils module is missing, topic won't be shown."), channel?.iconEmoji && BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.INTERACTIVE_NORMAL,
    size: TextElement.Sizes.SIZE_14,
    style: {
      marginTop: 16
    }
  }, "Icon emoji: ", channel.iconEmoji.name ?? channel.iconEmoji.id), channel.rateLimitPerUser > 0 && BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.INTERACTIVE_NORMAL,
    size: TextElement.Sizes.SIZE_14
  }, "Slowmode: ", (0,_utils_date__WEBPACK_IMPORTED_MODULE_4__.convertToHMS)(channel.rateLimitPerUser)), channel.nsfw && BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.INTERACTIVE_NORMAL,
    size: TextElement.Sizes.SIZE_14
  }, "Age-Restricted Channel (NSFW) \uD83D\uDD1E"), channel.bitrate && channel.type == 2 && BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.INTERACTIVE_NORMAL,
    size: TextElement.Sizes.SIZE_14
  }, "Bitrate: ", channel.bitrate / 1000, "kbps"), BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.INTERACTIVE_NORMAL,
    size: TextElement.Sizes.SIZE_14,
    style: {
      marginTop: 8
    }
  }, "Created on: ", (0,_utils_date__WEBPACK_IMPORTED_MODULE_4__.getDateFromSnowflake)(channel.id)), channel.lastMessageId && BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.INTERACTIVE_NORMAL,
    size: TextElement.Sizes.SIZE_14
  }, "Last message sent: ", (0,_utils_date__WEBPACK_IMPORTED_MODULE_4__.getDateFromSnowflake)(channel.lastMessageId)), settings['showPerms'] && channel.permissionOverwrites && BdApi.React.createElement("div", {
    style: {
      margin: '16px auto 0 auto',
      backgroundColor: 'var(--background-secondary)',
      padding: 10,
      borderRadius: 5,
      color: 'var(--text-normal)'
    }
  }, BdApi.React.createElement(_UserMentionsComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    channel: channel,
    guild: guild,
    settings: settings
  }), BdApi.React.createElement(_ChannelRolesComponent__WEBPACK_IMPORTED_MODULE_1__["default"], {
    channel: channel,
    guild: guild,
    settings: settings,
    roles: guildRoles
  }), BdApi.React.createElement(_AdminRolesComponent__WEBPACK_IMPORTED_MODULE_2__["default"], {
    guild: guild,
    settings: settings,
    roles: guildRoles
  })), BdApi.React.createElement(_ForumComponent__WEBPACK_IMPORTED_MODULE_3__["default"], {
    channel: channel
  })));
});

/***/ }),

/***/ "./src/components/UserMentionsComponent.jsx":
/*!**************************************************!*\
  !*** ./src/components/UserMentionsComponent.jsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UserMentionsComponent)
/* harmony export */ });
const React = BdApi.React;
const {
  TextElement,
  UserMentions,
  ProfileActions,
  GuildMemberStore,
  UserStore,
  DiscordConstants,
  PermissionUtils
} = (__webpack_require__(/*! ../utils/modules */ "./src/utils/modules.js").ModuleStore);
function UserMentionsComponent({
  channel,
  guild,
  settings
}) {
  const [userMentionComponents, setUserMentionComponents] = React.useState([]);
  const fetchMemberAndMap = async () => {
    setUserMentionComponents('Loading...');
    if (!settings.showPerms) {
      return setUserMentionComponents(['None']);
    }
    const allUserOverwrites = Object.values(channel.permissionOverwrites).filter(user => Boolean(user && user?.type === 1));
    for (const user of allUserOverwrites) {
      if (UserStore.getUser(user.id)) continue;
      await ProfileActions.fetchProfile(user.id, {
        guildId: guild.id,
        withMutualGuilds: false
      });
      if (allUserOverwrites.indexOf(user) !== allUserOverwrites.length - 1) {
        // Wait between 500ms and 2000ms
        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1500) + 500));
      }
    }
    const filteredUserOverwrites = Object.values(channel.permissionOverwrites).filter(user => Boolean(PermissionUtils.can({
      permission: DiscordConstants.Permissions.VIEW_CHANNEL,
      user: UserStore.getUser(user.id),
      context: channel
    }) && GuildMemberStore.isMember(guild.id, user.id)));
    if (!filteredUserOverwrites?.length) {
      return setUserMentionComponents(['None']);
    }
    const mentionArray = filteredUserOverwrites.map(m => UserMentions.react({
      userId: m.id,
      channelId: channel.id
    }, () => null, {
      noStyleAndInteraction: false
    }));
    return setUserMentionComponents(mentionArray);
  };
  React.useEffect(() => {
    fetchMemberAndMap();
  }, [channel.id, guild.id, settings.showPerms, channel.permissionOverwrites]);
  return BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.INTERACTIVE_NORMAL,
    size: TextElement.Sizes.SIZE_14
  }, "Users that can see this channel:", BdApi.React.createElement("div", {
    style: {
      marginTop: 8,
      marginBottom: 8,
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      gap: 8,
      padding: 8,
      paddingTop: 0
    }
  }, userMentionComponents));
}

/***/ }),

/***/ "./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".shc-hidden-notice {\n    display: flex;\n    flex-direction: column;\n    text-align: center;\n    overflow-y: auto;\n    padding: 10dvh 0px;\n    margin: 0px auto;\n    width: 100%;\n}\n\n.shc-hidden-notice > div[class^='divider'] {\n    display: none;\n}\n\n.shc-hidden-notice > div[class^='topic'] {\n    background-color: var(--background-secondary);\n    padding: 5px;\n    max-width: 50dvh;\n    text-overflow: ellipsis;\n    border-radius: 8px;\n    margin: 12px auto 0 auto;\n    overflow: visible;\n}\n\n.shc-rolePill {\n    background-color: var(--background-primary);\n    padding: 12px;\n    margin: 4px 0;\n}\n");

/***/ }),

/***/ "./src/utils/date.js":
/*!***************************!*\
  !*** ./src/utils/date.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertToHMS: () => (/* binding */ convertToHMS),
/* harmony export */   getDateFromSnowflake: () => (/* binding */ getDateFromSnowflake)
/* harmony export */ });
const { Logger, LocaleManager } = (__webpack_require__(/*! ./modules */ "./src/utils/modules.js").ModuleStore);

function convertToHMS(timeInSeconds) {
    timeInSeconds = Number(timeInSeconds);

    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor((timeInSeconds % 3600) % 60);

    const formatTime = (value, unit) => (value > 0 ? `${value} ${unit}${value > 1 ? 's' : ''}` : '');

    return [formatTime(hours, 'hour'), formatTime(minutes, 'minute'), formatTime(seconds, 'second')].join(' ');
}

function getDateFromSnowflake(snowflake) {
    try {
        const DISCORD_EPOCH = 1420070400000n;
        const id = BigInt(snowflake);
        const unix = (id >> 22n) + DISCORD_EPOCH;

        return new Date(Number(unix)).toLocaleString(LocaleManager._chosenLocale);
    } catch (err) {
        Logger.err(err);
        return '(Failed to get date)';
    }
}


/***/ }),

/***/ "./src/utils/modules.js":
/*!******************************!*\
  !*** ./src/utils/modules.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ModuleStore: () => (/* binding */ ModuleStore),
/* harmony export */   loaded_successfully: () => (/* binding */ loaded_successfully)
/* harmony export */ });
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
        Object.keys(m).some((k) => m[k] && typeof m[k] === 'function' && m[k]?.toString()?.includes('.Messages.CHANNEL_TOOLTIP_RULES'))
);

const ChannelItemUtilsKey = Object.keys(ChannelItemUtils).find((k) => {
    return ChannelItemUtils[k]?.toString()?.includes('.AnnouncementsWarningIcon');
});

const RolePill = WebpackModules?.getModule(
    (m) =>
        m &&
        typeof m === 'object' &&
        Object.values(m).some((c) => c && typeof c === 'function' && c?.toString()?.includes('.Messages.USER_PROFILE_REMOVE_ROLE,'))
);

const ChannelPermissionStore = WebpackModules?.getByProps('getChannelPermissions');
if (!ChannelPermissionStore?.can) {
    loaded_successfully_internal = false;
    console.error('Failed to load ChannelPermissionStore', ChannelPermissionStore);
}

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
            Logger.err('Variable not found: ' + variable);
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

const loaded_successfully = checkVariables();
const ModuleStore = UsedModules;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.css */ "./src/styles.css");


const config = {
    info: {
        name: 'ShowHiddenChannels',
        authors: [
            {
                name: 'JustOptimize (Oggetto)',
            },
        ],
        description:
            "A plugin which displays all hidden Channels and allows users to view information about them, this won't allow you to read them (impossible).",
        version: "0.5.3",
        github: 'https://github.com/JustOptimize/ShowHiddenChannels',
    },

    changelog: [
        {
            title: 'v0.5.3 - Module Fix',
            items: [
                'Removed deprecated rolePill module.',
            ], 
        },
        {
            title: 'v0.5.2 - Module Fix',
            items: [
                'Fixed the plugin not working due to a module not being found.',
            ],
        },
        {
            title: 'v0.5.1 - Refactor & Update System',
            items: [
                'Now using github releases tags to check for updates.',
                'Remove "return-" from the plugin name to avoid confusion.',
            ],
        },
    ],

    main: 'ShowHiddenChannels.plugin.js',
    github_short: 'JustOptimize/ShowHiddenChannels',
};

class MissingZeresDummy {
    constructor() {
        console.warn(
            'ZeresPluginLibrary is required for this plugin to work. Please install it from https://betterdiscord.app/Download?id=9'
        );
        this.downloadZLibPopup();
    }

    start() { }
    stop() { }

    getDescription() {
        return `The library plugin needed for ${config.info.name} is missing. Please enable this plugin, click the settings icon on the right and click "Download Now" to install it.`;
    }

    getSettingsPanel() {
        // Close Settings Panel and show modal to download ZLib
        const buttonClicker = document.createElement('oggetto');
        buttonClicker.addEventListener('DOMNodeInserted', () => {
            // Hide Settings Panel to prevent it from showing up before the modal
            buttonClicker.parentElement.parentElement.parentElement.style.display = 'none';

            // Close Settings Panel
            const buttonToClick = document.querySelector('.bd-button > div');
            buttonToClick.click();

            // Show modal to download ZLib
            this.downloadZLibPopup();
        });

        return buttonClicker;
    }

    async downloadZLib() {
        window.BdApi.UI.showToast('Downloading ZeresPluginLibrary...', {
            type: 'info',
        });

        // TODO: Use BdApi.Net.fetch
        eval('require')('request').get('https://betterdiscord.app/gh-redirect?id=9', async (err, resp, body) => {
            if (err || !body) return this.downloadZLibErrorPopup();

            if (!body.match(/(?<=version: ").*(?=")/)) {
                console.error('Failed to download ZeresPluginLibrary, this is not the correct content.');
                return this.downloadZLibErrorPopup();
            }

            await this.manageFile(body);
        });
    }

    manageFile(content) {
        this.downloadSuccessfulToast();

        new Promise((cb) => {
            eval('require')('fs').writeFile(
                eval('require')('path').join(window.BdApi.Plugins.folder, '0PluginLibrary.plugin.js'),
                content,
                cb
            );
        });
    }

    downloadSuccessfulToast() {
        window.BdApi.UI.showToast('Successfully downloaded ZeresPluginLibrary!', {
            type: 'success',
        });
    }

    downloadZLibPopup() {
        window.BdApi.UI.showConfirmationModal(
            'Library Missing',
            `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`,
            {
                confirmText: 'Download Now',
                cancelText: 'Cancel',
                onConfirm: () => this.downloadZLib(),
            }
        );
    }

    downloadZLibErrorPopup() {
        window.BdApi.UI.showConfirmationModal(
            'Error Downloading',
            `ZeresPluginLibrary download failed. Manually install plugin library from the link below.`,
            {
                confirmText: 'Visit Download Page',
                cancelText: 'Cancel',
                onConfirm: () => eval('require')('electron').shell.openExternal('https://betterdiscord.app/Download?id=9'),
            }
        );
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (!global.ZeresPluginLibrary
    ? MissingZeresDummy
    : (([Pl, Lib]) => {
        const plugin = (Plugin, Library) => {
            const ChannelTypes = ['GUILD_TEXT', 'GUILD_VOICE', 'GUILD_ANNOUNCEMENT', 'GUILD_STORE', 'GUILD_STAGE_VOICE', 'GUILD_FORUM'];

            const { Lockscreen } = __webpack_require__(/*! ./components/Lockscreen */ "./src/components/Lockscreen.jsx");
            const { HiddenChannelIcon } = __webpack_require__(/*! ./components/HiddenChannelIcon */ "./src/components/HiddenChannelIcon.jsx");

            const {
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
                React,
                ReactDOM,
                GuildChannelsStore,
                NavigationUtils,
                ImageResolver,

                /* BdApi */
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
                CategoryStore,
            } = (__webpack_require__(/*! ./utils/modules */ "./src/utils/modules.js").ModuleStore);

            // Patcher from the library variable is different from the one in the global scope
            const Patcher = Library.Patcher;

            const capitalizeFirst = (string) => `${string.charAt(0).toUpperCase()}${string.substring(1).toLowerCase()}`;
            const randomNo = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

            const defaultSettings = {
                hiddenChannelIcon: 'lock',
                sort: 'native',
                showPerms: true,
                showAdmin: 'channel',
                MarkUnread: false,

                checkForUpdates: true,

                // alwaysCollapse: false,
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

            return class ShowHiddenChannels extends Plugin {
                constructor() {
                    super();

                    this.hiddenChannelCache = {};

                    this.collapsed = {};
                    this.processContextMenu = this?.processContextMenu?.bind(this);
                    this.settings = Utilities.loadData(config.info.name, 'settings', defaultSettings);

                    this.can = ChannelPermissionStore.can.__originalFunction ?? ChannelPermissionStore.can;
                }

                async checkForUpdates() {
                    if (this.settings.debugMode) {
                        Logger.info('Checking for updates, current version: ' + config.info.version);
                    }

                    const tags_raw = await fetch(`https://api.github.com/repos/${config.github_short}/tags`);
                    if (!tags_raw || !tags_raw.ok) {
                        return window.BdApi.UI.showToast('(ShowHiddenChannels) Failed to check for updates.', {
                            type: 'error',
                        });
                    }

                    const tags = await tags_raw.json();
                    if (!tags || !tags.length) {
                        return window.BdApi.UI.showToast('(ShowHiddenChannels) Failed to check for updates.', {
                            type: 'error',
                        });
                    }

                    const latestVersion = tags[0]?.name?.replace('v', '');

                    if (this.settings.debugMode) {
                        Logger.info(`Latest version: ${latestVersion}`);
                    }

                    if (!latestVersion) {
                        BdApi.alert('Failed to check for updates, version not found.');
                        return Logger.err('Failed to check for updates, version not found.');
                    }

                    if (latestVersion <= config.info.version) {
                        return Logger.info('No updates found.');
                    }

                    window.BdApi.UI.showConfirmationModal(
                        'Update available',
                        `ShowHiddenChannels has an update available. Would you like to update to version ${latestVersion}?`,
                        {
                            confirmText: 'Update',
                            cancelText: 'Cancel',
                            danger: false,

                            onConfirm: async () => {
                                const SHCContent = await fetch('https://raw.githubusercontent.com/' + config.github_short + '/v' + latestVersion + '/' + config.main)
                                    .then((res) => res.text())
                                    .catch(() => {
                                        window.BdApi.UI.showToast('Failed to fetch the latest version.', {
                                            type: 'error',
                                        });
                                    });

                                this.proceedWithUpdate(SHCContent, latestVersion);
                            },

                            onCancel: () => {
                                window.BdApi.UI.showToast('Update cancelled.', {
                                    type: 'info',
                                });
                            },
                        }
                    );
                }

                async proceedWithUpdate(SHCContent, version) {
                    if (this.settings.debugMode) {
                        Logger.info(`Update confirmed by the user, updating to version ${version}`);
                    }

                    function failed() {
                        window.BdApi.UI.showToast('(ShowHiddenChannels) Failed to update.', {
                            type: 'error',
                        });
                    }

                    if (!SHCContent) return failed();

                    if (!SHCContent.match(/(?<=version: ").*(?=")/)) {
                        return failed();
                    }

                    try {
                        const fs = eval('require')('fs');
                        const path = eval('require')('path');

                        await fs.writeFile(path.join(window.BdApi.Plugins.folder, config.main), SHCContent, (err) => {
                            if (err) return failed();
                        });

                        window.BdApi.UI.showToast(`ShowHiddenChannels updated to version ${version}`, {
                            type: 'success',
                        });
                    } catch (err) {
                        return failed();
                    }
                }

                onStart() {
                    if (this.settings.checkForUpdates) {
                        this.checkForUpdates();
                    }

                    const { loaded_successfully } = __webpack_require__(/*! ./utils/modules */ "./src/utils/modules.js");

                    if (loaded_successfully) {
                        this.doStart();
                    } else {
                        window.BdApi.UI.showConfirmationModal(
                            '(SHC) Broken Modules',
                            `ShowHiddenChannels has detected that some modules are broken, would you like to start anyway? (This might break the plugin or Discord itself)`,
                            {
                                confirmText: 'Start anyway',
                                cancelText: 'Cancel',
                                danger: true,

                                onConfirm: () => {
                                    this.doStart();
                                },

                                onCancel: () => {
                                    window.BdApi.Plugins.disable('ShowHiddenChannels');
                                },
                            }
                        );
                    }
                }

                doStart() {
                    DOMTools.addStyle(config.info.name, _styles_css__WEBPACK_IMPORTED_MODULE_0__["default"]);
                    this.Patch();
                    this.rerenderChannels();
                }

                Patch() {
                    // Check for needed modules
                    if (
                        !ChannelRecordBase ||
                        !DiscordConstants ||
                        !ChannelStore ||
                        !ChannelPermissionStore?.can ||
                        !ChannelListStore?.getGuild ||
                        !DiscordConstants?.ChannelTypes
                    ) {
                        return window.BdApi.UI.showToast('(SHC) Some crucial modules are missing, aborting. (Wait for an update)', {
                            type: 'error',
                        });
                    }

                    Patcher.instead(ChannelRecordBase.prototype, 'isHidden', (channel) => {
                        return ![1, 3].includes(channel.type) && !this.can(DiscordConstants.Permissions.VIEW_CHANNEL, channel);
                    });

                    if (!ReadStateStore) {
                        window.BdApi.UI.showToast('(SHC) ReadStateStore module is missing, channels will be marked as unread.', {
                            type: 'warning',
                        });
                    }

                    Patcher.after(ReadStateStore, 'getGuildChannelUnreadState', (_, args, res) => {
                        if (this.settings.MarkUnread) return res;

                        return args[0]?.isHidden()
                            ? {
                                mentionCount: 0,
                                unread: false,
                            }
                            : res;
                    });

                    Patcher.after(ReadStateStore, 'getMentionCount', (_, args, res) => {
                        if (this.settings.MarkUnread) return res;

                        return ChannelStore.getChannel(args[0])?.isHidden() ? 0 : res;
                    });

                    Patcher.after(ReadStateStore, 'getUnreadCount', (_, args, res) => {
                        if (this.settings.MarkUnread) return res;

                        return ChannelStore.getChannel(args[0])?.isHidden() ? 0 : res;
                    });

                    Patcher.after(ReadStateStore, 'hasTrackedUnread', (_, args, res) => {
                        if (this.settings.MarkUnread) return res;

                        return res && !ChannelStore.getChannel(args[0])?.isHidden();
                    });

                    Patcher.after(ReadStateStore, 'hasUnread', (_, args, res) => {
                        if (this.settings.MarkUnread) return res;

                        return res && !ChannelStore.getChannel(args[0])?.isHidden();
                    });

                    Patcher.after(ReadStateStore, 'hasUnreadPins', (_, args, res) => {
                        if (this.settings.MarkUnread) return res;

                        return res && !ChannelStore.getChannel(args[0])?.isHidden();
                    });

                    //* Make hidden channel visible
                    Patcher.after(ChannelPermissionStore, 'can', (_, [permission, channel], res) => {
                        if (!channel?.isHidden?.()) return res;

                        if (permission == DiscordConstants.Permissions.VIEW_CHANNEL) {
                            return (
                                !this.settings['blacklistedGuilds'][channel.guild_id] &&
                                this.settings['channels'][DiscordConstants.ChannelTypes[channel.type]]
                            );
                        }

                        if (permission == DiscordConstants.Permissions.CONNECT) {
                            return false;
                        }

                        return res;
                    });

                    if (!Voice || !Route) {
                        window.BdApi.UI.showToast("(SHC) Voice or Route modules are missing, channel lockscreen won't work.", {
                            type: 'warning',
                        });
                    }

                    Patcher.after(Route, 'Z', (_, args, res) => {
                        if (!Voice || !Route) return res;

                        const channelId = res.props?.computedMatch?.params?.channelId;
                        const guildId = res.props?.computedMatch?.params?.guildId;
                        const channel = ChannelStore?.getChannel(channelId);

                        if (guildId && channel?.isHidden?.() && channel?.id != Voice.getChannelId()) {
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
                        window.BdApi.UI.showToast(
                            '(SHC) MessageActions module is missing, this mean that the plugin could be detected by Discord.',
                            {
                                type: 'warning',
                            }
                        );
                    }

                    Patcher.instead(MessageActions, 'fetchMessages', (instance, [fetchConfig], res) => {
                        if (ChannelStore.getChannel(fetchConfig.channelId)?.isHidden?.()) {
                            return;
                        }

                        return res.call(instance, fetchConfig);
                    });

                    if (this.settings['hiddenChannelIcon']) {
                        if (!ChannelItem || !ChannelItemKey) {
                            window.BdApi.UI.showToast("(SHC) ChannelItem module is missing, channel lock icon won't be shown.", {
                                type: 'warning',
                            });
                        }

                        Patcher.after(ChannelItem, ChannelItemKey ?? 'default', (_, [instance], res) => {
                            if (!instance?.channel?.isHidden()) {
                                return res;
                            }

                            const item = res?.props?.children?.props;
                            if (item?.className) {
                                item.className += ` shc-hidden-channel shc-hidden-channel-type-${instance.channel.type}`;
                            }

                            const children = Utilities.findInReactTree(
                                res,
                                (m) => m?.props?.onClick?.toString().includes('stopPropagation') && m.type === 'div'
                            );

                            if (children.props?.children) {
                                children.props.children = [
                                    React.createElement(HiddenChannelIcon, {
                                        icon: this.settings['hiddenChannelIcon'],
                                        iconItem: iconItem,
                                        actionIcon: actionIcon,
                                    }),
                                ];
                            }

                            const isInCallInThisChannel =
                                instance.channel.type == DiscordConstants.ChannelTypes.GUILD_VOICE && !instance.connected;
                            if (!isInCallInThisChannel) {
                                return res;
                            }

                            const wrapper = Utilities.findInReactTree(res, (channel) =>
                                channel?.props?.className?.includes('shc-hidden-channel-type-2')
                            );

                            if (!wrapper) {
                                return res;
                            }

                            wrapper.props.onMouseDown = () => { };
                            wrapper.props.onMouseUp = () => { };

                            const mainContent = wrapper?.props?.children[1]?.props?.children;

                            if (!mainContent) {
                                return res;
                            }

                            mainContent.props.onClick = () => {
                                if (instance.channel?.isGuildVocal()) {
                                    NavigationUtils.transitionTo(`/channels/${instance.channel.guild_id}/${instance.channel.id}`);
                                }
                            };
                            mainContent.props.href = null;

                            return res;
                        });
                    }

                    //* Remove lock icon from hidden voice channels
                    if (!ChannelItemUtils) {
                        window.BdApi.UI.showToast("(SHC) ChannelItemUtils is missing, voice channel lock icon won't be removed.", {
                            type: 'warning',
                        });
                    }

                    Patcher.before(ChannelItemUtils, ChannelItemUtilsKey ?? 'getChannelIconComponent', (_, args) => {
                        if (!args[2]) return;

                        if (args[0]?.isHidden?.() && args[2].locked) {
                            args[2].locked = false;
                        }
                    });

                    //* Manually collapse hidden channel category
                    if (!ChannelStore?.getChannel || !GuildChannelsStore?.getChannels) {
                        window.BdApi.UI.showToast(
                            "(SHC) ChannelStore or GuildChannelsStore are missing, extra category settings won't work.",
                            {
                                type: 'warning',
                            }
                        );
                    }

                    Patcher.after(ChannelStore, 'getChannel', (_, [channelId], res) => {
                        const guild_id = channelId?.replace('_hidden', '');
                        const isHiddenCategory = channelId?.endsWith('_hidden');

                        if (this.settings['sort'] !== 'extra' || !isHiddenCategory || this.settings['blacklistedGuilds'][guild_id]) {
                            return res;
                        }

                        const HiddenCategoryChannel = new ChannelRecordBase({
                            guild_id: guild_id,
                            id: channelId,
                            name: 'Hidden Channels',
                            type: DiscordConstants.ChannelTypes.GUILD_CATEGORY,
                        });

                        return HiddenCategoryChannel;
                    });

                    Patcher.after(ChannelStore, 'getMutableGuildChannelsForGuild', (_, [guildId], GuildChannels) => {
                        if (!GuildChannelsStore?.getChannels) return;

                        if (this.settings['sort'] !== 'extra' || this.settings['blacklistedGuilds'][guildId]) {
                            return;
                        }

                        const hiddenCategoryId = `${guildId}_hidden`;
                        const HiddenCategoryChannel = new ChannelRecordBase({
                            guild_id: guildId,
                            id: hiddenCategoryId,
                            name: 'Hidden Channels',
                            type: DiscordConstants.ChannelTypes.GUILD_CATEGORY,
                        });

                        const GuildCategories = GuildChannelsStore.getChannels(guildId)[DiscordConstants.ChannelTypes.GUILD_CATEGORY];
                        Object.defineProperty(HiddenCategoryChannel, 'position', {
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
                    });

                    Patcher.after(GuildChannelsStore, 'getChannels', (_, [guildId], res) => {
                        const GuildCategories = res[DiscordConstants.ChannelTypes.GUILD_CATEGORY];
                        const hiddenCategoryId = `${guildId}_hidden`;
                        const hiddenCategory = GuildCategories?.find((m) => m.channel.id == hiddenCategoryId);

                        if (!hiddenCategory) return res;

                        const OtherCategories = GuildCategories.filter((m) => m.channel.id !== hiddenCategoryId);
                        const newComparator =
                            (
                                OtherCategories[OtherCategories.length - 1] || {
                                    comparator: 0,
                                }
                            ).comparator + 1;

                        Object.defineProperty(hiddenCategory.channel, 'position', {
                            value: newComparator,
                            writable: true,
                        });

                        Object.defineProperty(hiddenCategory, 'comparator', {
                            value: newComparator,
                            writable: true,
                        });

                        return res;
                    });

                    //* Custom category or sorting order
                    Patcher.after(ChannelListStore, 'getGuild', (_, [guildId], res) => {
                        if (this.settings['blacklistedGuilds'][guildId]) {
                            return;
                        }

                        const guildChannels = res.guildChannels;
                        const specialCategories = [
                            guildChannels.favoritesCategory,
                            guildChannels.recentsCategory,
                            guildChannels.noParentCategory,
                            guildChannels.voiceChannelsCategory,
                        ];

                        switch (this.settings['sort']) {
                            case 'bottom': {
                                for (const category of specialCategories) {
                                    this.sortChannels(category);
                                }

                                for (const category of Object.values(guildChannels.categories)) {
                                    this.sortChannels(category);
                                }

                                break;
                            }

                            case 'extra': {
                                const hiddenCategoryId = `${guildId}_hidden`;
                                const HiddenCategory = res.guildChannels.categories[hiddenCategoryId];
                                const HiddenChannels = this.getHiddenChannelRecord(
                                    [
                                        ...specialCategories,
                                        ...Object.values(res.guildChannels.categories).filter(
                                            (category) => category.id !== hiddenCategoryId
                                        ),
                                    ],
                                    guildId
                                );

                                HiddenCategory.channels = Object.fromEntries(
                                    Object.entries(HiddenChannels.records).map(([id, channel]) => {
                                        channel.category = HiddenCategory;
                                        return [id, channel];
                                    })
                                );

                                HiddenCategory.isCollapsed =
                                    res.guildChannels.collapsedCategoryIds[hiddenCategoryId] ??
                                    CategoryStore.isCollapsed(hiddenCategoryId);
                                if (HiddenCategory.isCollapsed) {
                                    res.guildChannels.collapsedCategoryIds[hiddenCategoryId] = true;
                                }

                                HiddenCategory.shownChannelIds =
                                    res.guildChannels.collapsedCategoryIds[hiddenCategoryId] || HiddenCategory.isCollapsed
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

                        if (this.settings['shouldShowEmptyCategory']) {
                            this.patchEmptyCategoryFunction([
                                ...Object.values(res.guildChannels.categories).filter((m) => !m.id.includes('hidden')),
                            ]);
                        }

                        return res;
                    });

                    //* add entry in guild context menu
                    if (!ContextMenu?.patch) {
                        window.BdApi.UI.showToast('(SHC) ContextMenu is missing, skipping.', {
                            type: 'warning',
                        });
                    }

                    ContextMenu?.patch('guild-context', this.processContextMenu);
                }

                processContextMenu(menu, { guild }) {
                    const menuCategory = menu?.props?.children?.find((buttonCategory) => {
                        const children = buttonCategory?.props?.children;
                        return Array.isArray(children) && children.some((button) => button?.props?.id === 'hide-muted-channels');
                    });

                    if (!menuCategory || !guild) return;

                    menuCategory.props.children.push(
                        ContextMenu.buildItem({
                            type: 'toggle',
                            label: 'Disable SHC',
                            checked: this.settings['blacklistedGuilds'][guild.id],
                            action: () => {
                                this.settings['blacklistedGuilds'][guild.id] = !this.settings['blacklistedGuilds'][guild.id];
                                this.saveSettings();
                            },
                        })
                    );
                }

                // TODO: Maybe replace this
                patchEmptyCategoryFunction(categories) {
                    for (const category of categories) {
                        if (!category.shouldShowEmptyCategory.__originalFunction) {
                            Patcher.instead(category, 'shouldShowEmptyCategory', () => true);
                        }
                    }
                }

                sortChannels(category) {
                    if (!category || category.isCollapsed) return;

                    const channelArray = Object.values(category.channels);

                    const calculatePosition = (record) => {
                        return record.position + (record.isGuildVocal() ? 1000 : 0) + (record.isHidden() ? 10000 : 0);
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
                        // Get the channels that are hidden
                        const newHiddenChannels = Object.entries(category.channels).filter(([channelId]) =>
                            hiddenChannels.channels.some((channel) => channel.id === channelId)
                        );

                        // Add the channels to the cache and remove them from the original category
                        for (const [channelId, channel] of newHiddenChannels) {
                            const isCached = this.hiddenChannelCache[guildId].some(([cachedChannelId]) => cachedChannelId === channelId);

                            if (!isCached) {
                                this.hiddenChannelCache[guildId].push([channelId, channel]);
                            }

                            // Remove the channel from original category
                            delete category.channels[channelId];
                        }
                    }

                    return {
                        records: Object.fromEntries(this.hiddenChannelCache[guildId]),
                        channels: hiddenChannels ? hiddenChannels.channels : [],
                        amount: hiddenChannels ? hiddenChannels.amount : 0,
                    };
                }

                /**
                 * Retrieves the hidden channels for a given guild.
                 * @param {string} guildId - The ID of the guild.
                 * @returns {object} - An object containing the hidden channels and the amount of hidden channels.
                 */
                getHiddenChannels(guildId) {
                    if (!guildId) {
                        return {
                            channels: [],
                            amount: 0,
                        };
                    }

                    const guildChannels = ChannelStore.getMutableGuildChannelsForGuild(guildId);
                    const hiddenChannels = Object.values(guildChannels).filter(
                        (m) => m.isHidden() && m.type != DiscordConstants.ChannelTypes.GUILD_CATEGORY
                    );

                    const ChannelsAndCount = {
                        channels: hiddenChannels,
                        amount: hiddenChannels.length,
                    };
                    return ChannelsAndCount;
                }

                rerenderChannels() {
                    PermissionStoreActionHandler?.CONNECTION_OPEN();
                    ChannelListStoreActionHandler?.CONNECTION_OPEN();

                    this.forceUpdate(document.querySelector(`.${container}`));
                }

                forceUpdate(element) {
                    if (!element) return;

                    const toForceUpdate = ReactTools.getOwnerInstance(element);
                    const forceRerender = Patcher.instead(toForceUpdate, 'render', () => {
                        forceRerender();
                        return null;
                    });

                    toForceUpdate.forceUpdate(() => toForceUpdate.forceUpdate(() => { }));
                }

                onStop() {
                    Patcher.unpatchAll();
                    DOMTools.removeStyle(config.info.name);
                    ContextMenu.unpatch('guild-context', this.processContextMenu);
                    this.rerenderChannels();
                }

                getSettingsPanel() {
                    const { IconSwitchWrapper } = __webpack_require__(/*! ./components/IconSwitchWrapper */ "./src/components/IconSwitchWrapper.jsx");

                    class IconSwitch extends SettingField {
                        constructor(name, note, isChecked, onChange, options = {}) {
                            super(name, note, onChange);
                            this.disabled = options.disabled;
                            this.icon = options.icon;
                            this.value = isChecked;
                        }
                        onAdded() {
                            ReactDOM.createRoot(this.getElement()).render(
                                React.createElement(
                                    IconSwitchWrapper,
                                    {
                                        icon: this.icon,
                                        note: this.note,
                                        disabled: this.disabled,
                                        hideBorder: false,
                                        value: this.value,
                                        onChange: (e) => {
                                            this.onChange(e);
                                        },
                                    },
                                    this.name
                                )
                            );
                        }
                    }

                    return SettingPanel.build(
                        this.saveSettings.bind(this),
                        new SettingGroup('General Settings').append(
                            new RadioGroup(
                                'Hidden Channel Icon',
                                'What icon to show as indicator for hidden channels.',
                                this.settings['hiddenChannelIcon'],
                                [
                                    {
                                        name: 'Lock Icon',
                                        value: 'lock',
                                    },
                                    {
                                        name: 'Eye Icon',
                                        value: 'eye',
                                    },
                                    {
                                        name: 'None',
                                        value: false,
                                    },
                                ],
                                (i) => {
                                    this.settings['hiddenChannelIcon'] = i;
                                }
                            ),
                            new RadioGroup(
                                'Sorting Order',
                                'Where to display Hidden Channels.',
                                this.settings['sort'],
                                [
                                    {
                                        name: 'Hidden Channels in the native Discord order (default)',
                                        value: 'native',
                                    },
                                    {
                                        name: 'Hidden Channels at the bottom of the Category',
                                        value: 'bottom',
                                    },
                                    {
                                        name: 'Hidden Channels in a separate Category at the bottom',
                                        value: 'extra',
                                    },
                                ],
                                (i) => {
                                    this.settings['sort'] = i;
                                }
                            ),
                            new Switch(
                                'Show Permissions',
                                'Show what roles/users can access the hidden channel.',
                                this.settings['showPerms'],
                                (i) => {
                                    this.settings['showPerms'] = i;
                                }
                            ),
                            new RadioGroup(
                                'Show Admin Roles',
                                "Show roles that have ADMINISTRATOR permission in the hidden channel page (requires 'Shows Permission' enabled).",
                                this.settings['showAdmin'],
                                [
                                    {
                                        name: 'Show only channel specific roles',
                                        value: 'channel',
                                    },
                                    {
                                        name: 'Include Bot Roles',
                                        value: 'include',
                                    },
                                    {
                                        name: 'Exclude Bot Roles',
                                        value: 'exclude',
                                    },
                                    {
                                        name: "Don't Show Administrator Roles",
                                        value: false,
                                    },
                                ],
                                (i) => {
                                    this.settings['showAdmin'] = i;
                                }
                            ),
                            new Switch(
                                'Stop marking hidden channels as read',
                                'Stops the plugin from marking hidden channels as read.',

                                this.settings['MarkUnread'],
                                (i) => {
                                    this.settings['MarkUnread'] = i;
                                }
                            ),
                            new Switch(
                                'Show Empty Category',
                                "Show category even if it's empty",
                                this.settings['shouldShowEmptyCategory'],
                                (i) => {
                                    this.settings['shouldShowEmptyCategory'] = i;
                                }
                            ),
                            new Switch(
                                'Check for Updates',
                                'Automatically check for updates at startup.',
                                this.settings['checkForUpdates'],
                                (i) => {
                                    this.settings['checkForUpdates'] = i;
                                }
                            ),
                            new Switch(
                                'Enable Debug Mode',
                                'Enables debug mode, which will log more information to the console.',
                                this.settings['debugMode'],
                                (i) => {
                                    this.settings['debugMode'] = i;
                                }
                            )
                        ),
                        new SettingGroup('Choose what channels you want to display', {
                            collapsible: true,
                            shown: false,
                        }).append(
                            ...Object.values(ChannelTypes).map((type) => {
                                // GUILD_STAGE_VOICE => [GUILD, STAGE, VOICE]
                                let formattedType = type.split('_');

                                // [GUILD, STAGE, VOICE] => [STAGE, VOICE]
                                formattedType.shift();

                                // [STAGE, VOICE] => Stage Voice
                                formattedType = formattedType.map((word) => capitalizeFirst(word)).join(' ');

                                return new Switch(`Show ${formattedType} Channels`, null, this.settings['channels'][type], (i) => {
                                    this.settings['channels'][type] = i;
                                    this.rerenderChannels();
                                });
                            })
                        ),

                        new SettingGroup('Guilds Blacklist', {
                            collapsible: true,
                            shown: false,
                        }).append(
                            ...Object.values(GuildStore.getGuilds()).map(
                                (guild) =>
                                    new IconSwitch(
                                        guild.name,
                                        guild.description,
                                        this.settings['blacklistedGuilds'][guild.id] ?? false,
                                        (e) => {
                                            this.settings['blacklistedGuilds'][guild.id] = e;
                                        },
                                        {
                                            icon:
                                                ImageResolver.getGuildIconURL(guild) ??
                                                DEFAULT_AVATARS[randomNo(0, DEFAULT_AVATARS.length - 1)],
                                        }
                                    )
                            )
                        )
                    );
                }

                reloadNotification(coolText = 'Reload Discord to apply changes and avoid bugs') {
                    Modals.showConfirmationModal('Reload Discord?', coolText, {
                        confirmText: 'Reload',
                        cancelText: 'Later',
                        onConfirm: () => {
                            window.location.reload();
                        },
                    });
                }

                saveSettings() {
                    Utilities.saveData(config.info.name, 'settings', this.settings);
                    this.rerenderChannels();
                }
            };
        };
        return plugin(Pl, Lib);
    })(global.ZeresPluginLibrary.buildPlugin(config)));

})();

module.exports = __webpack_exports__["default"];
/******/ })()
;