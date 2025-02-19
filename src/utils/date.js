const { Logger, LocaleManager } = require("./modules").ModuleStore;

export function convertToHMS(timeInSeconds) {
	const hours = Math.floor(timeInSeconds / 3600);
	const minutes = Math.floor((timeInSeconds % 3600) / 60);
	const seconds = Math.floor((timeInSeconds % 3600) % 60);

	const formatTime = (value, unit) =>
		value > 0 ? `${value} ${unit}${value > 1 ? "s" : ""}` : "";

	return [
		formatTime(hours, "hour"),
		formatTime(minutes, "minute"),
		formatTime(seconds, "second"),
	].join(" ");
}

export function getDateFromSnowflake(snowflake) {
	try {
		const DISCORD_EPOCH = 1420070400000n;
		const id = BigInt(snowflake);
		const unix = (id >> 22n) + DISCORD_EPOCH;

		return new Date(Number(unix)).toLocaleString(LocaleManager._chosenLocale);
	} catch (err) {
		Logger.err(err);
		return "(Failed to get date)";
	}
}
