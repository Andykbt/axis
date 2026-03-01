import { db } from "@axis/db";
import { projects } from "@axis/db/schema/projects";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "@/middleware/auth";

export const getProject = createServerFn({ method: "GET" })
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

		const [project] = await db
			.select()
			.from(projects)
			.where(eq(projects.id, data.projectId))
			.limit(1);

		if (!project) {
			return null;
		}

		return project;
	});

export const projectQuery = (projectId: string) =>
	queryOptions({
		queryKey: ["project", projectId],
		queryFn: () => getProject({ data: { projectId } }),
	});
