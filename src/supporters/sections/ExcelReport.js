require('core-js/modules/es.symbol');
require('core-js/modules/es.symbol.async-iterator');
require('regenerator-runtime/runtime');
const ExcelJS  = require("exceljs/dist/es5");
const View = require('../../frontiers/views/View');
class ExcelReport extends View{
    constructor(){}
    findExcel(callback,motherparent = "body"){

        var self = this;

        $(motherparent).append(`
        <form enctype="multipart/form-data" style="display:none;">
        <input type="file" name="" id="uploadexcel" hidden>
        </form>`
        );

        $("#uploadexcel").trigger('click');
    
        $("#uploadexcel").on("change",function(e){ 
            var path = e.target.files[0].path;

            if(path+"".endsWith('.xlsx')){

               
                callback(path);
                
            }else{
                
                self.messager({
                    "message-01":true,
                    "messages":['Invalid Excel File. Only allowed XLSX format.']});
                
            }
            

            
        });
    }

    createWorkbook(options){
        this.workbook = new ExcelJS.Workbook();
        // this.workbook.creator = options['creator'] ? options['creator'] :"Eunar Dayangco";
        // this.workbook.lastModifiedBy = options['last-modified-by'] ? options['last-modified-by'] :"Eunar Dayangco";
        // this.workbook.created = options['created-date'] ? options['created-date'] : new Date();
        // this.workbook.modified = options['modified-date'] ? options['modified-date'] : new Date();
        // this.workbook.lastPrinted = options['last-printed-date'] ? options['last-printed-date'] : new Date();
        // this.workbook.properties.date1904 = options['date1904'] ? options['date1904'] :false;
        this.workbook.calcProperties.fullCalcOnLoad = true;
    }

    createSheet(sheetName,option = {}){
        const worksheet = this.workbook.addWorksheet(sheetName,option);
       
    }
    addCell(sheetName,column,row,value){
        const worksheet = this.workbook.getWorksheet(sheetName);
        worksheet.getCell(`${column}${row}`).value = value;
    }

    addRow(sheetName,row){
        const worksheet = this.workbook.getWorksheet(sheetName);
        worksheet.addRow(row);
    }

    download(filename){
        this.workbook.xlsx.writeFile(filename);
    }
}

module.exports = ExcelReport;