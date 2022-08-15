const genexpertModel = require("../models/GenexpertModel");
const genexpertView = require("../views/GenexpertView");
const {facilityEntry,updateFacility} = require("./FacilityController");
const {insertContacts,updateContacts} = require("./ContactController");
const {insertAssayStatistic,updateAssaystatistic} = require("./AssayStatisticController");
const {insertPeripheral,updatePeripheral} = require("./PeripheralController");
const {insertModule,updateModule} = require("./ModuleController");
const serviceReportController = require("./ServiceReportController");
const moduleController = require("./ModuleController");
const PaginationController = require("./PaginationController");
const reportLibrary = require("../../supporters/sections/ReportLibrary");
const { getOnDate } = require("../../supporters/sections/RequestSection");
const assayStatisticController = require("./AssayStatisticController");
const peripheralController = require("./PeripheralController");
const xpertcheckController = require("./XpertcheckController");
const preventiveMaintenanceController = require("./PreventiveMaintenanceController");
const reportView = require("../views/ReportView");
// const { ipcRenderer } = require("electron");

// const accountController = require("./AccountController");
class GenexpertController{
    constructor(){
        
        this.paginationController = new PaginationController();
        this.paginationController.pageNum =  `#genexpert-index-pagination > 
        .pagination-paging-control > .pagination-select > input`;
        
        // console.log(accountController.getLoggedIn());
        this.currentTop = 'genexpert-list';
        
        // ipcRenderer.send('app-auto-update','');
        // let count = 1;
        // setInterval(function(){
        //     console.log(`App Update #${count}`);
        //     ipcRenderer.send('app-auto-update','');
        //     count++;
        // },10000);
        
        
    }
    testing(){
        
    }

    setFrameActive(div){
       
        $(div).addClass("frame-control-active").parent("li")
        .siblings().children("a").removeClass("frame-control-active");
    }

    reloading(callback){
        
       this.showGenexpertList(false,callback);

    }
    onView(){
        return genexpertView;
    }
    onPagination(){

        var self = this;
        return this.paginationController.paginationControl(function(){
            self.showGenexpertList();
        });
    }

    onDatas(){

        function getAllGenexpert(callback){

            const getGenexpert = async function(){

                return await new Promise(resolve=>{
                   genexpertModel.process().getGenexpert({
                        "filters":"","limit":null,"offset":null,
                        "results":function(res){
                            resolve(res);
                        }
                    });
                });
            }

            getGenexpert().then(datas=>{
                callback(datas);
            });
        }

        function getGenexpert(callback){

            const filters = genexpertView.userInterfaces().getFilters();
            const getGenexpertProcess = async function(){

                return await new Promise(resolve=>{
                   genexpertModel.process().getGenexpert({
                        filters,"limit":null,"offset":null,
                        "results":function(res){
                            resolve(res);
                        }
                    });
                });
            }

            getGenexpertProcess().then(datas=>{
                callback(datas);
            });

        }

        return {getAllGenexpert,getGenexpert}
    }

    getGenexpertViaFacility(facility,callback){
        genexpertModel.process().getGenexpertViaFacility(facility,callback);
    }

    showGenexpertList(showLoad = true,callback,sortedDatas){

        const filters = genexpertView.userInterfaces().getFilters();
        const limitOffset = genexpertView.userInterfaces().getLimitOffset();
        let limit = limitOffset['limit'];
        let offset = limitOffset['offset'];
        let pageNum = limitOffset['page-num'];
        genexpertView.container = "#genexpert-frame-area";
        genexpertView.screenName = "genexpert-process-screen";

        async function startLoader(showLoad){
            if(showLoad){
                genexpertView.loader({
                    "loader-01":true
                });
            }
           
        }

  

       
        async function onProcess(options){

            const genexpertTotal = async function(){
                    
                return await new Promise(resolve=>{
                    genexpertModel.process().genexpertTotal({
                        filters,
                        "results":function(res){
                            resolve(res[0]['assetTotal']);
                        }
                    });
                });
            }

            const getGenexpert = async function(){

                return await new Promise(resolve=>{
                   genexpertModel.process().getGenexpert({
                        filters,limit,offset,
                        "results":function(res){
                            resolve(res);
                        }
                    });
                });
            }


            startLoader(showLoad).then(()=>{
                genexpertTotal().then(total=>{

                    const totalPage = Math.ceil(total/limit);
                    if(totalPage-pageNum == 0){
                      
                       $(`#genexpert-index-pagination .pagination-paging-control > 
                       .pagination-next > a`).addClass('a-disabled');
                    }else if(totalPage == 1){
                        $(`#genexpert-index-pagination .pagination-paging-control > 
                        .pagination-next > a`).addClass('a-disabled');
                    }else{
                        $(`#genexpert-index-pagination .pagination-paging-control > 
                       .pagination-next > a`).removeClass('a-disabled');
                    }
    
                    if(pageNum == 1 || isNaN(pageNum)){
                        $(`#genexpert-index-pagination .pagination-paging-control > 
                        .pagination-previous > a`).addClass('a-disabled');
                    }else{
                        $(`#genexpert-index-pagination .pagination-paging-control > 
                        .pagination-previous > a`).removeClass('a-disabled');
                    }
                    
                    getGenexpert().then(datas=>{
                        options['results'](total,datas);
                    });
                });
            });
            
          
            
        }



        if(sortedDatas){

            genexpertView.list().display({
               "datas":sortedDatas,offset,"total":null,"limit":limit,"done":function(){
                    callback();
                    genexpertView.exitScreen();
               }});
            
            
        }else{

            onProcess({
                "results":function(total,datas){

                    genexpertView.list().display({
                       datas,offset,total,limit,"done":function(){
                        genexpertView.list().displayPaginationInfo(limit,offset,total);
                       }});

                       genexpertView.exitScreen();
                    
                }
            }).then(()=>{

                
                if(callback){
                    genexpertView.exitScreen();
                    callback();
                    
                }
               
    
            });
        }
        

        

    }

    showGenexpertRecords(showLoad = true,callback){

        async function getRecordProcess(options){

            options['start']();
            
            const genexpertTotal = async function(){
                    
                return await new Promise(resolve=>{
                    genexpertModel.process().genexpertTotal({
                        filters,
                        "results":function(res){
                            resolve(res[0]['assetTotal']);
                        }
                    });
                });
            }

            const getGenexpert = async function(){

                return await new Promise(resolve=>{
                   genexpertModel.process().getGenexpert({
                        filters,limit,offset,
                        "results":function(res){
                            resolve(res);
                        }
                    });
                });
            }
           
            genexpertTotal().then(total=>{

                const totalPage = Math.ceil(total/limit);
                if(totalPage-pageNum == 0){
                  
                   $(`#genexpert-index-pagination .pagination-paging-control > 
                   .pagination-next > a`).addClass('a-disabled');
                }else if(totalPage == 1){
                    $(`#genexpert-index-pagination .pagination-paging-control > 
                    .pagination-next > a`).addClass('a-disabled');
                }else{
                    $(`#genexpert-index-pagination .pagination-paging-control > 
                   .pagination-next > a`).removeClass('a-disabled');
                }

                if(pageNum == 1 || isNaN(pageNum)){
                    $(`#genexpert-index-pagination .pagination-paging-control > 
                    .pagination-previous > a`).addClass('a-disabled');
                }else{
                    $(`#genexpert-index-pagination .pagination-paging-control > 
                    .pagination-previous > a`).removeClass('a-disabled');
                }
                
                getGenexpert().then(datas=>{
                    options['results'](total,datas);
                });
            });
           
        }
    }

    transaction(){

        var self = this;
        function search(sn,callback){
            genexpertModel.process().findGenexpertViaSerialNumber(sn,callback);
        }

        function isSerialNumberExist(serialnumber,ifexist,ifnotexist){
            genexpertModel.process().checkExist(serialnumber,ifexist,ifnotexist);
        }
        
        function installationOnTransaction(mainTransaction,serviceReportTransaction,err,success){
            
            
                if(genexpertView.transaction().installation().validate()){

                    const datas = genexpertView.transaction().installation().entries();

                    datas['genexpert']['serial-number'] = genexpertView.transaction().installation().getSerialnumberValue();
                            
                            // check genexpert serial number is exist
                            genexpertModel.process().checkExist(datas['genexpert']['serial-number'],
                            function(){
                                // if exist
                                err("Serial Number already exist!");
                            },function(){
                                // if not exist

                                const modules_sn_group = datas['modules'].map(v=>{
                                    return v['module-serial-number'];
                                });

    
                                function isThereDuplicate(arr) {
                                    return new Set(arr).size !== arr.length;
                                }
        
                                if(isThereDuplicate(modules_sn_group)){
                                    // If duplicate module serial number entries
                                  
                                    err("Duplicate module serial number");
                                }else{
                                    // If not duplicate module serial number entries
        
                                    // check if module serial number is exist in database
                                    moduleController.checkModuleExist(modules_sn_group,function(list){
                                        
                                        // if exist module serial number in database
                                       
                                        const messages =  [...new Set(JSON.parse(JSON.stringify(list)))].map(v=>{
                                            return `${v['serialnumber']} already exist`;
                                        });
                                        err(messages);
        
                                    },function(){
        
                                        // if not exist module serial number in database
                                        genexpertModel.process().singleEntryProcess(
                                            datas,[insertFacility,insertContacts,
                                                insertAssayStatistic,
                                            insertPeripheral,insertModule],function(){

                                                mainTransaction(function(){
                                                    serviceReportTransaction(function(){
                                                        // reload page for changes
                                                        self.reloading(function(){
                
                                                            genexpertView.container = "#transaction-frame-area";
                                                            success({
                                                                "message-02":true,
                                                                "title":"Genexpert Installation Message",
                                                                "message":`Successfully Insert New Data`
                                                            });
                
                                                            genexpertView.transaction().installation().clearAll();
                                                        });
                                                    });
                                                });
                                        });
                                    })
                                }
                            });
    
                  
                }
            
        }

        function installation(transID,datas,done){
            
            genexpertModel.setTransID(transID);
            genexpertModel.process().singleEntryProcess(
                datas,[facilityEntry,insertContacts,
                    insertAssayStatistic,
                insertPeripheral,insertModule],done);
        }

        function repair(transID,datas,done){
            
            genexpertModel.setTransID(transID);
            genexpertModel.process().transaction().repair(datas,done);
        }

        function transfer(transID,datas,done){

            genexpertModel.setTransID(transID);
            genexpertModel.process().transaction().transfer(datas,done);
        }

        function pullout(transID,datas,done){

            genexpertModel.setTransID(transID);
            genexpertModel.process().transaction().pullout(datas,done);
        }

        function others(transID,datas,done){
            
            genexpertModel.setTransID(transID);
            genexpertModel.process().transaction().others(datas,done);
        }

        
        function history(serialnumber,done){
            
            genexpertModel.process().transaction().history(serialnumber,done);
        }

        function transferOnTransaction(mainTransaction,serviceReportTransaction,err,success){
           
                if(genexpertView.transaction().transfer().validateOnTransferProcess()){

                    const entry = genexpertView.transaction().transfer().getOnTransferEntry();

                  
                            genexpertModel.process().checkExist(entry['serial-number'],
                            function(){

                                
                                genexpertModel.process().genexpertTransfer(function(entry){
                                    genexpertView.container = "#transaction-frame-area";

                                    mainTransaction(function(){
                                        serviceReportTransaction(function(){
                                            success({
                                                "message-02":true,
                                                "title":"Genexpert Transfer Message",
                                                "message":`Successfully Transfer genexpert ${entry['serial-number']} to 
                                                ${entry['new-facility']}`
                                            });

                                            
                                        });
                                    });
                                   
                                });
                            },function(){
                                err("Serial Number not exist!");
                            });


   
                }


        }

        function repairOnTransaction(mainTransaction,serviceReportTransaction,err,success){

            mainTransaction(function(){
                serviceReportTransaction(function(){
                    success({
                        "message-02":true,
                        "title":"Genexpert Repair Message",
                        "message":`Successfully Save Data`
                    });
                });
            });
        }

        function pulloutOnTransaction(mainTransaction,serviceReportTransaction,err,success){

                if(genexpertView.transaction().pullout().validatePulloutEntries()){
                    
                    const datas = genexpertView.transaction()
                    .pullout().getPulloutEntries();

                    genexpertModel.process().checkExist(datas['serial-number'],
                    function(){

                        genexpertModel.process().genexpertPullout(datas,function(res){
                            mainTransaction(function(){
                                serviceReportTransaction(function(){
                                    self.reloading(function(){
                                        success({
                                            "message-02":true,
                                            "title":"Genexpert Pull Out Message",
                                            "message":`Genexpert ${datas['serial-number']} has been Terminated!`
                                        });
                                        
            
                                    });
                                });
                             });
                          
                            
                        });
                       
                    },function(){
                        err("Serial Number not exist!");
                    });

                    
                }
            
        }

        function updateOnModuleReplacement(serialnumber,callback){
            genexpertModel.process().genexpertUpdateOnModuleReplacement(serialnumber,
                function(){
                    callback();
            });
        }




        return {installation,transfer,pullout,repair,others,search,updateOnModuleReplacement,
            installationOnTransaction,transferOnTransaction,repairOnTransaction,
            pulloutOnTransaction,isSerialNumberExist,history};
    }

    update(){

        var self = this;

        function onUpdate(){
            if(genexpertView.info().validateEntryOnUpdate()){

                const datas = genexpertView.info().getUpdatedDatasOnly();
                genexpertModel.process().genexpertUpdateDatas(datas,updateFacility,
                    insertContacts,updateContacts,insertAssayStatistic,updateAssaystatistic,
                    insertPeripheral,updatePeripheral,updateModule
                    ,function(){  
                       
                    self.reloading(function(){
                        genexpertView.container = `#genexpert-information-area`; 
                        genexpertView.messager({
                            "message-02":true,
                            "title":"Genexpert Update Message",
                            "message":`Successfully Update genexpert`
                        });

                      
                    });
                        
                       
                       
                    // });  
                })



            }

           
            

        }

        return {onUpdate};

    }

    showRecordView(div){


        this.setFrameActive(div);
        $("#genexpert-list-area").addClass("hideToLeft");
        showSubForm("#genexpert-record-area","left");
        this.currentTop = 'genexpert-record';
 
       
        // hideSubForm("#genexpert-list-area","left");
        // showSubForm("#genexpert-record-area","left");

        
        
    }

    sapProcess(genDatas,modDatas,assaDatas){
        
        async function onLoader(){
            genexpertView.loader({
                "loader-01":true
            });
        }
       
        onLoader();
        genexpertModel.process().SAPProcess(genDatas,modDatas,assaDatas,function(){
            genexpertView.exitScreen();
        });
    }

    backToListView(){
        
        $("#genexpert-list-area").removeClass("hideToLeft");
        hideSubForm("#genexpert-record-area","left");
        this.currentTop = 'genexpert-list';
        
    }

    showDataList(div){

        if(this.currentTop == 'genexpert-record'){
            this.backToListView();
            
        }
        this.setFrameActive(div);
    }

    onFilterView(div){
        genexpertView.toggleFilter(div,'#genexpert-filter-area');
        this.div = div;
    }

    filterProcess(div){

        var self = this;

        $( `#genexpert-index-pagination > 
        .pagination-paging-control > .pagination-select > input`).val(1);
        this.showGenexpertList(true,function(){
            self.onFilterView(self.div);
            genexpertView.exitScreen();
            
        });
        
        
    }

    onReport(){

        var self = this;

        function listAllDatasInExcel(){

            async function loader(){
                const v = self.onView();
                v.screenName="report-process-screen";
                v.container = "#genexpert-frame-area";
                 v.loader({
                     "loader-01":true
                 });
            }

            loader();

            reportLibrary.saveFile_and_return().then(p=>{
   
                const exc = reportLibrary.excel().exporting();
                const workbook = exc.createWorkBook();
                const sheets =  ['Genexpert','Module','Assaystatistic','Peripheral',
                'Xpertcheck','Preventive Maintenance','Service Report'];

                //creating all sheets
                sheets.forEach(sheet=>{
                       exc.createWorksheet(workbook,sheet); 
                });

              

                // START MODULE AREAS
                moduleController.getEntireModules(function(modules_res){

                    const module_sheet = exc.getWorksheet(workbook,'Module');


                    // Add headers
                    module_sheet.columns = [
                        { header: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                        { header: 'Serial Number', key:'module-serial-number', width: 15},
                        { header: 'Location', key: 'module-location', width: 15 },
                        { header: 'Engineer', key: 'module-engineer', width: 25},
                        { header: 'Date Installed', key: 'module-date-installed', width: 15},
                        { header: 'Installation Type', key: 'module-install-type', width: 25},
                        { header: 'Date Added', key: 'module-date-added', width: 15},
                        { header: 'Date Updated', key: 'module-date-updated', width: 15},
                        { header: 'Added by', key: 'module-added-by', width: 25},
                        { header: 'Updated by', key: 'module-updated-by', width: 25},
                        { header: 'Status', key: 'module-status', width: 15},
                        { header: 'Part Number', key: 'module-part-number', width: 20},
                        { header: 'Revision Number', key: 'module-revision-number', width: 20}
                    ];

                    if(modules_res.length != 0){
                        module_sheet.addTable({
                            name: "ModuleTable".replace(' ', '_'),
                            ref: 'A1',
                            headerRow: true,
                            totalsRow: false,
                            style: {
                            theme: 'TableStyleMedium10',
                            showRowStripes: true,
                            },
                            columns: [
                                { name: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                { name: 'Serial Number', key:'module-serial-number', width: 15},
                                { name: 'Location', key: 'module-location', width: 15 },
                                { name: 'Engineer', key: 'module-engineer', width: 25},
                                { name: 'Date Installed', key: 'module-date-installed', width: 15},
                                { name: 'Installation Type', key: 'module-install-type', width: 25},
                                { name: 'Date Added', key: 'module-date-added', width: 15},
                                { name: 'Date Updated', key: 'module-date-updated', width: 15},
                                { name: 'Added by', key: 'module-added-by', width: 25},
                                { name: 'Updated by', key: 'module-updated-by', width: 25},
                                { name: 'Status', key: 'module-status', width: 15},
                                { name: 'Part Number', key: 'module-part-number', width: 20},
                                { name: 'Revision Number', key: 'module-revision-number', width: 20}
                            ],
                            rows: modules_res.map(d=>{
                                return [
                                    d['genexpertSN'],
                                    d['serialnumber'],
                                    d['location'],
                                    d['fullname'],
                                    getOnDate(d['dateinstalled']) == "2001-01-01"?"None":getOnDate(d['dateinstalled']),
                                    d['itName'] == '-' ? "N/A":d['itName'],
                                    getOnDate(d['dateadded']) == "2001-01-01"?"None":getOnDate(d['dateadded']),
                                    getOnDate(d['dateupdated']) == "2001-01-01"?"None":getOnDate(d['dateupdated']),
                                    d['addedby'],
                                    d['updatedby'],
                                    d['status'],
                                    d['part_number'],
                                    d['revision_number']
                                ]
                            }),
                        
                        });
                    }


                        // START ASSAY STATISTIC AREAS
                        assayStatisticController.getAllAssaystatistic(function(assay_res){
                            
                            const assay_sheet = exc.getWorksheet(workbook,'Assaystatistic');

                            // Add headers
                            assay_sheet.columns = [
                                { header: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                { header: 'Test', key:'assay-test', width: 20},
                                { header: 'Quantity', key: 'assay-quantity', width: 15 },
                                { header: 'Date Added', key: 'assay-date-added', width: 15},
                                { header: 'Date Updated', key: 'assay-date-updated', width: 15},
                                { header: 'Added by', key: 'assay-added-by', width: 15},
                                { header: 'Updated by', key: 'assay-updated-by', width: 15}
                                
                            ];

                            if(assay_res.length != 0){
                                assay_sheet.addTable({
                                    name: "AssayTable".replace(' ', '_'),
                                    ref: 'A1',
                                    headerRow: true,
                                    totalsRow: false,
                                    style: {
                                    theme: 'TableStyleMedium11',
                                    showRowStripes: true,
                                    },
                                    columns: [
                                        { name: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                        { name: 'Test', key:'assay-test', width: 20},
                                        { name: 'Quantity', key: 'assay-quantity', width: 15 },
                                        { name: 'Date Added', key: 'assay-date-added', width: 15},
                                        { name: 'Date Updated', key: 'assay-date-updated', width: 15},
                                        { name: 'Added by', key: 'assay-added-by', width: 15},
                                        { name: 'Updated by', key: 'assay-updated-by', width: 15}
                                    ],
                                    rows: assay_res.map(d=>{
                                        return [
                                            d['genexpertSN'],
                                            d['test'],
                                            d['quantity'],
                                            getOnDate(d['dateadded']) == "2001-01-01"?"None":getOnDate(d['dateadded']),
                                            getOnDate(d['dateupdated']) == "2001-01-01"?"None":getOnDate(d['dateupdated']),
                                            d['addedby'],
                                            d['updatedby']
                                        ]
                                    }),
                                
                                }); 
                            }

                                
                                
                                // START PERIHPERAL AREA
                                peripheralController.getAllPeripheral(function(peri_res){

   
                                    const peri_sheet = exc.getWorksheet(workbook,'Peripheral');


                                    // Add headers
                                    peri_sheet.columns = [
                                        { header: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                        { header: 'Peripheral Name', key:'peri-name', width: 20},
                                        { header: 'Serial Number', key: 'peri-serial-number', width: 15 },
                                        { header: 'Model Number', key: 'peri-model-number', width: 15},
                                        { header: 'Date Added', key: 'peri-date-added', width: 15},
                                        { header: 'Date Updated', key: 'peri-date-updated', width: 15},
                                        { header: 'Added by', key: 'peri-added-by', width: 15},
                                        { header: 'Updated by', key: 'peri-updated-by', width: 15}
                                        
                                    ];

                                    if(peri_res.length != 0){
                                        peri_sheet.addTable({
                                            name: "PeripheralTable".replace(' ', '_'),
                                            ref: 'A1',
                                            headerRow: true,
                                            totalsRow: false,
                                            style: {
                                            theme: 'TableStyleMedium12',
                                            showRowStripes: true,
                                            },
                                            columns: [
                                                { name: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                                { name: 'Peripheral Name', key:'peri-name', width: 20},
                                                { name: 'Serial Number', key: 'peri-serial-number', width: 15 },
                                                { name: 'Model Number', key: 'peri-model-number', width: 15},
                                                { name: 'Date Added', key: 'peri-date-updated', width: 15},
                                                { name: 'Date Updated', key: 'peri-date-updated', width: 15},
                                                { name: 'Added by', key: 'peri-added-by', width: 15},
                                                { name: 'Updated by', key: 'peri-updated-by', width: 15}
                                            ],
                                            rows: peri_res.map(d=>{
                                                return [
                                                    d['genexpertSN'],
                                                    d['peripheralName'],
                                                    d['serialnumber'],
                                                    d['modelnumber'],
                                                    getOnDate(d['dateadded']) == "2001-01-01"?"None":getOnDate(d['dateadded']),
                                                    getOnDate(d['dateupdated']) == "2001-01-01"?"None":getOnDate(d['dateupdated']),
                                                    d['addedby'],
                                                    d['updatedby']
                                                ]
                                            }),
                                        
                                        });
                                    }

                                    //START XPERTCHECK AREAS
                                    xpertcheckController.getAllXpertcheck(function(xpertcheck_res){

                                        const xper_sheet = exc.getWorksheet(workbook,'Xpertcheck');


                                        // Add headers
                                        xper_sheet.columns = [
                                            { header: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                            { header: 'Status', key:'xpertcheck-status', width: 15},
                                            { header: 'Start of Calibration', key:'xpertcheck-start-calib', width: 15},
                                            { header: 'Next Calibration', key: 'xpertcheck-end-calib', width: 15 },
                                            { header: 'Engineer', key: 'xpertcheck-engineer', width: 30},
                                            { header: 'Date Added', key: 'xpertcheck-date-added', width: 15},
                                            { header: 'Date Updated', key: 'xpertcheck-date-updated', width: 15},
                                            { header: 'Added by', key: 'xpertcheck-added-by', width: 30},
                                            { header: 'Updated by', key: 'xpertcheck-updated-by', width: 30}
                                        ];

                                        if(xpertcheck_res.length != 0){
                                            xper_sheet.addTable({
                                                name: "XpertcheckTable".replace(' ', '_'),
                                                ref: 'A1',
                                                headerRow: true,
                                                totalsRow: false,
                                                style: {
                                                theme: 'TableStyleMedium13',
                                                showRowStripes: true,
                                                },
                                                columns: [
                                                    { name: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                                    { name: 'Status', key:'xpertcheck-status', width: 15},
                                                    { name: 'Start of Calibration', key:'xpertcheck-start-calib', width: 15},
                                                    { name: 'End of Calibration', key: 'xpertcheck-end-calib', width: 15 },
                                                    { name: 'Engineer', key: 'xpertcheck-engineer', width: 30},
                                                    { name: 'Date Added', key: 'xpertcheck-date-added', width: 15},
                                                    { name: 'Date Updated', key: 'xpertcheck-date-updated', width: 15},
                                                    { name: 'Added by', key: 'xpertcheck-added-by', width: 30},
                                                    { name: 'Updated by', key: 'xpertcheck-updated-by', width: 30}
                                                ],
                                                rows: xpertcheck_res.map(d=>{
                                                    return [
                                                        d['genexpertSN'],
                                                        d['stat'],
                                                        getOnDate(d['calibrate_start']) == "2001-01-01"?"None":getOnDate(d['calibrate_start']),
                                                        getOnDate(d['calibrate_done']) == "2001-01-01"?"None":getOnDate(d['calibrate_done']),
                                                        getOnDate(d['dateadded']) == "2001-01-01"?"None":getOnDate(d['dateadded']),
                                                        getOnDate(d['dateupdated']) == "2001-01-01"?"None":getOnDate(d['dateupdated']),
                                                        d['addedby'],
                                                        d['updatedby']
                                                    ]
                                                }),
                                        
                                            });
                                        }


                                        //START PREVENTIVE MAINTENANCE AREAS
                                        preventiveMaintenanceController.getAllPreventiveMaintenance(function(pm_res){

                                            const pm_sheet = exc.getWorksheet(workbook,'Preventive Maintenance');
    
    
                                            // Add headers
                                            pm_sheet.columns = [
                                                { header: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                                { header: 'Status', key:'pm-status', width: 15},
                                                { header: 'Start of Maintenance', key:'pm-start-calib', width: 15},
                                                { header: 'Next Maintenance', key: 'pm-end-calib', width: 15 },
                                                { header: 'Engineer', key: 'pm-engineer', width: 30},
                                                { header: 'Date Added', key: 'pm-date-added', width: 15},
                                                { header: 'Date Updated', key: 'pm-date-updated', width: 15},
                                                { header: 'Added by', key: 'pm-added-by', width: 30},
                                                { header: 'Updated by', key: 'pm-updated-by', width: 30}
                                            ];
    
                                            if(pm_res.length != 0){
                                                pm_sheet.addTable({
                                                    name: "PMTable".replace(' ', '_'),
                                                    ref: 'A1',
                                                    headerRow: true,
                                                    totalsRow: false,
                                                    style: {
                                                    theme: 'TableStyleMedium14',
                                                    showRowStripes: true,
                                                    },
                                                    columns: [
                                                        { name: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                                        { name: 'Status', key:'pm-status', width: 15},
                                                        { name: 'Start of Maintenance', key:'pm-start-calib', width: 15},
                                                        { name: 'Next Maintenance', key: 'pm-end-calib', width: 15 },
                                                        { name: 'Engineer', key: 'pm-engineer', width: 30},
                                                        { name: 'Date Added', key: 'pm-date-added', width: 15},
                                                        { name: 'Date Updated', key: 'pm-date-updated', width: 15},
                                                        { name: 'Added by', key: 'pm-added-by', width: 30},
                                                        { name: 'Updated by', key: 'pm-updated-by', width: 30}
                                                    ],
                                                    rows: pm_res.map(d=>{
                                                        return [
                                                            d['genexpertSN'],
                                                            d['stat'],
                                                            getOnDate(d['calibrate_start']) == "2001-01-01"?"None":getOnDate(d['calibrate_start']),
                                                            getOnDate(d['calibrate_done']) == "2001-01-01"?"None":getOnDate(d['calibrate_done']),
                                                            getOnDate(d['dateadded']) == "2001-01-01"?"None":getOnDate(d['dateadded']),
                                                            getOnDate(d['dateupdated']) == "2001-01-01"?"None":getOnDate(d['dateupdated']),
                                                            d['addedby'],
                                                            d['updatedby']
                                                        ]
                                                    }),
                                            
                                                });
                                            }


                                            //START SERVICE REPORT AREAS
                                            serviceReportController.getAllServiceReport("",function(sr_res){
                                                
                                                const sr_sheet = exc.getWorksheet(workbook,'Service Report');
        
                                                // Add headers
                                                sr_sheet.columns = [
                                                    { header: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                                    { header: 'Service Report Number', key:'sr-number', width: 15},
                                                    { header: 'Equipment', key:'sr-equipment', width: 15},
                                                    { header: 'Facility', key: 'sr-facility', width: 30 },
                                                    { header: 'Department', key: 'sr-department', width: 20},
                                                    { header: 'Tel No', key: 'sr-tel-no', width: 25},
                                                    { header: 'Service Type', key: 'sr-type', width: 20},
                                                    { header: 'Problems Reported', key: 'sr-prob-reported', width: 40},
                                                    { header: 'Diagnostic/Findings', key: 'sr-diag-find', width: 40},
                                                    { header: 'Corrective/Action', key: 'sr-corr-action', width: 40},
                                                    { header: 'Comments', key: 'sr-comments', width: 40},
                                                    { header: 'Date Added', key: 'sr-date-added', width: 15},
                                                    { header: 'Date Updated', key: 'sr-date-updated', width: 15},
                                                    { header: 'Added by', key: 'sr-added-by', width: 30},
                                                    { header: 'Updated by', key: 'sr-updated-by', width: 30}
                                                ];

                                                if(sr_res.length != 0){
                                                    sr_sheet.addTable({
                                                        name: "ServiceReportTable".replace(' ', '_'),
                                                        ref: 'A1',
                                                        headerRow: true,
                                                        false: true,
                                                        style: {
                                                        theme: 'TableStyleMedium8',
                                                        showRowStripes: true,
                                                        },
                                                        columns: [
                                                            { name: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                                            { name: 'Service Report Number', key:'sr-number', width: 15},
                                                            { name: 'Equipment', key:'sr-equipment', width: 15},
                                                            { name: 'Facility', key: 'sr-facility', width: 30 },
                                                            { name: 'Department', key: 'sr-department', width: 20},
                                                            { name: 'Tel No', key: 'sr-tel-no', width: 25},
                                                            { name: 'Service Type', key: 'sr-type', width: 20},
                                                            { name: 'Problems Reported', key: 'sr-prob-reported', width: 40},
                                                            { name: 'Diagnostic/Findings', key: 'sr-diag-find', width: 40},
                                                            { name: 'Corrective/Action', key: 'sr-corr-action', width: 40},
                                                            { name: 'Comments', key: 'sr-comments', width: 40},
                                                            { name: 'Date Added', key: 'sr-date-added', width: 15},
                                                            { name: 'Date Updated', key: 'sr-date-updated', width: 15},
                                                            { name: 'Added by', key: 'sr-added-by', width: 30},
                                                            { name: 'Updated by', key: 'sr-updated-by', width: 30}
                                                        ],
                                                        rows: sr_res.map(d=>{
                                                            return [
                                                                d['genexpert_serial_number'],
                                                                d['service_report_num'],
                                                                d['equipment'],
                                                                d['facility'],
                                                                d['department'],
                                                                d['telno'],
                                                                d['service_type'],
                                                                d['problems_reported'],
                                                                d['diagnostic_findings'],
                                                                d['corrective_action'],
                                                                d['comments'],
                                                                getOnDate(d['dateadded']) == "2001-01-01"?"None":getOnDate(d['dateadded']),
                                                                getOnDate(d['dateupdated']) == "2001-01-01"?"None":getOnDate(d['dateupdated']),
                                                                d['addedby'],
                                                                d['updatedby']
                                                            ]
                                                        }),
                                                
                                                    });
                                                }



                                                //START OF GENEXPERT AREAS
                                                genexpertModel.process().getEntireIndividualGenexpert(function(res){
                                                                
                                                    const genexpert_sheet = exc.getWorksheet(workbook,'Genexpert');
        
                                                    // Add headers
        
                                                    genexpert_sheet.columns = [
                                                        { header: 'Serial Number', key:'serial-number', width: 15},
                                                        { header: 'Facility/Site', key: 'facility-site', width: 60 },
                                                        { header: 'Engineer', key: 'engineer', width: 25},
                                                        { header: 'Date Installed', key: 'date-installed', width: 15},
                                                        { header: 'Installation Type', key: 'install-type', width: 25},
                                                        { header: 'Region', key: 'region', width: 30},
                                                        { header: 'Province', key: 'province', width: 30},
                                                        { header: 'City', key: 'city', width: 25},
                                                        { header: 'Barangay', key: 'barangay', width: 25},
                                                        { header: 'Street', key: 'street', width: 35},
                                                        { header: 'Latitude', key: 'latitude', width: 20},
                                                        { header: 'Longitude', key: 'longitude', width: 20},
                                                        { header: 'Module', key: 'module', width: 40},
                                                        { header: 'Peripheral', key: 'peripheral', width: 25},
                                                        { header: 'Assaystatistic', key: 'assaystatistic', width: 25},
                                                        { header: 'Last Xpertcheck', key: 'last-xpertcheck', width: 25},
                                                        { header: 'Last Maintenance', key: 'last-maintenance', width: 25},
                                                        { header: 'Latest Service Report', key: 'latest-service-report', width: 20},
                                                        { header: 'Model Number', key: 'model-number', width: 60},
                                                        { header: 'Date Added', key: 'date-added', width: 15},
                                                        { header: 'Date Updated', key: 'date-updated', width: 15},
                                                        { header: 'Added by', key: 'added-by', width: 25},
                                                        { header: 'Updated by', key: 'updated-by', width: 25},
                                                        { header: 'Status', key: 'status', width: 15},
                                                        { header: 'Software Version', key: 'software-version', width: 20},
                                                        { header: 'OS Version', key: 'os-version', width: 20},
                                                        { header: 'Warranty Expiry Date', key: 'w-ex-date', width: 25},
                                                        { header: 'Service Contract Expiry Date', key: 'sc-ex-date', width: 25}
                                                    ];
        
                                                    if(res.length != 0 ){
                                                        genexpert_sheet.addTable({
                                                            name: 'GenexpertTable',
                                                            ref: 'A1',
                                                            headerRow: true,
                                                            totalsRow: false,
                                                            style: {
                                                            theme: 'TableStyleMedium9',
                                                            showRowStripes: true,
                                                            },
                                                            columns: [
                                                                { name: 'Serial Number', key:'serial-number', width: 15},
                                                                { name: 'Facility/Site', key: 'facility-site', width: 60 },
                                                                { name: 'Engineer', key: 'engineer', width: 25},
                                                                { name: 'Date Installed', key: 'date-installed', width: 15},
                                                                { name: 'Installation Type', key: 'install-type', width: 15},
                                                                { name: 'Region', key: 'region', width: 30},
                                                                { name: 'Province', key: 'province', width: 30},
                                                                { name: 'City', key: 'city', width: 25},
                                                                { name: 'Barangay', key: 'barangay', width: 25},
                                                                { name: 'Street', key: 'street', width: 35},
                                                                { name: 'Latitude', key: 'latitude', width: 20},
                                                                { name: 'Longitude', key: 'longitude', width: 20},
                                                                { name: 'Module', key: 'module', width: 40},
                                                                { name: 'Peripheral', key: 'peripheral', width: 25},
                                                                { name: 'Assaystatistic', key: 'assaystatistic', width: 25},
                                                                { name: 'Last Xpertcheck', key: 'last-xpertcheck', width: 25},
                                                                { name: 'Last Maintenance', key: 'last-maintenance', width: 25},
                                                                { name: 'Latest Service Report', key: 'latest-service-report', width: 20},
                                                                { name: 'Model Number', key: 'model-number', width: 60},
                                                                { name: 'Date Added', key: 'date-added', width: 15},
                                                                { name: 'Date Updated', key: 'date-updated', width: 15},
                                                                { name: 'Added by', key: 'added-by', width: 25},
                                                                { name: 'Updated by', key: 'updated-by', width: 25},
                                                                { name: 'Status', key: 'status', width: 15},
                                                                { name: 'Software Version', key: 'software-version', width: 20},
                                                                { name: 'OS Version', key: 'os-version', width: 20},
                                                                { name: 'Warranty Expiry Date', key: 'w-ex-date', width: 25},
                                                                { name: 'Service Contract Expiry Date', key: 'sc-ex-date', width: 25}
                                                            ],
                                                            rows: res.map(d=>{
                                                                return [
                                                                    d['serialnumber'],
                                                                    d['siteName'],
                                                                    d['fullname'],
                                                                    getOnDate(d['dateinstalled']) == "2001-01-01"?"None":getOnDate(d['dateinstalled']),
                                                                    d['itName'],
                                                                    d['region'],
                                                                    d['province'],
                                                                    d['city'],
                                                                    d['barangay'],
                                                                    d['street'],
                                                                    d['latitude'],
                                                                    d['longitude'],
                                                                    d['moduleSN'] == null ? "N/A":{ text:d['moduleSN'], 
                                                                    hyperlink: `#\'Module\'!${getModuleOnGenexpert(d['serialnumber'])}`},
                                                                    d['peripheralName'] == null ?"N/A":{text:d['peripheralName'], hyperlink:`#\'Peripheral\'!${getPeripheralOnGenexpert(d['serialnumber'])}`},
                                                                    d['assay_group'] == null ? "N/A":{ text: d['assay_group'], hyperlink: `#\'Assaystatistic\'!${getAssayOnGenexpert(d['serialnumber'])}`},
                                                                    d['current_xpertcheck'] == null ? "N/A":{ text: d['current_xpertcheck'], hyperlink: `#\'Xpertcheck\'!${getXpertcheckOnGenexpert(d['serialnumber'])}` },
                                                                    d['current_preventive_maintenance'] == null?"N/A":{ text: d['current_preventive_maintenance'], hyperlink: 
                                                                    `#\'Preventive Maintenance\'!${getPreventiveMaintenanceOnGenexpert(d['serialnumber'])}` },
                                                                    d['service_report_number'] == null?"N/A":{ text: d['service_report_number'], hyperlink: `#\'Service Report\'!${getServiceReportOnGenexpert(d['serialnumber'])}`},
                                                                    d['mnName'],
                                                                    getOnDate(d['dateadded']) == "2001-01-01"?"None":getOnDate(d['dateadded']),
                                                                    getOnDate(d['dateupdated']) == "2001-01-01"?"None":getOnDate(d['dateupdated']),
                                                                    d['addedby'],
                                                                    d['updatedby'],
                                                                    d['status'],
                                                                    d['software_version'],
                                                                    d['os_version'],
                                                                    getOnDate(d['warranty_expiry_date']) == "2001-01-01"?"None":getOnDate(d['warranty_expiry_date']),
                                                                    getOnDate(d['service_contract_expiry_date']) == "2001-01-01"?"None":getOnDate(d['service_contract_expiry_date'])
                                                                ]
                                                            }),
                                                        });
                                                    }

        
                                                        
                                                    function getModuleOnGenexpert(sn){
        
                                                        let row_detected = [];
                                                        let col_detected = 0;
        
                                                        let finalLocation = "";
                                                        module_sheet.eachRow(function(row, rowNumber) {
        
                                                            row.eachCell(function(cell, colNumber) {
                                                                if(cell.value == sn && colNumber == 1){
                                                                    row_detected.push(rowNumber);
                                                                }
                                                                col_detected = colNumber;    
                                                            });
        
                                                            if(row_detected.length != 0){
                                                                finalLocation = `A${row_detected[0]}:M${row_detected[row_detected.length-1]}`;
                                                            }
                                                            
                                                        });
        
                                                        return finalLocation;
                                                    }
        
                                                    function getAssayOnGenexpert(sn){
        
                                                        let row_detected = [];
                                                        let col_detected = 0;
        
                                                        let finalLocation = "";
                                                        assay_sheet.eachRow(function(row, rowNumber) {
        
                                                            row.eachCell(function(cell, colNumber) {
                                                                if(cell.value == sn && colNumber == 1){
                                                                    row_detected.push(rowNumber);
                                                                }
                                                                col_detected = colNumber;    
                                                            });
        
                                                            if(row_detected.length != 0){
                                                                finalLocation = `A${row_detected[0]}:G${row_detected[row_detected.length-1]}`;
                                                            }
                                                            
                                                        });
        
                                                        return finalLocation;
                                                    }

                                                    function getPeripheralOnGenexpert(sn){
        
                                                        let row_detected = [];
                                                        let col_detected = 0;
        
                                                        let finalLocation = "";
                                                        peri_sheet.eachRow(function(row, rowNumber) {
        
                                                            row.eachCell(function(cell, colNumber) {
                                                                if(cell.value == sn && colNumber == 1){
                                                                    row_detected.push(rowNumber);
                                                                }
                                                                col_detected = colNumber;    
                                                            });
        
                                                            if(row_detected.length != 0){
                                                                finalLocation = `A${row_detected[0]}:H${row_detected[row_detected.length-1]}`;
                                                            }
                                                            
                                                        });
        
                                                        return finalLocation;
                                                    }

                                                    
                                                    function getXpertcheckOnGenexpert(sn){
        
                                                        let row_detected = [];
                                                        let col_detected = 0;
        
                                                        let finalLocation = "";
                                                        xper_sheet.eachRow(function(row, rowNumber) {
        
                                                            row.eachCell(function(cell, colNumber) {
                                                                if(cell.value == sn && colNumber == 1){
                                                                    row_detected.push(rowNumber);
                                                                }
                                                                col_detected = colNumber;    
                                                            });
        
                                                            if(row_detected.length != 0){
                                                                finalLocation = `A${row_detected[0]}:I${row_detected[row_detected.length-1]}`;
                                                            }
                                                            
                                                        });
        
                                                        return finalLocation;
                                                    }
                                                    function getPreventiveMaintenanceOnGenexpert(sn){
        
                                                        let row_detected = [];
                                                        let col_detected = 0;
        
                                                        let finalLocation = "";
                                                        pm_sheet.eachRow(function(row, rowNumber) {
        
                                                            row.eachCell(function(cell, colNumber) {
                                                                if(cell.value == sn && colNumber == 1){
                                                                    row_detected.push(rowNumber);
                                                                }
                                                                col_detected = colNumber;    
                                                            });
        
                                                            if(row_detected.length != 0){
                                                                finalLocation = `A${row_detected[0]}:I${row_detected[row_detected.length-1]}`;
                                                            }
                                                            
                                                        });
        
                                                        return finalLocation;
                                                    }

                                                    function getServiceReportOnGenexpert(sn){
        
                                                        let row_detected = [];
                                                        let col_detected = 0;
        
                                                        let finalLocation = "";
                                                        sr_sheet.eachRow(function(row, rowNumber) {
        
                                                            row.eachCell(function(cell, colNumber) {
                                                                if(cell.value == sn && colNumber == 1){
                                                                    row_detected.push(rowNumber);
                                                                }
                                                                col_detected = colNumber;    
                                                            });
        
                                                            if(row_detected.length != 0){
                                                                finalLocation = `A${row_detected[0]}:O${row_detected[row_detected.length-1]}`;
                                                            }
                                                            
                                                        });
        
                                                        return finalLocation;
                                                    }




        
                                                    const v = self.onView();
        
                                                    exc.exec(workbook,p,function(){
                                                        v.messager({
                                                            "message-02":true,
                                                            "title":"Report Message",
                                                            "message":`Successfully Create Report`
                                                        });
                                                    });
                                                
                                                        
                                                });//END OF GENEXPERT AREAS
    


                                            });//END SERVICE REPORT AREAS
    
                                            
                                           
                                        });//END PREVENTIVE MAINTENANCE AREAS


                                       

                                    });//END XPERTCHECK AREAS





                                       



                                });//END OF PERIPHERAL AREA


                                
                                                             


                        }); //END ASSAY STATISTIC AREA


                    

                       


                });// END MODULE AREAS

            });

            // reportLibrary.saveFile(function(p){

                
            
                
            // },function(){
            //     const v = self.onView();
            //     v.screenName="report-process-screen";
            //     v.container = "#genexpert-frame-area";
            //      v.loader({
            //          "loader-01":true
            //      });
            // });


        }


        function linker(sheetName,sn,end_column){
        
            let row_detected = [];
            let col_detected = 0;

            let finalLocation = "";
            sheetName.eachRow(function(row, rowNumber) {

                row.eachCell(function(cell, colNumber) {
                    if(cell.value == sn && colNumber == 1){
                        row_detected.push(rowNumber);
                    }
                    col_detected = colNumber;    
                });

                if(row_detected.length != 0){
                    finalLocation = `A${row_detected[0]}:${end_column}${row_detected[row_detected.length-1]}`;
                }
                
            });

            return finalLocation;
        }

        function listFilterDatasInExcel(){

            async function loader(){
                const v = self.onView();
                v.screenName="report-process-filter-screen";
                v.container = "#genexpert-frame-area";
                 v.loader({
                     "loader-01":true
                 });
            }

            loader();

            reportLibrary.saveFile_and_return().then(p=>{

                const exc = reportLibrary.excel().exporting();
                const workbook = exc.createWorkBook();
                const sheets =  ['Genexpert','Module','Assaystatistic','Peripheral',
                'Xpertcheck','Preventive Maintenance','Service Report'];

                 //creating all sheets
                 sheets.forEach(sheet=>{
                    exc.createWorksheet(workbook,sheet); 
                });

                self.onDatas().getGenexpert(function(res){

                    const classifiedDatas = genexpertView.list().classifyingData(res);

                    const module_sheet = exc.getWorksheet(workbook,'Module');
                    const modules_res = classifiedDatas['modules'];

                    const peri_sheet = exc.getWorksheet(workbook,'Peripheral');
                    const peri_res = classifiedDatas['peripherals'];

                    const assay_sheet = exc.getWorksheet(workbook,'Assaystatistic');
                    const assay_res = classifiedDatas['assaystatistics'];

                    function threeProcess(callback){

                        async function moduleProcess(){
                             // START MODULE AREAS

 
                             // Add headers
                             module_sheet.columns = [
                             { header: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                             { header: 'Serial Number', key:'module-serial-number', width: 15},
                             { header: 'Location', key: 'module-location', width: 15 },
                             { header: 'Engineer', key: 'module-engineer', width: 25},
                             { header: 'Date Installed', key: 'module-date-installed', width: 15},
                             { header: 'Installation Type', key: 'module-install-type', width: 25},
                             { header: 'Date Added', key: 'module-date-added', width: 15},
                             { header: 'Date Updated', key: 'module-date-updated', width: 15},
                             { header: 'Added by', key: 'module-added-by', width: 25},
                             { header: 'Updated by', key: 'module-updated-by', width: 25},
                             { header: 'Status', key: 'module-status', width: 15},
                             { header: 'Part Number', key: 'module-part-number', width: 20},
                             { header: 'Revision Number', key: 'module-revision-number', width: 20}
                             ];
 
                             if(modules_res.length != 0){
                                module_sheet.addTable({
                                    name: "FilterModuleTable".replace(' ', '_'),
                                    ref: 'A1',
                                    headerRow: true,
                                    totalsRow: false,
                                    style: {
                                    theme: 'TableStyleMedium10',
                                    showRowStripes: true,
                                    },
                                    columns: [
                                        { name: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                        { name: 'Serial Number', key:'module-serial-number', width: 15},
                                        { name: 'Location', key: 'module-location', width: 15 },
                                        { name: 'Engineer', key: 'module-engineer', width: 25},
                                        { name: 'Date Installed', key: 'module-date-installed', width: 15},
                                        { name: 'Installation Type', key: 'module-install-type', width: 25},
                                        { name: 'Date Added', key: 'module-date-added', width: 15},
                                        { name: 'Date Updated', key: 'module-date-updated', width: 15},
                                        { name: 'Added by', key: 'module-added-by', width: 25},
                                        { name: 'Updated by', key: 'module-updated-by', width: 25},
                                        { name: 'Status', key: 'module-status', width: 15},
                                        { name: 'Part Number', key: 'module-part-number', width: 20},
                                        { name: 'Revision Number', key: 'module-revision-number', width: 20}
                                    ],
                                    rows: modules_res.map(d=>{
                                        return [
                                            d['modu_genexpertSN'],
                                            d['modu_serialnumber'],
                                            d['modu_location'],
                                            d['modu_eng_fullname'],
                                            getOnDate(d['modu_dateinstalled']) == "2001-01-01"?"None":
                                            getOnDate(d['modu_dateinstalled']),
                                            d['modu_inst_itName'] == '-' ? "N/A":d['modu_inst_itName'],
                                            getOnDate(d['modu_dateadded']) == "2001-01-01"?"None":
                                            getOnDate(d['modu_dateadded']),
                                            getOnDate(d['modu_dateupdated']) == "2001-01-01"?"None":
                                            getOnDate(d['modu_dateupdated']),
                                            `${d['modu_user_addedby_firstname']} ${d['modu_user_addedby_lastname']}`,
                                            `${d['modu_user_updatedby_firstname']} ${d['modu_user_updatedby_lastname']}`,
                                            d['modu_status'],
                                            d['modu_part_number'],
                                            d['modu_revision_number']
                                        ]
                                    }),
        
                                    });
                             }

 
                             // END MODULE AREAS


                        }

                        async function periProcess(){

                            // Add headers
                            peri_sheet.columns = [
                                { header: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                { header: 'Peripheral Name', key:'peri-name', width: 20},
                                { header: 'Serial Number', key: 'peri-serial-number', width: 15 },
                                { header: 'Model Number', key: 'peri-model-number', width: 15},
                                { header: 'Date Added', key: 'peri-date-added', width: 15},
                                { header: 'Date Updated', key: 'peri-date-updated', width: 15},
                                { header: 'Added by', key: 'peri-added-by', width: 15},
                                { header: 'Updated by', key: 'peri-updated-by', width: 15}
                                
                            ];

                            if(peri_res.length != 0){
                                peri_sheet.addTable({
                                    name: "FilterPeripheralTable".replace(' ', '_'),
                                    ref: 'A1',
                                    headerRow: true,
                                    totalsRow: false,
                                    style: {
                                    theme: 'TableStyleMedium12',
                                    showRowStripes: true,
                                    },
                                    columns: [
                                        { name: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                        { name: 'Peripheral Name', key:'peri-name', width: 20},
                                        { name: 'Serial Number', key: 'peri-serial-number', width: 15 },
                                        { name: 'Model Number', key: 'peri-model-number', width: 15},
                                        { name: 'Date Added', key: 'peri-date-updated', width: 15},
                                        { name: 'Date Updated', key: 'peri-date-updated', width: 15},
                                        { name: 'Added by', key: 'peri-added-by', width: 15},
                                        { name: 'Updated by', key: 'peri-updated-by', width: 15}
                                    ],
                                    rows: peri_res.map(d=>{
                                        return [
                                            d['peri_genexpertSN'] == null ? "" :d['peri_genexpertSN'],
                                            d['peri_peripheralName'] == null ? "" :d['peri_peripheralName'],
                                            d['peri_serialnumber'] == null ? "" :d['peri_serialnumber'],
                                            d['peri_modelnumber'] == null ? "" :d['peri_modelnumber'],
                                            getOnDate(d['peri_dateadded']) == "2001-01-01"?"None":
                                            getOnDate(d['peri_dateadded']),
                                            getOnDate(d['peri_dateupdated']) == "2001-01-01"?"None":
                                            getOnDate(d['peri_dateupdated']),
                                            `${d['peri_addedby_firstname'] == null ? "" :d['peri_addedby_firstname']} 
                                            ${d['peri_addedby_lastname'] == null ? "" :d['peri_addedby_lastname']}`,
                                            `${d['peri_updatedby_firstname'] == null ? "" :d['peri_updatedby_firstname']} 
                                            ${d['peri_updatedby_lastname'] == null ? "" :d['peri_updatedby_lastname']}`
                                        ]
                                    }),
                                
                                });                                
                            }

                        }

                        async function assayProcess(){

                            assay_sheet.columns = [
                                { header: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                { header: 'Test', key:'assay-test', width: 20},
                                { header: 'Quantity', key: 'assay-quantity', width: 15 },
                                { header: 'Date Added', key: 'assay-date-added', width: 15},
                                { header: 'Date Updated', key: 'assay-date-updated', width: 15},
                                { header: 'Added by', key: 'assay-added-by', width: 15},
                                { header: 'Updated by', key: 'assay-updated-by', width: 15}
                                
                            ];

                            if(assay_res.length != 0){
                                assay_sheet.addTable({
                                    name: "FilterAssayTable".replace(' ', '_'),
                                    ref: 'A1',
                                    headerRow: true,
                                    totalsRow: false,
                                    style: {
                                    theme: 'TableStyleMedium11',
                                    showRowStripes: true,
                                    },
                                    columns: [
                                        { name: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                        { name: 'Test', key:'assay-test', width: 20},
                                        { name: 'Quantity', key: 'assay-quantity', width: 15 },
                                        { name: 'Date Added', key: 'assay-date-added', width: 15},
                                        { name: 'Date Updated', key: 'assay-date-updated', width: 15},
                                        { name: 'Added by', key: 'assay-added-by', width: 15},
                                        { name: 'Updated by', key: 'assay-updated-by', width: 15}
                                    ],
                                    rows: assay_res.map(d=>{
                                        return [
                                            d['assay_genexpertSN'],
                                            d['assay_test'],
                                            d['assay_quantity'],
                                            getOnDate(d['assay_dateadded']) == "2001-01-01"?"None":
                                            getOnDate(d['assay_dateadded']),
                                            getOnDate(d['assay_dateupdated']) == "2001-01-01"?"None":
                                            getOnDate(d['assay_dateupdated']),
                                            `${d['assay_addedby_firstname']} ${d['assay_addedby_lastname']}`,
                                            `${d['assay_updatedby_firstname']} ${d['assay_updatedby_lastname']}`
                                        ]
                                    }),
                                
                                }); 
                            }

                        }

                       moduleProcess().then(()=>{
                            periProcess().then(()=>{
                                assayProcess().then(()=>{
                                    callback();
                                });
                            });
                       });
                       


                    }

                    const genex_res = classifiedDatas['genexperts'];
    
                    const allGenexpertSN = genex_res.map(d=>{
                        return d['genex_serialnumber'];
                    });

                    const allsn = allGenexpertSN.length ? ( "'" + allGenexpertSN.join("', '") + "'" ) : '';

                    threeProcess(function(){

                        xpertcheckController.getFilterDatas(` AND genexpertSN IN(${allsn})`,
                        function(xpertcheck_res){
    
    
                            const xper_sheet = exc.getWorksheet(workbook,'Xpertcheck');
    
                            // Add headers
                            xper_sheet.columns = [
                                { header: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                { header: 'Status', key:'xpertcheck-status', width: 15},
                                { header: 'Start of Calibration', key:'xpertcheck-start-calib', width: 15},
                                { header: 'Next Calibration', key: 'xpertcheck-end-calib', width: 15 },
                                { header: 'Engineer', key: 'xpertcheck-engineer', width: 30},
                                { header: 'Date Added', key: 'xpertcheck-date-added', width: 15},
                                { header: 'Date Updated', key: 'xpertcheck-date-updated', width: 15},
                                { header: 'Added by', key: 'xpertcheck-added-by', width: 30},
                                { header: 'Updated by', key: 'xpertcheck-updated-by', width: 30}
                            ];
    
                            if(xpertcheck_res.length != 0){
                                xper_sheet.addTable({
                                    name: "FilterXpertcheckTable".replace(' ', '_'),
                                    ref: 'A1',
                                    headerRow: true,
                                    totalsRow: false,
                                    style: {
                                    theme: 'TableStyleMedium13',
                                    showRowStripes: true,
                                    },
                                    columns: [
                                        { name: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                        { name: 'Status', key:'xpertcheck-status', width: 15},
                                        { name: 'Start of Calibration', key:'xpertcheck-start-calib', width: 15},
                                        { name: 'End of Calibration', key: 'xpertcheck-end-calib', width: 15 },
                                        { name: 'Engineer', key: 'xpertcheck-engineer', width: 30},
                                        { name: 'Date Added', key: 'xpertcheck-date-added', width: 15},
                                        { name: 'Date Updated', key: 'xpertcheck-date-updated', width: 15},
                                        { name: 'Added by', key: 'xpertcheck-added-by', width: 30},
                                        { name: 'Updated by', key: 'xpertcheck-updated-by', width: 30}
                                    ],
                                    rows: xpertcheck_res.map(d=>{
                                        return [
                                            d['genexpertSN'],
                                            d['stat'],
                                            getOnDate(d['calibrate_start']) == "2001-01-01"?"None":getOnDate(d['calibrate_start']),
                                            getOnDate(d['calibrate_done']) == "2001-01-01"?"None":getOnDate(d['calibrate_done']),
                                            d['fullname'],
                                            getOnDate(d['dateadded']) == "2001-01-01"?"None":getOnDate(d['dateadded']),
                                            getOnDate(d['dateupdated']) == "2001-01-01"?"None":getOnDate(d['dateupdated']),
                                            d['addedby'],
                                            d['updatedby']
                                        ]
                                    }),
                            
                                });
                            }
 
    
    
    
                            preventiveMaintenanceController.getFilterDatas(` AND genexpertSN IN(${allsn})`,
                            function(pm_res){
                                const pm_sheet = exc.getWorksheet(workbook,'Preventive Maintenance');
        
                                // Add headers
                                pm_sheet.columns = [
                                    { header: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                    { header: 'Status', key:'pm-status', width: 15},
                                    { header: 'Start of Maintenance', key:'pm-start-calib', width: 15},
                                    { header: 'Next Maintenance', key: 'pm-end-calib', width: 15 },
                                    { header: 'Engineer', key: 'pm-engineer', width: 30},
                                    { header: 'Date Added', key: 'pm-date-added', width: 15},
                                    { header: 'Date Updated', key: 'pm-date-updated', width: 15},
                                    { header: 'Added by', key: 'pm-added-by', width: 30},
                                    { header: 'Updated by', key: 'pm-updated-by', width: 30}
                                ];
        
                                if(pm_res.length != 0){
                                    pm_sheet.addTable({
                                        name: "FilterPMTable".replace(' ', '_'),
                                        ref: 'A1',
                                        headerRow: true,
                                        totalsRow: false,
                                        style: {
                                        theme: 'TableStyleMedium14',
                                        showRowStripes: true,
                                        },
                                        columns: [
                                            { name: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                            { name: 'Status', key:'pm-status', width: 15},
                                            { name: 'Start of Maintenance', key:'pm-start-calib', width: 15},
                                            { name: 'Next Maintenance', key: 'pm-end-calib', width: 15 },
                                            { name: 'Engineer', key: 'pm-engineer', width: 30},
                                            { name: 'Date Added', key: 'pm-date-added', width: 15},
                                            { name: 'Date Updated', key: 'pm-date-updated', width: 15},
                                            { name: 'Added by', key: 'pm-added-by', width: 30},
                                            { name: 'Updated by', key: 'pm-updated-by', width: 30}
                                        ],
                                        rows: pm_res.map(d=>{
                                            return [
                                                d['genexpertSN'],
                                                d['stat'],
                                                getOnDate(d['calibrate_start']) == "2001-01-01"?"None":getOnDate(d['calibrate_start']),
                                                getOnDate(d['calibrate_done']) == "2001-01-01"?"None":getOnDate(d['calibrate_done']),
                                                d['fullname'],
                                                getOnDate(d['dateadded']) == "2001-01-01"?"None":getOnDate(d['dateadded']),
                                                getOnDate(d['dateupdated']) == "2001-01-01"?"None":getOnDate(d['dateupdated']),
                                                d['addedby'],
                                                d['updatedby']
                                            ]
                                        }),
                                
                                    });
                                }

    
    
                                serviceReportController.getFilterDatas(` AND genexpert_serial_number IN(${allsn})`,
                                function(sr_res){
                                    const sr_sheet = exc.getWorksheet(workbook,'Service Report');
            
                                    // Add headers
                                    sr_sheet.columns = [
                                        { header: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                        { header: 'Service Report Number', key:'sr-number', width: 15},
                                        { header: 'Equipment', key:'sr-equipment', width: 15},
                                        { header: 'Facility', key: 'sr-facility', width: 30 },
                                        { header: 'Department', key: 'sr-department', width: 20},
                                        { header: 'Tel No', key: 'sr-tel-no', width: 25},
                                        { header: 'Service Type', key: 'sr-type', width: 20},
                                        { header: 'Problems Reported', key: 'sr-prob-reported', width: 40},
                                        { header: 'Diagnostic/Findings', key: 'sr-diag-find', width: 40},
                                        { header: 'Corrective/Action', key: 'sr-corr-action', width: 40},
                                        { header: 'Comments', key: 'sr-comments', width: 40},
                                        { header: 'Date Added', key: 'sr-date-added', width: 15},
                                        { header: 'Date Updated', key: 'sr-date-updated', width: 15},
                                        { header: 'Added by', key: 'sr-added-by', width: 30},
                                        { header: 'Updated by', key: 'sr-updated-by', width: 30}
                                    ];
                                    
                                    if(sr_res.length != 0){
                                        sr_sheet.addTable({
                                            name: "FilterServiceReportTable".replace(' ', '_'),
                                            ref: 'A1',
                                            headerRow: true,
                                            false: true,
                                            style: {
                                            theme: 'TableStyleMedium8',
                                            showRowStripes: true,
                                            },
                                            columns: [
                                                { name: 'Genexpert SN', key:'genexpert-serial-number', width: 15},
                                                { name: 'Service Report Number', key:'sr-number', width: 15},
                                                { name: 'Equipment', key:'sr-equipment', width: 15},
                                                { name: 'Facility', key: 'sr-facility', width: 30 },
                                                { name: 'Department', key: 'sr-department', width: 20},
                                                { name: 'Tel No', key: 'sr-tel-no', width: 25},
                                                { name: 'Service Type', key: 'sr-type', width: 20},
                                                { name: 'Problems Reported', key: 'sr-prob-reported', width: 40},
                                                { name: 'Diagnostic/Findings', key: 'sr-diag-find', width: 40},
                                                { name: 'Corrective/Action', key: 'sr-corr-action', width: 40},
                                                { name: 'Comments', key: 'sr-comments', width: 40},
                                                { name: 'Date Added', key: 'sr-date-added', width: 15},
                                                { name: 'Date Updated', key: 'sr-date-updated', width: 15},
                                                { name: 'Added by', key: 'sr-added-by', width: 30},
                                                { name: 'Updated by', key: 'sr-updated-by', width: 30}
                                            ],
                                            rows: sr_res.map(d=>{
                                                return [
                                                    d['genexpert_serial_number'],
                                                    d['service_report_num'],
                                                    d['equipment'],
                                                    d['facility'],
                                                    d['department'],
                                                    d['telno'],
                                                    d['service_type'],
                                                    d['problems_reported'],
                                                    d['diagnostic_findings'],
                                                    d['corrective_action'],
                                                    d['comments'],
                                                    getOnDate(d['dateadded']) == "2001-01-01"?"None":getOnDate(d['dateadded']),
                                                    getOnDate(d['dateupdated']) == "2001-01-01"?"None":getOnDate(d['dateupdated']),
                                                    d['addedby'],
                                                    d['updatedby']
                                                ]
                                            }),
                                    
                                        });
                                    }

    
                                    const gen_sheet = exc.getWorksheet(workbook,'Genexpert');
            
                                    // Add headers
                                    gen_sheet.columns = [
                                        { header: 'Serial Number', key:'serial-number', width: 15},
                                        { header: 'Facility/Site', key: 'facility-site', width: 60 },
                                        { header: 'Engineer', key: 'engineer', width: 25},
                                        { header: 'Date Installed', key: 'date-installed', width: 15},
                                        { header: 'Installation Type', key: 'install-type', width: 25},
                                        { header: 'Region', key: 'region', width: 30},
                                        { header: 'Province', key: 'province', width: 30},
                                        { header: 'City', key: 'city', width: 25},
                                        { header: 'Barangay', key: 'barangay', width: 25},
                                        { header: 'Street', key: 'street', width: 35},
                                        { header: 'Latitude', key: 'latitude', width: 20},
                                        { header: 'Longitude', key: 'longitude', width: 20},
                                        { header: 'Module', key: 'module', width: 40},
                                        { header: 'Peripheral', key: 'peripheral', width: 25},
                                        { header: 'Assaystatistic', key: 'assaystatistic', width: 25},
                                        { header: 'Last Xpertcheck', key: 'last-xpertcheck', width: 25},
                                        { header: 'Last Maintenance', key: 'last-maintenance', width: 25},
                                        { header: 'Latest Service Report', key: 'latest-service-report', width: 20},
                                        { header: 'Model Number', key: 'model-number', width: 60},
                                        { header: 'Date Added', key: 'date-added', width: 15},
                                        { header: 'Date Updated', key: 'date-updated', width: 15},
                                        { header: 'Added by', key: 'added-by', width: 25},
                                        { header: 'Updated by', key: 'updated-by', width: 25},
                                        { header: 'Status', key: 'status', width: 15},
                                        { header: 'Software Version', key: 'software-version', width: 20},
                                        { header: 'OS Version', key: 'os-version', width: 20},
                                        { header: 'Warranty Expiry Date', key: 'w-ex-date', width: 25},
                                        { header: 'Service Contract Expiry Date', key: 'sc-ex-date', width: 25}
                                    ];
    
                                    function getAllModuleString(sn){

                                        const allModuleSN = modules_res.filter(f=>{
                                            return f['genex_serialnumber'] == sn;
                                        }).map(m=>{
                                            return m['modu_serialnumber'];
                                        });

    
                                        return allModuleSN.length ? ( "'" + allModuleSN.join("', '") + "'" ) : '';
                                    }
    
                                    function getAllPeripheralString(sn){
    
                                        const allPerpheralNames = peri_res.filter(f=>{
                                            return f['genex_serialnumber'] == sn;
                                        }).map(m=>{
                                            return m['peri_peripheralName'];
                                        });
    
                                       return allPerpheralNames.length ? ( "'" + allPerpheralNames.join("', '") + "'" ) : '';
                                    }
    
                                    function getAllAssayString(sn){
    
                                        const allAssays = assay_res.filter(f=>{
                                            return f['genex_serialnumber'] == sn;
                                        }).map(a=>{
                                            return `{${a['assay_test']}:${a['assay_quantity']}}`;
                                        });
    
                                       return allAssays.length ? ( "'" + allAssays.join("', '") + "'" ) : '';
                                    }
    
                                    function getAllXpertcheckString(sn){
    
                                        const xpertchecks = xpertcheck_res.filter(f=>{
                                            return f['genexpertSN'] == sn;
                                        }).filter(a=>{
                                            return a['stat'] == "Current";
                                        });
    
                                       return xpertchecks.length == 0 ? "N/A" :
                                       
                                       `START{${getOnDate(xpertchecks[0]['calibrate_start'])}},
                                       END{${getOnDate(xpertchecks[0]['calibrate_done'])}}`;
                                    }
    
                                    function getAllPMString(sn){
    
                                        const pms = pm_res.filter(f=>{
                                            return f['genexpertSN'] == sn;
                                        }).filter(a=>{
                                            return a['stat'] == "Current";
                                        });
    
                                       return pms.length == 0 ? "N/A" :
                                       
                                       `START{${getOnDate(pms[0]['calibrate_start'])}},
                                       END{${getOnDate(pms[0]['calibrate_done'])}}`;
                                    }
    
    
                                  if(genex_res.length != 0 ){
                                    
                                    gen_sheet.addTable({
                                        name: 'FilterGenexpertTable'.replace(' ', '_'),
                                        ref: 'A1',
                                        headerRow: true,
                                        totalsRow: false,
                                        style: {
                                        theme: 'TableStyleMedium9',
                                        showRowStripes: true,
                                        },
                                        columns: [
                                            { name: 'Serial Number', key:'serial-number', width: 15},
                                            { name: 'Facility/Site', key: 'facility-site', width: 60 },
                                            { name: 'Engineer', key: 'engineer', width: 25},
                                            { name: 'Date Installed', key: 'date-installed', width: 15},
                                            { name: 'Installation Type', key: 'install-type', width: 15},
                                            { name: 'Region', key: 'region', width: 30},
                                            { name: 'Province', key: 'province', width: 30},
                                            { name: 'City', key: 'city', width: 25},
                                            { name: 'Barangay', key: 'barangay', width: 25},
                                            { name: 'Street', key: 'street', width: 35},
                                            { name: 'Latitude', key: 'latitude', width: 20},
                                            { name: 'Longitude', key: 'longitude', width: 20},
                                            { name: 'Module', key: 'module', width: 40},
                                            { name: 'Peripheral', key: 'peripheral', width: 25},
                                            { name: 'Assaystatistic', key: 'assaystatistic', width: 25},
                                            { name: 'Last Xpertcheck', key: 'last-xpertcheck', width: 25},
                                            { name: 'Last Maintenance', key: 'last-maintenance', width: 25},
                                            { name: 'Latest Service Report', key: 'latest-service-report', width: 20},
                                            { name: 'Model Number', key: 'model-number', width: 60},
                                            { name: 'Date Added', key: 'date-added', width: 15},
                                            { name: 'Date Updated', key: 'date-updated', width: 15},
                                            { name: 'Added by', key: 'added-by', width: 25},
                                            { name: 'Updated by', key: 'updated-by', width: 25},
                                            { name: 'Status', key: 'status', width: 15},
                                            { name: 'Software Version', key: 'software-version', width: 20},
                                            { name: 'OS Version', key: 'os-version', width: 20},
                                            { name: 'Warranty Expiry Date', key: 'w-ex-date', width: 25},
                                            { name: 'Service Contract Expiry Date', key: 'sc-ex-date', width: 25}
                                        ],
                                        rows: genex_res.map(d=>{
                                            return [
                                                d['genex_serialnumber'],
                                                d['genex_faci_siteName'],
                                                d['genex_eng_fullname'],
                                                getOnDate(d['genex_dateinstalled']) == "2001-01-01"?
                                                "None":getOnDate(d['genex_dateinstalled']),
                                                d['genex_inst_itName'],
                                                d['genex_faci_region'],
                                                d['genex_faci_province'],
                                                d['genex_faci_city'],
                                                d['genex_faci_barangay'],
                                                d['genex_faci_street'],
                                                d['genex_faci_latitude'],
                                                d['genex_faci_longitude'],
                                                
                                                getAllModuleString(d['genex_serialnumber']) == "" ?"N/A":{ text:getAllModuleString(d['genex_serialnumber']), 
                                                hyperlink: `#\'Module\'!${linker(module_sheet,d['genex_serialnumber'],'M')}`},
    
                                                getAllPeripheralString(d['genex_serialnumber']) == "" ?"N/A":{text:getAllPeripheralString(d['genex_serialnumber']), 
                                                hyperlink:`#\'Peripheral\'!${linker(peri_sheet,d['genex_serialnumber'],'M')}`},
    
                                                getAllAssayString(d['genex_serialnumber']) == "" ?"N/A":{text: getAllAssayString(d['genex_serialnumber']), 
                                                hyperlink: `#\'Assaystatistic\'!${linker(assay_sheet,d['genex_serialnumber'],'M')}`},
                                                
                                                getAllXpertcheckString(d['genex_serialnumber']) == "" ?"N/A":{text: getAllXpertcheckString(d['genex_serialnumber']), 
                                                hyperlink: `#\'Xpertcheck\'!${linker(xper_sheet,d['genex_serialnumber'],'M')}`},
    
                                                getAllPMString(d['genex_serialnumber']) == "" ?"N/A":{text:getAllPMString(d['genex_serialnumber']), 
                                                hyperlink: `#\'Preventive Maintenance\'!${linker(pm_sheet,d['genex_serialnumber'],'M')}`},
                                                
                                                {text:"Open", hyperlink: `#\'Service Report\'!${linker(sr_sheet,d['genex_serialnumber'],'M')}`},
                                                d['genex_mode_mnName'],
                                                getOnDate(d['genex_dateadded']) == "2001-01-01"?"None":getOnDate(d['genex_dateadded']),
                                                getOnDate(d['genex_dateupdated']) == "2001-01-01"?"None":getOnDate(d['genex_dateupdated']),
                                                `${d['genex_user_addedby_firstname']} ${d['genex_user_addedby_lastname']}`,
                                                `${d['genex_user_updatedby_firstname']} ${d['genex_user_updatedby_lastname']}`,
                                                d['genex_status'],
                                                d['genex_software_version'],
                                                d['genex_os_version'],
                                                getOnDate(d['genex_warranty_expiry_date']) == "2001-01-01"?"None":
                                                getOnDate(d['genex_warranty_expiry_date']),
                                                getOnDate(d['genex_service_contract_expiry_date']) == "2001-01-01"?"None":
                                                getOnDate(d['genex_service_contract_expiry_date'])
                                            ]
                                        }),
                                    });
                                  }
    
    
    
                                    const v = self.onView();
                                    v.container = "#genexpert-frame-area";
                                    v.screenName = "report-filter-done-screen";
                                    exc.exec(workbook,p,function(){

                                        v.messager({
                                            "message-02":true,
                                            "title":"Report Message",
                                            "message":`Successfully Create Report`
                                        });
                                    });
    
                                });
    
    
                            });
    
    
    
    
                        });
                    });


               });
            });

       


        }

        function listFilterDatasInPDF(){

            

            async function process(loading_start,exec){
                await loading_start();
                await exec();
            }

            async function getDatas(callback){
                self.onDatas().getGenexpert(function(res){
                    callback(res);
                });
            }

            process(function(){
                genexpertView.loader({
                    "loader-01":true
                });
            },function(){

                reportLibrary.pdf().exporting().onFindFile(function(p){
                 
                    reportLibrary.pdf().exporting().setHtml(
                        reportView.getAllReportTheme(__dirname)['genexpert-all']);

                        getDatas(function(res){
                            const classifiedDatas = genexpertView.list().classifyingData(res);

                            console.log(classifiedDatas);
                            reportLibrary.pdf().exporting().onCreate(false,classifiedDatas,p,
                                function(re){

                                    
                                 
                                        genexpertView.messager({
                                            "message-02":true,
                                            "title":"Report Message",
                                            "message":`Successfully Create PDF Report`
                                        });
                                    
                                }); 
                            


                        });
                });
              
            });

            
        }

        return {listAllDatasInExcel,listFilterDatasInExcel,listFilterDatasInPDF};

    }
  
}
const genexpertController = new GenexpertController();
module.exports = genexpertController;