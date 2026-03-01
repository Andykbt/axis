import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { addProject, addProjectSchema } from "@/functions/add-project";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

export function AddProjectDialog() {
	///////////////////////
	// State
	///////////////////////
	const [open, setOpen] = useState(false);

	///////////////////////
	// Hooks
	///////////////////////
	const queryClient = useQueryClient();

	const createProject = useMutation({
		mutationFn: addProject,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			toast.success("Project created successfully");
			setOpen(false);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const form = useForm({
		defaultValues: {
			name: "",
		},
		validators: {
			onSubmit: addProjectSchema,
		},
		onSubmit: async ({ value }) => {
			await createProject.mutateAsync({ data: value });
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<form
				id="add-project-form"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<DialogTrigger
					render={
						<Button>
							<PlusIcon />
							Add Project
						</Button>
					}
				/>

				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Project</DialogTitle>
						<DialogDescription>
							Add a new project to your account to start tracking your data.
						</DialogDescription>
					</DialogHeader>

					<FieldGroup>
						<form.Field name="name">
							{(field) => (
								<Field>
									<FieldLabel>Project Name</FieldLabel>
									<Input
										type="text"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldError errors={field.state.meta.errors} />
								</Field>
							)}
						</form.Field>
					</FieldGroup>

					<DialogFooter>
						<form.Subscribe>
							{(state) => (
								<Button
									type="submit"
									form="add-project-form"
									disabled={!state.canSubmit || state.isSubmitting}
								>
									{state.isSubmitting ? <Loader /> : "Add"}
								</Button>
							)}
						</form.Subscribe>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
}
