import type { ColumnDef } from "@tanstack/react-table";
import { Grid } from "@/components/grid";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Event } from "@/functions/get-events";
import { relativeTime } from "@/lib/utils";

export const columns: ColumnDef<Event>[] = [
	{
		header: "Timestamp",
		accessorKey: "timestamp",
		cell: ({ row }) => {
			const ts = row.original.timestamp;
			const utcString = new Intl.DateTimeFormat("en-GB", {
				timeZone: "UTC",
				dateStyle: "medium",
				timeStyle: "medium",
			}).format(ts);

			return (
				<Tooltip>
					<TooltipTrigger className="pr-4 text-muted-foreground">
						{row.original.timestamp.toLocaleString()}
					</TooltipTrigger>

					<TooltipContent side="right">
						<Grid cols={2}>
							<span>UTC</span>
							<span>{utcString}</span>
							<span>Relative</span>
							<span>{relativeTime(ts)}</span>
						</Grid>
					</TooltipContent>
				</Tooltip>
			);
		},
	},
	{
		header: "Event",
		accessorKey: "name",
	},
	{
		header: "Properties",
		accessorKey: "properties",
		cell: ({ row }) => {
			return <pre>{Object.keys(row.original.properties).length ?? "-"}</pre>;
		},
	},
	{
		header: "browser",
		accessorKey: "browser",
	},
	{
		header: "device",
		accessorKey: "device",
	},
	{
		header: "URL",
		accessorKey: "url",
	},
	{
		header: "Referrer",
		accessorKey: "referrer",
	},
];
