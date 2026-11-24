// @ts-check

import { convertToHMS, getDateFromSnowflake } from "../utils/date";
import { getModules } from "../utils/modules";
import AdminRolesComponent from "./AdminRolesComponent";
import ChannelRolesComponent from "./ChannelRolesComponent";
import ForumComponent from "./ForumComponent";
import UserMentionsComponent from "./UserMentionsComponent";

const {
	Components: { TextElement },
	DiscordConstants,
	GuildStore,
	GuildRoleStore,
	React,
} = getModules();

const CHANNEL_TYPES = {
	0: "text",
	2: "voice",
	4: "category",
	5: "news",
	6: "store",
	13: "stage",
	15: "forum",
	16: "media",
};

export const Lockscreen = React.memo(
	(
		/** @type {{ chat: string, channel: import('../discord').SHCChannel, settings: Record<string, any>, locked?: boolean }} */ {
			chat,
			channel,
			settings,
			locked = false,
		},
	) => {
		const guild = GuildStore.getGuild(channel.guild_id);
		const guildRoles = GuildRoleStore.getRolesSnapshot(guild?.id);
		//* Discord strips obfuscated channels server-side: the name, topic, last
		//* message, forum tags and permission overwrites are placeholders.
		const obfuscated = channel.isObfuscated?.() ?? false;
		//* Locked: a voice channel you can see but not join, so list who can join
		const permission = locked
			? DiscordConstants.Permissions.CONNECT
			: DiscordConstants.Permissions.VIEW_CHANNEL;
		const state = locked ? "locked" : "hidden";

		return (
			<div
				className={["shc-hidden-chat-content", chat].filter(Boolean).join(" ")}
				style={{
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<div className="shc-hidden-notice">
					<img
						alt="Hidden Channel Icon"
						style={{
							// @ts-expect-error webkitUserDrag is not recognized by TypeScript but is valid in CSS
							webkitUserDrag: "none",
							maxHeight: 128,
							margin: "0 auto",
						}}
						src={
							settings.hiddenChannelIcon === "eye"
								? "https://raw.githubusercontent.com/JustOptimize/ShowHiddenChannels/main/assets/eye.png"
								: "/assets/755d4654e19c105c3cd108610b78d01c.svg"
						}
					/>
					<TextElement
						color={TextElement.Colors.HEADER_PRIMARY}
						size={TextElement.Sizes.SIZE_32}
						style={{
							marginTop: 20,
							fontWeight: "bold",
						}}
					>
						{CHANNEL_TYPES[channel.type]
							? `This is a ${state} ${CHANNEL_TYPES[channel.type]} channel`
							: `This is a ${state} channel`}
					</TextElement>
					<TextElement
						color={TextElement.Colors.HEADER_SECONDARY}
						size={TextElement.Sizes.SIZE_16}
						style={{
							marginTop: 8,
						}}
					>
						{locked
							? "You cannot join this channel."
							: "You cannot see the contents of this channel."}
					</TextElement>

					{/* Icon Emoji */}
					{channel?.iconEmoji && (
						<TextElement
							color={TextElement.Colors.STANDARD}
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
						<TextElement
							color={TextElement.Colors.STANDARD}
							size={TextElement.Sizes.SIZE_14}
						>
							Slowmode: {convertToHMS(Number(channel.rateLimitPerUser))}
						</TextElement>
					)}

					{/* NSFW */}
					{channel.nsfw && (
						<TextElement
							color={TextElement.Colors.STANDARD}
							size={TextElement.Sizes.SIZE_14}
						>
							Age-Restricted Channel (NSFW) 🔞
						</TextElement>
					)}

					{/* Spoiler */}
					{channel.isSpoilerChannel?.() && (
						<TextElement
							color={TextElement.Colors.STANDARD}
							size={TextElement.Sizes.SIZE_14}
						>
							Spoiler Channel 👁️
						</TextElement>
					)}

					{/* Bitrate */}
					{!obfuscated && channel.bitrate && channel.type === 2 && (
						<TextElement
							color={TextElement.Colors.STANDARD}
							size={TextElement.Sizes.SIZE_14}
						>
							Bitrate: {channel.bitrate / 1000}kbps
						</TextElement>
					)}

					{/* Creation date */}
					<TextElement
						color={TextElement.Colors.STANDARD}
						size={TextElement.Sizes.SIZE_14}
						style={{
							marginTop: 8,
						}}
					>
						Created on: {getDateFromSnowflake(channel.id)}
					</TextElement>

					{/* Last message */}
					{channel.lastMessageId && (
						<TextElement
							color={TextElement.Colors.STANDARD}
							size={TextElement.Sizes.SIZE_14}
						>
							Last message sent: {getDateFromSnowflake(channel.lastMessageId)}
						</TextElement>
					)}

					{/* Obfuscated: overwrites are a fake @everyone deny, only admin roles are real */}
					{obfuscated && (
						<div
							style={{
								margin: "16px auto 0 auto",
								backgroundColor: "var(--bg-surface-raised)",
								padding: 10,
								borderRadius: 5,
								color: "var(--text-default)",
							}}
						>
							<TextElement
								color={TextElement.Colors.STANDARD}
								size={TextElement.Sizes.SIZE_14}
							>
								Discord no longer shares this channel's name, topic or
								permissions.
							</TextElement>

							{settings.showPerms && (
								<AdminRolesComponent
									guild={guild}
									settings={
										settings.showAdmin === "channel"
											? { ...settings, showAdmin: "include" }
											: settings
									}
									roles={guildRoles}
								/>
							)}
						</div>
					)}

					{/* Permissions */}
					{!obfuscated && settings.showPerms && channel.permissionOverwrites && (
						<div
							style={{
								margin: "16px auto 0 auto",
								backgroundColor: "var(--bg-surface-raised)",
								padding: 10,
								borderRadius: 5,
								color: "var(--text-default)",
							}}
						>
							{/* Users */}
							<UserMentionsComponent
								channel={channel}
								guild={guild}
								settings={settings}
								permission={permission}
							/>

							{/* Channel Roles */}
							<ChannelRolesComponent
								channel={channel}
								guild={guild}
								settings={settings}
								roles={guildRoles}
								permission={permission}
							/>

							{/* Admin Roles */}
							<AdminRolesComponent
								guild={guild}
								settings={settings}
								roles={guildRoles}
							/>
						</div>
					)}

					{/* Forums */}
					{!obfuscated && <ForumComponent channel={channel} />}
				</div>
			</div>
		);
	},
);
