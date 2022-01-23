# 跨页面通信的方法

## 前言

+ 目前主要跨标签页面的方式有三种：
    + 广播模式：通过中间一个消息站，向注册（监听消息）的所有客户端发送消息
    + 共享存储 + 轮询：



## 1. 广播模式

广播模式的消息站主要包括`BroadCast Channel`和`LocalStorage`

### 1.1 BroadCast 使用案例

**操作步骤**：

1. 通过一个唯一key来创建一个消息通道，这里类似MQ里面的topic
2. 消费方只需要监听对应topic的消息然后做相应的操作就行

```vue
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
      // 通过唯一的key发布一个消息通道
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
```

```vue
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
      // 创建需要监听的消息通道  
      const bc = new BroadcastChannel("page1");

      // 监听到消息做相应的操作
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
```



### 1.2 使用Service Work来实现中间站

**如何调试service work代码？**

+ 进入浏览器调试页面[chrome inspect](chrome://inspect/#service-workers)
+ 进入service workers后打开有注册service workers的页面
+ 在`chrome inspect`中点击`inspect`进入service worker的调试页面
+ 这个时候可以打开service woker的工作台，你就可以快乐console.log啦



**具体步骤**

1.  在接收方侧注册一个脚本，用来处理servicework的消息事件
2. service work的脚本在监听到消息的时候，向下面注册的`clients`透传发送消息
3. 发送方通过`postMessage`方法来向servicework推消息



**碰到的坑**

`navigator.serviceWorker.controller`一直是null，这样的话建议在service work的脚本中加入以下代码

```javascript
self.addEventListener("message", function (e) {
  e.waitUntil(
    self.clients.matchAll().then((clients) => {
      if (!clients || !clients.length) {
        return;
      }

      clients.forEach((client) => {
        client.postMessage(e.data);
      });
    })
  );
});

self.addEventListener("install", function (event) {
  event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim()); // Become available to all pages
});

```

**代码实现**

```vue
<template>
  <div>service worker 1</div>
  <button @click="sendMessage">send Message</button>
</template>

<script setup>
const sendMessage = () => {
  navigator.serviceWorker.controller.postMessage("page 1");
};
</script>

<style lang="scss" scoped>
</style>
```

```vue
<template>
  <div>service worker 2</div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  navigator.serviceWorker.register("util.sw.js").then(function () {
    console.log("install");
  });
  // 接受监听service worker的信息
  navigator.serviceWorker.addEventListener("message", function (e) {
    console.log("e -> ", e.data);
  });
});
</script>

<style lang="scss" scoped>
</style>
```



```javascript
// util.sw.js
self.addEventListener("message", function (e) {
  console.log("e ->", e);
  e.waitUntil(
    self.clients.matchAll().then((clients) => {
      if (!clients || !clients.length) {
        return;
      }

      clients.forEach((client) => {
        client.postMessage(e.data);
      });
    })
  );
});
```

### 1.3 使用localStorage

**主要步骤**

+ 利用浏览器在`localStorage`变化的时候会有`storage`事件
+ 发送方通过`localStorage.setItem`来更改相关的`key`，监听`storage`事件，通过判断key来实现相关的数据传输

```vue
<template>
  <div>
    <h1>LocalStorage Sender</h1>
    <button @click="changeStorage">change storage</button>
  </div>
</template>

<script setup>
const changeStorage = () => {
  // 直接设置相关的localStorage
  localStorage.setItem("pd-test", Math.random());
};
</script>

<style lang="css" scoped>
</style>
```

```vue
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
  window.addEventListener("storage", (e) => {
    // 监听相关的key是否变化了
    if (e.key === 'pd-test') {
      text.value = e.newValue;
    }
  });
});
</script>

<style lang="css" scoped>
</style>
```





## 2. 轮询 + 存储共享模式



### 2.1 Shared Worker

和service worker不同的是Shared Worker不同标签页之间的数据是可以共享的，所以可以将几个tab之间的数据都放在公共的Store中（Shared Worker），之后分别监听这个data的变化，就可以实现跨标签页之间的数据共享了



**主要步骤**

1. 和service worker一样编写一个shared.js的脚本，通过`SharedWorker`进行注册
2. 发送方通过`sharedworker.port.postMessage`发送消息
3. 接收方通过监听`message`消息获取消息（这里需要接收方轮询查询数据，然后自己判断数据是否改变）



**代码实现**

```javascript
// 这个data是所有sharedWorker共享的

let data = null;
self.addEventListener("connect", function (e) {
  const port = e.ports[0];
  port.addEventListener("message", function (event) {
    if (event.data.type === "query") {
      data && port.postMessage(data);
    } else if (event.data.type === "set") {
      const { payload } = event.data;
      data = payload;
    }
  });
  port.start();
});
```

```vue
<template>
  <div>
    <h1>Shared Worker Sender</h1>
    <button @click="send">Send</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shadredWorker: new SharedWorker("shared.js"),
    };
  },
  mounted() {
    this.shadredWorker.port.start();
  },
  methods: {
    send() {
      // 需要改变数据的时候，通过postMessage通知sharedWorker变更就行，类似vuex里面的action
      this.shadredWorker.port.postMessage({
        type: "set",
        payload: { name: "LOL", company: "Tencent" },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
```

```vue
<template>
  <div>
    <h1>Shared Worker</h1>
    <span>text -> {{ data.name }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      timer: null,
    };
  },
  mounted() {
    const sharedWorker = new SharedWorker("shared.js");

    sharedWorker.port.addEventListener("message", (e) => {
      // 轮询完由sharedWorker来发送给接收方参考，数据是否改变了
      const data = e.data;
      this.data = data;
    });

    sharedWorker.port.start();

    this.timer = setInterval(() => {
      if (sharedWorker) {
        // 轮询数据
        sharedWorker.port.postMessage({
          type: "query",
        });
      }
    }, 1000);
  },
  unmounted() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
```



### 2.2 使用IndexedDB

目前我们需要的只是一个地方能存数据，然后通过轮询的方式进行查询即可。

**操作步骤**

1. 发送者，直接更新相关Indexed中的字段
2. 接收者，不断轮询查询对应IndexedDB中的字段，并观察数据变化即可



IndexDB入门教程可以参考：[阮一峰浏览器数据库IndexedDB入门教程](http://www.ruanyifeng.com/blog/2018/07/indexeddb.html)

**具体实现**

1. 一个操作IndexedDB的mixin

   ```javascript
   export const initStoreMixin = (dbName, storeName) => ({
     data() {
       return {
         dbName,
         storeName,
         db: null,
       };
     },
     methods: {
       openStore() {
         return new Promise((resolve, reject) => {
           const rlt = window.indexedDB.open(this.dbName, 2);
           rlt.onerror = reject;
           rlt.onsuccess = (e) => {
             const db = e.target.result;
             this.db = db;
             resolve(db);
           };
           rlt.onupgradeneeded = (e) => {
             const db = e.target.result;
             console.log(db);
             const storeName = this.storeName;
             // 数据库不存在的时候需要创建库的同时创建相关的表，也就是我们的Store
             if (e.oldVersion === 0 && !db.objectStoreNames.contains(storeName)) {
               const store = db.createObjectStore(storeName);
               // 第二个参数是主键
               store.createIndex(storeName + "Index", "tag", { unique: false });
             }
   
             this.db = db;
             resolve(db);
           };
         });
       },
       saveData(key, data, db = this.db) {
         return new Promise((resolve, reject) => {
           if (!db) return reject();
   
           const tx = db.transaction(this.storeName, "readwrite");
           const store = tx.objectStore(this.storeName);
           // tag是主键
           const result = store.put({ tag: key, data });
   
           result.onsuccess = () => resolve(db);
           result.onerror = () => reject;
         });
       },
       query(key, db = this.db) {
         return new Promise((res, rej) => {
           if (!db) {
             return rej();
           }
           const tx = db.transaction(this.storeName, "readonly");
           const store = tx.objectStore(this.storeName);
           // 根据主键进行查询
           const dbRequest = store.get(key);
   
           dbRequest.onsuccess = (e) => res(e.target.result);
           dbRequest.onerror = rej;
         });
       },
     },
   });
   
   ```

2. 发送者通过PUT更新数据库数据

   ```vue
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
     mounted() {
       this.openStore();
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
   ```

3. 接收者轮询即可

   ```vue
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
   ```

   

## 3. 跨域标签同步

上面介绍的都是同域场景的跨标签页面，那么不同域有哪些方案呢？

1. 后端websocket由服务端推送变更，这种方式可以实现跨标签页
2. 使用iframe，然后iframe和宿主进行通信，之后由宿主使用上面的同域方法进行操作



