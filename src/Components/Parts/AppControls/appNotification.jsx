import { appSWRegistration, appNotifPermission } from "../../../General/globals";
import { HideAppNotification } from "../../../General/globalFunctions";
import { getProcessedArgs } from "../../../General/commonFunctions";
import { ownStore } from "../../../AppOwnState/ownState";
// import store from "../../../AppRedux/store";

export default function appNotification(notifyInfo) {

    if (notifyInfo?.open && appNotifPermission && appSWRegistration && notifyInfo?.args) {
        let refData = null;
        if (notifyInfo?.dset)
            refData = ownStore.getState(notifyInfo?.dset); 
        if (refData && Array.isArray(refData)) {
            refData.forEach(t => {
                let notiArgs = getProcessedArgs(notifyInfo?.args, t);
                showNotif(notiArgs);
            });

        }
        else {
            let notiArgs = getProcessedArgs(notifyInfo?.args, refData);
            showNotif(notiArgs);
        }
    }

    function showNotif(notiArgs) {
        if (notiArgs?.body) {
            const options = {
                body: notiArgs?.body,
                icon: notiArgs?.icon || '/res/logo.png'
            };
            appSWRegistration.showNotification(notiArgs?.title || "FactsBUD-E", options);
            HideAppNotification();
        }
    }

}
