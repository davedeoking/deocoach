// DeoCoach service worker: installable app that keeps working on a weak connection. API calls always go to the network.
const VER = "dc-v1.5.0";
// On the forwarding domains (.org/.app) the app must not run offline: remove this worker and its caches so the server can forward visitors to www.deocoach.com.
const HOME = /(^|\.)deocoach\.com$|vercel\.app$|^localhost$|^127\./.test(location.hostname);
if (!HOME) { self.addEventListener("install", () => self.skipWaiting()); self.addEventListener("activate", (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.map((k) => caches.delete(k)))).then(() => self.registration.unregister()).then(() => self.clients.matchAll()).then((cs) => cs.forEach((c) => c.navigate(c.url))))); }
const SHELL = ["/", "/manifest.json", "/brand/crest.png", "/icon-192.png", "/icon-512.png"];
if (HOME) self.addEventListener("install", (e) => { e.waitUntil(caches.open(VER).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
if (HOME) self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VER).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  if (!HOME) return;
  const r = e.request; if (r.method !== "GET") return; const u = new URL(r.url);
  if (u.origin === location.origin && u.pathname.startsWith("/api/")) return;
  if (r.mode === "navigate" || (u.origin === location.origin && (u.pathname === "/" || u.pathname.endsWith(".html")))) {
    e.respondWith(fetch(r).then((res) => { if (res.type === "opaqueredirect" || res.redirected) return res; const cp = res.clone(); caches.open(VER).then((c) => c.put("/", cp)); return res; }).catch(() => caches.match("/")));
    return;
  }
  if (u.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) {
    e.respondWith(caches.match(r).then((hit) => { const net = fetch(r).then((res) => { if (res && (res.ok || res.type === "opaque")) { const cp = res.clone(); caches.open(VER).then((c) => c.put(r, cp)); } return res; }).catch(() => hit); return hit || net; }));
  }
});
