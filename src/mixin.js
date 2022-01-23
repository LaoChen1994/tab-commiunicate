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
