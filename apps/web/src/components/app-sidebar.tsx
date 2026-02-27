import { Link } from "@tanstack/react-router";
import { BoxIcon } from "lucide-react";
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
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="flex h-14 flex-row items-center justify-between border-b">
				<Link to="/dashboard">Axis</Link>
				<SidebarTrigger />
			</SidebarHeader>

			<SidebarContent>
				<SidebarMenu>
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
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	);
}
