// Kill-Switch für den Service Worker der alten App (vite-plugin-pwa,
// Standard-Pfad "/sw.js", Scope "/" - lief bis zum Rückbau der Scaleway-
// Infrastruktur unter genau dieser Domain). Geräte, die die alte PWA
// installiert hatten, laden sonst dauerhaft den gecachten alten App-Shell
// statt dieser Rückblick-Seite, weil der Browser erst bei einer neuen
// sw.js-Datei unter demselben Pfad überhaupt ein Update prüft. Diese
// Datei ersetzt den alten Service Worker, räumt alle Caches auf, meldet
// sich selbst ab und lädt die Seite danach neu - ab dann läuft kein
// Service Worker mehr, und der Browser lädt ganz normal von hier.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((c) => c.navigate(c.url));
    })(),
  );
});
