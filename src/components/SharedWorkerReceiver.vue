<template>
  <div>
    <h1>Shared Worker</h1>
    <span>text -> {{ data.name }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      timer: null,
    };
  },
  mounted() {
    const sharedWorker = new SharedWorker("shared.js");

    sharedWorker.port.addEventListener("message", (e) => {
      const data = e.data;
      this.data = data;
    });

    sharedWorker.port.start();

    this.timer = setInterval(() => {
      if (sharedWorker) {
        sharedWorker.port.postMessage({
          type: "query",
        });
      }
    }, 1000);
  },
  unmounted() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>

<style lang="scss" scoped>
</style>