import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pageVariants = cva("mx-auto flex w-full flex-col gap-8", {
	variants: {
		size: {
			default: "max-w-4xl py-8",
			wide: "max-w-7xl py-8",
			full: "w-full max-w-screen",
		},
	},
	defaultVariants: {
		size: "default",
	},
});

function Page({
	className,
	size = "default",
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof pageVariants>) {
	return <div className={cn(pageVariants({ size, className }))} {...props} />;
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
