// @ts-check
const React = BdApi.React;

const {
	ModuleStore: { TextElement },
} = require("../utils/modules");

export default function ForumComponent({ channel }) {
	if (channel.type !== 15) return null;
	if (!channel.availableTags && !channel.topic) {
		return null;
	}

	return (
		<TextElement
			color={TextElement.Colors.HEADER_SECONDARY}
			size={TextElement.Sizes.SIZE_24}
			style={{
				margin: "16px auto",
				backgroundColor: "var(--background-secondary)",
				padding: 24,
				borderRadius: 8,
				color: "var(--text-normal)",
				fontWeight: "bold",
				maxWidth: "40vw",
			}}
		>
			Forum
			{/* Tags */}
			<TextElement
				color={TextElement.Colors.INTERACTIVE_NORMAL}
				size={TextElement.Sizes.SIZE_14}
				style={{
					marginTop: 24,
				}}
			>
				{channel.availableTags && channel.availableTags.length > 0
					? `Tags: ${channel.availableTags.map((tag) => tag.name).join(", ")}`
					: "Tags: No tags avaiable"}
			</TextElement>
			{/* Guidelines */}
			{channel.topic && (
				<TextElement
					color={TextElement.Colors.INTERACTIVE_NORMAL}
					size={TextElement.Sizes.SIZE_14}
					style={{
						marginTop: 16,
					}}
				>
					Guidelines: {channel.topic}
				</TextElement>
			)}
			{!channel.topic && (
				<TextElement
					color={TextElement.Colors.INTERACTIVE_NORMAL}
					size={TextElement.Sizes.SIZE_14}
					style={{
						marginTop: 8,
					}}
				>
					Guidelines: No guidelines avaiable
				</TextElement>
			)}
		</TextElement>
	);
}
