<template>
  <div>
    <h1>LocalStorage Sender</h1>
    <button @click="changeStorage">change storage</button>
  </div>
</template>

<script setup>
const changeStorage = () => {
  console.log("storage");
  localStorage.setItem("pd-test", Math.random());
};
</script>

<style lang="css" scoped>
</style>