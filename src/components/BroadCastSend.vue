<template>
  <div>
    <h1>Sender</h1>
    <button @click="sendMessage">Send Message</button>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, ref } from 'vue'

export default {
  setup () {
    const state = reactive({
      count: 0,
    })
    const bc = ref(null)

    onMounted(() => {
      bc.value = new BroadcastChannel("page1")
    })

    const sendMessage = () => {
      if (bc.value) {
        bc.value.postMessage("this is Page 1, hello")
      }
    }
  
    return {
      ...toRefs(state),
      sendMessage
    }
  }
}
</script>

<style lang="scss" scoped>

</style>