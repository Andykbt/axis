import { SidebarTrigger } from "./ui/sidebar";
export function Header() {
	return (
		<header className="sticky top-0 z-50 flex h-14 w-full items-center gap-4 border-b bg-background px-4 py-4">
			<SidebarTrigger />
		</header>
	);
}
