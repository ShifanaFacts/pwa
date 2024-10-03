import HttpService from "./httpService";
 
import OfflineService from "./offlineService";
 
import { procPath, reportPath, xlUploadPath, xlTempPath, uploadPath, fileDownloadPath, apiRoot, uploadRoot, unProcPath, isOffline } from "../General/globals";
 
class ServiceBase {
 
  async loadFromFileURL(fileURL) {
    let httpSvc = new HttpService();
 
    let json = await httpSvc.downloadFile(fileURL);
    // return json;
    let fileURLAbs = fileURL.split("?")[0]
    return await this.manageOfflineData(true, { fileURLAbs }, json);
 
  }
 
  async loadFromServer(job_id, procKey, accessToken, dataToSend, resultType, controllerName, offlineAccess) {
 
    let httpSvc = new HttpService();
    let headers = httpSvc.getCommonHeaders(accessToken);
    let requestBody = httpSvc.getProcPostBodyString(job_id, procKey, dataToSend, resultType);
    let apiURL = apiRoot;
    let endPoint = procPath;
    if (resultType === "report" 
          | resultType === "excelupload"
          | resultType === "exceltemplate"
          | resultType === "filedownload")  {

      if(resultType === "report"){
        endPoint = reportPath; //using different endpoint api/report for downloading report data
      }
      
      if(resultType === "excelupload"){
        endPoint = xlUploadPath; //
      }
      
      if(resultType === "exceltemplate"){
        endPoint = xlTempPath; //
      }
      
      if(resultType === "filedownload"){
        endPoint = fileDownloadPath; //
      }
  
      if (controllerName !== "unproc" &&
        controllerName !== "proc" &&
        typeof controllerName !== "undefined") {
          
        apiURL = controllerName;
        endPoint = "";
      }
    }    
    else if (controllerName === "unproc") endPoint = unProcPath;
    else if (controllerName === "proc") endPoint = procPath;
    else if (typeof controllerName !== "undefined") {
      apiURL = controllerName;
      endPoint = "";
    }

    let json = await httpSvc.postServer(apiURL, endPoint, headers, requestBody);
    let fullURL = apiURL + endPoint;
    return await this.manageOfflineData(offlineAccess, { fullURL, job_id, procKey, data: dataToSend, resultType }, json);
 
  }
 
  manageOfflineData(offlineAccess, requestBody, responseData) {
    return new Promise(resolve => {
 
      if (typeof offlineAccess === "undefined") offlineAccess = isOffline;
      // console.log(requestBody); 
      if (requestBody.data && requestBody.data.info && typeof requestBody.data.info === "object") {
        requestBody.data.info.geolat = null;
        requestBody.data.info.geolong = null;
      }
      if (offlineAccess) { //TODO 
        if (responseData.statusCode == 0) {
          // return offlineData; 
          //return jsonData if offlineData not found
          resolve(new OfflineService().resolveOffline(requestBody, responseData, 'get'));
          return;
        }
        else {
          new OfflineService().resolveOffline(requestBody, responseData, 'save');
          // save json for offline use later (asynchronous)
        }
 
      }
      resolve(responseData);
 
    });
 
  }
 
  async sendFileToServer(job_id, accessToken, dataToSend) {
    let httpSvc = new HttpService();
    let headers = httpSvc.getCommonHeaders(accessToken);
    let requestBody = httpSvc.getFilePostBodyString(job_id, dataToSend);
 
    let json = await httpSvc.postServer(uploadRoot, uploadPath, headers, requestBody);
    return json;
  }
 
}
 
export default ServiceBase;