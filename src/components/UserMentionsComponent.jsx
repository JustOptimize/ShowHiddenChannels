const React = BdApi.React;

const { TextElement, UserMentions, ProfileActions, GuildMemberStore, UserStore, DiscordConstants, PermissionUtils } =
    require('../utils/modules').ModuleStore;

export default function UserMentionsComponent({ channel, guild, settings }) {
    const [userMentionComponents, setUserMentionComponents] = React.useState([]);

    const fetchMemberAndMap = async () => {
        setUserMentionComponents([]);

        if (!settings.showPerms) {
            return setUserMentionComponents(['None']);
        }

        const allUserOverwrites = Object.values(channel.permissionOverwrites).filter((user) => Boolean(user && user?.type === 1));

        for (const user of allUserOverwrites) {
            if (UserStore.getUser(user.id)) continue;

            await ProfileActions.fetchProfile(user.id, {
                guildId: guild.id,
                withMutualGuilds: false,
            });
        }

        const filteredUserOverwrites = Object.values(channel.permissionOverwrites).filter((user) =>
            Boolean(
                PermissionUtils.can({
                    permission: DiscordConstants.Permissions.VIEW_CHANNEL,
                    user: UserStore.getUser(user.id),
                    context: channel,
                }) && GuildMemberStore.isMember(guild.id, user.id)
            )
        );

        if (!filteredUserOverwrites?.length) {
            return setUserMentionComponents(['None']);
        }

        const mentionArray = filteredUserOverwrites.map((m) =>
            UserMentions.react(
                {
                    userId: m.id,
                    channelId: channel.id,
                },
                () => null,
                {
                    noStyleAndInteraction: false,
                }
            )
        );

        return setUserMentionComponents(mentionArray);
    };

    React.useEffect(() => {
        fetchMemberAndMap();
    }, [channel.id, guild.id, settings.showPerms]);

    return (
        <TextElement color={TextElement.Colors.INTERACTIVE_NORMAL} size={TextElement.Sizes.SIZE_14}>
            Users that can see this channel:
            <div
                style={{
                    marginTop: 8,
                    marginBottom: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    gap: 8,
                    padding: 8,
                    paddingTop: 0,
                }}
            >
                {userMentionComponents}
            </div>
        </TextElement>
    );
}
