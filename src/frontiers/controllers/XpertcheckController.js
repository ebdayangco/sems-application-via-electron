const xpertcheckView = require("../views/XpertcheckView");
const genexpertModel = require("../models/GenexpertModel");
const xpertcheckModel = require("../models/XpertcheckModel");
const serviceReportController = require("./ServiceReportController");
const genexpertController = require("./GenexpertController");
const PaginationController = require("./PaginationController");
class XpertcheckController{
    constructor(){
        this.paginationController = new PaginationController();
        this.paginationController.pageNum = `#xpertcheck-index-pagination > 
        .pagination-paging-control > .pagination-select > input`;
    }

    reloading(callback){

        this.showList({});
        genexpertController.reloading(callback);

    }
    onView(){
        return xpertcheckView;
    }
    transaction(){

        var self = this;

        function schedule(transID,datas,callback){
            xpertcheckModel.setTransID(transID);
            xpertcheckModel.process().insert(datas,callback);
        }

        function createXpertcheckOnTransaction(callback){

            
            const data = xpertcheckView.transaction().getXpertcheckOnTransactionEntries();
            const d = {
                "genexpert":data['genexpert'],
                "calibration-from":data['start-calibration'],
                "calibration-to":data['end-calibration'],
                "engineer":data['calibrate-by'],

            }
            xpertcheckModel.process().insert(d,callback);

            
        }

        function setSchedule(){

            function onSchedule(){

                xpertcheckView.loader({
                    "loader-01":true
                });
                if(xpertcheckView.transaction().setSchedule().validate()){


                    let values = xpertcheckView.transaction().setSchedule().entries();
    
                    // check if service report number is already exist

                    let servicereportnumber = values['service-report']['service-report-num'];


                    function serviceReportProcess(callback){
                        if(servicereportnumber == ""){
                            callback("no-service-report");
                        }else{
                            // serviceReportController.checkServiceReport(servicereportnumber,
                            // function(){
                            //     //If exist
                            //     xpertcheckView.messager({
                            //         "message-01":true,
                            //         "messages":[`${servicereportnumber} already exist!`]
                            //     });
                            // },callback("has-service-report"));

                            callback("has-service-report");

                        }

                    }

                    serviceReportProcess(function(status){

                         // check if genexpert serial number is already exist
                         genexpertModel.process().checkExist(values['genexpert'],
                         function(){
                             // If exist
                             
                             // Insert new Preventive Maintenance Schedule
                             xpertcheckModel.process().insert(values,function(res){
                                 
                                function insertServiceReportProcess(callback){

                                    if(status == "has-service-report"){

                                        values['service-report']['service-report-particular-id'] = res['xpckID'];
                                     
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
                                        xpertcheckView.container = "#transaction-frame-area";
                                        xpertcheckView.transaction().setSchedule().allClear();
                                        xpertcheckView.messager({
                                            "message-02":true,
                                            "title":"Xpertcheck Message",
                                            "message":`Successfully inserted new schedule for 
                                           Xpertcheck`
                                        });
                                    });

                                })
 
     
                             });
                             
                         },function(){
     
                             // If not exist
                             xpertcheckView.messager({
                                 "message-01":true,
                                 "messages":[`Genexpert 
                                 ${values['genexpert']} is not exist!`]
                             });
                             
     
                         });
     

                    });

                   



                    
                }
            }

            function findInfo(){

                if(xpertcheckView.transaction().setSchedule().validateGenexpertSN()){

                    const genexpertSN = xpertcheckView.transaction()
                    .setSchedule().entries()['genexpert'];
                    genexpertController.transaction().search(genexpertSN,function(res){
                        if(res.length == 0){
                            xpertcheckView.messager({
                                "message-01":true,
                                "messages":[`${genexpertSN} is not exist!`]
                            });
                        }else{
                            xpertcheckView.transaction().setSchedule().showInfo(res[0]);
                            xpertcheckView.exitScreen();
                        }
                    });
                }


            }

            function lastCalibration(){

                if(xpertcheckView.transaction().setSchedule().validateGenexpertSN()){

                    const genexpertSN = xpertcheckView.transaction()
                    .setSchedule().entries()['genexpert'];

                    xpertcheckModel.process().getLastXpertcheckBasedGenexpertSN(genexpertSN,
                        function(res){

                            if(res.length == 0){
                                xpertcheckView.messager({
                                    "message-01":true,
                                    "messages":[`${genexpertSN} has no calibration!`]
                                });
                                xpertcheckView.transaction().setSchedule().clearLastCalibration();
                            }else{
                                const lastCalibration = res[0]['last_calibration'];
                                xpertcheckView.transaction().setSchedule().displayLastCalibration(lastCalibration);
                                xpertcheckView.exitScreen();
                            }
                        });
                   
                }

            }

            return {onSchedule,findInfo,lastCalibration};
        }


        return {setSchedule,createXpertcheckOnTransaction,schedule};
       
    }

    getXpertcheck(serialnumber,callback){
        xpertcheckModel.process().getLastXpertcheckBasedGenexpertSN(serialnumber,callback);
    }

  
    onPagination(){
        var self = this;
        return this.paginationController.paginationControl(function(){
            self.showList({'show-load':true});
        });
    }

    showList(options){
        const {limit,offset,pageNum} = xpertcheckView.views().getXpertcheckLimitOffset();
        xpertcheckView.container = "#xpertcheck-frame-area";
        xpertcheckModel.process().getTotalProcess(function(res){

            let total = res[0]['total'];


            const totalPage = Math.ceil(total/limit);
            if(totalPage-pageNum == 0){
              
               $(`#xpertcheck-index-pagination .pagination-paging-control > 
               .pagination-next > a`).addClass('a-disabled');
            }else if(totalPage == 1){
                $(`#xpertcheck-index-pagination .pagination-paging-control > 
                .pagination-next > a`).addClass('a-disabled');
            }else{
                $(`#xpertcheck-index-pagination .pagination-paging-control > 
               .pagination-next > a`).removeClass('a-disabled');
            }

            if(pageNum == 1 || isNaN(pageNum)){
                $(`#xpertcheck-index-pagination .pagination-paging-control > 
                .pagination-previous > a`).addClass('a-disabled');
            }else{
                $(`#xpertcheck-index-pagination .pagination-paging-control > 
                .pagination-previous > a`).removeClass('a-disabled');
            }
            if(options['show-load']){
                xpertcheckView.loader({
                    "loader-01":true
                });
            }
           
            xpertcheckModel.process().select({
                "filter":xpertcheckView.views().getXpertcheckFilter(),
                "limit":limit,
                "offset":offset,
                "filter":xpertcheckView.userInterfaces().getFilters()
            },function(datas){

                xpertcheckView.views().displayDatas(options.uploadDatas?options.uploadDatas:datas);
                xpertcheckView.displayPaginationInfo(limit,offset,total);
                if(options['show-load']){
                    xpertcheckView.exitScreen();
                }

                if(options['done']){
                    options['done']();
                }
                
            });
        });

       
        
    }

    getXpertcheckData(condition,callback){
        xpertcheckModel.process().getDatas(condition,callback);
    }

    getFilterDatas(condition,callback){
        xpertcheckModel.process().getFilterDatas(condition,callback);
    }

    getAllXpertcheck(callback){
        xpertcheckModel.process().getAllXpertcheck(callback);
    }

    onFilterView(div){
        $(".xpertcheck-filter-area").toggleClass("xpertcheck-open-filter");
        xpertcheckView.toggleFilter(div,'.xpertcheck-filter-area');
        this.div = div;
    }

    filterProcess(div){
        var self = this;
        $(`#xpertcheck-index-pagination > 
        .pagination-paging-control > .pagination-select > input`).val(1);
            this.showList({"show-load":true,"done":function(){
                self.onFilterView(self.div);
            }});
            
    }


    toggleInfo(){
        $(".xpertcheck-info-area").toggleClass("xpertcheck-show-info");
    }

    openInfo(div,evt){

        const clk = $(evt.target);

        if(clk.attr("class") != "fa fa-pencil-square-o"){
            showSubForm("#xpertcheck-information-area","top");
            const data = JSON.parse(JSON.stringify($(div).data("whole")));
            const list = JSON.parse(JSON.stringify($(div).data("list")));
            xpertcheckView.views().displayInfoDatas(data,xpertcheckModel.process().getRecords);
        }
        

    }
    reschedule(div,evt){

        const clk = $(evt.target);
        if(clk.attr("class") == "fa fa-pencil-square-o"){
            const whole = $(div).parent().parent().data("whole");
            const dd = JSON.parse(JSON.stringify(whole));
            xpertcheckView.transaction().setSchedule().assignDatas(dd);
            xpertcheckView.userInterfaces().openXpertcheckScheduleFromList(div);
        }
    }
    
    update(){
        const values = xpertcheckView.transaction().getUpdateEntries();
        xpertcheckView.container = "#xpertcheck-information-area";
        
        if(values['empty']){
            xpertcheckView.messager({
                    "message-01":true,
                    "messages":[`No data has changed/updated`]});
        }else{
            xpertcheckView.loader({
                "loader-01":true
            });
            xpertcheckModel.process().updateXpertcheck(values,function(){
                xpertcheckView.messager({
                    "message-02":true,
                    "title":"Xpertcheck Update Message",
                    "message":`Xpertcheck has been updated`
                });
            });
        }
    }

    toggleFilterPanel(div){

        function hideAll(){
            $(".xpertcheck-filter-content-area").children().hide();
        }
        function showAll(){
            $(".xpertcheck-filter-content-area").children().show();
        }

        function showXpertcheck(){
            hideAll();
            $(".xpertcheck-filter-content-area").children(".xpertcheck-xpertcheck-panel").show();
            
        }

        function showGenexpert(){
            hideAll();
            $(".xpertcheck-filter-content-area").children(".xpertcheck-genexpert-panel").show();
            
        }

        function showModule(){
            hideAll();
            $(".xpertcheck-filter-content-area").children(".xpertcheck-module-panel").show();
            
        }

     


        switch($(div).html()){
            case "All": showAll(); break;
            case "Xpertcheck": showXpertcheck(); break;
            case "Genexpert": showGenexpert(); break;
            case "Module": showModule(); break;
        }

    }

}
const xpertcheckController = new XpertcheckController();
module.exports = xpertcheckController;
