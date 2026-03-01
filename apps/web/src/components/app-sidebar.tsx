import {
	Link,
	redirect,
	useParams,
	useRouterState,
} from "@tanstack/react-router";
import {
	BoxIcon,
	LucideArrowLeft,
	LucideLayoutDashboard,
	LucideList,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "./ui/sidebar";

export function AppSidebar() {
	const params = useParams({ strict: false });

	// Check if the current page is a project page
	const isProjectPage = params.projectId !== undefined;

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="flex h-14 flex-row items-center justify-between border-b">
				<Link to="/dashboard">Axis</Link>
				<SidebarTrigger />
			</SidebarHeader>

			<SidebarContent>
				<SidebarMenu>
					{isProjectPage ? <ProjectSidebar /> : <DashboardSidebar />}
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	);
}

function DashboardSidebar() {
	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				render={
					<Link to="/dashboard/projects">
						<BoxIcon />
						Projects
					</Link>
				}
			/>
		</SidebarMenuItem>
	);
}
function ProjectSidebar() {
	const params = useParams({ strict: false });

	const projectId = params.projectId!;

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				render={
					<Link to="/dashboard/projects">
						<LucideArrowLeft />
						Back to projects
					</Link>
				}
			/>
			<SidebarMenuButton
				render={
					<Link to="/dashboard/$projectId" params={{ projectId }}>
						<LucideLayoutDashboard />
						Overview
					</Link>
				}
			/>
			<SidebarMenuButton
				render={
					<Link to="/dashboard/$projectId/events" params={{ projectId }}>
						<LucideList />
						Events
					</Link>
				}
			/>
		</SidebarMenuItem>
	);
}
