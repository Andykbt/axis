import { cn } from "@/lib/utils";

function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			data-slot="skeleton"
			className={cn("animate-pulse rounded-none bg-muted/20", className)}
			{...props}
		/>
	);
}

export { Skeleton };
