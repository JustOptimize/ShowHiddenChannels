// @ts-check

import { getModules } from "../utils/modules";

const {
	Components: { TextElement },
	RolePill,
	DiscordConstants,
} = getModules();

export default function ChannelRolesComponent({
	channel,
	guild,
	settings,
	roles,
	//* 1024n = VIEW_CHANNEL, 1048576n = CONNECT for locked voice channels
	permission = 1024n,
}) {
	const perm = BigInt(permission);
	const channelRoles = Object.values(channel.permissionOverwrites).filter(
		(role) =>
			role !== undefined &&
			role?.type === 0 &&
			//* 8n = ADMINISTRATOR permission
			//* If role is ADMINISTRATOR it has the permission even if overwrites deny it
			((settings.showAdmin &&
				(roles[role.id].permissions & BigInt(8)) === BigInt(8)) ||
				//* If overwrites allow the permission (it will override the default role permissions)
				(role.allow & perm) === perm ||
				//* If role has the permission by default and overwrites don't deny it
				(roles[role.id].permissions & perm &&
					(role.deny & perm) === BigInt(0))),
	);

	return (
		<TextElement
			color={TextElement.Colors.STANDARD}
			style={{
				borderTop: "1px solid var(--border-subtle)",
				padding: 8,
			}}
		>
			Channel-specific roles:
			<div
				style={{
					paddingTop: 8,
				}}
			>
				{!channelRoles?.length && <span>None</span>}
				{channelRoles?.length > 0 &&
					channelRoles.map((m) => (
						<RolePill
							key={m.id}
							canRemove={false}
							className={"shc-rolePill"}
							disableBorderColor={true}
							guildId={guild.id}
							onRemove={DiscordConstants.NOOP}
							role={roles[m.id]}
						/>
					))}
			</div>
		</TextElement>
	);
}
