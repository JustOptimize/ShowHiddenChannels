// @ts-check

import { ModuleStore } from "./modules";
const { Logger, LocaleManager } = ModuleStore;

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
		const DISCORD_EPOCH = BigInt("1420070400000");
		const id = BigInt(snowflake);
		const unix = (id >> BigInt(22)) + DISCORD_EPOCH;

		return new Date(Number(unix)).toLocaleString(LocaleManager._chosenLocale);
	} catch (err) {
		Logger.err(err);
		return "(Failed to get date)";
	}
}
