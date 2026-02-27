import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const flexVariants = cva("flex w-full", {
	variants: {
		direction: {
			row: "flex-row",
			column: "flex-col",
			wrap: "flex-wrap",
		},
		justify: {
			start: "justify-start",
			center: "justify-center",
			end: "justify-end",
			between: "justify-between",
			around: "justify-around",
			evenly: "justify-evenly",
		},
		align: {
			start: "items-start",
			center: "items-center",
			end: "items-end",
			baseline: "items-baseline",
			stretch: "items-stretch",
		},
		gap: {
			none: "gap-0",
			sm: "gap-1",
			md: "gap-2",
			lg: "gap-3",
			xl: "gap-4",
			xxl: "gap-5",
		},
	},
	defaultVariants: {
		direction: "row",
		justify: "start",
		align: "start",
		gap: "none",
	},
});

export function Flex({
	children,
	direction,
	justify,
	align,
	gap,
	className,
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof flexVariants>) {
	return (
		<div
			className={cn(
				flexVariants({ direction, justify, align, gap }),
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
