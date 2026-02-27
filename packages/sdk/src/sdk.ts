(() => {
	const script = document.currentScript as HTMLScriptElement | null;
	const writeKey = script?.getAttribute("data-write-key");
	const dataApi = script?.getAttribute("data-api");

	if (!writeKey) {
		// FIXME - THROW ERROR
		return;
	}

	const origin =
		dataApi ||
		(script?.src ? new URL(script.src).origin : window.location.origin);
	const ingestUrl = `${origin}/api/ingest`;

	type QueuedEvent = {
		name: string;
		properties: Record<string, unknown>;
		url: string;
		referrer: string;
		title: string;
		timestamp: string;
	};

	const queue: QueuedEvent[] = [];
	let sending = false;

	function sendBatch(): void {
		if (sending || queue.length === 0) return;
		sending = true;
		const batch = queue.splice(0, 50);
		fetch(ingestUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				writeKey,
				events: batch.map((e) => ({
					name: e.name,
					properties: e.properties,
					url: e.url,
					referrer: e.referrer,
					timestamp: e.timestamp,
				})),
			}),
			keepalive: true,
		})
			.then(() => {
				sending = false;
				if (queue.length > 0) sendBatch();
			})
			.catch(() => {
				sending = false;
				queue.unshift(...batch);
			});
	}

	function enqueue(
		name: string,
		properties: Record<string, unknown> = {},
	): void {
		queue.push({
			name,
			properties,
			url: location.href,
			referrer: document.referrer || "",
			title: document.title,
			timestamp: new Date().toISOString(),
		});
		sendBatch();
	}

	// Queue a page view event
	enqueue("page_view", {});

	const pushState = history.pushState;
	history.pushState = function (
		this: History,
		...args: Parameters<typeof history.pushState>
	) {
		pushState.apply(this, args);
		enqueue("page_view", {});
	};
	window.addEventListener("popstate", () => enqueue("page_view", {}));

	(
		window as Window & {
			axis?: (name: string, properties?: Record<string, unknown>) => void;
		}
	).axis = (name: string, properties?: Record<string, unknown>) => {
		if (typeof name === "string") enqueue(name, properties ?? {});
	};

	const start = new Date();
	function sendPageDuration(): void {
		const duration = new Date().getTime() - start.getTime();
		enqueue("page_duration", { duration });
	}

	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "visible") {
			sendPageDuration();
		}
	});
	window.addEventListener("pagehide", () => sendPageDuration());
})();
