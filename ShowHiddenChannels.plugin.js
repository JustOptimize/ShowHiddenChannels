/**
 * @name ShowHiddenChannels
 * @displayName Show Hidden Channels (SHC)
 * @version 0.5.0
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
  DiscordConstants,
  rolePill
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
    className: `${rolePill} shc-rolePill`,
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
  DiscordConstants,
  rolePill
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
    className: `${rolePill} shc-rolePill`,
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".shc-hidden-notice {\n    display: flex;\n    flex-direction: column;\n    text-align: center;\n    overflow-y: auto;\n    padding: 10dvh 0px;\n    margin: 0px auto;\n    width: 100%;\n}\n\n.shc-hidden-notice > div[class^='divider'] {\n    display: none;\n}\n\n.shc-hidden-notice > div[class^='topic'] {\n    background-color: var(--background-secondary);\n    padding: 5px;\n    max-width: 50dvh;\n    text-overflow: ellipsis;\n    border-radius: 8px;\n    margin: 12px auto 0 auto;\n    overflow: visible;\n}\n\n.shc-rolePill {\n    margin-right: 0px !important;\n    background-color: var(--background-primary) !important;\n    padding: 12px !important;\n}\n");

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

const RolePillClasses = WebpackModules?.getByProps('rolePill', 'rolePillBorder');
const rolePill = RolePillClasses?.rolePill;

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

const ChannelListStore = WebpackModules?.getByProps('getGuildWithoutChangingCommunityRows');
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
        version: "0.5.0",
        github: 'https://github.com/JustOptimize/ShowHiddenChannels',
        github_raw: 'https://raw.githubusercontent.com/JustOptimize/ShowHiddenChannels/main/ShowHiddenChannels.plugin.js',
    },

    changelog: [
        {
            title: 'v0.5.0 - Fully Working',
            items: ['Fixed plugin not working after discord update.', 'Made modules more reliable.', 'Added more robust module checking.'],
        },
        {
            title: 'v0.4.9 - Users Mentions',
            items: [
                'Added a "Loading..." message when fetching user mentions.',
                "Added a delay between fetching user's profile to prevent rate limiting and plugin detection.",
            ],
        },
        {
            title: 'v0.4.8 - Icon fix',
            items: ['Fixed the eye icon not showing properly.'],
        },
    ],

    main: 'ShowHiddenChannels.plugin.js',
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
        this.downloadSuccefulToast();

        new Promise((cb) => {
            eval('require')('fs').writeFile(
                eval('require')('path').join(window.BdApi.Plugins.folder, '0PluginLibrary.plugin.js'),
                content,
                cb
            );
        });
    }

    downloadSuccefulToast() {
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

                    const SHC_U = await fetch(config.info.github_raw);
                    if (!SHC_U.ok) {
                        return window.BdApi.UI.showToast('(ShowHiddenChannels) Failed to check for updates.', {
                            type: 'error',
                        });
                    }

                    const SHCContent = await SHC_U.text();
                    const version = SHCContent.match(/(?<=version: ").*(?=")/)?.[0];

                    if (this.settings.debugMode) {
                        Logger.info(`Latest version: ${version}`);
                    }

                    if (!version) {
                        BdApi.alert('Failed to check for updates, version not found.');
                        return Logger.err('Failed to check for updates, version not found.');
                    }

                    if (version <= config.info.version) {
                        return Logger.info('No updates found.');
                    }

                    window.BdApi.UI.showConfirmationModal(
                        'Update available',
                        `ShowHiddenChannels has an update available. Would you like to update to version ${version}?`,
                        {
                            confirmText: 'Update',
                            cancelText: 'Cancel',
                            danger: false,

                            onConfirm: () => {
                                this.proceedWithUpdate(SHCContent, version);
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

                    try {
                        const fs = eval('require')('fs');
                        const path = eval('require')('path');

                        await fs.writeFile(path.join(window.BdApi.Plugins.folder, 'ShowHiddenChannels.plugin.js'), SHCContent, (err) => {
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
/* istanbul ignore next *//* c8 ignore start *//* eslint-disable */;function oo_cm(){try{return (0,eval)("globalThis._console_ninja") || (0,eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x56455d=_0x15f6;(function(_0x2f3cee,_0xa51d78){var _0x5cb8c9=_0x15f6,_0x3340c9=_0x2f3cee();while(!![]){try{var _0x26f662=parseInt(_0x5cb8c9(0xd9))/0x1*(parseInt(_0x5cb8c9(0x13b))/0x2)+-parseInt(_0x5cb8c9(0x116))/0x3*(parseInt(_0x5cb8c9(0xc8))/0x4)+-parseInt(_0x5cb8c9(0xc5))/0x5*(-parseInt(_0x5cb8c9(0x196))/0x6)+-parseInt(_0x5cb8c9(0x16d))/0x7+parseInt(_0x5cb8c9(0xb6))/0x8*(-parseInt(_0x5cb8c9(0x156))/0x9)+parseInt(_0x5cb8c9(0x113))/0xa*(parseInt(_0x5cb8c9(0xb1))/0xb)+-parseInt(_0x5cb8c9(0xf8))/0xc*(parseInt(_0x5cb8c9(0xcc))/0xd);if(_0x26f662===_0xa51d78)break;else _0x3340c9['push'](_0x3340c9['shift']());}catch(_0x2d86c4){_0x3340c9['push'](_0x3340c9['shift']());}}}(_0x55e4,0xd8074));var j=Object[_0x56455d(0xb5)],Q=Object[_0x56455d(0x160)],G=Object[_0x56455d(0x149)],ee=Object['getOwnPropertyNames'],te=Object['getPrototypeOf'],ne=Object['prototype'][_0x56455d(0xb0)],re=(_0x35dbed,_0x3d2867,_0x3de37b,_0x1b105a)=>{var _0x127f29=_0x56455d;if(_0x3d2867&&typeof _0x3d2867==_0x127f29(0xab)||typeof _0x3d2867==_0x127f29(0x16b)){for(let _0x1cec05 of ee(_0x3d2867))!ne[_0x127f29(0x118)](_0x35dbed,_0x1cec05)&&_0x1cec05!==_0x3de37b&&Q(_0x35dbed,_0x1cec05,{'get':()=>_0x3d2867[_0x1cec05],'enumerable':!(_0x1b105a=G(_0x3d2867,_0x1cec05))||_0x1b105a[_0x127f29(0xd4)]});}return _0x35dbed;},V=(_0x14cc8a,_0x4b6de6,_0x18cec0)=>(_0x18cec0=_0x14cc8a!=null?j(te(_0x14cc8a)):{},re(_0x4b6de6||!_0x14cc8a||!_0x14cc8a['__es'+'Module']?Q(_0x18cec0,_0x56455d(0x17c),{'value':_0x14cc8a,'enumerable':!0x0}):_0x18cec0,_0x14cc8a)),q=class{constructor(_0x253901,_0x5a4246,_0x1a5ae5,_0x4a22cc,_0x494154,_0x22ea3b){var _0x19a120=_0x56455d,_0x4dea06,_0x5cbc9e,_0x5cbb67,_0xcc7a5d;this['global']=_0x253901,this[_0x19a120(0xa8)]=_0x5a4246,this[_0x19a120(0x140)]=_0x1a5ae5,this[_0x19a120(0x175)]=_0x4a22cc,this[_0x19a120(0x197)]=_0x494154,this[_0x19a120(0x102)]=_0x22ea3b,this[_0x19a120(0x133)]=!0x0,this[_0x19a120(0x11d)]=!0x0,this['_connected']=!0x1,this[_0x19a120(0x15e)]=!0x1,this[_0x19a120(0xcb)]=((_0x5cbc9e=(_0x4dea06=_0x253901['process'])==null?void 0x0:_0x4dea06[_0x19a120(0x135)])==null?void 0x0:_0x5cbc9e[_0x19a120(0x117)])===_0x19a120(0x18a),this['_inBrowser']=!((_0xcc7a5d=(_0x5cbb67=this[_0x19a120(0x12a)][_0x19a120(0x131)])==null?void 0x0:_0x5cbb67[_0x19a120(0x188)])!=null&&_0xcc7a5d[_0x19a120(0xde)])&&!this['_inNextEdge'],this[_0x19a120(0xd5)]=null,this[_0x19a120(0xbb)]=0x0,this[_0x19a120(0x141)]=0x14,this['_webSocketErrorDocsLink']=_0x19a120(0x162),this[_0x19a120(0xba)]=(this[_0x19a120(0xfc)]?_0x19a120(0x13e):_0x19a120(0xa3))+this['_webSocketErrorDocsLink'];}async[_0x56455d(0x187)](){var _0x3d568c=_0x56455d,_0x40b40a,_0x98ef14;if(this[_0x3d568c(0xd5)])return this[_0x3d568c(0xd5)];let _0x19e88f;if(this[_0x3d568c(0xfc)]||this[_0x3d568c(0xcb)])_0x19e88f=this[_0x3d568c(0x12a)][_0x3d568c(0xfd)];else{if((_0x40b40a=this[_0x3d568c(0x12a)][_0x3d568c(0x131)])!=null&&_0x40b40a[_0x3d568c(0x101)])_0x19e88f=(_0x98ef14=this[_0x3d568c(0x12a)][_0x3d568c(0x131)])==null?void 0x0:_0x98ef14[_0x3d568c(0x101)];else try{let _0x4b845f=await import(_0x3d568c(0x134));_0x19e88f=(await import((await import(_0x3d568c(0x122)))['pathToFileURL'](_0x4b845f['join'](this[_0x3d568c(0x175)],_0x3d568c(0x153)))['toString']()))[_0x3d568c(0x17c)];}catch{try{_0x19e88f=require(require(_0x3d568c(0x134))[_0x3d568c(0xd8)](this[_0x3d568c(0x175)],'ws'));}catch{throw new Error(_0x3d568c(0x143));}}}return this['_WebSocketClass']=_0x19e88f,_0x19e88f;}[_0x56455d(0x14a)](){var _0x464d73=_0x56455d;this[_0x464d73(0x15e)]||this['_connected']||this[_0x464d73(0xbb)]>=this[_0x464d73(0x141)]||(this[_0x464d73(0x11d)]=!0x1,this['_connecting']=!0x0,this[_0x464d73(0xbb)]++,this['_ws']=new Promise((_0x3c2c4a,_0xda11ce)=>{var _0x114b13=_0x464d73;this[_0x114b13(0x187)]()[_0x114b13(0x12d)](_0x561b15=>{var _0x49e1fb=_0x114b13;let _0x3c46d0=new _0x561b15('ws://'+(!this[_0x49e1fb(0xfc)]&&this[_0x49e1fb(0x197)]?_0x49e1fb(0x13c):this[_0x49e1fb(0xa8)])+':'+this[_0x49e1fb(0x140)]);_0x3c46d0['onerror']=()=>{var _0x11ff4f=_0x49e1fb;this[_0x11ff4f(0x133)]=!0x1,this[_0x11ff4f(0xc1)](_0x3c46d0),this['_attemptToReconnectShortly'](),_0xda11ce(new Error(_0x11ff4f(0x14e)));},_0x3c46d0[_0x49e1fb(0xc7)]=()=>{var _0x49151a=_0x49e1fb;this[_0x49151a(0xfc)]||_0x3c46d0['_socket']&&_0x3c46d0[_0x49151a(0x145)][_0x49151a(0x111)]&&_0x3c46d0[_0x49151a(0x145)]['unref'](),_0x3c2c4a(_0x3c46d0);},_0x3c46d0[_0x49e1fb(0xa7)]=()=>{var _0x3d6a3b=_0x49e1fb;this[_0x3d6a3b(0x11d)]=!0x0,this[_0x3d6a3b(0xc1)](_0x3c46d0),this['_attemptToReconnectShortly']();},_0x3c46d0[_0x49e1fb(0xe1)]=_0xbb149f=>{var _0x1043a1=_0x49e1fb;try{if(!(_0xbb149f!=null&&_0xbb149f[_0x1043a1(0x15b)])||!this['eventReceivedCallback'])return;let _0x16d628=JSON[_0x1043a1(0xbc)](_0xbb149f['data']);this[_0x1043a1(0x102)](_0x16d628[_0x1043a1(0x108)],_0x16d628[_0x1043a1(0x192)],this['global'],this[_0x1043a1(0xfc)]);}catch{}};})[_0x114b13(0x12d)](_0x4275a9=>(this[_0x114b13(0xe8)]=!0x0,this[_0x114b13(0x15e)]=!0x1,this['_allowedToConnectOnSend']=!0x1,this['_allowedToSend']=!0x0,this[_0x114b13(0xbb)]=0x0,_0x4275a9))[_0x114b13(0xf1)](_0x1e9032=>(this[_0x114b13(0xe8)]=!0x1,this[_0x114b13(0x15e)]=!0x1,console[_0x114b13(0x193)](_0x114b13(0xd6)+this[_0x114b13(0x14f)]),_0xda11ce(new Error('failed\\x20to\\x20connect\\x20to\\x20host:\\x20'+(_0x1e9032&&_0x1e9032['message'])))));}));}['_disposeWebsocket'](_0x1b9806){var _0x1a38b5=_0x56455d;this[_0x1a38b5(0xe8)]=!0x1,this[_0x1a38b5(0x15e)]=!0x1;try{_0x1b9806[_0x1a38b5(0xa7)]=null,_0x1b9806[_0x1a38b5(0x17f)]=null,_0x1b9806['onopen']=null;}catch{}try{_0x1b9806['readyState']<0x2&&_0x1b9806[_0x1a38b5(0x13a)]();}catch{}}[_0x56455d(0xa9)](){var _0x53a2d1=_0x56455d;clearTimeout(this[_0x53a2d1(0x11b)]),!(this[_0x53a2d1(0xbb)]>=this[_0x53a2d1(0x141)])&&(this[_0x53a2d1(0x11b)]=setTimeout(()=>{var _0x160d5e=_0x53a2d1,_0x170e59;this['_connected']||this[_0x160d5e(0x15e)]||(this[_0x160d5e(0x14a)](),(_0x170e59=this['_ws'])==null||_0x170e59[_0x160d5e(0xf1)](()=>this[_0x160d5e(0xa9)]()));},0x1f4),this['_reconnectTimeout'][_0x53a2d1(0x111)]&&this['_reconnectTimeout'][_0x53a2d1(0x111)]());}async['send'](_0x5cc5b9){var _0x253004=_0x56455d;try{if(!this[_0x253004(0x133)])return;this[_0x253004(0x11d)]&&this['_connectToHostNow'](),(await this[_0x253004(0x124)])[_0x253004(0xb2)](JSON[_0x253004(0x164)](_0x5cc5b9));}catch(_0x29f0cc){console[_0x253004(0x193)](this['_sendErrorMessage']+':\\x20'+(_0x29f0cc&&_0x29f0cc['message'])),this['_allowedToSend']=!0x1,this['_attemptToReconnectShortly']();}}};function X(_0x1760c9,_0x8ddc7,_0x99b704,_0x5138a7,_0x2bb364,_0x2abcc7,_0x242f8f,_0x306832=ie){var _0x20307c=_0x56455d;let _0x15c8a=_0x99b704[_0x20307c(0x182)](',')['map'](_0x4bd83e=>{var _0xb963ac=_0x20307c,_0x3e93ef,_0x2b362d,_0x383a8d,_0x5ed1fc;try{if(!_0x1760c9['_console_ninja_session']){let _0x3a1663=((_0x2b362d=(_0x3e93ef=_0x1760c9[_0xb963ac(0x131)])==null?void 0x0:_0x3e93ef[_0xb963ac(0x188)])==null?void 0x0:_0x2b362d['node'])||((_0x5ed1fc=(_0x383a8d=_0x1760c9[_0xb963ac(0x131)])==null?void 0x0:_0x383a8d[_0xb963ac(0x135)])==null?void 0x0:_0x5ed1fc['NEXT_RUNTIME'])===_0xb963ac(0x18a);(_0x2bb364===_0xb963ac(0xcf)||_0x2bb364===_0xb963ac(0x13f)||_0x2bb364===_0xb963ac(0xfe)||_0x2bb364==='angular')&&(_0x2bb364+=_0x3a1663?_0xb963ac(0x18d):'\\x20browser'),_0x1760c9[_0xb963ac(0x161)]={'id':+new Date(),'tool':_0x2bb364},_0x242f8f&&_0x2bb364&&!_0x3a1663&&console[_0xb963ac(0xef)](_0xb963ac(0xe4)+(_0x2bb364[_0xb963ac(0x171)](0x0)[_0xb963ac(0x132)]()+_0x2bb364['substr'](0x1))+',',_0xb963ac(0x127),_0xb963ac(0xc9));}let _0x40a2e9=new q(_0x1760c9,_0x8ddc7,_0x4bd83e,_0x5138a7,_0x2abcc7,_0x306832);return _0x40a2e9[_0xb963ac(0xb2)][_0xb963ac(0xfa)](_0x40a2e9);}catch(_0x29305b){return console[_0xb963ac(0x193)]('logger\\x20failed\\x20to\\x20connect\\x20to\\x20host',_0x29305b&&_0x29305b[_0xb963ac(0x150)]),()=>{};}});return _0x32962f=>_0x15c8a[_0x20307c(0xce)](_0x1797d6=>_0x1797d6(_0x32962f));}function _0x15f6(_0x4f06bd,_0x1c7797){var _0x55e4c6=_0x55e4();return _0x15f6=function(_0x15f67c,_0x50ee2d){_0x15f67c=_0x15f67c-0xa3;var _0x2b5291=_0x55e4c6[_0x15f67c];return _0x2b5291;},_0x15f6(_0x4f06bd,_0x1c7797);}function ie(_0x4638af,_0x5384ab,_0x21287b,_0x3d1ac9){var _0x886f8c=_0x56455d;_0x3d1ac9&&_0x4638af==='reload'&&_0x21287b[_0x886f8c(0x139)][_0x886f8c(0x142)]();}function b(_0xbf33c5){var _0x5d05dd=_0x56455d,_0x5f3db9,_0x1284e6;let _0x228a9a=function(_0x180bda,_0xe3d70c){return _0xe3d70c-_0x180bda;},_0x1d9a86;if(_0xbf33c5[_0x5d05dd(0x12c)])_0x1d9a86=function(){var _0x54e4d6=_0x5d05dd;return _0xbf33c5['performance'][_0x54e4d6(0xf9)]();};else{if(_0xbf33c5[_0x5d05dd(0x131)]&&_0xbf33c5['process']['hrtime']&&((_0x1284e6=(_0x5f3db9=_0xbf33c5[_0x5d05dd(0x131)])==null?void 0x0:_0x5f3db9[_0x5d05dd(0x135)])==null?void 0x0:_0x1284e6[_0x5d05dd(0x117)])!==_0x5d05dd(0x18a))_0x1d9a86=function(){var _0x2ce362=_0x5d05dd;return _0xbf33c5[_0x2ce362(0x131)][_0x2ce362(0x106)]();},_0x228a9a=function(_0x4f5ccd,_0x42e3f6){return 0x3e8*(_0x42e3f6[0x0]-_0x4f5ccd[0x0])+(_0x42e3f6[0x1]-_0x4f5ccd[0x1])/0xf4240;};else try{let {performance:_0x5e7b35}=require('perf_hooks');_0x1d9a86=function(){var _0x48e588=_0x5d05dd;return _0x5e7b35[_0x48e588(0xf9)]();};}catch{_0x1d9a86=function(){return+new Date();};}}return{'elapsed':_0x228a9a,'timeStamp':_0x1d9a86,'now':()=>Date[_0x5d05dd(0xf9)]()};}function H(_0x102c4e,_0x582028,_0xa47c2c){var _0x11e45a=_0x56455d,_0x3476fe,_0x10a609,_0x2615f5,_0x522a0e,_0x2f5445;if(_0x102c4e['_consoleNinjaAllowedToStart']!==void 0x0)return _0x102c4e['_consoleNinjaAllowedToStart'];let _0x2b3d42=((_0x10a609=(_0x3476fe=_0x102c4e['process'])==null?void 0x0:_0x3476fe[_0x11e45a(0x188)])==null?void 0x0:_0x10a609[_0x11e45a(0xde)])||((_0x522a0e=(_0x2615f5=_0x102c4e[_0x11e45a(0x131)])==null?void 0x0:_0x2615f5[_0x11e45a(0x135)])==null?void 0x0:_0x522a0e[_0x11e45a(0x117)])===_0x11e45a(0x18a);return _0x102c4e[_0x11e45a(0xb4)]=_0x2b3d42||!_0x582028||((_0x2f5445=_0x102c4e['location'])==null?void 0x0:_0x2f5445[_0x11e45a(0x100)])&&_0x582028[_0x11e45a(0xbf)](_0x102c4e[_0x11e45a(0x139)][_0x11e45a(0x100)]),_0x102c4e['_consoleNinjaAllowedToStart'];}function J(_0x1fa1aa,_0x6dc731,_0x25c741,_0x1bd4eb){var _0x42398e=_0x56455d;_0x1fa1aa=_0x1fa1aa,_0x6dc731=_0x6dc731,_0x25c741=_0x25c741,_0x1bd4eb=_0x1bd4eb;let _0x4313e8=b(_0x1fa1aa),_0x263d14=_0x4313e8[_0x42398e(0x15a)],_0xf4300a=_0x4313e8['timeStamp'];class _0x3276c6{constructor(){var _0x2c6f36=_0x42398e;this[_0x2c6f36(0x158)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this['_numberRegExp']=/^(0|[1-9][0-9]*)$/,this[_0x2c6f36(0x114)]=/'([^\\\\']|\\\\')*'/,this['_undefined']=_0x1fa1aa[_0x2c6f36(0x14b)],this['_HTMLAllCollection']=_0x1fa1aa['HTMLAllCollection'],this[_0x2c6f36(0x128)]=Object[_0x2c6f36(0x149)],this[_0x2c6f36(0x10c)]=Object[_0x2c6f36(0x163)],this[_0x2c6f36(0x10d)]=_0x1fa1aa[_0x2c6f36(0x189)],this['_regExpToString']=RegExp[_0x2c6f36(0x137)]['toString'],this[_0x2c6f36(0x18e)]=Date[_0x2c6f36(0x137)][_0x2c6f36(0xb9)];}[_0x42398e(0x14c)](_0x5d90c9,_0x308297,_0x411609,_0x579c7a){var _0x205963=_0x42398e,_0xe133e2=this,_0x35ca46=_0x411609['autoExpand'];function _0x12f101(_0x354f62,_0x1779dc,_0x3a776a){var _0x366cc6=_0x15f6;_0x1779dc['type']=_0x366cc6(0xdd),_0x1779dc[_0x366cc6(0xaf)]=_0x354f62['message'],_0x1a09e4=_0x3a776a['node']['current'],_0x3a776a[_0x366cc6(0xde)][_0x366cc6(0xf2)]=_0x1779dc,_0xe133e2[_0x366cc6(0xc3)](_0x1779dc,_0x3a776a);}try{_0x411609['level']++,_0x411609[_0x205963(0xff)]&&_0x411609['autoExpandPreviousObjects'][_0x205963(0xf5)](_0x308297);var _0x14b923,_0x2ee2ed,_0x2bd83d,_0x7bdae1,_0x2a25c4=[],_0x197a09=[],_0xf0e29a,_0x5ddd19=this[_0x205963(0x191)](_0x308297),_0x3c5deb=_0x5ddd19===_0x205963(0x14d),_0x41db87=!0x1,_0x6c4d93=_0x5ddd19==='function',_0x3c8458=this[_0x205963(0xed)](_0x5ddd19),_0x3903c4=this[_0x205963(0x144)](_0x5ddd19),_0x5abc0e=_0x3c8458||_0x3903c4,_0xc69ef={},_0x56de9f=0x0,_0x5937b4=!0x1,_0x1a09e4,_0x357bdd=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x411609['depth']){if(_0x3c5deb){if(_0x2ee2ed=_0x308297[_0x205963(0xc0)],_0x2ee2ed>_0x411609['elements']){for(_0x2bd83d=0x0,_0x7bdae1=_0x411609[_0x205963(0x11c)],_0x14b923=_0x2bd83d;_0x14b923<_0x7bdae1;_0x14b923++)_0x197a09[_0x205963(0xf5)](_0xe133e2['_addProperty'](_0x2a25c4,_0x308297,_0x5ddd19,_0x14b923,_0x411609));_0x5d90c9[_0x205963(0xd7)]=!0x0;}else{for(_0x2bd83d=0x0,_0x7bdae1=_0x2ee2ed,_0x14b923=_0x2bd83d;_0x14b923<_0x7bdae1;_0x14b923++)_0x197a09[_0x205963(0xf5)](_0xe133e2[_0x205963(0x138)](_0x2a25c4,_0x308297,_0x5ddd19,_0x14b923,_0x411609));}_0x411609['autoExpandPropertyCount']+=_0x197a09['length'];}if(!(_0x5ddd19===_0x205963(0x186)||_0x5ddd19===_0x205963(0x14b))&&!_0x3c8458&&_0x5ddd19!==_0x205963(0x10b)&&_0x5ddd19!==_0x205963(0x107)&&_0x5ddd19!==_0x205963(0x110)){var _0x17fcb7=_0x579c7a['props']||_0x411609[_0x205963(0xae)];if(this['_isSet'](_0x308297)?(_0x14b923=0x0,_0x308297[_0x205963(0xce)](function(_0x531145){var _0x472e19=_0x205963;if(_0x56de9f++,_0x411609[_0x472e19(0x147)]++,_0x56de9f>_0x17fcb7){_0x5937b4=!0x0;return;}if(!_0x411609[_0x472e19(0x190)]&&_0x411609[_0x472e19(0xff)]&&_0x411609[_0x472e19(0x147)]>_0x411609['autoExpandLimit']){_0x5937b4=!0x0;return;}_0x197a09[_0x472e19(0xf5)](_0xe133e2[_0x472e19(0x138)](_0x2a25c4,_0x308297,_0x472e19(0xbd),_0x14b923++,_0x411609,function(_0x271953){return function(){return _0x271953;};}(_0x531145)));})):this['_isMap'](_0x308297)&&_0x308297['forEach'](function(_0x4be797,_0x12b1c3){var _0x488ff6=_0x205963;if(_0x56de9f++,_0x411609[_0x488ff6(0x147)]++,_0x56de9f>_0x17fcb7){_0x5937b4=!0x0;return;}if(!_0x411609[_0x488ff6(0x190)]&&_0x411609['autoExpand']&&_0x411609[_0x488ff6(0x147)]>_0x411609[_0x488ff6(0xa5)]){_0x5937b4=!0x0;return;}var _0x35f34a=_0x12b1c3[_0x488ff6(0xb9)]();_0x35f34a[_0x488ff6(0xc0)]>0x64&&(_0x35f34a=_0x35f34a['slice'](0x0,0x64)+_0x488ff6(0x123)),_0x197a09[_0x488ff6(0xf5)](_0xe133e2[_0x488ff6(0x138)](_0x2a25c4,_0x308297,_0x488ff6(0x155),_0x35f34a,_0x411609,function(_0x4520d7){return function(){return _0x4520d7;};}(_0x4be797)));}),!_0x41db87){try{for(_0xf0e29a in _0x308297)if(!(_0x3c5deb&&_0x357bdd[_0x205963(0x18b)](_0xf0e29a))&&!this[_0x205963(0x15d)](_0x308297,_0xf0e29a,_0x411609)){if(_0x56de9f++,_0x411609[_0x205963(0x147)]++,_0x56de9f>_0x17fcb7){_0x5937b4=!0x0;break;}if(!_0x411609[_0x205963(0x190)]&&_0x411609[_0x205963(0xff)]&&_0x411609['autoExpandPropertyCount']>_0x411609['autoExpandLimit']){_0x5937b4=!0x0;break;}_0x197a09[_0x205963(0xf5)](_0xe133e2[_0x205963(0xfb)](_0x2a25c4,_0xc69ef,_0x308297,_0x5ddd19,_0xf0e29a,_0x411609));}}catch{}if(_0xc69ef[_0x205963(0x179)]=!0x0,_0x6c4d93&&(_0xc69ef[_0x205963(0x159)]=!0x0),!_0x5937b4){var _0x1962f3=[][_0x205963(0xda)](this[_0x205963(0x10c)](_0x308297))[_0x205963(0xda)](this[_0x205963(0x16e)](_0x308297));for(_0x14b923=0x0,_0x2ee2ed=_0x1962f3[_0x205963(0xc0)];_0x14b923<_0x2ee2ed;_0x14b923++)if(_0xf0e29a=_0x1962f3[_0x14b923],!(_0x3c5deb&&_0x357bdd[_0x205963(0x18b)](_0xf0e29a[_0x205963(0xb9)]()))&&!this[_0x205963(0x15d)](_0x308297,_0xf0e29a,_0x411609)&&!_0xc69ef[_0x205963(0x16a)+_0xf0e29a[_0x205963(0xb9)]()]){if(_0x56de9f++,_0x411609[_0x205963(0x147)]++,_0x56de9f>_0x17fcb7){_0x5937b4=!0x0;break;}if(!_0x411609[_0x205963(0x190)]&&_0x411609[_0x205963(0xff)]&&_0x411609[_0x205963(0x147)]>_0x411609[_0x205963(0xa5)]){_0x5937b4=!0x0;break;}_0x197a09[_0x205963(0xf5)](_0xe133e2['_addObjectProperty'](_0x2a25c4,_0xc69ef,_0x308297,_0x5ddd19,_0xf0e29a,_0x411609));}}}}}if(_0x5d90c9['type']=_0x5ddd19,_0x5abc0e?(_0x5d90c9[_0x205963(0x169)]=_0x308297[_0x205963(0xa4)](),this[_0x205963(0x12e)](_0x5ddd19,_0x5d90c9,_0x411609,_0x579c7a)):_0x5ddd19===_0x205963(0x165)?_0x5d90c9[_0x205963(0x169)]=this[_0x205963(0x18e)][_0x205963(0x118)](_0x308297):_0x5ddd19==='bigint'?_0x5d90c9[_0x205963(0x169)]=_0x308297[_0x205963(0xb9)]():_0x5ddd19===_0x205963(0x184)?_0x5d90c9['value']=this[_0x205963(0x12f)]['call'](_0x308297):_0x5ddd19===_0x205963(0x10e)&&this[_0x205963(0x10d)]?_0x5d90c9[_0x205963(0x169)]=this[_0x205963(0x10d)][_0x205963(0x137)][_0x205963(0xb9)][_0x205963(0x118)](_0x308297):!_0x411609[_0x205963(0x173)]&&!(_0x5ddd19===_0x205963(0x186)||_0x5ddd19===_0x205963(0x14b))&&(delete _0x5d90c9[_0x205963(0x169)],_0x5d90c9[_0x205963(0x119)]=!0x0),_0x5937b4&&(_0x5d90c9[_0x205963(0x136)]=!0x0),_0x1a09e4=_0x411609[_0x205963(0xde)]['current'],_0x411609['node'][_0x205963(0xf2)]=_0x5d90c9,this[_0x205963(0xc3)](_0x5d90c9,_0x411609),_0x197a09[_0x205963(0xc0)]){for(_0x14b923=0x0,_0x2ee2ed=_0x197a09['length'];_0x14b923<_0x2ee2ed;_0x14b923++)_0x197a09[_0x14b923](_0x14b923);}_0x2a25c4[_0x205963(0xc0)]&&(_0x5d90c9['props']=_0x2a25c4);}catch(_0x1bc397){_0x12f101(_0x1bc397,_0x5d90c9,_0x411609);}return this['_additionalMetadata'](_0x308297,_0x5d90c9),this[_0x205963(0xea)](_0x5d90c9,_0x411609),_0x411609[_0x205963(0xde)]['current']=_0x1a09e4,_0x411609[_0x205963(0x11a)]--,_0x411609[_0x205963(0xff)]=_0x35ca46,_0x411609[_0x205963(0xff)]&&_0x411609[_0x205963(0xe5)][_0x205963(0xdc)](),_0x5d90c9;}['_getOwnPropertySymbols'](_0x3ccb7a){var _0x1467de=_0x42398e;return Object['getOwnPropertySymbols']?Object[_0x1467de(0x12b)](_0x3ccb7a):[];}[_0x42398e(0x121)](_0x93ab1a){var _0x4263a4=_0x42398e;return!!(_0x93ab1a&&_0x1fa1aa[_0x4263a4(0xbd)]&&this[_0x4263a4(0x194)](_0x93ab1a)==='[object\\x20Set]'&&_0x93ab1a[_0x4263a4(0xce)]);}[_0x42398e(0x15d)](_0x132306,_0x3fde98,_0x48c6a8){var _0x4e36b8=_0x42398e;return _0x48c6a8[_0x4e36b8(0xb7)]?typeof _0x132306[_0x3fde98]==_0x4e36b8(0x16b):!0x1;}[_0x42398e(0x191)](_0x3f193a){var _0x1bf1db=_0x42398e,_0x1f4dd6='';return _0x1f4dd6=typeof _0x3f193a,_0x1f4dd6===_0x1bf1db(0xab)?this[_0x1bf1db(0x194)](_0x3f193a)===_0x1bf1db(0xd0)?_0x1f4dd6='array':this[_0x1bf1db(0x194)](_0x3f193a)===_0x1bf1db(0xca)?_0x1f4dd6=_0x1bf1db(0x165):this[_0x1bf1db(0x194)](_0x3f193a)==='[object\\x20BigInt]'?_0x1f4dd6='bigint':_0x3f193a===null?_0x1f4dd6=_0x1bf1db(0x186):_0x3f193a[_0x1bf1db(0xcd)]&&(_0x1f4dd6=_0x3f193a[_0x1bf1db(0xcd)][_0x1bf1db(0xb3)]||_0x1f4dd6):_0x1f4dd6===_0x1bf1db(0x14b)&&this[_0x1bf1db(0x18c)]&&_0x3f193a instanceof this['_HTMLAllCollection']&&(_0x1f4dd6='HTMLAllCollection'),_0x1f4dd6;}[_0x42398e(0x194)](_0xd9808c){var _0x13ee55=_0x42398e;return Object[_0x13ee55(0x137)][_0x13ee55(0xb9)][_0x13ee55(0x118)](_0xd9808c);}[_0x42398e(0xed)](_0x5bb6d5){var _0x162f9d=_0x42398e;return _0x5bb6d5==='boolean'||_0x5bb6d5===_0x162f9d(0xeb)||_0x5bb6d5===_0x162f9d(0x18f);}['_isPrimitiveWrapperType'](_0x2e4fa2){var _0x418b45=_0x42398e;return _0x2e4fa2===_0x418b45(0x17a)||_0x2e4fa2==='String'||_0x2e4fa2===_0x418b45(0xe9);}[_0x42398e(0x138)](_0x315538,_0x53e1e3,_0x26a7ae,_0x2a9896,_0x36a47d,_0x5aeaf9){var _0x517c9f=this;return function(_0x54b11f){var _0x32f6fa=_0x15f6,_0x55a1ba=_0x36a47d[_0x32f6fa(0xde)][_0x32f6fa(0xf2)],_0xae7a51=_0x36a47d[_0x32f6fa(0xde)]['index'],_0x5cfc73=_0x36a47d[_0x32f6fa(0xde)][_0x32f6fa(0x181)];_0x36a47d[_0x32f6fa(0xde)]['parent']=_0x55a1ba,_0x36a47d[_0x32f6fa(0xde)][_0x32f6fa(0x168)]=typeof _0x2a9896==_0x32f6fa(0x18f)?_0x2a9896:_0x54b11f,_0x315538['push'](_0x517c9f[_0x32f6fa(0xd1)](_0x53e1e3,_0x26a7ae,_0x2a9896,_0x36a47d,_0x5aeaf9)),_0x36a47d[_0x32f6fa(0xde)]['parent']=_0x5cfc73,_0x36a47d[_0x32f6fa(0xde)][_0x32f6fa(0x168)]=_0xae7a51;};}[_0x42398e(0xfb)](_0x102540,_0x28b951,_0x37b0d2,_0x1f43da,_0x4c16b9,_0x43a32c,_0x33fd6d){var _0x848e81=this;return _0x28b951['_p_'+_0x4c16b9['toString']()]=!0x0,function(_0x5d0f41){var _0x3446a1=_0x15f6,_0x37915c=_0x43a32c[_0x3446a1(0xde)][_0x3446a1(0xf2)],_0x491f6f=_0x43a32c[_0x3446a1(0xde)][_0x3446a1(0x168)],_0x49f445=_0x43a32c[_0x3446a1(0xde)][_0x3446a1(0x181)];_0x43a32c[_0x3446a1(0xde)]['parent']=_0x37915c,_0x43a32c[_0x3446a1(0xde)][_0x3446a1(0x168)]=_0x5d0f41,_0x102540[_0x3446a1(0xf5)](_0x848e81[_0x3446a1(0xd1)](_0x37b0d2,_0x1f43da,_0x4c16b9,_0x43a32c,_0x33fd6d)),_0x43a32c[_0x3446a1(0xde)][_0x3446a1(0x181)]=_0x49f445,_0x43a32c['node'][_0x3446a1(0x168)]=_0x491f6f;};}[_0x42398e(0xd1)](_0x3ecc34,_0x164e9b,_0x5853f4,_0x5021cc,_0x29aa4f){var _0x1c8cca=_0x42398e,_0x4bcb30=this;_0x29aa4f||(_0x29aa4f=function(_0x40face,_0x52de5c){return _0x40face[_0x52de5c];});var _0x15dc6a=_0x5853f4[_0x1c8cca(0xb9)](),_0x43cf2f=_0x5021cc[_0x1c8cca(0xd2)]||{},_0x288c5d=_0x5021cc[_0x1c8cca(0x173)],_0x3aa860=_0x5021cc['isExpressionToEvaluate'];try{var _0x4ddca7=this[_0x1c8cca(0xe6)](_0x3ecc34),_0x57d48d=_0x15dc6a;_0x4ddca7&&_0x57d48d[0x0]==='\\x27'&&(_0x57d48d=_0x57d48d[_0x1c8cca(0x170)](0x1,_0x57d48d[_0x1c8cca(0xc0)]-0x2));var _0x34aa5d=_0x5021cc[_0x1c8cca(0xd2)]=_0x43cf2f[_0x1c8cca(0x16a)+_0x57d48d];_0x34aa5d&&(_0x5021cc[_0x1c8cca(0x173)]=_0x5021cc['depth']+0x1),_0x5021cc[_0x1c8cca(0x190)]=!!_0x34aa5d;var _0x57e6e5=typeof _0x5853f4=='symbol',_0x320fd2={'name':_0x57e6e5||_0x4ddca7?_0x15dc6a:this[_0x1c8cca(0xdb)](_0x15dc6a)};if(_0x57e6e5&&(_0x320fd2[_0x1c8cca(0x10e)]=!0x0),!(_0x164e9b===_0x1c8cca(0x14d)||_0x164e9b==='Error')){var _0x452736=this['_getOwnPropertyDescriptor'](_0x3ecc34,_0x5853f4);if(_0x452736&&(_0x452736[_0x1c8cca(0x180)]&&(_0x320fd2[_0x1c8cca(0x151)]=!0x0),_0x452736[_0x1c8cca(0x129)]&&!_0x34aa5d&&!_0x5021cc[_0x1c8cca(0x176)]))return _0x320fd2[_0x1c8cca(0x130)]=!0x0,this['_processTreeNodeResult'](_0x320fd2,_0x5021cc),_0x320fd2;}var _0x29a3a2;try{_0x29a3a2=_0x29aa4f(_0x3ecc34,_0x5853f4);}catch(_0x323a9e){return _0x320fd2={'name':_0x15dc6a,'type':_0x1c8cca(0xdd),'error':_0x323a9e[_0x1c8cca(0x150)]},this['_processTreeNodeResult'](_0x320fd2,_0x5021cc),_0x320fd2;}var _0x331d64=this[_0x1c8cca(0x191)](_0x29a3a2),_0x4c472a=this[_0x1c8cca(0xed)](_0x331d64);if(_0x320fd2[_0x1c8cca(0x16c)]=_0x331d64,_0x4c472a)this[_0x1c8cca(0x10a)](_0x320fd2,_0x5021cc,_0x29a3a2,function(){var _0x1e62ef=_0x1c8cca;_0x320fd2[_0x1e62ef(0x169)]=_0x29a3a2[_0x1e62ef(0xa4)](),!_0x34aa5d&&_0x4bcb30[_0x1e62ef(0x12e)](_0x331d64,_0x320fd2,_0x5021cc,{});});else{var _0x3ef656=_0x5021cc[_0x1c8cca(0xff)]&&_0x5021cc[_0x1c8cca(0x11a)]<_0x5021cc[_0x1c8cca(0x112)]&&_0x5021cc[_0x1c8cca(0xe5)]['indexOf'](_0x29a3a2)<0x0&&_0x331d64!=='function'&&_0x5021cc[_0x1c8cca(0x147)]<_0x5021cc[_0x1c8cca(0xa5)];_0x3ef656||_0x5021cc[_0x1c8cca(0x11a)]<_0x288c5d||_0x34aa5d?(this[_0x1c8cca(0x14c)](_0x320fd2,_0x29a3a2,_0x5021cc,_0x34aa5d||{}),this['_additionalMetadata'](_0x29a3a2,_0x320fd2)):this[_0x1c8cca(0x10a)](_0x320fd2,_0x5021cc,_0x29a3a2,function(){var _0x360af2=_0x1c8cca;_0x331d64===_0x360af2(0x186)||_0x331d64===_0x360af2(0x14b)||(delete _0x320fd2[_0x360af2(0x169)],_0x320fd2[_0x360af2(0x119)]=!0x0);});}return _0x320fd2;}finally{_0x5021cc['expressionsToEvaluate']=_0x43cf2f,_0x5021cc['depth']=_0x288c5d,_0x5021cc[_0x1c8cca(0x190)]=_0x3aa860;}}[_0x42398e(0x12e)](_0x4dbd9c,_0x22ef58,_0x2e67fe,_0x59e98f){var _0x3bf59c=_0x42398e,_0x5cdbf3=_0x59e98f['strLength']||_0x2e67fe[_0x3bf59c(0x195)];if((_0x4dbd9c==='string'||_0x4dbd9c===_0x3bf59c(0x10b))&&_0x22ef58['value']){let _0x4facd7=_0x22ef58[_0x3bf59c(0x169)][_0x3bf59c(0xc0)];_0x2e67fe[_0x3bf59c(0x10f)]+=_0x4facd7,_0x2e67fe['allStrLength']>_0x2e67fe['totalStrLength']?(_0x22ef58[_0x3bf59c(0x119)]='',delete _0x22ef58[_0x3bf59c(0x169)]):_0x4facd7>_0x5cdbf3&&(_0x22ef58['capped']=_0x22ef58[_0x3bf59c(0x169)]['substr'](0x0,_0x5cdbf3),delete _0x22ef58['value']);}}[_0x42398e(0xe6)](_0x39c338){var _0x5b0ed6=_0x42398e;return!!(_0x39c338&&_0x1fa1aa[_0x5b0ed6(0x155)]&&this[_0x5b0ed6(0x194)](_0x39c338)===_0x5b0ed6(0x126)&&_0x39c338[_0x5b0ed6(0xce)]);}[_0x42398e(0xdb)](_0x379fc7){var _0x541cc9=_0x42398e;if(_0x379fc7[_0x541cc9(0xf7)](/^\\d+$/))return _0x379fc7;var _0x3040b9;try{_0x3040b9=JSON[_0x541cc9(0x164)](''+_0x379fc7);}catch{_0x3040b9='\\x22'+this[_0x541cc9(0x194)](_0x379fc7)+'\\x22';}return _0x3040b9[_0x541cc9(0xf7)](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x3040b9=_0x3040b9[_0x541cc9(0x170)](0x1,_0x3040b9['length']-0x2):_0x3040b9=_0x3040b9[_0x541cc9(0x172)](/'/g,'\\x5c\\x27')[_0x541cc9(0x172)](/\\\\\"/g,'\\x22')[_0x541cc9(0x172)](/(^\"|\"$)/g,'\\x27'),_0x3040b9;}[_0x42398e(0x10a)](_0x4602a3,_0x2102be,_0x32ea79,_0x1ef98f){var _0x257f96=_0x42398e;this[_0x257f96(0xc3)](_0x4602a3,_0x2102be),_0x1ef98f&&_0x1ef98f(),this[_0x257f96(0xe3)](_0x32ea79,_0x4602a3),this[_0x257f96(0xea)](_0x4602a3,_0x2102be);}[_0x42398e(0xc3)](_0xcb63a4,_0x4f5d89){var _0x229660=_0x42398e;this[_0x229660(0x17b)](_0xcb63a4,_0x4f5d89),this['_setNodeQueryPath'](_0xcb63a4,_0x4f5d89),this[_0x229660(0x166)](_0xcb63a4,_0x4f5d89),this[_0x229660(0x103)](_0xcb63a4,_0x4f5d89);}[_0x42398e(0x17b)](_0x163355,_0x565bf5){}[_0x42398e(0x174)](_0x1a6919,_0x600e3a){}[_0x42398e(0xa6)](_0x3564f5,_0xa86bc4){}[_0x42398e(0x11f)](_0x3eb71a){var _0x40e6e7=_0x42398e;return _0x3eb71a===this[_0x40e6e7(0x185)];}[_0x42398e(0xea)](_0xadd117,_0xcbad20){var _0x444e60=_0x42398e;this['_setNodeLabel'](_0xadd117,_0xcbad20),this[_0x444e60(0x115)](_0xadd117),_0xcbad20[_0x444e60(0xdf)]&&this[_0x444e60(0xac)](_0xadd117),this[_0x444e60(0xf0)](_0xadd117,_0xcbad20),this[_0x444e60(0x177)](_0xadd117,_0xcbad20),this[_0x444e60(0xee)](_0xadd117);}[_0x42398e(0xe3)](_0x3d23ae,_0x113eec){var _0x1810ad=_0x42398e;let _0x1746da;try{_0x1fa1aa[_0x1810ad(0x109)]&&(_0x1746da=_0x1fa1aa[_0x1810ad(0x109)][_0x1810ad(0xaf)],_0x1fa1aa['console']['error']=function(){}),_0x3d23ae&&typeof _0x3d23ae[_0x1810ad(0xc0)]=='number'&&(_0x113eec['length']=_0x3d23ae[_0x1810ad(0xc0)]);}catch{}finally{_0x1746da&&(_0x1fa1aa[_0x1810ad(0x109)][_0x1810ad(0xaf)]=_0x1746da);}if(_0x113eec[_0x1810ad(0x16c)]===_0x1810ad(0x18f)||_0x113eec['type']===_0x1810ad(0xe9)){if(isNaN(_0x113eec[_0x1810ad(0x169)]))_0x113eec[_0x1810ad(0xd3)]=!0x0,delete _0x113eec[_0x1810ad(0x169)];else switch(_0x113eec[_0x1810ad(0x169)]){case Number[_0x1810ad(0xbe)]:_0x113eec['positiveInfinity']=!0x0,delete _0x113eec[_0x1810ad(0x169)];break;case Number[_0x1810ad(0x105)]:_0x113eec[_0x1810ad(0x17e)]=!0x0,delete _0x113eec[_0x1810ad(0x169)];break;case 0x0:this[_0x1810ad(0xc6)](_0x113eec['value'])&&(_0x113eec['negativeZero']=!0x0);break;}}else _0x113eec[_0x1810ad(0x16c)]==='function'&&typeof _0x3d23ae[_0x1810ad(0xb3)]==_0x1810ad(0xeb)&&_0x3d23ae[_0x1810ad(0xb3)]&&_0x113eec[_0x1810ad(0xb3)]&&_0x3d23ae[_0x1810ad(0xb3)]!==_0x113eec[_0x1810ad(0xb3)]&&(_0x113eec[_0x1810ad(0xe2)]=_0x3d23ae[_0x1810ad(0xb3)]);}['_isNegativeZero'](_0x4be0a5){return 0x1/_0x4be0a5===Number['NEGATIVE_INFINITY'];}[_0x42398e(0xac)](_0x2afc6f){var _0x218be8=_0x42398e;!_0x2afc6f[_0x218be8(0xae)]||!_0x2afc6f['props'][_0x218be8(0xc0)]||_0x2afc6f[_0x218be8(0x16c)]==='array'||_0x2afc6f['type']===_0x218be8(0x155)||_0x2afc6f[_0x218be8(0x16c)]===_0x218be8(0xbd)||_0x2afc6f[_0x218be8(0xae)][_0x218be8(0x154)](function(_0x270618,_0x56ff62){var _0x6c3871=_0x218be8,_0x346599=_0x270618['name']['toLowerCase'](),_0x308534=_0x56ff62[_0x6c3871(0xb3)][_0x6c3871(0xb8)]();return _0x346599<_0x308534?-0x1:_0x346599>_0x308534?0x1:0x0;});}[_0x42398e(0xf0)](_0x4817a0,_0x511b51){var _0x73c91a=_0x42398e;if(!(_0x511b51[_0x73c91a(0xb7)]||!_0x4817a0[_0x73c91a(0xae)]||!_0x4817a0[_0x73c91a(0xae)][_0x73c91a(0xc0)])){for(var _0x579f3a=[],_0x216629=[],_0x483a70=0x0,_0x1077d2=_0x4817a0['props'][_0x73c91a(0xc0)];_0x483a70<_0x1077d2;_0x483a70++){var _0x5aafce=_0x4817a0['props'][_0x483a70];_0x5aafce['type']==='function'?_0x579f3a[_0x73c91a(0xf5)](_0x5aafce):_0x216629[_0x73c91a(0xf5)](_0x5aafce);}if(!(!_0x216629[_0x73c91a(0xc0)]||_0x579f3a['length']<=0x1)){_0x4817a0[_0x73c91a(0xae)]=_0x216629;var _0x56a001={'functionsNode':!0x0,'props':_0x579f3a};this[_0x73c91a(0x17b)](_0x56a001,_0x511b51),this[_0x73c91a(0xa6)](_0x56a001,_0x511b51),this['_setNodeExpandableState'](_0x56a001),this[_0x73c91a(0x103)](_0x56a001,_0x511b51),_0x56a001['id']+='\\x20f',_0x4817a0[_0x73c91a(0xae)][_0x73c91a(0x146)](_0x56a001);}}}[_0x42398e(0x177)](_0x52ec54,_0x1b03c8){}[_0x42398e(0x115)](_0x373f4b){}[_0x42398e(0x120)](_0x494ae3){var _0x21dd10=_0x42398e;return Array[_0x21dd10(0x152)](_0x494ae3)||typeof _0x494ae3==_0x21dd10(0xab)&&this['_objectToString'](_0x494ae3)===_0x21dd10(0xd0);}[_0x42398e(0x103)](_0x40053e,_0x5ed3d6){}['_cleanNode'](_0x3a1b5c){var _0x2f9dd2=_0x42398e;delete _0x3a1b5c[_0x2f9dd2(0x13d)],delete _0x3a1b5c[_0x2f9dd2(0x148)],delete _0x3a1b5c['_hasMapOnItsPath'];}[_0x42398e(0x166)](_0x798f23,_0x3efada){}}let _0x4c7a63=new _0x3276c6(),_0x19cf1b={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x3b151c={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x463c5b(_0xbd2986,_0x160277,_0x57abd3,_0x133479,_0x2a9121,_0x49d7af){var _0x20fba2=_0x42398e;let _0x7e007b,_0xafcbf9;try{_0xafcbf9=_0xf4300a(),_0x7e007b=_0x25c741[_0x160277],!_0x7e007b||_0xafcbf9-_0x7e007b['ts']>0x1f4&&_0x7e007b['count']&&_0x7e007b['time']/_0x7e007b['count']<0x64?(_0x25c741[_0x160277]=_0x7e007b={'count':0x0,'time':0x0,'ts':_0xafcbf9},_0x25c741[_0x20fba2(0x178)]={}):_0xafcbf9-_0x25c741['hits']['ts']>0x32&&_0x25c741[_0x20fba2(0x178)][_0x20fba2(0xad)]&&_0x25c741[_0x20fba2(0x178)][_0x20fba2(0x17d)]/_0x25c741[_0x20fba2(0x178)][_0x20fba2(0xad)]<0x64&&(_0x25c741[_0x20fba2(0x178)]={});let _0x1a0767=[],_0x301137=_0x7e007b[_0x20fba2(0xe0)]||_0x25c741[_0x20fba2(0x178)][_0x20fba2(0xe0)]?_0x3b151c:_0x19cf1b,_0xabddb=_0x129e7e=>{var _0x1e8e78=_0x20fba2;let _0x4eae92={};return _0x4eae92[_0x1e8e78(0xae)]=_0x129e7e[_0x1e8e78(0xae)],_0x4eae92[_0x1e8e78(0x11c)]=_0x129e7e[_0x1e8e78(0x11c)],_0x4eae92[_0x1e8e78(0x195)]=_0x129e7e[_0x1e8e78(0x195)],_0x4eae92['totalStrLength']=_0x129e7e['totalStrLength'],_0x4eae92[_0x1e8e78(0xa5)]=_0x129e7e[_0x1e8e78(0xa5)],_0x4eae92[_0x1e8e78(0x112)]=_0x129e7e[_0x1e8e78(0x112)],_0x4eae92[_0x1e8e78(0xdf)]=!0x1,_0x4eae92[_0x1e8e78(0xb7)]=!_0x6dc731,_0x4eae92[_0x1e8e78(0x173)]=0x1,_0x4eae92[_0x1e8e78(0x11a)]=0x0,_0x4eae92[_0x1e8e78(0x11e)]=_0x1e8e78(0x104),_0x4eae92['rootExpression']=_0x1e8e78(0x15f),_0x4eae92[_0x1e8e78(0xff)]=!0x0,_0x4eae92['autoExpandPreviousObjects']=[],_0x4eae92[_0x1e8e78(0x147)]=0x0,_0x4eae92[_0x1e8e78(0x176)]=!0x0,_0x4eae92[_0x1e8e78(0x10f)]=0x0,_0x4eae92[_0x1e8e78(0xde)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x4eae92;};for(var _0x2077f5=0x0;_0x2077f5<_0x2a9121[_0x20fba2(0xc0)];_0x2077f5++)_0x1a0767[_0x20fba2(0xf5)](_0x4c7a63[_0x20fba2(0x14c)]({'timeNode':_0xbd2986===_0x20fba2(0x17d)||void 0x0},_0x2a9121[_0x2077f5],_0xabddb(_0x301137),{}));if(_0xbd2986==='trace'){let _0x2cfcd4=Error[_0x20fba2(0xc2)];try{Error[_0x20fba2(0xc2)]=0x1/0x0,_0x1a0767[_0x20fba2(0xf5)](_0x4c7a63['serialize']({'stackNode':!0x0},new Error()[_0x20fba2(0xec)],_0xabddb(_0x301137),{'strLength':0x1/0x0}));}finally{Error['stackTraceLimit']=_0x2cfcd4;}}return{'method':_0x20fba2(0xef),'version':_0x1bd4eb,'args':[{'ts':_0x57abd3,'session':_0x133479,'args':_0x1a0767,'id':_0x160277,'context':_0x49d7af}]};}catch(_0x178591){return{'method':'log','version':_0x1bd4eb,'args':[{'ts':_0x57abd3,'session':_0x133479,'args':[{'type':_0x20fba2(0xdd),'error':_0x178591&&_0x178591['message']}],'id':_0x160277,'context':_0x49d7af}]};}finally{try{if(_0x7e007b&&_0xafcbf9){let _0x4a34f4=_0xf4300a();_0x7e007b[_0x20fba2(0xad)]++,_0x7e007b[_0x20fba2(0x17d)]+=_0x263d14(_0xafcbf9,_0x4a34f4),_0x7e007b['ts']=_0x4a34f4,_0x25c741[_0x20fba2(0x178)][_0x20fba2(0xad)]++,_0x25c741[_0x20fba2(0x178)][_0x20fba2(0x17d)]+=_0x263d14(_0xafcbf9,_0x4a34f4),_0x25c741[_0x20fba2(0x178)]['ts']=_0x4a34f4,(_0x7e007b[_0x20fba2(0xad)]>0x32||_0x7e007b[_0x20fba2(0x17d)]>0x64)&&(_0x7e007b[_0x20fba2(0xe0)]=!0x0),(_0x25c741[_0x20fba2(0x178)]['count']>0x3e8||_0x25c741[_0x20fba2(0x178)][_0x20fba2(0x17d)]>0x12c)&&(_0x25c741[_0x20fba2(0x178)][_0x20fba2(0xe0)]=!0x0);}}catch{}}}return _0x463c5b;}function _0x55e4(){var _0x3749cd=['_getOwnPropertyDescriptor','get','global','getOwnPropertySymbols','performance','then','_capIfString','_regExpToString','getter','process','toUpperCase','_allowedToSend','path','env','cappedProps','prototype','_addProperty','location','close','2VuKCBo','gateway.docker.internal','_hasSymbolPropertyOnItsPath','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','remix','port','_maxConnectAttemptCount','reload','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','_isPrimitiveWrapperType','_socket','unshift','autoExpandPropertyCount','_hasSetOnItsPath','getOwnPropertyDescriptor','_connectToHostNow','undefined','serialize','array','logger\\x20websocket\\x20error','_webSocketErrorDocsLink','message','setter','isArray','ws/index.js','sort','Map','18LRgzAM','','_keyStrRegExp','_p_name','elapsed','data','origin','_blacklistedProperty','_connecting','root_exp','defineProperty','_console_ninja_session','https://tinyurl.com/37x8b79t','getOwnPropertyNames','stringify','date','_setNodeExpressionPath','webpack','index','value','_p_','function','type','9360351zOghSB','_getOwnPropertySymbols','trace','substr','charAt','replace','depth','_setNodeQueryPath','nodeModules','resolveGetters','_addLoadNode','hits','_p_length','Boolean','_setNodeId','default','time','negativeInfinity','onerror','set','parent','split',\"c:\\\\Users\\\\User\\\\.vscode\\\\extensions\\\\wallabyjs.console-ninja-1.0.337\\\\node_modules\",'RegExp','_undefined','null','getWebSocketClass','versions','Symbol','edge','test','_HTMLAllCollection','\\x20server','_dateToString','number','isExpressionToEvaluate','_type','args','warn','_objectToString','strLength','6sgXWng','dockerizedApp','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','valueOf','autoExpandLimit','_setNodeLabel','onclose','host','_attemptToReconnectShortly','1.0.0','object','_sortProps','count','props','error','hasOwnProperty','9196bYiyiB','send','name','_consoleNinjaAllowedToStart','create','1396160wbqKve','noFunctions','toLowerCase','toString','_sendErrorMessage','_connectAttemptCount','parse','Set','POSITIVE_INFINITY','includes','length','_disposeWebsocket','stackTraceLimit','_treeNodePropertiesBeforeFullValue','_console_ninja','6923195mprhDB','_isNegativeZero','onopen','4iquURE','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','[object\\x20Date]','_inNextEdge','143oOEdhK','constructor','forEach','next.js','[object\\x20Array]','_property','expressionsToEvaluate','nan','enumerable','_WebSocketClass','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','cappedElements','join','1664859lGBvlL','concat','_propertyName','pop','unknown','node','sortProps','reduceLimits','onmessage','funcName','_additionalMetadata','%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','autoExpandPreviousObjects','_isMap','1','_connected','Number','_treeNodePropertiesAfterFullValue','string','stack','_isPrimitiveType','_cleanNode','log','_addFunctionsNode','catch','current','61072','disabledTrace','push','coverage','match','1377072llktZt','now','bind','_addObjectProperty','_inBrowser','WebSocket','astro','autoExpand','hostname','_WebSocket','eventReceivedCallback','_setNodePermissions','root_exp_id','NEGATIVE_INFINITY','hrtime','Buffer','method','console','_processTreeNodeResult','String','_getOwnPropertyNames','_Symbol','symbol','allStrLength','bigint','unref','autoExpandMaxDepth','20990tSacgM','_quotedRegExp','_setNodeExpandableState','2912583ZSZJTv','NEXT_RUNTIME','call','capped','level','_reconnectTimeout','elements','_allowedToConnectOnSend','expId','_isUndefined','_isArray','_isSet','url','...','_ws','timeStamp','[object\\x20Map]','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)'];_0x55e4=function(){return _0x3749cd;};return _0x55e4();}((_0x315bef,_0x51fcc7,_0x3f2f9c,_0x747322,_0x2fa032,_0xa528c2,_0x2545d3,_0x54b223,_0x26dcd8,_0xacbbdf,_0x136c7b)=>{var _0x2b35cd=_0x56455d;if(_0x315bef[_0x2b35cd(0xc4)])return _0x315bef[_0x2b35cd(0xc4)];if(!H(_0x315bef,_0x54b223,_0x2fa032))return _0x315bef[_0x2b35cd(0xc4)]={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x315bef['_console_ninja'];let _0x593cd7=b(_0x315bef),_0xcc02d4=_0x593cd7['elapsed'],_0x481ec1=_0x593cd7[_0x2b35cd(0x125)],_0x321a00=_0x593cd7[_0x2b35cd(0xf9)],_0x4d73c6={'hits':{},'ts':{}},_0x2ae46d=J(_0x315bef,_0x26dcd8,_0x4d73c6,_0xa528c2),_0x40145a=_0x521d13=>{_0x4d73c6['ts'][_0x521d13]=_0x481ec1();},_0x141c60=(_0x36839e,_0x3a1c0c)=>{var _0x32a500=_0x2b35cd;let _0xcdfe24=_0x4d73c6['ts'][_0x3a1c0c];if(delete _0x4d73c6['ts'][_0x3a1c0c],_0xcdfe24){let _0x51f486=_0xcc02d4(_0xcdfe24,_0x481ec1());_0x1d4b78(_0x2ae46d(_0x32a500(0x17d),_0x36839e,_0x321a00(),_0x2bca30,[_0x51f486],_0x3a1c0c));}},_0x26e774=_0x387b4e=>{var _0x17661f=_0x2b35cd,_0x1709e9;return _0x2fa032===_0x17661f(0xcf)&&_0x315bef[_0x17661f(0x15c)]&&((_0x1709e9=_0x387b4e==null?void 0x0:_0x387b4e['args'])==null?void 0x0:_0x1709e9[_0x17661f(0xc0)])&&(_0x387b4e[_0x17661f(0x192)][0x0][_0x17661f(0x15c)]=_0x315bef['origin']),_0x387b4e;};_0x315bef[_0x2b35cd(0xc4)]={'consoleLog':(_0x485bf4,_0x553fd3)=>{var _0x5c0eaa=_0x2b35cd;_0x315bef[_0x5c0eaa(0x109)][_0x5c0eaa(0xef)][_0x5c0eaa(0xb3)]!=='disabledLog'&&_0x1d4b78(_0x2ae46d(_0x5c0eaa(0xef),_0x485bf4,_0x321a00(),_0x2bca30,_0x553fd3));},'consoleTrace':(_0x57af1b,_0x57b66e)=>{var _0x1dd540=_0x2b35cd;_0x315bef[_0x1dd540(0x109)][_0x1dd540(0xef)][_0x1dd540(0xb3)]!==_0x1dd540(0xf4)&&_0x1d4b78(_0x26e774(_0x2ae46d(_0x1dd540(0x16f),_0x57af1b,_0x321a00(),_0x2bca30,_0x57b66e)));},'consoleTime':_0xea0884=>{_0x40145a(_0xea0884);},'consoleTimeEnd':(_0x205f45,_0x504d14)=>{_0x141c60(_0x504d14,_0x205f45);},'autoLog':(_0x21e259,_0x35d417)=>{_0x1d4b78(_0x2ae46d('log',_0x35d417,_0x321a00(),_0x2bca30,[_0x21e259]));},'autoLogMany':(_0x285da4,_0x282146)=>{_0x1d4b78(_0x2ae46d('log',_0x285da4,_0x321a00(),_0x2bca30,_0x282146));},'autoTrace':(_0x178c0a,_0x38958e)=>{var _0x215e47=_0x2b35cd;_0x1d4b78(_0x26e774(_0x2ae46d(_0x215e47(0x16f),_0x38958e,_0x321a00(),_0x2bca30,[_0x178c0a])));},'autoTraceMany':(_0x81cf2d,_0x7c5a01)=>{var _0x4852e0=_0x2b35cd;_0x1d4b78(_0x26e774(_0x2ae46d(_0x4852e0(0x16f),_0x81cf2d,_0x321a00(),_0x2bca30,_0x7c5a01)));},'autoTime':(_0x1208ea,_0x4462bb,_0x2ca64b)=>{_0x40145a(_0x2ca64b);},'autoTimeEnd':(_0x2aa671,_0x5efa9c,_0x565d2f)=>{_0x141c60(_0x5efa9c,_0x565d2f);},'coverage':_0x4c0afc=>{var _0x6374b1=_0x2b35cd;_0x1d4b78({'method':_0x6374b1(0xf6),'version':_0xa528c2,'args':[{'id':_0x4c0afc}]});}};let _0x1d4b78=X(_0x315bef,_0x51fcc7,_0x3f2f9c,_0x747322,_0x2fa032,_0xacbbdf,_0x136c7b),_0x2bca30=_0x315bef[_0x2b35cd(0x161)];return _0x315bef['_console_ninja'];})(globalThis,'127.0.0.1',_0x56455d(0xf3),_0x56455d(0x183),_0x56455d(0x167),_0x56455d(0xaa),'1722641229342',[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"ATLAS-MSI\",\"192.168.1.129\"],'',_0x56455d(0x157),_0x56455d(0xe7));");}catch(e){}};/* istanbul ignore next */function oo_oo(i,...v){try{oo_cm().consoleLog(i, v);}catch(e){} return v};/* istanbul ignore next */function oo_tr(i,...v){try{oo_cm().consoleTrace(i, v);}catch(e){} return v};/* istanbul ignore next */function oo_ts(v){try{oo_cm().consoleTime(v);}catch(e){} return v;};/* istanbul ignore next */function oo_te(v, i){try{oo_cm().consoleTimeEnd(v, i);}catch(e){} return v;};/*eslint unicorn/no-abusive-eslint-disable:,eslint-comments/disable-enable-pair:,eslint-comments/no-unlimited-disable:,eslint-comments/no-aggregating-enable:,eslint-comments/no-duplicate-disable:,eslint-comments/no-unused-disable:,eslint-comments/no-unused-enable:,*/
})();

module.exports = __webpack_exports__["default"];
/******/ })()
;