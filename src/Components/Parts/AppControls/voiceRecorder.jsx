import { ownStore } from "../../../AppOwnState/ownState";
// import store from "../../../AppRedux/store";
import { ExecuteLayoutEventMethods } from "../../../General/commonFunctions";

class VoiceRecorder {
 
    generateAudioElement() {
        let audioElement = document.querySelector("#factsPWAAudioPlayer");
        if (!audioElement) {
            audioElement = document.createElement('audio');
            audioElement.style.cssText = 'display:none;';
            audioElement.id = "factsPWAAudioPlayer";
            document.body.appendChild(audioElement);
        }
        audioElement.onplay  = async () =>{
            
            this.releaseAction([{
                    exec: "setdataset",
                    args: {
                        dset: "playinfo",
                        data: { 
                            "status" :  "playing"
                        }
                    }
                }
            ]); 
        } 
        audioElement.onpause  = ()=> this.audioStop() ;
        audioElement.onended  = ()=> this.audioStop() ;
        audioElement.onerror  = ()=> this.audioStop() ;
        return audioElement;
    }
    audioStop(){
        this.releaseAction([{
            exec: "setdataset",
            args: {
                dset: "playinfo",
                data: { 
                    "status" :  "stopped"
                }
            }
        }
    ]); 
    }
     async releaseAction(extraEvents = []) {
        await ExecuteLayoutEventMethods([
            ...extraEvents,
            {
                "exec": "setdataset",
                "args": {
                    "dset": "mediainfo",
                    "data": null
                }
            }]);
    }
 
     async doAction(args) {

        let audioElement = this.generateAudioElement();

        if (args?.action === "startaudio" && args?.data) {
            if(audioElement.paused || audioElement.ended){ 
                audioElement.src = args?.data;
                audioElement.play();
        
            }
        }
        else if (args?.action === "stopaudio") {
    
            audioElement.pause();
      
        }
        else if (args?.action === "startrecord") {
           

            if (!this.mRecorder) {
                this.mediaStreamObj = await navigator.mediaDevices.getUserMedia({ audio: true }); 
                this.mRecorder = new MediaRecorder( this.mediaStreamObj);
            }
            this.mRecorder.onstart = async() => {
 
                await ExecuteLayoutEventMethods([
                    {
                        exec: "setdataset",
                        args: {
                            dset: "recordinfo",
                            data: {
                                "data": null,
                                "starttime" : (new Date()).getTime(), 
                                "duration": 0, 
                                "status" : "recording"
                            }
                        }
                    }
                ]);
                let tout = 120000; 
                if((args?.timeout  ?? 0) > 0 ) tout =  args?.timeout * 1000
                
                setTimeout(async ()=> {
                    await ExecuteLayoutEventMethods([
                        {
                            exec: "setdataset",
                            args: {
                                dset: "mediainfo",
                                data: {
                                    "action": "stoprecord" 
                                }
                            }
                        }
                    ]);
                }, tout); 
              
            }
            this.mRecorder.ondataavailable = function (ev) {
                let reader = new FileReader()
                reader.onloadend = async () => { 
                    let recordStartTime = ownStore.getState("recordinfo")?.starttime; 
                    let elapsedTime = ( (new Date()).getTime() - recordStartTime); 
                    elapsedTime =(elapsedTime/1000).toFixed(3); 
                    await ExecuteLayoutEventMethods([

                        {
                            exec: "setdataset",
                            args: {
                                dset: "recordinfo",
                                data: {
                                    "data":  reader.result,
                                    "duration": elapsedTime, 
                                    "status" :  "stopped"
                                }
                            }
                        }
                    ]);
                }

                reader.readAsDataURL(ev.data);
            }
            this.mRecorder.onstop =  ()=> {
                console.log("recorder stop")
             }
            if (this.mRecorder.state !== "recording") {
                this.mRecorder.start();
            }
        }
        else if (args?.action === "stoprecord") {
            if ( this.mRecorder && this.mRecorder.state !== "inactive" ) {
                this.mRecorder.stop();
            
            }
         }
     
    }
}
export default VoiceRecorder; 