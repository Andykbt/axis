export const DATE_RANGES = [
	"Today",
	"Yesterday",
	"Last 7 days",
	"Last 30 days",
	"Last 90 days",
] as const;

export type DateRange = (typeof DATE_RANGES)[number];

function startOfDay(d: Date): Date {
	const out = new Date(d);
	out.setUTCHours(0, 0, 0, 0);
	return out;
}

function endOfDay(d: Date): Date {
	const out = new Date(d);
	out.setUTCHours(23, 59, 59, 999);
	return out;
}

export function getDateRangeForRange(range: DateRange): {
	startDate: Date;
	endDate: Date;
} {
	const now = new Date();
	const startOfToday = startOfDay(now);

	switch (range) {
		case "Today":
			return { startDate: startOfToday, endDate: endOfDay(now) };
		case "Yesterday": {
			const startOfYesterday = new Date(startOfToday);
			startOfYesterday.setUTCDate(startOfYesterday.getUTCDate() - 1);
			return {
				startDate: startOfYesterday,
				endDate: endOfDay(startOfYesterday),
			};
		}
		case "Last 7 days": {
			const start = new Date(startOfToday);
			start.setUTCDate(start.getUTCDate() - 6);
			return { startDate: start, endDate: endOfDay(now) };
		}
		case "Last 30 days": {
			const start = new Date(startOfToday);
			start.setUTCDate(start.getUTCDate() - 29);
			return { startDate: start, endDate: endOfDay(now) };
		}
		case "Last 90 days": {
			const start = new Date(startOfToday);
			start.setUTCDate(start.getUTCDate() - 89);
			return { startDate: start, endDate: endOfDay(now) };
		}
	}
}
