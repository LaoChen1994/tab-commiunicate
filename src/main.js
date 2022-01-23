import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";
import BroadCastSend from "./components/BroadCastSend.vue";
import BroadCastReciever from "./components/BroadCastReceiver.vue";
import ServiceWork1 from "./components/ServiceWork1.vue";
import ServiceWork2 from "./components/ServiceWork2.vue";

import LocalStorageSender from "./components/LocalStorageSender.vue";
import LocalStorageReciever from "./components/LocalStorageReciever.vue";

import SharedSender from "./components/SharedWorkerSend.vue";
import SharedReceiver from "./components/SharedWorkerReceiver.vue";

import IndexDBSender from "./components/IndexDBSender.vue";
import IndexDBReceiver from "./components/IndexDBReceiver.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: BroadCastSend,
    },
    {
      path: "/b1",
      component: BroadCastReciever,
    },
    {
      path: "/s1",
      component: ServiceWork1,
    },
    {
      path: "/s2",
      component: ServiceWork2,
    },
    {
      path: "/l1",
      component: LocalStorageSender,
    },
    {
      path: "/l2",
      component: LocalStorageReciever,
    },
    {
      path: "/shared_sender",
      component: SharedSender,
    },
    {
      path: "/shared_receiver",
      component: SharedReceiver,
    },
    {
      path: "/index_db_sender",
      component: IndexDBSender,
    },
    {
      path: "/index_db_receiver",
      component: IndexDBReceiver,
    },
  ],
});

createApp(App).use(router).mount("#app");
