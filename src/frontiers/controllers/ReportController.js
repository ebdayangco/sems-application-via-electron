const reportModel = require("../models/ReportModel");
const reportView = require("../views/ReportView");
const genexpertController = require("./GenexpertController");
const xpertcheckController = require("./XpertcheckController");
const preventiveMaintenanceController = require("./PreventiveMaintenanceController");
const {ipcRenderer} = require("electron");
const fs = require("fs");
const reportSection = require("../../supporters/sections/ReportSection");
const ExcelSection = require("../../supporters/sections/ExcelSection");

class ReportController{
    constructor(){

        this.table = "genexpert";
        this.data_category="filter";
        this.file_type = "excel";
    }


    maker(){
        
        function settingUp(){

            //setting up table List and field List
            reportModel.process({
                "results":function(res){
                    reportView.classifyTableandFields(res);  
                }
            }).getAllTablesAndField();
        }

        function getView(){
            return reportView;
        }


        return {settingUp,getView};
    }

    list(){

        function onView(){
            return reportView;
        }

        function onDefault(name,generateType){

            switch(name){
                case "Site Per Region":generateSitePerRegion(generateType); break;
                case "Assay Statistics":generateAssaystatistic(generateType); break;
                case "Xpertcheck":generateXpertcheck(generateType); break;
                case "Preventive Maintenance":generatePreventiveMaintenance(generateType); break;
                default:break;
            }


            function generateSitePerRegion(generateType){
                reportModel.process({
                    "results":function(res){
                        
                        if(generateType == "pdf"){
                            reportView.list().createOnDefaultReport(name,res).sitePerRegion();
                        }
                        
                    }
                }).getSitePerRegion();
            }
            function generateAssaystatistic(generateType){
                reportModel.process({
                    "results":function(res){
                        if(generateType == "pdf"){
                            reportView.list().createOnDefaultReport(name,res).onAssaystatistic();
                        }
                    }
                }).getAssaystatistic();
            }
            function generateXpertcheck(generateType){
                reportModel.process({
                    "results":function(res){
                        if(generateType == "pdf"){
                            reportView.list().createOnDefaultReport(name,res).onXpertcheck();
                        }
                    }
                }).getXpertcheck();
            }
            function generatePreventiveMaintenance(generateType){
                reportModel.process({
                    "results":function(res){
                        if(generateType == "pdf"){
                            reportView.list().createOnDefaultReport(name,res).onPreventiveMaintenance();
                        }
                    }
                }).getPreventiveMaintenance();
            }

        }

        return {onView,onDefault};
      
    }

    showReportOption(table,data_category){
        this.table = table;
        this.data_category = data_category;

        showSubForm("#report-option-area","top");
    }

    execute(file_type){

        this.file_type = file_type;

        if(this.table == "genexpert" && this.data_category == "all" 
        && this.file_type == "excel"){
            this.onGenexpertExportExcel_via_All();
            this.onView().closeReportOption();
        }else if(this.table == "genexpert" && this.data_category == "filter" 
        && this.file_type == "excel"){
            onGenexpertExportExcel_via_Filter();
            this.onView().closeReportOption();
        }

    }

    onView(){
        return reportView;
    }

    onGenexpertExportExcel_via_All(){
       
        
        ipcRenderer.send("find-file","");

        // genexpertController.onDatas().getAllGenexpert(function(datas){

            

        //     reportView.onExcel({
        //         "transaction":"export",
        //         "datas":datas
        //     })

        // })

      
    }

    onGenexpertExportExcel_via_Filter(){

        genexpertController.onDatas().getGenexpert(function(datas){

            reportView.onExcel({
                "transaction":"export",
                "datas":datas
            })

        })

      
    }

    getOtherInformation(serialnumber,callback){

        xpertcheckController.getXpertcheckData(` AND genexpertSN="${serialnumber}"`,
        function(xpertchecks){

            preventiveMaintenanceController.getPreventiveMaintenanceData(
                ` AND genexpertSN="${serialnumber}"`,function(pm){

                    callback({
                        "xpertcheck":xpertchecks,
                        "preventive-maintenance":pm
                    });

                    // serviceReportController.getServiceReport(serialnumber,function(sr){

                    //     callback({
                    //         "xpertcheck":xpertchecks,
                    //         "preventive-maintenance":pm,
                    //         "service-report":sr
                    //     });
                       
                    // });
              
                
            });
            
        });

    }

    onPDF(){

        var self = this;

        function genexpert_machine_information(div,autoprint){

            reportView.container = "#genexpert-frame-area";
            reportView.loader({
                "loader-01":true
            });
            
            const main = $(div).parent(".frame-reveal-table-list-title-item")
            .parent(".frame-body-list-row");
            const datas = main.data("support");
            const sn = datas['genexpert']['genex_serialnumber'];
            self.getOtherInformation(sn,function(res){

                datas['xpertcheck'] = res['xpertcheck'];
                datas['preventive-maintenance'] = res['preventive-maintenance'];
                datas['service-report'] = res['service-report'];
                const html = fs.readFileSync(reportView.getAllReportTheme(__dirname)['genexpert-machine-information'],{
                    encoding:'utf-8'
                });
    
    
                const listof = {
                    "content":html,
                    "datas":datas
                   
                }

                if(autoprint){
                    ipcRenderer.send('print-file',listof);
                    ipcRenderer.on("reply",function(events,datas){
                        reportView.messager({
                            "message-02":true,
                            "title":"Report Message",
                            "message":`Successfully Created New Report`
                        });
                    });
                }else{
                    ipcRenderer.send('export-file',listof);
                    ipcRenderer.on("reply",function(events,datas){
                        reportView.messager({
                            "message-02":true,
                            "title":"Report Message",
                            "message":`Successfully Created New Report`
                        });
                    });
                }

               
    
              
             
            });


           
            
            
        }

        

        return {genexpert_machine_information};

    }

    onExcel(){

        var self = this;

        function onExport(div){
            const main = $(div).parent(".frame-reveal-table-list-title-item")
            .parent(".frame-body-list-row");
            const datas = main.data("support");
            const sn = datas['genexpert']['genex_serialnumber'];

            self.getOtherInformation(sn,function(res){

                datas['xpertcheck'] = res['xpertcheck'];
                datas['preventive-maintenance'] = res['preventive-maintenance'];
                datas['service-report'] = res['service-report'];
               
                reportSection.onFile(function(filepath){
                    const excelSection = new ExcelSection();
                    excelSection.download().individual(datas,filepath).bySheet();
                });
              
            });
        }

        return {onExport};
    }



    

}
const reportController = new ReportController();
module.exports = reportController;