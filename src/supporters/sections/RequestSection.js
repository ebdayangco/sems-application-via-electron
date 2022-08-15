const fs = require('fs');
const { errorScreen } = require('./MessageLoadingSection');
class RequestSection{
    
    constructor(){}

    wordSimilarity(s1, s2) {
        var longer = s1;
        var shorter = s2;
        if (s1.length < s2.length) {
          longer = s2;
          shorter = s1;
        }
        var longerLength = longer.length;
        if (longerLength == 0) {
          return 1.0;
        }

        return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
      }
  
    editDistance(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();
  
        var costs = new Array();
        for (var i = 0; i <= s1.length; i++) {
          var lastValue = i;
          for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
              costs[j] = j;
            else {
              if (j > 0) {
                var newValue = costs[j - 1];
                if (s1.charAt(i - 1) != s2.charAt(j - 1))
                  newValue = Math.min(Math.min(newValue, lastValue),
                    costs[j]) + 1;
                costs[j - 1] = lastValue;
                lastValue = newValue;
              }
            }
          }
          if (i > 0)
            costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }

    validateFields(options){

        const messages = [];

        options.forEach(valid => {
            
            switch(valid.type){
                case "empty":
                    this.isEmptyField(valid.name,valid.field) ? messages.push(valid.message):"";
                    break;
                case "exist":
                    valid.isExist() ? messages.push(valid.message):"";
                    break;
                case "compare":
                    !this.isAllTheSame(valid.names,valid.fields) ? messages.push(valid.message):"";
                    
            }

        });

        return {
            success:messages.length == 0,
            messages
        }

    }
    isEmptyField(name,fieldtype){

         if(fieldtype == "text"){
             return $(name).val() == "";
         }else{
             return false;
         }
   
    }
    isAllTheSame(names,fields){

        const values = [];

        names.forEach((name,i)=>{

            if(fields[i] == "text"){
                values.push($(name).val());
            }
           

        });

        return values.every( (val, i, arr) => val === arr[0]) ;

    }
    readJSON(jsonPath,callback){

        if(callback){
            fs.readFile(jsonPath,'utf-8',function(err,data){
                if(err){
                    
                    errorScreen("Cannot read JSON file","Cannot read JSON file");
                }else{
                    callback(data);
                }
            });
        }else{
            return fs.readFileSync(jsonPath,'utf-8');
        }

        return null;
    }
    writeJSON(jsonPath,data,callback){

        if(callback){

            fs.writeFile(jsonPath,data,'utf-8',function(err){
                callback();
                // if(err){ 
                //     errorScreen("Cannot edit JSON file","Cannot edit JSON file");
                // }else{
                //     callback();
                // }
            })
        }
        else{
            fs.writeFileSync(jsonPath,data,'utf-8');
            return true;
        }
        
        return false;
    }

    getContent(path,callback){
        
        if(callback){
            fs.readFile(path,'utf-8',function(err,data){
                if(err){
                    errorScreen(err,'Error on getting the content of this path:'+path);
                }else{
                    callback(data);
                }
            });
        }else{
            return fs.readFileSync(path,'utf-8');
        }

        return null;
    }

    displayOn(container,content){
        $(container).prepend(content);
    }

    getOnDate(strDate){

        const d = strDate ? new Date(strDate):new Date();
        const year = d.getFullYear();
        let month = d.getMonth() + 1;
        let date = d.getDate();
        date = date <= 9 ?`0${date}`:date;
        month = month <= 9 ?`0${month}`:month;

        return `${year}-${month}-${date}`;
    }

    getNormalDate(dateof){
            
            let date = new Date(dateof);
            date = date.toString();
            date = new Date(date);

            let month = date.getMonth()+1;
            let day = date.getDate();
            let year = date.getFullYear();
            month = this.getMonth(month);
            day = day <= 9 ?`0${day}`:day;
           
        return `${month} ${day}, ${year}`;
    }

    getMonth(monthnum){
        // console.log(monthnum);
        switch(monthnum){
            case 1: return 'January'; break;
            case 2: return 'February'; break;
            case 3: return 'March'; break;
            case 4: return 'April'; break;
            case 5: return 'May'; break;
            case 6: return 'June'; break;
            case 7: return 'July'; break;
            case 8: return 'August'; break;
            case 9: return 'September'; break;
            case 10: return 'October'; break;
            case 11: return 'November'; break;
            case 12: return 'December'; break;
            default: return null; break;
        }
    }
    getDistinctObject(arrobjs,fieldname){

        let distinctval = [];
        let distinctarr = [];
        arrobjs.forEach(obj=>{
            let val = obj[fieldname];
            if(!distinctval.includes(val)){
                // console.log(obj);
                distinctarr.push(obj);
                distinctval.push(val);
            }
        });

        return distinctarr;

    }

    liveDateAndTime() {
        // create Date object for current location
        var d = new Date();
        let offset ='+1';
       
        // convert to msec
        // subtract local time zone offset
        // get UTC time in msec
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

        // create new Date object for different city
        // using supplied offset
        var nd = new Date(utc + (3600000*offset));

        // return time as a string
        var s = nd.getSeconds();
        var i = nd.getMinutes();
        var h = nd.getHours();
        var cDate =  nd.getDate();
        var m =  nd.getUTCMonth();
        var y = nd.getFullYear();

       var liveDateAndTime = nd.toDateString() + " "+ (Number(h)-1)+":"+i+':'+s
        return liveDateAndTime;

    }

    addTime(format,timeLengthVal,d){

        let newDate = "0001-01-01";

        function addDays(theDate, days) {
            days++;
            return new Date(theDate.getTime() + days*24*60*60*1000);
        }

        const date = new Date(d);

        if(format == "year"){
            date.setDate(date.getDate()+1);
            date.setFullYear(date.getFullYear() + parseInt(timeLengthVal));
            newDate = this.getOnDate(date.toDateString());
        }
        if(format == "month"){
            date.setDate(date.getDate()+1);
            date.setMonth(date.getMonth() + parseInt(timeLengthVal));
            newDate = this.getOnDate(date.toDateString());

        }
        if(format == "day"){
           
            newDate = this.getOnDate(addDays(date,timeLengthVal).toDateString());

        }

        return newDate;

    }

    toDateTimeString(dateOf){

        const d = new Date(dateOf);
        const day = d.getDate()+1;
        const month = d.getMonth()+1;
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;

    }

    createAutoComplete(inp,arr,field_based,getSelected){


        $(inp).wrap(`<div class="autocomplete w-100"></div>`);
        $(inp).parent().wrap(`<form autocomplete="off" class="w-100"></form>`);

        var currentFocus;
        
        
        $(inp).on("input",function(e){

            const mainThis = $(this);
            let val = mainThis.val();
            mainThis.siblings(".autocomplete-items").remove();
            currentFocus = -1;


            const box = $(`<div class="autocomplete-items" 
            id="${this.id}autocomplete-list"></div>`);
            
            

            for (let i = 0; i < arr.length; i++) {
                const valueLook = arr[i][field_based]?arr[i][field_based]:""; 

                if (valueLook.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    const item = $(`<div class="autocomplete-item-row"><strong>
                    ${valueLook.substr(0, val.length)}</strong>${valueLook.substr(val.length)} 
                    <input type='hidden' class='auto-complete-field' value='${valueLook}'></div>`);
                    item.data("whole",arr[i]);
                    
                    box.append(item);
                    item.on('click',function(){
                            const itemThis = $(this);
                            
                            mainThis.val(itemThis.children(".auto-complete-field").val());
                            getSelected(itemThis.data("whole"));
                            mainThis.siblings(".autocomplete-items").remove();
                    });

                    mainThis.on("keydown",function(e){

                        const lists = $(`${this.id}autocomplete-list`).children(":first-child");
                        const next = lists.next();
                        next.addClass("autocomplete-active");

                            

                           
                    });


                    function addActive(x) {
                        /*a function to classify an item as "active":*/
                        if (!x) return false;
                        /*start by removing the "active" class on all items:*/
                        removeActive(x);
                        if (currentFocus >= x.length) currentFocus = 0;
                        if (currentFocus < 0) currentFocus = (x.length - 1);
                        /*add class "autocomplete-active":*/
                        x[currentFocus].classList.add("autocomplete-active");
                        
                        
                      }
                      function removeActive(x) {
                        /*a function to remove the "active" class from all autocomplete items:*/
                        for (var i = 0; i < x.length; i++) {
                          x[i].classList.remove("autocomplete-active");
                        }
                      }

                    
                    

                }
               
            }   

            $(this).parent().append(box);
           
            
        });
        

     
        
    }

    setAutoComplete(inp,arr,field_based,getSelected){

        // autocomplete(inp,arr);
        autocompleteAll(inp,arr,field_based);

        function autocompleteAll(inp, arr,field_based) {

            inp = document.getElementById(inp);

            /*the autocomplete function takes two arguments,
            the text field element and an array of possible autocompleted values:*/
            var currentFocus;
            /*execute a function when someone writes in the text field:*/
            inp.addEventListener("input", function(e) {

                var a, b, i, val = this.value;


                inp.style.position = "relative";
                let jacket = null;
                

                /*close any already open lists of autocompleted values*/
                closeAllLists();
                if (!val) { return false;}
                currentFocus = -1;

                /*create a DIV element that will contain the items (values):*/
                // jacket = document.createElement("DIV");
                a = document.createElement("DIV");

                // //assign css to jacket and a
                // jacket.style.position = "relative";
                // a.style.position = "absolute";
                a.setAttribute("id", this.id + "autocomplete-list");
                a.setAttribute("class", "autocomplete-items");


                /*append the DIV element as a child of the autocomplete container:*/
                this.parentNode.appendChild(a);


                /*for each item in the array...*/
                for (i = 0; i < arr.length; i++) {
                  /*check if the item starts with the same letters as the text field value:*/
                  
                  const valueLook = arr[i][field_based]?arr[i][field_based]:""; 
                  if (valueLook.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    b.setAttribute("class", "autocomplete-item-row");

                    // if(assign !="input"){
                    //     b.style.position = "relative";
                    //     b.style.color = "#000 !important";
                    // }
                  
                    b.setAttribute('data-whole',JSON.stringify(arr[i]));
                    
                    /*make the matching letters bold:*/
                    b.innerHTML = "<strong>" + valueLook.substr(0, val.length) + "</strong>";
                    b.innerHTML += valueLook.substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' class='auto-complete-field' value='" + valueLook + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                        b.addEventListener("click", function(e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        getSelected(JSON.parse(this.getAttribute('data-whole')));
                        // inp.addEventListener("keyup");
                       
                        inp.value = this.getElementsByTagName("input")[0].value;
                     
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                  }
                }
            });
            /*execute a function presses a key on the keyboard:*/
        
            inp.addEventListener("keydown", function(e) {
                
                var x = document.getElementById(this.id + "autocomplete-list");
               
                if (x) x = x.getElementsByTagName("div");
                if (e.keyCode == 40) {
                  /*If the arrow DOWN key is pressed,
                  increase the currentFocus variable:*/
                  currentFocus++;
                  /*and and make the current item more visible:*/
                  addActive(x);
                } else if (e.keyCode == 38) { //up
                  /*If the arrow UP key is pressed,
                  decrease the currentFocus variable:*/
                  currentFocus--;
                  /*and and make the current item more visible:*/
                  addActive(x);
                } else if (e.keyCode == 13) {
                  /*If the ENTER key is pressed, prevent the form from being submitted,*/
                  e.preventDefault();
                  if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                  }
                }
            });
            function addActive(x) {
              /*a function to classify an item as "active":*/
              if (!x) return false;
              /*start by removing the "active" class on all items:*/
              removeActive(x);
              if (currentFocus >= x.length) currentFocus = 0;
              if (currentFocus < 0) currentFocus = (x.length - 1);
              /*add class "autocomplete-active":*/
              x[currentFocus].classList.add("autocomplete-active");
              
              
            }
            function removeActive(x) {
              /*a function to remove the "active" class from all autocomplete items:*/
              for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
              }
            }
            function closeAllLists(elmnt) {
              /*close all autocomplete lists in the document,
              except the one passed as an argument:*/
              var x = document.getElementsByClassName("autocomplete-items");
            //   x.style.background = "#000 !important;";
              for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
              }
            }
          }
          /*execute a function when someone clicks in the document:*/
          document.addEventListener("click", function (e) {
              closeAllLists(e.target);
              
          });
        }

        function autocomplete(inp, arr) {

            /*the autocomplete function takes two arguments,
            the text field element and an array of possible autocompleted values:*/
            var currentFocus;
            /*execute a function when someone writes in the text field:*/
            inp.addEventListener("input", function(e) {

                var a, b, i, val = this.value;


                inp.style.position = "relative";
                let jacket = null;
                

                /*close any already open lists of autocompleted values*/
                closeAllLists();
                if (!val) { return false;}
                currentFocus = -1;

                /*create a DIV element that will contain the items (values):*/
                // jacket = document.createElement("DIV");
                a = document.createElement("DIV");

                // //assign css to jacket and a
                // jacket.style.position = "relative";
                // a.style.position = "absolute";

                a.setAttribute("id", this.id + "autocomplete-list");
                a.setAttribute("class", "autocomplete-items");


                /*append the DIV element as a child of the autocomplete container:*/
                this.parentNode.appendChild(a);


                /*for each item in the array...*/
                for (i = 0; i < arr.length; i++) {
                  /*check if the item starts with the same letters as the text field value:*/
                  if (arr[i]['siteName'].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    b.setAttribute("class", "autocomplete-item-row");

                    // if(assign !="input"){
                    //     b.style.position = "relative";
                    //     b.style.color = "#000 !important";
                    // }
                  
                    b.setAttribute('data-whole',JSON.stringify(arr[i]));
                    
                    /*make the matching letters bold:*/
                    b.innerHTML = "<strong>" + arr[i]['siteName'].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i]['siteName'].substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' class='auto-complete-field' value='" + arr[i]['siteName'] + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                        b.addEventListener("click", function(e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        getSelected(JSON.parse(this.getAttribute('data-whole')));
                        // inp.addEventListener("keyup");
                       
                        inp.value = this.getElementsByTagName("input")[0].value;
                     
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                  }
                }
            });
            /*execute a function presses a key on the keyboard:*/
            inp.addEventListener("keydown", function(e) {
                var x = document.getElementById(this.id + "autocomplete-list");
               
                if (x) x = x.getElementsByTagName("div");
                if (e.keyCode == 40) {
                  /*If the arrow DOWN key is pressed,
                  increase the currentFocus variable:*/
                  currentFocus++;
                  /*and and make the current item more visible:*/
                  addActive(x);
                } else if (e.keyCode == 38) { //up
                  /*If the arrow UP key is pressed,
                  decrease the currentFocus variable:*/
                  currentFocus--;
                  /*and and make the current item more visible:*/
                  addActive(x);
                } else if (e.keyCode == 13) {
                  /*If the ENTER key is pressed, prevent the form from being submitted,*/
                  e.preventDefault();
                  if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                  }
                }
            });
            function addActive(x) {
              /*a function to classify an item as "active":*/
              if (!x) return false;
              /*start by removing the "active" class on all items:*/
              removeActive(x);
              if (currentFocus >= x.length) currentFocus = 0;
              if (currentFocus < 0) currentFocus = (x.length - 1);
              /*add class "autocomplete-active":*/
              x[currentFocus].classList.add("autocomplete-active");
            }
            function removeActive(x) {
              /*a function to remove the "active" class from all autocomplete items:*/
              for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
              }
            }
            function closeAllLists(elmnt) {
              /*close all autocomplete lists in the document,
              except the one passed as an argument:*/
              var x = document.getElementsByClassName("autocomplete-items");
            //   x.style.background = "#000 !important;";
              for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
              }
            }
          }
          /*execute a function when someone clicks in the document:*/
          document.addEventListener("click", function (e) {
              closeAllLists(e.target);
              
          });
        }
    }

    async convertImageToBlob(imgPath){

        let canvas = document.createElement('canvas');
        
        let blob = await new Promise(resolve => canvas.toBlob(resolve,imgPath));

        return blob;

    }

    displayIntoImage(un8arr,imgID){
        // Small red dot image
        // const content = new Uint8Array([un8arr]);

        document.querySelector(imgID).src = URL.createObjectURL(
        new Blob([un8arr.buffer], { type: 'image/jpeg' } /* (1) */)
        );

    }

    getUnit8ArrayOnFile(file,callback){
        const MAX_WIDTH = 420;
        const MAX_HEIGHT = 560;
        const MIME_TYPE = "image/jpeg";
        const QUALITY = 0.7;
        const blobURL = URL.createObjectURL(file);
        const img = new Image();
        
        img.src = blobURL;

        img.onerror = function () {
            URL.revokeObjectURL(this.src);
            // Handle the failure properly
            console.log("Cannot load image");
        };

        img.onload = function () {
            URL.revokeObjectURL(this.src);
            const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
            const canvas = document.createElement("canvas");
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            
            canvas.toBlob(
            (blob) => {
                // Handle the compressed image. es. upload or save in local state
                // console.log(file);
                blob.arrayBuffer().then(arbu=>{
                    const view = new Uint8Array(arbu);
                    callback(view);
                   
                });
                
                
            },
        
            MIME_TYPE,
            QUALITY
            );
            
        };

        function calculateSize(img, maxWidth, maxHeight) {
            let width = img.width;
            let height = img.height;

            // calculate the width and height, constraining the proportions
            if (width > height) {
                if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
                }
            }
            return [width, height];
            
            }



        function readableBytes(bytes) {
        const i = Math.floor(Math.log(bytes) / Math.log(1024)),
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
        }

      

    }

    getColor(value) {
        //value from 0 to 1
        var hue = ((1 - value) * 120).toString(10);
        return ["hsl(", hue, ",100%,50%)"].join("");
    }
    
    getColorWithOpacity(value,op) {
        //value from 0 to 1
        var hue = ((1 - value) * 120).toString(10);
        // return ["hsla(", hue, ",100%,50%,","",op,")"].join("");
        return `hsla(${hue},100%,50%,${op})`;
    }

}

const requestsection = new RequestSection();
module.exports = {
     requestsection,
    validateFields:function(options){
        return requestsection.validateFields(options);
    },
    readJSON:function(path,callback){
        return requestsection.readJSON(path,callback);
    },
    writeJSON:function(path,data,callback){
        return requestsection.writeJSON(path,data,callback);
    },
    getContent:function(path,callback){
        return requestsection.getContent(path,callback);
    },
    getOnDate:function(strDate){
        return requestsection.getOnDate(strDate);
    },
    getNormalDate:function(strDate){
        return requestsection.getNormalDate(strDate);
    },
    getDistinctObject:function(arrobjs,fieldname){
        return requestsection.getDistinctObject(arrobjs,fieldname);

    },
    liveDateAndTime:function(){
        return requestsection.liveDateAndTime();
    },
    displayOn:function(container,content){
        requestsection.displayOn(container,content);
    },
    toDateTimeString:function(d){
        return requestsection.toDateTimeString(d);
    },
    setAutoComplete:function(inp,arr,field_based,getSelected){
        requestsection.setAutoComplete(inp,arr,field_based,getSelected);
    },
    getColor:function(val){
        return requestsection.getColor(val);
    },
    getColorWithOpacity:function(val,op){
        return requestsection.getColorWithOpacity(val,op);
    },
    addTime:function(format,timeLengthVal,date){
        return requestsection.addTime(format,timeLengthVal,date);
    }
}