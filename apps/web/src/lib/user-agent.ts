type ParsedUserAgent = {
	browser: string;
	browserVersion: string | null;
	os: string;
	osVersion: string | null;
	mobile: boolean;
};

export function parseUserAgent(userAgent: string) {
	const parsedUserAgent: ParsedUserAgent = {
		browser: "Unknown",
		browserVersion: null,
		os: "Unknown",
		osVersion: null,
		mobile: false,
	};

	if (userAgent === "") {
		return parsedUserAgent;
	}

	// Browser (order matters: check Edge/Edg before Chrome, etc.)
	const browserPatterns: [RegExp, string][] = [
		[/Edg\/([^\s]+)/i, "Edge"],
		[/OPR\/([^\s]+)/i, "Opera"],
		[/Chrome\/([^\s]+)/i, "Chrome"],
		[/Firefox\/([^\s]+)/i, "Firefox"],
		[/Safari\/([^\s]+)/i, "Safari"],
		[/Version\/([^\s]+).*Safari/i, "Safari"], // Safari version
		[/MSIE\s([^;]+)/i, "IE"],
		[/Trident\/.*rv:([^)]+)/i, "IE"],
	];

	for (const [re, name] of browserPatterns) {
		const m = userAgent.match(re);
		if (m) {
			parsedUserAgent.browser = name;
			parsedUserAgent.browserVersion = m[1] ?? null;
			break;
		}
	}

	// OS
	const osPatterns: [RegExp, string][] = [
		[/Windows/i, "Windows"],
		[/Mac/i, "Mac"],
		[/Linux/i, "Linux"],
		[/Android/i, "Android"],
		[/iOS/i, "iOS"],
	];

	for (const [re, name] of osPatterns) {
		const m = userAgent.match(re);
		if (m) {
			parsedUserAgent.os = name;
			parsedUserAgent.osVersion = m[1] ?? null;
			break;
		}
	}

	// OS
	if (/\bWindows NT 10\.0\b/i.test(userAgent)) {
		parsedUserAgent.os = "Windows";
		parsedUserAgent.osVersion = "10/11";
	} else if (/\bWindows NT 6\.3\b/i.test(userAgent))
		parsedUserAgent.os = "Windows 8.1";
	else if (/\bWindows NT 6\.2\b/i.test(userAgent))
		parsedUserAgent.os = "Windows 8";
	else if (/\bWindows NT 6\.1\b/i.test(userAgent))
		parsedUserAgent.os = "Windows 7";
	else if (/\bWindows\b/i.test(userAgent)) parsedUserAgent.os = "Windows";
	else if (/\bMac OS X (\d+[._]\d+[._]?\d*)/i.test(userAgent)) {
		parsedUserAgent.os = "macOS";
		const m = userAgent.match(/Mac OS X (\d+[._]\d+[._]?\d*)/i);
		parsedUserAgent.osVersion = m ? m[1].replace("_", ".") : null;
	} else if (/\bMac OS X\b/i.test(userAgent)) parsedUserAgent.os = "macOS";
	else if (/\b(iPad|iPhone|iPod)\b/i.test(userAgent)) {
		parsedUserAgent.os = "iOS";
		parsedUserAgent.mobile = true;
		const m = userAgent.match(/OS (\d+[._]\d+[._]?\d*)/);
		parsedUserAgent.osVersion = m ? m[1].replace(/_/g, ".") : null;
	} else if (/\bAndroid\b/i.test(userAgent)) {
		parsedUserAgent.os = "Android";
		parsedUserAgent.mobile = true;
		const m = userAgent.match(/Android (\d+\.?\d*\.?\d*)/);
		parsedUserAgent.osVersion = m ? m[1] : null;
	} else if (/\bLinux\b/i.test(userAgent)) parsedUserAgent.os = "Linux";
	else if (/\bCrOS\b/i.test(userAgent)) parsedUserAgent.os = "Chrome OS";

	if (
		!parsedUserAgent.mobile &&
		/\b(Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)\b/i.test(
			userAgent,
		)
	) {
		parsedUserAgent.mobile = true;
	}

	return parsedUserAgent;
}
