import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { NotFoundComponent } from "@/components/not-found";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await getUser();
		return { session };
	},
	loader: async ({ context }) => {
		if (!context.session) {
			throw redirect({
				to: "/login",
			});
		}
	},
	notFoundComponent: NotFoundComponent,
});

function RouteComponent() {
	return (
		<SidebarProvider>
			<TooltipProvider>
				<AppSidebar />

				<SidebarInset className="overflow-hidden">
					<Header />
					<Outlet />
				</SidebarInset>
			</TooltipProvider>
		</SidebarProvider>
	);
}
