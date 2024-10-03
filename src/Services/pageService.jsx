import ServiceBase from "./_serviceBase";
import StorageService from "./storageService";
import { authMethode, authStorageKey } from "../General/globals";


class PageService extends ServiceBase {

    constructor(authBody) {
        super();
        this.authBody = authBody;
    }

    async loadData(procKey, action_args, resultType, controllerName, offlineAccess) {
        let currentToken = new StorageService().getJsonValue(authStorageKey);
        // if (!currentToken && controllerName !== "unproc") return null;
        return await this.loadFromServer(this.authBody.job_id, procKey, currentToken?.at, { info: action_args }, resultType, controllerName, offlineAccess);

    }

    async uploadFile(data) { //Untested; To contact the file processing end of API; Maybe the loadData function is enough
        let currentToken = new StorageService().getJsonValue(authStorageKey);
        if (!currentToken && authMethode !== "cookie") return null;
        return await this.sendFileToServer(this.authBody.job_id, currentToken.at, (typeof data == 'object' ? { info: data } : { info: { filedata: data } } ) );

    }
}

export default PageService;