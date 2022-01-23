<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import { RouterView, RouterLink } from "vue-router";
</script>

<template>
  <div>
    <router-link to="/">Broad Channel Sender</router-link>
  </div>
  <div>
    <router-link to="/b1">Broad Channel Reciever</router-link>
  </div>

  <div>
    <router-link to="/s1">Service Worker 1</router-link>
  </div>

  <div>
    <router-link to="/s2">Service Worker 2</router-link>
  </div>

  <div>
    <router-link to="/l1">Local Storage Sender</router-link>
  </div>

  <div>
    <router-link to="/l2">Local Reciever</router-link>
  </div>

  <div>
    <router-link to="/shared_sender">Shared Sender</router-link>
  </div>

  <div>
    <router-link to="/shared_receiver">Shared Reciever</router-link>
  </div>

  <div>
    <router-link to="/index_db_sender">Index DB Sender</router-link>
  </div>

  <div>
    <router-link to="/index_db_receiver">Index DB Receiver</router-link>
  </div>

  <router-view></router-view>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
