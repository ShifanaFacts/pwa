import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './mui4migrate.css';
import { initGlobalValues, setSWRegistration, setNotifPermission } from './General/globals';
import ServiceBase from './Services/_serviceBase';
// import { AppStart } from './AppStart';
// import { ServiceWorkerProvider } from './useServiceWorker';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import App from './App';
import { RemoveLastDialog } from './General/commonFunctions';
import 'devextreme/dist/css/dx.light.css';
import 'devexpress-gantt/dist/dx-gantt.css';


async function startApp() {
    let _serviceBase = new ServiceBase();
    let appOptions = await _serviceBase.loadFromFileURL("init.json?ver=" + new Date().toISOString());
    let _offLayout = await _serviceBase.loadFromFileURL("offline.json?ver=" + new Date().toISOString());

    initGlobalValues(appOptions, _offLayout);

    ReactDOM.render(
        // <ServiceWorkerProvider>
        <App />
        // </ServiceWorkerProvider>
        , document.getElementById('root'));

}

  
// The below code is to prevent users pressing back button accidentally, that lets the application to close. 
// (function preventBackButton() {
//     window.addEventListener('load', function () {
//         window.history.pushState({}, '')
//     });

//     window.addEventListener('popstate', function () {
//         window.history.pushState({}, '')
//     });
// })();

startApp();

window.addEventListener('load', () => window.history.pushState({}, ''));
window.addEventListener('popstate', (e) => RemoveLastDialog(e));

serviceWorkerRegistration.register({
  onUpdate: registration => {
    const waitingServiceWorker = registration.waiting;
    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener("statechange", (event) => {
        if (event.target.state === "activated") {
          window.location.reload();
        }
      });
      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
    }
  },
  // onSuccess: registration => { },
  // onStart: registration => {
  //     const title = 'Simple Title';
  //     const options = {
  //         body: 'Simple piece of body text.\nSecond line of body text :)'
  //     };
  //     registration.showNotification(title, options);
  // }
});
navigator.serviceWorker &&
    navigator.serviceWorker.ready.then(function (registration) {
        //   registration.showNotification('Vibration Sample', {
        //     body: 'Buzz! Buzz!',
        //     icon: '../images/touch/chrome-touch-icon-192x192.png',
        //     vibrate: [200, 100, 200, 100, 200, 100, 200],
        //     tag: 'vibration-sample'
        //   });
        setSWRegistration(registration);
    });


showNotification();



function showNotification() {
    'Notification' in window &&
        Notification.requestPermission(function (result) {
            if (result === 'granted') {
                setNotifPermission(true);
            }
        });
}



