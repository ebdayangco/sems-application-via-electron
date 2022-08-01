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