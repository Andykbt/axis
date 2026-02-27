import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gridVariants = cva("grid", {
	variants: {
		cols: {
			1: "grid-cols-1",
			2: "grid-cols-2",
			3: "grid-cols-3",
		},
	},
});

export function Grid({
	className,
	cols,
	children,
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof gridVariants>) {
	return (
		<div className={cn(gridVariants({ cols }))} {...props}>
			{children}
		</div>
	);
}
