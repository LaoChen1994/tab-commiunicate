<template>
  <div>
    <h1>LocalStorage Getter</h1>
    <span>text -> {{ text }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const text = ref("");

onMounted(() => {
  console.log("init");
  window.addEventListener("storage", (e) => {
    if (e.key === 'pd-test') {
      text.value = e.newValue;
    }
  });
});
</script>

<style lang="css" scoped>
</style>