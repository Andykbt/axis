import { db } from "@axis/db";
import { projects } from "@axis/db/schema/projects";
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "src/middleware/auth";

import { z } from "zod";

export const addProjectSchema = z.object({
	name: z.string().min(1, "Project name is required"),
});

export const addProject = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(addProjectSchema)
	.handler(async ({ context, data }) => {
		if (!context.session) {
			throw new Error("Unauthorized");
		}

		const project = await db
			.insert(projects)
			.values({
				name: data.name,
				userId: context.session.user.id,
			})
			.returning();

		return project[0];
	});
