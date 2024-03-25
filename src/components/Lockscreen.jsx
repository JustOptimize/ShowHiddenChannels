const React = BdApi.React;

import UserMentionsComponent from './UserMentionsComponent';
import ChannelRolesComponent from './ChannelRolesComponent';
import AdminRolesComponent from './AdminRolesComponent';
import ForumComponent from './ForumComponent';
import { convertToHMS, getDateFromSnowflake } from '../utils/date';

const {
    TextElement,
    GuildStore,
    ChannelUtils,
    UserMentions,
    ProfileActions,
    GuildMemberStore,
    UserStore,
    DiscordConstants,
    PermissionUtils,
    RolePill,
    rolePill,
} = require('../utils/modules').ModuleStore;

export default React.memo(
    ({
        chat,
        channel,

        settings,
    }) => {
        const guild = GuildStore.getGuild(channel.guild_id);
        const guildRoles = GuildStore.getRoles(guild.id);

        // TODO: Use tags instead of create element

        return React.createElement(
            'div',
            {
                className: ['shc-hidden-chat-content', chat].filter(Boolean).join(' '),
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                },
            },
            React.createElement(
                'div',
                {
                    className: 'shc-hidden-notice',
                },
                React.createElement('img', {
                    style: {
                        WebkitUserDrag: 'none',
                        maxHeight: 128,
                    },
                    src:
                        settings['hiddenChannelIcon'] == 'eye'
                            ? 'https://raw.githubusercontent.com/JustOptimize/return-ShowHiddenChannels/main/assets/eye.png'
                            : '/assets/755d4654e19c105c3cd108610b78d01c.svg',
                }),
                React.createElement(
                    TextElement,
                    {
                        color: TextElement.Colors.HEADER_PRIMARY,
                        size: TextElement.Sizes.SIZE_32,
                        style: {
                            marginTop: 20,
                            fontWeight: 'bold',
                        },
                    },
                    // forum = 15, text = 0, voice = 2, announcement = 5, stage = 13
                    `This is a hidden ${
                        channel.type == 15
                            ? 'forum'
                            : channel.type == 0
                            ? 'text'
                            : channel.type == 2
                            ? 'voice'
                            : channel.type == 5
                            ? 'announcement'
                            : channel.type == 13
                            ? 'stage'
                            : ''
                    } channel`
                ),
                React.createElement(
                    TextElement,
                    {
                        color: TextElement.Colors.HEADER_SECONDARY,
                        size: TextElement.Sizes.SIZE_16,
                        style: {
                            marginTop: 8,
                        },
                    },
                    'You cannot see the contents of this channel. ',
                    channel.topic && channel.type != 15 && 'However, you may see its topic.'
                ),
                //* Topic
                channel.topic &&
                    channel.type != 15 &&
                    (ChannelUtils?.renderTopic(channel, guild) || "ChannelUtils module is missing, topic won't be shown."),

                //* Icon Emoji
                channel?.iconEmoji &&
                    React.createElement(
                        TextElement,
                        {
                            color: TextElement.Colors.INTERACTIVE_NORMAL,
                            size: TextElement.Sizes.SIZE_14,
                            style: {
                                marginTop: 16,
                            },
                        },
                        'Icon emoji: ',
                        channel.iconEmoji.name ?? channel.iconEmoji.id
                    ),

                //* Slowmode
                channel.rateLimitPerUser > 0 &&
                    React.createElement(
                        TextElement,
                        {
                            color: TextElement.Colors.INTERACTIVE_NORMAL,
                            size: TextElement.Sizes.SIZE_14,
                        },
                        'Slowmode: ',
                        convertToHMS(channel.rateLimitPerUser)
                    ),

                //* NSFW
                channel.nsfw &&
                    React.createElement(
                        TextElement,
                        {
                            color: TextElement.Colors.INTERACTIVE_NORMAL,
                            size: TextElement.Sizes.SIZE_14,
                        },
                        'Age-Restricted Channel (NSFW) 🔞'
                    ),

                //* Bitrate
                channel.bitrate &&
                    channel.type == 2 &&
                    React.createElement(
                        TextElement,
                        {
                            color: TextElement.Colors.INTERACTIVE_NORMAL,
                            size: TextElement.Sizes.SIZE_14,
                        },
                        'Bitrate: ',
                        channel.bitrate / 1000,
                        'kbps'
                    ),

                //* Creation date
                React.createElement(
                    TextElement,
                    {
                        color: TextElement.Colors.INTERACTIVE_NORMAL,
                        size: TextElement.Sizes.SIZE_14,
                        style: {
                            marginTop: 8,
                        },
                    },
                    'Created on: ',
                    getDateFromSnowflake(channel.id)
                ),

                //* Last message
                channel.lastMessageId &&
                    React.createElement(
                        TextElement,
                        {
                            color: TextElement.Colors.INTERACTIVE_NORMAL,
                            size: TextElement.Sizes.SIZE_14,
                        },
                        'Last message sent: ',
                        getDateFromSnowflake(channel.lastMessageId)
                    ),

                //* Permissions
                settings['showPerms'] &&
                    channel.permissionOverwrites &&
                    React.createElement(
                        'div',
                        {
                            style: {
                                margin: '16px auto 0 auto',
                                backgroundColor: 'var(--background-secondary)',
                                padding: 10,
                                borderRadius: 5,
                                color: 'var(--text-normal)',
                            },
                        },

                        //* Users
                        React.createElement(UserMentionsComponent, {
                            channel,
                            guild,
                            settings: settings,
                            TextElement,
                            UserMentions,
                            ProfileActions,
                            GuildMemberStore,
                            UserStore,
                            DiscordConstants,
                            PermissionUtils,
                        }),

                        //* Channel Roles
                        React.createElement(ChannelRolesComponent, {
                            channel,
                            guild,
                            settings: settings,
                            roles: guildRoles,
                            TextElement,
                            RolePill,
                            DiscordConstants,
                            rolePill,
                        }),

                        //* Admin Roles
                        React.createElement(AdminRolesComponent, {
                            guild,
                            settings: settings,
                            roles: guildRoles,
                            TextElement,
                            RolePill,
                            DiscordConstants,
                            rolePill,
                        })
                    ),

                //* Forums
                React.createElement(ForumComponent, {
                    channel,
                    TextElement,
                })
            )
        );
    }
);
