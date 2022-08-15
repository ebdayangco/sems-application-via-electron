const genexpertModel = require("../models/GenexpertModel");
const preventiveMaintenanceModel = require("../models/PreventiveMaintenanceModel");
const preventiveMaintenanceView = require("../views/PreventiveMaintenanceView");
const genexpertController = require("./GenexpertController");
const PaginationController = require("./PaginationController");
const serviceReportController = require("./ServiceReportController");
const ExcelSection =require("../../supporters/sections/ExcelSection");
class PreventiveMaintenanceController{
    constructor(){

        this.paginationController = new PaginationController();
        this.paginationController.pageNum = `#pm-index-pagination > 
        .pagination-paging-control > .pagination-select > input`;
    }

    onView(){
        return preventiveMaintenanceView;
    }
    
    reloading(callback){

        this.showList({});
        genexpertController.reloading(callback);

    }

    getPM(serialnumber,callback){
        preventiveMaintenanceModel.process().getLastPMBasedGenexpertSN(serialnumber,callback);
    }

    transaction(){

        var self = this;

        function schedule(transID,datas,callback){
            preventiveMaintenanceModel.setTransID(transID);
            preventiveMaintenanceModel.process().insert(datas,callback);
        }

        function createMaintenanceOnTransaction(callback){

            
                const data = preventiveMaintenanceView.transaction()
                .getMaintenanceData();

                const d = {
                    "genexpert":data['genexpert'],
                    "calibration-from":data['start-maintenance'],
                    "calibration-to":data['end-maintenance'],
                    "engineer":data['create-by'],

                }
                preventiveMaintenanceModel.process().insert(d,callback);

            
        }
        function setSchedule(){

            function onSchedule(){

                preventiveMaintenanceView.loader({
                    "loader-01":true
                });
    
                if(preventiveMaintenanceView.transaction().setSchedule().validate()){
                    let values = preventiveMaintenanceView.transaction().setSchedule().entries();

                     // check if service report number is already exist

                     let servicereportnumber = values['service-report']['service-report-num'];


                     function serviceReportProcess(callback){
                         if(servicereportnumber == ""){
                             callback("no-service-report");
                         }else{
                            //  serviceReportController.checkServiceReport(servicereportnumber,
                            //  function(){
                            //      //If exist
                            //      xpertcheckView.messager({
                            //          "message-01":true,
                            //          "messages":[`${servicereportnumber} already exist!`]
                            //      });
                            //  },callback("has-service-report"));

                             callback("has-service-report");
 
                         }
 
                     }

                     serviceReportProcess(function(status){
                                                // If not exist
    
                        // check if genexpert serial number is already exist
                        genexpertModel.process().checkExist(values['genexpert'],
                        function(){
                            // If exist
    
                             // Insert new Preventive Maintenance Schedule
                             preventiveMaintenanceModel.process().insert(values,function(res){

                                function insertServiceReportProcess(callback){

                                    if(status == "has-service-report"){

                                        values['service-report']['service-report-particular-id'] = res['prevID'];
                                     
                                        // Insert new service report
                                        serviceReportController.insertServiceReport(values['service-report'],function(){
                                            
                                            callback();
                                           
                                        }); 
    
                                    }else{
                                        callback();
                                    }

                                }

                                insertServiceReportProcess(function(){
                                    self.reloading(function(){
                                        preventiveMaintenanceView.container = "#transaction-frame-area";
                                        preventiveMaintenanceView.messager({
                                            "message-02":true,
                                            "title":"Preventive Maintenance Message",
                                            "message":`Successfully inserted new schedule for 
                                            Preventive Maintenance`
                                        });

                                        preventiveMaintenanceView.transaction().setSchedule().allClear();
                                    });
                                    

                                });
    
          
                            });
    
    
                        },function(){
    
                            // If not exist
                            preventiveMaintenanceView.messager({
                                "message-01":true,
                                "messages":[`Genexpert 
                                ${values['genexpert']} is not exist!`]
                            });
                            
    
                        });
                     })


    
    
                }
    
            }
    
            function findInfo(){
    
                if(preventiveMaintenanceView.transaction().setSchedule().validateGenexpertSN()){
    
                    const genexpertSN = preventiveMaintenanceView.transaction()
                    .setSchedule().entries()['genexpert'];
                    genexpertController.transaction().search(genexpertSN,function(res){
                        if(res.length == 0){
                            preventiveMaintenanceView.messager({
                                "message-01":true,
                                "messages":[`${genexpertSN} is not exist!`]
                            });
                        }else{
                            preventiveMaintenanceView.transaction().setSchedule().showInfo(res[0]);
                            preventiveMaintenanceView.exitScreen();
                        }
                    });
                }
    
    
            }
    
            function lastCalibration(){
    
                if(preventiveMaintenanceView.transaction().setSchedule().validateGenexpertSN()){
    
                    const genexpertSN = preventiveMaintenanceView.transaction()
                    .setSchedule().entries()['genexpert'];
    
                    preventiveMaintenanceModel.process().getLastPMBasedGenexpertSN(genexpertSN,
                        function(res){
    
                            if(res.length == 0){
                                preventiveMaintenanceView.messager({
                                    "message-01":true,
                                    "messages":[`${genexpertSN} has no calibration!`]
                                });
                                preventiveMaintenanceView.transaction().setSchedule().clearLastCalibration();
                            }else{
                                const lastCalibration = res[0]['last_calibration'];
                                preventiveMaintenanceView.transaction().setSchedule().displayLastCalibration(lastCalibration);
                                preventiveMaintenanceView.exitScreen();
                            }
                        });
                  
                }
    
            }
    
    
            return {onSchedule,findInfo,lastCalibration};
        }

       return {setSchedule,createMaintenanceOnTransaction,schedule};
    }

    getPreventiveMaintenanceData(condition,callback){
        preventiveMaintenanceModel.process().getDatas(condition,callback);
    }

    getAllPreventiveMaintenance(callback,condition=""){
        preventiveMaintenanceModel.process().getAllPM(callback,condition);
    }

    onPagination(){
        var self = this;
        return this.paginationController.paginationControl(function(){
            self.showList({'show-load':true});
        });
    }

    showList(options){

        const {limit,offset,pageNum} = preventiveMaintenanceView.views().getPMLimitOffset();
        preventiveMaintenanceView.container = "#preventive-maintenance-frame-area";

        preventiveMaintenanceModel.process().getTotalProcess(function(res){

            let total = res[0]['total'];
            

            const totalPage = Math.ceil(total/limit);
            if(totalPage-pageNum == 0){
              
               $(`#pm-index-pagination .pagination-paging-control > 
               .pagination-next > a`).addClass('a-disabled');
            }else if(totalPage == 1){
                $(`#pm-index-pagination .pagination-paging-control > 
                .pagination-next > a`).addClass('a-disabled');
            }else{
                $(`#pm-index-pagination .pagination-paging-control > 
               .pagination-next > a`).removeClass('a-disabled');
            }
            if(pageNum == 1 || isNaN(pageNum)){
                $(`#pm-index-pagination .pagination-paging-control > 
                .pagination-previous > a`).addClass('a-disabled');
            }else{
                $(`#pm-index-pagination .pagination-paging-control > 
                .pagination-previous > a`).removeClass('a-disabled');
            }
            if(options['show-load']){
                preventiveMaintenanceView.loader({
                    "loader-01":true
                });
            }
           
            preventiveMaintenanceModel.process().getProcess({
                "limit":limit,
                "offset":offset,
                "filter":preventiveMaintenanceView.userInterfaces().getFilters()
            },function(datas){
                
                preventiveMaintenanceView.views().displayDatas(options.uploadDatas?options.uploadDatas:datas);
                preventiveMaintenanceView.displayPaginationInfo(limit,offset,total);
                if(options['show-load']){
                    preventiveMaintenanceView.exitScreen();
                }

                if(options['done']){
                    options['done']();
                }
                
            });
        });

       
        
    }

    onFilterView(div){
        $(".pm-filter-area").toggleClass("pm-open-filter");
        preventiveMaintenanceView.toggleFilter(div,'.pm-filter-area');
        this.div = div;
    }

    filterProcess(div){
        var self = this;
        $(`#pm-index-pagination > 
        .pagination-paging-control > .pagination-select > input`).val(1);
            this.showList({"show-load":true,"done":function(){
                self.onFilterView(self.div);
            }});
           
    }


    toggleInfo(){
        $(".pm-info-area").toggleClass("pm-show-info");
    }

    openInfo(div,evt){

        const clk = $(evt.target);

        if(clk.attr("class") != "fa fa-pencil-square-o"){

            showSubForm("#pm-information-area","top");
            const data = JSON.parse(JSON.stringify($(div).data("whole")));
            const list = JSON.parse(JSON.stringify($(div).data("list")));
            preventiveMaintenanceView.views().displayInfoDatas(data,
                preventiveMaintenanceModel.process().getRecords);
        }
        

    }
    reschedule(div,evt){

        const clk = $(evt.target);
        if(clk.attr("class") == "fa fa-pencil-square-o"){
            const whole = $(div).parent().parent().data("whole");
            const dd = JSON.parse(JSON.stringify(whole));
            preventiveMaintenanceView.transaction().setSchedule().assignDatas(dd);
            preventiveMaintenanceView.userInterfaces().openPMScheduleFromList(div);
        }
    }

    update(){
        const values = preventiveMaintenanceView.transaction().getUpdateEntries();
        preventiveMaintenanceView.container = "#pm-information-area";
        
        if(values['empty']){
            preventiveMaintenanceView.messager({
                    "message-01":true,
                    "messages":[`No data has changed/updated`]});
        }else{
            preventiveMaintenanceView.loader({
                "loader-01":true
            });
            preventiveMaintenanceModel.process().updatePM(values,function(){
                preventiveMaintenanceView.messager({
                    "message-02":true,
                    "title":"Preventive Maintenance Update Message",
                    "message":`Preventive Maintenance has been updated`
                });
            });
        }
    }

   

    paginationControl(){
    
        var self = this;

        function onKeyUp(evt){

            const wc = evt['which'];
            
            if(wc === 13){
                
                self.showList();
            }


        }
        function onPage(direction="Next"){

            const page_num = $(`#pm-index-pagination 
            > .pagination-paging-control > .pagination-select > input`);
            const add = direction == "Next" ? 1 : -1;
            let val = parseInt(page_num.val()) + add;
            page_num.val(val);
            self.showList();
        }
  

        return {onKeyUp,onPage};
    }

    toggleFilterPanel(div){

        function hideAll(){
            $(".pm-filter-content-area").children().hide();
        }
        function showAll(){
            $(".pm-filter-content-area").children().show();
        }

        function showXpertcheck(){
            hideAll();
            $(".pm-filter-content-area").children(".pm-xpertcheck-panel").show();
            
        }

        function showGenexpert(){
            hideAll();
            $(".pm-filter-content-area").children(".pm-genexpert-panel").show();
            
        }

        function showModule(){
            hideAll();
            $(".pm-filter-content-area").children(".pm-module-panel").show();
            
        }


        switch($(div).html()){
            case "All": showAll(); break;
            case "Xpertcheck": showXpertcheck(); break;
            case "Genexpert": showGenexpert(); break;
            case "Module": showModule(); break;
        }

    }
    getFilterDatas(condition,callback){
        preventiveMaintenanceModel.process().getFilterDatas(condition,callback);
    }

    onView(){
        return preventiveMaintenanceView;
    }
  
    reports(){

        function uploadExcel(){
 
            const excelSection = new ExcelSection();
            excelSection.uploadPM("");
        }
    
        function uploadDataFromExcel(){
    
            const excelSection = new ExcelSection();
            excelSection.uploadPM("pm",function(datas){
                preventiveMaintenanceModel.process().insertMultiExcelProcess(datas,0,function(){
    
                    preventiveMaintenanceView.messager({
                        "message-02":true,
                        "title":"Preventive Maintenance Message",
                        "message":`Done Inserting PM Datas from Excel`
                    });
                });
                
               
    
            });
    
            
        }

        return {uploadExcel,uploadDataFromExcel};
    }

   
}
const preventiveMaintenanceController = new PreventiveMaintenanceController();
module.exports = preventiveMaintenanceController;