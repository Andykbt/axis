import { db } from "@axis/db";
import { projects } from "@axis/db/schema/projects";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { authMiddleware } from "src/middleware/auth";
import { z } from "zod";

export const getProject = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			id: z.string().min(1, "Project ID is required"),
		}),
	)
	.handler(async ({ context, data }) => {
		if (!context.session) {
			throw new Error("Unauthorized");
		}

		const [project] = await db
			.select()
			.from(projects)
			.where(eq(projects.id, data.id))
			.limit(1);

		if (!project) {
			return null;
		}

		return project;
	});

export const projectQuery = (id: string) =>
	queryOptions({
		queryKey: ["project", id],
		queryFn: () => getProject({ data: { id } }),
	});
