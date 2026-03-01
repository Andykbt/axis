import { useHotkey } from "@tanstack/react-hotkeys";
import type { Table } from "@tanstack/react-table";
import { LucideSearch } from "lucide-react";
import { useRef } from "react";
import { Flex } from "@/components/flex";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Event } from "@/functions/get-events";

export function TableControls({ table }: { table: Table<Event> }) {
	const inputRef = useRef<HTMLInputElement>(null);

	useHotkey("J", () => table.nextPage());
	useHotkey("K", () => table.previousPage());
	useHotkey("Mod+F", () => inputRef.current?.focus());

	return (
		<Flex className="border-b p-4 pr-8" gap={"md"}>
			<InputGroup>
				<InputGroupAddon>
					<LucideSearch />
				</InputGroupAddon>

				<InputGroupInput
					ref={inputRef}
					placeholder="Search"
					value={table.getState().globalFilter}
					onChange={(e) => {
						table.setGlobalFilter(e.target.value);
					}}
				/>
			</InputGroup>

			<Separator orientation="vertical" />

			<ButtonGroup>
				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								Previous
							</Button>
						}
					/>

					<TooltipContent>
						Previous Page <Kbd>K</Kbd>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								Next
							</Button>
						}
					/>

					<TooltipContent>
						Next Page <Kbd>J</Kbd>
					</TooltipContent>
				</Tooltip>
			</ButtonGroup>
		</Flex>
	);
}
