import { ExecuteLayoutEventMethods } from "../../../General/commonFunctions";
import { appTimerExecs } from "../../../General/globals";

export class AppTimer {
    constructor(){
        this.appTimerExecs = null; 
        this.pageTimerExecs = null;
        this.popupTimerExecs = null;
        this.idleTimer = 0; 
        this.timerSeconds = 0 ; 
        this.isAuthenticated = false ; 
    }


    runTimer(){
        this.idleReset(); 
        this.timerSeconds = 0;

        this.timeInterval = setInterval(() => {
          if (this.isAuthenticated) {
            this.executeTimerFunctions(this.appTimerExecs); //*Execute timer functions of App; Need to pass it from UserDetails
    
            this.executeTimerFunctions(this.pageTimerExecs); //*Execute timer functions of Loaded Page
            this.executeTimerFunctions(this.popupTimerExecs); //*Execute timer functions of Loaded Popup
            this.timerSeconds++;
            this.idleTimer++;
          }
    
          if (this.idleTimer >= 86400) this.idleTimer = 0;  //*Resetting idleTimer every 24 hours just to prevent overflow exception
          if (this.timerSeconds >= 86400) this.timerSeconds = 0;  //*Resetting TimerSeconds every 24 hours just to prevent overflow exception
    
        }, 1000);
    
    }

    
    executeTimerFunctions(timerFunctions) {
        if (timerFunctions) {

        for (let tfn of timerFunctions) {
            if (this.timerSeconds % tfn?.interval === 0) {
            ExecuteLayoutEventMethods(tfn.tasks, null, null, true);
            }
        }
        }
    };


    idleReset() { //*To reset idleTimer on mousemove; To be used later; Need to add it along with timer functions
        document.addEventListener("mousemove", () => this.idleTimer = 0);
    }

}