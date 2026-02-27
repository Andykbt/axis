import { Link } from "@tanstack/react-router";
import { Page } from "./page";
import { Button } from "./ui/button";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";

export function NotFoundComponent() {
	return (
		<Page className="justify-center">
			<Card variant="border" className="gap-4 text-center">
				<CardHeader>
					<CardTitle className="font-bold text-2xl">
						Oops! Page not found
					</CardTitle>
				</CardHeader>

				<CardContent className="flex flex-col items-center gap-16">
					<CardDescription>
						The page you are looking for does not exist.
					</CardDescription>
				</CardContent>

				<CardFooter className="flex flex-row justify-end gap-2">
					<Button onClick={() => window.history.back()}>Go back</Button>

					<Button>
						<Link to="/dashboard">Back to dashboard</Link>
					</Button>
				</CardFooter>
			</Card>
		</Page>
	);
}
