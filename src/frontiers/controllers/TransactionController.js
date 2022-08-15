const transactionModel = require("../models/TransactionModel");
const serviceReportView = require("../views/ServiceReportView");
const transactionView = require("../views/TransactionView");
const Controller = require("./Controller");
const genexpertController = require("./GenexpertController");
const preventiveMaintenanceController = require("./PreventiveMaintenanceController");
const serviceReportController = require("./ServiceReportController");
const xpertcheckController = require("./XpertcheckController");
class TransactionController extends Controller{
    constructor(){
        super();
    }
    onFilterView(div){
        transactionView.toggleFilter(div,'#transaction-filter-area');
        this.div = div;
    }

    clearAll(){

        const root_main = $("#transaction-frame-area");
        const inputText = $("#transaction-frame-area input[type='text']");
        const inputDate = $("#transaction-frame-area input[type='date']");
        const select = $("#transaction-frame-area select");
        const textarea = $("#transaction-frame-area textarea");
        
        inputText.val("");
        textarea.val("");
        inputDate.val(getOnDate());
        select.prop("selectedIndex", 0);
        $("#transaction-serial-number-field-input").removeClass("hide-serial-number-select");
        $("#transaction-serial-number-field").addClass("hide-serial-number-select");
        transactionView.clearGenexpertInstallationForm();
        setDefaults();
    }

    transactionProcess(){
        
        const mainValidate = transactionView.getMainTransactDatas();
        var self = this;

        function mainValidation(callback){
            if(transactionView.validateMainTransact()){
                callback();
            }
        }

        function serviceReportOnDatabaseValidation(servicereportnumber,callback){

            serviceReportController.checkServiceReport(servicereportnumber,function(){
                // if exist

                
            transactionView.messager({"message-01":true,
            "messages":['Service Report Number already exist.']});
              
            },function(){
                //if not exist
                callback();
            });
        }

        function serviceReportValidation(datas,callback){

            const serviceReportNo = datas['service-report-number'];
           
            if(mainValidate['need-service-report'] === true){
               
                
                const messages = [];

                const v = [...serviceReportNo].filter(d=>{
                    return d != '0';
                });

                if(serviceReportNo == "" && v.length == 0){
                    messages.push("Please input service report number.");

                }
                    

                if(datas['engineer-name'] == 0){
                    messages.push("Please select service engineer at service report.");
                }

                if(datas['customer-name'] == ""){
                    messages.push("Please input customer name at service report.");
                }

                if(datas['engineer-sign-date'] == ""){
                    messages.push("Please input service engineer sign date at service report.");
                }


                if(datas['customer-sign-date'] == ""){
                    messages.push("Please input customer sign date at service report.");
                }


                if(messages.length !=0 ){
                     transactionView.messager({"message-01":true,
                    "messages":messages});
                }else{
                    callback();
                }

                

            }else{
                
                callback();
            }

          

        }

       
        function subTransactionValidation(cb){

            let {errors,values} = transactionView.validateAndGetTransactionDatas();

            const titles = Object.keys(errors);
            let empty = true;
            const datas = [];
            titles.forEach(t=>{
                if(errors[t].length != 0){
                    datas.push({
                        "title":t,
                        "messages":errors[t]
                    });
                }
            
                empty = empty && errors[t].length == 0;
            });

        

            if(!empty){

                transactionView.messager_5({
                    "datas":datas
                });

            }else{

                async function loading(){

                    transactionView.loader({
                        "loader-01":true
                    });
                }
                loading().then(()=>{

                    transactionView.validateOnDataExist(values,function(errs){

                        const errKeys = Object.keys(errs);
                        let emptyerrs = true;
                        const allerrs = [];
                        errKeys.forEach(t=>{
                            if(errs[t].length != 0){
                                allerrs.push({
                                    "title":t,
                                    "messages":errs[t]
                                });
                            }
                        
                            emptyerrs = emptyerrs && errs[t].length == 0;
                        });

                        if(!emptyerrs){

                            transactionView.messager_5({
                                "datas":allerrs
                            });
                        }else{
                           cb();
                            

                        }   
                      
                        
    
                    });
                });
                

            }

        }

        function subTransaction(transID,cb){

            let {values} = transactionView.validateAndGetTransactionDatas();
            self.ontransactionProcess(transID,values,cb);

        }

        const datas = serviceReportView.getEntryDatas();

        mainValidation(function(){
            serviceReportValidation(datas,function(){
                serviceReportOnDatabaseValidation(datas['service-report-number'],function(){
                    subTransactionValidation(function(){
                        self.insertTransaction(function(res){
                            serviceReportController.insertServiceReport(res.insertId,function(){
                                subTransaction(res.insertId,function(){
                                    transactionModel.setTransID(0);
                                    transactionView.messager({
                                        "message-02":true,
                                        "title":"Genexpert Transaction Message",
                                        "message":`Successfully Transact Data/s`
                                    });

                                    self.clearAll();
                                       
                                    
                                });
                            });
                        });
                    });
                   
                });
               
            });
        });

    }

    ontransactionProcess(transID,values,cb){

        function installationProcess(callback){

            if(values['installation']){
                $(".ldg-box-01 h3").html("Installation Transaction Process...");
                genexpertController.transaction().installation(transID,values['installation'],callback);

            }else{
                callback();
            }
            
        }

        function repairProcess(callback){

            if(values['repair']){

                $(".ldg-box-01 h3").html("Repair Transaction Process...");
                genexpertController.transaction().repair(transID,values['repair'],callback);

            }else{
                callback();
            }
        }


        function transferProcess(callback){

            if(values['transfer']){

                $(".ldg-box-01 h3").html("Transfer Transaction Process...");
                genexpertController.transaction().transfer(transID,values['transfer'],callback);

            }else{
                callback();
            }
        }

        function pulloutProcess(callback){

            
            if(values['pullout']){
                $(".ldg-box-01 h3").html("Pull-out Transaction Process...");
                genexpertController.transaction().pullout(transID,values['pullout'],callback);
            }else{
                callback();
            }
        }

        
        function otherProcess(callback){

            
            if(values['other']){
                $(".ldg-box-01 h3").html("Other Transaction Process...");
                genexpertController.transaction().others(transID,values['other'],callback);
            }else{
                callback();
            }
        }

        function xpertcheckProcess(callback){

           

            if(values['xpertcheck']){
                $(".ldg-box-01 h3").html("Xpertcheck/Calibration Transaction Process...");
                xpertcheckController.transaction().schedule(transID,values['xpertcheck'],callback);
            }else{
                callback();
            }
        }

        function preventive_maintenance_process(callback){

           
            if(values['preventive-maintenance']){
                $(".ldg-box-01 h3").html("Maintenance Transaction Process...");
                preventiveMaintenanceController.transaction()
                .schedule(transID,values['preventive-maintenance'],callback);
            }else{
                callback();
            }
        }

        function moduleProcess(cb){

            if(values['modules']){


                const module_ = values['modules'];

                function newInstallation(my_callb){


                    if(module_['new-installation']){

                        $(".ldg-box-01 h3").html("Module New Installation Process...");
    
                        const new_installations = module_['new-installation'];
    
                        function newInstallationProcess(count,callback){
                            if(count < new_installations.length){
    
                                const datas = new_installations[count];
                                moduleController.newModule(transID,datas,function(){
                                    count++;
                                    newInstallationProcess(count,callback);
                                });
    
                            }else{
                                callback();
                            }
                        }
    
    
                        newInstallationProcess(0,my_callb);
    
                    }else{
                        my_callb();
                    }
                }

                function replacement(rep_callb){

                    if(module_['replacement']){

                        $(".ldg-box-01 h3").html("Module Replacement Process...");
    
                        const replacements = module_['replacement'];
    
                        function replacementProcess(count,callback){
    
                            if(count < replacements.length){
    
                                const datas = replacements[count];
                                moduleController.replaceModule(transID,datas,function(){
                                    count++;
                                    replacementProcess(count,callback);
                                });
    
                            }else{
                                callback();
                            }
                        }

                        replacementProcess(0,rep_callb);
    
                    }else{
                        rep_callb();
                    }
                }

                newInstallation(function(){
                    replacement(cb);
                });

               
            }else{
                cb();
            }

        }

        
        installationProcess(function(){
            repairProcess(function(){
                transferProcess(function(){
                    pulloutProcess(function(){
                        otherProcess(function(){
                            xpertcheckProcess(function(){
                                preventive_maintenance_process(function(){
                                    moduleProcess(cb);
                                });
                            });
                        });
                    });
                });    
            });
        });
       


    }

    otherTransaction(mainTransaction,serviceReportTransaction,success){
        
        const otherSpecify = $("#transaction-others-specify-field").val();

        if(otherSpecify == ""){
            transactionView.messager({"message-01":true,
            "messages":['Please provide other specify']});
        }else{
            mainTransaction(function(){
                serviceReportTransaction(function(){
                    success({
                        "message-02":true,
                        "title":"Other Transaction message",
                        "message":`Transact Successfully`
                    });
                });
            });
        }

      
    }

    maintenanceTransaction(mainTransaction,serviceReportTransaction,success){

        const xpertcheck_needed = $("#transaction-xpertcheck-needed-field");
        const maintenance_needed = $("#transaction-maintenance-needed-field");
       
       
        // validation
        function validating(){

            const errs = [];
            if(xpertcheck_needed.prop("checked") === true){
              
                const xpertcheck_changes = xpertcheckController.onView()
                .transaction().getXpertcheckOnTransactionEntries();
                
                if(xpertcheck_changes['start-calibration'] == ""){
                    errs.push(`Please provide date of calibration`);
                }
                if(xpertcheck_changes['end-calibration'] == ""){
                    errs.push(`Please provide date of end of calibration`);
                }
                if(xpertcheck_changes['calibrate-by'] == ""){
                    errs.push(`Please select engineer`);
                }
            }else if(maintenance_needed.prop("checked") === true){
                const maintenance_changes = preventiveMaintenanceController
                .onView().transaction().getMaintenanceData();

                if(maintenance_changes['start-maintenance'] == ""){
                    errs.push(`Please provide date of maintenance`);
                }
                if(maintenance_changes['end-maintenance'] == ""){
                    errs.push(`Please provide date of end of maintenance`);
                }
                if(maintenance_changes['create-by'] == ""){
                    errs.push(`Please select engineer`);
                }
            }


            
            if(errs.length != 0){
                transactionView.messager({"message-01":true,
                "messages":errs});
            }

            return errs.length == 0;

        }


        if(validating()){

            function xpertcheckTransaction(callback){
                if(xpertcheck_needed.prop("checked") === true){
                    xpertcheckController.transaction().createXpertcheckOnTransaction(function(){
                        callback();
                    });
                }else{
                    callback();
                }
            }

            function preventiveMaintenanceTransaction(callback){
                if(maintenance_needed.prop("checked") === true){
                    preventiveMaintenanceController.transaction().createMaintenanceOnTransaction(function(){
                        callback();
                    });
                }else{
                    callback();
                }
            }

            xpertcheckTransaction(function(){
                preventiveMaintenanceTransaction(function(){
                    mainTransaction(function(){
                        serviceReportTransaction(function(){
                            success({
                                "message-02":true,
                                "title":"Genexpert Calibration and Maintenance Message",
                                "message":`Successfully Create New Calibration and Maintenance`
                            });
                        });
                    });
                });
            });

        }
        



        

        

    }


    getAllTransactions(callback){
        transactionModel.process().select(function(res){
            callback(res);
        });
    }

    insertTransaction(callback){
        transactionModel.process().insert(function(res){
            callback(res);
        });
      
    }

    filterProcess(){
        var self = this;
        this.showList(true,function(){
            self.onFilterView(self.div);
        });

    }

    showList(showLoad = true,callback,sortedDatas){

        const filters = transactionView.getFilter();
        const limitOffset = transactionView.getLimitOffset();
        let limit = limitOffset['limit'];
        let offset = limitOffset['offset'];
        let pageNum = limitOffset['page-num'];
       
        async function onProcess(options){

            options['start']();
            
            const transactionTotal = async function(){
                    
                return await new Promise(resolve=>{
                    transactionModel.process().getTotal(filters,
                       function(res){
                            resolve(res[0]['transTotal']);
                        
                    });
                });
            }

            const getTransactions = async function(){

                return await new Promise(resolve=>{
                    transactionModel.process().selectAll(filters,limit,offset,function(res){
                        resolve(res);
                    });
                });
            }
           
            transactionTotal().then(total=>{

                const totalPage = Math.ceil(total/limit);
                if(totalPage-pageNum == 0){
                  
                   $(`#transaction-index-pagination .pagination-paging-control > 
                   .pagination-next > a`).addClass('a-disabled');
                }else if(totalPage == 1){
                    $(`#transaction-index-pagination .pagination-paging-control > 
                    .pagination-next > a`).addClass('a-disabled');
                }else{
                    $(`#transaction-index-pagination .pagination-paging-control > 
                   .pagination-next > a`).removeClass('a-disabled');
                }

                if(pageNum == 1 || isNaN(pageNum)){
                    $(`#transaction-index-pagination .pagination-paging-control > 
                    .pagination-previous > a`).addClass('a-disabled');
                }else{
                    $(`#transaction-index-pagination .pagination-paging-control > 
                    .pagination-previous > a`).removeClass('a-disabled');
                }
                
                getTransactions().then(datas=>{
                    options['results'](total,datas);
                });
            });
           
        }
        if(sortedDatas){


            transactionView.exitScreen();
            transactionView.displayList(sortedDatas,callback);
            // genexpertView.list().display({
            //    "datas":sortedDatas,offset,"total":null,"limit":limit,"done":function(){
            //         callback();
            //    }});
            
            
        }else{

            onProcess({
                "start":function(){
                    
                    if(showLoad){
                        transactionView.loader({
                            "loader-01":true
                        });
                    }
                   
                },
                "results":function(total,datas){

                    transactionView.displayList(datas,function(){
                        transactionView.displayPaginationInfo(total);
                    });

                }
            }).then(()=>{

                transactionView.exitScreen();
                if(callback){
                    callback();
                }
               
    
            });
        }
        

    }








}
const transactionController = new TransactionController();
module.exports = transactionController;