const TextElement = global.ZeresPluginLibrary?.DiscordModules?.TextElement;

export default function AdminRolesComponent({ guild, settings, roles, RolePill, DiscordConstants, rolePill }) {
    if (!settings['showAdmin']) return null;
    if (settings['showAdmin'] == 'channel') return null;

    const adminRoles = [];
    Object.values(roles).forEach((role) => {
        if (
            (role.permissions & BigInt(8)) == BigInt(8) &&
            (settings['showAdmin'] == 'include' || (settings['showAdmin'] == 'exclude' && !role.tags?.bot_id))
        ) {
            adminRoles.push(role);
        }
    });

    if (!adminRoles?.length) {
        return null;
    }

    return (
        <TextElement
            color={TextElement.Colors.INTERACTIVE_NORMAL}
            style={{
                borderTop: '1px solid var(--background-tertiary)',
                padding: 5,
            }}
        >
            Admin roles:
            <div
                style={{
                    paddingTop: 5,
                }}
            >
                {adminRoles.map((m) =>
                    RolePill.render(
                        {
                            canRemove: false,
                            className: `${rolePill} shc-rolePill`,
                            disableBorderColor: true,
                            guildId: guild.id,
                            onRemove: DiscordConstants.NOOP,
                            role: m,
                        },
                        DiscordConstants.NOOP
                    )
                )}
            </div>
        </TextElement>
    );
}
