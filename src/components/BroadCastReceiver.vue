<template>
  <div>
    <h1>Reciever</h1>
    <span>get Content -> {{ text }}</span>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, ref } from "vue";

export default {
  setup() {
    const state = reactive({
      count: 0,
    });

    const text = ref("");

    onMounted(() => {
      const bc = new BroadcastChannel("page1");

      bc.onmessage = function (e) {
        text.value = e.data;
      };
    });

    return {
      ...toRefs(state),
      text,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>