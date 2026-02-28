import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { NotFoundComponent } from "src/components/not-found";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
			<AppSidebar />

			<SidebarInset>
				<Header />
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
