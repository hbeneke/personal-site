const CACHE_NAME = "portfolio-v1";
const urlsToCache = [
	"/",
	"/fonts/JetBrainsMono-Regular.woff2",
	"/fonts/JetBrainsMono-Bold.woff2",
	"/favicon.svg",
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
	);
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) {
				return response;
			}
			return fetch(event.request);
		}),
	);
});
