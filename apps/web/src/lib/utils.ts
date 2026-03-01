import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function getRelativeUnit(diffMs: number): {
	value: number;
	unit: Intl.RelativeTimeFormatUnit;
} {
	const diffSec = Math.round(diffMs / 1000);
	const diffMin = Math.round(diffSec / 60);
	const diffHr = Math.round(diffMin / 60);
	const diffDay = Math.round(diffHr / 24);

	if (Math.abs(diffSec) < 60) return { value: diffSec, unit: "second" };
	if (Math.abs(diffMin) < 60) return { value: diffMin, unit: "minute" };
	if (Math.abs(diffHr) < 24) return { value: diffHr, unit: "hour" };
	if (Math.abs(diffDay) < 30) return { value: diffDay, unit: "day" };
	if (Math.abs(diffDay) < 365)
		return { value: Math.round(diffDay / 30), unit: "month" };
	return { value: Math.round(diffDay / 365), unit: "year" };
}

/**
 * Returns a human-readable relative time string for a date (e.g. "2 hours ago", "yesterday", "in 3 days").
 * @param date - The date to format (Date instance or ISO string).
 * @param base - Reference time; defaults to now.
 */
export function relativeTime(
	date: Date | string,
	base: Date = new Date(),
): string {
	const d = typeof date === "string" ? new Date(date) : date;
	const diffMs = d.getTime() - base.getTime();
	const { value, unit } = getRelativeUnit(diffMs);
	return rtf.format(value, unit);
}
