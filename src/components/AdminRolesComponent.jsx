const { TextElement, RolePill, DiscordConstants } = require('../utils/modules').ModuleStore;
const React = BdApi.React;

const AdminRolesElement = ({ guild, settings, roles }) => {
    if (!settings.showAdmin) return null;
    if (settings.showAdmin === 'channel') return null;

    const adminRoles = [];
    for (const role of Object.values(roles)) {
        if (
            (role.permissions & BigInt(8)) === BigInt(8) &&
            (settings.showAdmin === 'include' || (settings.showAdmin === 'exclude' && !role.tags?.bot_id))
        ) {
            adminRoles.push(role);
        }
    }

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
                {adminRoles.map((m) => (
                    <RolePill
                        key={m.id}
                        canRemove={false}
                        className={"shc-rolePill"}
                        disableBorderColor={true}
                        guildId={guild.id}
                        onRemove={DiscordConstants.NOOP}
                        role={m}
                    />
                ))}
            </div>
        </TextElement>
    );
};

export default React.memo(AdminRolesElement);
