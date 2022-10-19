/**
 * @name ShowHiddenChannels
 * @displayName Show Hidden Channels (SHC)
 * @version 0.0.3
 * @author JustOptimize (Oggetto)
 * @authorId 347419615007080453
 * @source https://github.com/JustOptimize/return-ShowHiddenChannels
 * @updateUrl https://raw.githubusercontent.com/JustOptimize/return-ShowHiddenChannels/main/ShowHiddenChannels.plugin.js
*/

module.exports = (() => {

  const config = {
    info: {
      "name": "ShowHiddenChannels",
      "authors": [{
        "name": "JustOptimize (Oggetto)",
      }],
      "description": "A plugin which displays all hidden Channels, which can't be accessed due to Role Restrictions, this won't allow you to read them (impossible).",
      "version": "0.0.3",
      "github": "https://github.com/JustOptimize/return-ShowHiddenChannels",
      "github_raw": "https://raw.githubusercontent.com/JustOptimize/return-ShowHiddenChannels/main/ShowHiddenChannels.plugin.js"
    },
    changelog: [
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
          const ZLib = await fetch(
            "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js"
          );
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
      Patcher,
      WebpackModules,
      PluginUpdater,
      Logger,
      // Utilities,
      DiscordModules: {
        MessageActions,
        // React,
        // Tooltip,
        // Clickable
      }
    } = Library;

    const ChannelStore = WebpackModules.getByProps("getChannel");
    const Channel = WebpackModules.getByPrototypes("isManaged");
    const DiscordConstants = WebpackModules.getModule((m) => m?.Plq?.ADMINISTRATOR == 8n);
    const ChannelPermissionStore = WebpackModules.getByProps("getChannelPermissions");
    const UnreadStore = WebpackModules.getByProps("isForumPostUnread");
    
    // const ChannelItem = WebpackModules.getByString("canHaveDot", "unreadRelevant", "UNREAD_HIGHLIGHT")
    // const ChannelClasses = WebpackModules.getByProps("wrapper", "mainContent");
    // const { iconItem, iconBase, actionIcon } = WebpackModules.getByProps("iconItem"); //iconItem-1EjiK0 iconBase-2G48Fc actionIcon-2sw4Sl

    // const registry = WebpackModules.getModules((m) => typeof m === "function" && m.toString().indexOf('"currentColor"') !== -1);
    //TODO: Icon not working
    // const Icon = (props) => {
    //   // const mdl = registry.find((m) => m.displayName === props.name);
    //   const Icon = "link?"; //! link
    //   const newProps = global._.cloneDeep(props);
    //   delete newProps.name;
      
    //   return React.createElement(Icon, newProps);
    // };

    // console.log(registry);
    // Icon.Names = registry.map((m) => m.name); //! displayName got removed so need to find unique identifier for the icon
    // console.log(Icon.Names)
    
    
    // //TODO, Coming soon
    // const Route = WebpackModules.getModule((m) => m?.default?.toString().includes("impression"));
    // const ChannelUtil = WebpackModules.getByProps("selectChannel", "selectPrivateChannel");
    // const VoiceUser = WebpackModules.getByPrototypes("renderPrioritySpeaker", "renderIcons", "renderAvatar")
    // const VoiceUsers = WebpackModules.getByString("hidePreview", "previewIsOpen", "previewUserIdAfterDelay");
    // const ChannelContextMenu = WebpackModules.getByProps("openContextMenu");
    
    return class ShowHiddenChannels extends Plugin {
      constructor() {
        super();
        this.can = ChannelPermissionStore.can.__originalFunction ?? ChannelPermissionStore.can;
        const _this = this;
        if (!Channel.prototype.isHidden)
          Channel.prototype.isHidden = function () {
            return (![1, 3].includes(this.type) && !_this.can(DiscordConstants.Plq.VIEW_CHANNEL, this)
            );
          };
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
        this.Patch();
      }

      Patch() {
        Patcher.after(UnreadStore, "hasAnyUnread", (_, args, res) => {
          return res && !ChannelStore.getChannel(args[0])?.isHidden();
        });

        Patcher.after(UnreadStore, "hasUnread", (_, args, res) => {
          return res && !ChannelStore.getChannel(args[0])?.isHidden();
        });

        Patcher.after(UnreadStore, "hasRelevantUnread", (_, args, res) => {
          return res && !args[0].isHidden();
        });

        Patcher.after(UnreadStore, "getUnreadCount", (_, args, res) => {
          return ChannelStore.getChannel(args[0])?.isHidden() ? 0 : res;
        });

        Patcher.after(UnreadStore, "hasNotableUnread", (_, args, res) => {
          return res && !ChannelStore.getChannel(args[0])?.isHidden();
        });

        Patcher.after(UnreadStore, "getMentionCount", (_, args, res) => {
          return ChannelStore.getChannel(args[0])?.isHidden() ? 0 : res;
        });

        Patcher.after(ChannelPermissionStore, "can", (_, args, res) => {
          if (args[0] == DiscordConstants.Plq.VIEW_CHANNEL) {
            return true;
          }

          if (args[1]?.isHidden?.() && args[0] == DiscordConstants.Plq.CONNECT)
            return false;

          return res;
        });

        
        //* Stop fetching messages if the channel is hidden
        //Route.default.displayName = "RouteWithImpression"; //! No displayName so i don't know what to replace
        if (!MessageActions._fetchMessages) {
          MessageActions._fetchMessages = MessageActions.fetchMessages;
          MessageActions.fetchMessages = (args) => {
            if (ChannelStore.getChannel(args.channelId)?.isHidden?.()){
              BdApi.showToast("Channel is hidden, not fetching messages", {type: "error"});
              return;
            }
            
            return MessageActions._fetchMessages(args);
          };
        }
        
        var channelChanging = false; // Thanks to vileelf for suggesting a fix for this
        Patcher.after(ChannelStore, "getChannel", (thisObject, methodArguments, returnValue) => {
          if (channelChanging == true) { return returnValue; }

          channelChanging = true;

          if (returnValue?.isHidden?.() == true 
              && returnValue?.name 
              && !returnValue.name.startsWith(" 🔒 ")) {
                returnValue.name = " 🔒 " + returnValue.name;
          }

          channelChanging = false;
        }); 

        //! Not working
        // console.log("ChannelItem", ChannelItem);
        // Patcher.after(ChannelItem, "default", (_, args, res) => {
        //   console.log(args[0].channel);
        //   const instance = args[0];
        //   if (instance.channel?.isHidden()) {
        //     const item = res.props?.children?.props;

        //     if (item?.className) item.className += ` shc-hidden-channel shc-hidden-channel-type-${instance.channel.type}`;

        //     const children = res.props?.children?.props?.children[1]?.props?.children[1];

        //     if (children.props?.children) { 
        //       children.props.children = [
              
        //         React.createElement(Tooltip, {
        //           text: "Hidden Channel",
        //         },

        //           React.createElement(Clickable,
        //             {
        //               className: [iconItem, "shc-lock-icon-clickable"].join(
        //                 " "
        //               ),
        //               style: {
        //                 display: "block",
        //               },
        //             },

        //             // React.createElement(Icon, {
        //             //   // Icon, {
        //             //   // name: "Eye", //! no name for stuff so i don't know
        //             //   // className: actionIcon,

        //             //   className: [iconBase, actionIcon].join(" "),
        //             //   style: {
        //             //     color: "red",
        //             //     width: "20px",
        //             //     height: "20px",
        //             //   },
        //             // })
        //             React.createElement('svg', Clickable, children, React.createElement('path', {
        //               style: {
        //                 width: "24",
        //                 height: "24",
        //                 class: "shc-lock-icon",
        //                 viewBox: "0 0 24 24",
        //                 // aria-hidden: "true",
        //                 role: "img",
        //               },
                      
        //               d: 'M6 6h1v6H6zm3 0h1v6H9z'
        //             }), React.createElement('path', {
        //               style: {
        //                 fill: "currentColor",
        //               },
        //               d: 'M17 11V7C17 4.243 14.756 2 12 2C9.242 2 7 4.243 7 7V11C5.897 11 5 11.896 5 13V20C5 21.103 5.897 22 7 22H17C18.103 22 19 21.103 19 20V13C19 11.896 18.103 11 17 11ZM12 18C11.172 18 10.5 17.328 10.5 16.5C10.5 15.672 11.172 15 12 15C12.828 15 13.5 15.672 13.5 16.5C13.5 17.328 12.828 18 12 18ZM15 11H9V7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7V11Z'
        //             }))
        //           )
        //         ),
        //       ];
        //     }

        //     if (instance.channel.type == DiscordConstants.ChannelTypes.GUILD_VOICE && !instance.connected) {
        //       const wrapper = Utilities.findInReactTree(res, (n) => n?.props?.className?.includes(ChannelClasses.wrapper));

        //       if (wrapper) {
        //         wrapper.props.onMouseDown = () => {};
        //         wrapper.props.onMouseUp = () => {};
        //       }
        //       const mainContent = Utilities.findInReactTree(res, (n) =>
        //         n?.props?.className?.includes(ChannelClasses.mainContent)
        //       );

        //       if (mainContent) {
        //         mainContent.props.onClick = () => {};
        //         mainContent.props.href = null;
        //       }
        //     }
        //   }
        //   return res;
        // });

        //! Not working, will be fixed in the future (maybe, idk if i should)
        // ChannelItem.default.displayName = "ChannelItem"; //! No displayName so i don't know what to replace
        // Patcher.before(ChannelUtil, "getChannelIconComponent", (_, args) => {
        //     if (args[0]?.isHidden?.() && args[2]?.locked)
        //       args[2].locked = false;
        //     return args;
        //   }
        // );

        //! Tried this, not working too
        // Patcher.after(ChannelContextMenu, "default", (_, args, res) => {
        //   console.log(args[0].channel);
        //   const instance = args[0];
        //   if (instance.channel?.isHidden?.()) {
        //     console.log("hidden");
        //   }
        // });
      }

      onStop() {
        Patcher.unpatchAll();
      }

    };

  })(global.ZeresPluginLibrary.buildPlugin(config));
})();
