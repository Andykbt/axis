import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="relative min-h-svh bg-dot-grid">
			<main className="relative mx-auto flex min-h-svh max-w-4xl flex-col justify-center px-6 py-16 sm:px-8">
				<h1 className="animate-waitlist-in font-sans font-semibold text-[clamp(4rem,18vw,12rem)] text-white leading-[0.85] tracking-tight">
					Axis
				</h1>

				<p
					className="mt-4 animate-waitlist-in font-mono text-muted-foreground text-sm uppercase tracking-widest"
					style={{ animationDelay: "80ms", animationFillMode: "backwards" }}
				>
					the modern control panel for your projects
				</p>
			</main>
		</div>
	);
}
