import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { ChartAreaIcon, CopyIcon, FileCodeIcon } from "lucide-react";
import { ProjectViewsChart } from "@/components/charts/views-chart";
import { Flex } from "@/components/flex";
import { Grid } from "@/components/grid";
import { NotFoundComponent } from "@/components/not-found";
import { Page, PageHeader, PageTitle } from "@/components/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Empty,
	EmptyContent,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { MapControls, Map as ReactMap } from "@/components/ui/map";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { projectQuery } from "@/functions/get-project";

export const Route = createFileRoute("/dashboard/$projectId/")({
	loader: async ({ context, params }) => {
		// Prefetch event data
		const project = await context.queryClient.ensureQueryData(
			projectQuery(params.projectId),
		);

		if (!project) {
			throw notFound();
		}

		return { project };
	},
	pendingComponent: PendingComponent,
	component: RouteComponent,
	notFoundComponent: NotFoundComponent,
});

function RouteComponent() {
	const { data: project } = useSuspenseQuery(
		projectQuery(Route.useParams().projectId),
	);

	return (
		<Page>
			<PageHeader>
				<Flex justify={"between"}>
					<PageTitle>{project.name}</PageTitle>

					<Select>
						<SelectTrigger>
							<SelectValue placeholder="Select a date" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="today">Today</SelectItem>
							<SelectItem value="yesterday">Yesterday</SelectItem>
							<SelectItem value="last-7-days">Last 7 days</SelectItem>
							<SelectItem value="last-30-days">Last 30 days</SelectItem>
							<SelectItem value="last-90-days">Last 90 days</SelectItem>
						</SelectContent>
					</Select>
				</Flex>
			</PageHeader>
			<div className="grid grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>VIEWS</CardTitle>
					</CardHeader>

					<CardContent>100</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>PEOPLE</CardTitle>
					</CardHeader>

					<CardContent>100</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>DURATION</CardTitle>
					</CardHeader>

					<CardContent>100</CardContent>
				</Card>
			</div>
			<ProjectViewsChart />

			<Card className="h-96 p-0" variant={"border"}>
				<ReactMap
					center={[-74.006, 40.7128]}
					zoom={2}
					minZoom={1}
					attributionControl={false}
					projection={{ type: "globe" }}
				>
					<MapControls showFullscreen position="top-right" />
				</ReactMap>
			</Card>

			<Grid cols={2}>
				<Card variant={"border"} className="border-r-0">
					<CardHeader>
						<CardTitle>PAGES</CardTitle>
					</CardHeader>

					<CardContent>100</CardContent>
				</Card>

				<Card variant={"border"}>
					<CardHeader>
						<CardTitle>SOURCES</CardTitle>
					</CardHeader>

					<CardContent>100</CardContent>
				</Card>
			</Grid>
		</Page>
	);
}

function PendingComponent() {
	return (
		<Page>
			<PageHeader>
				<PageTitle>Loading...</PageTitle>
			</PageHeader>

			<Skeleton className="h-16" />

			<Skeleton className="h-48" />
		</Page>
	);
}

// function EmptyComponent() {
// 	return (
// 		<Page>
// 			<Empty>
// 				<EmptyHeader>
// 					<EmptyMedia>
// 						<ChartAreaIcon />
// 					</EmptyMedia>
// 					<EmptyTitle>No events yet</EmptyTitle>
// 				</EmptyHeader>

// 				<Field>
// 					<InputGroup className="dark:bg-transparent">
// 						<InputGroupAddon align="block-start">
// 							<FileCodeIcon className="text-muted-foreground" />
// 							<InputGroupText className="text-mono">{"<head>"}</InputGroupText>

// 							<InputGroupButton size="icon-xs" className="ml-auto">
// 								<CopyIcon />
// 							</InputGroupButton>
// 						</InputGroupAddon>

// 						<InputGroupTextarea
// 							className="resize-none font-mono"
// 							value={
// 								'<script defer src="/sdk.js" data-write-key="YOUR_WRITE_KEY" />'
// 							}
// 						/>
// 					</InputGroup>
// 					<FieldDescription>
// 						Add the above code to the <code>&lt;head&gt;</code> of your HTML
// 						page to start sending events.
// 					</FieldDescription>
// 				</Field>
// 			</Empty>
// 		</Page>
// 	);
// }
