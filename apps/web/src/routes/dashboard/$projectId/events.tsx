import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/page";
import { EventsTable } from "@/components/tables/events/table";

export const Route = createFileRoute("/dashboard/$projectId/events")({
	component: RouteComponent,
});

function RouteComponent() {
	const projectId = Route.useParams().projectId!;

	return (
		<Page
			size="full"
			className="max-w-[calc(100vw)-var(--sidebar-width)] flex-1 gap-0 overflow-hidden"
		>
			<EventsTable projectId={projectId} />
		</Page>
	);
}
