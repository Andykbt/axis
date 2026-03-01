import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { LucideSearch } from "lucide-react";
import { Flex } from "@/components/flex";
import { Grid } from "@/components/grid";
import { Page } from "@/components/page";
import { EventsTable } from "@/components/tables/events/table";
import { Card, CardAction } from "@/components/ui/card";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { eventsQuery } from "@/functions/get-events";

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
			{/* <Flex className="h-full border-border border-r px-4">
					<Card>aewfwae</Card>
				</Flex> */}

			<EventsTable projectId={projectId} />
		</Page>
	);
}
