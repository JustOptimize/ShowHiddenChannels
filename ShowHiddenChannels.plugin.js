/**
 * @name ShowHiddenChannels
 * @displayName Show Hidden Channels (SHC)
 * @version 0.0.8
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
      version: "0.0.8",
      github: "https://github.com/JustOptimize/return-ShowHiddenChannels",
      github_raw: "https://raw.githubusercontent.com/JustOptimize/return-ShowHiddenChannels/main/ShowHiddenChannels.plugin.js"
    },

    changelog: [
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

    defaultConfig: [
      {
        type: "switch",
        id: "disableIcons",
        name: "Disable lock icons",
        note: "This setting disables the hidden channel icons (they will be seen as normal channels).",
        value: false
      },
      {
        type: "switch",
        id: "MarkUnread",
        name: "Stop marking hidden channels as read",
        note: "This setting stops the plugin from marking hidden channels as read.",
        value: false
      },
      {
        type: "switch",
        id: "debugMode",
        name: "Enable Debug Mode",
        note: "Enables some functions that are used for the development of the plugin.",
        value: false
      },
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
      Patcher,
      WebpackModules,
      PluginUpdater,
      Logger,
      Modals,
      DOMTools,
      DiscordModules: {
        MessageActions,
      }
    } = Library;

    // because its MIME type ('text/plain') is not a supported stylesheet MIME type
    // const CSS = `@import url("https://pastebin.com/raw/ggPs4QUh");`;

    const ChannelStore = WebpackModules.getByProps("getChannel");
    const Channel = WebpackModules.getByPrototypes("isManaged");
    const DiscordConstants = WebpackModules.getModule((m) => m?.Plq?.ADMINISTRATOR == 8n);
    const ChannelPermissionStore = WebpackModules.getByProps("getChannelPermissions");
    const UnreadStore = WebpackModules.getByProps("isForumPostUnread");
    const ChannelItem = WebpackModules.getByString("canHaveDot", "unreadRelevant", "UNREAD_HIGHLIGHT");

    return class ShowHiddenChannels extends Plugin {
      constructor() {
        super();
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
        // DOMTools.addStyle(config.info.name, CSS);
        this.Patch();
      }

      Patch() {
        if(this.settings.debugMode) {
          console.log("UnreadStore", UnreadStore);
          // console.log("ChannelStore", ChannelStore);
          // console.log("Channel", Channel);
          // console.log("WebpackModules", WebpackModules.getAllModules());
          // console.log(mod);
          console.log("ChannelItem", ChannelItem);
          // const mod = WebpackModules.
          // console.log("thing", mod);
        }

        Patcher.instead(Channel.prototype, "isHidden", (_, args, res) => {
          return (![1, 3].includes(_.type) && !this.can(DiscordConstants.Plq.VIEW_CHANNEL, _));
        });

        //* List of UnreadStore functions:
        // - getGuildChannelUnreadState
        // - getMentionCount
        // - getUnreadCount
        // - hasNotableUnread
        // - hasRelevantUnread
        // - hasTrackedUnread
        // - hasUnread
        // - hasUnreadPins

        if(!this.settings.MarkUnread) {
          Patcher.after(UnreadStore, "getGuildChannelUnreadState", (_, args, res) =>{
            return args[0]?.isHidden() ? {mentionCount: 0, hasNotableUnread: false} : res ;
          });

          Patcher.after(UnreadStore, "getMentionCount", (_, args, res) => {
            return ChannelStore.getChannel(args[0])?.isHidden() ? 0 : res;
          });

          Patcher.after(UnreadStore, "getUnreadCount", (_, args, res) => {
            // console.log("getUnreadCount", args, res);
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
          if (args[0] == DiscordConstants.Plq.VIEW_CHANNEL) {
            return true;
          }

          if (args[1]?.isHidden?.() && args[0] == DiscordConstants.Plq.CONNECT){
            return false;
          }

          return res;
        });

        
        //* Stop fetching messages if the channel is hidden
        Patcher.instead(MessageActions, "fetchMessages", (_, [args], res) => {
          if (ChannelStore.getChannel(args.channelId)?.isHidden?.()){
            BdApi.showToast("Channel is hidden, not fetching messages", {type: "error"});
            return;
          }

          return res(args);
        });
        

        if (!this.settings.disableIcons) {
          const channelInfoSelector = WebpackModules.getByProps("iconVisibility", "channelInfo");
          const channelNameSelector = WebpackModules.getByProps("channelName", "iconContainer");
          const iconHTML = `
          <div aria-label="Hidden Channel" role="img" class="${channelNameSelector.iconItem}">
            <svg width="24" height="24" class="${channelInfoSelector.actionIcon}" viewBox="0 0 24 24" aria-hidden="true" role="img">
              <path fill="currentColor" d="M17 11V7C17 4.243 14.756 2 12 2C9.242 2 7 4.243 7 7V11C5.897 11 5 11.896 5 13V20C5 21.103 5.897 22 7 22H17C18.103 22 19 21.103 19 20V13C19 11.896 18.103 11 17 11ZM12 18C11.172 18 10.5 17.328 10.5 16.5C10.5 15.672 11.172 15 12 15C12.828 15 13.5 15.672 13.5 16.5C13.5 17.328 12.828 18 12 18ZM15 11H9V7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7V11Z">
              </path>
            </svg>
          </div>`;

          Patcher.after(UnreadStore, "hasUnread", (_, args, retval) => {
            const allChannels = document.querySelectorAll("#channels > ul > .containerDefault-YUSmu3");
            
            if(!allChannels){
              if(this.settings.debugMode){console.log("No channels found")}
              return retval;
            }

            allChannels.forEach((channel) => {
              let c = channel.children[0].lastElementChild.children[1];
              if(!c){ c = channel.children[0].children[0].lastElementChild.children[1];} // Some channels are in a div with no classes wtf
              if(!c) {return;}

              let channelID = c.parentElement.firstChild.getAttribute("data-list-item-id");
              if(!channelID){return;}
              channelID = channelID.replace(/\D/g,'');

              if(ChannelStore.getChannel(channelID)?.isHidden?.()){

                if(!c.innerHTML.includes(iconHTML)){
                  c.innerHTML = c.innerHTML + iconHTML;
                }
                // c.style.border = "3px solid red"; // Debugging

              }else{

                if(c.innerHTML.includes(iconHTML)){
                  c.innerHTML = c.innerHTML.replace(iconHTML, "");
                }
                // c.style.border = "none"; // Debugging
                
              }
            });
          });
        }

        //* Remove lock icon from hidden voice channels
        //! Not working
        // Patcher.instead(ChannelItem, "_", (_, args, res) => {
        //   if (args[0]?.isHidden?.() && args[2]?.locked)
        //     args[2].locked = false;
        //   return args;
        // });
      }

      onStop() {
        Patcher.unpatchAll();
        delete Channel.prototype["isHidden"];
        // DOMTools.removeStyle(config.info.name);
      }

      //* Settings
      updateDisabledSettings(what){
        // const settings = what.querySelectorAll(".plugin-input-container")

        // if(this.settings.disableIcons){
        //   settings[1].style.display = "none";
        //   settings[2].style.display = "none";
        //   settings[3].style.display = "none";
        // }else{
        //   settings[1].style.display = "block";
        //   settings[2].style.display = "block";
        //   settings[3].style.display = "block";
        // }
      }

      getSettingsPanel() {
        const panel = this.buildSettingsPanel();
        panel.addListener(this.updateSettings.bind(this));
        this.updateDisabledSettings(panel.getElement());
        return panel.getElement();
      }

      updateSettings(id, value) {
        this.updateDisabledSettings(document);

        this.reloadNotification();
      }

      reloadNotification(coolText = "Reload Discord to apply changes and avoid bugs") {
        Modals.showConfirmationModal("Reload Discord?", coolText, {
            confirmText: "Reload",
            cancelText: "Later",
            onConfirm: () => {
                window.location.reload();
            }
        });
      }

    };

  })(global.ZeresPluginLibrary.buildPlugin(config));
})();