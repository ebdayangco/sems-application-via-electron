const View = require("./View");
const engineerController = require("../controllers/EngineerController");
const installationtypeController = require("../controllers/InstallationTypeController");
// const xpertcheckController = require("../controllers/XpertcheckController");
const { getOnDate } = require("../../supporters/sections/RequestSection"); 
const serviceReportController = require("../controllers/ServiceReportController");
const xpertcheckView = require("./XpertcheckView");
// const preventiveMaintenanceController = require("../controllers/PreventiveMaintenanceController");
class GenexpertView extends View{
    constructor(){
        super();
        this.screenName = "genexpert-process-screen";
        
    }
    
    userInterfaces(){

        function openGenexpertInstallationFromList(div){

            $(div).attr("href","#transaction-frame-area");
            $(div).parent().parent().parent().parent()
            .children(".menu-area").children(".menu-item-area")
            .children(`a[href="#transaction-frame-area"]`).trigger("click");
        
            $("#transaction-category-list").val("Genexpert").trigger("change");
            $("#transaction-type-list").val("Installation").trigger("change");
        }

        function getFilters(){
            
            const genexpert_serial_number = $("#asset-filter-genexpert-serial-number");
            const genexpert_facility = $("#asset-filter-genexpert-facility");
            const genexpert_date_installed = $("#asset-filter-genexpert-date-installed");
            const genexpert_status = $("#asset-genexpert-filter-status");
            const genexpert_installedby = $("#asset-filter-genexpert-installed-by");
            const genexpert_installationtype = $("#asset-filter-genexpert-installation-type");
            const genexpert_modelnumber = $("#asset-filter-model-number");
            const genexpert_remarks = $("#asset-filter-remarks");

            const genexpert_region = $("#asset-filter-region");
            const genexpert_province = $("#asset-filter-province");
            const genexpert_city = $("#asset-filter-city");
            const genexpert_barangay = $("#asset-filter-barangay");
            const genexpert_street = $("#asset-filter-street");
            const genexpert_latitude = $("#asset-filter-latitude");
            const genexpert_longitude = $("#asset-filter-longitude");

            const genexpert_contactperson = $("#asset-entry-fullname");
            const genexpert_contactposition = $("#asset-filter-position");
            const genexpert_contactnumber = $("#asset-filter-contact-number");
            const genexpert_contactemail = $("#asset-filter-contact-email");

            const genexpert_softwareversion = $("#asset-filter-software-version");
            const genexpert_osversion = $("#asset-filter-os-version");
            const genexpert_warranty_expiry_date = $("#asset-filter-warranty-expiry-date");
            const genexpert_sc_expiry_date = $("#asset-filter-service-contract-expiry-date");
            const genexpert_dateadded = $("#asset-filter-date-added");
            const genexpert_updatedby = $("#asset-filter-updated-by");
            const genexpert_addedby = $("#asset-filter-added-by");
        
            const assay_test = $("#asset-filter-assay-test");
            const assay_quantity = $("#asset-filter-assay-quantity");
            const assay_addedby = $("#asset-filter-assay-added-by");
            const assay_updatedby = $("#asset-filter-assay-updated-by");

            const module_serialnumber = $("#asset-filter-module-serial-number");
            const module_location = $("#asset-filter-module-location");
            const module_dateinstalled = $("#asset-filter-module-date-installed");
            const module_installedby = $("#asset-filter-module-installed-by");
            const module_installationtype = $("#asset-filter-module-installation-type");
            const module_partnumber = $("#asset-filter-module-part-number");
            const module_revisionnumber = $("#asset-filter-module-revision-number");
            const module_addedby = $("#asset-filter-module-added-by");
            const module_status = $("#asset-filter-module-status");

            const peripheral_name = $("#asset-filter-peripheral-name");
            const peripheral_serial_number = $("#asset-filter-peripheral-serial-number");
            const peripheral_model_number = $("#asset-filter-peripheral-model-number");
            const peripheral_addedby = $("#asset-filter-peripheral-added-by");
            const peripheral_updatedby = $("#asset-filter-peripheral-updated-by");

            // const xpertcheck_date = $("#asset-filter-xpertcheck-date");
            // const xpertcheck_due_date = $("#asset-filter-xpertcheck-due-date");
            // const xpertcheck_engineer = $("#asset-filter-xpertcheck-engineer");
            // const xpertcheck_status = $("#asset-filter-xpertcheck-status");
            // const xpertcheck_updateddate = $("#asset-filter-xpertcheck-updated-date");
            // const xpertcheck_addedby = $("#asset-filter-xpertcheck-added-by");
            // const xpertcheck_updatedby = $("#asset-filter-xpertcheck-updated-by");

            // const pm_updateddate = $("#asset-filter-xpertcheck-updated-date");
            // const pm_frequency = $("#asset-filter-pm-frequency");
            // const pm_engineer = $("#asset-filter-pm-engineer");
            // const pm_updatedby = $("#asset-filter-pm-updated-by");

            let cond = ' AND xxx.latest IS NOT NULL ';
            let fieldname = '';
            let firstname = '';
            let lastname = '';
            let value = '';

            let main = ``;
            let dependencies = ``;
            

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
            if(genexpert_serial_number.val()){
            
                fieldname = genexpert_serial_number.data("field-name");
                value = genexpert_serial_number.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(genexpert_facility.val()){
                fieldname = genexpert_facility.data("field-name");
                value = genexpert_facility.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(genexpert_date_installed.val()){

                fieldname = genexpert_date_installed.data("field-name");
                value = genexpert_date_installed.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(genexpert_status.val()){


                fieldname = genexpert_status.data("field-name");
                value = genexpert_status.val();
                cond+=value == "0" ?"":` AND ${fieldname}${setCondition(value,true)}`;
            }
            if(genexpert_installedby.val()){
                fieldname = genexpert_installedby.data("field-name");
                value = genexpert_installedby.val();
                cond+=value == "0" ?"":` AND ${fieldname}${setCondition(value,true)}`;
            }
            if(genexpert_installationtype.val()){
                fieldname = genexpert_installationtype.data("field-name");
                value = genexpert_installationtype.val();
                cond+=value == "0" ?"":` AND ${fieldname}${setCondition(value,true)}`;
            }
            if(genexpert_modelnumber.val()){

                fieldname = genexpert_modelnumber.data("field-name");
                value = genexpert_modelnumber.val();
                cond+=value == "0" ?"":` AND ${fieldname}${setCondition(value,true)}`;
            }
            if(genexpert_remarks.val() && genexpert_remarks.val() != ""){

                fieldname = genexpert_remarks.data("field-name");
                value = genexpert_remarks.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(genexpert_region.val()){
                fieldname = genexpert_region.data("field-name");
                value = genexpert_region.val();
                value = value == "[]" ?"N/A": JSON.parse(value)['name'];
                cond+=value == "N/A" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(genexpert_province.val() && genexpert_province.val() != ""){
                
                fieldname = genexpert_province.data("field-name");
                value = genexpert_province.val();
                value = value == "[]" ?"N/A": JSON.parse(value)['name'];
                cond+=value == "N/A" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(genexpert_city.val() && genexpert_city.val() != ""){
                
                fieldname = genexpert_city.data("field-name");
                value = genexpert_city.val();
                value = value == "[]" ?"N/A": JSON.parse(value)['name'];
                cond+=value == "N/A" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(genexpert_barangay.val() && genexpert_barangay.val() != ""){
                
                fieldname = genexpert_barangay.data("field-name");
                value = genexpert_barangay.val();
                value = value == "[]" ?"N/A": JSON.parse(value)['name'];
                cond+=value == "N/A" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(genexpert_street.val()){
                
                fieldname = genexpert_street.data("field-name");
                value = genexpert_street.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(genexpert_latitude.val()){
                
                fieldname = genexpert_latitude.data("field-name");
                value = genexpert_latitude.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(genexpert_longitude.val()){
                fieldname = genexpert_longitude.data("field-name");
                value = genexpert_longitude.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(genexpert_contactperson.val()){
                fieldname = genexpert_contactperson.data("field-name");
                value = genexpert_contactperson.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(genexpert_contactposition.val()){
                fieldname = genexpert_contactposition.data("field-name");
                value = genexpert_contactposition.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(genexpert_contactnumber.val()){
                fieldname = genexpert_contactnumber.data("field-name");
                value = genexpert_contactnumber.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(genexpert_contactemail.val()){
                fieldname = genexpert_contactemail.data("field-name");
                value = genexpert_contactemail.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }

            if(genexpert_softwareversion.val()){
                fieldname = genexpert_softwareversion.data("field-name");
                value = genexpert_softwareversion.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(genexpert_osversion.val()){
                fieldname = genexpert_osversion.data("field-name");
                value = genexpert_osversion.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(genexpert_warranty_expiry_date.val()){
                fieldname = genexpert_warranty_expiry_date.data("field-name");
                value = genexpert_warranty_expiry_date.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(genexpert_sc_expiry_date.val()){
                fieldname = genexpert_sc_expiry_date.data("field-name");
                value = genexpert_sc_expiry_date.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(genexpert_dateadded.val()){
                fieldname = genexpert_sc_expiry_date.data("field-name");
                value = genexpert_sc_expiry_date.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(genexpert_updatedby.val()){
                firstname = genexpert_updatedby.data("field-fname");
                lastname = genexpert_updatedby.data("field-lname");
                value = genexpert_updatedby.val();
                cond+=value == "" ?"":`  AND CONCAT(${firstname}," ",${lastname})${setCondition(value)}`;
            }
            if(genexpert_addedby.val()){
                firstname = genexpert_addedby.data("field-fname");
                lastname = genexpert_addedby.data("field-lname");
                value = genexpert_addedby.val();
                cond+=value == "" ?"":`  AND CONCAT(${firstname}," ",${lastname})${setCondition(value)}`;
            }

            if(assay_test.val()){
                fieldname = assay_test.data("field-name");
                value = assay_test.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(assay_quantity.val()){
                fieldname = assay_quantity.data("field-name");
                value = assay_quantity.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(assay_addedby.val()){
                firstname = assay_addedby.data("field-fname");
                lastname = assay_addedby.data("field-lname");
                value = assay_addedby.val();
                cond+=value == "" ?"":`  AND CONCAT(${firstname}," ",${lastname})${setCondition(value)}`;
            }
            if(assay_updatedby.val()){
                firstname = assay_updatedby.data("field-fname");
                lastname = assay_updatedby.data("field-lname");
                value = assay_updatedby.val();
                cond+=value == "" ?"":`  AND CONCAT(${firstname}," ",${lastname})${setCondition(value)}`;
            }
            
            if(module_serialnumber.val()){
                
                fieldname = module_serialnumber.data("field-name");
                value = module_serialnumber.val();
                
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
                
            }
            if(module_location.val()){
                fieldname = module_location.data("field-name");
                value = module_location.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
                
            }
            if(module_dateinstalled.val()){
                fieldname = module_dateinstalled.data("field-name");
                value = module_dateinstalled.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(module_installedby.val()){
                fieldname = module_installedby.data("field-name");
                value = module_installedby.val();
                cond+=value == "0" ?"":` AND ${fieldname}${setCondition(value,true)}`;
            }
            if(module_installationtype.val()){
                fieldname = module_installationtype.data("field-name");
                value = module_installationtype.val();
                cond+=value == "0" ?"":` AND ${fieldname}${setCondition(value,true)}`;
            }
            if(module_partnumber.val()){
                fieldname = module_partnumber.data("field-name");
                value = module_partnumber.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(module_revisionnumber.val()){
                fieldname = module_revisionnumber.data("field-name");
                value = module_revisionnumber.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(module_addedby.val()){
                firstname = module_addedby.data("field-fname");
                lastname = module_addedby.data("field-lname");
                value = module_addedby.val();
                cond+=value == "" ?"":` AND CONCAT(${firstname}," ",${lastname})${setCondition(value)}`;
                
            }

            if(module_status.val()){
                fieldname = module_status.data("field-name");
                value = module_status.val();
                cond+=value == "0" ?"":` AND ${fieldname}${setCondition(value)}`;
            }

            if(peripheral_name.val()){
                fieldname = peripheral_name.data("field-name");
                value = peripheral_name.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(peripheral_serial_number.val()){
                fieldname = peripheral_serial_number.data("field-name");
                value = peripheral_serial_number.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(peripheral_model_number.val()){
                fieldname = peripheral_model_number.data("field-name");
                value = peripheral_model_number.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }
            if(peripheral_addedby.val()){
                firstname = peripheral_addedby.data("field-fname");
                lastname = peripheral_addedby.data("field-lname");
                value = peripheral_addedby.val();
                cond+=value == "" ?"":` AND CONCAT(${firstname}," ",${lastname})${setCondition(value)}`;
                
            }
            if(peripheral_updatedby.val()){
                firstname = peripheral_updatedby.data("field-fname");
                lastname = peripheral_updatedby.data("field-lname");
                value = peripheral_updatedby.val();
                cond+=value == "" ?"":` AND CONCAT(${firstname}," ",${lastname})${setCondition(value)}`;
            }
            // if(xpertcheck_date.val()){
            //     fieldname = xpertcheck_date.data("field-name");
            //     value = xpertcheck_date.val();
            //     cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            // }
            // if(xpertcheck_due_date.val()){
            //     fieldname = xpertcheck_due_date.data("field-name");
            //     value = xpertcheck_due_date.val();
            //     cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            // }
            // if(xpertcheck_engineer.val()){
            //     fieldname = xpertcheck_engineer.data("field-name");
            //     value = xpertcheck_engineer.val();
            //     cond+=value == "0" ?"":` AND ${fieldname}${setCondition(value)}`;
            // }
            // if(xpertcheck_status.val()){
            //     fieldname = xpertcheck_status.data("field-name");
            //     value = xpertcheck_status.val();
            //     cond+=value == "0" ?"":` AND ${fieldname}${setCondition(value)}`;
            // }
            // if(xpertcheck_updateddate.val()){
            //     fieldname = xpertcheck_updateddate.data("field-name");
            //     value = xpertcheck_updateddate.val();
            //     cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            // }
            // if(xpertcheck_addedby.val()){
            //     firstname = xpertcheck_addedby.data("field-fname");
            //     lastname = xpertcheck_addedby.data("field-lname");
            //     value = xpertcheck_addedby.val();
            //     cond+=value == "" ?"":` AND CONCAT(${firstname}," ",${lastname})${setCondition(value)}`;
                
            // }
            // if(xpertcheck_updatedby.val()){
            //     firstname = xpertcheck_updatedby.data("field-fname");
            //     lastname = xpertcheck_updatedby.data("field-lname");
            //     value = xpertcheck_updatedby.val();
            //     cond+=value == "" ?"":` AND CONCAT(${firstname}," ",${lastname})${setCondition(value)}`;
            // }

            // if(pm_updateddate.val()){
            //     fieldname = pm_updateddate.data("field-name");
            //     value = pm_updateddate.val();
            //     cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            // }
            // if(pm_frequency.val()){
            //     fieldname = pm_frequency.data("field-name");
            //     value = pm_frequency.val();
            //     cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            // }
            // if(pm_engineer.val()){
            //     fieldname = pm_engineer.data("field-name");
            //     value = pm_engineer.val();
            //     cond+=value == "0" ?"":` AND ${fieldname}${setCondition(value)}`;
            // }
            // if(pm_updatedby.val()){
            //     firstname = pm_updatedby.data("field-fname");
            //     lastname = pm_updatedby.data("field-lname");
            //     value = pm_updatedby.val();
            //     cond+=value == "" ?"":` AND CONCAT(${firstname}," ",${lastname})${setCondition(value)}`;
            // }
            

            return cond;
        }

        function getLimitOffset(){

            const page_num = $(`#genexpert-index-pagination 
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

        return {getFilters,getLimitOffset,openGenexpertInstallationFromList};

    }

    getGenexpertTransferSearch(){
        
        return $("#genexpertTransferSearchField").val();
    }

    getGenexpertFacilityEntry(){

        return {
            "new-facility":$("#genexpert-transfer-to-facility").val(),
            "service-report-number":$("#transaction-service-report-number").val()
        }
    }
    validateGenexpertTransferSearch(){
        
        const values = this.getGenexpertTransferSearch();

        return this.validateProcess([
            {
                "field":"text",
                "value":values,
                "label":"Genexpert Transfer",
                "validation":["empty"],
                "message":"Empty search field"
            }
        ]);
    }

    validateGenexpertFacility(){
        const values = this.getGenexpertFacilityEntry();

        return this.validateProcess([
            {
                "field":"text",
                "value":values['new-facility'],
                "label":"Facility Name",
                "validation":["empty"]
                
            },
            {
                "field":"text",
                "value":values['service-report-number'],
                "label":"Service Report",
                "validation":["empty"],
                "message":"Please provide the service report number."
            }
        ]);
    }

    list(){

        this.container = ".body-area";


        function classifyingData(datas){

            let genexpertList = [];

            datas.forEach(d=>{
                if(!genexpertList.includes(d['genex_serialnumber'])){
                    genexpertList.push(d['genex_serialnumber']);
                }
            });


            let genexperts = [];
            let contacts = [];
            let assaystatistics = [];
            let peripherals = [];
            let modules = [];

            genexpertList.forEach(d=>{
                
                let results = datas.filter(data=>{
                    return data['genex_serialnumber'] == d;
                });

                let contactLists = [];
                let assayLists = [];
                let periLists = [];
                let modLists = [];

                genexperts.push(results[0]);
                results.forEach(r=>{

                    if(!contactLists.includes(r['genex_faci_cont_contactID']) &&
                    r['genex_faci_cont_contactID'] != null){
                        contactLists.push(r['genex_faci_cont_contactID']);
                        contacts.push(r);
                    }

                    if(!assayLists.includes(r['assay_asID']) && 
                    r['assay_asID'] != null){
                        assayLists.push(r['assay_asID']);
                        assaystatistics.push(r);
                    }

                    if(!periLists.includes(r['peri_periID']) && 
                    r['peri_periID'] != null){
                        periLists.push(r['peri_periID']);
                        peripherals.push(r);
                    }

                    if(!modLists.includes(r['modu_moduleID']) && 
                    r['modu_moduleID'] != null){
                        modLists.push(r['modu_moduleID']);
                        modules.push(r);
                    }


                });
                    

                
            });

            

            function getUniqueValues(key){
                return [...new Map(datas.map(item =>
                    [item[key], item])).values()];
            }

    
            // return {
            //     "genexperts":getUniqueValues("genex_serialnumber","genex_dateupdated"),
            //     "contacts":getContactTable("genex_faci_cont_contactID"),
            //     "assaystatistics":getUniqueValues("assay_asID","assay_dateupdated"),
            //     "peripherals":getUniqueValues("peri_periID","peri_dateupdated"),
            //     "modules":getUniqueValues("modu_moduleID","modu_dateupdated"),
            // }
          
            return {
                "genexperts":genexperts,
                "contacts":contacts,
                "assaystatistics":assaystatistics,
                "peripherals":peripherals,
                "modules":modules
            }
    
        }

        function display(options){
            

            // first is to classify the datas
            const classifiedDatas = options['total'] != null ? 
            classifyingData(JSON.parse(JSON.stringify(options['datas']))):options['datas'];
            displayPaginationInfo(options['limit'],options['offset'],options['total']);

            $('#genexpert-normal-views > #genexpert-body-list-content-area').html("");
           


            $('#genexpert-normal-views > #genexpert-body-list-content-area').data("datas",classifiedDatas);
            $("#genexpert-tree-views").html("");
            let datas = classifiedDatas;

            datas["genexperts"].forEach((genexpert,i) => {

                const assaystatistics = datas["assaystatistics"].filter(assay=>{
                    return assay['genex_serialnumber'] == genexpert['genex_serialnumber'];
                });

                const peripherals = datas["peripherals"].filter(peri=>{
                    return peri['genex_serialnumber'] == genexpert['genex_serialnumber'];
                });

                const modules = datas["modules"].filter(mod=>{
                    return mod['genex_serialnumber'] == genexpert['genex_serialnumber'];
                });
    
                const contacts = datas["contacts"].filter(contact=>{
                    return contact['genex_serialnumber'] == genexpert['genex_serialnumber'];
                });

                const all = {
                    "genexperts":genexpert,assaystatistics,
                    peripherals,modules,contacts
                } 

               

                displayProcess(all);

                if(i == datas['genexperts'].length){
                    // options['done']();
                }

            });
            // debugger;
           
           
            

            
    
        }

        function displayProcess(datas){

            const date = new Date(datas.genexperts['genex_dateinstalled']);
            const month = date.getMonth()+1;
            const day = date.getDate();
            const year = date.getFullYear();
            const supportdatas = {
                "genexpert":datas.genexperts,
                "assaystatistic":datas.assaystatistics,
                "peripheral":datas.peripherals,
                "module":datas.modules,
                "contact":datas.contacts
            }

            let newdate =  `${year}-${month <= 9 ?`0${month}`:month}-
            ${day <= 9 ?`0${day}`:day}`;

            const status  = datas.genexperts['genex_status'] == "Active" ?"":"genexpert-terminated-bg";
            const d = datas.genexperts;
             

            const normal_view_item = `

            <div class="frame-body-list-row d-flex ${status}" data-support='${JSON.stringify(supportdatas)}'
            onclick="genexpertController.onView().info().show(this,event)">

            <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
            style="width:50px"><a href="#" 
            onclick="reportController.onPDF().genexpert_machine_information(this,true)"
            class="text-dark frame-report-btns" style="font-size:20px;">
            <i class="fa fa-print"></i></a></div>

            <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
            style="width:50px"><a href="#" onclick="reportController.onPDF().genexpert_machine_information(this)"
            class="text-danger frame-report-btns frame-report-btns-pdf" style="font-size:20px;">
            <i class="fa fa-file-pdf-o"></i></a></div>

            <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
            style="width:50px"><a href="#" onclick="reportController.onExcel().onExport(this)"
            class="text-success frame-report-btns frame-report-btns-excel" style="font-size:20px;">
            <i class="fa fa-file-excel-o"></i></a></div>

            
                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:150px">${d['genex_serialnumber']}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:350px">${d['genex_faci_siteName']}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:150px">${newdate}</div>

                <div data-id="${d['genex_inst_itID']}" class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:200px">${d['genex_inst_itName']}</div>

                <div data-id="${d['genex_eng_engineerID']}" class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:250px">${d['genex_eng_fullname']}</div>

                <div data-id="${d['genex_mode_mnID']}" class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:300px">
                ${d['genex_mode_mnName']}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:200px">
                ${datas.contacts.length == 0 ? "":
                datas.contacts[0]["genex_faci_cont_fullname"]}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:200px">${datas.contacts.length == 0 ? "":
                datas.contacts[0]["genex_faci_cont_contactnumber"]}
                </div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:200px">${datas.contacts.length == 0 ? "":
                datas.contacts[0]["genex_faci_cont_email"]}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:300px">${d['genex_faci_complete_address']}</div>


                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:300px">${d['genex_faci_region']}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:250px">${d['genex_faci_province']}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:250px">${d['genex_faci_city']}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:250px">${d['genex_faci_barangay']}</div>

               
            </div>
            `;

            const tree_view_item = `
            
            <div class="genexpert-tree-views-item make-hover">
            <div class="tree-views-item-body">
                <div class="body-semi-details" 
                onclick="machineController.machineUI().showFullDetails(this,event)">
                    <a href="#" class="genexpert-tree-show-control-btn">
                        <i class="fa fa-caret-right"></i></a>

                    <div class="control-button-area d-flex">
                        <a href="#" class="btn btn-success mr-2" title="Save Edited Data"><i class="fa fa-save"></i></a>
                        <a href="#" class="btn btn-danger mr-2" title="Generate in PDF"><i class="fa fa-file-pdf-o"></i></a>
                        <a href="#" class="btn btn-success mr-2" title="Generate in Excel"><i class="fa fa-file-excel-o"></i></a>
                        <a href="#" class="btn btn-primary"><i class="fa fa-bus" title="Transfer to other Site"></i></a>
                        <a href="#" class="btn btn-danger mr-2"><i class="fa fa-trash" title="Pull-out the Machine"></i></a>
                        
                    </div>
                    <div class="genexpert-tree-views-header">${d['genex_serialnumber']}</div>
                    <div class="genexpert-tree-views-details">${d['genex_faci_siteName']}</div>
                </div>
                <div class="body-full-details">
                   
                    <div class="genexpert-basic-information sub-make-hover">
                        <div class="genexpert-details-title" 
                        onclick="machineController.machineUI().showGenexpertInformationInfo(this)">
                            Basic Information
                            <a href="#" class="genexpert-tree-show-control-btn">
                                <i class="fa fa-caret-right"></i>
                            </a>
                        </div>
                       
                        <div class="genexpert-full-details-content">

                            <div class="full-details-content-row">
                                <div class="full-details-content-item w-15">
                                    <label for="#">Serial Number</label>
                                    <input type="text" class="w-100" value="${d['genex_serialnumber']}">
                                </div>
                                <div class="full-details-content-item w-15">
                                    <label for="#">Date Installed</label>
                                    <input type="date" class="w-100" value="${d['newdate']}">
                                </div>

                                <div class="full-details-content-item w-35">
                                    <label for="#">Installed By</label>
                                   <select class="engineer-drop-down w-100">
                                   </select>
                                </div>
                                <div class="full-details-content-item w-35">
                                    <label for="#">Installation Type</label>
                                   <select 
                                   class="installation-type-drop-down w-100">
                                   </select>
                                </div>

                            </div>

                            <div class="full-details-content-row">
                                <div class="full-details-content-item w-50">
                                    <label for="#">Model Number</label>
                                    <select 
                                   class="model-number-drop-down w-100">
                                   </select>
                                </div>
                                <div class="full-details-content-item w-25">
                                    <label for="#">Software Vcersion</label>
                                    <input type="text" class="w-100">
                                </div>

                                <div class="full-details-content-item w-25">
                                    <label for="#">OS Version</label>
                                    <input type="text" class="w-100">
                                </div>
                                

                            </div>
                          



                        </div>

                    </div>
                    <div class="genexpert-site-information sub-make-hover">
                        <div class="genexpert-details-title" 
                        onclick="machineController.machineUI().showGenexpertInformationInfo(this)">
                            Site Information
                            <a href="#" class="genexpert-tree-show-control-btn">
                                <i class="fa fa-caret-right"></i></a>
                        </div>
                       
                        <div class="genexpert-full-details-content">
                        </div>
                    </div>
                    <div class="genexpert-assaystatistic-information sub-make-hover">
                       
                            <div class="genexpert-details-title"
                            onclick="machineController.machineUI().showGenexpertInformationInfo(this)">
                                Assay Statistics
                                <a href="#" class="genexpert-tree-show-control-btn">
                                    <i class="fa fa-caret-right"></i></a>
                            </div>
                           
                            <div class="genexpert-full-details-content">
                            </div>
                        
                    </div>
                    <div class="genexpert-peripheral-information sub-make-hover">
                        
                            <div class="genexpert-details-title" 
                            onclick="machineController.machineUI().showGenexpertInformationInfo(this)"> 
                                Peripherals
                                <a href="#" class="genexpert-tree-show-control-btn">
                                    <i class="fa fa-caret-right"></i></a>
                            </div>
                           
                            <div class="genexpert-full-details-content">
                            </div>
                        
                    </div>
                    <div class="genexpert-module-information sub-make-hover">
                        
                            <div class="genexpert-details-title" 
                            onclick="machineController.machineUI().showGenexpertInformationInfo(this)">
                                Modules
                                <a href="#" class="genexpert-tree-show-control-btn">
                                    <i class="fa fa-caret-right"></i></a>
                            </div>
                           
                            <div class="genexpert-full-details-content">
                            </div>
                        
                    </div>
                    <div class="genexpert-xpertcheck-information sub-make-hover">
                        
                            <div class="genexpert-details-title"
                            onclick="machineController.machineUI().showGenexpertInformationInfo(this)">
                                Xpertchecks
                                <a href="#" class="genexpert-tree-show-control-btn">
                                    <i class="fa fa-caret-right"></i></a>
                            </div>
                           
                            <div class="genexpert-full-details-content">
                            </div>
                       
                    </div>
                    <div class="genexpert-preventive-maintenance-information sub-make-hover">
                        
                            <div class="genexpert-details-title"
                            onclick="machineController.machineUI().showGenexpertInformationInfo(this)">
                                Preventive Maintenances
                                <a href="#" class="genexpert-tree-show-control-btn">
                                    <i class="fa fa-caret-right"></i></a>
                            </div>
                           
                            <div class="genexpert-full-details-content">
                            </div>
                        
                    </div>
                </div>

            </div>
            
        </div>
            
            `;
           

            $('#genexpert-body-list-content-area').append(normal_view_item);
            $("#genexpert-tree-views").append(tree_view_item);
          
        }

        function displayPaginationInfo(limit,offset,total){

            if(total != null){

                const page_num = $(`#genexpert-index-pagination 
                > .pagination-paging-control > .pagination-select > input`);
        
                const limitPage = Math.floor(total/limit);
                let to = offset+limit;
                let from = offset+1;
        
                if(page_num.val() > limitPage){
                
                    to = total;
                    let remain = total % limit;
                    from = (total - remain) + 1;
                }
                
                const pagination = $("#genexpert-index-pagination");
                const info = `${from}-${to} of ${total}`
                pagination.children(".pagination-paging-control").children(".pagination-label").html(info);  
            }

           
        }

        return {display,displayPaginationInfo,classifyingData};
    }

    info(){

        this.container = "#genexpert-information-area";

        var self = this;

        function validateEntryOnUpdate(){

            const values = getEntry();

            return self.validateProcess([
                {
                    "field":"html",
                    "value":values['genexpert']['serial-number'],
                    "label":"Serial Number",
                    "validation":["n/a"],
                    "message":"Please provide serial number!"
                },
                {
                    "field":"html",
                    "value":values['genexpert']['facility'],
                    "label":"Facility",
                    "validation":["n/a"],
                    "message":"Please provide facility!"
                },
                {
                    "field":"date",
                    "value":values['genexpert']['date-installed'],
                    "label":"Facility",
                    "validation":["empty"],
                    "message":"Please provide date installed!"
                }
            ]);
        }

        function show(div,evt){

        
            const cls = $(evt.target).attr("class");

            if(cls != "fa fa-file-pdf-o" && cls != "fa fa-file-excel-o" && cls != "fa fa-print"){
                const datas = $(div).data("support");
                displayInformation(datas);
                $("#genexpert-information-area").data("supporting",datas);
                showSubForm("#genexpert-information-area","left");
            }
            
        }

        function getOtherInformation(datas){

            function displayXpertcheck(datas){

            
                const tbody = $("#genexpert-xpertcheck-panel-tbody");
                tbody.html("");
                datas.forEach(d=>{

                    let item = `
                    <tr>
                        <td class='cal-start'>${getOnDate(d['calibrate_start'])}</td>
                        <td class='cal-end'>${getOnDate(d['calibrate_done'])}</td>
                        <td>${d['fullname']}</td>
                        <td class='xpertcheck-stat'>${d['stat']}</td>
                    </tr>
                    `;

                    const tr = $(item);
                    tbody.append(tr);
                    // const cal_start = tr.children("td.cal-start").html();
                    // const cal_end = tr.children("td.cal-end").html();
                    // const statDisplay = tr.children("td.xpertcheck-stat");

                    // xpertcheckView.views().timeLengthRemainingUpdate(cal_start,
                    //     cal_end,function(per,interv){

                    //     if(per == 100 || per > 100){
                    //         clearInterval(interv);
                    //         tr.children("td").addClass("need-view");
                    //         tr.children("td").removeClass("waiting-view");
                    //         statDisplay.html("Need to re-calibrate");
                    //     }else{
                    //         tr.children("td").addClass("waiting-view");
                    //         tr.children("td").removeClass("need-view");
                    //         statDisplay.html("Waiting for re-calibrate");
                    //     }

                       
                    // });
                });    
               
            }

            function displayPM(datas){

                const tbody = $("#genexpert-preventive-maintenance-panel-tbody");
                tbody.html("");
                datas.forEach(d=>{


                    let item = `
                    <tr>
                        <td class='cal-start'>${getOnDate(d['calibrate_start'])}</td>
                        <td class='cal-end'>${getOnDate(d['calibrate_done'])}</td>
                        <td>${d['fullname']}</td>
                        <td class='pm-stat'>${d['stat']}</td>
                    </tr>
                    `;

                    const tr = $(item);
                    tbody.append(tr);
                    // const cal_start = tr.children("td.cal-start").html();
                    // const cal_end = tr.children("td.cal-end").html();
                    // const statDisplay = tr.children("td.pm-stat");

                    // xpertcheckView.views().timeLengthRemainingUpdate(cal_start,
                    //     cal_end,function(per,interv){

                    //     if(per == 100 || per > 100){
                    //         clearInterval(interv);
                    //         tr.children("td").addClass("need-view");
                    //         tr.children("td").removeClass("waiting-view");
                    //         statDisplay.html("Need for maintenance");
                    //     }else{
                    //         tr.children("td").addClass("waiting-view");
                    //         tr.children("td").removeClass("need-view");
                    //         statDisplay.html("Waiting for maintenance");
                    //     }
                    // });


                });    
               
            }

            function displayGenexpertTransaction(datas){
                // console.log(datas);
                const tbody = $("#genexpert-transaction-panel-tbody");
                tbody.html("");
                datas.forEach(d=>{


                    let item = `
                    <tr>
                        <td>${d['transID']}</td>
                        <td>${getOnDate(d['transDate'])}</td>
                        <td>${d['typeofService']}</td>
                        <td><a href="#" class="btn btn-info w-100"><i class="fa fa-info"></i></a></td>
                    </tr>
                    `;

                    const tr = $(item);
                    tbody.append(tr);
                    

                });    
               
            }

            function displayServiceReport(datas){

                const tbody = $("#genexpert-service-report-panel-tbody");
                tbody.html("");
                datas.forEach(d=>{

                    let item = `
                    <tr>
                        <td>${getOnDate(d['date_added'])}</td>
                        <td>${d['service_report_num']}</td>
                        <td>${d['firstname']} ${d['lastname']}</td>
                        <td>${d['for_what']} ${d['status']}</td>
                    </tr>
                    `;

                    tbody.append(item);

                });

            }


            const sn = datas['genexpert']['genex_serialnumber'];

            async function getXpertcheck(){

                
                $("#genexpert-xpertcheck-panel-tbody").parent("table")
                .parent("#genexpert-xpertcheck-panel")
                .removeClass("static-height-sm").addClass("static-height");

                const tbody = $("#genexpert-xpertcheck-panel-tbody");
                tbody.html("");

                displayMiniLoader("#genexpert-xpertcheck-panel","genexpert-xpertcheck-loader-screen");

                await xpertcheckController.getFilterDatas(` AND genexpertSN="${sn}"`,function(res){

                    $("#genexpert-information-area").data("xpertcheck",res);

                    $("#genexpert-xpertcheck-panel-tbody").parent("table")
                    .parent("#genexpert-xpertcheck-panel")
                    .removeClass("static-height").addClass("static-height-sm");

                    displayXpertcheck(res);
                    hideMiniLoader("genexpert-xpertcheck-loader-screen");
                    
                });
            }

            async function getPreventiveMaintenance(){

                $("#genexpert-preventive-maintenance-panel-tbody").parent("table")
                .parent("#genexpert-preventive-maintenance-panel")
                .removeClass("static-height-sm").addClass("static-height");

                const tbody = $("#genexpert-preventive-maintenance-panel-tbody");
                tbody.html("");
                
                displayMiniLoader("#genexpert-preventive-maintenance-panel",
                "genexpert-preventive-maintenance-loader-screen");

                await preventiveMaintenanceController.getAllPreventiveMaintenance(
                    function(res){

                        $("#genexpert-information-area").data("preventive-maintenance",res);

                        $("#genexpert-preventive-maintenance-panel-tbody").parent("table")
                        .parent("#genexpert-preventive-maintenance-panel")
                        .removeClass("static-height").addClass("static-height-sm");

                        displayPM(res);
                        hideMiniLoader("genexpert-preventive-maintenance-loader-screen");
                  
                    
                },` AND genexpertSN="${sn}"`);

            }
            

            async function getTransactionHistory(){

                $("#genexpert-transaction-panel-tbody").parent("table")
                .parent("#genexpert-transaction-history-panel")
                .removeClass("static-height-sm").addClass("static-height");

                const tbody = $("#genexpert-transaction-panel-tbody");
                tbody.html("");

                displayMiniLoader("#genexpert-transaction-history-panel",
                "genexpert-transaction-history-loader-screen");

                genexpertController.transaction().history(sn,function(res){

                    $("#genexpert-information-area").data("transaction-history",res);
                    
                    $("#genexpert-transaction-panel-tbody").parent("table")
                    .parent("#genexpert-transaction-history-panel")
                    .removeClass("static-height").addClass("static-height-sm");

                    displayGenexpertTransaction(res);

                    hideMiniLoader("genexpert-transaction-history-loader-screen");
                });
                
            }
            async function getServiceReport(){

                $("#genexpert-service-report-panel-tbody").parent("table")
                .parent("#genexpert-service-report-panel")
                .removeClass("static-height-sm").addClass("static-height");

                const tbody = $("#genexpert-service-report-panel-tbody");
                tbody.html("");

                displayMiniLoader("#genexpert-service-report-panel",
                "genexpert-service-report-loader-screen");

                serviceReportController.getServiceReportforGenexpertInfo(sn,function(res){

                    $("#genexpert-information-area").data("service-report",res);
                    
                    $("#genexpert-service-report-panel-tbody").parent("table")
                    .parent("#genexpert-service-report-panel")
                    .removeClass("static-height").addClass("static-height-sm");

                    displayServiceReport(res);

                    hideMiniLoader("genexpert-service-report-loader-screen");
                });
                
            }

            return {getXpertcheck,getPreventiveMaintenance,getServiceReport,getTransactionHistory}

          
        }

        function displayInformation(datas){

            const otherInformation = getOtherInformation(datas);

            genexpertInformationAssigneeValues(datas);
            otherInformation.getXpertcheck();
            otherInformation.getPreventiveMaintenance();
            otherInformation.getTransactionHistory();
            otherInformation.getServiceReport();
          
        }

        function getFields(){

                const genexpert_field =["genexpert-info-serial-number",
            "genexpert-info-facility_site","genexpert-info-date-installed",
            "genexpert-info-installation-type","genexpert-info-model-number",
        "genexpert-info-installed-by","genexpert-info-remarks",
        "genexpert-info-region","genexpert-info-province",
            "genexpert-info-city","genexpert-info-barangay","genexpert-info-street",
            "genexpert-info-latitude","genexpert-info-longitude","genexpert-info-software-version",
            "genexpert-info-os-version","genexpert-info-warranty-expiry-date",
            "genexpert-info-service-contract-expiry-date"];
            
            return genexpert_field;

        }

        function getEntry(){

            const genexpert = {
                "serial-number":$("#genexpert-info-serial-number").html(),
                "facility":$("#genexpert-info-facility_site").html(),
                "date-installed":$("#genexpert-info-date-installed").html(),
                "installation-type":$("#genexpert-info-installation-type").html(),
                "model-number":$("#genexpert-info-model-number").html(),
                "installed-by":$("#genexpert-info-installed-by").html(),
                "update-date":$("#genexpert-info-last-update-date").html(),
                "update-by":$("#genexpert-info-last-update-by").html(),
                "remarks":$("#genexpert-info-remarks").html(),
                "region":$("#genexpert-info-region").html(),
                "province":$("#genexpert-info-province").html(),
                "city":$("#genexpert-info-city").html(),
                "barangay":$("#genexpert-info-barangay").html(),
                "street":$("#genexpert-info-street").html(),
                "latitude":$("#genexpert-info-latitude").html(),
                "longitude":$("#genexpert-info-longitude").html(),
                "software-version":$("#genexpert-info-software-version").html(),
                "os-version":$("#genexpert-info-os-version").html(),
                "warranty-expiry-date":$("#genexpert-info-warranty-expiry-date").html(),
                "service-contract-expiry-date":$("#genexpert-info-service-contract-expiry-date").html(),


            }

            const contacts = [];
            $("#genexpert-info-contact-tbody > tr").each((i,div)=>{

                const datas = $(div).data("data");
                const td_first = $(div).children("td:nth-child(1)");
                const td_second = $(div).children("td:nth-child(2)");
                const td_third = $(div).children("td:nth-child(3)");
                const td_fourth = $(div).children("td:nth-child(4)");
                contacts.push({
                    "contactID":datas['genex_faci_cont_contactID'],
                    "fullname":td_first.html(),
                    "position":td_second.html(),
                    "email":td_third.html(),
                    "contact-number":td_fourth.html()
                });
            });

            const assaystatistics = [];
            $("#genexpert-info-assaystatistic-tbody > tr").each((i,div)=>{

                const datas = $(div).data("data");
                const td_first = $(div).children("td:nth-child(1)");
                const td_second = $(div).children("td:nth-child(2)");
                assaystatistics.push({
                    "asID":datas['assay_asID'],
                    "test":td_first.html(),
                    "quantity":td_second.html()
                });
            });

            const peripherals = [];
            $("#genexpert-info-peripheral-tbody > tr").each((i,div)=>{

                const datas = $(div).data("data");
                const td_first = $(div).children("td:nth-child(1)");
                const td_second = $(div).children("td:nth-child(2)");
                const td_third = $(div).children("td:nth-child(3)");
                peripherals.push({
                    "periID":datas['peri_periID'],
                    "periName":td_first.html(),
                    "model-number":td_second.html(),
                    "serial-number":td_third.html()
                });
            });

            const modules = [];
            $("#genexpert-info-module-tbody > tr").each((i,div)=>{

                const datas = $(div).data("data");
                const td_1 = $(div).children("td:nth-child(1)");
                const td_2 = $(div).children("td:nth-child(2)");
                const td_3 = $(div).children("td:nth-child(3)");
                const td_4 = $(div).children("td:nth-child(4)");
                const td_5 = $(div).children("td:nth-child(5)");
                const td_6 = $(div).children("td:nth-child(6)");
                const td_7 = $(div).children("td:nth-child(7)");
                const td_8 = $(div).children("td:nth-child(8)");

                modules.push({
                    "moduleID":datas['modu_moduleID'],
                    "serial-number":td_1.html(),
                    "location":td_2.html(),
                    "date-installed":td_3.html(),
                    "installation-type":td_4.html(),
                    "installed-by":td_5.html(),
                    "part-number":td_6.html(),
                    "revision-number":td_7.html(),
                    "status":td_8.html()
                });
            });

            return {genexpert,contacts,assaystatistics,peripherals,modules};

        }

        function getUpdatedDatasOnly(){

            let editedList = [];
            

            let current_genexpert_serial_number = $("#genexpert-info-serial-number").html()
            
            getFields().forEach(d=>{

                const f = $(`#${d}`);
                // data-select
                const prev = f.data("current");
               
                const entry = f.html().trim();

                if(f.data("type") == "facility-info" 
                && f.data("update") == "siteID"){

                    
                    editedList.push({
                        "type":f.data("type"),
                        "id":d
                    });


                }else{
                    if(prev != entry){
                 
                        editedList.push({
                            "type":f.data("type"),
                            "id":d
                        });
                         
                     }
                }

            });

            const forUpdates = [];
            const genexpert = [];
            const site = [];
            forUpdates.push({
                "genexpert-serial-number":current_genexpert_serial_number
            });

            editedList.forEach(f=>{
                const field = $(`#${f['id']}`);

                if(f['type'] == "select"){

                    genexpert.push({
                        "field":field.data("update"),
                        "value":field.data("select")
                    });
                }else if(f['type'] == "facility-info"){


                    if(field.data("update") == "siteID"){

                        if(field.data("primary-id") != field.data("select")){
                            genexpert.push({
                                "field":field.data("update"),
                                "value":field.data("select")
                            });
                        }

                        site.push({
                            "field":field.data("update"),
                            "value":field.data("select")
                        });

                    }else{
                        site.push({
                            "field":field.data("update"),
                            "value":field.html()
                        });
                    }
                    
                }else{
                    genexpert.push({
                        "field":field.data("update"),
                        "value":field.html()
                    });
                }
               
            });



            if(genexpert.length != 0){
                forUpdates.push({"genexpert":genexpert});
            }

            if(site.length > 1){
                forUpdates.push({"site":site});
            }
            



            // contacts
            let contacts_new = [];
            $("#genexpert-info-contact-tbody > tr[data-new='new']").each((i,d)=>{
                

                const tr = $(d);
                const da = tr.data("data");
                const fullname = tr.children("td:nth-child(1)").html();
                const position = tr.children("td:nth-child(2)").html();
                const email = tr.children("td:nth-child(3)").html();
                const cnumber = tr.children("td:nth-child(4)").html();

               
                contacts_new.push({
                    "site-id":da['genex_faci_cont_siteID'],
                    "fullname":fullname,
                    "position":position,
                    "email":email,
                    "contact-number":cnumber
                });
            });

            

            let contacts_update = [];
            $("#genexpert-info-contact-tbody > tr[data-edit='edit']").each((i,d)=>{

                const tr = $(d);

                if(!tr.data("new")){

                    const fullname = tr.children("td:nth-child(1)").html();
                    const position = tr.children("td:nth-child(2)").html();
                    const email = tr.children("td:nth-child(3)").html();
                    const cnumber = tr.children("td:nth-child(4)").html();
                    const data = tr.data("data");

                    let d_same = true;
                    if(fullname != tr.children("td:nth-child(1)").data("current")){
                        d_same = d_same && false;
                    }
                    if(position != tr.children("td:nth-child(2)").data("current")){
                        d_same = d_same && false;
                    }
                    if(email != tr.children("td:nth-child(3)").data("current")){
                        d_same = d_same && false;
                    }
                    if(cnumber != tr.children("td:nth-child(4)").data("current")){
                        d_same = d_same && false;
                    }

                    if(!d_same){

                        contacts_update.push({
                            "site-id":data['genex_faci_cont_siteID'],
                            "contact-id":tr.data("table-row-id"),
                            "fullname":fullname,
                            "position":position,
                            "email":email,
                            "contact-number":cnumber
                        });
                    }

                }

                


              
            });
            let contacts = [];
        
            if(contacts_new.length !=0){contacts.push({"new":contacts_new});}
            if(contacts_update.length !=0){contacts.push({"edit":contacts_update});}
            if(contacts.length !=0){forUpdates.push({"contacts":contacts});}


             // assaystatistics
             let assaystatistic_new = [];
             $("#genexpert-info-assaystatistic-tbody > tr[data-new='new']").each((i,d)=>{
 
                 const tr = $(d);
                 const test = tr.children("td:nth-child(1)").html();
                 const quantity = tr.children("td:nth-child(2)").html();
                
                 assaystatistic_new.push({
                     "assay-genexpert":current_genexpert_serial_number,
                     "assay-test":test,
                     "assay-quantity":quantity,
                     "assay-date":getOnDate()
                 });

             });

 
             let assaystatistic_update = [];
             $("#genexpert-info-assaystatistic-tbody > tr[data-edit='edit']").each((i,d)=>{
 
                const tr = $(d);


                if(!tr.data("new")){

                    const test = tr.children("td:nth-child(1)").html();
                    const quantity = tr.children("td:nth-child(2)").html();
                    const data = tr.data("data");
                    assaystatistic_update.push({
                        "assay-id":tr.data("table-row-id"),
                        "assay-test":test,
                        "assay-quantity":quantity,
                        "assay-genexpert":current_genexpert_serial_number
                    });

                }
                
             });
             let assaystatistics = [];
         
             if(assaystatistic_new.length !=0){assaystatistics.push({"new":assaystatistic_new});}
             if(assaystatistic_update.length !=0){assaystatistics.push({"edit":assaystatistic_update});}
             if(assaystatistics.length !=0){forUpdates.push({"assaystatistics":assaystatistics});}


              // peripheral
              let peripheral_new = [];
              $("#genexpert-info-peripheral-tbody > tr[data-new='new']").each((i,d)=>{
  
                  const tr = $(d);
                  const peripheral_name = tr.children("td:nth-child(1)").html();
                  const serialnumber = tr.children("td:nth-child(2)").html();
                  const modelnumber = tr.children("td:nth-child(3)").html();
                 
                  peripheral_new.push({
                    "peripheral-genexpert":current_genexpert_serial_number,
                    "peripheral-name":peripheral_name,
                    "peripheral-serial-number":serialnumber,
                    "peripheral-model-number":modelnumber
                  });
 
              });
 
  
              let peripheral_update = [];
              $("#genexpert-info-peripheral-tbody > tr[data-edit='edit']").each((i,d)=>{
  
                  const tr = $(d);

                if(!tr.data("new")){
                    const peripheral_name = tr.children("td:nth-child(1)").html();
                    const serialnumber = tr.children("td:nth-child(2)").html();
                    const modelnumber = tr.children("td:nth-child(3)").html();
                    const data = tr.data("data");
  
                    let d_same = true;
                    if(peripheral_name != tr.children("td:nth-child(1)").data("current")){
                        d_same = d_same && false;
                    }
                    if(serialnumber != tr.children("td:nth-child(2)").data("current")){
                        d_same = d_same && false;
                    }
                    if(modelnumber != tr.children("td:nth-child(3)").data("current")){
                        d_same = d_same && false;
                    }
                  
    
  
                  if(!d_same){
  
                      peripheral_update.push({
                          "peripheral-id":tr.data("table-row-id"),
                          "peripheral-genexpert":current_genexpert_serial_number,
                          "peripheral-name":peripheral_name,
                          "peripheral-serial-number":serialnumber,
                          "peripheral-model-number":modelnumber
                      });
                  }                    
                }

                
              });

              let peripherals = [];
          
              if(peripheral_new.length !=0){peripherals.push({"new":peripheral_new});}
              if(peripheral_update.length !=0){peripherals.push({"edit":peripheral_update});}
              if(peripherals.length !=0){forUpdates.push({"peripherals":peripherals});}


              let module_update = [];
              $("#genexpert-info-module-tbody > tr[data-edit='edit']").each((i,d)=>{
  
                  const tr = $(d);
                  const serialnumber = tr.children("td:nth-child(1)").html();
                  const location = tr.children("td:nth-child(2)").html();
                  const dateinstalled = tr.children("td:nth-child(3)").html();
                  const installationtype = tr.children("td:nth-child(4)").data("update-id");
                  const installedby = tr.children("td:nth-child(5)").data("update-id");
                  const partnumber = tr.children("td:nth-child(6)").html();
                  const revisionnumber = tr.children("td:nth-child(7)").html();
                  let d_same = true;
                  if(serialnumber != tr.children("td:nth-child(1)").data("current")){
                      d_same = d_same && false;
                  }
                  if(location != tr.children("td:nth-child(2)").data("current")){
                      d_same = d_same && false;
                  }
                  if(dateinstalled != tr.children("td:nth-child(3)").data("current")){
                      d_same = d_same && false;
                  }
                  
                  if(parseInt(installationtype) != parseInt(tr.children("td:nth-child(4)").data("current-id"))){
                    d_same = d_same && false;
                  }

                  if(parseInt(installedby) != parseInt(tr.children("td:nth-child(5)").data("current-id"))){
                    d_same = d_same && false;
                  }

                  if(partnumber != tr.children("td:nth-child(6)").data("current")){
                    d_same = d_same && false;
                  }
                
                  if(revisionnumber != tr.children("td:nth-child(7)").data("current")){
                    d_same = d_same && false;
                  }
                  

                

                if(!d_same){

                    module_update.push({
                        "module-id":tr.data("table-row-id"),
                        "genexpert":current_genexpert_serial_number,
                        "serial-number":serialnumber,
                        "location":location,
                        "date-installed":dateinstalled,
                        "installation-type":installationtype,
                        "installed-by":installedby,
                        "part-number":partnumber,
                        "revision-number":revisionnumber
                    });
                }

                 
              });

              let modules = [];
          
              if(module_update.length !=0){modules.push({"edit":module_update});}
              if(modules.length !=0){forUpdates.push({"modules":modules});}

           return forUpdates;


        }

        return{show,getUpdatedDatasOnly,validateEntryOnUpdate,getOtherInformation};
    }

    transaction(){

        var self = this;
        this.container= "#transaction-frame-area";


        function validate(genexTrans){

            const plate = $("#service-type-reveal-area");
            const transactions = {};
            const installation = plate.children(".genexpert-installation-reveal-form");
            const installation_content = plate.children();

            const transfer = plate.children(".genexpert-transfer-reveal-form");
            const transfer_content = plate.children();

            const pullout = plate.children(".genexpert-pullout-reveal-form");
            const pullout_content = plate.children();

            if(installation.hasClass('st-reveal-form-reveal') 
            || installation_content.hasClass('pinned-div')){
                const installations = {
                    process:function(mainTransaction,serviceReportTransaction,err,success){
                        genexTrans().installationOnTransaction(mainTransaction
                            ,serviceReportTransaction,err,success);
                    }
                };

                transactions['installation'] = installations;

            }

            if(transfer.hasClass('st-reveal-form-reveal') 
            || transfer_content.hasClass('pinned-div')){

                const transfers = {
                    process:function(mainTransaction,serviceReportTransaction,err,success){
                        genexTrans().transferOnTransaction(mainTransaction
                            ,serviceReportTransaction,err,success);
                    }
                };

                transactions['transfer'] = transfers;
            }

            if(pullout.hasClass('st-reveal-form-reveal') 
            || pullout_content.hasClass('pinned-div')){

                const pullouts = {
                    process:function(mainTransaction,serviceReportTransaction,err,success){
                        genexTrans().pulloutOnTransaction(mainTransaction
                            ,serviceReportTransaction,err,success);
                    }
                };

                transactions['pull-out'] = pullouts;
            }

            return transactions;


        }


        function installation(){

            function labels(){
                // return {
                //     "service-report-num":{
                //         "type":"text-field",
                //         "id":"transaction-service-report-number"
                //     },
                //     "serial-number":{
                //         "type":"text-field",
                //         "id":"genex-install-general-serial-number"
                //     },
                //     "date-installed":{
                //         "type":"date-field",
                //         "id":"genex-install-general-date-installed"
                //     },
                //     "site":{
                //         "type":"text-field",
                //         "id":"genex-install-general-site"
                //     },
                //     "installed-by":{
                //         "type":"select-field",
                //         "id":"genex-install-general-engineer"
                //     },
                //     "installation-type":{
                //         "type":"select-field",
                //         "id":"genex-install-general-installType"
                //     },
                //     "model-number":{
                //         "type":"select-field",
                //         "id":"genex-install-general-model-number"
                //     },
                //     "remarks":{
                //         "type":"text-field",
                //         "id":"genex-install-general-remarks"
                //     },
                //     "complete-address":{
                //         "type":"text-field",
                //         "id":"genex-install-address-complete-address"
                //     },
                //     "region":{
                //         "type":"select-field",
                //         "id":"genex-install-address-region"
                //     },
                //     "province":{
                //         "type":"select-field",
                //         "id":"genex-install-address-province"
                //     },
                //     "city":{
                //         "type":"select-field",
                //         "id":"genex-install-address-city"
                //     },
                //     "barangay":{
                //         "type":"select-field",
                //         "id":"genex-install-address-barangay"
                //     },
                //     "street":{
                //         "type":"text-field",
                //         "id":"genex-install-address-street"
                //     },
                //     "latitude":{
                //         "type":"text-field",
                //         "id":"genex-install-address-latitude"
                //     },
                //     "longitude":{
                //         "type":"text-field",
                //         "id":"genex-install-address-longitude"
                //     },
                //     "contact-fullname":{
                //         "type":"text-field",
                //         "id":"genex-install-contact-fullname"
                //     },
                //     "contact-position":{
                //         "type":"text-field",
                //         "id":"genex-install-contact-position"
                //     },
                //     "contact-email":{
                //         "type":"text-field",
                //         "id":"genex-install-contact-email"
                //     },
                //     "contact-number":{
                //         "type":"text-field",
                //         "id":"genex-install-contact-number"
                //     },
                //     "software-version":{
                //         "type":"text-field",
                //         "id":"genex-install-software-version"
                //     },
                //     "os-version":{
                //         "type":"text-field",
                //         "id":"genex-install-software-os-version"
                //     },
                //     "warranty-expiry-date":{
                //         "type":"date-field",
                //         "id":"genex-install-software-warranty-expiry-date"
                //     },
                //     "service-contract-expiry-date":{
                //         "type":"date-field",
                //         "id":"genex-install-software-service-contract-expiry-date"
                //     },
                //     "assay-statistic":{
                //         "type":"table-tbody",
                //         "id":"genex-install-assay-rows"
                //     },
                //     "peripheral":{
                //         "type":"table-tbody",
                //         "id":"genex-install-peripheral-rows"
                //     },
                //     "modules":{
                //         "type":"table-tbody",
                //         "id":"genex-install-module-rows"
                //     }
                   
                    
                    
                // }


                return {
                    "serial-number":{
                        "type":"text-field",
                        "id":"transaction-serial-number-field-input"
                    },
                    "date-installed":{
                        "type":"date-field",
                        "id":"transaction-installation-date-installed-field"
                    },
                    "site":{
                        "type":"text-field",
                        "id":"transaction-facility-field"
                    },
                    "installed-by":{
                        "type":"select-field",
                        "id":"transaction-installation-engineer-field"
                    },
                    "installation-type":{
                        "type":"select-field",
                        "id":"transaction-installation-type-field"
                    },
                    "model-number":{
                        "type":"select-field",
                        "id":"transaction-model-number-field"
                    },
                    "remarks":{
                        "type":"text-field",
                        "id":"transaction-installation-remarks-field"
                    },
                    "complete-address":{
                        "type":"text-field",
                        "id":"transaction-address-complete-address-field"
                    },
                    "region":{
                        "type":"select-field",
                        "id":"transaction-address-region-field"
                    },
                    "province":{
                        "type":"select-field",
                        "id":"transaction-address-province-field"
                    },
                    "city":{
                        "type":"select-field",
                        "id":"transaction-address-city-field"
                    },
                    "barangay":{
                        "type":"select-field",
                        "id":"transaction-address-barangay-field"
                    },
                    "street":{
                        "type":"text-field",
                        "id":"transaction-address-street-field"
                    },
                    "latitude":{
                        "type":"text-field",
                        "id":"transaction-address-latitude-field"
                    },
                    "longitude":{
                        "type":"text-field",
                        "id":"transaction-address-longitude-field"
                    },
                    "contact-fullname":{
                        "type":"text-field",
                        "id":"transaction-contact-name-field"
                    },
                    "contact-position":{
                        "type":"text-field",
                        "id":"transaction-contact-position-field"
                    },
                    "contact-email":{
                        "type":"text-field",
                        "id":"transaction-contact-email-field"
                    },
                    "contact-number":{
                        "type":"text-field",
                        "id":"transaction-contact-number-field"
                    },
                    "software-version":{
                        "type":"text-field",
                        "id":"transaction-installation-software-version-field"
                    },
                    "os-version":{
                        "type":"text-field",
                        "id":"transaction-installation-software-os-version-field"
                    },
                    "warranty-expiry-date":{
                        "type":"date-field",
                        "id":"transaction-installation-warranty-expiry-date-field"
                    },
                    "service-contract-expiry-date":{
                        "type":"date-field",
                        "id":"transaction-installation-service-contract-expiry-date-field"
                    },
                    "assay-statistic":{
                        "type":"table-tbody",
                        "id":"genex-install-assay-rows"
                    },
                    "peripheral":{
                        "type":"table-tbody",
                        "id":"genex-install-peripheral-rows"
                    },
                    "modules":{
                        "type":"table-tbody",
                        "id":"genex-install-module-rows"
                    }
                   
                    
                    
                }
            }

            function getSerialnumberValue(){
                let sn_value = "";
               
                if($(".transaction-serial-number-input").hasClass("hide-serial-number-select")){
                    sn_value = $(".transaction-serial-number-select").val();
                }else{
                    sn_value = $(".transaction-serial-number-input").val();
                }

                return sn_value;
            }

            function errorFreePercentage(){

                const components = labels();

                let sn_value = getSerialnumberValue();
                
                let totalError = 10;
                let fillComplete = 0;

                const site_value = $(`#${components['site']['id']}`).val();
                const eng_value = $(`#${components['installed-by']['id']}`).val();
                const dateinstalled_value = $(`#${components['date-installed']['id']}`).val();
                const installType_value = $(`#${components['installation-type']['id']}`).val();
                let messages = [];

                
                var testnameCount = 0;
                var quantityCount = 0;

                $("#genex-install-assay-rows > tr").each((i,el)=>{
                
                    const testname = $(el).children("td").children("input#genex-install-assay-test-name").val();
                    const quantity = $(el).children("td").children("input#genex-install-assay-quantity").val();
                    if(testname == ""){testnameCount++;}
                    if(quantity == ""){quantityCount++;}
                    

                });

                
                var periNameCount = 0;

                $("#genex-install-peripheral-rows > tr").each((i,el)=>{

                    const peripheralName = $(el).children("td").children("input#genex-install-peripheral-name").val();
                    
                    if(peripheralName == ""){periNameCount++;}

                });

                var moduleSNCount = 0;
                var moduleLocCount = 0;
                $("#genex-install-module-rows > tr").each((i,el)=>{

                    const moduleSN = $(el).children("td").children("input#genex-install-module-serial-number").val();
                    const moduleLoc = $(el).children("td").children("input#genex-install-module-location").val();
                    if(moduleSN == ""){moduleSNCount++;}
                    if(moduleLoc == ""){moduleLocCount++;}

                });

                if(sn_value != ""){
                   fillComplete++;
                }
                if(site_value != ""){
                    fillComplete++;
                }
                if(eng_value != 0){
                    fillComplete++;
                }
                if(dateinstalled_value != ""){
                    fillComplete++;
                }
                if(installType_value != 0){
                    fillComplete++;
                }

                if(testnameCount == 0){
                    fillComplete++;
                }

                if(quantityCount == 0){
                    fillComplete++;
                }
    
                if(periNameCount == 0){
                    fillComplete++;
                }
                if(moduleSNCount == 0){
                    fillComplete++;
                }

                if(moduleLocCount == 0){
                    fillComplete++;
                }

                return fillComplete/totalError;

            }

            function validate(){
                
                const components = labels();

                // const components = self.get().genexpert().installation.getLabels();
                         
                //for genexpert one entry

                let sn_value = getSerialnumberValue();
               

                const site_value = $(`#${components['site']['id']}`).val();
                const eng_value = $(`#${components['installed-by']['id']}`).val();
                const dateinstalled_value = $(`#${components['date-installed']['id']}`).val();
                const installType_value = $(`#${components['installation-type']['id']}`).val();
                let messages = [];

                var testnameCount = 0;
                var quantityCount = 0;
               
                   
                $("#genex-install-assay-rows > tr").each((i,el)=>{
                
                    const testname = $(el).children("td").children("input#genex-install-assay-test-name").val();
                    const quantity = $(el).children("td").children("input#genex-install-assay-quantity").val();
                    if(testname == ""){testnameCount++;}
                    if(quantity == ""){quantityCount++;}
                    

                });
                    
                   
    
                
               

                var periNameCount = 0;

                $("#genex-install-peripheral-rows > tr").each((i,el)=>{

                    const peripheralName = $(el).children("td").children("input#genex-install-peripheral-name").val();
                    
                    if(peripheralName == ""){periNameCount++;}

                });


                // var moduleSNCount = 0;
                // var moduleLocCount = 0;
                // $("#genex-install-module-rows > tr").each((i,el)=>{

                //     const moduleSN = $(el).children("td").children("input#genex-install-module-serial-number").val();
                //     const moduleLoc = $(el).children("td").children("input#genex-install-module-location").val();
                //     if(moduleSN == ""){moduleSNCount++;}
                //     if(moduleLoc == ""){moduleLocCount++;}

                // });

                if(sn_value == ""){
                    messages.push("Please provide machine serial number.");
                }
                if(site_value == ""){
                    messages.push("Please provide facility name of machine.");
                }
                if(eng_value == 0){
                    messages.push("Please select Engineer name.");
                }
                if(dateinstalled_value == ""){
                    messages.push("Please provide Date Installed.");
                }
                if(installType_value == 0){
                    messages.push("Please provide Installation Type.");
                }

                if(testnameCount != 0){
                    messages.push("Test Name must provide in assay statistic");
                }

                if(quantityCount != 0){
                    messages.push("Quantity must provide in assay statistic");
                }
    
                if(periNameCount != 0){
                    messages.push("Name must provide in peripheral");
                }
                // if(moduleSNCount != 0){
                //     messages.push("Serial Number must provide in module");
                // }

                // if(moduleLocCount != 0){
                //     messages.push("Location must provide in module");
                // }
               
               
                return messages;

            }

            function entries(){

                const components = labels();
                const object = {};
                object['genexpert'] = {};
                object['service-report'] = {};

                // Service Report
                  object['service-report']['service-report-particular-id'] = 0;
                  object['service-report']['service-report-for-what'] = "genexpert";
                 
                

                
                object['service-report']['service-report-num'] = 
                $("#transaction-service-report-number").val();
                object['service-report']['remarks'] = object['genexpert']['remarks'];
                object['service-report']['status'] = "Installation";

                
    
    
                Object.keys(components).forEach(k=>{
    
                    if(components[k]['type'] = "text-field"){
                        object['genexpert'][k] = $(`#${components[k]['id']}`).val()
                    }else if(components[k]['type'] = "date-field"){
                        object['genexpert'][k] = $(`#${components[k]['id']}`).val()
                    }else if(components[k]['type'] = "select-field"){
                        object['genexpert'][k] = $(`#${components[k]['id']}`).val()
                    }
    
                    
                });

                // object['service-report']['genexpert-serial-number'] =
                // object['genexpert']["serial-number"];
                // object['service-report']['engineer'] =
                // object['genexpert']["installed-by"];
    
                //special edit of address
              
                
                object['genexpert']['region'] = $(`#${components['region']['id']} option:selected`).text()
                object['genexpert']['province'] = $(`#${components['province']['id']} option:selected`).text()
                object['genexpert']['city'] = $(`#${components['city']['id']} option:selected`).text()
                object['genexpert']['barangay'] = $(`#${components['barangay']['id']} option:selected`).text()
                
                object['assaystatistics'] = [];
                object['peripherals'] = [];
                object['modules'] = [];
                 
                $(`#${components['assay-statistic']['id']} > tr`).each((index,row)=>{
    
    
                    const assay_date = $(row).children("td")
                    .children("input#genex-install-assay-test-date").val();
    
                    const assay_test= $(row).children("td")
                    .children("input#genex-install-assay-test-name").val();
    
                    const assay_quantity= $(row).children("td")
                    .children("input#genex-install-assay-quantity").val();
    
                    const assay_engineer= $(row).children("td")
                    .children("select#genex-install-assay-engineer").val();
    
    
                    if(assay_test != "" && assay_quantity != ""){
    
                        object['assaystatistics'].push({
                            "assay-genexpert": object['genexpert']["serial-number"],
                            "assay-date":assay_date,
                            "assay-test":assay_test,
                            "assay-quantity":assay_quantity,
                            "assay-engineer":assay_engineer
                        });
                    }
                    
                    
                   
    
                });
    
                $(`#${components['peripheral']['id']} > tr`).each((index,row)=>{
    
                    const peri_name = $(row).children("td")
                    .children("input#genex-install-peripheral-name").val();
    
                    const peri_sn= $(row).children("td")
                    .children("input#genex-install-peripheral-serial-number").val();
    
                    const peri_mn= $(row).children("td")
                    .children("input#genex-install-peripheral-model-number").val();
    
                    const peri_rem= $(row).children("td")
                    .children("input#genex-install-peripheral-remarks").val();
    
                    if(peri_name != "" && (peri_sn !="" || peri_mn !="") ){
    
                        object['peripherals'].push({
                            "peripheral-genexpert": object['genexpert']["serial-number"],
                            "peripheral-name":peri_name,
                            "peripheral-serial-number":peri_sn,
                            "peripheral-model-number":peri_mn,
                            "peripheral-remarks":peri_rem
                        });
    
                    }
                    
                
                   
    
                });
    
                $(`#${components['modules']['id']} > tr`).each((index,row)=>{
    
     
                    const module_sn = $(row).children("td")
                    .children("input#genex-install-module-serial-number").val();
    
                    const module_location = $(row).children("td")
                    .children("input#genex-install-module-location").val();
    
                    const module_date_installed = $(row).children("td")
                    .children("input#genex-install-module-date-installed").val();
    
                    const module_installation_type = $(row).children("td")
                    .children("select#genex-install-module-installType").val();
    
                    const module_engineer = $(row).children("td")
                    .children("select#genex-install-module-engineer").val();
    
                    const module_revision_number = $(row).children("td")
                    .children("input#genex-install-module-revision-number").val();
    
                    const module_part_number = $(row).children("td")
                    .children("input#genex-install-module-part-number").val();
                    
    
                    if(module_sn != "" && module_location != ""){
                        object['modules'].push({
                            "module-genexpert": object['genexpert']["serial-number"],
                            "module-serial-number":module_sn,
                            "module-location":module_location,
                            "module-date-installed":module_date_installed,
                            "module-installation-type":module_installation_type,
                            "module-engineer":module_engineer,
                            "module-revision-number":module_revision_number,
                            "module-part-number":module_part_number
                        });
    
                    }
                  
                   
    
                });
    
                return object;
    
            }

            function deleteTableRow(div){
                $(div).parent("td").parent("tr").remove();
            }

            function addAssayStatisticRow(div){

                const item = ` 
                <tr>
                    <td class="w-5">
                        <a href="#" class="btn btn-danger 
                        w-100 h-100" onclick="genexpertController.onView().transaction()
                        .installation().deleteTableRow(this)">
                            <i class="fa fa-trash"></i>
                        </a>
                    </td>
                    <td class="w-20"><input type="date" 
                    id="genex-install-assay-test-date"></td>    
                    <td class="w-40"><input 
                    id="genex-install-assay-test-name"  
                    type="text"></td>    
                    <td class="w-35"><input type="text" 
                    id="genex-install-assay-quantity" ></td>     
                    
                </tr>`;

                let tbody = null;

                if(!div){
                    tbody = $("#genex-install-assay-rows");
                }else{
                    tbody = $(div).parent(".title").siblings(".body").children("table")
                    .children("tbody");
    
                }
                tbody.append(item);
               
                
                
        
            }
    
            function addPeripheralRow(div){
                const item = `
                <tr>
                <td class="w-5">
                    <a href="#" class="btn btn-danger w-100 h-100" 
                    onclick="genexpertController.onView().transaction()
                    .installation().deleteTableRow(this)">
                        <i class="fa fa-trash"></i>
                    </a>
                </td>
                <td class="w-35"><input type="text" 
                   id="genex-install-peripheral-name" class="genex-install-peripheral-name-cls"></td>    
                <td class="w-30"><input type="text" 
                   id="genex-install-peripheral-serial-number"></td>    
                <td class="w-30"><input type="text"  
                   id="genex-install-peripheral-model-number"></td>    
                  
            </tr>
                `;
                
                let tbody = null;

                if(!div){
                    tbody = $("#genex-install-peripheral-rows");
                }else{
                    tbody = $(div).parent(".title").siblings(".body").children("table").children("tbody");
                }
                tbody.append(item);
                // autoCompleteView.activatePeripheralAutoComplete();
            }

            function addModuleRow(div){
                const item = `
                <tr>
                    <td class="w-5">
                        <a href="#" class="btn btn-danger w-100 h-100" 
                        onclick="genexpertController.onView().transaction()
                        .installation().deleteTableRow(this)">
                            <i class="fa fa-trash"></i>
                        </a>
                    </td>
                    <td class="w-10"><input type="text"
                        id="genex-install-module-serial-number"></td>    
                    <td class="w-10"><input type="text" 
                        id="genex-install-module-location"></td>    
                    <td class="w-15"><input type="date" 
                        id="genex-install-module-date-installed"></td>    
                    <td class="w-15"><select id="genex-install-module-installType" 
                        class="installation-type-drop-down"></select></td>   
                    <td class="w-15"><select id="genex-install-module-engineer" 
                        class="engineer-drop-down"></select></td>   
                    <td class="w-15"><input type="text" 
                        id="genex-install-module-revision-number"></td>    
                    <td class="w-15"><input type="text" 
                        id="genex-install-module-part-number"></td>    
                </tr>
    
                    `;
                
                let tbody = null;
                if(!div){
                    tbody = $("#genex-install-module-rows");
                }
                else{
                    tbody = $(div).parent(".title").siblings(".body").children("table").children("tbody");
                }
                tbody.append(item);

                const installed_by = tbody.children("tr:last-child").children("td").children("select#genex-install-module-engineer");
                const install_type = tbody.children("tr:last-child").children("td").children("select#genex-install-module-installType");
                engineerController.displayEngineer(installed_by);
                installationtypeController.displayInstallationType(install_type);
    
            }

        
            function clearAll(){

                
                const fields = Object.values((labels())).filter(v=>{
                    return v['type'] == "text-field" || v['type'] == "select-field"
                    || v['type'] == "date-field";
                }).map(v=>{
                    if(v['type'] == "text-field"){
                        v['type'] = "text";
                    }
                    
                    v['div'] = `#${v['id']}`;
                    return v;
                });
              
               self.clearList(fields);
               $("#genex-install-assay-rows").html("");
            //    addAssayStatisticRow();
               $("#genex-install-peripheral-rows").html(""); 
            //    addPeripheralRow();
            //    $("#genex-install-module-rows").html("");
            //    addModuleRow();
            //    addModuleRow();
            //    addModuleRow();
            //    addModuleRow();
                
            }
    

            return {deleteTableRow,addAssayStatisticRow,addPeripheralRow,
                addModuleRow,clearAll,validate,entries,getSerialnumberValue,
                errorFreePercentage};

        }

        function transfer(){

            function clearAll(){

                const labels = {
                    "genexpert-transfer-to-facility":{
                        "type":"text-field",
                        "id":"genexpert-transfer-to-facility"   
                    },
                    "genexpert-transfer-date-installed":{
                        "type":"date-field",
                        "id":"genexpert-transfer-date-installed"   
                    },
                    "genexpert-transfer-remarks":{
                        "type":"text-field",
                        "id":"genexpert-transfer-remarks"
                    },
                    "genexpert-transfer-region":{
                        "type":"text-field",
                        "id":"genexpert-transfer-region"
                    },
                    "genexpert-transfer-province":{
                        "type":"text-field",
                        "id":"genexpert-transfer-province"
                    },
                    "genexpert-transfer-city":{
                        "type":"text-field",
                        "id":"genexpert-transfer-city"
                    },
                    "genexpert-transfer-barangay":{
                        "type":"text-field",
                        "id":"genexpert-transfer-barangay"
                    },
                    "transaction-service-report-number":{
                        "type":"text-field",
                        "id":"transaction-service-report-number"   
                    }
                }
               const fields = Object.values(labels).filter(v=>{
                    return v['type'] == "text-field" || v['type'] == "select-field"
                    || v['type'] == "date-field";
                }).map(v=>{
                    if(v['type'] == "text-field"){
                        v['type'] = "text";
                    }

                    if(v['type'] == "select-field"){
                        v['type'] = "select";
                    }

                    if(v['type'] == "date-field"){
                        v['type'] = "date";
                    }
                    v['div'] = `#${v['id']}`;
                    return v;
                });

               self.clearList(fields);

            }

            function catchUpdateData(div,toData,fieldtype){
                const val = $(div).val();
        
                if(fieldtype == "div-field"){
                    $(toData).html(val);
                }
                else if(fieldtype == "date-field"){
                    const date = new Date(val);
                    date.setDate(date.getDate()+1);
                    $(toData).html(getNormalDate(date.toString()));
                }
                else if(fieldtype == "select-field"){
        
                    $(toData).data("data",val);
                    $(toData).data("id",val);
                    $(toData).html(`${$(div).children(`option[value="${val}"]`).text()}`);
                    
        
                }
                else if(fieldtype == "select-address-field"){
        
                    let valu = $(div).children(`option:selected`).text();
                    $(toData).html(`${$(div).children(`option[name="${valu}"]`).text()}`);
                    
        
                }else if(fieldtype == "div-auto-complete-field"){
                    // console.log( $(div).parent(".autocomplete").html());
                    let valu = $(div).val();
                    $(toData).html($(div).val());
                }
               
            }

            function getOnTransferEntry(){
             
                return {
                    "serial-number":$("#transaction-serial-number-field").val(),
                    "new-facility":$("#transaction-transfer-new-facility-field").val(),
                    "date-installed":$("#transaction-transfer-date-installed-field").val(),
                    'remarks':$("#transaction-transfer-remarks-field").val(),
                    
                }   
              
            }

            function validateOnTransferProcess(){

                const entry = getOnTransferEntry();

                return self.validateProcess([
                    {
                        "field":"text",
                        "value":entry["new-facility"],
                        "label":"Facility",
                        "validation":["empty"],
                        "message":"Please provide new facility."
                    },
                    {
                        "field":"date",
                        "value":entry["date-installed"],
                        "label":"Date Installed",
                        "validation":["empty"],
                        "message":"Please select installation date."
                    }
                    // ,
                    // {
                    //     "field":"text",
                    //     "value":entry["service-report"]['service-report-num'],
                    //     "label":"Service Report Number",
                    //     "validation":["empty"],
                    //     "message":"Please provide service report number."
                    // }
                ]);
                
            }

            function showTransferform(div){
                const data = $(div).parent("td").parent("tr").data("whole");
                $(".genexpert-transfer-main-form").data("whole",data);
                $(".genexpert-transfer-main-form").addClass("show-transfer-main-form");
            }

            function hideTransferform(){
                $(".genexpert-transfer-main-form").removeClass("show-transfer-main-form");
            }

            function hideInfo(){
                $(".genexpert-transfer-info-form").removeClass("show-transfer-info-form");
            }

            function showInfo(div){
                $(".genexpert-transfer-info-form").addClass("show-transfer-info-form");
                const data = $(div).parent("td").parent("tr").data("whole");
                displayInfo(data);
            }

            function displayInfo(data){
                
                    const info_form = $(".genexpert-transfer-info-form");
                    info_form.html("");
            
                    const item = `
                        <div class="genexpert-transfer-info-row">
                            <div class="genexpert-transfer-info-label">Genexpert SN:</div>
                            <div class="genexpert-transfer-info-value">${data['a_serialnumber']}</div>
                        </div>
            
                        <div class="genexpert-transfer-info-row">
                            <div class="genexpert-transfer-info-label">Facility:</div>
                            <div class="genexpert-transfer-info-value">${data['b_siteName']}</div>
            
                        </div>
            
                        <div class="genexpert-transfer-info-row">
                            <div class="genexpert-transfer-info-label">Date Installed:</div>
                            <div class="genexpert-transfer-info-value">${getOnDate(data['a_dateinstalled'])}</div>
            
                        </div>
            
                        <div class="genexpert-transfer-info-row">
                            <div class="genexpert-transfer-info-label">Installation Type:</div>
                            <div class="genexpert-transfer-info-value">${data['c_itName']}</div>
            
                        </div>
            
                        <div class="genexpert-transfer-info-row">
                            <div class="genexpert-transfer-info-label">Model Number:</div>
                            <div class="genexpert-transfer-info-value">${data['e_mnName']}</div>
                        </div>
            
                        <div class="genexpert-transfer-info-row">
                            <div class="genexpert-transfer-info-label">Engineer:</div>
                            <div class="genexpert-transfer-info-value">${data['d_fullname']}</div>
                        </div>
            
                        <div class="genexpert-transfer-info-row">
                            <div class="genexpert-transfer-info-label">Software Version:</div>
                            <div class="genexpert-transfer-info-value">${data['a_software_version']}</div>
                        </div>
            
                        <div class="genexpert-transfer-info-row">
                            <div class="genexpert-transfer-info-label">OS Version:</div>
                            <div class="genexpert-transfer-info-value">${data['a_os_version']}</div>
                        </div>
            
                        <div class="genexpert-transfer-info-row">
                            <div class="genexpert-transfer-info-label">Warranty Expiry Date:</div>
                            <div class="genexpert-transfer-info-value">${getOnDate(data['a_warranty_expiry_date'])}</div>
                        </div>
            
                        <div class="genexpert-transfer-info-row">
                            <div class="genexpert-transfer-info-label">Service Contract Expiry Date:</div>
                            <div class="genexpert-transfer-info-value">${getOnDate(data['a_service_contract_expiry_date'])}</div>
                        </div>
            
                        <div class="genexpert-transfer-info-row">
                            <div class="genexpert-transfer-info-label">Region:</div>
                            <div class="genexpert-transfer-info-value">${data['b_region']}</div>
                        </div>
            
                        <div class="genexpert-transfer-info-row">
                            <div class="genexpert-transfer-info-label">Province:</div>
                            <div class="genexpert-transfer-info-value">${data['b_province']}</div>
                        </div>
            
                        <div class="genexpert-transfer-info-row">
                            <div class="genexpert-transfer-info-label">City:</div>
                            <div class="genexpert-transfer-info-value">${data['b_city']}</div>
                        </div>
            
                        <div class="genexpert-transfer-info-row">
                            <div class="genexpert-transfer-info-label">Barangay:</div>
                            <div class="genexpert-transfer-info-value">${data['b_barangay']}</div>
                        </div>
            
                        <div class="genexpert-transfer-info-row">
                            <a href="#" class="btn btn-danger w-25" 
                            onclick="genexpertController.onView().transaction()
                            .transfer().hideInfo()">Return</a>
                        </div>
                    
                    `;
            
                    info_form.html(item);
                
            }

            function entries(){

                const reg = $("#transaction-transfer-region-field");
                const prov = $("#transaction-transfer-province-field");
                const citi = $("#transaction-transfer-city-field");
                const brgy = $("#transaction-transfer-barangay-field");
                
               return {
                    "serial-number":$("#transaction-serial-number-field").val(),
                    "new-facility":$("#transaction-transfer-new-facility-field").val(),
                    "date-installed":$("#transaction-transfer-date-installed-field").val(),
                    "transfer-by":$("#transaction-transfer-engineer-field").val(),
                    "remarks":$("#transaction-transfer-remarks-field").val(),
                    'region':reg.val() != "[]" ? JSON.parse(reg.val())['name']:"N/A",
                    'province':prov.val() != "[]" ? JSON.parse(prov.val())['name']:"N/A",
                    'city':citi.val() != "[]" ? JSON.parse(citi.val())['name']:"N/A",
                    'barangay':brgy.val() != "[]" ?JSON.parse(brgy.val())['name']:"N/A",
                    'street':$("#transaction-transfer-street-field").val(),
                    'latitude':$("#transaction-transfer-latitude-field").val(),
                    'longitude':$("#transaction-transfer-longitude-field").val()
                };
            }
            function validate(){

               const messages = [];
                const transferDatas = entries();

               if(transferDatas['new-facility'] == ""){
                    messages.push('Please provide facility to transfer!');
               }

               if(transferDatas['date-installed'] == ""){
                    messages.push('Please provide date installation during transfer!');
                }

                if(transferDatas['transfer-by'] == 0){
                    messages.push('Please provide engineer during transfer!');
                }

                if(transferDatas['remarks'] == ""){
                    messages.push('Please provide any remarks during transfer!');
                }

                return messages;
            }


            function displayOnSearch(datas){

                const tbody = $("#genexpert-transfer-tbody-area");
                tbody.html("");
                datas.forEach(data => {
        
                        const item = `
                        <tr data-whole='${JSON.stringify(data)}'>
                        <td style="width:5%">
                            <a href="#" 
                            class="btn btn-info w-100" 
                            onclick="genexpertController.onView().transaction()
                            .transfer().showInfo(this)" 
                            ><i class="fa fa-info"></i></a>
                        </td>
                        <td style="width:15%">${data['a_serialnumber']}</td>
                        <td style="width:35%">${data['b_siteName']}</td>
                        <td style="width:15%">${getOnDate(data['a_dateinstalled'])}</td>
                        <td style="width:15%">${data['c_itName']}</td>
                        <td style="width:15%">${data['d_fullname']}</td>
                        <td style="width:10%;">
                            <a href="#" class="btn btn-primary w-100" 
                            onclick="genexpertController.onView().transaction().transfer().showTransferform(this)">
                            Transfer</a>
                        </td>
                    </tr>
                        
                        `;
        
                    tbody.append(item);
                });
            }

            return {validate,displayOnSearch,showInfo,hideInfo,
                showTransferform,hideTransferform,validateOnTransferProcess,
            getOnTransferEntry,catchUpdateData,clearAll,entries};
            
        }

        function repair(){

            function entries(){
               
                return {
                    "serial-number":$("#transaction-serial-number-field").val(),
                    "date-repair":$("#transaction-repair-date-field").val(),
                    'engineer':$("#transaction-repair-engineer-field").val(),
                    'remarks':$("#transaction-repair-remarks-field").val()
                }
            }

            function validate(){

                const messages = [];
                const datas = entries();

                if(datas['date-repair'] == ""){
                    messages.push('Please provide repair date.');
                }

                if(datas['engineer'] == 0){
                    messages.push('Please provide engineer during repair.');
                }

                if(datas['remarks'] == 0){
                    messages.push('Please provide any remarks during repair.');
                }

                return messages;
                
            }


            return {entries,validate};
        }

        function pullout(){

            function clearAll(){

                const labels = {
                    "genexpert-pullout-date-pullout":{
                        "type":"date-field",
                        "id":"genexpert-pullout-date-pullout"   
                    },
                    "genexpert-pullout-remarks":{
                        "type":"text-field",
                        "id":"genexpert-pullout-remarks"   
                    },
                    "transaction-service-report-number":{
                        "type":"text-field",
                        "id":"transaction-service-report-number"   
                    }
                    
                }
               const fields = Object.values(labels).filter(v=>{
                    return v['type'] == "text-field" || v['type'] == "select-field"
                    || v['type'] == "date-field";
                }).map(v=>{
                    if(v['type'] == "text-field"){
                        v['type'] = "text";
                    }

                    if(v['type'] == "select-field"){
                        v['type'] = "select";
                    }

                    if(v['type'] == "date-field"){
                        v['type'] = "date";
                    }
                    v['div'] = `#${v['id']}`;
                    return v;
                });

               self.clearList(fields);

            }

            function getSearchValue(){
                return $("#genexpertPullOutSearchField").val();
            }

            function entries(){
               
                return {
                    "serial-number":$("#transaction-serial-number-field").val(),
                    "date-pullout":$("#transaction-pullout-date-pullout-field").val(),
                    "remarks":$("#transaction-pullout-remarks-field").val(),
                    "engineer":$("#transaction-pullout-engineer-field").val()
                }
            }

            function validate(){

                const messages = [];
                const datas = entries();
                
                if(datas['date-pullout'] == ""){
                    messages.push('Please provide pull-out date');
                }
                if(datas['engineer'] == ""){
                    messages.push('Please provide engineer during pull-out');
                }
                if(datas['remarks'] == ""){
                    messages.push('Please provide any remarks during pull-out');
                }

                return messages;

            }

            function validatePulloutEntries(){

                const value = getPulloutEntries();
                return self.validateProcess([
                    {
                        "field":"date",
                        "value":value['date-pullout'],
                        "label":"Pullout Date",
                        "validation":["empty"],
                        "message":"Please provide date of pullout."
                    },
                    {
                        "field":"date",
                        "value":value['remarks'],
                        "label":"Remarks",
                        "validation":["empty"],
                        "message":"Please provide your remarks/notes."
                    }
                    
                ]);
            }

            function validateSearchValue(){


                return self.validateProcess([
                    {
                        "field":"text",
                        "value":getSearchValue(),
                        "label":"Search",
                        "validation":["empty"],
                        "message":"Please provide search field."
                    }
                ]);
                
            }

            function showInfo(div){
                $(".genexpert-pullout-info-form").addClass("show-pullout-info-form");
                const data = $(div).parent("td").parent("tr").data("whole");
                displayInfo(data);
            }

            function hideInfo(){
                $(".genexpert-pullout-info-form").removeClass("show-pullout-info-form");
            }

            function displayInfo(data){
                
                    const info_form = $(".genexpert-pullout-info-form");
                    info_form.html("");
            
                    const item = `
                        <div class="genexpert-pullout-info-row">
                            <div class="genexpert-pullout-info-label">Genexpert SN:</div>
                            <div class="genexpert-pullout-info-value">${data['a_serialnumber']}</div>
                        </div>
            
                        <div class="genexpert-pullout-info-row">
                            <div class="genexpert-pullout-info-label">Facility:</div>
                            <div class="genexpert-pullout-info-value">${data['b_siteName']}</div>
            
                        </div>
            
                        <div class="genexpert-pullout-info-row">
                            <div class="genexpert-pullout-info-label">Date Installed:</div>
                            <div class="genexpert-pullout-info-value">${getOnDate(data['a_dateinstalled'])}</div>
            
                        </div>
            
                        <div class="genexpert-pullout-info-row">
                            <div class="genexpert-pullout-info-label">Installation Type:</div>
                            <div class="genexpert-pullout-info-value">${data['c_itName']}</div>
            
                        </div>
            
                        <div class="genexpert-pullout-info-row">
                            <div class="genexpert-pullout-info-label">Model Number:</div>
                            <div class="genexpert-pullout-info-value">${data['e_mnName']}</div>
                        </div>
            
                        <div class="genexpert-pullout-info-row">
                            <div class="genexpert-pullout-info-label">Engineer:</div>
                            <div class="genexpert-pullout-info-value">${data['d_fullname']}</div>
                        </div>
            
                        <div class="genexpert-pullout-info-row">
                            <div class="genexpert-pullout-info-label">Software Version:</div>
                            <div class="genexpert-pullout-info-value">${data['a_software_version']}</div>
                        </div>
            
                        <div class="genexpert-pullout-info-row">
                            <div class="genexpert-pullout-info-label">OS Version:</div>
                            <div class="genexpert-pullout-info-value">${data['a_os_version']}</div>
                        </div>
            
                        <div class="genexpert-pullout-info-row">
                            <div class="genexpert-pullout-info-label">Warranty Expiry Date:</div>
                            <div class="genexpert-pullout-info-value">${getOnDate(data['a_warranty_expiry_date'])}</div>
                        </div>
            
                        <div class="genexpert-pullout-info-row">
                            <div class="genexpert-pullout-info-label">Service Contract Expiry Date:</div>
                            <div class="genexpert-pullout-info-value">${getOnDate(data['a_service_contract_expiry_date'])}</div>
                        </div>
            
                        <div class="genexpert-pullout-info-row">
                            <div class="genexpert-pullout-info-label">Region:</div>
                            <div class="genexpert-pullout-info-value">${data['b_region']}</div>
                        </div>
            
                        <div class="genexpert-pullout-info-row">
                            <div class="genexpert-pullout-info-label">Province:</div>
                            <div class="genexpert-pullout-info-value">${data['b_province']}</div>
                        </div>
            
                        <div class="genexpert-pullout-info-row">
                            <div class="genexpert-pullout-info-label">City:</div>
                            <div class="genexpert-pullout-info-value">${data['b_city']}</div>
                        </div>
            
                        <div class="genexpert-pullout-info-row">
                            <div class="genexpert-pullout-info-label">Barangay:</div>
                            <div class="genexpert-pullout-info-value">${data['b_barangay']}</div>
                        </div>
            
                        <div class="genexpert-pullout-info-row">
                            <a href="#" class="btn btn-danger w-25" 
                            onclick="genexpertController.onView().transaction()
                            .pullout().hideInfo()">Return</a>
                        </div>
                    
                    `;
            
                    info_form.html(item);
                
            }

            function showPulloutform(div){
                const data = $(div).parent("td").parent("tr").data("whole");
                $(".genexpert-pullout-main-form").data("whole",data);
                $(".genexpert-pullout-main-form").addClass("show-pullout-main-form");
            }
            function hidePulloutform(){
                $(".genexpert-pullout-main-form").removeClass("show-pullout-main-form");
            }

            function displaySearchResult(datas){

                const tbody = $("#genexpert-pullout-tbody-area");
                tbody.html("");
                datas.forEach(data => {
        
                        const item = `
                        <tr data-whole='${JSON.stringify(data)}'>
                        <td style="width:5%">
                            <a href="#" 
                            class="btn btn-info w-100" 
                            onclick="genexpertController.onView().transaction()
                            .pullout().showInfo(this)" 
                            ><i class="fa fa-info"></i></a>
                        </td>
                        <td style="width:15%">${data['a_serialnumber']}</td>
                        <td style="width:35%">${data['b_siteName']}</td>
                        <td style="width:15%">${getOnDate(data['a_dateinstalled'])}</td>
                        <td style="width:15%">${data['c_itName']}</td>
                        <td style="width:15%">${data['d_fullname']}</td>
                        <td style="width:10%;">
                            <a href="#" class="btn btn-danger w-100" 
                            onclick="genexpertController.onView().transaction().pullout()
                            .showPulloutform(this)">
                            &#x2718;</a>
                        </td>
                    </tr>
                        
                        `;
        
                    tbody.append(item);
                });
            }


            return {validateSearchValue,showInfo,hideInfo,showPulloutform,hidePulloutform,
            displaySearchResult,getSearchValue,validatePulloutEntries,entries,
            clearAll,validate};
        }

        function others(){

            function entries(){
                return {
                    "other-specify":$("#transaction-others-specify-field").val(),
                    "date-of":$("#transaction-others-date-of-field").val(),
                    "engineer":$("#transaction-others-engineer-field").val(),
                    "remarks":$("#transaction-others-remark-field").val(),
                    "serial-number":$("#transaction-serial-number-field").val(),
                };
            }

            function validate(){
                const datas = entries();
                let messages = [];

                if(datas['other-specify'] == ""){
                    messages.push("Please specify title for other transaction");
                }
                if(datas['date-of'] == ""){
                    messages.push("Please specify date for other transaction");
                }
                if(datas['engineer'] == ""){
                    messages.push("Please specify engineer for other transaction");
                }

                if(datas['remarks'] == ""){

                    messages.push("Please specify remarks for other transaction");
                }

                return messages;

            }

            return {entries,validate};
        }
       

        return {installation,transfer,pullout,repair,others};
    }

   

    
}
const genexpertView = new GenexpertView();
module.exports = genexpertView;