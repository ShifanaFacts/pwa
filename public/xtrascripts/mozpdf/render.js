// atob() is used to convert base64 encoded PDF to binary-like data.
// (See also https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/
// Base64_encoding_and_decoding.)

// let urlParams = new URLSearchParams(window.location.search)
var base64Data = '';
var pageNumber = 1, scale = 2, initialScale = 2, printScale = 10;
var maxPages = 1;
var fileName = "download.pdf", mimeType = "data:application/pdf;base64,", 
    documentStyle = "", 
    printStyle =  "width:185mm;" ; 


function renderPDF() {
  return new Promise((resolve, reject) => {
    let pdfData = atob(base64Data);

    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    var pdfjsLib = window['pdfjs-dist/build/pdf'];

    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';

    // Using DocumentInitParameters object to load binary data.
    var loadingTask = pdfjsLib.getDocument({ data: pdfData });
    loadingTask.promise.then(function (pdf) {
      console.log('PDF loaded');

      // Fetch the first page
      // var pageNumber = 1;
      maxPages = pdf.numPages;
      pdf.getPage(pageNumber).then(function (page) {
        console.log('Page loaded');

        var canvas = document.getElementById('the-canvas');

        var viewport = page.getViewport({ scale: scale });

        // Prepare canvas using PDF page dimensions
        var context = canvas.getContext('2d');
        canvas.height = viewport.height - 2;
        canvas.width = viewport.width;
        // canvas.style.width = (50 * scale) + "%";
        canvas.style = documentStyle; 
        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        var renderTask = page.render(renderContext);
        renderTask.promise.then(function () {
          //Page rendered
          if (resolve) resolve();

        });
        document.getElementById("pageLabel").innerHTML = `Page ${pageNumber} of ${maxPages}`;


      });
    }, function (reason) {
      // PDF loading error
      console.error(reason);
    });
  });
}



async function receiveCall(data, args) {
  base64Data = data;
  pageNumber = 1
  initialScale = args?.scale; 
  scale = args?.scale;
  documentStyle = args?.style ?? "";
  printStyle = args?.printstyle ?? printStyle;
  fileName  = args?.filename ?? "download.pdf";
  mimeType  = args?.mimetype ?? "data:application/pdf;base64,";
  await renderPDF();
}

async function pageNext() {
  if (pageNumber < maxPages) {
    pageNumber++;
    await renderPDF();
  }
}

async function pagePrevious() {
  if (pageNumber > 1) {
    pageNumber--;
    await renderPDF();
  }
}

async function downloadPDF(){
  link = document.createElement('a');
  link.setAttribute('href',mimeType + base64Data);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function zoomIn() {
  scale = scale - 0.5;
  if (scale < 1) scale = 1;
  await renderPDF();
}

function zoomOut() {
  scale = scale + 0.5;
  if (scale > 10) scale = 10;
  renderPDF();
}

async function printCanvas() {
  scale = printScale;
  let printNode = document.getElementById("toPrint");
  printNode.innerHTML = "";
  let pageImageAdded = 0;
  for (let i = 1; i <= maxPages; i++) {
    pageNumber = i;
    await renderPDF();
    let imagePage = document.createElement("img");
    imagePage.style = printStyle; 
    var canvas = document.getElementById('the-canvas');
    imagePage.onload = ()=> {
      pageImageAdded++;
      if (pageImageAdded === maxPages) window.print( );
    }
    imagePage.src = canvas.toDataURL();
    // imagePage.style = "width:" + printWidth; 
    printNode.appendChild(imagePage);
    let pageBreak = document.createElement("br");
    printNode.appendChild(pageBreak);
   
   
  }
  pageNumber = 1;
  await renderPDF(); //Reset
}
