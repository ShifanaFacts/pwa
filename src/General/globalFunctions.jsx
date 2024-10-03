import { SetCreateDataSet, MergeDataSet } from "./commonFunctions";
import { disableLocation } from "../General/globals";


export const GPSLocation = async (options) => {
    if(disableLocation)
    {}
    else 
    { 
        await navigator.geolocation.getCurrentPosition(
            position => {
                localStorage.setItem("devloc", JSON.stringify({
                    lat: position.coords.latitude,
                    long: position.coords.longitude
                }));
            },
            error => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        localStorage.removeItem("devloc");
                        ShowSnackBar("warning", "Please enable location on your device!");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        localStorage.removeItem("devloc");
                        ShowSnackBar("Location: Not Available!");
                        break;
                    case error.TIMEOUT:
                        localStorage.removeItem("devloc");
                        ShowSnackBar("Location: Request Timed Out!");
                        break;
                    case error.UNKNOWN_ERROR:
                        console.log("Location: Unknown Error!");
                        break;
                    default: break;
                }
    
            }, 
            options
        );
    }
    
}

export function ShowSnackBar(type, message) {
    HideSnackBar();
    SetCreateDataSet(
        { "dset": "snackinfo" },
        {
            "open": true,
            "type": type,
            "message": message
        }
    );
}

export function HideSnackBar() {
    MergeDataSet(
        { "dset": "snackinfo" },
        {
            "open": false
        }
    );
}

export function ShowAppNotification(notiArgs) {
    SetCreateDataSet(
        { "dset": "notifyinfo" },
        {
            "open": true,
            "dset": notiArgs?.dset,
            "args": notiArgs?.args
        }
    );
}

export function HideAppNotification() {
    MergeDataSet(
        { "dset": "notifyinfo" },
        {
            "open": false
        }
    );
}

export function ShowAppMenu(anchorEl, items, layout, title, refData) {
    SetCreateDataSet(
        { "dset": "menuinfo" },
        {
            "open": true,
            "anchor": anchorEl,
            "layout": layout,
            "items": items,
            "title": title,
            "refdata": refData
        }
    );
}

export function HideAppMenu() {
    MergeDataSet(
        { "dset": "menuinfo" },
        {
            "open": false
        }
    );
}


export function ShowDialog(title, description, btn1, btn2) {
    SetCreateDataSet(
        { "dset": "dialoginfo" },
        {
            "open": true,
            "title": title,
            "description": description,
            "btn1": btn1,
            "btn2": btn2
        }
    );
}

export function HideDialog() {
    MergeDataSet(
        { "dset": "dialoginfo" },
        {
            "open": false
        }
    );
}


export function DownloadFileFromState(dsDownloadInfo) {
    SetCreateDataSet({ "dset": "downloadinfo" }, null); //Turning off downloadInfo dataset to prevent multiple executions

    const linkSource = (dsDownloadInfo.mime ?? "") + (dsDownloadInfo.base64 ?? "");
    if (dsDownloadInfo.preview) {
        // window.open(linkSource, '_blank', 'fullscreen=yes');
        let pdfWindow = window.open("", '_blank');
        // pdfWindow.document.write(
        //     "<iframe width='100%' height='100%' src='" + linkSource + "'></iframe>");
        // pdfWindow.document.write(
        //     `<embed   type='application/pdf' width='100%' height='100%' src='${linkSource}'>
        //         <iframe src = 'https://docs.google.com/viewer?&embedded=true' ></iframe>
        //     </embed>`);
        pdfWindow.document.write(
            `<script src="/xtrascripts/pdfviewer/pdfobject.min.js"></script>
            <div id="example1"></div>
            <script>PDFObject.embed("${linkSource}", "#example1");</script>`);
    }
    else {
        // const downloadLink = document.createElement('a');
        // document.body.appendChild(downloadLink);

        // downloadLink.href = linkSource;
        // downloadLink.target = '_self';
        // downloadLink.download = (dsDownloadInfo.filename ?? "Document");
        // downloadLink.click();
        // document.body.removeChild(downloadLink);
        window.location = linkSource;
    }
}