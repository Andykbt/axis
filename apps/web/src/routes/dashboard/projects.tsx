import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BoxIcon } from "lucide-react";
import { AddProjectDialog } from "@/components/dialogs/add-project";
import { Flex } from "@/components/flex";
import {
	Page,
	PageDescription,
	PageHeader,
	PageTitle,
} from "@/components/page";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { projectsQuery } from "@/functions/get-projects";

export const Route = createFileRoute("/dashboard/projects")({
	loader: async ({ context }) => {
		context.queryClient.ensureQueryData(projectsQuery);

		// context.queryClient.prefetchQuery(projectsQuery);

		// console.log("getting projects");
		// const projects = await getProjects();

		return { projects: [] };
	},
	pendingComponent: PendingComponent,
	component: RouteComponent,
});

function RouteComponent() {
	const { data: projects } = useSuspenseQuery(projectsQuery);

	return (
		<Page>
			<PageHeader>
				<Flex justify={"between"}>
					<PageTitle>Projects</PageTitle>

					<AddProjectDialog />
				</Flex>

				<PageDescription>Manage your projects</PageDescription>
			</PageHeader>

			{projects?.length === 0 && (
				<Empty className="border border-dashed">
					<EmptyHeader>
						<EmptyMedia variant={"icon"}>
							<BoxIcon />
						</EmptyMedia>
						<EmptyTitle>No projects found</EmptyTitle>
					</EmptyHeader>
					<EmptyContent>
						<EmptyDescription>
							You don't have any projects yet. Create a new project to get
							started.
						</EmptyDescription>
					</EmptyContent>
				</Empty>
			)}

			{projects?.map((project) => (
				<Link
					to={"/dashboard/$projectId"}
					params={{ projectId: project.id }}
					key={project.id}
				>
					<Card variant={"border"} hover={true}>
						<CardHeader>
							<CardTitle>{project.name}</CardTitle>
						</CardHeader>
					</Card>
				</Link>
			))}
		</Page>
	);
}

function PendingComponent() {
	return (
		<Page>
			<PageHeader>
				<Flex justify={"between"}>
					<PageTitle>Projects</PageTitle>

					<AddProjectDialog />
				</Flex>

				<PageDescription>Manage your projects</PageDescription>
			</PageHeader>

			<Skeleton className="h-14" />
			<Skeleton className="h-14" />
			<Skeleton className="h-14" />
		</Page>
	);
}
