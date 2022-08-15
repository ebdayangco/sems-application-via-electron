const { getOnDate } = require("../../supporters/sections/RequestSection");
const moduleController = require("../controllers/ModuleController");
const preventiveMaintenanceView = require("./PreventiveMaintenanceView");
const View = require("./View");
const xpertcheckView = require("./XpertcheckView");
class TransactionView extends View{
    constructor(){
        super();
        this.screenName = "transaction-main-screen";
        this.sub_transaction_id = 0;
        
    }

    getChooseServices(){

        const services = [];

        const plate = $("#service-type-reveal-area");
        
        const contents = [
        ".genexpert-installation-reveal-form",
        ".genexpert-transfer-reveal-form",
        ".genexpert-repair-reveal-form",
        ".genexpert-pullout-reveal-form",
        ".genexpert-module-replacement-reveal-form",
        ".genexpert-xpertcheck-reveal-form",
        ".genexpert-maintenance-reveal-form",
        ".genexpert-other-reveal-form"];

        contents.forEach(c=>{

            const form_ = plate.children(c);
            const cont = form_.children();
            if(form_.hasClass('select-label') || cont.hasClass('pinned-div')){

                const servicename = form_.attr("name");
                if(servicename == "Others"){
                    const otherspecify = $("#transaction-others-specify-field").val();
                    services.push(otherspecify);
                }else{
                    services.push(servicename);
                }
                
            }
        });

        console.log(services);

        return services;
    }

    clearGenexpertInstallationForm(){
        genexpertView.transaction().installation().clearAll();
    }

    getMainTransactDatas(){

        let sn_value = "";
        let typeofservice = $("#transaction-type-of-service-field").val();
        
        if(typeofservice == "Maintenance"){

            const xpertcheck_needed = $("#transaction-xpertcheck-needed-field");
            const maintenance_needed = $("#transaction-maintenance-needed-field");

            if(xpertcheck_needed.prop("checked") === true &&
             maintenance_needed.prop("checked") === false){

                typeofservice = "Calibration";
            }else if(xpertcheck_needed.prop("checked") === false && 
            maintenance_needed.prop("checked") === true){

                typeofservice = "Maintenance";
            }else if(xpertcheck_needed.prop("checked") === true && 
            maintenance_needed.prop("checked") === true){
                typeofservice = "Calibration and Maintenance";
            }

        }

               
        if($(".transaction-serial-number-input").hasClass("hide-serial-number-select")){
            sn_value = $(".transaction-serial-number-select").val();
        }else{
            sn_value = $(".transaction-serial-number-input").val();
        }

        let ticketno = ""

        if($(".transaction-jotform-input").hasClass("hide-jotform-component")){
            ticketno = $(".ttransaction-jotform-select").val();
        }else{
            ticketno = $(".transaction-jotform-input").val();
        }
        
        return {
            "facility-site":$("#transaction-facility-field").val(),
            "department":$("#transaction-department-field").val(),
            "equipment":$("#transaction-equipment-field").val(),
            "region":$("#transaction-address-region-field").val() != [] ? 
            $("#transaction-address-region-field").val()['name']:"",
            "province":$("#transaction-address-province-field").val() != [] 
            && $("#transaction-address-province-field").val() !=null ? 
            $("#transaction-address-province-field").val()['name']:"",
            "city":$("#transaction-address-city-field").val() != [] 
            && $("#transaction-address-city-field").val() !=null ? 
            $("#transaction-address-city-field").val()['name']:"",
            "barangay":$("#transaction-address-barangay-field").val() != [] 
            && $("#transaction-address-barangay-field").val() !=null ? 
            $("#transaction-address-barangay-field").val()['name']:"",
            "street":$("#transaction-address-street-field").val(),
            "latitude":$("#transaction-address-latitude-field").val(),
            "longitude":$("#transaction-address-longitude-field").val(),
            "model-number":$("#transaction-model-number-field").val(),
            "serial-number":sn_value,
            "type-of-service":typeofservice,
            "sub-transaction-id":this.sub_transaction_id,
            "need-service-report":$("#transaction-service-report-needed-field").prop('checked'),
            "service-report-number":$("#transaction-service-report-number-field").val(),
            "connect-jotform":$("#transaction-jotform-connect-field").prop("checked"),
            "jotform-ticket-no":ticketno
        }
    }

    validateAndGetTransactionDatas(){

        var self = this;

        const errors = {};
        const values={}; 
        const plate = $("#service-type-reveal-area");
        const transactions = {};
        const installation = plate.children(".genexpert-installation-reveal-form");
        const installation_content = installation.children();

        const transfer = plate.children(".genexpert-transfer-reveal-form");
        const transfer_content = transfer.children();

        const repair = plate.children(".genexpert-repair-reveal-form");
        const repair_content = repair.children();

        const pullout = plate.children(".genexpert-pullout-reveal-form");
        const pullout_content = pullout.children();

        const moduled = plate.children(".genexpert-module-replacement-reveal-form");
        const module_content = moduled.children();

        const xpertcheck = plate.children(".genexpert-xpertcheck-reveal-form");
        const xpertcheck_content = xpertcheck.children();

        const preventive_maintenance = plate.children(".genexpert-maintenance-reveal-form");
        const preventive_maintenance_content = preventive_maintenance.children();

        const others = plate.children(".genexpert-other-reveal-form");
        const others_content = others.children();


        if(installation.hasClass('select-label') 
        || installation_content.hasClass('pinned-div')){

            installationCheck();
            moduleCheck();
            xpertcheckCheck();
            pmCheck();

        }else{
            installationCheck();
            transferCheck();
            repairCheck();
            pullOutCheck();
            moduleCheck();
            xpertcheckCheck();
            pmCheck();
            otherCheck();
        }

        function installationCheck(){
            
            if(installation.hasClass('select-label') 
            || installation_content.hasClass('pinned-div')){

                
                errors['installation']  = genexpertView.transaction().installation().validate();
                values['installation'] = genexpertView.transaction().installation().entries();

            }
        }

        function transferCheck(){
            if(transfer.hasClass('select-label') 
            || transfer_content.hasClass('pinned-div')){
    
               errors['transfer'] = genexpertView.transaction().transfer().validate();
               values['transfer'] = genexpertView.transaction().transfer().entries();
            }
    
        }

        function repairCheck(){
            if(repair.hasClass('select-label') 
            || repair_content.hasClass('pinned-div')){
    
                errors['repair'] = genexpertView.transaction().repair().validate();
                values['repair'] = genexpertView.transaction().repair().entries();
    
            }
        }

        function pullOutCheck(){
            if(pullout.hasClass('select-label') 
            || pullout_content.hasClass('pinned-div')){
    
                errors['pullout'] = genexpertView.transaction().pullout().validate();
                values['pullout'] = genexpertView.transaction().pullout().entries();
            }
        }

        function moduleCheck(){

            const module_new = [];
            const module_replacement = [];
            const module_errors = [];

          
            if(moduled.hasClass('select-label') 
            || module_content.hasClass('pinned-div')){
             
                if($(".module-entry-list").html() == ""){
                    module_errors.push("No module transaction");
                }else{
                    $(".module-entry-list > .module-row-entry").each((i,el)=>{
    
                        let messages = [];
                        i++;
        
                        const row1 = $(el).children(".frame-row:nth-child(1)");
                        const row2 = $(el).children(".frame-row:nth-child(2)");
                        const row3 = $(el).children(".frame-row:nth-child(3)");
                        const row4 = $(el).children(".frame-row:nth-child(4)");
                        const row5 = $(el).children(".frame-row:nth-child(5)");
        
                        const trans_type = row1.children(".frame-item:nth-child(1)")
                        .children(".frame-input").children(".transaction-module-select-transaction-field");
        
                        const replace_from = row1.children(".frame-item:nth-child(2)")
                        .children(".frame-input").children(".transaction-module-replace-from-field");
        
                        
                        const new_serial = row2.children(".frame-item:nth-child(1)")
                        .children(".frame-input").children(".transaction-module-serial-number-field");
        
                        const location = row2.children(".frame-item:nth-child(2)")
                        .children(".frame-input").children(".transaction-module-location-field");
        
                        const dateinstalled = row3.children(".frame-item:nth-child(1)")
                        .children(".frame-input").children(".transaction-module-date-installed-field");
        
                        const status = row3.children(".frame-item:nth-child(2)")
                        .children(".frame-input").children(".transaction-module-status-field");
        
                        const engineer = row4.children(".frame-item:nth-child(1)")
                        .children(".frame-input").children(".transaction-module-engineer-field");
        
                        const itype = row4.children(".frame-item:nth-child(2)")
                        .children(".frame-input").children(".transaction-module-installation-type-field");
        
                        const partNumber = row5.children(".frame-item:nth-child(1)")
                        .children(".frame-input").children(".transaction-module-part-number-field");
        
                        const revisionNumber = row5.children(".frame-item:nth-child(2)")
                        .children(".frame-input").children(".transaction-module-revision-number-field");
        
                        if(new_serial.val() == ""){
                            messages.push(`Provide new serial number on module row ${i}`);
                        }
        
                        if(location.val() == ""){
                            messages.push(`Provide location on module row ${i}`);
                        }
        
                        if(dateinstalled.val() == ""){
                            messages.push(`Provide installation date on module row ${i}`);
                        }
        
                        if(status.val() == ""){
                            messages.push(`Provide status on module row ${i}`);
                        }
        
                        if(engineer.val() == 0){
                            messages.push(`Provide engineer on module row ${i}`);
                        }
        
                        if(itype.val() == 0){
                            messages.push(`Provide installation type on module row ${i}`);
                        }
        
        
                        module_errors.push(...messages);
        
                        const datas = {
                            "trans-type":trans_type.val(),
                            "replace-from":replace_from.val(),
                            "new-serial-number":new_serial.val(),
                            "location":location.val(),
                            "date-installed":dateinstalled.val(),
                            "status":status.val(),
                            "engineer":engineer.val(),
                            "installation-type":itype.val(),
                            "part-number":partNumber.val(),
                            "revision-number":revisionNumber.val(),
                            "genexpert":self.getTransactionSerialNumberBasedPin()
                        }
        
                        if(trans_type.val() == "Replacement"){
                            module_replacement.push(datas);
                        }else{
                            module_new.push(datas);
                        }
        
                    });
                }
               
                errors['modules'] = module_errors;
                values['modules'] = {
                    "new-installation":module_new,
                    "replacement":module_replacement
                };
            }
        }

        function xpertcheckCheck(){
            if(xpertcheck.hasClass('select-label') 
            || xpertcheck_content.hasClass('pinned-div')){
    
                errors['xpertcheck'] = xpertcheckView.transaction().validate();
                values['xpertcheck'] = xpertcheckView.transaction().xpertcheckEntries();
            }
        }
      
        function pmCheck(){

            if(preventive_maintenance.hasClass('select-label') 
            || preventive_maintenance_content.hasClass('pinned-div')){
    
                errors['preventive-maintenance'] = preventiveMaintenanceView.transaction().validate();
                values['preventive-maintenance'] = preventiveMaintenanceView.transaction().pmEntries();
            }
        }

     
        function otherCheck(){

            if(others.hasClass('select-label') 
            || others_content.hasClass('pinned-div')){
    
                const specify_value = $("#transaction-others-specify-field").val();
                let errs = [];
                if(specify_value == ""){
                    errs.push("Please provide specify other transaction.");
                }
    
                errors['other'] = genexpertView.transaction().others().validate()
                values['other'] = genexpertView.transaction().others().entries();
            }
        }



        transactions['errors'] = errors;
        transactions['values'] = values;


        return transactions;

    }

    validateOnDataExist(datas,callback){

        const errors = {};
        let mod_errors = [];

        var self = this;

        function installation(callback){

            const instal_errors = [];

            if(datas['installation']){

                const serialnumber = datas['installation']['genexpert']['serial-number'];


                if(serialnumber == "000000"){
                    instal_errors.push("Invalid Serial Number during installation.");
                    errors['installation'] = instal_errors;
                    callback();

                }else{
                    
                    genexpertController.transaction().isSerialNumberExist(serialnumber,function(){

                        instal_errors.push("Serial Number already exist during installation.");
                        errors['installation'] = instal_errors;
                        callback();
    
                        
                    },function(){
                        callback();
                    });
                }
    
               
    
            }else{
                callback();
            }
        }

        function modules(callback){

            const toFindDuplicates = arry => arry.filter((item, index) => arry.indexOf(item) !== index);


            function checkDuplicateSNs(serialnumbers,callback){

                if(serialnumbers.length != 0 ){

                    const duplicatesSN = toFindDuplicates(serialnumbers);

                    serialnumbers.forEach((d,i)=>{
                        if(d == "000000"){
                            mod_errors.push(`Invalid Module Serial Number ${d} at row ${i}`);
                        }
                    });

                    if(duplicatesSN.length !=0){
                        mod_errors.push(`Duplicates entry for Module SN ${duplicatesSN.join()}. Please check.`);
                        callback();
                    }else{
                        callback();
                    }
                    

                }else{
                    callback();
                }

                

            }

            function checkDuplicateLocations(locations,callback){


                if(locations.length !=0){
                    const locationAreas = [];
                    const snLocationDuplicates = [];

                    locations.forEach(d=>{

                        if(locationAreas.includes(d['location'])){
                            snLocationDuplicates.push(d['new-serial-number']);
                        }else{
                            locationAreas.push(d['location']);
                        }
                    });

                    if(snLocationDuplicates.length !=0){

                        mod_errors.push(`${snLocationDuplicates.join()} 
                        has the same location. Please check.`);
                        callback();

                    }else{
                        callback();
                    }

                }else{
                    callback();
                }


                
                

            }

            function checkModuleSNExists(serialnumbers,callback){


                if(serialnumbers.length != 0){

                    let uniqSNS = [...new Set(serialnumbers)]
                    const module_sn_lists = uniqSNS.join('","');


                    moduleController.checkSNExists(module_sn_lists,function(res){

                        if(res.length == 0){
                            callback();

                        }else{
                            let resLists = res.map(d=>{
                                return d['serialnumber'];
                            });

                            let uniq = [...new Set(resLists)].join();
    
                            mod_errors.push(`New Module Serial Number/s ${uniq} already exist.`);
                            callback();
                        }
    
                        
    
                    });


                }else{
                    callback();
                }


               
            }

            function checkLocationUnavailable(locations,callback){

                if(locations.length == 0){
                    callback();

                }else{
                    locations = locations.map(l=>{
                        return l['location'];
                    });

                    let uniqloc = [...new Set(locations)]
                    const loc_lists = uniqloc.join('","');

                    const genexpertSN = self.getTransactionSerialNumberBasedPin();
                    moduleController.checkModuleOnLocations(genexpertSN,loc_lists,function(mod_res){
                    
                        if(mod_res.length == 0){
                            callback();
                        }else{
                            
                            let locationLists = mod_res.map(d=>{
                               return d['location'];      
                            });
                            let uniqlocres = [...new Set(locationLists)].join('","');

                            mod_errors.push(`${uniqlocres} location/s was already installed by existing module/s. 
                            Please used replacement transaction.`);
                            errors['modules'] = mod_errors;
                            callback();
                        }
                    });
                }
                
                
               
                        
   
              
            }
            

            if(datas['modules']){


                function installation(callback){

                    if(datas['modules']['new-installation']){

                        const installation_lists = datas['modules']['new-installation'];
    
                        const sn_lists = installation_lists.map(d=>{
                            return d['new-serial-number'];
                        });
        
                        const loc_lists = installation_lists.map(d=>{
                            return {
                                "serial-number":d['new-serial-number'],
                                "location":d['location']
                            };
                        });
    
                        checkDuplicateSNs(sn_lists,function(){
                            checkDuplicateLocations(loc_lists,function(){
                                checkModuleSNExists(sn_lists,function(){
                                    checkLocationUnavailable(loc_lists,function(){
                                        callback();
                                    });
                                });
            
                            });
                        });
    
        
    
                    }else{
                        callback();
                    }



                }

                function replacement(callback){

                    if(datas['modules']['replacement']){

                        const installation_lists = datas['modules']['replacement'];
    
                        const sn_lists = installation_lists.map(d=>{
                            return d['new-serial-number'];
                        });
        
                        const loc_lists = installation_lists.map(d=>{
                            return {
                                "serial-number":d['new-serial-number'],
                                "location":d['location']
                            };
                        });
    
                        checkDuplicateSNs(sn_lists,function(){
                            checkDuplicateLocations(loc_lists,function(){
                                checkModuleSNExists(sn_lists,function(){
                                        callback();
                                });
                            });
                        });
    
        
    
                    }else{
                        callback();
                    }



                }

                installation(function(){
                    replacement(function(){
                        callback();
                    });
                });
    
            }else{
                callback();
            }
        }

        installation(function(){
            modules(function(){
                errors['modules'] = mod_errors;
                callback(errors);
            });
        });


    }

    getLimitOffset(){

        const page_num = $(`#transaction-index-pagination 
        > .pagination-paging-control > .pagination-select > input`).val();

        let page_val = 1;



        if(page_num !="" && !isNaN(page_num) && page_num !=0){
            page_val = page_num;
        }

        return {
            "limit":50,
            "offset":(page_val-1) * 50,
            "page-num":parseInt(page_num)
        };

    }


    validateMainTransact(){

        this.container = "#transaction-main-frame-area";

        const values = this.getMainTransactDatas();
        return this.validateProcess([
            {
                "field":"text",
                "value":values['facility-site'],
                "label":"Facility Name",
                "validation":["empty"],
                "message":"Please provide Facility Name"
                
            },
            {
                "field":"select",
                "value":values['department'],
                "label":"Department",
                "validation":["empty"],
                "message":"Please select Department."
            },
            {
                "field":"text",
                "value":values['equipment'],
                "label":"Equipment",
                "validation":["empty"],
                "message":"Please provide Equipment."
            },
            {
                "field":"select",
                "value":values['model-number'],
                "label":"Model Number",
                "validation":["empty"],
                "message":"Please select Equipment's Model Number."
            },
            {
                "field":"text",
                "value":values['serial-number'],
                "label":"Serial Number",
                "validation":["empty"],
                "message":"Please provide Equipment's Serial Number."
            },
            {
                "field":"select",
                "value":values['type-of-service'],
                "label":"Type Of Service",
                "validation":["empty"],
                "message":"Please select type of service"
            }
        ]);
    }

    validateAll(){

        if(this.validateMainTransact()){

            const typeOfService = this.getMainTransactDatas()['type-of-service'];


            switch(typeOfService){
                case "Installation": this.genexpertInstallationProcess(); break;
                default: null;
            }


        }

    }

    genexpertInstallationProcess(){

        genexpertController.transaction().installation().singleEntry();

    }

    displayList(datas,callback){


        const contenter = $("#transaction-body-list-content-area");
        contenter.html("");

        datas.forEach(d => {

            const sr = d['sc_number'] == '000000' ? `NOT NEEDED`:
            `${d['sc_number']}`;

            const jf = d['jotform_ticketNo'] == 'GX-000000' ? 
            `NOT RELATED`:
            `${d['jotform_ticketNo']}`;

            const item = `

            <div class="frame-body-list-row d-flex" data-support='${JSON.stringify(d)}'
            onclick="showTransactionInformation(this)">

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots 
                row-text-line-height" 
                style="width:100px">${d['transID']}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots 
                row-text-line-height" 
                style="width:100px">${getOnDate(d['transDate'])}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots 
                row-text-line-height" 
                style="width:100px">${d['serialnumber']}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots 
                row-text-line-height" 
                style="width:300px">${d['siteName']}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots 
                row-text-line-height" 
                style="width:150px">${d['typeofService']}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:150px">
                ${sr}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots 
                row-text-line-height" 
                style="width:150px">
                ${jf}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots 
                row-text-line-height" 
                style="width:200px">
                ${d['transBy']}</div>

             
            </div>
            `;

            contenter.append(item);
        });

        callback();
    }

    displayPaginationInfo(total){

        const limitOffset = this.getLimitOffset();
        let limit = limitOffset['limit'];
        let offset = limitOffset['offset'];

        if(total != null){

            const page_num = $(`#transaction-index-pagination 
            > .pagination-paging-control > .pagination-select > input`);
    
            const limitPage = Math.floor(total/limit);
            let to = offset+limit;
            let from = offset+1;
    
            if(page_num.val() > limitPage){
            
                to = total;
                let remain = total % limit;
                from = (total - remain) + 1;
            }
            
            const pagination = $("#transaction-index-pagination");
            const info = `${from}-${to} of ${total}`
            pagination.children(".pagination-paging-control").children(".pagination-label").html(info);  
        }

       
    }

    getFilter(){

        function setState(fieldname,val){

            if(val){
                return ` AND ${fieldname}${setCondition(val)}`;
            }
        
            return ``;
    
        }
    
        function setCondition(val,autoEqual){
            let res = "";
            
            if(autoEqual){
                res = `="${val}"`;
            }else{
                if(val.startsWith("=")){
                    val = val.substring(1);
                    res = `="${val}"`;
                }else if(val.startsWith("%")){
                    // val = val.substring(1);
                    res = ` LIKE "%${val}%"`;
                }else{
                    // val = val.substring(1);
                    res = ` LIKE "%${val}%"`;
                    
                }
            }
        
        return res;
        }

        const transactionID = $("#transaction-filter-transaction-id");

        let cond = '';
        cond += transactionID.val() != "" ? setState('a.transID',transactionID.val()):"";



        return cond;

    }


}
const transactionView = new TransactionView();
module.exports = transactionView;