const React = BdApi.React;

import UserMentionsComponent from './UserMentionsComponent';
import ChannelRolesComponent from './ChannelRolesComponent';
import AdminRolesComponent from './AdminRolesComponent';
import ForumComponent from './ForumComponent';
import { convertToHMS, getDateFromSnowflake } from '../utils/date';

const { TextElement, GuildStore, ChannelUtils } = require('../utils/modules').ModuleStore;

const CHANNEL_TYPES = {
    0: 'text',
    2: 'voice',
    4: 'category',
    5: 'news',
    6: 'store',
    13: 'stage',
};

export const Lockscreen = React.memo(({ chat, channel, settings }) => {
    const guild = GuildStore.getGuild(channel.guild_id);
    const guildRoles = GuildStore.getRoles(guild.id);

    return (
        <div
            className={['shc-hidden-chat-content', chat].filter(Boolean).join(' ')}
            style={{
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div className="shc-hidden-notice">
                <img
                    alt='Hidden Channel Icon'
                    style={{
                        WebkitUserDrag: 'none',
                        maxHeight: 128,
                        margin: '0 auto',
                    }}
                    src={
                        settings.hiddenChannelIcon === 'eye'
                            ? 'https://raw.githubusercontent.com/JustOptimize/ShowHiddenChannels/main/assets/eye.png'
                            : '/assets/755d4654e19c105c3cd108610b78d01c.svg'
                    }
                />
                <TextElement
                    color={TextElement.Colors.HEADER_PRIMARY}
                    size={TextElement.Sizes.SIZE_32}
                    style={{
                        marginTop: 20,
                        fontWeight: 'bold',
                    }}
                >
                    {`This is a hidden ${CHANNEL_TYPES[channel.type] ?? 'unknown'} channel`}
                </TextElement>
                <TextElement
                    color={TextElement.Colors.HEADER_SECONDARY}
                    size={TextElement.Sizes.SIZE_16}
                    style={{
                        marginTop: 8,
                    }}
                >
                    You cannot see the contents of this channel. {channel.topic && channel.type !== 15 && 'However, you may see its topic.'}
                </TextElement>
                {/* Topic */}
                {channel.topic &&
                    channel.type !== 15 &&
                    (ChannelUtils?.renderTopic(channel, guild) || "ChannelUtils module is missing, topic won't be shown.")}

                {/* Icon Emoji */}
                {channel?.iconEmoji && (
                    <TextElement
                        color={TextElement.Colors.INTERACTIVE_NORMAL}
                        size={TextElement.Sizes.SIZE_14}
                        style={{
                            marginTop: 16,
                        }}
                    >
                        Icon emoji: {channel.iconEmoji.name ?? channel.iconEmoji.id}
                    </TextElement>
                )}

                {/* Slowmode */}
                {channel.rateLimitPerUser > 0 && (
                    <TextElement color={TextElement.Colors.INTERACTIVE_NORMAL} size={TextElement.Sizes.SIZE_14}>
                        Slowmode: {convertToHMS(Number(channel.rateLimitPerUser))}
                    </TextElement>
                )}

                {/* NSFW */}
                {channel.nsfw && (
                    <TextElement color={TextElement.Colors.INTERACTIVE_NORMAL} size={TextElement.Sizes.SIZE_14}>
                        Age-Restricted Channel (NSFW) 🔞
                    </TextElement>
                )}

                {/* Bitrate */}
                {channel.bitrate && channel.type === 2 && (
                    <TextElement color={TextElement.Colors.INTERACTIVE_NORMAL} size={TextElement.Sizes.SIZE_14}>
                        Bitrate: {channel.bitrate / 1000}kbps
                    </TextElement>
                )}

                {/* Creation date */}
                <TextElement
                    color={TextElement.Colors.INTERACTIVE_NORMAL}
                    size={TextElement.Sizes.SIZE_14}
                    style={{
                        marginTop: 8,
                    }}
                >
                    Created on: {getDateFromSnowflake(channel.id)}
                </TextElement>

                {/* Last message */}
                {channel.lastMessageId && (
                    <TextElement color={TextElement.Colors.INTERACTIVE_NORMAL} size={TextElement.Sizes.SIZE_14}>
                        Last message sent: {getDateFromSnowflake(channel.lastMessageId)}
                    </TextElement>
                )}

                {/* Permissions */}
                {settings.showPerms && channel.permissionOverwrites && (
                    <div
                        style={{
                            margin: '16px auto 0 auto',
                            backgroundColor: 'var(--background-secondary)',
                            padding: 10,
                            borderRadius: 5,
                            color: 'var(--text-normal)',
                        }}
                    >
                        {/* Users */}
                        <UserMentionsComponent channel={channel} guild={guild} settings={settings} />

                        {/* Channel Roles */}
                        <ChannelRolesComponent channel={channel} guild={guild} settings={settings} roles={guildRoles} />

                        {/* Admin Roles */}
                        <AdminRolesComponent guild={guild} settings={settings} roles={guildRoles} />
                    </div>
                )}

                {/* Forums */}
                <ForumComponent channel={channel} />
            </div>
        </div>
    );
});
