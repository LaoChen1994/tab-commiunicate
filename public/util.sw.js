let data = null;

self.addEventListener("install", function (event) {
  console.log(event);
  event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim()); // Become available to all pages
});

self.addEventListener("message", function (e) {
  console.log("e ->", e);
  e.waitUntil(
    self.clients.matchAll().then((clients) => {
      if (!clients || !clients.length) {
        return;
      }

      console.log("data ->", data);
      data = e.data;
      clients.forEach((client) => {
        client.postMessage(e.data);
      });
    })
  );
});
