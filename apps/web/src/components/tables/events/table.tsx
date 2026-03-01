import { useSuspenseQuery } from "@tanstack/react-query";
import {
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import React from "react";

import { useSidebar } from "@/components/ui/sidebar";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { eventsQuery } from "@/functions/get-events";
import { cn } from "@/lib/utils";
import { columns } from "./columns";
import { TableControls } from "./controls";

export function EventsTable({ projectId }: { projectId: string }) {
	const sidebar = useSidebar();

	const { data: events } = useSuspenseQuery(eventsQuery(projectId));

	const table = useReactTable({
		data: events,
		columns: columns,
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		rowCount: events.length,
		initialState: {
			pagination: {
				pageSize: 50,
			},
		},
	});

	return (
		<>
			<TableControls table={table} />

			<div
				className={cn(
					"relative w-full overflow-scroll",
					sidebar.open && "w-[calc(100dvw-var(--sidebar-width))]",
					!sidebar.open && "w-[calc(100dvw-var(--sidebar-width-icon))]",
				)}
			>
				<Table>
					<TableHeader>
						<TableRow className="sticky top-0 bg-background">
							{table.getLeafHeaders().map((header) => (
								<TableHead key={header.id}>{header.id}</TableHead>
							))}
						</TableRow>
					</TableHeader>

					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<React.Fragment key={row.id}>
								<TableRow
									onClick={() => {
										// Toggle the expanded state if the row has properties
										if (Object.keys(row.original.properties ?? {}).length > 0) {
											row.toggleExpanded();
										}
									}}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>

								{row.getIsExpanded() && (
									<TableRow>
										<TableCell colSpan={row.getVisibleCells().length}>
											<pre>
												{JSON.stringify(row.getValue("properties"), null, 2)}
											</pre>
										</TableCell>
									</TableRow>
								)}
							</React.Fragment>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
