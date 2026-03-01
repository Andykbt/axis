import { Link, useParams } from "@tanstack/react-router";
import {
	BoxIcon,
	LucideArrowLeft,
	LucideBarChart,
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

const PROJECT_SIDEBAR_ITEMS = [
	{
		label: "Back to projects",
		icon: LucideArrowLeft,
		to: "/dashboard/projects",
	},
	{
		label: "Overview",
		icon: LucideLayoutDashboard,
		to: "/dashboard/$projectId",
	},
	{
		label: "Events",
		icon: LucideList,
		to: "/dashboard/$projectId/events",
	},
	{
		label: "Performance",
		icon: LucideBarChart,
		to: "/dashboard/$projectId/performance",
	},
];

function ProjectSidebar() {
	const params = useParams({ strict: false });

	const projectId = params.projectId!;

	return (
		<SidebarMenuItem>
			{PROJECT_SIDEBAR_ITEMS.map((item) => (
				<SidebarMenuButton
					key={item.label}
					render={
						<Link to={item.to} params={{ projectId }}>
							<item.icon />
							{item.label}
						</Link>
					}
				/>
			))}
		</SidebarMenuItem>
	);
}
