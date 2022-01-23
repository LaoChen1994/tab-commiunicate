<template>
  <div>
    <h1>Shared Worker Sender</h1>
    <button @click="send">Send</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shadredWorker: new SharedWorker("shared.js"),
    };
  },
  mounted() {
    this.shadredWorker.port.start();
  },
  methods: {
    send() {
      this.shadredWorker.port.postMessage({
        type: "set",
        payload: { name: "LOL", company: "Tencent" },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>