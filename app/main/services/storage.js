/**
 * Storage Factory
 * @author Kais Elouragini
 * @email kais.elouragini@proxym-it.com
 * @company Proxym-IT (www.proxym-it.com)
 */
angular.module('Storage', [])
    .factory('Storage', ['$window', '$q', '$log', 'loader', function ($window, $q, $log, loader) {
        // This works on all devices/browsers, and uses IndexedDBShim as a final fallback
        var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

        var DBNAME = "DefaultDB";
        var DBVER = 1;

        // Custom Object to store
        var objectToStore = "services";
        var dataKey = "key";
        var dataValue = "value";

        /**
         * Open Database
         * @returns promise
         */
        openDB = function () {
            var dfd = $q.defer();
            try {
                if(typeof db == "undefined" || !db){
                    var request = indexedDB.open(DBNAME, DBVER);
                    request.onupgradeneeded = function (e) {
                        $log.info("Storage : Upgrading DB...");
                        var thisDB = e.target.result;
                        var store = null;

                        if (!thisDB.objectStoreNames.contains(objectToStore)) {
                            // create objectStore as keyPath="id"
                            store = thisDB.createObjectStore(objectToStore, {
                                keyPath: dataKey
                            });
                        }
                    };
                    request.onsuccess = function (e) {
                        $log.info("Storage : Open DB success!");
                        db = e.target.result;
                        dfd.resolve(db);
                    };
                    request.onerror = function (e) {
                        dfd.reject();
                        $log.error("Storage : Open DB error");
                    };
                }else{
                    dfd.resolve(db);
                }
            } catch (e) {
                dfd.reject();
                $log.error("Storage : ", e);
            }
            return dfd.promise;
        };

        /**
         * Add a new key, value which is not already added
         * @param object
         * @returns {*}
         */
        add = function (o) {
            var dfd = $q.defer();
            try {
                openDB().then(function(db){
                    var tx = db.transaction([objectToStore], "readwrite");
                    var store = tx.objectStore(objectToStore);
                    // add 'created' param
                    //o.lastUpdated = new Date();
                    // add to store
                    var request = store.add(o);
                    request.onsuccess = function (e) {
                        dfd.resolve(o);
                        $log.info("Storage : Add data to storage success! ", o);
                    };
                    request.onerror = function (e) {
                        dfd.reject();
                        $log.error("Storage : Add data failed!", e.target.error.name, e.target.error.message);
                    };
                }, function(){
                    dfd.reject();
                });
            } catch (e) {
                dfd.reject();
                $log.error("Storage : ", e);
            }
            return dfd.promise;
        };

        /**
         * Return the value of a key already exists
         * @param key
         * @returns deferred
         */
        get = function (key) {
            var dfd = $q.defer();
            try {
                openDB().then(function(db) {
                    var tx = db.transaction([objectToStore], "readonly");
                    var store = tx.objectStore(objectToStore);
                    var request = store.get(key);
                    request.onsuccess = function (e) {
                        try{
                            if(typeof e.target != "undefined" && typeof e.target.result != "undefined" && typeof e.target.result.value != "undefined" && e.target.result.value){
                                dfd.resolve(e.target.result.value);
                            }else{
                                dfd.reject();
                            }
                        }catch(e){
                            dfd.reject();
                            $log.error("Storage : ", e);
                        }
                    };
                }, function(){
                    dfd.reject();
                });
            } catch (e) {
                dfd.reject();
                $log.error("Storage : ", e);
            }
            return dfd.promise;
        };

        /**
         * Retrieve all keys and values
         * @returns {*}
         */
        getAll = function () {
            var dfd = $q.defer();
            try {
                openDB().then(function(db) {
                    var tx = db.transaction([objectToStore], "readonly");
                    var objectStore = tx.objectStore(objectToStore);
                    var cursor = objectStore.openCursor();
                    cursor.onsuccess = function (e) {
                        var res = e.target.result;
                        dfd.resolve(res);
                        if (res) {
                            $log.info("Storage : key ", res.key);
                            $log.info("Storage : value ", res.value);
                            res.continue();
                        }
                    };
                }, function(){
                    dfd.reject();
                });
            } catch (e) {
                dfd.reject();
                $log.error("Storage : ", e);
            }
            return dfd.promise;
        };

        /**
         * Remove by key
         * @param key
         * @returns {*}
         */
        remove = function (key) {
            var dfd = $q.defer();
            try {
                openDB().then(function(db) {
                    var tx = db.transaction([objectToStore], "readwrite");
                    var store = tx.objectStore(objectToStore);

                    var request = store.delete(key);
                    // var request = store.clear(); // delete all from the store

                    request.onsuccess = function (e) {
                        dfd.resolve();
                        // calls even when nothing to remove.
                        $log.info("Storage : removeByKey success! ", key);
                    };

                    request.onerror = function (e) {
                        dfd.reject();
                        $log.error("Storage : removeByKey error!", key);
                    };
                }, function(){
                    dfd.reject();
                });
            } catch (e) {
                dfd.reject();
                $log.error("Storage : ", e);
            }
            return dfd.promise;
        };

        /**
         * Add / Update by key
         * @param key
         * @param value
         * @returns deferred
         */
        set = function (key, value) {
            var dfd = $q.defer();
            try {
                openDB().then(function(db) {
                    var tx = db.transaction([objectToStore], "readwrite");
                    var store = tx.objectStore(objectToStore);

                    value.timestamp = new Date().getTime();
                    store.get(key).onsuccess = function (e) {
                        $log.info("Storage : store.get", key);

                        try{
                            var dataReturned = e.target.result;
                            if (!dataReturned) {
                                //$log.warn("Storage : nothing matched.");
                                add({key: key, value: value}).then(function(d){
                                    dfd.resolve();
                                }, function(){
                                    dfd.reject();
                                });
                                return;
                            }
                        }catch(e){}

                        var request = store.put({key: key, value: value});

                        request.onsuccess = function (e) {
                            dfd.resolve();
                            $log.info("Storage : put success!");
                        };

                        request.onerror = function (e) {
                            dfd.reject();
                            $log.error("Storage : put error!");
                        };
                    };
                }, function(){
                    dfd.reject();
                });
            } catch (e) {
                dfd.reject();
                $log.error("Storage : ", e);
            }
            return dfd.promise;
        };

        /**
         * Delete Database by name
         * @param dbname
         * @returns {*}
         */
        deleteDB = function (dbname) {
            var dfd = $q.defer();
            try {
                openDB().then(function(db) {
                    var request = indexedDB.deleteDatabase(dbname);
                    request.onsuccess = function (e) {
                        dfd.resolve();
                        $log.info("Storage : deleteDB success!");
                    };
                    request.onerror = function (e) {
                        dfd.reject();
                        $log.error("Storage : deleteDB error!");
                    };
                }, function(){
                    dfd.reject();
                });
            } catch (e) {
                dfd.reject();
                $log.error("Storage : ", e);
            }
            return dfd.promise;
        };

        // Initiate the storage
        //openDB();

        return {
            openDB: openDB,
            set: set,
            get: get,
            getAll: getAll,
            remove: remove,
            deleteDB: deleteDB
        };

    }]
);