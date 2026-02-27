import { createServerFn } from "@tanstack/react-start";
import {
	getRequest,
	getRequestHeader,
	getRequestHeaders,
	getRequestIP,
} from "@tanstack/react-start/server";
import { z } from "zod";

const ingestSchema = z.object({
	writeKey: z.string().min(1),
	events: z.array(
		z.object({
			name: z.string().min(1),
			properties: z.record(z.string(), z.unknown()).optional().default({}),
			url: z.string().optional(),
			referrer: z.string().optional(),
			timestamp: z.iso.datetime().optional(),
		}),
	),
});

export const ingest = createServerFn({ method: "POST" })
	// .inputValidator(ingestSchema)
	.handler(async ({ data }) => {
		console.log("DATA: ", data);

		const request = getRequest();
		const ip = getRequestIP();

		// // Headers
		const headers = getRequestHeaders();
		const userAgent = getRequestHeader("user-agent");

		console.log("###### Headers ######");
		console.log(headers);
		console.log("###### User Agent ######");
		console.log(userAgent);
		console.log("###### IP ######");
		console.log(ip);
		console.log("###### Request ######");
		console.log(request.method);

		return null;
	});
