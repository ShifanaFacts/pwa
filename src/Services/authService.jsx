import HttpService from "./httpService";
import { authStorageKey, userDetailsStorageKey, userMenuStorageKey, apiRoot, authMethode } from "../General/globals";
import StorageService from './storageService';
import ServiceBase from './_serviceBase'
import { authLogin, authLogout, hideAppBusy } from "../AppOwnState";
import { ownStore } from "../AppOwnState/ownState";
// import Axios from "axios";

class AuthService extends ServiceBase {

  constructor(authPath, authBody) {
    super();
    this.authPath = authPath;
    this.authBody = authBody;
  }

  async login(client_id, client_secret, remember_me) {
    let eCS = encodeURIComponent(client_secret)

    let requestBody = `grant_type=${this.authBody.grant_type}&hash_method=${this.authBody.hash_method}&job_id=${this.authBody.job_id}&client_id=${client_id}&client_secret=${eCS}`;

    let headers = {};
    headers['Content-Type'] = 'application/x-www-form-urlencoded';

    let json = await new HttpService().postServer(apiRoot, this.authPath, headers, requestBody);
    let fullURL = apiRoot + this.authPath; 
    json =  await this.manageOfflineData(undefined, { fullURL, requestBody}, json);

    if (json && json.access_token) {
      let stService = new StorageService();
      stService.setStatePersistance(remember_me);
      stService.setJsonValue(authStorageKey,
        {
          at: json.access_token,
          tt: json.token_type,
          ei: json.expires_in
        });
    }
    else {
      console.log('Login Failed');
    }
  }

  async logout() {
    let [currentToken, isTokenNeeded] = this.getStoredToken(); 

    if (currentToken || !isTokenNeeded) {
      await this.loadFromServer(this.authBody.job_id, 'PWA.UserLogout', currentToken?.at, { 'info': currentToken?.at });
    }
    let stService = new StorageService();
    stService.clearStorage(authStorageKey);
    stService.clearStorage(userDetailsStorageKey);
    stService.clearStorage(userMenuStorageKey);
    // SetCreateDataSet({ dset: "pageinfo" }, null);
    ownStore.dispatch(authLogout()); //Redux


  }

  async SSOlogin(client_id,client_secret) {

    let requestBody = `grant_type=${this.authBody.grant_type}&source=SSO&hash_method=${this.authBody.hash_method}&job_id=${this.authBody.job_id}&client_id=${client_id}&client_secret=${client_secret}`;

    let headers = {};
    headers['Content-Type'] = 'application/x-www-form-urlencoded';

    let json = await new HttpService().postServer(apiRoot, this.authPath, headers, requestBody);
    let fullURL = apiRoot + this.authPath; 
    json =  await this.manageOfflineData(undefined, { fullURL, requestBody}, json);

    if (json && json.access_token) {
      let stService = new StorageService();
      stService.setJsonValue(authStorageKey,
        {
          at: json.access_token,
          tt: json.token_type,
          ei: json.expires_in
        });
    }
    else {
      console.log('Login Failed');
    }
  }

  getStoredToken(){
    if(authMethode === "cookie") return [null, false]; //Cookie Authentication; No token needed
    else{ 
      let currentToken = new StorageService().getJsonValue(authStorageKey);
      return [currentToken, true]; 
    }
  }

  async verifyLogin() {
    let [currentToken, isTokenNeeded] = this.getStoredToken(); 

    if (isTokenNeeded && !currentToken) return null;
    let json = await this.loadFromServer(this.authBody.job_id, 'PWA.VerifyAuth', currentToken?.at, { 'info': currentToken?.at });
    if (json && json.length > 0 && json[0].status === "true")
       return {status: true, doNext: json[0].doNext};
    return {status:false};
  }

  async continueLogin(){ //Seeperated from Main logic  for Two factor Authentication
      let _userDetails = await this.getCurrentUserDetails();
      if (!_userDetails) throw new Error("No Such User!");
      await this.loadUserSpecificMenu(_userDetails.userrole);

      ownStore.dispatch(authLogin()); //Redux
      ownStore.dispatch(hideAppBusy());
   
  }

  async getCurrentUserDetails() {
    let userDetails = await this.loadUserDetails();

    if (userDetails && userDetails.length > 0) {
        new StorageService().setJsonValue(userDetailsStorageKey, userDetails[0]);
        return userDetails[0];
    }
    return null;
}

  async loadUserDetails() {
    let [currentToken, isTokenNeeded] = this.getStoredToken(); 

    if (isTokenNeeded && !currentToken) return null;
    return await this.loadFromServer(this.authBody.job_id, 'PWA.GetUserDetails', currentToken?.at, { 'info': currentToken?.at });
  }

  
  async loadUserSpecificMenu(_userrole) {
    let _userMenu = await this.loadUserMenu({ userrole: _userrole });
    new StorageService().setJsonValue(userMenuStorageKey, _userMenu);

    // if (userDetails && userDetails.length > 0) {
    //     new StorageService().setJsonValue(userDetailsStorageKey, userDetails[0]);
    //     return true;
    // }
    // return false;
}
  async loadUserMenu(userRole) {
    let [currentToken, isTokenNeeded] = this.getStoredToken(); 

    if (isTokenNeeded && !currentToken) return null;
    return await this.loadFromServer(this.authBody.job_id, 'PWA.GetUserMenu', currentToken?.at, { 'info': userRole });
  }

}

export default AuthService; 