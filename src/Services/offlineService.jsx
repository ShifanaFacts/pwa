import { hashString } from "../General/globals";

class OfflineService {


    resolveOffline(requestBody, responseBody, dbMethod) {
        let addNow = this.addNow;
        let getNow = this.getNow;

        return new Promise(resolve => {


            if (!window.indexedDB) {
                console.log("Your browser doesn't support a stable version of IndexedDB. Offline feature will not be available.");
                return;
            }
            var request = window.indexedDB.open("offlineDB", 1);
            request.onerror = function (event) {
                console.log("No Permission for IndexedDB");
            };
            let requestKey = JSON.stringify(requestBody);
            let responseData = JSON.stringify(responseBody);

            request.onsuccess = function (event) {
                let database = event.target.result;
                if (dbMethod == "save") addNow(database, requestKey, responseData);
                if (dbMethod == "get") getNow(database, requestKey, responseBody, resolve);
            };
            request.onupgradeneeded = function (event) {
                let database = event.target.result;
                database.createObjectStore("requests", { keyPath: "id" });
                var transaction = event.target.transaction;

                transaction.oncomplete =
                    function (event) {
                        if (dbMethod == "save") addNow(database, requestKey, responseData);
                        if (dbMethod == "get") getNow(database, requestKey, responseBody, resolve);

                    };
            };
        });
    }
    getNow(database, requestKey, responseBody, resolveFn) {
        hashString(requestKey).then(hashedKey => {
            var objectStore = database.transaction(["requests"], "readwrite")
                .objectStore("requests");

            var request = objectStore.get(hashedKey);

            request.onerror = function (event) {
                resolveFn(responseBody);
            };

            request.onsuccess = function (event) {

                if (request.result) {
                    let dataJSON = JSON.parse(request.result.data);
                    resolveFn(dataJSON);
                } else {
                    resolveFn(responseBody);
                }
            };
        });  
    }
    async addNow(database, requestKey, responseData) {

        var hashedKey = await hashString(requestKey);  //works only in https 
        var requestStore = await database.transaction(["requests"], "readwrite")
            .objectStore("requests");
        let deleteRequest = await requestStore.delete(hashedKey)
        deleteRequest.onsuccess = function (event) {
            // console.log("OFFLINE_DELETE");
        };

        deleteRequest.onerror = function (event) {
            // console.log("OFFLINE_ERR_DELETE");
        }

        let addRequest = await requestStore.add({ id: hashedKey, data: responseData });

        addRequest.onsuccess = function (event) {
            // console.log("OFFLINE_INSERT");
        };

        addRequest.onerror = function (event) {
            // console.log("OFFLINE_ERR_INSERT");
        }
    }
}

export default OfflineService;