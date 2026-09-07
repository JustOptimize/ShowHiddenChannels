import type DiscordChannel from "discord-types/general/Channel";

export interface SHCChannel extends DiscordChannel {
	isGuildVocal(): boolean;
	isSpoilerChannel?(): boolean;
	iconEmoji?: { name?: string; id?: string };
}

export interface ChannelRendererInstance {
	channel: SHCChannel;
	connected: boolean;
}
