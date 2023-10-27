/**
 * @name ShowHiddenChannels
 * @displayName Show Hidden Channels (SHC)
 * @version 0.3.5
 * @author JustOptimize (Oggetto)
 * @authorId 619203349954166804
 * @source https://github.com/JustOptimize/return-ShowHiddenChannels
 * @description A plugin which displays all hidden Channels and allows users to view information about them, this won't allow you to read them (impossible).
*/

const config = {
  info: {
    name: "ShowHiddenChannels",
    authors: [{
      name: "JustOptimize (Oggetto)",
    }],
    description: "A plugin which displays all hidden Channels and allows users to view information about them, this won't allow you to read them (impossible).",
    version: "0.3.5",
    github: "https://github.com/JustOptimize/return-ShowHiddenChannels",
    github_raw: "https://raw.githubusercontent.com/JustOptimize/return-ShowHiddenChannels/main/ShowHiddenChannels.plugin.js"
  },

  changelog: [
    {
      title: "v0.3.5",
      items: [
        "Fixed EVERYTHING, I hope (Thanks to @Tharki-God for helping me out with this one)",
        "Added user fetching to the channel info page"
      ]
    },
    {
      title: "v0.3.4",
      items: [
        "Fixed some issues after Discord update, AGAIN",
        "Functionality is limited, some features are disabled until I find a way to fix them"
      ]
    },
    {
      title: "v0.3.3",
      items: [
        "Fixed some issues after Discord update",
        "Added a way to automatically check if something is missing"
      ]
    }
  ],

  main: "ShowHiddenChannels.plugin.js",
};

class Dummy {
  constructor() {
    console.warn("ZeresPluginLibrary is required for this plugin to work. Please install it from https://betterdiscord.app/Download?id=9");
    this.downloadZLibPopup();
  }  

  start() {}
  stop() {}
  
  getDescription () {return `The library plugin needed for ${config.info.name} is missing. Please enable this plugin, click the settings icon on the right and click "Download Now" to install it.`}

  getSettingsPanel () {
    // Close Settings Panel and show modal to download ZLib
    const buttonClicker = document.createElement("oggetto");
    buttonClicker.addEventListener("DOMNodeInserted", () => {
      // Hide Settings Panel to prevent it from showing up before the modal
      buttonClicker.parentElement.parentElement.parentElement.style.display = "none";

      // Close Settings Panel
      const buttonToClick = document.querySelector(".bd-button > div");
      buttonToClick.click();

      // Show modal to download ZLib
      this.downloadZLibPopup();
    });

    return buttonClicker;
  }

  async downloadZLib() {
    window.BdApi.showToast("Downloading ZeresPluginLibrary...", { type: "info" });

    require("request").get("https://betterdiscord.app/gh-redirect?id=9", async (err, resp, body) => {
      if (err) return this.downloadZLibErrorPopup();

      // If the response is a redirect to the actual file
      if (resp.statusCode === 302) {
          require("request").get(resp.headers.location, async (error, response, content) => {
              if (error) return this.downloadZLibErrorPopup();
              await new Promise(r => require("fs").writeFile(require("path").join(window.BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), content, r));
          });
      
      // If the response is the actual file
      } else {
          await new Promise(r => require("fs").writeFile(require("path").join(window.BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
      }

      window.BdApi.showToast("Successfully downloaded ZeresPluginLibrary!", { type: "success" });
    });
  }

  downloadZLibPopup() {
    window.BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
      confirmText: "Download Now",
      cancelText: "Cancel",
      onConfirm: () => this.downloadZLib()
    });
  }
  
  downloadZLibErrorPopup() {
    window.BdApi.showConfirmationModal("Error Downloading", `ZeresPluginLibrary download failed. Manually install plugin library from the link below.`, {
        confirmText: "Visit Download Page",
        cancelText: "Cancel",
        onConfirm: () => require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9")
    });
  }
}

module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Library]) => {
  const plugin = (Plugin, Library) => {

    const {
      WebpackModules,
      Patcher,
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
        Dispatcher
      }
    } = Library;

    const GuildStore = WebpackModules.getByProps("getGuild","getGuildCount","getGuildIds","getGuilds","isLoaded");

    const Tooltip = window.BdApi.Components.Tooltip;
    const { ContextMenu } = window.BdApi;
    const Utils = window.BdApi.Utils;

    const DiscordConstants = WebpackModules.getByProps("Permissions", "ChannelTypes");
    const { chat } = WebpackModules.getByProps("chat", "chatContent");

    const Route = WebpackModules.getModule((m) =>
      m?.default?.toString().includes(".Route,{...")
    );
    
    const ChannelItem = WebpackModules.getByProps("ChannelItemIcon");
    const ChannelItemUtils = WebpackModules.getByProps("getChannelIconComponent","getChannelIconTooltipText","getSimpleChannelIconComponent");

    const { rolePill } = WebpackModules.getByProps("rolePill","rolePillBorder");
    const ChannelPermissionStore = WebpackModules.getByProps("getChannelPermissions");

    const PermissionStoreActionHandler = Utils.findInTree(Dispatcher, (c) => c?.name == "PermissionStore" && typeof c?.actionHandler?.CONNECTION_OPEN === "function")?.actionHandler;
    const ChannelListStoreActionHandler = Utils.findInTree(Dispatcher, (c) => c?.name == "ChannelListStore" && typeof c?.actionHandler?.CONNECTION_OPEN === "function")?.actionHandler;

    const { container } = WebpackModules.getByProps("container", "hubContainer");
    const { ChannelRecordBase: Channel } = WebpackModules.getByProps("ChannelRecordBase");

    const ChannelListStore = WebpackModules.getByProps("getGuildWithoutChangingCommunityRows");
    const { DEFAULT_AVATARS } = WebpackModules.getByProps("DEFAULT_AVATARS");
    const { iconItem, actionIcon } = WebpackModules.getByProps("iconItem");
    const UnreadStore = WebpackModules.getByProps("isForumPostUnread");
    const Voice = WebpackModules.getByProps("getVoiceStateStats");
    const { MemberRole: RolePill } = WebpackModules.getByProps("MemberRole");
    const UserMentions = WebpackModules.getByProps("handleUserContextMenu");
    const ChannelUtils = WebpackModules.getByProps("renderTopic", "HeaderGuildBreadcrumb", "ChannelEmoji", "renderTitle");
    
    const ProfileActions = WebpackModules.getByProps("fetchProfile", "getUser");
    const PermissionUtils = WebpackModules.getByProps("isRoleHigher","makeEveryoneOverwrite");

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
      .shc-hidden-notice {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: auto;
          text-align: center;
      }	 
      .shc-hidden-notice > div[class^="divider"] {
          display: none
      }	 
      .shc-hidden-notice > div[class^="topic"] {
          background-color: var(--background-secondary);
          padding: 5px;
          max-width: 50vh;
          text-overflow: ellipsis;
          border-radius: 5px;
          margin: 10px auto;
      }

      .shc-rolePill {
        margin-right: 0px !important;
        background-color: var(--background-primary);
      }
    `;

    const defaultSettings = {
      hiddenChannelIcon: "lock",
      sort: "native",
      showPerms: true,
      showAdmin: "channel",
      MarkUnread: false,

      alwaysCollapse: false,
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

    class IconSwitchWrapper extends React.Component {
      constructor(props) {
        super(props);
        this.state = { enabled: this.props.value };
      }
      render() {
        return React.createElement(
          "div",
          {},
          React.createElement(
            "div",
            { 
              style: {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "15px",
                marginTop: "15px"
              },
            },
            React.createElement(
              "img",
              {
                src: this.props.icon,
                width: 48,
                height: 48,
                title: "Click to toggle",
                style: {
                  borderRadius: "360px",
                  cursor: "pointer",
                  border: this.state.enabled ? "3px solid green" : "3px solid grey",
                  marginRight: "10px"
                },
                onClick: () => {
                  this.props.onChange(!this.state.enabled);
                  this.setState({ enabled: !this.state.enabled });
                }
              }
            ),
            React.createElement(
              "div",
              {
                style: {
                  maxWidth: "89%"
                }
              },
              React.createElement(
                "div",
                {
                  style: {
                    fontSize: "20px",
                    color: "var(--header-primary)",
                    fontWeight: "600",
                  },
                },
                this.props.children,
              ),
              React.createElement(
                "div",
                {
                  style: {
                    color: "var(--header-secondary)",
                    fontSize: "14px"
                  }
                },
                this.props.note
              )
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

    function checkVariables() {
      const toBeChecked = {
        DiscordConstants,
        ChannelItem,
        ChannelItemUtils,
        rolePill,
        ChannelPermissionStore,
        PermissionStoreActionHandler,
        ChannelListStoreActionHandler,
        container,
        ChannelListStore,
        ImageResolver,
        DEFAULT_AVATARS,
        iconItem,
        actionIcon,
        UnreadStore,
        Voice,
        RolePill,
        UserMentions,
        ChannelUtils,
        ProfileActions,
        PermissionUtils,
        UserStore
      };

      for (const variable in toBeChecked) {
        if (!toBeChecked[variable]) {
          Logger.error("Variable not found at position " + variable);
        }
      }

      if (Object.values(toBeChecked).includes(undefined)) {
        window.BdApi.showToast("Some variables are missing, check the console for more info.", { type: "error" });
      } else {
        Logger.info("All variables found.");
      }
    }
  
    checkVariables();
    
    // function searchForMissingStuff(m, property){
    //     // Replace this with the thing you need to check
    //     return ["locked", "hasActiveThreads"].every((s) => m?.[property].toString().includes(s))
    // }

    // BdApi.Webpack.getModule(m => {
    //     for (const property in m) {
    //       if (searchForMissingStuff(m, property)) {
    //         console.log(`Found it on ${property}`);
    //         return true;
    //       } 
    //     }
        
    //     return false;
    // });

    return class ShowHiddenChannels extends Plugin {
      constructor() {
        super();

        this.hiddenChannelCache = {};

        this.collapsed = Utilities.loadData(
          config.info.name,
          "collapsed",
          {}
        );

        this.processContextMenu = this.processContextMenu.bind(this);

        this.settings = Utilities.loadData(
          config.info.name,
          "settings",
          defaultSettings
        );

        this.can = ChannelPermissionStore.can.__originalFunction ?? ChannelPermissionStore.can;
      }

      async checkForUpdates() {
        if (this.settings.debugMode){
          Logger.info("Checking for updates, current version: " + config.info.version);
        }
        
        const SHC_U = await fetch(config.info.github_raw);
        if (!SHC_U.ok) return window.BdApi.showToast("(ShowHiddenChannels) Failed to check for updates.", { type: "error" });
        const SHCContent = await SHC_U.text();

        if (SHCContent.match(/(?<=version: ").*(?=")/)[0] <= config.info.version) return Logger.info("No updates found.");

        window.BdApi.showConfirmationModal("Update available", `ShowHiddenChannels has an update available. Would you like to update to version ${SHCContent.match(/(?<=version: ").*(?=")/)[0]}?`, {
          confirmText: "Update",
          cancelText: "Cancel",
          danger: false,

          onConfirm: () => {
            this.proceedWithUpdate(SHCContent);
          },

          onCancel: () => {
            window.BdApi.showToast("Update cancelled.", { type: "info" });
          }
        });
      }

      async proceedWithUpdate(SHCContent) {
        if (this.settings.debugMode){
          Logger.info("Update confirmed by the user, updating to version " + SHCContent.match(/(?<=version: ").*(?=")/)[0]);
        }

        try {
          const fs = require("fs");
          const path = require("path");

          await fs.writeFile(
            path.join(window.BdApi.Plugins.folder, "ShowHiddenChannels.plugin.js"),
            SHCContent,
            (err) => {
              if (err) return window.BdApi.showToast("(ShowHiddenChannels) Failed to update.", { type: "error" });
            }
          );

          window.BdApi.showToast("ShowHiddenChannels updated to version " + SHCContent.match(/(?<=version: ").*(?=")/)[0], { type: "success" });
        } catch (err) {
          return window.BdApi.showToast("(ShowHiddenChannels) Failed to update.", { type: "error" });
        }
      }

      onStart() {
        this.checkForUpdates();
        DOMTools.addStyle(config.info.name, CSS);
        this.Patch();
        this.rerenderChannels();
      }

      Patch() {
        Patcher.instead(Channel.prototype, "isHidden", (channel, args, res) => {
          return (![1, 3].includes(channel.type) && !this.can(DiscordConstants.Permissions.VIEW_CHANNEL, channel));
        });

        if(!this.settings.MarkUnread) {
          Patcher.after(UnreadStore, "getGuildChannelUnreadState", (_, args, res) => {
            return args[0]?.isHidden() ? { mentionCount: 0, hasNotableUnread: false } : res;
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
          const _permission = args[0];
          const _channel = args[1];

          if (!_channel?.isHidden?.()) return res;

          if (_permission == DiscordConstants.Permissions.VIEW_CHANNEL)
            return (!this.settings["blacklistedGuilds"][_channel.guild_id] && this.settings["channels"][DiscordConstants.ChannelTypes[_channel.type]]);
          if (_permission == DiscordConstants.Permissions.CONNECT)
            return false;

          return res;
        });

        Patcher.after(Route, "default", (_, args, res) => {
          const channelId = res.props?.computedMatch?.params?.channelId;
          const guildId = res.props?.computedMatch?.params?.guildId;
          const channel = ChannelStore?.getChannel(channelId);
          
          if (
            guildId &&
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
        Patcher.instead(MessageActions, "fetchMessages", (instance, [args], res) => {
          if (ChannelStore.getChannel(args.channelId)?.isHidden?.())
            return;
          return res.call(instance, args);
        });
        
        if (this.settings["hiddenChannelIcon"]) {
          Patcher.after(ChannelItem, "default", (_, args, res) => {
            const instance = args[0];

            if (instance.channel?.isHidden()) {
              const item = res.props?.children?.props;
              if (item?.className)
                item.className += ` shc-hidden-channel shc-hidden-channel-type-${instance.channel.type}`;

              const children = Utilities.findInReactTree(res, (m) =>
                m?.props?.onClick?.toString().includes("stopPropagation") && m.type === "div"
              );
              
              if (children.props?.children) {
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
                          ),
                        //* Here you can add your own icons
                        // this.settings["hiddenChannelIcon"] == "" &&
                        //   React.createElement(
                        //     "svg",
                        //     {
                        //       class: actionIcon,
                        //       viewBox: "0 0 24 24",
                        //     },
                        //     React.createElement("path", {
                        //       fill: "currentColor",
                        //       d: "",
                        //     })
                        //   ),
                      )
                  )
                ];
              }

              if (
                instance.channel.type == DiscordConstants.ChannelTypes.GUILD_VOICE &&
                !instance.connected
              ) {
                const wrapper = Utilities.findInReactTree(res, (n) =>
                  n?.props?.className?.includes("shc-hidden-channel-type-2")
                );
                
                if (wrapper) {
                  wrapper.props.onMouseDown = () => {};
                  wrapper.props.onMouseUp = () => {};
                }

                const mainContent = wrapper?.props?.children[1]?.props?.children;

                if (mainContent) {
                  mainContent.props.onClick = () => {
                    Logger.log("clicked");

                    if (instance.channel?.isGuildVocal()) {
                      NavigationUtils.transitionTo(
                        `/channels/${instance.channel.guild_id}/${instance.channel.id}`
                      );
                    }
                  };

                  mainContent.props.href = null;
                }
              }
            }
            return res;
          });
        }

        //* Remove lock icon from hidden voice channels
        Patcher.before(ChannelItemUtils, "getChannelIconComponent", (_, args) => {
          if (!args[2]) return;
          
          if (args[0]?.isHidden?.() && args[2].locked){
            args[2].locked = false;
          }
        });

        //* Manually collapse hidden channel category
        Patcher.after(ChannelStore, "getChannel", (_, args, res) => {
          if (
            this.settings["sort"] !== "extra" ||
            this.settings["blacklistedGuilds"][args[0]?.replace("_hidden", "")] ||
            !args[0]?.endsWith("_hidden")
          ){
            return res;
          }

          const HiddenCategoryChannel = new Channel({
            guild_id: args[0]?.replace("_hidden", ""),
            id: args[0],
            name: "Hidden Channels",
            type: DiscordConstants.ChannelTypes.GUILD_CATEGORY,
          });

          return HiddenCategoryChannel;
        });

        Patcher.after(GuildChannelsStore, "getChannels", (_, args, res) => {         
          const GuildCategories = res[DiscordConstants.ChannelTypes.GUILD_CATEGORY]; 
          const hiddenId = `${args[0]}_hidden`; 
          const hiddenCategory = GuildCategories?.find(m => m.channel.id == hiddenId);
          if (!hiddenCategory) return res;   
          const noHiddenCats = GuildCategories.filter(m => m.channel.id !== hiddenId);    
          const newComprator = (
            noHiddenCats[noHiddenCats.length - 1] || {
              comparator: 0,
            }
          ).comparator + 1;
          Object.defineProperty(hiddenCategory.channel, 'position', {
            value:  newComprator ,
            writable: true
          });
          Object.defineProperty(hiddenCategory, 'comparator', {
            value:  newComprator ,
            writable: true
          });
          return res;         
        })
        Patcher.after(ChannelStore, "getMutableGuildChannelsForGuild", (_, args, res) => {                
          if (this.settings["sort"] !== "extra" || this.settings["blacklistedGuilds"][args[0]]) return;
          const hiddenId = `${args[0]}_hidden`;               
          const HiddenCategoryChannel = new Channel({
            guild_id: args[0],
            id: hiddenId,
            name: "Hidden Channels",
            type: DiscordConstants.ChannelTypes.GUILD_CATEGORY,                  
          });       
          const GuildCategories = GuildChannelsStore.getChannels(
            args[0]
          )[DiscordConstants.ChannelTypes.GUILD_CATEGORY];  
          Object.defineProperty(HiddenCategoryChannel, 'position', {
            value:  (
              GuildCategories[GuildCategories.length - 1] || {
                comparator: 0,
              }
            ).comparator + 1 ,
            writable: true
          });  
          if (!res[hiddenId])
          res[hiddenId] = HiddenCategoryChannel;
          return res;
        });

        //* Custom category or sorting order
        Patcher.after(ChannelListStore, "getGuild", (_, args, res) => {
          // if (this.settings.debugMode)
          //   Logger.info("ChannelList", res)
        
          if (this.settings["blacklistedGuilds"][args[0]]) return;

          switch (this.settings["sort"]) {

            case "bottom": {
              this.sortChannels(res.guildChannels.favoritesCategory);
              this.sortChannels(res.guildChannels.recentsCategory);
              this.sortChannels(res.guildChannels.noParentCategory);

              for (const id in res.guildChannels.categories) {
                this.sortChannels(res.guildChannels.categories[id]);
              }

              break;
            }

            case "extra": {
              const hiddenId = `${args[0]}_hidden`;
              const HiddenCategory = res.guildChannels.categories[hiddenId]; 
              const hiddenChannels = this.getHiddenChannelRecord(
                [
                  res.guildChannels.favoritesCategory,
                  res.guildChannels.recentsCategory,
                  res.guildChannels.noParentCategory,
                  ...Object.values(res.guildChannels.categories).filter(
                    (m) => m.id !== hiddenId
                  ),
                ],
                args[0]
              );

              HiddenCategory.channels = Object.fromEntries(Object.entries(hiddenChannels.records).map(([id, channel]) => {
                channel.category = HiddenCategory;
                return [id, channel]
              }))
            
              HiddenCategory.isCollapsed = this.settings["alwaysCollapse"] && this.collapsed[hiddenId] !== false;
              HiddenCategory.shownChannelIds = this.collapsed[hiddenId] || res.guildChannels.collapsedCategoryIds[hiddenId] || HiddenCategory.isCollapsed ? [] : hiddenChannels.channels
                .sort((x, y) => {

                  const xPos = x.position + (x.isGuildVocal() ? 1e4 : 1e5);
                  const yPos = y.position + (y.isGuildVocal() ? 1e4 : 1e5);

                  return xPos < yPos ? -1 : xPos > yPos ? 1 : 0;
                }).map((m) => m.id);
              break;
            }

          }

          if (this.settings["shouldShowEmptyCategory"]) {
            this.patchEmptyCategoryFunction([...Object.values(res.guildChannels.categories).filter(
                (m) => !m.id.includes("hidden")
              ),
            ]);
          }

          return res;
        });

        //* add entry in guild context menu
        ContextMenu.patch("guild-context", this.processContextMenu);
      }

      lockscreen() {
        return React.memo((props) => {
          //TODO: WTF GUILD IS UNDEFINED
          if (this.settings.debugMode) {
            Logger.info(props);
          }

          const [userMentionComponents, setUserMentionComponents] = React.useState([]);
          
          const fetchMemberAndMap = async () => {
            if(!this.settings["showPerms"]) return setUserMentionComponents(["None"]);

            const allUserOverwrites = Object.values(props.channel.permissionOverwrites).filter(
              (user) => Boolean(user && user?.type === 1),
            );

            for (const user of allUserOverwrites) {
              await ProfileActions.fetchProfile(user.id, {
                guildId: props.guild.id,
                withMutualGuilds: false,
              });
            }

            const filteredUserOverwrites = Object.values(props.channel.permissionOverwrites).filter(
              (user) => Boolean(
                PermissionUtils.can({
                  permission: DiscordConstants.Permissions.VIEW_CHANNEL,
                  user: UserStore.getUser(user.id),
                  context: props.channel,
                }) && GuildMemberStore.isMember(props.guild.id, user.id),
              ),
            );

            if (!filteredUserOverwrites?.length) return setUserMentionComponents(["None"]);
            const mentionArray = filteredUserOverwrites.map((m) => UserMentions.react(
                  {
                    userId: m.id,
                    channelId: props.channel.id,
                  },
                  () => null,
                  {
                    noStyleAndInteraction: false,
                  },
            ));

            return setUserMentionComponents(mentionArray);
          };

          React.useEffect(() => {
            fetchMemberAndMap();
          }, [props.channel.id, props.guild.id, this.settings["showPerms"]]);

          return React.createElement(
            "div",
            {
              className: ["shc-hidden-chat-content", chat].filter(Boolean).join(" "),
            },
            React.createElement(
              "div",
              {
                className: "shc-hidden-notice",
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
                // forum = 15, text = 0, voice = 2, announcement = 5, stage = 13
                "This is a hidden " + (props.channel.type == 15 ? "forum" : props.channel.type == 0 ? "text" : props.channel.type == 2 ? "voice" : props.channel.type == 5 ? "announcement" : props.channel.type == 13 ? "stage" : "") + " channel."
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
              props.channel.topic && props.channel.type != 15 && ChannelUtils?.renderTopic(props.channel, props.guild),

              //* Icon Emoji
              props.channel?.iconEmoji &&
                React.createElement(
                  TextElement,
                  {
                    color: TextElement.Colors.INTERACTIVE_NORMAL,
                    size: TextElement.Sizes.SIZE_14,
                    style: {
                      marginTop: 10,
                    },
                  },
                  "Icon emoji: ",
                  props.channel.iconEmoji.name ?? props.channel.iconEmoji.id
                ),



              //* Slowmode
              props.channel.rateLimitPerUser > 0 &&
              React.createElement(
                TextElement,
                {
                  color: TextElement.Colors.INTERACTIVE_NORMAL,
                  size: TextElement.Sizes.SIZE_14,
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
                  },
                  "Age-Restricted Channel (NSFW) 🔞"
                ),

              //* Bitrate
              props.channel.bitrate && props.channel.type == 2 &&
                React.createElement(
                  TextElement,
                  {
                    color: TextElement.Colors.INTERACTIVE_NORMAL,
                    size: TextElement.Sizes.SIZE_14,
                  },
                  "Bitrate: ",
                  props.channel.bitrate / 1000,
                  "kbps"
                ),

              //* Creation date
              React.createElement(
                TextElement,
                {
                  color: TextElement.Colors.INTERACTIVE_NORMAL,
                  size: TextElement.Sizes.SIZE_14,
                  style: {
                    marginTop: 10,
                  },
                },
                "Created on: ",
                this.getDateFromSnowflake(props.channel.id)
              ),
              
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
              this.settings["showPerms"] &&
              props.channel.permissionOverwrites &&
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

                  //* Users
                  React.createElement(
                    TextElement,
                    {
                      color: TextElement.Colors.INTERACTIVE_NORMAL,
                      size: TextElement.Sizes.SIZE_14,
                    },
                    "Users that can see this channel: ",
                    React.createElement(
                      "div",
                      {
                        style: {
                          marginTop: 5,
                          marginBottom: 5,
                          display: "flex",
                          flexDirection: "column",
                          flexWrap: "wrap",
                          gap: 4,
                          padding: 4,
                          paddingTop: 0,
                        },
                      },
                      ...userMentionComponents
                    )
                  ),

                  //* Channel Roles
                  React.createElement(
                    TextElement,
                    {
                      color: TextElement.Colors.INTERACTIVE_NORMAL,
                      style: {
                        borderTop: "1px solid var(--background-tertiary)",
                        padding: 5,
                      },
                    },
                    "Channel-specific roles: ",
                    React.createElement(
                      "div",
                      {
                        style: {
                          paddingTop: 5,
                        },
                      },
                      ...(() => {
                        const channelRoles = Object.values(props.channel.permissionOverwrites).filter(role => 
                          (role !== undefined && role?.type == 0) && 

                          //* 1024n = VIEW_CHANNEL permission
                          //* 8n = ADMINISTRATOR permission
                          ( 
                            //* If role is ADMINISTRATOR it can view channel even if overwrites deny VIEW_CHANNEL
                            (this.settings["showAdmin"] && ((props.guild.roles[role.id].permissions & BigInt(8)) == BigInt(8))) ||

                            //* If overwrites allow VIEW_CHANNEL (it will override the default role permissions)
                            ((role.allow & BigInt(1024)) == BigInt(1024)) ||

                            //* If role can view channel by default and overwrites don't deny VIEW_CHANNEL
                            ((props.guild.roles[role.id].permissions & BigInt(1024)) && ((role.deny & BigInt(1024)) == 0))
                          )
                        );

                        if (!channelRoles?.length) return ["None"];                      
                        return channelRoles.map(m => RolePill.render({
                          canRemove: false,
                          className: `${rolePill} shc-rolePill`,
                          disableBorderColor: true,
                          guildId: props.guild.id,
                          onRemove: DiscordConstants.NOOP,
                          role: props.guild.roles[m.id]
                        }, DiscordConstants.NOOP));
                      })(),
                    ),
                  ),

                  this.settings["showAdmin"] && this.settings["showAdmin"] != "channel" && React.createElement(
                    TextElement,
                    {
                      color: TextElement.Colors.INTERACTIVE_NORMAL,
                      style: {
                        borderTop: "1px solid var(--background-tertiary)",
                        padding: 5,
                      },
                    },
                    "Admin roles: ",
                    React.createElement(
                      "div",
                      {
                        style: {
                          paddingTop: 5,
                        },
                      },
                      ...(() => {
                          const guildRoles = [];

                          if (this.settings["showAdmin"]){
                            Object.values(props.guild.roles).forEach(role => {
                              if(
                                  (role.permissions & BigInt(8)) == BigInt(8) &&
                                  (this.settings["showAdmin"] == "include" || (this.settings["showAdmin"] == "exclude" && !role.tags?.bot_id))
                                )
                                {
                                  guildRoles.push(role);
                                }
                            });
                          }

                          if (!guildRoles?.length) return ["None"];                      
                          return guildRoles.map(m => RolePill.render({
                            canRemove: false,
                            className: `${rolePill} shc-rolePill`,
                            disableBorderColor: true,
                            guildId: props.guild.id,
                            onRemove: DiscordConstants.NOOP,
                            role: m
                          }, DiscordConstants.NOOP));
                        }
                      )(),
                    )
                  ),
                ),

              //* Forums
              props.channel.type == 15 && (props.channel.availableTags || props.channel.topic) &&
                React.createElement(
                  TextElement,
                  {
                    color: TextElement.Colors.HEADER_SECONDARY,
                    size: TextElement.Sizes.SIZE_16,
                    style: {
                      marginTop: 20,
                      backgroundColor: "var(--background-secondary)",
                      padding: 10,
                      borderRadius: 5,
                      color: "var(--text-normal)",


                      fontWeight: "bold",
                    },
                  },
                  "Forum",

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
                      props.channel.availableTags.map((tag) => tag.name).join(", "),
                    ),
                  props.channel.availableTags.length == 0 &&
                    React.createElement(
                      TextElement,
                      { 
                        style: {
                          marginTop: 5,
                        },
                      },
                      "Tags: No tags avaiable"
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
                    ),
                  !props.channel.topic &&
                  React.createElement(
                    TextElement,
                    {
                      color: TextElement.Colors.INTERACTIVE_NORMAL,
                      size: TextElement.Sizes.SIZE_14,
                      style: {
                        marginTop: 10,
                      },
                    },
                    "Guidelines: No guidelines avaiable",
                ),
              )
            )
          )
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
            label: "Disable SHC",
            checked: this.settings["blacklistedGuilds"][guild.id],
            action: () => {
              this.settings["blacklistedGuilds"][guild.id] = !this.settings["blacklistedGuilds"][guild.id];
              this.saveSettings();
            },
          })
        );
      }

      patchEmptyCategoryFunction(categories) {
        for (const category of categories) {
          if (!category.shouldShowEmptyCategory.__originalFunction) {
            Patcher.instead(category, "shouldShowEmptyCategory", (_, args, res) => true);
          }
        }
      }

      sortChannels(category) {
        if (!category) return;
        const channelArray = Object.values(category.channels);
        category.shownChannelIds = channelArray
          .sort((x, y) => {
            const xPos =
              x.record.position +
              (x.record.isGuildVocal() ? 1e4 : 0) +
              (x.record.isHidden() ? 1e5 : 0);
            const yPos =
              y.record.position +
              (y.record.isGuildVocal() ? 1e4 : 0) +
              (y.record.isHidden() ? 1e5 : 0);
            return xPos < yPos ? -1 : xPos > yPos ? 1 : 0;
          })
          .map((n) => n.id);
      }

      getHiddenChannelRecord(categories, guildId) {
        const hiddenChannels = this.getHiddenChannels(guildId); // {channels: Array(n), amount: n}
        if(!hiddenChannels) return;

        if (!this.hiddenChannelCache[guildId]) {
          this.hiddenChannelCache[guildId] = [];
        }

        for (const category of categories) {
          // Get the channels that are hidden
          const newHiddenChannels = Object.entries(category.channels).filter(([channelId]) =>
            hiddenChannels.channels.some((m) => m.id === channelId)
          );

          // Add the channels to the cache and remove them from the original category
          for (const [channelId, channel] of newHiddenChannels) {
            const isCached = this.hiddenChannelCache[guildId].some(
              ([cachedChannelId]) => cachedChannelId === channelId
            );
            if (!isCached){
              this.hiddenChannelCache[guildId].push([channelId, channel]);
            }

            // Remove the channel from original category
            delete category.channels[channelId];
          }
        }

        return { 
          records: Object.fromEntries(this.hiddenChannelCache[guildId]), 
          channels: hiddenChannels ? hiddenChannels.channels : [], 
          amount: hiddenChannels ? hiddenChannels.amount : 0
        };
      }

      getHiddenChannels(guildId) {
        if (!guildId) return { channels: [], amount: 0 };

        const guildChannels = ChannelStore.getMutableGuildChannelsForGuild(guildId);
        const hiddenChannels = Object.values(guildChannels).filter((m) => m.isHidden() && m.type != DiscordConstants.ChannelTypes.GUILD_CATEGORY)
        
        return { channels: hiddenChannels, amount: hiddenChannels.length };
      }

      rerenderChannels() {
        PermissionStoreActionHandler?.CONNECTION_OPEN();
        ChannelListStoreActionHandler?.CONNECTION_OPEN();
        
        this.forceUpdate(document.querySelector(`.${container}`));
      }

      forceUpdate(element) {
        if (!element) return;
        
        const toForceUpdate = ReactTools.getOwnerInstance(element);
        const forceRerender = Patcher.instead(toForceUpdate, "render", () => {
            forceRerender();
            return null;
        });

        toForceUpdate.forceUpdate(() => toForceUpdate.forceUpdate(() => { }));
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
            new RadioGroup(
              "Hidden Channel Icon",
              "What icon to show as indicator for hidden channels.",
              this.settings["hiddenChannelIcon"],
              [
                {
                  name: "Lock Icon",
                  value: "lock",
                },
                {
                  name: "Eye Icon",
                  value: "eye",
                },
                {
                  name: "None",
                  value: false,
                },
              ],
              (i) => {
                this.settings["hiddenChannelIcon"] = i;
              }
            ),
            new RadioGroup(
              "Sorting Order",
              "Where to display Hidden Channels.",
              this.settings["sort"],
              [
                {
                  name: "Hidden Channels in the native Discord order (default)",
                  value: "native",
                },
                {
                  name: "Hidden Channels at the bottom of the Category",
                  value: "bottom",
                },
                {
                  name: "Hidden Channels in a separate Category at the bottom",
                  value: "extra",
                },
              ],
              (i) => {
                this.settings["sort"] = i;
              }
            ),
            new Switch(
              "Show Permissions",
              "Show what roles/users can access the hidden channel.",
              this.settings["showPerms"],
              (i) => {
                this.settings["showPerms"] = i;
              }
            ),
            new RadioGroup(
              "Show Admin Roles",
              "Show roles that have ADMINISTRATOR permission in the hidden channel page (requires 'Shows Permission' enabled).",
              this.settings["showAdmin"],
              [
                {
                  name: "Show only channel specific roles",
                  value: "channel",
                },
                {
                  name: "Include Bot Roles",
                  value: "include",
                },
                {
                  name: "Exclude Bot Roles",
                  value: "exclude"
                },
                {
                  name: "Don't Show Administrator Roles",
                  value: false,
                },
              ],
              (i) => {
                this.settings["showAdmin"] = i;
              }
            ),
            new Switch(
              "Stop marking hidden channels as read",
              "Stops the plugin from marking hidden channels as read.",

              this.settings["MarkUnread"],
              (i) => {
                this.settings["MarkUnread"] = i;
              }
            ),
            new Switch(
              "Collapse Hidden Category",
              "Collapse hidden category by default (requires sorting order as extra category).",
              this.settings["alwaysCollapse"],
              (i) => {
                this.settings["alwaysCollapse"] = i;
              }
            ),
            new Switch(
              "Show Empty Category",
              "Show category even if it's empty",
              this.settings["shouldShowEmptyCategory"],
              (i) => {
                this.settings["shouldShowEmptyCategory"] = i;
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

            ...Object.values(ChannelTypes).map((type) => {
              let formattedType = type.split("_"); // GUILD_STAGE_VOICE => [GUILD, STAGE, VOICE]
              formattedType.shift(); // Remove the first element (GUILD)
              formattedType = formattedType.map((word) => capitalizeFirst(word)).join(" "); // [STAGE, VOICE] => Stage Voice

              return new Switch(
                `Show ${formattedType} Channels`,
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
                      ImageResolver.getGuildIconURL(guild) ??
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
  };
  return plugin(Plugin, Library);
})(global.ZeresPluginLibrary.buildPlugin(config));