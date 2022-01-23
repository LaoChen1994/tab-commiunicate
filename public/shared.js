let data = null;
self.addEventListener("connect", function (e) {
  const port = e.ports[0];
  port.addEventListener("message", function (event) {
    if (event.data.type === "query") {
      data && port.postMessage(data);
    } else if (event.data.type === "set") {
      const { payload } = event.data;
      data = payload;
    }
  });
  port.start();
});
