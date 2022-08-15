require('core-js/modules/es.promise');
require('core-js/modules/es.string.includes');
require('core-js/modules/es.object.assign');
require('core-js/modules/es.object.keys');
require('core-js/modules/es.symbol');
require('core-js/modules/es.symbol.async-iterator');
require('regenerator-runtime/runtime');
const { ipcRenderer } = require('electron');
const ExcelJS = require("exceljs/dist/es5");


const View = require('../../frontiers/views/View');

class ReportLibrary extends View{
    constructor(){
        super();
    }

    saveFile(callback,loader=function(){}){
        loader();
        ipcRenderer.send('find-excel-file',"");
        ipcRenderer.on("file-path",function(events,datas){
            callback(datas);
        });
    }

    saveFile_and_return(){
        
        return new Promise(res=>{
            ipcRenderer.send('find-excel-file',"");

            try{
                ipcRenderer.on("file-path",function(events,datas){
                    res(datas);
                });
            }catch(e){
                // error not for display

                res(null);
            }
           
        });
       
    }

    openFile_and_return(){
        
        return new Promise(res=>{
            ipcRenderer.send('read-excel-file',"");

            try{
                ipcRenderer.on("file-path",function(events,datas){
                    res(datas);
                });
            }catch(e){
                // error not for display

                res(null);
            }
           
        });
       
    }

    findFile(options){

        var self = this;

        $(options['container'] ?options['container']:"body").append(`
        <form enctype="multipart/form-data" style="display:none;">
        <input type="file" name="" id="uploadexcel" hidden>
        </form>`
        );

        $("#uploadexcel").trigger('click');
    
        $("#uploadexcel").on("change",function(e){ 
            var path = e.target.files[0].path;

            if(path.endsWith(options['file-format'])){
                options["path"](path);
                
            }else{
               
                self.messager({
                    "message-01":true,
                    "messages":[options['message']]});
                
            }
            

            
        });
    }

    excel(){

        var self = this;

        function exporting(){

            function createWorkBook(){
                return new ExcelJS.Workbook();
            }

            function createWorksheet(workbook,sheetName){
                return workbook.addWorksheet(sheetName, {properties:{tabColor:{argb:'FFC0000'}}});
            }

            function removeWorksheet(workbook,sheetID){

                workbook.removeWorksheet(sheetID);
            }

            function getWorksheet(workbook,sheetName){
                return workbook.getWorksheet(sheetName);
            }

            function addRow(worksheet,row){
                worksheet.addRow(row);
            }

            function exec(workbook,filename,callback){
               
                workbook.xlsx.writeFile(filename);
                callback();
            }

           

            return {createWorkBook,createWorksheet,removeWorksheet,getWorksheet,addRow,exec};

        }

        function importing(){


            function SAP(callback){

                self.openFile_and_return().then(filenames=>{
               

                    if(filenames.length != 0){
                        const datas = [];
                        var workbook = new ExcelJS.Workbook(); 
                        workbook.xlsx.readFile(filenames[0])
                            .then(function() {
                                var worksheet = workbook.getWorksheet(1);
                                worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
                                    if(row.values.length != 0){
                                        datas.push(row.values);  
                                    }
                                     
                                });
            
                                callback(datas);
                                // getAllFacilities(datas);
                                const genexpertDatas = getGenexpertwithHistory(datas);
                                const moduleDatas = getModulewithHistory(datas);
                                const assayDatas = getAllAssaystatistic(datas);
                                // console.log(genexpertDatas);
                                // console.log(moduleDatas);
                                // console.log(assayDatas);
                                genexpertController.sapProcess(genexpertDatas,moduleDatas,assayDatas);
                        });
                    }
    
                    
                });
            }



            function getAllFacilities(datas){

                return datas.filter((f,i)=>{
                    return datas[i].length == 3;
                }).map(facility => {
                    return {
                        "facility-name":facility[1],
                        "facility-address":facility[2]
                    }
                });

                
            }

            function getAllGenexpert(datas){

                return datas.filter(d=>{
                    return d[4] == "Machine";
                }).map(v=>{
                    return {
                        "serial-number":v[2],
                        "model-number":v[1],
                        "status":v[5],
                        "date-installed":v[7],
                        "installation-type":v[8],
                        "site":v[11],
                        "site-address":v[12],
                        "technician":v[13]
                    }
                });
            }

            function getAllUniqueGenexpert(datas){

                return [... new Set( datas.map(d=>{
                    return d['serial-number'];
                }))];
                
            }

            function getGenexpertwithHistory(datas){

                const allgenexpert_datas = getAllGenexpert(datas);
                const unique_datas = getAllUniqueGenexpert(allgenexpert_datas);
                const all_datas = [];


                unique_datas.forEach(gen=>{
                 
                    const histors = allgenexpert_datas.filter(d=>{
                        return gen == d['serial-number'];
                    });

                    let object = {};
                    object[`${gen}`] = histors.length > 1 ? 
                    histors.sort(function(a,b){
                        return new Date(b['date-installed']) - new Date(a['date-installed']);
                      }):histors;
                    all_datas.push(object);

                });


                return all_datas;
            }

            function getAllModules(datas){

                return datas.filter(d=>{
                    return d[4] == "Modules";
                }).map(v=>{
                    return {
                        "genexpert-serial-number":v[2],
                        "module-serial-number":v[3],
                        "status":v[5],
                        "location":v[6],
                        "date-installed":v[7],
                        "installation-type":v[8],
                        "site":v[11],
                        "site-address":v[12],
                        "technician":v[13]
                    }
                });

            }

            function getAllUniqueModules(datas){

                return [... new Set( datas.map(d=>{
                    return d['module-serial-number'];
                }))];
                
            }

            function getModulewithHistory(datas){

                const allmodule_datas = getAllModules(datas);
                const unique_datas = getAllUniqueModules(allmodule_datas);
                const all_datas = [];


                unique_datas.forEach(mod=>{
                 
                    const histors = allmodule_datas.filter(d=>{
                        return mod == d['module-serial-number'];
                    });

                    let object = {};
                    object[`${mod}`] = histors.length > 1 ? 
                    histors.sort(function(a,b){
                        return new Date(b['date-installed']) - new Date(a['date-installed']);
                      }):histors;
                    all_datas.push(object);

                });


                return all_datas;
            }

            function getAllAssaystatistic(datas){

                const assays =  datas.filter(d=>{
                    return d[9];
                });

                const allgenexpert_datas = getAllGenexpert(datas);
                const unique_datas = getAllUniqueGenexpert(allgenexpert_datas);

                return unique_datas.map(gen=>{

                    let object = {};
                    object[`${gen}`] = assays.filter(m=>{
                       return gen == m[2];
                    }).map(a=>{
                        return {
                            "assay":a[9],
                            "date-installed":a[7],
                            "status":a[5]
                        }
                    });

                    return object;

                    
                });


            }

            return {SAP};
 
        }

        return {importing,exporting};

    }   
    pdf(){
        function exporting(){

            let htmlcontent = "";
            let htmlLocation = "";

            function setHtml(htmlLoc){
                htmlLocation = htmlLoc;
                htmlcontent = fs.readFileSync(htmlLocation,{
                    encoding:'utf-8'
                });

               
            }

            function createTitle(titlename,position="center"){

            }

            function createUserInformation(position){

            }

            function createTable(options){

            }

            function onFindFile(callback){
                ipcRenderer.send('save-file',"");
                ipcRenderer.on("catch-save-file",function(events,pth){

                    const last5 = pth.slice(pth.length-5,pth.length);
                   
        
                    if(last5 != ".pdf"){
                        pth+=".pdf";
                    }

                    callback(pth);
                });
            }

            function onCreate(autoprint,onDatas,savePath,callback){


                ipcRenderer.send("print-process",{
                    'content':htmlcontent,
                    'path':savePath,
                    'datas':onDatas
                });

                ipcRenderer.on("print-done",function(events,repl){
                    callback(repl);
                   
                });

                
            }


            return {setHtml,createTitle,createUserInformation,createTable,onCreate,onFindFile};

        }

        return {exporting};
    }
}
const reportLibrary = new ReportLibrary();
module.exports = reportLibrary;