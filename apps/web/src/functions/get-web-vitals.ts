import { db } from "@axis/db";
import { events } from "@axis/db/schema/events";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "@/middleware/auth";

const webVitalPropertiesSchema = z.object({
	metric: z.string(),
	value: z.number(),
	rating: z.enum(["good", "needs-improvement", "poor"]).optional(),
	delta: z.number().optional(),
	id: z.string().optional(),
	navigationType: z.string().optional(),
});

export const getWebVitals = createServerFn({ method: "GET" })
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

		const conditions = [
			eq(events.projectId, data.projectId),
			eq(events.name, "web_vital"),
		];

		const rows = await db
			.select({
				timestamp: events.timestamp,
				url: events.url,
				properties: events.properties,
			})
			.from(events)
			.where(and(...conditions))
			.orderBy(desc(events.timestamp));

		return rows.map((row) => {
			const parsed = webVitalPropertiesSchema.safeParse(row.properties);
			const props = parsed.success ? parsed.data : null;
			return {
				timestamp: row.timestamp,
				url: row.url,
				metric: props?.metric ?? null,
				value: props?.value ?? null,
				rating: props?.rating ?? null,
			};
		});
	});

export const webVitalsQuery = (projectId: string) =>
	queryOptions({
		queryKey: ["webVitals", projectId],
		queryFn: () =>
			getWebVitals({
				data: {
					projectId,
				},
			}),
	});

export type WebVitalRow = Awaited<ReturnType<typeof getWebVitals>>[number];
