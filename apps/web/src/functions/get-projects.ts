import { db } from "@axis/db";
import { projects } from "@axis/db/schema/projects";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

import { eq } from "drizzle-orm";

import { authMiddleware } from "src/middleware/auth";

export const getProjects = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		// If the user is not authenticated, throw an error
		if (!context.session) {
			throw new Error("Unauthorized");
		}

		const rows = await db
			.select()
			.from(projects)
			.where(eq(projects.userId, context.session.user.id));

		return rows;
	});

export const projectsQuery = queryOptions({
	queryKey: ["projects"],
	queryFn: getProjects,
});
