<template>
  <div>
    <button @click="startQuery">开始轮询</button>
    <button @click="stopQuery">停止轮询</button>
  </div>
</template>

<script>
import { initStoreMixin } from "../mixin";

export default {
  data() {
    return {
      timer: null,
    };
  },
  mixins: [initStoreMixin("PD_DB", "pd_test_store")],
  mounted() {
    this.openStore().then(() => {
      this.startQuery();
    });
  },
  unmounted() {
    this.stopQuery();
  },
  methods: {
    startQuery() {
      this.stopQuery();
      this.timer = setInterval(() => {
        this.query("pd-test")
          .then((data) => {
            console.log(data.data.content);
          })
          .catch((e) => {
            console.log(e);
          });
      }, 1000);
    },
    stopQuery() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>