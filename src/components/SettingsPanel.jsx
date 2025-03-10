// @ts-check

// @ts-ignore
const React = BdApi.React;

const {
	Logger,
	DiscordConstants,
	GuildStore,
	ReactDOM,
	ImageResolver,
	DEFAULT_AVATARS,
	// @ts-ignore
} = require("../utils/modules").ModuleStore;

// If type starts with GUILD, it's a guild channel
const ChannelTypes = Object.keys(DiscordConstants?.ChannelTypes ?? {}).filter(
	(type) => type.startsWith("GUILD") && type !== "GUILD_CATEGORY",
);

const RadioInput = BdApi.Components.RadioInput;
const SettingGroup = BdApi.Components.SettingGroup;
const SwitchItem = BdApi.Components.SwitchInput;
const SettingItem = BdApi.Components.SettingItem;

const { IconSwitchWrapper } = require("./IconSwitchWrapper");

const Switch = ({ value, onChange, name, note = "" }) => {
	return (
		<>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					marginTop: "20px",
				}}
				className="bd-setting-item"
			>
				<SwitchItem
					id={`switch-${name}`}
					value={value}
					onChange={(i) => {
						onChange(i);
					}}
				/>
				<div
					className="bd-setting-header"
					style={{ alignItems: "center", display: "block", marginLeft: "10px" }}
				>
					<label className="bd-setting-title" htmlFor={`switch-${name}`}>
						{name}
					</label>
					{note !== "" && (
						<div className="bd-setting-note" style={{ marginBottom: 0 }}>
							{note}
						</div>
					)}
				</div>
			</div>
			<hr className="bd-divider bd-setting-divider" />
		</>
	);
};

const capitalizeFirst = (string) =>
	`${string.charAt(0).toUpperCase()}${string.substring(1).toLowerCase()}`;

const randomNo = (min, max) =>
	Math.floor(Math.random() * (max - min + 1) + min);

export const SettingsPanel = ({ settings, onSettingsChange }) => {
	return (
		<div>
			{/* Gemeral Settings */}
			<SettingGroup
				settings={settings}
				name="General Settings"
				shown={false}
				id="general-settings"
				collapsible={true}
			>
				<SettingItem
					id="hiddenChannelIcon"
					name={"Hidden Channel Icon"}
					note={"What icon to show as an indicator for hidden channels."}
				>
					<RadioInput
						name={"Hidden Channel Icon"}
						options={[
							{ name: "Lock Icon", value: "lock" },
							{ name: "Eye Icon", value: "eye" },
							{ name: "None", value: "false" },
						]}
						value={settings.hiddenChannelIcon}
						onChange={(value) => {
							onSettingsChange("hiddenChannelIcon", value);
						}}
					/>
				</SettingItem>
				<SettingItem
					id="sortingOrder"
					name={"Sorting Order"}
					note={"Where to display Hidden Channels."}
				>
					<RadioInput
						name={"Sorting Order"}
						options={[
							{
								name: "Hidden Channels in the native Discord order (default)",
								value: "native",
							},
							{
								name: "Hidden Channels at the bottom of the Category",
								value: "bottom",
							},
							{
								name: "Hidden Channels in a separate Category at the bottom",
								value: "extra",
							},
						]}
						value={settings.sort}
						onChange={(value) => {
							onSettingsChange("sort", value);
						}}
					/>
				</SettingItem>
				<Switch
					value={settings.showPerms}
					onChange={(i) => {
						onSettingsChange("showPerms", i);
					}}
					name="Show Permissions"
					note="Show what roles/users can access the hidden channel."
				/>
				<SettingItem
					id="showAdmin"
					name={"Show Admin Roles"}
					note={
						"Show roles that have ADMINISTRATOR permission in the hidden channel page (requires 'Shows Permission' enabled)."
					}
				>
					<RadioInput
						name={"Show Admin Roles"}
						options={[
							{ name: "Show only channel-specific roles", value: "channel" },
							{ name: "Include Bot Roles", value: "include" },
							{ name: "Exclude Bot Roles", value: "exclude" },
							{ name: "Don't Show Administrator Roles", value: "false" },
						]}
						value={settings.showAdmin}
						onChange={(value) => {
							onSettingsChange("showAdmin", value);
						}}
					/>
				</SettingItem>
				<Switch
					value={settings.stopMarkingUnread}
					onChange={(i) => {
						onSettingsChange("stopMarkingUnread", i);
					}}
					name="Stop marking hidden channels as read"
					note="Stops the plugin from marking hidden channels as read."
				/>
				<Switch
					value={settings.shouldShowEmptyCategory}
					onChange={(i) => {
						onSettingsChange("shouldShowEmptyCategory", i);
					}}
					name="Show Empty Category"
					note="Show Empty Category either because there were no channels in it or all channels are under the hidden channels category."
				/>
			</SettingGroup>

			{/* Channel type settings */}
			<SettingGroup
				settings={settings}
				name="Channel Type Settings"
				shown={false}
				id="channel-type-settings"
				collapsible={true}
			>
				{Object.values(ChannelTypes).map((type) => {
					// GUILD_STAGE_VOICE => [GUILD, STAGE, VOICE]
					const formattedTypes = type.split("_");

					// [GUILD, STAGE, VOICE] => [STAGE, VOICE]
					formattedTypes.shift();

					// [STAGE, VOICE] => Stage Voice
					const formattedType = formattedTypes
						.map((word) => capitalizeFirst(word))
						.join(" ");

					return (
						<Switch
							key={type}
							value={settings.channels[type]}
							onChange={(i) => {
								settings.channels[type] = i;
								onSettingsChange("channels", settings.channels);
							}}
							name={`Show ${formattedType} Channels`}
						/>
					);
				})}
			</SettingGroup>

			{/* Guilds Blacklist */}
			<SettingGroup
				settings={settings}
				name="Guilds Blacklist"
				shown={false}
				id="guilds-blacklist"
				collapsible={true}
			>
				{Object.values(GuildStore.getGuilds()).map((guild) => (
					<IconSwitchWrapper
						key={guild.id}
						note={guild.description}
						value={settings.blacklistedGuilds?.[guild.id] ?? false}
						onChange={(e) => {
							settings.blacklistedGuilds[guild.id] = e;
							onSettingsChange("blacklistedGuilds", settings.blacklistedGuilds);
						}}
						icon={
							ImageResolver.getGuildIconURL(guild) ??
							DEFAULT_AVATARS[randomNo(0, DEFAULT_AVATARS.length - 1)]
						}
					>
						{guild.name}
					</IconSwitchWrapper>
				))}
			</SettingGroup>

			{/* Advanced Settings */}
			<SettingGroup
				collapsible={true}
				settings={settings}
				name="Advanced Settings"
				shown={false}
				id="advanced-settings"
			>
				<Switch
					value={settings.checkForUpdates}
					onChange={(i) => {
						onSettingsChange("checkForUpdates", i);
					}}
					name="Check for Updates"
					note="Check for updates on startup."
				/>
				<Switch
					value={settings.usePreRelease}
					onChange={(i) => {
						onSettingsChange("usePreRelease", i);
					}}
					name="Use Pre-release Versions"
					note="If enabled, you will receive pre-release versions."
				/>
				<Switch
					value={settings.debugMode}
					onChange={(i) => {
						Logger.isDebugging = true;
						Logger.debug(`Debug mode ${i ? "enabled" : "disabled"}`);
						Logger.isDebugging = i;

						onSettingsChange("debugMode", i);
					}}
					name="Debug Mode"
					note="Enable Debug Mode."
				/>
			</SettingGroup>

			{/* <Category title="Guilds Blacklist" open={false}>
				<SearchableGuilds
					SettingManager={SettingValues}
					path="blacklistedGuilds"
				/>
			</Category> */}
			{/* <ButtonItem
				button="Reload discord"
				onClick={() => {
					window.location.reload();
				}}
			>
				Some Settings Might require a reload to take effect.
			</ButtonItem> */}
		</div>
	);
};
