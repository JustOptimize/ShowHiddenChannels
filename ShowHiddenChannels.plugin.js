/**
 * @name ShowHiddenChannels
 * @displayName Show Hidden Channels (SHC)
 * @version 0.1.5
 * @author JustOptimize (Oggetto)
 * @authorId 347419615007080453
 * @source https://github.com/JustOptimize/return-ShowHiddenChannels
 * @updateUrl https://raw.githubusercontent.com/JustOptimize/return-ShowHiddenChannels/main/ShowHiddenChannels.plugin.js
*/

module.exports = (() => {

  const config = {
    info: {
      name: "ShowHiddenChannels",
      authors: [{
        name: "JustOptimize (Oggetto)",
      }],
      description: "A plugin which displays all hidden Channels, which can't be accessed due to Role Restrictions, this won't allow you to read them (impossible).",
      version: "0.1.5",
      github: "https://github.com/JustOptimize/return-ShowHiddenChannels",
      github_raw: "https://raw.githubusercontent.com/JustOptimize/return-ShowHiddenChannels/main/ShowHiddenChannels.plugin.js"
    },

    changelog: [
      {
        title: "v0.1.5",
        items: [
          "Added permissions to the channel page"
        ]
      },
      {
        title: "v0.1.4",
        items: [
          "Added eye icon",
          "Bug fixes",
        ]
      },
      {
        title: "v0.1.3",
        items: [
          "Added information about forums on the \"This is a hidden channel\" page",
        ]
      },
      {
        title: "v0.1.2",
        items: [
          "Added slowmode and nsfw to the channel page",
        ]
      },
      {
        title: "v0.1.1",
        items: [
          "Added support for forum channels",
        ]
      },
      {
        title: "v0.1.0",
        items: [
          "Added a new option to hide the hidden channels from the channel list",
          "Brought back channel locked page",
          "Bug fixes"
        ]
      },
      {
        title: "v0.0.8",
        items: [
          "Removed old and buggy lock icons and updated some code",
        ]
      },
      {
        title: "v0.0.7",
        items: [
          "Fixed notification issue",
        ]
      },
      {
        title: "v0.0.6",
        items: [
          "Added back the old lock icon and modified settings to be more user friendly",
        ]
      },
      {
        title: "v0.0.5",
        items: [
          "Added more settings for the lock icon",
        ]
      },
      {
        title: "v0.0.4",
        items: [
          "Added some settings to the plugin",
        ]
      },
      {
        title: "v0.0.3",
        items: [
          "Added lock icon to hidden channels",
        ],
      }
    ],

    main: "ShowHiddenChannels.plugin.js",
  };

  return !window.hasOwnProperty("ZeresPluginLibrary")
    ? class {
        load() {
          BdApi.showConfirmationModal(
            "ZLib Missing",
            `The library plugin (ZeresPluginLibrary) needed for ${config.info.name} is missing. Please click Download Now to install it.`,
            {
              confirmText: "Download Now",
              cancelText: "Cancel",
              onConfirm: () => this.downloadZLib(),
            }
          );
        }
        async downloadZLib() {
          const fs = require("fs");
          const path = require("path");
          const ZLib = await fetch("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js");
          if (!ZLib.ok) return this.errorDownloadZLib();
          const ZLibContent = await ZLib.text();
          try {
            await fs.writeFile(
              path.join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"),
              ZLibContent,
              (err) => {
                if (err) return this.errorDownloadZLib();
              }
            );
          } catch (err) {
            return this.errorDownloadZLib();
          }
        }
        errorDownloadZLib() {
          const { shell } = require("electron");
          BdApi.showConfirmationModal(
            "Error Downloading",
            [
              `ZeresPluginLibrary download failed. Manually install plugin library from the link below.`,
            ],
            {
              confirmText: "Download",
              cancelText: "Cancel",
              onConfirm: () => {
                shell.openExternal(
                  "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js"
                );
              },
            }
          );
        }
        start() {}
        stop() {}
      }
    : (([Plugin, Library]) => {

    const {
      WebpackModules,
      Patcher,
      Utilities,
      DOMTools,
      Logger,
      PluginUpdater,
      ReactTools,
      Modals,
      Settings: { SettingField, SettingPanel, SettingGroup, Switch, RadioGroup, Dropdown },
      DiscordModules: {
        SwitchRow,
        ChannelStore,
        MessageActions,
        TextElement,
        React,
        ReactDOM,
        Tooltip,
        LocaleManager
      }
    } = Library;

    const { ContextMenu } = BdApi;
    const DiscordConstants = WebpackModules.getModule((m) => m?.Plq?.ADMINISTRATOR == 8n);
    const { chat } = WebpackModules.getByProps("chat", "chatContent");

    const Route = WebpackModules.getModule((m) =>
      ["impressionName", "impressionProperties", "disableTrack"].every(
        (s) => m?.Z?.toString().includes(s)
      )
    );
    const ChannelItem = WebpackModules.getModule((m) =>
      ["canHaveDot", "unreadRelevant", "UNREAD_HIGHLIGHT"].every((s) =>
        m?.Z?.toString().includes(s)
      )
    );
    const ChannelUtil = WebpackModules.getModule((m) =>
      ["locked", "hasActiveThreads"].every((s) =>
        m?.KS?.toString().includes(s)
      )
    );

    const ChannelClasses = WebpackModules.getByProps("wrapper", "mainContent");
    const ChannelPermissionStore = WebpackModules.getByProps("getChannelPermissions");
    const { container } = WebpackModules.getByProps("container", "hubContainer");
    const Channel = WebpackModules.getByPrototypes("isManaged");
    const ChannelListStore = WebpackModules.getByProps("getGuildWithoutChangingCommunityRows");
    const IconUtils = WebpackModules.getByProps("getUserAvatarURL");
    const { DEFAULT_AVATARS } = WebpackModules.getByProps("DEFAULT_AVATARS");
    const { iconItem, actionIcon } = WebpackModules.getByProps("iconItem");
    const UnreadStore = WebpackModules.getByProps("isForumPostUnread");
    const Voice = WebpackModules.getByProps("getVoiceStateStats");
    const GuildStore = WebpackModules.getByProps("getGuild", "getGuilds");

    const ChannelUtils = {
      filter: ["channel", "guild"],
      get Module() {
        return WebpackModules.getModule((m) => this.filter.every((s) =>
          m?.v0?.toString().includes(s)
        ));
      },
      get ChannelTopic() {
        return this.Module.v0;
      },
    };

    const ChannelTypes = [
      "GUILD_TEXT",
      "GUILD_VOICE",
      "GUILD_ANNOUNCEMENT",
      "GUILD_STORE",
      "GUILD_STAGE_VOICE",
      "GUILD_FORUM",
    ];

    const capitalizeFirst = (string) => `${string.charAt(0).toUpperCase()}${string.substring(1).toLowerCase()}`;
    const randomNo = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    const CSS = `
      .shc-locked-notice {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: auto;
          text-align: center;
      }	 
      .shc-locked-notice > div[class^="divider"] {
          display: none
      }	 
      .shc-locked-notice > div[class^="topic"] {
          background-color: var(--background-secondary);
          padding: 5px;
          max-width: 50vh;
          text-overflow: ellipsis;
          border-radius: 5px;
          margin: 10px auto;
      }
    `;

    const defaultSettings = {
      disableIcons: false,
      MarkUnread: false,
      debugMode: false,

      hiddenChannelIcon: "lock",
      sort: "native",

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

    class IconSwitchWrapper extends React.Component {
      constructor(props) {
        super(props);
        this.state = { enabled: this.props.value };
      }
      render() {
        return React.createElement(
          SwitchRow,
          Object.assign({}, this.props, {
            value: this.state.enabled,
            onChange: (e) => {
              this.props.onChange(e);
              this.setState({ enabled: e });
            },
          }),
          React.createElement(
            "div",
            { className: "img-switch-wrapper" },
            this.props.icon &&
              React.createElement("img", {
                src: this.props.icon,
                width: 32,
                height: 32,
                style: {
                  borderRadius: "360px",
                },
              }),
            React.createElement(
              "div",
              {
                style: {
                  display: "inline",
                  fontSize: "22px",
                  position: "relative",
                  bottom: "7.5px",
                  left: "2.5px",
                },
              },
              this.props.children
            )
          )
        );
      }
    }
    class IconSwitch extends SettingField {
      constructor(name, note, isChecked, onChange, options = {}) {
        super(name, note, onChange);
        this.disabled = options.disabled;
        this.icon = options.icon;
        this.value = isChecked;
      }
      onAdded() {
        ReactDOM.render(
          React.createElement(IconSwitchWrapper, {
            icon: this.icon,
            children: this.name,
            note: this.note,
            disabled: this.disabled,
            hideBorder: false,
            value: this.value,
            onChange: (e) => {
              this.onChange(e);
            },
          }),
          this.getElement()
        );
      }
    }

    return class ShowHiddenChannels extends Plugin {
      constructor() {
        super();
        this.processContextMenu = this.processContextMenu.bind(this);
        this.settings = Utilities.loadData(config.info.name, "settings", defaultSettings);
        this.can = ChannelPermissionStore.can.__originalFunction ?? ChannelPermissionStore.can;
      }

      checkForUpdates() {
        try {
          PluginUpdater.checkForUpdate(
            config.info.name,
            config.info.version,
            config.info.github_raw
          );
        } catch (err) {
          Logger.err("Plugin Updater could not be reached.", err);
        }
      }

      onStart() {
        this.checkForUpdates();
        DOMTools.addStyle(config.info.name, CSS);
        this.Patch();
        this.rerenderChannels();
      }

      Patch() {
        if(this.settings.debugMode) {
          console.log("UnreadStore", UnreadStore);
          console.log("ChannelItem", ChannelItem);
        }

        Patcher.instead(Channel.prototype, "isHidden", (_, args, res) => {
          return (![1, 3].includes(_.type) && !this.can(DiscordConstants.Plq.VIEW_CHANNEL, _));
        });

        if(!this.settings.MarkUnread) {
          Patcher.after(UnreadStore, "getGuildChannelUnreadState", (_, args, res) =>{
            return args[0]?.isHidden() ? {mentionCount: 0, hasNotableUnread: false} : res ;
          });

          Patcher.after(UnreadStore, "getMentionCount", (_, args, res) => {
            return ChannelStore.getChannel(args[0])?.isHidden() ? 0 : res;
          });

          Patcher.after(UnreadStore, "getUnreadCount", (_, args, res) => {
            return ChannelStore.getChannel(args[0])?.isHidden() ? 0 : res;
          });

          Patcher.after(UnreadStore, "hasNotableUnread", (_, args, res) => {             
            return res && !ChannelStore.getChannel(args[0])?.isHidden();
          });

          Patcher.after(UnreadStore, "hasRelevantUnread", (_, args, res) => {
            return res && !args[0].isHidden();
          });

          Patcher.after(UnreadStore, "hasTrackedUnread", (_, args, res) => {
            return res && !ChannelStore.getChannel(args[0])?.isHidden();
          });

          Patcher.after(UnreadStore, "hasUnread", (_, args, res) => {
            return res && !ChannelStore.getChannel(args[0])?.isHidden();
          });

          Patcher.after(UnreadStore, "hasUnreadPins", (_, args, res) => {
            return res && !ChannelStore.getChannel(args[0])?.isHidden();
          });
        }

        //* Make hidden channel visible
        Patcher.after(ChannelPermissionStore, "can", (_, args, res) => {
          if(!args[1]?.isHidden?.()) return res;

          if (args[0] == DiscordConstants.Plq.VIEW_CHANNEL)
            return (!this.settings["blacklistedGuilds"][args[1].guild_id] && this.settings["channels"][DiscordConstants.d4z[args[1].type]]);
          if (args[0] == DiscordConstants.Plq.CONNECT)
            return false;

          return res;
        });

        Patcher.after(Route, "Z", (_, args, res) => {
          const channelId = res.props?.computedMatch?.params?.channelId;
          const guildId = res.props?.computedMatch?.params?.guildId;
          let channel;
          if (
            channelId &&
            guildId &&
            (channel = ChannelStore.getChannel(channelId)) &&
            channel?.isHidden?.() &&
            channel?.id != Voice.getChannelId()
          ) {
            res.props.render = () =>
              React.createElement(this.lockscreen(), {
                channel: channel,
                guild: GuildStore.getGuild(guildId),
              });
          }
          return res;
        });
        
        //* Stop fetching messages if the channel is hidden
        Patcher.instead(MessageActions, "fetchMessages", (_, [args], res) => {
          if (ChannelStore.getChannel(args.channelId)?.isHidden?.()){
            // BdApi.showToast("Channel is hidden, not fetching messages", {type: "error"});
            return;
          }

          return res(args);
        });
        
        if (!this.settings.disableIcons) {
          Patcher.after(ChannelItem, "Z", (_, args, res) => {
            const instance = args[0];
            if (instance.channel?.isHidden()) {
              const item = res.props?.children?.props;
              if (item?.className)
                item.className += ` shc-hidden-channel shc-hidden-channel-type-${instance.channel.type}`;

              const children = Utilities.findInReactTree(res, (m) =>
                m?.props?.onClick?.toString().includes("stopPropagation")
              );
              
              if (children.props?.children){
                children.props.children = [
                  React.createElement(
                    Tooltip,
                    {
                      text: "Hidden Channel",
                    },
                    (props) =>
                      React.createElement(
                        "div",
                        {
                          ...props,
                          className: `${iconItem}`,
                          style: {
                            display: "block",
                          },
                        },
                        this.settings["hiddenChannelIcon"] == "lock" &&
                          React.createElement(
                            "svg",
                            {
                              class: actionIcon,
                              viewBox: "0 0 24 24",
                            },
                              React.createElement("path", {
                                fill: "currentColor",
                                d: "M17 11V7C17 4.243 14.756 2 12 2C9.242 2 7 4.243 7 7V11C5.897 11 5 11.896 5 13V20C5 21.103 5.897 22 7 22H17C18.103 22 19 21.103 19 20V13C19 11.896 18.103 11 17 11ZM12 18C11.172 18 10.5 17.328 10.5 16.5C10.5 15.672 11.172 15 12 15C12.828 15 13.5 15.672 13.5 16.5C13.5 17.328 12.828 18 12 18ZM15 11H9V7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7V11Z",
                              }),
                          ),

                        this.settings["hiddenChannelIcon"] == "eye" &&
                          React.createElement(
                            "svg",
                            {
                              class: actionIcon,
                              viewBox: "0 0 24 24",
                            },
                            React.createElement("path", {
                              fill: "currentColor",
                              d: "M12 5C5.648 5 1 12 1 12C1 12 5.648 19 12 19C18.352 19 23 12 23 12C23 12 18.352 5 12 5ZM12 16C9.791 16 8 14.21 8 12C8 9.79 9.791 8 12 8C14.209 8 16 9.79 16 12C16 14.21 14.209 16 12 16Z",
                            }),
                            React.createElement("path", {
                              fill: "currentColor",
                              d: "M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z",
                            }),
                            React.createElement("polygon", {
                              fill: "currentColor",
                              points:
                                "22.6,2.7 22.6,2.8 19.3,6.1 16,9.3 16,9.4 15,10.4 15,10.4 10.3,15 2.8,22.5 1.4,21.1 21.2,1.3 ",
                            })
                          )
                      )
                    )
                ];
              }

              if (
                instance.channel.type == DiscordConstants.d4z.GUILD_VOICE &&
                !instance.connected
              ) {
                const wrapper = Utilities.findInReactTree(res, (n) =>
                  n?.props?.className?.includes(ChannelClasses.wrapper)
                );
                if (wrapper) {
                  wrapper.props.onMouseDown = () => {};
                  wrapper.props.onMouseUp = () => {};
                }
                const mainContent = Utilities.findInReactTree(res, (n) =>
                  n?.props?.className?.includes(ChannelClasses.mainContent)
                );

                if (mainContent) {
                  mainContent.props.onClick = () => {};
                  mainContent.props.href = null;
                }
              }
            }
            return res;
          });
        }

        //* Remove lock icon from hidden voice channels
        Patcher.before(ChannelUtil, "KS", (_, args) => {
          if (!args[2]) return;
          if (args[0]?.isHidden?.() && args[2].locked)
            args[2].locked = false;
        });

        ContextMenu.patch("guild-context", this.processContextMenu);
      }

      lockscreen() {
        var rolesCount = 0;

        return React.memo((props) => {
          
          if(this.settings.debugMode){
            console.log(props);
          }

          return React.createElement(
            "div",
            {
              className: ["shc-locked-chat-content", chat].filter(Boolean).join(" "),
            },
            React.createElement(
              "div",
              {
                className: "shc-locked-notice",
              },
              React.createElement("img", {
                style: {
                  WebkitUserDrag: "none",
                  maxHeight: 128,
                },
                src: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/unknown copy.png",
              }),
              React.createElement(
                TextElement,
                {
                  color: TextElement.Colors.HEADER_PRIMARY,
                  size: TextElement.Sizes.SIZE_32,
                  style: {
                    marginTop: 20,
                    fontWeight: "bold"
                  },
                },
                "This is a hidden channel."
              ),
              React.createElement(
                TextElement,
                {
                  color: TextElement.Colors.HEADER_SECONDARY,
                  size: TextElement.Sizes.SIZE_16,
                  style: {
                    marginTop: 10,
                  },
                },
                "You cannot see the contents of this channel. ",
                props.channel.topic && props.channel.type != 15 && "However, you may see its topic."
              ),
              //* Topic
              props.channel.topic && props.channel.type != 15 && props.guild && ChannelUtils?.ChannelTopic(props.channel, props.guild),

              //* Last message
              props.channel.lastMessageId &&
                React.createElement(
                  TextElement,
                  {
                    color: TextElement.Colors.INTERACTIVE_NORMAL,
                    size: TextElement.Sizes.SIZE_14,
                  },
                  "Last message sent: ",
                  this.getDateFromSnowflake(props.channel.lastMessageId)
                ),

              //* Permissions
              props.channel.permissionOverwrites &&
                React.createElement(
                  TextElement,
                  {
                    color: TextElement.Colors.INTERACTIVE_NORMAL,
                    size: TextElement.Sizes.SIZE_14,
                    style: {
                      marginTop: 10,
                    }, 
                  },
                  "Roles that can see this channel: ",
                  Object.values(props.channel.permissionOverwrites).map((role) => {
                    if (role.type != 0) {
                      return;
                    }
                    
                    if (role.allow & BigInt(1024)) {
                      rolesCount++;
                      return props.guild.roles[role.id].name;
                    }
                  }).filter(Boolean).join(", "),
                  rolesCount == 0 && "None"
                ),

              //* Slowmode
              props.channel.rateLimitPerUser > 0 &&
                React.createElement(
                  TextElement,
                  {
                    color: TextElement.Colors.INTERACTIVE_NORMAL,
                    size: TextElement.Sizes.SIZE_14,
                    style: {
                      marginTop: 10,
                    },
                  },
                  "Slowmode: ",
                  this.convertToHMS(props.channel.rateLimitPerUser)
                ),

              //* NSFW
              props.channel.nsfw &&
                React.createElement(
                  TextElement,
                  {
                    color: TextElement.Colors.INTERACTIVE_NORMAL,
                    size: TextElement.Sizes.SIZE_14,
                    style: {
                      marginTop: 10,
                    },
                  },
                  "Age-Restricted Channel (NSFW) 🔞"
                ),

              //* Forums
              props.channel.type == 15 && (props.channel.availableTags || props.channel.topic) &&
                React.createElement(
                  "div",
                  {
                    style: {
                      marginTop: 20,
                      backgroundColor: "var(--background-secondary)",
                      padding: 10,
                      borderRadius: 5,
                      color: "var(--text-normal)",

                    },
                  },

                  React.createElement(
                    TextElement,
                    {
                      color: TextElement.Colors.HEADER_SECONDARY,
                      size: TextElement.Sizes.SIZE_16,
                      style: {
                        fontWeight: "bold",
                        marginBottom: 10,
                      },
                    },
                    "Forum"
                  ),

                  //* Tags
                  props.channel.availableTags && props.channel.availableTags.length > 0 &&
                    React.createElement(
                      TextElement,
                      {
                        color: TextElement.Colors.INTERACTIVE_NORMAL,
                        size: TextElement.Sizes.SIZE_14,
                        style: {
                          marginTop: 10,
                        },
                      },
                      "Tags: ",
                      props.channel.availableTags.map((tag) => tag.name).join(", ")
                    ),

                  //* Guidelines
                  props.channel.topic &&
                    React.createElement(
                      TextElement,
                      {
                        color: TextElement.Colors.INTERACTIVE_NORMAL,
                        size: TextElement.Sizes.SIZE_14,
                        style: {
                          marginTop: 10,
                        },
                      },
                      "Guidelines: ",
                      props.channel.topic
                    )
                )
            )
          );
        });
      }
      
      convertToHMS(seconds) {
        seconds = Number(seconds);
        var h = Math.floor(seconds / 3600);
        var m = Math.floor((seconds % 3600) / 60);
        var s = Math.floor((seconds % 3600) % 60);

        var hDisplay = h > 0 ? h + (h == 1 ? " hour" : " hours") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return hDisplay + mDisplay + sDisplay;
      }
      
      getDateFromSnowflake(number) {
        try {
          const id = parseInt(number);
          const binary = id.toString(2).padStart(64, "0");
          const excerpt = binary.substring(0, 42);
          const decimal = parseInt(excerpt, 2);
          const unix = decimal + 1420070400000;
          return new Date(unix).toLocaleString(LocaleManager._chosenLocale);
        } catch (err) {
          Logger.err(err);
          return "(Failed to get date)";
        }
      }

      processContextMenu(menu, { guild }) {
        const menuCatagory = menu?.props?.children?.find(
          (m) => Array.isArray(m?.props?.children) && m?.props?.children.some(
            (m) => m.props.id == "hide-muted-channels"
          )
        );

        if (!menuCatagory || !guild) return;

        menuCatagory.props.children.push(
          ContextMenu.buildItem({
            type: "toggle",
            label: "Hide Locked Channels",
            checked: this.settings["blacklistedGuilds"][guild.id],
            action: () => {
              this.settings["blacklistedGuilds"][guild.id] = !this.settings["blacklistedGuilds"][guild.id];
              this.reloadNotification();
              this.saveSettings();
            },
          })
        );
      }

      getHiddenChannels(guildId) {
        if (!guildId) return {
          channels: [],
          amount: 0
        };

        const guildChannels = ChannelStore.getMutableGuildChannelsForGuild(guildId);
        const hiddenChannels = Object.values(guildChannels).filter(m => m.isHidden() && m.type != DiscordConstants.d4z.GUILD_CATEGORY)
        
        return { channels: hiddenChannels, amount: hiddenChannels.length };
      }

      rerenderChannels() {
        const ChannelPermsssionCache = ChannelPermissionStore.__getLocalVars();
        
        for (const key in ChannelPermsssionCache) {
          if (typeof ChannelPermsssionCache[key] != "object" && Array.isArray(ChannelPermsssionCache[key]) && ChannelPermsssionCache[key] === null){
            return;
          }

          for (const id in ChannelPermsssionCache[key]) {
            delete ChannelPermsssionCache[key][id];
          }
        }

        ChannelPermissionStore.initialize();

        const ChanneListCache = ChannelListStore.__getLocalVars();
        for (const guildId in ChanneListCache.state.guilds) {
          delete ChanneListCache.state.guilds[guildId];
        }

        ChannelListStore.initialize();

        this.forceUpdate(document.querySelector(`.${container}`));
      }

      forceUpdate(element) {
        if (!element) return;
        const toForceUpdate = ReactTools.getOwnerInstance(
          element
        );
        const original = toForceUpdate.render;
        if (original.name == "forceRerender") return;
        toForceUpdate.render = function forceRerender() {
          original.call(this);
          toForceUpdate.render = original;
          return null;
        };
        toForceUpdate.forceUpdate(() =>
          toForceUpdate.forceUpdate(() => {})
        );
      }

      onStop() {
        Patcher.unpatchAll();
        DOMTools.removeStyle(config.info.name);
        ContextMenu.unpatch("guild-context", this.processContextMenu);
        this.rerenderChannels();
      }

      getSettingsPanel() {
        return SettingPanel.build(
          this.saveSettings.bind(this),
          new SettingGroup("General Settings").append(
            new Switch(
              "Disable lock icons",
              "Disables the hidden channel icons (they will be seen as normal channels).",
              this.settings["disableIcons"],
              (i) => {
                this.settings["disableIcons"] = i;
                // this.rerenderChannels();
              }
            ),
            new Switch(
              "Stop marking hidden channels as read",
              "Stops the plugin from marking hidden channels as read.",
              this.settings["MarkUnread"],
              (i) => {
                this.settings["MarkUnread"] = i;
                // this.rerenderChannels();
              }
            ),
            new Switch(
              "Enable Debug Mode",
              "Enables debug mode, which will log more information to the console.",
              this.settings["debugMode"],
              (i) => {
                this.settings["debugMode"] = i;
              }
            ),
            new Switch(
              "Use eye icon",
              "Use eye icon instead of lock icon for hidden channels",
              this.settings["hiddenChannelIcon"] == "eye",
              (i) => {
                this.settings["hiddenChannelIcon"] = i ? "eye" : "lock";
              }
            ),
            new Switch(
              "(TODO) Sort hidden channels in an extra category at bottom.",
              "Sorting order for hidden channels.",
              this.settings["sort"] == "extra",
              (e) => {
                this.settings["sort"] = e ? "extra" : "native";
              }
            ),
          ),
          new SettingGroup("Choose what channels you want to display", {
            collapsible: true,
            shown: false,
          }).append(

            ...Object.values(ChannelTypes).map((type) => {
              return new Switch(
                `Show ${capitalizeFirst(type.split("_")[1])}${(type.split("_").length == 3) ? " " + capitalizeFirst(type.split("_")[2]) : ""} Channels`,
                null,
                this.settings["channels"][type],
                (i) => {
                  this.settings["channels"][type] = i;
                  this.rerenderChannels();
                }
              );
            })

          ),

          new SettingGroup(
            "Guilds Blacklist",
            {
              collapsible: true,
              shown: false,
            }
          ).append(
            ...Object.values(GuildStore.getGuilds()).map(
              (guild) =>
                new IconSwitch(
                  guild.name,
                  guild.description,
                  this.settings["blacklistedGuilds"][guild.id] ?? false,
                  (e) => {
                    this.settings["blacklistedGuilds"][guild.id] = e;
                  },
                  {
                    icon:
                      IconUtils.getGuildIconURL(guild) ??
                      DEFAULT_AVATARS[
                        randomNo(0, DEFAULT_AVATARS.length - 1)
                      ],
                  }
                )
            )
          )
        );
      }

      reloadNotification(coolText = "Reload Discord to apply changes and avoid bugs") {
        Modals.showConfirmationModal("Reload Discord?", coolText, {
            confirmText: "Reload",
            cancelText: "Later",
            onConfirm: () => {
                window.location.reload();
            },
        });
      }

      saveSettings() {
        Utilities.saveData(config.info.name, "settings", this.settings);
        this.rerenderChannels();
      }
    };

  })(window.ZeresPluginLibrary.buildPlugin(config));
})();
