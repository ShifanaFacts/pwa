class StorageService {

  getJsonValue(key, sourceStorage = null) {
    if (!sourceStorage) sourceStorage = this._getStorage();
    let storageValue = sourceStorage.getItem(key);
    if (storageValue) {
      let jsonValue = decodeURIComponent(escape(window.atob(storageValue))); ;
      if (jsonValue) {
        let finalValue = JSON.parse(jsonValue);
        if (finalValue) return finalValue;
      }
    }
    return null;
  }
 
  setJsonValue(key, data, sourceStorage = null) {
    if (data && key) {
      if (!sourceStorage) sourceStorage = this._getStorage();

      let jsonValue = JSON.stringify(data);
      if (jsonValue) {
        let finalValue = btoa(unescape(encodeURIComponent(jsonValue)))  ;
        if (finalValue) {
          sourceStorage.setItem(key, finalValue);
        }
      }
    }
  }

  clearStorage(key) {
    let sourceStorage = this._getStorage();
    sourceStorage.removeItem(key);
  }

  _getStorage() {
    let storeType = localStorage.getItem("_stgType");
    if (storeType && storeType === "pers") {
      return localStorage;
    }
    return sessionStorage;
  }

  setStatePersistance(shouldPersist) {
    if (shouldPersist) localStorage.setItem("_stgType", "pers")
    else localStorage.setItem("_stgType", "nopers")
  }

}

export default StorageService; 