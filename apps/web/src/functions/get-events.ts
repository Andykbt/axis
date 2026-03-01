import { db } from "@axis/db";
import { events } from "@axis/db/schema/events";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { parseUserAgent } from "@/lib/user-agent";
import { authMiddleware } from "@/middleware/auth";

export const getEvents = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string().min(1, "Project ID is required"),
		}),
	)
	.handler(async ({ context, data }) => {
		if (!context.session) {
			throw new Error("Unauthorized");
		}

		const rows = await db
			.select({
				id: events.id,
				name: events.name,
				properties: events.properties as Record<string, any>,
				url: events.url,
				userAgent: events.userAgent,
				referrer: events.referrer,
				timestamp: events.timestamp,
			})
			.from(events)
			.where(eq(events.projectId, data.projectId))
			.orderBy(desc(events.timestamp));

		const parsedEvents = rows.map((row) => {
			const parsedUserAgent = parseUserAgent(row.userAgent ?? "");
			return {
				timestamp: row.timestamp,
				name: row.name,
				url: row.url,
				properties: row.properties,
				referrer: row.referrer,
				browser: `${parsedUserAgent.browser} ${parsedUserAgent.browserVersion}`,
				device: `${parsedUserAgent.os} ${parsedUserAgent.osVersion}`,
				mobile: parsedUserAgent.mobile ? "Mobile" : "Desktop",
			};
		});

		return parsedEvents;
	});

export const eventsQuery = (projectId: string) =>
	queryOptions({
		queryKey: ["events", projectId],
		queryFn: () => getEvents({ data: { projectId } }),
	});

export type Event = Awaited<ReturnType<typeof getEvents>>[number];
