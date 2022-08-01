const Database = require("../src/7.tools/databases/Databases");
const $ = require("jquery");
const fs = require("fs");
const acctJSON = require("../src/7.tools/databases/account.json");
const { genexperts, node_modules } = require("../src/7.tools/sections/RouteSection");
const { BrowserWindow } = require("electron").remote;
const { backendScreen } = require("../src/7.tools/sections/MessageLoadingSection");

class Controller extends Database{

    constructor(){
        super();
        // this.pre_declare();
        Object.assign(this,require("../src/7.tools/sections/MessageLoadingSection"));
        this.acctJSON = acctJSON;
    }


    displayOnDropDown(idField,valueField,tablename,dropDownField,callback){

        this.askDatabase(`SELECT ${idField},${valueField} 
        FROM ${tablename}`,function(results){
            if(results.length != 0){
                const res = JSON.parse(JSON.stringify(results));
                $(dropDownField).html("");
                $(dropDownField).append("<option value='0'></option>");
                res.forEach(item=>{
                    $(dropDownField).append(`<option value='${item[idField]}'>${item[valueField]}</option>`);
                });
               
            }
            callback();
            // console.log(JSON.parse([]));
        });

    }
    provideDropDownContent(){
        var self = this;
        this.displayOnDropDown("engineerID","fullname","engineer",".engineer-drop-down",function(){
            self.displayOnDropDown("itID","itName","installationtype",".installationtype-drop-down",function(){
                self.displayOnDropDown("mnID","mnName","modelnumber",".modelnumber-drop-down",function(){

                });
            });
        });
            
    }

    pre_declare(){
        // <link rel="stylesheet" href="../genexpert.css">
        // <link rel="stylesheet" href="./asset-index.css">


        const css=`
            <link rel="stylesheet" href="${node_modules["bootstrap"]["bootstrap-min-css"]}">
            <link rel="stylesheet" href="${node_modules["font-awesome"]["font-awesome-min-css"]}">
            <link rel="stylesheet" href="${genexperts['genexpert-css']}">
        `

        const js = `
            <script src="${node_modules["jquery"]["jquery-min-js"]}"></script>
            <script>
            try {
                $ = jQuery = module.exports;
                // If you want module.exports to be empty, uncomment:
                // module.exports = {};
            } catch(e) {}
            </script>
            <script src="${node_modules["bootstrap"]["bootstrap-min-js"]}"></script>
        `;
            
        document.querySelector(".all-index-css").innerHTML = css;
        document.querySelector(".all-index-js").innerHTML = js;
        
     
    }


    askDatabase(statement,feedback){
        var self = this;
        this.onQuery(statement,function(results){
            feedback(results);
            self.onDisconnect();
        });
    }

    multipleAssetInserts(datas,callback,loadingScreen = true){

        if(loadingScreen){
            backendScreen({
                "container":"body",
                "screen-name":"asset-upload-excel-sap-screen",
                "loading-box":{
                    "version":1,
                    "message":"Inserting Genexpert..."
                }
            });
        }

       this.onMultiAssetQueries(datas,function(){
            callback();
       });

    }

    multipleModuleInserts(datas,callback,loadingScreen = true){

        if(loadingScreen){
            backendScreen({
                "container":"body",
                "screen-name":"asset-upload-excel-sap-screen",
                "loading-box":{
                    "version":1,
                    "message":"Inserting Module..."
                }
            });
        }

       this.onMultiModuleQueries(datas,function(){
            callback();
       });

    }

    multipleAssaytatisticInserts(datas,callback,loadingScreen = true){

        if(loadingScreen){
            backendScreen({
                "container":"body",
                "screen-name":"asset-upload-excel-sap-screen",
                "loading-box":{
                    "version":1,
                    "message":"Inserting Assaystatistic..."
                }
            });
        }

       this.onMultiAssaystatisticQueries(datas,function(){
            callback();
       });

    }
    doneTransaction(message){

        backendScreen({
            "container":".index-body-area",
            "screen-name":"asset-upload-excel-sap-screen",
            "message-box":{
                "version":3,
                "message":message
            }
        });
    }



    getPath(where){
       
        let path = '';
        if(where['genexpert']){
            
            if(where['genexpert']['asset']){
                
                if(where['genexpert']['asset'] == "index"){
                    path = genexperts['assets']['asset-index-html'];
                }else if(where['genexpert']['asset'] == "new"){
                    path = genexperts['assets']['asset-new-html'];
                }
            }
        }

        return path;

    }
    changeForm(where,done){
        const path = this.getPath(where);
        fs.readFile(path,'utf-8',function(err,content){
            $(".all-index-body").html(content);
            // fs.writeFile(`${__dirname}/index.html`,content,function(err){
            //     done();
            // });
        });
        
    }
    changeUrl(where,done){
        const path = this.getPath(where);
        BrowserWindow.getAllWindows().filter(w=>{
            return w['windowName'] = "main"
        })[0].loadURL(path).then(()=>{
            done();
        });

    }

}

module.exports = Controller;