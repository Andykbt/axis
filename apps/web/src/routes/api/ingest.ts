import { createFileRoute } from "@tanstack/react-router";
import { ingest } from "@/functions/ingest";

export const Route = createFileRoute("/api/ingest")({
	server: {
		handlers: {
			// GET: async () => {
			// 	return new Response("OK", { status: 200 });
			// },
			POST: async ({ request }) => {
				console.log("###### Ingesting ######");
				const data = await request.json();

				const res = await ingest({ data });

				// return new Response(JSON.stringify(res), { status: 200 });
				return new Response("OK", { status: 200 });
			},
		},
	},
});
