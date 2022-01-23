<template>
  <div>
    <h1>InnoDB Sender</h1>
    <button @click="handleSave">Save</button>
  </div>
</template>

<script>
import { initStoreMixin } from "../mixin";

export default {
  data() {
    return {
      store: null,
      db: null,
    };
  },
  mixins: [initStoreMixin("PD_DB", "pd_test_store")],
  async mounted() {
    this.db = await this.openStore();
  },
  methods: {
    handleSave() {
      console.log("save");
      this.saveData("pd-test", {
        type: "test",
        content: "pd-data" + Math.random(),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>