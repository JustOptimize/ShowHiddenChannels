/**
 * @name ShowHiddenChannels
 * @displayName Show Hidden Channels (SHC)
 * @version 0.0.2
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
      "version": "0.0.2",
      "github": "https://github.com/JustOptimize/return-ShowHiddenChannels",
      "github_raw": "https://raw.githubusercontent.com/JustOptimize/return-ShowHiddenChannels/main/ShowHiddenChannels.plugin.js"
    },
    changelog: [
      {
        title: "Release v0.0.2",
        items: [
          "The plugin now indicates whether a text channel is hidden when you click on it and prevents the loading of the messages (No more \"Couldn't fetch messages\").",
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
      DiscordModules: {
        MessageActions
      }
    } = Library;

    const ChannelStore = WebpackModules.getByProps("getChannel");
    const Channel = WebpackModules.getByPrototypes("isManaged");
    const DiscordConstants = WebpackModules.getModule((m) => m?.Plq?.ADMINISTRATOR == 8n);
    const ChannelPermissionStore = WebpackModules.getByProps("getChannelPermissions");
    const UnreadStore = WebpackModules.getByProps("isForumPostUnread");
    const Route = WebpackModules.getModule((m) => m?.default?.toString().includes("impression"));
    
    //TODO, Coming soon
    //const ChannelUtil = WebpackModules.getByProps("getChannelId");
    //const Voice = WebpackModules.getByProps("getVoiceStateStats");
    // names got removed, and can't get ChannelItem
    //const ChannelItem1 = WebpackModules.getByDisplayName("ChannelItem");
    //const ChannelItem2 = WebpackModules.getByProps("ChannelItem");
    // console.log(ChannelItem1, ChannelItem2);

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
            // For debugging
            // if (res == false) {
            //   console.log("You can now see =>", args[1].name,);
            // }
            return true;
          }

          if (args[1]?.isHidden?.() && args[0] == DiscordConstants.Plq.CONNECT)
            return false;

          return res;
        });

        //! Not working, will be fixed in the future (maybe, idk if i should)
        // Patcher.before(ChannelUtil, "getChannelIconComponent", (_, args) => {
        //     if (args[0]?.isHidden?.() && args[2]?.locked)
        //       args[2].locked = false;
        //     return args;
        //   }
        // );

        //* Stop fetching messages if the channel is hidden
        Route.default.displayName = "RouteWithImpression";
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

        //* This was an attempt to fix the lock icon, but it didn't work
        //* This works but spams this error and after a while the client crashes
        //! ...cord] [Patcher] Could not fire after callback of getChannel for ShowHiddenChannels RangeError: Maximum call stack size exceeded
        // Patcher.after(ChannelStore, "getChannel", (thisObject, methodArguments, returnValue) => {
        //   if(!returnValue?.isHidden?.()) return returnValue;

        //   if (returnValue?.name) {
        //     if (!returnValue.name.startsWith(" 🔒 ")) {
        //       returnValue.name = " 🔒 " + returnValue.name;
        //     }
        //   }
        // });
      }

      onStop() {
        Patcher.unpatchAll();
      }

    };

  })(global.ZeresPluginLibrary.buildPlugin(config));
})();
