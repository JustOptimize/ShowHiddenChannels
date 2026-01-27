/**
 * @name ShowHiddenChannels
 * @displayName Show Hidden Channels (SHC)
 * @version 1.1.0
 * @author JustOptimize (Oggetto) + NicoDev (Fix build)
 * @authorId 619203349954166804
 * @source https://github.com/JustOptimize/ShowHiddenChannels
 * @invite q4gW3j5FUY
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
/* harmony import */ var _utils_modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/modules */ "./src/utils/modules.js");
// @ts-check


const {
  Components: {
    TextElement
  },
  RolePill,
  DiscordConstants,
  React
} = _utils_modules__WEBPACK_IMPORTED_MODULE_0__.ModuleStore;
const AdminRolesElement = ({
  guild,
  settings,
  roles
}) => {
  if (!settings.showAdmin) return null;
  if (settings.showAdmin === "channel") return null;
  const adminRoles = [];
  for (const role of Object.values(roles)) {
    if ((role.permissions & BigInt(8)) === BigInt(8) && (settings.showAdmin === "include" || settings.showAdmin === "exclude" && !role.tags?.bot_id)) {
      adminRoles.push(role);
    }
  }
  if (!adminRoles?.length) {
    return null;
  }
  return BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.STANDARD,
    style: {
      borderTop: "1px solid var(--background-tertiary)",
      padding: 5
    }
  }, "Admin roles:", BdApi.React.createElement("div", {
    style: {
      paddingTop: 5
    }
  }, adminRoles.map(m => BdApi.React.createElement(RolePill, {
    key: m.id,
    canRemove: false,
    className: "shc-rolePill",
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
/* harmony import */ var _utils_modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/modules */ "./src/utils/modules.js");
// @ts-check


const {
  Components: {
    TextElement
  },
  RolePill,
  DiscordConstants,
  React
} = _utils_modules__WEBPACK_IMPORTED_MODULE_0__.ModuleStore;
function ChannelRolesComponent({
  channel,
  guild,
  settings,
  roles
}) {
  const channelRoles = Object.values(channel.permissionOverwrites).filter(role => role !== undefined && role?.type === 0 && (
  //* 1024n = VIEW_CHANNEL permission
  //* 8n = ADMINISTRATOR permission
  //* If role is ADMINISTRATOR it can view channel even if overwrites deny VIEW_CHANNEL
  settings.showAdmin && (roles[role.id].permissions & BigInt(8)) === BigInt(8) ||
  //* If overwrites allow VIEW_CHANNEL (it will override the default role permissions)
  (role.allow & BigInt(1024)) === BigInt(1024) ||
  //* If role can view channel by default and overwrites don't deny VIEW_CHANNEL
  roles[role.id].permissions & BigInt(1024) && (role.deny & BigInt(1024)) === BigInt(0)));
  return BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.STANDARD,
    style: {
      borderTop: "1px solid var(--background-tertiary)",
      padding: 8
    }
  }, "Channel-specific roles:", BdApi.React.createElement("div", {
    style: {
      paddingTop: 8
    }
  }, !channelRoles?.length && BdApi.React.createElement("span", null, "None"), channelRoles?.length > 0 && channelRoles.map(m => BdApi.React.createElement(RolePill, {
    key: m.id,
    canRemove: false,
    className: "shc-rolePill",
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
/* harmony import */ var _utils_modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/modules */ "./src/utils/modules.js");
// @ts-check

const {
  Components: {
    TextElement
  },
  React
} = _utils_modules__WEBPACK_IMPORTED_MODULE_0__.ModuleStore;
function ForumComponent({
  channel
}) {
  if (channel.type !== 15) return null;
  if (!channel.availableTags && !channel.topic) {
    return null;
  }
  return BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.HEADER_SECONDARY,
    size: TextElement.Sizes.SIZE_24,
    style: {
      margin: "16px auto",
      backgroundColor: "var(--background-secondary)",
      padding: 24,
      borderRadius: 8,
      color: "var(--text-normal)",
      fontWeight: "bold",
      maxWidth: "40vw"
    }
  }, "Forum", BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.STANDARD,
    size: TextElement.Sizes.SIZE_14,
    style: {
      marginTop: 24
    }
  }, channel.availableTags && channel.availableTags.length > 0 ? `Tags: ${channel.availableTags.map(tag => tag.name).join(", ")}` : "Tags: No tags avaiable"), channel.topic && BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.STANDARD,
    size: TextElement.Sizes.SIZE_14,
    style: {
      marginTop: 16
    }
  }, "Guidelines: ", channel.topic), !channel.topic && BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.STANDARD,
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
/* harmony import */ var _utils_modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/modules */ "./src/utils/modules.js");
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// @ts-check


const {
  React,
  Components: {
    Tooltip
  }
} = _utils_modules__WEBPACK_IMPORTED_MODULE_0__.ModuleStore;
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
      display: "block"
    }
  }, props), icon === "lock" && BdApi.React.createElement("svg", {
    className: actionIcon,
    viewBox: "0 0 24 24"
  }, BdApi.React.createElement("title", null, "SHC Lock icon"), BdApi.React.createElement("path", {
    fill: "currentColor",
    d: "M17 11V7C17 4.243 14.756 2 12 2C9.242 2 7 4.243 7 7V11C5.897 11 5 11.896 5 13V20C5 21.103 5.897 22 7 22H17C18.103 22 19 21.103 19 20V13C19 11.896 18.103 11 17 11ZM12 18C11.172 18 10.5 17.328 10.5 16.5C10.5 15.672 11.172 15 12 15C12.828 15 13.5 15.672 13.5 16.5C13.5 17.328 12.828 18 12 18ZM15 11H9V7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7V11Z"
  })), icon === "eye" && BdApi.React.createElement("svg", {
    className: actionIcon,
    viewBox: "0 0 24 24"
  }, BdApi.React.createElement("title", null, "SHC Eye icon"), BdApi.React.createElement("path", {
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
// @ts-check

const {
  React
} = BdApi;
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
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: "16px",
      marginTop: "16px"
    }
  }, BdApi.React.createElement("img", {
    alt: "Icon",
    src: icon,
    width: 48,
    height: 48,
    title: "Click to toggle",
    style: {
      borderRadius: "360px",
      cursor: "pointer",
      border: enabled ? "3px solid green" : "3px solid grey",
      marginRight: "8px"
    },
    onClick: () => {
      onChange(!enabled);
      setEnabled(!enabled);
    }
  }), BdApi.React.createElement("div", {
    style: {
      maxWidth: "89%"
    }
  }, BdApi.React.createElement("div", {
    style: {
      fontSize: "20px",
      color: "var(--header-primary)",
      fontWeight: "600"
    }
  }, children), BdApi.React.createElement("div", {
    style: {
      color: "var(--header-secondary)",
      fontSize: "16px"
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
/* harmony import */ var _utils_date__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/date */ "./src/utils/date.js");
/* harmony import */ var _utils_modules__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/modules */ "./src/utils/modules.js");
/* harmony import */ var _AdminRolesComponent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AdminRolesComponent */ "./src/components/AdminRolesComponent.jsx");
/* harmony import */ var _ChannelRolesComponent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ChannelRolesComponent */ "./src/components/ChannelRolesComponent.jsx");
/* harmony import */ var _ForumComponent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ForumComponent */ "./src/components/ForumComponent.jsx");
/* harmony import */ var _UserMentionsComponent__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./UserMentionsComponent */ "./src/components/UserMentionsComponent.jsx");
// @ts-check







const {
  Components: {
    TextElement
  },
  GuildStore,
  GuildRoleStore,
  ChannelUtils,
  React
} = _utils_modules__WEBPACK_IMPORTED_MODULE_1__.ModuleStore;
const CHANNEL_TYPES = {
  0: "text",
  2: "voice",
  4: "category",
  5: "news",
  6: "store",
  13: "stage"
};

// @ts-ignore
const Lockscreen = React.memo(({
  chat,
  channel,
  settings
}) => {
  const guild = GuildStore.getGuild(channel.guild_id);
  const guildRoles = GuildRoleStore.getRolesSnapshot(guild?.id);
  return BdApi.React.createElement("div", {
    className: ["shc-hidden-chat-content", chat].filter(Boolean).join(" "),
    style: {
      justifyContent: "center",
      alignItems: "center"
    }
  }, BdApi.React.createElement("div", {
    className: "shc-hidden-notice"
  }, BdApi.React.createElement("img", {
    alt: "Hidden Channel Icon",
    style: {
      // @ts-ignore webkitUserDrag is not recognized by TypeScript but is valid in CSS
      webkitUserDrag: "none",
      maxHeight: 128,
      margin: "0 auto"
    },
    src: settings.hiddenChannelIcon === "eye" ? "https://raw.githubusercontent.com/JustOptimize/ShowHiddenChannels/main/assets/eye.png" : "/assets/755d4654e19c105c3cd108610b78d01c.svg"
  }), BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.HEADER_PRIMARY,
    size: TextElement.Sizes.SIZE_32,
    style: {
      marginTop: 20,
      fontWeight: "bold"
    }
  }, `This is a hidden ${CHANNEL_TYPES[channel.type] ?? "unknown"} channel`), BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.HEADER_SECONDARY,
    size: TextElement.Sizes.SIZE_16,
    style: {
      marginTop: 8
    }
  }, "You cannot see the contents of this channel.", " ", channel.topic && channel.type !== 15 && "However, you may see its topic."), channel.topic && channel.type !== 15 && (ChannelUtils?.renderTopic(channel, guild) || "ChannelUtils module is missing, topic won't be shown."), channel?.iconEmoji && BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.STANDARD,
    size: TextElement.Sizes.SIZE_14,
    style: {
      marginTop: 16
    }
  }, "Icon emoji: ", channel.iconEmoji.name ?? channel.iconEmoji.id), channel.rateLimitPerUser > 0 && BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.STANDARD,
    size: TextElement.Sizes.SIZE_14
  }, "Slowmode: ", (0,_utils_date__WEBPACK_IMPORTED_MODULE_0__.convertToHMS)(Number(channel.rateLimitPerUser))), channel.nsfw && BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.STANDARD,
    size: TextElement.Sizes.SIZE_14
  }, "Age-Restricted Channel (NSFW) \uD83D\uDD1E"), channel.bitrate && channel.type === 2 && BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.STANDARD,
    size: TextElement.Sizes.SIZE_14
  }, "Bitrate: ", channel.bitrate / 1000, "kbps"), BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.STANDARD,
    size: TextElement.Sizes.SIZE_14,
    style: {
      marginTop: 8
    }
  }, "Created on: ", (0,_utils_date__WEBPACK_IMPORTED_MODULE_0__.getDateFromSnowflake)(channel.id)), channel.lastMessageId && BdApi.React.createElement(TextElement, {
    color: TextElement.Colors.STANDARD,
    size: TextElement.Sizes.SIZE_14
  }, "Last message sent: ", (0,_utils_date__WEBPACK_IMPORTED_MODULE_0__.getDateFromSnowflake)(channel.lastMessageId)), settings.showPerms && channel.permissionOverwrites && BdApi.React.createElement("div", {
    style: {
      margin: "16px auto 0 auto",
      backgroundColor: "var(--background-secondary)",
      padding: 10,
      borderRadius: 5,
      color: "var(--text-normal)"
    }
  }, BdApi.React.createElement(_UserMentionsComponent__WEBPACK_IMPORTED_MODULE_5__["default"], {
    channel: channel,
    guild: guild,
    settings: settings
  }), BdApi.React.createElement(_ChannelRolesComponent__WEBPACK_IMPORTED_MODULE_3__["default"], {
    channel: channel,
    guild: guild,
    settings: settings,
    roles: guildRoles
  }), BdApi.React.createElement(_AdminRolesComponent__WEBPACK_IMPORTED_MODULE_2__["default"], {
    guild: guild,
    settings: settings,
    roles: guildRoles
  })), BdApi.React.createElement(_ForumComponent__WEBPACK_IMPORTED_MODULE_4__["default"], {
    channel: channel
  })));
});

/***/ }),

/***/ "./src/components/SettingsPanel.jsx":
/*!******************************************!*\
  !*** ./src/components/SettingsPanel.jsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingsPanel: () => (/* binding */ SettingsPanel)
/* harmony export */ });
/* harmony import */ var _utils_modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/modules */ "./src/utils/modules.js");
// @ts-check

const {
  React,
  Logger,
  DiscordConstants,
  GuildStore,
  ImageResolver,
  DEFAULT_AVATARS
} = _utils_modules__WEBPACK_IMPORTED_MODULE_0__.ModuleStore;
const {
  Components: {
    RadioInput,
    SettingGroup,
    SwitchInput: SwitchItem,
    SettingItem
  }
} = BdApi;

// If type starts with GUILD, it's a guild channel
const ChannelTypes = Object.keys(DiscordConstants?.ChannelTypes ?? {}).filter(type => type.startsWith("GUILD") && type !== "GUILD_CATEGORY");
const {
  IconSwitchWrapper
} = __webpack_require__(/*! ./IconSwitchWrapper */ "./src/components/IconSwitchWrapper.jsx");
const Switch = ({
  value,
  onChange,
  name,
  note = ""
}) => {
  return BdApi.React.createElement(React.Fragment, null, BdApi.React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginTop: "20px"
    },
    className: "bd-setting-item"
  }, BdApi.React.createElement(SwitchItem, {
    id: `switch-${name}`,
    value: value,
    onChange: i => {
      onChange(i);
    }
  }), BdApi.React.createElement("div", {
    className: "bd-setting-header",
    style: {
      alignItems: "center",
      display: "block",
      marginLeft: "10px"
    }
  }, BdApi.React.createElement("label", {
    className: "bd-setting-title",
    htmlFor: `switch-${name}`
  }, name), note !== "" && BdApi.React.createElement("div", {
    className: "bd-setting-note",
    style: {
      marginBottom: 0
    }
  }, note))), BdApi.React.createElement("hr", {
    className: "bd-divider bd-setting-divider"
  }));
};
const capitalizeFirst = string => `${string.charAt(0).toUpperCase()}${string.substring(1).toLowerCase()}`;
const randomNo = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const SettingsPanel = ({
  settings,
  onSettingsChange
}) => {
  return BdApi.React.createElement("div", null, BdApi.React.createElement(SettingGroup, {
    settings: settings,
    name: "General Settings",
    shown: false,
    id: "general-settings",
    collapsible: true
  }, BdApi.React.createElement(SettingItem, {
    id: "hiddenChannelIcon",
    name: "Hidden Channel Icon",
    note: "What icon to show as an indicator for hidden channels."
  }, BdApi.React.createElement(RadioInput, {
    name: "Hidden Channel Icon",
    options: [{
      name: "Lock Icon",
      value: "lock"
    }, {
      name: "Eye Icon",
      value: "eye"
    }, {
      name: "None",
      value: "false"
    }],
    value: settings.hiddenChannelIcon,
    onChange: value => {
      onSettingsChange("hiddenChannelIcon", value);
    }
  })), BdApi.React.createElement(SettingItem, {
    id: "sortingOrder",
    name: "Sorting Order",
    note: "Where to display Hidden Channels."
  }, BdApi.React.createElement(RadioInput, {
    name: "Sorting Order",
    options: [{
      name: "Hidden Channels in the native Discord order (default)",
      value: "native"
    }, {
      name: "Hidden Channels at the bottom of the Category",
      value: "bottom"
    }, {
      name: "Hidden Channels in a separate Category at the bottom",
      value: "extra"
    }],
    value: settings.sort,
    onChange: value => {
      onSettingsChange("sort", value);
    }
  })), BdApi.React.createElement(Switch, {
    value: settings.showPerms,
    onChange: i => {
      onSettingsChange("showPerms", i);
    },
    name: "Show Permissions",
    note: "Show what roles/users can access the hidden channel."
  }), BdApi.React.createElement(SettingItem, {
    id: "showAdmin",
    name: "Show Admin Roles",
    note: "Show roles that have ADMINISTRATOR permission in the hidden channel page (requires 'Shows Permission' enabled)."
  }, BdApi.React.createElement(RadioInput, {
    name: "Show Admin Roles",
    options: [{
      name: "Show only channel-specific roles",
      value: "channel"
    }, {
      name: "Include Bot Roles",
      value: "include"
    }, {
      name: "Exclude Bot Roles",
      value: "exclude"
    }, {
      name: "Don't Show Administrator Roles",
      value: "false"
    }],
    value: settings.showAdmin,
    onChange: value => {
      onSettingsChange("showAdmin", value);
    }
  })), BdApi.React.createElement(Switch, {
    value: settings.stopMarkingUnread,
    onChange: i => {
      onSettingsChange("stopMarkingUnread", i);
    },
    name: "Stop marking hidden channels as read",
    note: "Stops the plugin from marking hidden channels as read."
  }), BdApi.React.createElement(Switch, {
    value: settings.shouldShowEmptyCategory,
    onChange: i => {
      onSettingsChange("shouldShowEmptyCategory", i);
    },
    name: "Show Empty Category",
    note: "Show Empty Category either because there were no channels in it or all channels are under the hidden channels category."
  })), BdApi.React.createElement(SettingGroup, {
    settings: settings,
    name: "Channel Type Settings",
    shown: false,
    id: "channel-type-settings",
    collapsible: true
  }, Object.values(ChannelTypes).map(type => {
    // GUILD_STAGE_VOICE => [GUILD, STAGE, VOICE]
    const formattedTypes = type.split("_");

    // [GUILD, STAGE, VOICE] => [STAGE, VOICE]
    formattedTypes.shift();

    // [STAGE, VOICE] => Stage Voice
    const formattedType = formattedTypes.map(word => capitalizeFirst(word)).join(" ");
    return BdApi.React.createElement(Switch, {
      key: type,
      value: settings.channels[type],
      onChange: i => {
        settings.channels[type] = i;
        onSettingsChange("channels", settings.channels);
      },
      name: `Show ${formattedType} Channels`
    });
  })), BdApi.React.createElement(SettingGroup, {
    settings: settings,
    name: "Guilds Blacklist",
    shown: false,
    id: "guilds-blacklist",
    collapsible: true
  }, Object.values(GuildStore.getGuilds()).map(guild => BdApi.React.createElement(IconSwitchWrapper, {
    key: guild.id,
    note: guild.description,
    value: settings.blacklistedGuilds?.[guild.id] ?? false,
    onChange: e => {
      settings.blacklistedGuilds[guild.id] = e;
      onSettingsChange("blacklistedGuilds", settings.blacklistedGuilds);
    },
    icon: ImageResolver.getGuildIconURL(guild) ?? DEFAULT_AVATARS[randomNo(0, DEFAULT_AVATARS.length - 1)]
  }, guild.name))), BdApi.React.createElement(SettingGroup, {
    collapsible: true,
    settings: settings,
    name: "Advanced Settings",
    shown: false,
    id: "advanced-settings"
  }, BdApi.React.createElement(Switch, {
    value: settings.checkForUpdates,
    onChange: i => {
      onSettingsChange("checkForUpdates", i);
    },
    name: "Check for Updates",
    note: "Check for updates on startup."
  }), BdApi.React.createElement(Switch, {
    value: settings.usePreRelease,
    onChange: i => {
      onSettingsChange("usePreRelease", i);
    },
    name: "Use Pre-release Versions",
    note: "If enabled, you will receive pre-release versions."
  }), BdApi.React.createElement(Switch, {
    value: settings.debugMode,
    onChange: i => {
      Logger.isDebugging = true;
      Logger.debug(`Debug mode ${i ? "enabled" : "disabled"}`);
      Logger.isDebugging = i;
      onSettingsChange("debugMode", i);
    },
    name: "Debug Mode",
    note: "Enable Debug Mode."
  })));
};

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
/* harmony import */ var _utils_modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/modules */ "./src/utils/modules.js");
// @ts-check


const {
  React,
  UserMentions,
  ProfileActions,
  GuildMemberStore,
  UserStore,
  DiscordConstants,
  PermissionUtils,
  Components: {
    TextElement
  }
} = _utils_modules__WEBPACK_IMPORTED_MODULE_0__.ModuleStore;
function UserMentionsComponent({
  channel,
  guild,
  settings
}) {
  const [userMentionComponents, setUserMentionComponents] = React.useState(["Loading..."]);
  const fetchMemberAndMap = async () => {
    setUserMentionComponents(["Loading..."]);
    if (!settings.showPerms) {
      return setUserMentionComponents(["None"]);
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
      return setUserMentionComponents(["None"]);
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
    color: TextElement.Colors.STANDARD,
    size: TextElement.Sizes.SIZE_14
  }, "Users that can see this channel:", BdApi.React.createElement("div", {
    style: {
      marginTop: 8,
      marginBottom: 8,
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".shc-hidden-notice {\n\tdisplay: flex;\n\tflex-direction: column;\n\ttext-align: center;\n\toverflow-y: auto;\n\tpadding: 10dvh 0px;\n\tmargin: 0px auto;\n\twidth: 100%;\n}\n\n.shc-hidden-notice > div[class^=\"divider\"] {\n\tdisplay: none;\n}\n\n.shc-hidden-notice > div[class^=\"topic\"] {\n\tbackground-color: var(--background-secondary);\n\tpadding: 5px;\n\tmax-width: 50dvh;\n\ttext-overflow: ellipsis;\n\tborder-radius: 8px;\n\tmargin: 12px auto 0 auto;\n\toverflow: visible;\n}\n\n.shc-rolePill {\n\tbackground-color: var(--background-primary);\n\tpadding: 12px;\n\tmargin: 4px 0;\n}\n");

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
/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules */ "./src/utils/modules.js");
// @ts-check


const { Logger, LocaleManager } = _modules__WEBPACK_IMPORTED_MODULE_0__.ModuleStore;

function convertToHMS(timeInSeconds) {
	const hours = Math.floor(timeInSeconds / 3600);
	const minutes = Math.floor((timeInSeconds % 3600) / 60);
	const seconds = Math.floor((timeInSeconds % 3600) % 60);

	const formatTime = (value, unit) =>
		value > 0 ? `${value} ${unit}${value > 1 ? "s" : ""}` : "";

	return [
		formatTime(hours, "hour"),
		formatTime(minutes, "minute"),
		formatTime(seconds, "second"),
	].join(" ");
}

function getDateFromSnowflake(snowflake) {
	try {
		const DISCORD_EPOCH = BigInt("1420070400000");
		const id = BigInt(snowflake);
		const unix = (id >> BigInt(22)) + DISCORD_EPOCH;

		return new Date(Number(unix)).toLocaleString(LocaleManager._chosenLocale);
	} catch (err) {
		Logger.err(err);
		return "(Failed to get date)";
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
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   loaded_successfully: () => (/* binding */ loaded_successfully)
/* harmony export */ });
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

const ChannelItemRenderer = WebpackModules.getModule((m) =>
	m.render?.toString().includes(".ALL_MESSAGES"),
);

const ChannelItemUtils = WebpackModules.getMangled(",textFocused:", {
	icon: WebpackModules.Filters.byStrings(",textFocused:"),
});

const RolePillModule = WebpackModules.getBySource("overflow-more-roles-");
const RolePill = RolePillModule
	? Object.values(RolePillModule).find((x) => x?.render)
	: null;

const ChannelPermissionStore = WebpackModules.getByKeys(
	"getChannelPermissions",
);
if (!ChannelPermissionStore?.can) {
	loaded_successfully_internal = false;
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

const ChannelUtils = WebpackModules.getMangled(".SMALLER,className", {
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
		Object.values(UsedModules.Components).includes(undefined)
	) {
		Logger.err("Some modules are undefined.");
		return false;
	}

	Logger.info("All variables found.");
	return true;
}

const loaded_successfully = checkVariables();
const ModuleStore = UsedModules;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ModuleStore);


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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
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
		name: "ShowHiddenChannels",
		authors: [
				{
				name: "JustOptimize (Oggetto)",
			},
				{
					name: "NicoDev (Fix build)",
				},
			],
		description:
			"A plugin which displays all hidden Channels and allows users to view information about them, this won't allow you to read them (impossible).",
		version: "1.1.0",
		github: "https://github.com/JustOptimize/ShowHiddenChannels",
	},

	changelog: [{"title": "v1.1.0 - NicoDev Fix", "items": ["Fix settings mismatch: 'Stop marking hidden channels as read' now works correctly.", "Fix updater toast crash (wrong this binding) and improve semver comparisons.", "Hardening: safer fetchMessages return type + extra null-guards + cache invalidation."]}, {"title": "v0.6.6 - Fixes", "items": ["Updated modules after Discord update."]}, {"title": "v0.6.5 - Bug Fixes", "items": ["Fixed RolePill not found."]}, {"title": "v0.6.4 - Fix missing function error", "items": ["Changed getRoles to getRolesSnapshot in Lockscreen.jsx to fix a missing function error."]}],

	main: "ShowHiddenChannels.plugin.js",
	github_short: "JustOptimize/ShowHiddenChannels",
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((() => {
	// biome-ignore lint/security/noGlobalEval: This is a necessary evil
	const RuntimeRequire = eval("require");

	const { Lockscreen } = __webpack_require__(/*! ./components/Lockscreen */ "./src/components/Lockscreen.jsx");
	const { HiddenChannelIcon } = __webpack_require__(/*! ./components/HiddenChannelIcon */ "./src/components/HiddenChannelIcon.jsx");

	const {
		ModuleStore: {
			/* Library */
			Utilities,
			DOMTools,
			Logger,
			ReactTools,

			/* Discord Modules (From lib) */
			ChannelStore,
			MessageActions,
			React,
			GuildChannelStore,
			NavigationUtils,

			/* BdApi */
			ContextMenu,

			/* Manually found modules */
			DiscordConstants,
			chat,
			Route,
			ChannelItemRenderer,
			ChannelItemUtils,
			ChannelPermissionStore,
			PermissionStoreActionHandler,
			ChannelListStoreActionHandler,
			container,
			ChannelRecordBase,
			ChannelListStore,
			iconItem,
			actionIcon,
			ReadStateStore,
			Voice,
			CategoryStore,
		},
	} = __webpack_require__(/*! ./utils/modules */ "./src/utils/modules.js");

	const defaultSettings = {
		hiddenChannelIcon: "lock",
		sort: "native",
		showPerms: true,
		showAdmin: "channel",
		stopMarkingUnread: false,

		checkForUpdates: true,
		usePreRelease: false,

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

	return class ShowHiddenChannels {
		constructor(meta) {
			this.meta = meta;
			this.api = new BdApi(meta.name);

			this.hiddenChannelCache = {};

			this.collapsed = {};
			this.processContextMenu = this?.processContextMenu?.bind(this);
			this.settings = Object.assign(
				{},
				defaultSettings,
				this.api.Data.load("settings"),
			);

			this.can =
				ChannelPermissionStore.can.__originalFunction ??
				ChannelPermissionStore.can;

			Logger.isDebugging = this.settings.debugMode;
		}

		async checkForUpdates() {
			Logger.debug(
				`Checking for updates, current version: ${config.info.version}`,
			);

			const releases_raw = await fetch(
				`https://api.github.com/repos/${config.github_short}/releases`,
			);
			if (!releases_raw || !releases_raw.ok) {
				return this.api.UI.showToast(
					"(ShowHiddenChannels) Failed to check for updates.",
					{
						type: "error",
					},
				);
			}

			let releases = await releases_raw.json();
			if (!releases || !releases.length) {
				return this.api.UI.showToast(
					"(ShowHiddenChannels) Failed to check for updates.",
					{
						type: "error",
					},
				);
			}

			// Remove releases that do not have in the assets a file named ShowHiddenChannels.plugin.js
			releases = releases.filter((m) =>
				m.assets.some((n) => n.name === config.main),
			);

			const latestRelease = this.settings.usePreRelease
				? releases[0]?.tag_name?.replace("v", "")
				: releases.find((m) => !m.prerelease)?.tag_name?.replace("v", "");

			Logger.debug(
				`Latest version: ${latestRelease}, pre-release: ${!!this.settings.usePreRelease}`,
			);

			if (!latestRelease) {
				this.api.UI.alert(
					config.info.name,
					"Failed to check for updates, version not found.",
				);

				return Logger.err("Failed to check for updates, version not found.");
			}

			const parseSemver = (v) => String(v || "0").replace(/^v/i, "").split(".").map((n) => Number.parseInt(n, 10) || 0);
			const isNewer = (a, b) => {
				const pa = parseSemver(a);
				const pb = parseSemver(b);
				for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
					const da = pa[i] ?? 0;
					const db = pb[i] ?? 0;
					if (da > db) return true;
					if (da < db) return false;
				}
				return false;
			};

			if (!isNewer(latestRelease, config.info.version)) {
				return Logger.info("No updates found.");
			}

			this.api.UI.showConfirmationModal(
				"Update available",
				`ShowHiddenChannels has an update available. Would you like to update to version ${latestRelease}?`,
				{
					confirmText: "Update",
					cancelText: "Cancel",
					danger: false,

					onConfirm: async () => {
						const SHCContent = await this.api.Net.fetch(
							`https://github.com/JustOptimize/ShowHiddenChannels/releases/download/v${latestRelease}/${config.main}`,
						)
							.then((res) => res.text())
							.catch(() => {
								this.api.UI.showToast("Failed to fetch the latest version.", {
									type: "error",
								});
							});

						this.proceedWithUpdate(SHCContent, latestRelease);
					},

					onCancel: () => {
						this.api.UI.showToast("Update cancelled.", {
							type: "info",
						});
					},
				},
			);
		}

		async proceedWithUpdate(SHCContent, version) {
			Logger.debug(
				`Update confirmed by the user, updating to version ${version}`,
			);

			const failed = () => {
				this.api.UI.showToast("(ShowHiddenChannels) Failed to update.", {
					type: "error",
				});
			};

			if (!SHCContent) return failed();

			if (!SHCContent.match(/(?<=version: ").*(?=")/)) {
				return failed();
			}

			try {
				const fs = RuntimeRequire("fs");
				const path = RuntimeRequire("path");

				await fs.writeFile(
					path.join(this.api.Plugins.folder, config.main),
					SHCContent,
					(err) => {
						if (err) return failed();
					},
				);

				this.api.UI.showToast(
					`ShowHiddenChannels updated to version ${version}`,
					{
						type: "success",
					},
				);
			} catch (err) {
				return failed();
			}
		}

		start() {
			if (this.settings.checkForUpdates) {
				this.checkForUpdates();
			}

			const { loaded_successfully } = __webpack_require__(/*! ./utils/modules */ "./src/utils/modules.js");

			if (loaded_successfully) {
				this.doStart();
			} else {
				this.api.UI.showConfirmationModal(
					"(SHC) Broken Modules",
					"ShowHiddenChannels has detected that some modules are broken, would you like to start anyway? (This might break the plugin or Discord itself)",
					{
						confirmText: "Start anyway",
						cancelText: "Cancel",
						danger: true,

						onConfirm: () => {
							this.doStart();
						},

						onCancel: () => {
							this.api.Plugins.disable("ShowHiddenChannels");
						},
					},
				);
			}
		}

		doStart() {
			const savedVersion = this.api.Data.load("version");
			if (savedVersion !== this.meta.version) {
				this.api.UI.showChangelogModal({
					title: this.meta.name,
					subtitle: `v${this.meta.version}`,
					changes: config.changelog,
				});
				this.api.Data.save("version", config.info.version);
			}

			DOMTools.addStyle(config.info.name, _styles_css__WEBPACK_IMPORTED_MODULE_0__["default"]);
			this.Patch();
			this.rerenderChannels();
		}

		Patch() {
			const Patcher = this.api.Patcher;

			// Check for needed modules
			if (
				!ChannelRecordBase ||
				!DiscordConstants ||
				!ChannelStore ||
				!ChannelPermissionStore?.can ||
				!ChannelListStore?.getGuild ||
				!DiscordConstants?.ChannelTypes
			) {
				return this.api.UI.showToast(
					"(SHC) Some crucial modules are missing, aborting. (Wait for an update)",
					{
						type: "error",
					},
				);
			}

			Patcher.instead(ChannelRecordBase.prototype, "isHidden", (channel) => {
				return (
					![1, 3].includes(channel.type) &&
					!this.can(DiscordConstants.Permissions.VIEW_CHANNEL, channel)
				);
			});

			if (!ReadStateStore) {
				this.api.UI.showToast(
					"(SHC) ReadStateStore module is missing, channels will be marked as unread.",
					{
						type: "warning",
					},
				);
			}

			Patcher.after(
				ReadStateStore,
				"getGuildChannelUnreadState",
				(_, args, res) => {
					if (this.settings.stopMarkingUnread) return res;

					return args[0]?.isHidden()
						? {
							mentionCount: 0,
							unread: false,
						}
						: res;
				},
			);

			Patcher.after(ReadStateStore, "getMentionCount", (_, args, res) => {
				if (this.settings.stopMarkingUnread) return res;

				return ChannelStore.getChannel(args[0])?.isHidden() ? 0 : res;
			});

			Patcher.after(ReadStateStore, "getUnreadCount", (_, args, res) => {
				if (this.settings.stopMarkingUnread) return res;

				return ChannelStore.getChannel(args[0])?.isHidden() ? 0 : res;
			});

			Patcher.after(ReadStateStore, "hasTrackedUnread", (_, args, res) => {
				if (this.settings.stopMarkingUnread) return res;

				return res && !ChannelStore.getChannel(args[0])?.isHidden();
			});

			Patcher.after(ReadStateStore, "hasUnread", (_, args, res) => {
				if (this.settings.stopMarkingUnread) return res;

				return res && !ChannelStore.getChannel(args[0])?.isHidden();
			});

			Patcher.after(ReadStateStore, "hasUnreadPins", (_, args, res) => {
				if (this.settings.stopMarkingUnread) return res;

				return res && !ChannelStore.getChannel(args[0])?.isHidden();
			});

			//* Make hidden channel visible
			Patcher.after(
				ChannelPermissionStore,
				"can",
				(_, [permission, channel], res) => {
					if (!channel?.isHidden?.()) return res;

					if (permission === DiscordConstants.Permissions.VIEW_CHANNEL) {
						return (
							!this.settings.blacklistedGuilds[channel.guild_id] &&
							this.settings.channels[
							DiscordConstants.ChannelTypes[channel.type]
							]
						);
					}

					if (permission === DiscordConstants.Permissions.CONNECT) {
						return false;
					}

					return res;
				},
			);

			if (!Voice || !Route) {
				this.api.UI.showToast(
					"(SHC) Voice or Route modules are missing, channel lockscreen won't work.",
					{
						type: "warning",
					},
				);
			}

			Patcher.after(Route, "A", (_, _args, res) => {
				if (!Voice || !Route) return res;

				const channelId = res.props?.computedMatch?.params?.channelId;
				const guildId = res.props?.computedMatch?.params?.guildId;
				const channel = ChannelStore?.getChannel(channelId);

				if (
					guildId &&
					channel?.isHidden?.() &&
					channel?.id !== Voice.getChannelId()
				) {
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
				this.api.UI.showToast(
					"(SHC) MessageActions module is missing, this mean that the plugin could be detected by Discord.",
					{
						type: "warning",
					},
				);
			}

			Patcher.instead(
				MessageActions,
				"fetchMessages",
				(instance, [fetchConfig], res) => {
					if (ChannelStore.getChannel(fetchConfig.channelId)?.isHidden?.()) {
						return Promise.resolve();
					}

					return res.call(instance, fetchConfig);
				},
			);

			if (this.settings.hiddenChannelIcon) {
				if (!ChannelItemRenderer) {
					this.api.UI.showToast(
						"(SHC) ChannelItemRenderer module is missing, channel lock icon won't be shown.",
						{
							type: "warning",
						},
					);
				}

				Patcher.after(ChannelItemRenderer, "render", (_, [instance], res) => {
					if (!instance?.channel?.isHidden()) {
						return res;
					}

					const item = res?.props?.children?.props;
					if (item?.className) {
						item.className += ` shc-hidden-channel shc-hidden-channel-type-${instance.channel.type}`;
					}

					const children = Utilities.findInTree(
						res,
						(m) =>
							m?.props?.onClick?.toString().includes("stopPropagation") &&
							m.type === "div",
						{
							walkable: ["props", "children", "child", "sibling"],
							maxRecursion: 100,
						},
					);

					if (!children?.props) return res;

					if (children.props?.children) {
						children.props.children = [
							React.createElement(HiddenChannelIcon, {
								icon: this.settings.hiddenChannelIcon,
								iconItem: iconItem,
								actionIcon: actionIcon,
							}),
						];
					}

					const isInCallInThisChannel =
						instance.channel.type ===
						DiscordConstants.ChannelTypes.GUILD_VOICE && !instance.connected;
					if (!isInCallInThisChannel) {
						return res;
					}

					const wrapper = Utilities.findInTree(
						res,
						(channel) =>
							channel?.props?.className?.includes("shc-hidden-channel-type-2"),
						{
							walkable: ["props", "children", "child", "sibling"],
							maxRecursion: 100,
						},
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
							NavigationUtils.transitionTo(
								`/channels/${instance.channel.guild_id}/${instance.channel.id}`,
							);
						}
					};
					mainContent.props.href = null;

					return res;
				});
			}

			//* Remove lock icon from hidden voice channels
			if (!ChannelItemUtils?.icon) {
				this.api.UI.showToast(
					"(SHC) ChannelItemUtils is missing, voice channel lock icon won't be removed.",
					{
						type: "warning",
					},
				);
			}

			Patcher.before(ChannelItemUtils, "icon", (_, args) => {
				if (!args[2]) return;

				if (args[0]?.isHidden?.() && args[2].locked) {
					args[2].locked = false;
				}
			});

			//* Manually collapse hidden channel category
			if (!ChannelStore?.getChannel || !GuildChannelStore?.getChannels) {
				this.api.UI.showToast(
					"(SHC) ChannelStore or GuildChannelStore are missing, extra category settings won't work.",
					{
						type: "warning",
					},
				);
			}

			Patcher.after(ChannelStore, "getChannel", (_, [channelId], res) => {
				const guild_id = channelId?.replace("_hidden", "");
				const isHiddenCategory = channelId?.endsWith("_hidden");

				if (
					this.settings.sort !== "extra" ||
					!isHiddenCategory ||
					this.settings.blacklistedGuilds[guild_id]
				) {
					return res;
				}

				const HiddenCategoryChannel = new ChannelRecordBase({
					guild_id: guild_id,
					id: channelId,
					name: "Hidden Channels",
					type: DiscordConstants.ChannelTypes.GUILD_CATEGORY,
				});

				return HiddenCategoryChannel;
			});

			Patcher.after(
				ChannelStore,
				"getMutableGuildChannelsForGuild",
				(_, [guildId], GuildChannels) => {
					if (!GuildChannelStore?.getChannels) return;

					if (
						this.settings.sort !== "extra" ||
						this.settings.blacklistedGuilds[guildId]
					) {
						return;
					}

					const hiddenCategoryId = `${guildId}_hidden`;
					const HiddenCategoryChannel = new ChannelRecordBase({
						guild_id: guildId,
						id: hiddenCategoryId,
						name: "Hidden Channels",
						type: DiscordConstants.ChannelTypes.GUILD_CATEGORY,
					});

					const GuildCategories =
						GuildChannelStore.getChannels(guildId)[
						DiscordConstants.ChannelTypes.GUILD_CATEGORY
						];
					Object.defineProperty(HiddenCategoryChannel, "position", {
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
				},
			);

			Patcher.after(GuildChannelStore, "getChannels", (_, [guildId], res) => {
				const GuildCategories =
					res[DiscordConstants.ChannelTypes.GUILD_CATEGORY];
				const hiddenCategoryId = `${guildId}_hidden`;
				const hiddenCategory = GuildCategories?.find(
					(m) => m.channel.id === hiddenCategoryId,
				);

				if (!hiddenCategory) return res;

				const OtherCategories = GuildCategories.filter(
					(m) => m.channel.id !== hiddenCategoryId,
				);
				const newComparator =
					(
						OtherCategories[OtherCategories.length - 1] || {
							comparator: 0,
						}
					).comparator + 1;

				Object.defineProperty(hiddenCategory.channel, "position", {
					value: newComparator,
					writable: true,
				});

				Object.defineProperty(hiddenCategory, "comparator", {
					value: newComparator,
					writable: true,
				});

				return res;
			});

			//* Custom category or sorting order
			Patcher.after(ChannelListStore, "getGuild", (_, [guildId], res) => {
				if (this.settings.blacklistedGuilds[guildId]) {
					return;
				}

				const guildChannels = res.guildChannels;
				const specialCategories = [
					guildChannels.favoritesCategory,
					guildChannels.recentsCategory,
					guildChannels.noParentCategory,
					guildChannels.voiceChannelsCategory,
				];

				switch (this.settings.sort) {
					case "bottom": {
						for (const category of specialCategories) {
							this.sortChannels(category);
						}

						for (const category of Object.values(guildChannels.categories)) {
							this.sortChannels(category);
						}

						break;
					}

					case "extra": {
						const hiddenCategoryId = `${guildId}_hidden`;
						const HiddenCategory =
							res.guildChannels.categories[hiddenCategoryId];
						const HiddenChannels = this.getHiddenChannelRecord(
							[
								...specialCategories,
								...Object.values(res.guildChannels.categories).filter(
									(category) => category.id !== hiddenCategoryId,
								),
							],
							guildId,
						);

						HiddenCategory.channels = Object.fromEntries(
							Object.entries(HiddenChannels.records).map(([id, channel]) => {
								channel.category = HiddenCategory;
								channel.record.parent_id = hiddenCategoryId;
								return [id, channel];
							}),
						);

						HiddenCategory.isCollapsed =
							res.guildChannels.collapsedCategoryIds[hiddenCategoryId] ??
							CategoryStore.isCollapsed(hiddenCategoryId);
						if (HiddenCategory.isCollapsed) {
							res.guildChannels.collapsedCategoryIds[hiddenCategoryId] = true;
						}

						HiddenCategory.shownChannelIds =
							res.guildChannels.collapsedCategoryIds[hiddenCategoryId] ||
								HiddenCategory.isCollapsed
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

				if (this.settings.shouldShowEmptyCategory) {
					this.patchEmptyCategoryFunction([
						...Object.values(res.guildChannels.categories).filter(
							(m) => !m.id.includes("hidden"),
						),
					]);
				}

				return res;
			});

			//* add entry in guild context menu
			if (!ContextMenu?.patch) {
				this.api.UI.showToast("(SHC) ContextMenu is missing, skipping.", {
					type: "warning",
				});
			}

			ContextMenu?.patch("guild-context", this.processContextMenu);
		}

		processContextMenu(menu, { guild }) {
			const menuCategory = menu?.props?.children?.find((buttonCategory) => {
				const children = buttonCategory?.props?.children;
				return (
					Array.isArray(children) &&
					children.some((button) => button?.props?.id === "hide-muted-channels")
				);
			});

			if (!menuCategory || !guild) return;

			menuCategory.props.children.push(
				ContextMenu.buildItem({
					type: "toggle",
					label: "Disable SHC",
					checked: this.settings.blacklistedGuilds[guild.id],
					action: () => {
						this.settings.blacklistedGuilds[guild.id] =
							!this.settings.blacklistedGuilds[guild.id];
						this.saveSettings();
					},
				}),
			);
		}

		patchEmptyCategoryFunction(categories) {
			for (const category of categories) {
				if (!category.shouldShowEmptyCategory.__originalFunction) {
					category.shouldShowEmptyCategory = () => true;
				}
			}
		}

		sortChannels(category) {
			if (!category || category.isCollapsed) return;

			const channelArray = Object.values(category.channels);

			const calculatePosition = (record) => {
				return (
					record.position +
					(record.isGuildVocal() ? 1000 : 0) +
					(record.isHidden() ? 10000 : 0)
				);
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
				const channelRecords = Object.entries(category.channels);
				const filteredChannelRecords = channelRecords
					.map(([channelID, channelRecord]) => {
						if (hiddenChannels.channels.some((m) => m.id === channelID)) {
							if (
								!this.hiddenChannelCache[guildId].some(
									(m) => m[0] === channelID,
								)
							) {
								this.hiddenChannelCache[guildId].push([
									channelID,
									channelRecord,
								]);
							}
							return false;
						}
						return [channelID, channelRecord];
					})
					.filter(Boolean);

				category.channels = Object.fromEntries(filteredChannelRecords);
				if (category.hiddenChannelIds) {
					category.hiddenChannelIds = category.hiddenChannelIds.filter((v) =>
						filteredChannelRecords.some(([id]) => id === v),
					);
				}

				if (category.shownChannelIds) {
					category.shownChannelIds = category.shownChannelIds.filter((v) =>
						filteredChannelRecords.some(([id]) => id === v),
					);
				}
			}

			return {
				records: Object.fromEntries(this.hiddenChannelCache[guildId]),
				...hiddenChannels,
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

			const guildChannels =
				ChannelStore.getMutableGuildChannelsForGuild(guildId);
			const hiddenChannels = Object.values(guildChannels).filter(
				(m) =>
					m.isHidden() &&
					m.type !== DiscordConstants.ChannelTypes.GUILD_CATEGORY,
			);

			const ChannelsAndCount = {
				channels: hiddenChannels,
				amount: hiddenChannels.length,
			};
			return ChannelsAndCount;
		}

		rerenderChannels() {
			// Cache can become stale after role/permission updates; reset before rerender
			this.hiddenChannelCache = {};
			PermissionStoreActionHandler?.CONNECTION_OPEN();
			ChannelListStoreActionHandler?.CONNECTION_OPEN();

			this.forceUpdate(document.querySelector(`.${container}`));
		}

		/**
		 * Forces the rerender of a React element.
		 * @param {HTMLElement} element - The element to rerender.
		 * @returns {void}
		 */
		forceUpdate(element) {
			if (!element) return;

			const toForceUpdate = ReactTools.getOwnerInstance(element);
			const forceRerender = this.api.Patcher.instead(
				toForceUpdate,
				"render",
				() => {
					forceRerender();
					return null;
				},
			);

			toForceUpdate.forceUpdate(() => toForceUpdate.forceUpdate(() => { }));
		}

		stop() {
			this.api.Patcher.unpatchAll();
			DOMTools.removeStyle(config.info.name);
			ContextMenu?.unpatch("guild-context", this.processContextMenu);
			this.rerenderChannels();
		}

		getSettingsPanel() {
			const { SettingsPanel } = __webpack_require__(/*! ./components/SettingsPanel */ "./src/components/SettingsPanel.jsx");

			return React.createElement(SettingsPanel, {
				settings: this.settings,
				onSettingsChange: (newSetting, value) => {
					this.settings = {
						...this.settings,
						[newSetting]: value,
					};
					Logger.debug(`Setting changed: ${newSetting} => ${value}`);
					this.saveSettings();
				},
			});
		}

		reloadNotification(
			coolText = "Reload Discord to apply changes and avoid bugs",
		) {
			this.api.UI.showConfirmationModal("Reload Discord?", coolText, {
				confirmText: "Reload",
				cancelText: "Later",
				onConfirm: () => {
					window.location.reload();
				},
			});
		}

		saveSettings() {
			this.api.Data.save("settings", this.settings);
			Logger.debug("Settings saved.", this.settings);
			this.rerenderChannels();
		}
	};
})());

})();

module.exports = __webpack_exports__["default"];
/******/ })()
;