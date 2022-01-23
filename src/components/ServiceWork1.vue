<template>
  <div>service worker 1</div>
  <button @click="sendMessage">send Message</button>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  navigator.serviceWorker.register("util.sw.js").then(() => {
    console.log("register is ok");
  });

  navigator.serviceWorker.addEventListener("message", (e) => {
    console.log("sw1 -> ", e.data);
  });
});

const sendMessage = () => {
  navigator.serviceWorker.controller.postMessage("page 1");
};
</script>

<style lang="scss" scoped>
</style>