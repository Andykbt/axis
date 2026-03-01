import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Flex } from "@/components/flex";
import { NotFoundComponent } from "@/components/not-found";
import { Page, PageHeader, PageTitle } from "@/components/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { projectQuery } from "@/functions/get-project";
import { type WebVitalRow, webVitalsQuery } from "@/functions/get-web-vitals";

// Thresholds (plan): LCP ≤2.5s good, >4s poor; INP ≤200ms good, >500ms poor; CLS ≤0.1 good, >0.25 poor; TTFB ≤800ms good, >1800ms poor
const THRESHOLDS: Record<
	string,
	{ good: number; poor: number; unit: "ms" | "s" | "decimal" }
> = {
	LCP: { good: 2500, poor: 4000, unit: "ms" },
	INP: { good: 200, poor: 500, unit: "ms" },
	TTFB: { good: 800, poor: 1800, unit: "ms" },
	CLS: { good: 0.1, poor: 0.25, unit: "decimal" }, // value in DB is real * 1000
};

type Rating = "good" | "needs-improvement" | "poor";

function getRatingFromValue(metric: string, value: number): Rating {
	const t = THRESHOLDS[metric];
	if (!t) return "needs-improvement";
	const v = metric === "CLS" ? value / 1000 : value;
	if (v <= t.good) return "good";
	if (v > t.poor) return "poor";
	return "needs-improvement";
}

function p75(values: number[]): number {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	const i = Math.ceil(0.75 * sorted.length) - 1;
	return sorted[Math.max(0, i)] ?? 0;
}

function formatValue(metric: string, value: number): string {
	const t = THRESHOLDS[metric];
	if (!t) return String(value);
	if (t.unit === "decimal") return (value / 1000).toFixed(2);
	if (value >= 1000) return `${(value / 1000).toFixed(1)} s`;
	return `${Math.round(value)} ms`;
}

const METRIC_LABELS: Record<string, string> = {
	LCP: "Largest Contentful Paint",
	INP: "Interaction to Next Paint",
	CLS: "Cumulative Layout Shift",
	TTFB: "Time to First Byte",
};

type MetricStats = {
	p75: number;
	good: number;
	needsImprovement: number;
	poor: number;
	count: number;
};

function aggregateWebVitals(rows: WebVitalRow[]): Record<string, MetricStats> {
	const byMetric: Record<string, { values: number[]; ratings: Rating[] }> = {};

	for (const row of rows) {
		const m = row.metric ?? "unknown";
		if (m === "unknown" || row.value == null) {
			continue;
		}

		if (!byMetric[m]) byMetric[m] = { values: [], ratings: [] };
		byMetric[m].values.push(row.value);
		const rating = (row.rating as Rating) ?? getRatingFromValue(m, row.value);
		byMetric[m].ratings.push(rating);
	}

	const out: Record<string, MetricStats> = {};

	for (const [metric, { values, ratings }] of Object.entries(byMetric)) {
		const good = ratings.filter((r) => r === "good").length;
		const poor = ratings.filter((r) => r === "poor").length;
		const needsImprovement = ratings.length - good - poor;
		out[metric] = {
			p75: p75(values),
			good,
			needsImprovement,
			poor,
			count: values.length,
		};
	}
	return out;
}

export const Route = createFileRoute("/dashboard/$projectId/performance")({
	loader: async ({ context, params }) => {
		const project = await context.queryClient.ensureQueryData(
			projectQuery(params.projectId),
		);

		if (!project) {
			throw notFound();
		}

		await context.queryClient.ensureQueryData(webVitalsQuery(params.projectId));

		return { project };
	},
	pendingComponent: PendingComponent,
	component: RouteComponent,
	notFoundComponent: NotFoundComponent,
});

function RouteComponent() {
	const projectId = Route.useParams().projectId!;

	const { data: project } = useSuspenseQuery(projectQuery(projectId));

	const { data } = useSuspenseQuery(webVitalsQuery(projectId));
	const rows: WebVitalRow[] = Array.isArray(data) ? data : [];

	const stats = useMemo(() => aggregateWebVitals(rows), [rows]);
	const hasData = rows.length > 0;
	const metricOrder = ["LCP", "INP", "CLS", "TTFB"];

	if (!project) throw notFound();

	return (
		<Page>
			<PageHeader>
				<Flex justify="between">
					<PageTitle>Performance</PageTitle>
				</Flex>
			</PageHeader>

			{!hasData && (
				<Card variant="border">
					<CardContent className="py-8 text-center text-muted-foreground text-sm">
						No web vitals data yet. Data is sent automatically when your project
						uses the Axis SDK.
					</CardContent>
				</Card>
			)}

			{hasData && (
				<div className="grid grid-cols-2 border md:grid-cols-4">
					{metricOrder.map((metric) => {
						const s = stats[metric];
						if (!s) return null;
						const rating: Rating =
							s.count > 0
								? getRatingFromValue(metric, s.p75)
								: "needs-improvement";
						return (
							<Card key={metric} variant="border">
								<CardHeader>
									<CardTitle className="text-muted-foreground text-xs">
										{METRIC_LABELS[metric] ?? metric}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="font-mono text-lg tabular-nums">
										{formatValue(metric, s.p75)}
									</div>

									{rating === "good" && <Badge>Good</Badge>}

									{rating === "needs-improvement" && (
										<Badge variant="default">Needs improvement</Badge>
									)}

									{rating === "poor" && <Badge variant="default">Poor</Badge>}
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}
		</Page>
	);
}

function PendingComponent() {
	return (
		<Page>
			<PageHeader>
				<PageTitle>Performance</PageTitle>
			</PageHeader>
			<Skeleton className="h-16" />
			<Skeleton className="h-48" />
		</Page>
	);
}
