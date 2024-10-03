// import { apiRoot } from '../General/globals';
 
class HttpService {

    async downloadFile(fileURL) {
        console.log(fileURL); 
        try {
            let promise = await fetch(fileURL);
            if (promise.ok) {
                
                let json = await promise.json();
//Test
                // let promiseClone = promise.clone();  //to be used before promise.json
                // var cache = await caches.open('offlay'); 
                // await cache.put(fileURL, promiseClone);
//Test
                return json;
            }
            return {"type":"FactsInternalException","status":false, statusCode: promise.status, "description":"Check your network connection!"}; 

        }
        catch{
         }

        return {"type":"FactsInternalException","status":false, statusCode: 0, "description":"Check your network connection!"}; 
    }

    async postServer(apiRoot, endPoint, headers, body) {

        let postURL = apiRoot + endPoint;
        let fetchOptions = {
            method: "POST",
            cache: 'no-store',
            headers: headers,
            body: body,
            credentials: 'include'
        };

        try {
            let promise = await fetch(postURL, fetchOptions);
            if (promise.ok) {
                let json = await promise.json();
                return json;
            }
            return {"type":"FactsInternalException","status":false, statusCode: promise.status, "description":"Check your network connection!"}; 
        }
        catch {
          }
        return {"type":"FactsInternalException","status":false, statusCode: 0, "description":"Check your network connection!"}; 

    }

    getCommonHeaders(accessToken) {
        let headers = {};
        headers['Content-Type'] = 'application/json';
        headers['Authorization'] = 'Bearer ' + accessToken;
        return headers;
    }

    getProcPostBodyString(job_id, key, data, result_type) {
        if (!result_type) result_type = "single";
        let requestBody = JSON.stringify({
            job_id, key, data, result_type
        });
        return requestBody;
    }

    getFilePostBodyString(job_id, data) {
        let requestBody = JSON.stringify({
            job_id, data
        });
        return requestBody;
    }
}

export default HttpService; 