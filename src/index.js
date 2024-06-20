import styles from './styles.css';

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
        version: __VERSION__,
        github: 'https://github.com/JustOptimize/return-ShowHiddenChannels',
        github_raw: 'https://raw.githubusercontent.com/JustOptimize/return-ShowHiddenChannels/main/ShowHiddenChannels.plugin.js',
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

    start() {}
    stop() {}

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

export default !global.ZeresPluginLibrary
    ? MissingZeresDummy
    : (([Pl, Lib]) => {
          const plugin = (Plugin, Library) => {
              const ChannelTypes = ['GUILD_TEXT', 'GUILD_VOICE', 'GUILD_ANNOUNCEMENT', 'GUILD_STORE', 'GUILD_STAGE_VOICE', 'GUILD_FORUM'];

              const { Lockscreen } = require('./components/Lockscreen');
              const { HiddenChannelIcon } = require('./components/HiddenChannelIcon');

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
              } = require('./utils/modules').ModuleStore;

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

                      const { loaded_successfully } = require('./utils/modules');

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
                      DOMTools.addStyle(config.info.name, styles);
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

                              wrapper.props.onMouseDown = () => {};
                              wrapper.props.onMouseUp = () => {};

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

                      toForceUpdate.forceUpdate(() => toForceUpdate.forceUpdate(() => {}));
                  }

                  onStop() {
                      Patcher.unpatchAll();
                      DOMTools.removeStyle(config.info.name);
                      ContextMenu.unpatch('guild-context', this.processContextMenu);
                      this.rerenderChannels();
                  }

                  getSettingsPanel() {
                      const { IconSwitchWrapper } = require('./components/IconSwitchWrapper');

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
      })(global.ZeresPluginLibrary.buildPlugin(config));
