import { AppTimer } from "../Components/Parts/AppControls/appTimer";
import VoiceRecorder from "../Components/Parts/AppControls/voiceRecorder";
import AuthService from "../Services/authService";
import PageService from "../Services/pageService";

export let appSWRegistration;
export let appNotifPermission;

export let isOffline = false; 
export let apiRoot;//= 'https://apiquery.factserp.com/'; //'http://localhost:50642/' ; 
export let authPath;//= 'oauth/token';
export let procPath;//= 'api/proc';
export let unProcPath; //= 'api/unproc';

export let authMethode; 

export let uploadRoot;//= 'https://apiquery.factserp.com/'; //'http://localhost:50642/' ; 
export let uploadPath;//= 'api/file';
export let reportPath;//= 'api/report';
export let xlUploadPath;//= 'api/file/excelupload';
export let xlTempPath;//= 'api/file/getexceltemplate';
export let fileDownloadPath;//= 'api/file/getexceltemplate';

export let authBody;// =

export let offlineLayoutInfo;// =

export let debugstate = false; 

export let objVoiceRecorder = new VoiceRecorder(); 
// {
//     grant_type: "client_credentials",
//     hash_method: "1",
//     job_id: "1409"  //"1409(DICETEK)" // "0378(CSH)" 
// };

export let authServiceInstance;
export let pageServiceInstance;

export const authStorageKey = 'aCh';
export const userDetailsStorageKey = 'uD';
export const userMenuStorageKey = "uMe";

export let applicationTitle = "FactsBUD-E";

export let loginImage;//= "res/loginpage.png";
export let loginTitle;//= null;
export let loginDivStyle;//= { "textAlign": "center" };
export let loginBoxStyle;//= { "textAlign": "center" };
export let loginTextStyle;//= { "textAlign": "center" };
export let loginImageStyle;//= { "textAlign": "center" };


export let appTheme;
export let appThemeClass;
export let disableLocation;

export let whenAppLoad;

export let globalTimeZone="";

export function setGlobalTimeZone(passedTimeZone) {
    globalTimeZone = passedTimeZone;
}
export let whenAppInit;
export let themeload;

export let appTitles;

export const appTimer = new AppTimer(); 

// export let appTimerExecs;

export let serverPWAVersion;
export let stylefile = "";
export let appPlatform = "";

export let appDrawerWidth=0;

export function setGlobalDrawerWidth(width) {
    appDrawerWidth = width;
}

export function initGlobalValues(appOptions, _offLayout) {
    if (appOptions?.ver) serverPWAVersion = appOptions?.ver;
    if (appOptions?.debugstate) debugstate = appOptions?.debugstate;

    if (typeof appOptions?.offline !== "undefined") isOffline= appOptions?.offline;

    if (appOptions?.title) applicationTitle = appOptions?.title;
    
    if (appOptions?.stylekey) appPlatform = appOptions?.stylekey

    if (appOptions?.stylekey) stylefile = "basic-" + appOptions?.stylekey +  ".css";
    else stylefile = ""

    if (appOptions?.service?.url) apiRoot = appOptions?.service?.url;
    if (appOptions?.service?.auth) authPath = appOptions?.service?.auth;
    else authPath = "oauth/token"
    

    if (appOptions?.service?.methode) authMethode = appOptions?.service?.methode;
    else authMethode = "token"

    if (appOptions?.service?.proc) procPath = appOptions?.service?.proc;
    else procPath =  "api/proc";

    if (appOptions?.service?.unproc) unProcPath = appOptions?.service?.unproc
    else  unProcPath = "api/unproc";
    
    if (appOptions?.service?.report) reportPath = appOptions?.service?.report;
    if (appOptions?.service?.xlupload) xlUploadPath = appOptions?.service?.xlupload;
    if (appOptions?.service?.xltemplate) xlTempPath = appOptions?.service?.xltemplate;
    if (appOptions?.service?.filedownload) fileDownloadPath = appOptions?.service?.filedownload;

    if (appOptions?.service?.authbody) authBody = appOptions?.service?.authbody;

    if (appOptions?.upload?.url) uploadRoot = appOptions?.upload?.url;
    if (appOptions?.upload?.path) uploadPath = appOptions?.upload?.path;
    
    if (appOptions?.login?.logo) loginImage = appOptions?.login?.logo;
    if (appOptions?.login?.title) loginTitle = appOptions?.login?.title;
    if (appOptions?.login?.align) loginDivStyle = { "textAlign": appOptions?.login?.align  };
    if (appOptions?.login?.boxstyle) loginBoxStyle = appOptions?.login?.boxstyle;
    if (appOptions?.login?.style) loginTextStyle = appOptions?.login?.style ; 
    if (appOptions?.login?.imagestyle) loginImageStyle = appOptions?.login?.imagestyle ; 
    if (appOptions?.theme) appTheme = appOptions?.theme;
    if (appOptions?.theme?.appbarClass) appThemeClass = appOptions?.theme?.appbarClass;
    if (appOptions?.settings) disableLocation = appOptions?.settings?.disableLocation;


    if (appOptions?.whenload) whenAppLoad = appOptions?.whenload;
    if (appOptions?.whenappinit) whenAppInit = appOptions?.whenappinit;
    if (appOptions?.themeload) themeload = appOptions?.themeload;

    if (appOptions?.whentimer) appTimer.appTimerExecs = appOptions?.whentimer;
    if (appOptions?.login?.titles) appTitles = appOptions?.login?.titles;

    authServiceInstance = new AuthService(authPath, authBody);
    pageServiceInstance = new PageService(authBody);
    if(typeof _offLayout?.mainfooter !== "undefined"){
        localStorage.setItem("offlay", JSON.stringify(_offLayout));
        offlineLayoutInfo = _offLayout ; 
    }    
    else{
        offlineLayoutInfo = JSON.parse( localStorage.getItem("offlay"));
    }
}


export function setSWRegistration(registration) {
    appSWRegistration = registration;
}

export function setNotifPermission(permission) {
    appNotifPermission = permission;

}

export const getTZPrefix = () => { //GetTimezonePrefix
    let tz = new Date().getTimezoneOffset();
    tz = Math.abs(tz);
    return ("+" + Math.floor(tz / 60).toFixed(0).padStart(2, 0) + ":" + (tz % 60).toFixed(0).padStart(2, 0));

}

export const hashString = async function(message) {
    if(!crypto?.subtle) return message; 
    const msgUint8 = new TextEncoder().encode(message);                           
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);           
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); 
    return hashHex;
  }
   

  export const getUniqueID = () => {
    return ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, c =>
        (((c ^ crypto.getRandomValues(new Uint8Array(1))[0]) & 15) >> c / 4).toString(16)
    );
}
