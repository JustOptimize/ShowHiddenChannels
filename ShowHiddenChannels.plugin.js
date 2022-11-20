/**
 * @name ShowHiddenChannels
 * @displayName Show Hidden Channels (SHC)
 * @version 0.1.0
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
      version: "0.1.0",
      github: "https://github.com/JustOptimize/return-ShowHiddenChannels",
      github_raw: "https://raw.githubusercontent.com/JustOptimize/return-ShowHiddenChannels/main/ShowHiddenChannels.plugin.js"
    },

    changelog: [
      {
        title: "v0.1.0",
        items: [
          "Added a new option to hide the hidden channels from the channel list",
          "Brought back channel locked page",
          "Bug fixes."
        ]
      },
      {
        title: "v0.0.8",
        items: [
          "Removed old and buggy lock icons and updated some code.",
        ]
      },
      {
        title: "v0.0.7",
        items: [
          "Fixed notification issue.",
        ]
      },
      {
        title: "v0.0.6",
        items: [
          "Added back the old lock icon and modified settings to be more user friendly.",
        ]
      },
      {
        title: "v0.0.5",
        items: [
          "Added more settings for the lock icon.",
        ]
      },
      {
        title: "v0.0.4",
        items: [
          "Added some settings to the plugin.",
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
      Settings: { SettingField, SettingPanel, SettingGroup, Switch },
      DiscordModules: {
        SwitchRow,
        ChannelStore,
        MessageActions,
        TextElement,
        React,
        ReactDOM,
        Tooltip,
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
    const { container } = WebpackModules.getByProps( "container", "hubContainer");
    const Channel = WebpackModules.getByPrototypes("isManaged");
    const IconUtils = WebpackModules.getByProps("getUserAvatarURL");
    const { DEFAULT_AVATARS } = WebpackModules.getByProps("DEFAULT_AVATARS");
    const { iconItem, actionIcon } = WebpackModules.getByProps("iconItem");
    const UnreadStore = WebpackModules.getByProps("isForumPostUnread");
    const Voice = WebpackModules.getByProps("getVoiceStateStats");
    const GuildStore = WebpackModules.getByProps("getGuild", "getGuilds");
    const CategoryStore = WebpackModules.getByProps("isCollapsed", "getCollapsed");
    const ListItem = WebpackModules.getByString("mergeLocation");
    const CategoryUtil = WebpackModules.getByString("CATEGORY_COLLAPSE");

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
    ];

    const renderLevels = {
      CAN_NOT_SHOW: 1,
      DO_NOT_SHOW: 2,
      WOULD_SHOW_IF_UNCOLLAPSED: 3,
      SHOW: 4,
    };
    
    const capitalizeFirst = (string) => `${string.charAt(0).toUpperCase()}${string.substring(1)}`;
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

      channels: {
        GUILD_TEXT: true,
        GUILD_VOICE: true,
        GUILD_ANNOUNCEMENT: true,
        GUILD_STORE: true,
        GUILD_STAGE_VOICE: true,
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
              const children =
                res.props?.children?.props?.children[1]?.props?.children[1];
              if (children.props?.children)
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
                        )
                      )
                  ),
                ];

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
        return React.memo((props) => {
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
                props.channel.topic && "However, you may see its topic."
              ),
              props.channel.topic && props.guild && ChannelUtils?.ChannelTopic(props.channel, props.guild),
              props.channel.lastMessageId &&
                React.createElement(
                  TextElement,
                  {
                    color: TextElement.Colors.INTERACTIVE_NORMAL,
                    size: TextElement.Sizes.SIZE_14,
                  },
                  "Last message sent: ",
                  this.getDateFromSnowflake(props.channel.lastMessageId)
                )
            )
          );
        });
      }
      getDateFromSnowflake(number) {
        try {
          const id = parseInt(number);
          const binary = id.toString(2).padStart(64, "0");
          const excerpt = binary.substring(0, 42);
          const decimal = parseInt(excerpt, 2);
          const unix = decimal + 1420070400000;
          return new Date(unix).toLocaleString();
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
      rerenderChannels() {
        let onceDone;
        this.cache = {};
        const element = document.querySelector(`.${container}`);
        if (!element) return;
        const ChannelsIns = ReactTools.getOwnerInstance(element);
        const ChannelsPrototype =
          ChannelsIns._reactInternals.type.prototype;
        if (ChannelsIns && ChannelsPrototype) {
          Patcher.after(ChannelsPrototype, "render", (_, args, res) => {
            if (onceDone) return;
            res.props.children =
              typeof res.props.children == "function"
                ? (_) => {
                    return null;
                  }
                : [];
            this.forceUpdate(ChannelsIns);
            onceDone = true;
          });
          this.forceUpdate(ChannelsIns);
        }
      }
      forceUpdate(...instances) {
        for (let ins of instances.flat(10).filter((n) => n))
          if (
            ins.updater &&
            typeof ins.updater.isMounted == "function" &&
            ins.updater.isMounted(ins)
          )
            ins.forceUpdate();
      }

      onStop() {
        Patcher.unpatchAll();
        DOMTools.removeStyle(config.info.name);
        ContextMenu.unpatch("guild-context", this.processContextMenu);
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
                this.rerenderChannels();
              }
            ),
            new Switch(
              "Stop marking hidden channels as read",
              "Stops the plugin from marking hidden channels as read.",
              this.settings["MarkUnread"],
              (i) => {
                this.settings["MarkUnread"] = i;
                this.rerenderChannels();
              }
            ),
            new Switch(
              "Enable Debug Mode",
              "Enables debug mode, which will log more information to the console.",
              this.settings["debugMode"],
              (i) => {
                this.settings["debugMode"] = i;
              }
            )
          ),
          new SettingGroup("Choose what channels you want to display", {
            collapsible: true,
            shown: false,
          }).append(
            ...ChannelTypes.map((type) =>
              new Switch(
                `${capitalizeFirst(type.split("_")[1].toLowerCase())} Channels`,
                this.settings["channels"][type],
                (e) => { this.settings["channels"][type] = e }
              )
            )
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