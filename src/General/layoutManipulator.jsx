class LayoutManipulator{
    traverseArray(arr, path, propkey){
        for(let i = 0; i < arr.length; i++){ 
            let newPath =  path; 
            // if( ["sect", "div", "btn", "icbtn", "icon", "span", "list", "btn", "entry"].includes(arr[i].type)){
             
                newPath =  newPath + "." + i.toString(); 

                if(!arr[i].props) arr[i].props = {}; 
                // let currentClassName = arr[i].props.className?? ""; 
                // if(!currentClassName.includes("dz-ctr"))
                //     arr[i].props.className = currentClassName + " dz-ctr"; 
                // if(["icbtn", "entry", "btn", "tmpick", "dtpick"].includes(arr[i].type ))
                //     arr[i].props.className += " dz-noclick"; 
                arr[i].props["data-ctr-class"] = "dz-ctr"; 
                arr[i].props["data-ctr-title"] = arr[i].type; 
                arr[i].props["data-ctr-path"] =newPath;
                arr[i].props["data-ctr-child"] = "chld";
                if(typeof arr[i] === "object")
                    [arr[i], newPath] =  this.traverseObject(arr[i], newPath); 
            // }
            
           
                
        }
        return [arr, path]; 
    }
    traverseObject(obj, path){
        let newPath  = path ; 

        let obKeys = Object.keys(obj); 
        for(let ob of obKeys){
            // if(ob === "whenclick"){ 
            //     delete obj[ob]; 
            //     continue; 
            // }
 
            if(ob === "chld")
            {
                newPath = path + "." + ob; 
                if(Array.isArray(obj[ob])) [obj[ob], newPath] =  this.traverseArray(obj[ob],newPath, ob); 
            }
            else if( obj[ob]  && typeof obj[ob] === "object") [obj[ob], newPath] =  this.traverseObject(obj[ob], newPath); 
        }
        return [obj, newPath]; 
    }
    neutralize(inp, path){

        if(inp){ 
            if(Array.isArray(inp))  [inp, path] = this.traverseArray(inp,path, "chld");
            else if(typeof inp === "object") [inp, path] =  this.traverseObject(inp, path); 
             return inp; 
        }
    }

    stuffScaffLayout(layoutJSON){
        let pattern = /<<loadscaff[:]([0-9A-Za-z-_]{2,})[/]([0-9A-Za-z-_]{2,})[/]([0-9A-Za-z-_]{2,})>>/g; 
        let layoutStuffs = layoutJSON?.match(pattern); 
        for(let stuff in layoutStuffs){
            layoutJSON =  layoutJSON.replaceAll(stuff, "[]")
        }

        // matches <<loadscaff:_page/double-column-view/layout>>

    }
     
}
export default LayoutManipulator; 