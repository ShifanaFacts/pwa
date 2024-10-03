class OwnObjectStore {

    constructor() {
        this.objectStore = {};
    }

    storeDataSet(payload) {
        this.objectStore[payload.dataSetName] = payload.data;
    }

    storeDataSetField(payload) {
        let fieldDataset = { ...this.objectStore[payload.dataSetName], [payload.fieldName]: payload.data };
        //added !payload.keepfield condition to it to consider keepfield=true and restrict deleting field
        if (!payload.keepfield && payload.data == null) delete fieldDataset[payload.fieldName];

        this.storeDataSet({
            dataSetName: payload.dataSetName,
            data: fieldDataset
        });

    }

    mergeDataSet(payload) {
        let mergedData = { ...this.objectStore[payload.dataSetName], ...payload.data };
        this.objectStore[payload.dataSetName] = mergedData;
    }

    mergeDataSetArray(payload) {
        let replaceIndex = (payload.index != null && payload.index >= 0) ? payload.index : undefined;
        let mergedData = null;
        if (payload.mode === "updatecol") {
            let returnArray = [];
            for (let arObj of this.objectStore[payload.dataSetName]) {
                returnArray.push({ ...arObj, ...payload.data });
            }
            mergedData = returnArray;
        }
        else if (payload.mode === "array2array"){
            mergedData = [...this.objectStore[payload.dataSetName], ...payload.data ];
        }
        else {

            let item = (replaceIndex >= 0 && replaceIndex < this.objectStore[payload.dataSetName].length ? this.objectStore[payload.dataSetName][replaceIndex] : {});
            if (payload.data) {
                if (typeof payload.data === "string") item = payload.data; //if its string do not explode it
                else item = { ...item, ...payload.data };
            }
            else item = undefined; // to delete to happen

            if (item) { //If item is not null, its an edit or add 
                mergedData = [...this.objectStore[payload.dataSetName].slice(0, replaceIndex), item,
                ...(replaceIndex != undefined ? this.objectStore[payload.dataSetName].slice(replaceIndex + 1) : [])];
            }
            else { //if data specified is null its supposed to be a delete
                mergedData = [...this.objectStore[payload.dataSetName].slice(0, replaceIndex),
                ...(replaceIndex != undefined ? this.objectStore[payload.dataSetName].slice(replaceIndex + 1) : [])];
            }
        }
        this.objectStore[payload.dataSetName] = mergedData;

    }

    getDataSet(dataSetName) {
        if (!dataSetName) return null;
        return this.objectStore[dataSetName];
    }
    getFullDataSet() {
        return this.objectStore;
    }
}

export const ownObject = new OwnObjectStore(); 