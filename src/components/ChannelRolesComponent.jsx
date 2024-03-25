const { TextElement, RolePill, DiscordConstants, rolePill } = require('../utils/modules').ModuleStore;

export default function ChannelRolesComponent({ channel, guild, settings, roles }) {
    const channelRoles = Object.values(channel.permissionOverwrites).filter(
        (role) =>
            role !== undefined &&
            role?.type == 0 &&
            //* 1024n = VIEW_CHANNEL permission
            //* 8n = ADMINISTRATOR permission
            //* If role is ADMINISTRATOR it can view channel even if overwrites deny VIEW_CHANNEL
            ((settings.showAdmin && (roles[role.id].permissions & BigInt(8)) == BigInt(8)) ||
                //* If overwrites allow VIEW_CHANNEL (it will override the default role permissions)
                (role.allow & BigInt(1024)) == BigInt(1024) ||
                //* If role can view channel by default and overwrites don't deny VIEW_CHANNEL
                (roles[role.id].permissions & BigInt(1024) && (role.deny & BigInt(1024)) == 0))
    );

    if (!channelRoles?.length) {
        return null;
    }

    return (
        <TextElement
            color={TextElement.Colors.INTERACTIVE_NORMAL}
            style={{
                borderTop: '1px solid var(--background-tertiary)',
                padding: 8,
            }}
        >
            Channel-specific roles:
            <div
                style={{
                    paddingTop: 8,
                }}
            >
                {channelRoles.map((m) =>
                    RolePill.render(
                        {
                            canRemove: false,
                            className: `${rolePill} shc-rolePill`,
                            disableBorderColor: true,
                            guildId: guild.id,
                            onRemove: DiscordConstants.NOOP,
                            role: roles[m.id],
                        },
                        DiscordConstants.NOOP
                    )
                )}
            </div>
        </TextElement>
    );
}
