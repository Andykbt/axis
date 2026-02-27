import { cn } from "@/lib/utils";

function Page({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div
			className={cn(
				"mx-auto flex w-full max-w-2xl flex-col gap-4 py-8",
				className,
			)}
		>
			{children}
		</div>
	);
}

function PageHeader({ children }: { children: React.ReactNode }) {
	return <div className="flex flex-col">{children}</div>;
}

function PageTitle({ children }: { children: React.ReactNode }) {
	return (
		<h1 className="font-bold text-2xl text-foreground tracking-tight lg:text-3xl">
			{children}
		</h1>
	);
}

function PageDescription({ children }: { children: React.ReactNode }) {
	return <p className="text-muted-foreground text-sm">{children}</p>;
}

export { Page, PageHeader, PageTitle, PageDescription };
