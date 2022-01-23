<template>
  <div>service worker 2</div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  navigator.serviceWorker.register("util.sw.js").then(function () {
    console.log("install");
  });
  navigator.serviceWorker.addEventListener("message", function (e) {
    console.log("e -> ", e.data);
  });
});
</script>

<style lang="scss" scoped>
</style>