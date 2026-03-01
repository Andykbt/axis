import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const events = pgTable("events", {
	id: uuid("id").primaryKey().defaultRandom().notNull(),
	projectId: uuid("project_id")
		.notNull()
		.references(() => projects.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	properties: jsonb("properties").$type<Record<string, unknown>>().default({}),
	url: text("url"),
	referrer: text("referrer"),
	userAgent: text("user_agent"),
	timestamp: timestamp("timestamp").notNull().defaultNow(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});
