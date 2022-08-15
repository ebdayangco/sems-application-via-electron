const dateSection = require("../../../supporters/sections/DateSection");
const { getColorWithOpacity } = require("../../../supporters/sections/RequestSection");
const moduleController = require("../../controllers/ModuleController");
const transactionController = require("../../controllers/TransactionController");
const genexpertView = require("../../views/GenexpertView");
function changingTransTypeList(){
    const categ = $("#transaction-category-list").children("option:selected").text();
    const typ = $("#transaction-type-list");

    switch(categ){
        case "Genexpert":setGenexpertTransType(); break;
        case "Haemonetics":setHaemoneticsTransType(); break;
        case "Module":setModuleTransType(); break;
        case "Xpertcheck":setXpertcheckTransType(); break;
        case "Preventive Maintenance":setPMTransType(); break;
        default:null;
    }

    function setGenexpertTransType(){
        typ.html("");
        typ.append(` 
        <option value="Installation">Installation</option>
        <option value="Module Replacement">Module Replacement</option>
        <option value="Transfer">Transfer</option>
        <option value="Pull-out">Pull-out</option>
        <option value="Xpertcheck">Xpertcheck</option>
        <option value="Preventive Maintenance">Preventive Maintenance</option>
        <option value="Others">Others</option>
        `);
    }

    function setHaemoneticsTransType(){
        typ.html("");
        typ.append(` 
        <option value="Installation">Installation</option>
        <option value="Replacement">Replacement</option>
        `);
    }

    function setModuleTransType(){
        typ.html("");
        typ.append(` 
        <option value=Installation">Installation</option>
        <option value="Replacement">Replacement</option>
        <option value="Repair">Repair</option>
        <option value="Transfer">Transfer</option>
        `);
    }

    function setXpertcheckTransType(){
        typ.html("");
        typ.append(` 
        <option value="Schedule">Schedule</option>
        `);
    }

    function setPMTransType(){
        typ.html("");
        typ.append(`<option value="Schedule">Schedule</option>`);
    }

}

function onExpandModuleItem(evt,div){
    
    const trgt = $(evt.target);
    if(!trgt.attr('class').includes("trans-underline-field")){
        
        if($(div).hasClass("frame-box-shrink")){

            $(div).removeClass("frame-box-shrink");
        }else{

            $(div).addClass("frame-box-shrink");
        }
        
    }

}

function displayForm(ignoreTransType = false){

    if(!ignoreTransType){
        changingTransTypeList();
    }

    const categ = $("#transaction-category-list").children("option:selected").text();
    const typ = $("#transaction-type-list").children("option:selected").text();

    const ledger = [
        {
            "category":"Genexpert",
            "trans-type":"Installation",
            "content":"#genexpert-installation-form"
        },
        {
            "category":"Genexpert",
            "trans-type":"Transfer",
            "content":"#genexpert-transfer-form"
        },
        {
            "category":"Genexpert",
            "trans-type":"Pull-out",
            "content":"#genexpert-pullout-form"
        },
        {
            "category":"Haemonetics",
            "trans-type":"Installation",
            "content":".haemonetics-installation-container"
        },
        {
            "category":"Genexpert",
            "trans-type":"Module Replacement",
            "content":"#module-replacement-form"
        }, 
        {
            "category":"Genexpert",
            "trans-type":"Xpertcheck",
            "content":"#xpertcheck-schedule-form"
        },
        {
            "category":"Genexpert",
            "trans-type":"Preventive Maintenance",
            "content":"#pm-schedule-form"
        }
        
    ];
        
    const current = ledger.filter(ledg=>{
        return ledg['category'] == categ && 
        ledg['trans-type'] == typ;
    })[0];

    if(current['category'] == "Genexpert"){

        $(".transaction-content-area").children().removeClass("go-to-show");
        $(".genexpert-content-area").addClass("go-to-show");

        $(".genexpert-content-area").children().removeClass("go-to-show");
        $(current['content']).addClass("go-to-show");

        if(current['trans-type'] == "Transfer" || 
        current['trans-type'] == "Module Replacement"){
            $(".transaction-submit-btn").hide();
        }else{
            $(".transaction-submit-btn").show();
        }

    }

    if(current['category'] == "Haemonetics"){

        $(".transaction-content-area").children().removeClass("go-to-show");
        $(".haemonetics-content-area").addClass("go-to-show");

        $(".haemonetics-content-area").children().removeClass("go-to-show");
        $(current['content']).addClass("go-to-show");

    }


}

function chooseSave(){

    const categ = $("#transaction-category-list").children("option:selected").text();
    const typ = $("#transaction-type-list").children("option:selected").text();

    const ledger = [
        {
            "category":"Genexpert",
            "trans-type":"Installation",
            "execute":function(){
                genexpertInstallationForm();
            }
        },
        {
            "category":"Genexpert",
            "trans-type":"Module Replacement",
            "execute":function(){
                moduleTransferForm();
            }
        },
        {
            "category":"Genexpert",
            "trans-type":"Xpertcheck",
            "execute":function(){
                xpertcheckScheduleForm();
            }
        },
        {
            "category":"Genexpert",
            "trans-type":"Preventive Maintenance",
            "execute":function(){
                pmScheduleForm();
            }
        }];
    const current = ledger.filter(ledg=>{
        return ledg['category'] == categ && 
        ledg['trans-type'] == typ;
    })[0];

    current['execute']();

}

function genexpertInstallationForm(){

    const categ = $("#transaction-category-list").children("option:selected").text();
    const typ = $("#transaction-type-list").children("option:selected").text();


    function onGenexpertInstallationSubmit(){
    
        transactionController.genexpert().installation().onProcess();
    }



    const ledger = [
        {
            "process":onGenexpertInstallationSubmit,
            "category":"Genexpert",
            "trans-type":"Installation"
        },
        {
            "url":"../transactions/genexpert/replacement.html",
            "category":"Genexpert",
            "trans-type":"Replacement"
        },
        {
            "url":"../transactions/haemonetics/installation.html",
            "category":"Haemonetics",
            "trans-type":"Installation"
        },
        {
            "url":"../transactions/modules/installation.html",
            "category":"Module",
            "trans-type":"Installation"
        }, 
        {
            "url":"../transactions/modules/repair.html",
            "category":"Module",
            "trans-type":"Repair"
        },
        {
            "url":"../transactions/modules/transfer.html",
            "category":"Module",
            "trans-type":"Transfer"
        },
        {
            "url":"../transactions/modules/replacement.html",
            "category":"Module",
            "trans-type":"Replacement"
        },
        {
            "url":"../transactions/xpertcheck/schedule.html",
            "category":"Xpertcheck",
            "trans-type":"Schedule"
        },
        {
            "url":"../transactions/preventive-maintenance/schedule.html",
            "category":"Preventive Maintenance",
            "trans-type":"Schedule"
        }
        
    ]

    const current = ledger.filter(ledg=>{
        return ledg['category'] == categ && 
        ledg['trans-type'] == typ;
    })[0];

    current['process']();


}
function moduleTransferForm(){
    moduletransactionController.goInstall();

}

function xpertcheckScheduleForm(){
          
    xpertcheckTransactionController.goSchedule();
}

function pmScheduleForm(){
    pmTransactionController.goSchedule();
}

function toggleToShowMachineInfo(div){

    $(div).parent(".genexpert-result-item").toggleClass("toggle-more-result-view");
}

function toggleServiceReportOption(div){
    const cc = $(div);
    if(cc.prop('checked') === true){
        $("#service-report-reveal-area").addClass("service-reveal-report");
    }else{
        $("#service-report-reveal-area").removeClass("service-reveal-report");
    }
    
}
function unlockedFrameBoxScreen(div){

    const scr = 
    $(div).parent(".frame-item").parent(".frame-row").siblings(".frame-box-locked-screen");
    
    if($(div).prop("checked") === true){
        scr.addClass("frame-box-unlocked-screen");
    }else{
        scr.removeClass("frame-box-unlocked-screen");
    }
}

function toggleJotformOption(evt){
    
    const dis = $(".transaction-jotform-ticket-no-field").attr("disabled");

    if(dis){
        $(".transaction-jotform-select").removeAttr("disabled");
        $(".transaction-jotform-input").removeAttr("disabled");
    }else{
        $(".transaction-jotform-select").attr("disabled","disabled");
        $(".transaction-jotform-input").attr("disabled","disabled");
    }
}


function genexpertSNServiceTypeOptionSelect(div){
    getSNJotformTicketNo(div,function(){
        loadingDependencies();
    });
    

}


function genexpertSNServiceTypeOption(div){


    // getSNJotformTicketNo(div,function(){

        const dis = $(div).val();
    
        const v = [...dis].filter(d=>{
            return d != '0';
        });

        if(dis.length > 5 && v.length != 0){
            // $("#transaction-type-of-service-field").removeAttr("disabled");
           
        }else{
            // $("#transaction-type-of-service-field").attr("disabled","disabled");
            
        }

    // });


   
}

function detectChanges(div){

    const container = $(".transaction-module-replacement-area");
    const prevData = container.data("current-data");
    
    const box = $(div).parent(".frame-input").parent(".frame-item").parent(".frame-row")
    .parent(".module-replace-basic-info-area").parent(".frame-box");
    const count = box.data("count");
    const specificData = prevData[count];


    const box_area = box.children(".module-replace-basic-info-area");

    const row = box_area.children(".frame-row")
    .children(".frame-item").children(".frame-input");

    const curr_sn = row.children("#transaction-module-replacement-serial-number-field");
    const curr_location = row.children("#transaction-module-replacement-location-field");

    const curr_dateinstalled = row.children("#transaction-module-replacement-date-installed-field");
    const curr_status = row.children("#transaction-module-replacement-status-field");

    const curr_engineer = row.children("#transaction-module-replacement-engineer-field");
    const curr_installType = row.children("#transaction-module-replacement-installation-type-field");

    let changes = false;


    if(specificData['serialnumber'] != curr_sn.val()){
        changes = true;
    }

    if(specificData['location'] != curr_location.val()){
        changes = true;
    }

    
    if(getOnDate(specificData['dateinstalled']) != curr_dateinstalled.val()){
        changes = true;
    }

    if(specificData['engineerID'] != curr_engineer.val()){
        changes = true;
    }
 
    if(specificData['status'] != curr_status.val()){
        changes = true;
    }

    if(specificData['itID'] != curr_installType.val()){
        changes = true;
    }



    if(!changes){
        box.removeClass("edited-background");
    }else{
        box.addClass("edited-background");
    }

    
}

function getModuleChanges(){

    const lists = [];
    const container = $(".transaction-module-replacement-area");
    const datas = container.data("current-data");
    container.children(".frame-row").each((i,el)=>{


        const box = $(el).children(".frame-box");

            if(box.hasClass("edited-background")){

                const box_area = box.children(".module-replace-basic-info-area");

                const row = box_area.children(".frame-row")
                .children(".frame-item").children(".frame-input");
                
                const curr_sn = row.children("#transaction-module-replacement-serial-number-field");
                const curr_location = row.children("#transaction-module-replacement-location-field");
            
                const curr_dateinstalled = row.children("#transaction-module-replacement-date-installed-field");
                const curr_status = row.children("#transaction-module-replacement-status-field");
            
                const curr_engineer = row.children("#transaction-module-replacement-engineer-field");
                const curr_installType = row.children("#transaction-module-replacement-installation-type-field");
                const curr_partnumber = row.children("#transaction-module-replacement-part-number-field");
                const curr_revisionnumber = row.children("#transaction-module-replacement-revision-number-field");

                const prevData = datas[i];

                const cData = {
                    "serial-number":curr_sn.val(),
                    "location":curr_location.val(),
                    "date-installed":curr_dateinstalled.val(),
                    "status":curr_status.val(),
                    "engineer":curr_engineer.val(),
                    "installation-type":curr_installType.val(),
                    "part-number":curr_partnumber.val(),
                    "revision-number":curr_revisionnumber.val()
                }
                lists.push({
                    "previous":prevData,
                    "current":cData
                });
            }
               
            
    });

    return lists;

}
function getFacilitySN(div,val=""){

    let facVal = "";
    if(div != null){
        facVal=$(div).val();
    }else{
        facVal = val;
    }

    genexpertController.getGenexpertViaFacility(facVal,function(res){

        if(res.length == 0){
            $(".transaction-serial-number-input").removeClass("hide-serial-number-select");
            $(".transaction-serial-number-select").addClass("hide-serial-number-select");
        }else{
            $(".transaction-serial-number-select").removeClass("hide-serial-number-select");
            $(".transaction-serial-number-input").addClass("hide-serial-number-select");

            const sel = $(".transaction-serial-number-select");
            sel.html("");
            // sel.append(`<option value="new">new installation</option>`);
            res.forEach(d=>{
                sel.append(`<option value="${d['serialnumber']}" 
                data-model-number="${d['mnID']}">${d['serialnumber']}</option>`);
            });
            loadingDependencies();

            $("#transaction-type-of-service-field").removeAttr("disabled");
            

            const modelNumber = sel.children('option:selected').data("model-number");

            $("#transaction-model-number-field").val(modelNumber);

        }

    });

    
}
function getSNJotformTicketNo(div,callback){

    const snvalue = $(div).val();

    jotformController.findSubmission_viaMachineSN(snvalue,function(res){

        if(res.length == 0){
            
            $(".transaction-jotform-input").removeClass("hide-jotform-component");
            $(".transaction-jotform-select").addClass("hide-jotform-component");
            
            $("#transaction-jotform-connect-field").prop("checked",false);

            $(".transaction-jotform-input").prop("disabled",true);
            $(".transaction-jotform-select").prop("disabled",true);

        }else{
            $(".transaction-jotform-select").removeClass("hide-jotform-component");
            $(".transaction-jotform-input").addClass("hide-jotform-component");

            $("#transaction-jotform-connect-field").prop("checked",true);
            
            $(".transaction-jotform-select").prop("disabled",false);
            $(".transaction-jotform-input").prop("disabled",false);

            const sel = $(".transaction-jotform-select");
            sel.html("");
    
            res.forEach(d=>{

                sel.append(`<option value="${d['ticket_no']}" class="w-100" 
                data-whole="${d}">${d['ticket_no']}</option>`);
            });
            
            // sel.attr("style","width:100% !important");
            
        }

        callback();
    });

}

function displayModuleInfo(div){

    const d =$(div).children('option:selected').data("data");
   
    displayModuleInfoOnSelect(d,$(div));

}

function displayModuleInfoOnSelect(d,div){

    const module_trans_selection = $(".transaction-module-select-transaction-field");

    if(d != undefined){

        if(div){         

            const parent = $(div).parent().parent().parent();
    
            
             const loc = parent.siblings(":nth-child(2)")
            .children(".frame-item:nth-child(2)")
            .children(".frame-input")
            .children(".transaction-module-location-field");
    
            const dateinstalled = parent.siblings(":nth-child(3)")
            .children(".frame-item:nth-child(1)")
            .children(".frame-input")
            .children(".transaction-module-date-installed-field");
    
            const status = parent.siblings(":nth-child(3)")
            .children(".frame-item:nth-child(2)")
            .children(".frame-input")
            .children(".transaction-module-status-field");
    
            const engineer = parent.siblings(":nth-child(4)")
            .children(".frame-item:nth-child(1)")
            .children(".frame-input")
            .children(".transaction-module-engineer-field");
    
            const installType = parent.siblings(":nth-child(4)")
            .children(".frame-item:nth-child(2)")
            .children(".frame-input")
            .children(".transaction-module-installation-type-field");
    
            
            const partNumber = parent.siblings(":nth-child(5)")
            .children(".frame-item:nth-child(1)")
            .children(".frame-input")
            .children(".transaction-module-part-number-field");
    
            const revisionNumber = parent.siblings(":nth-child(5)")
            .children(".frame-item:nth-child(2)")
            .children(".frame-input")
            .children(".transaction-module-revision-number-field");
    
            loc.val(d['location']);
            dateinstalled.val(getOnDate(d['dateinstalled']));
            status.val(d['status']);
            engineer.val(d['engineerID']);
            installType.val(d['itID']);
            partNumber.val(d['part_number']);
            revisionNumber.val(d['revision_number']);
    
        }else{
            
            const loc = $(".transaction-module-location-field");
            const dateinstalled = $(".transaction-module-date-installed-field");
            const status = $(".transaction-module-status-field");
            const engineer = $(".transaction-module-engineer-field");
            const installType = $(".transaction-module-installation-type-field");
            const partNumber = $(".transaction-module-part-number-field");
            const revisionNumber = $(".transaction-module-revision-number-field");
        
            loc.val(d['location']);
            dateinstalled.val(getOnDate(d['dateinstalled']));
            status.val(d['status']);
            engineer.val(d['engineerID']);
            installType.val(d['itID']);
            partNumber.val(d['part_number']);
            revisionNumber.val(d['revision_number']);
        }

    }else{

        $(".module-entry-list").html("");
       
    }



    

}

function keepNewModuleInstallationData(div){
    const parent = $(div).parent().parent().parent();

    const loc = parent.siblings(":nth-child(2)")
    .children(".frame-item:nth-child(2)")
    .children(".frame-input")
    .children(".transaction-module-location-field");

    const mod = $(div).parent().parent().siblings()
    .children(".frame-input")
    .children(".transaction-module-replace-from-field");

    const dateinstalled = parent.siblings(":nth-child(3)")
    .children(".frame-item:nth-child(1)")
    .children(".frame-input")
    .children(".transaction-module-date-installed-field");

    const status = parent.siblings(":nth-child(3)")
    .children(".frame-item:nth-child(2)")
    .children(".frame-input")
    .children(".transaction-module-status-field");

    const engineer = parent.siblings(":nth-child(4)")
    .children(".frame-item:nth-child(1)")
    .children(".frame-input")
    .children(".transaction-module-engineer-field");

    const installType = parent.siblings(":nth-child(4)")
    .children(".frame-item:nth-child(2)")
    .children(".frame-input")
    .children(".transaction-module-installation-type-field");

    
    const partNumber = parent.siblings(":nth-child(5)")
    .children(".frame-item:nth-child(1)")
    .children(".frame-input")
    .children(".transaction-module-part-number-field");

    const revisionNumber = parent.siblings(":nth-child(5)")
    .children(".frame-item:nth-child(2)")
    .children(".frame-input")
    .children(".transaction-module-revision-number-field");


    $(div).data('new',{
        "location":loc.val(),
        "date-installed":dateinstalled.val(),
        "status":status.val(),
        "engineer":engineer.val(),
        "installation-type":installType.val(),
        "part-number":partNumber.val(),
        "revision-number":revisionNumber.val()
    });

     mod.html("");
    
    moduleOnSNList.forEach((dd,i) => {
        
        const opt = $(`<option value="${dd['serialnumber']}">${dd['serialnumber']}</option>`);
        opt.data("data",dd);
        mod.append(opt);
    
    });
    
    const d = mod.children("option:selected").data("data");
   
    displayModuleInfoOnSelect(d,$(mod));
    
    mod.prop('disabled',false);
    partNumber.prop('disabled',false);
    revisionNumber.prop('disabled',false);

}

function recalibrateAreaDisplay(){
    $(".re-calibrate-area").addClass('re-calibrate-reveal');
}

function remaintenanceAreaDisplay(){
    $(".re-maintenance-area").addClass('re-maintenance-reveal');
}

function resetNewModuleInstallationData(){
    const loc = $(".transaction-module-location-field");
    const dateinstalled = $(".transaction-module-date-installed-field");
    const status = $(".transaction-module-status-field");
    const engineer = $(".transaction-module-engineer-field");
    const installType = $(".transaction-module-installation-type-field");
    const partNumber = $(".transaction-module-part-number-field");
    const revisionNumber = $(".transaction-module-revision-number-field");
    loc.val("");
    dateinstalled.val(getOnDate());
    status.val("Active");
    engineer.val(0);
    installType.val(0);
    partNumber.val("");
    revisionNumber.val("");
}

function displayNewModuleInstallationData(div){

    const parent = $(div).parent().parent().parent();
    

    const loc = parent.siblings(":nth-child(2)")
    .children(".frame-item:nth-child(2)")
    .children(".frame-input")
    .children(".transaction-module-location-field");

    const mod = $(div).parent().parent().siblings()
    .children(".frame-input")
    .children(".transaction-module-replace-from-field");
    

    const dateinstalled = parent.siblings(":nth-child(3)")
    .children(".frame-item:nth-child(1)")
    .children(".frame-input")
    .children(".transaction-module-date-installed-field");

    const status = parent.siblings(":nth-child(3)")
    .children(".frame-item:nth-child(2)")
    .children(".frame-input")
    .children(".transaction-module-status-field");

    const engineer = parent.siblings(":nth-child(4)")
    .children(".frame-item:nth-child(1)")
    .children(".frame-input")
    .children(".transaction-module-engineer-field");

    const installType = parent.siblings(":nth-child(4)")
    .children(".frame-item:nth-child(2)")
    .children(".frame-input")
    .children(".transaction-module-installation-type-field");

    
    const partNumber = parent.siblings(":nth-child(5)")
    .children(".frame-item:nth-child(1)")
    .children(".frame-input")
    .children(".transaction-module-part-number-field");

    const revisionNumber = parent.siblings(":nth-child(5)")
    .children(".frame-item:nth-child(2)")
    .children(".frame-input")
    .children(".transaction-module-revision-number-field");

   
    const d = $(div).data("new");
    loc.val(d['location'] ? d['location']:"");
    dateinstalled.val(d['date-installed'] ? getOnDate(d['date-installed']):"");
    status.val(d['status'] ? d['status']:"");
    engineer.val(d['engineer'] ? d['engineer']:0);
    installType.val(d['installation-type'] ? d['installation-type']:0);
    partNumber.val(d['part-number'] ? d['part-number']:"");
    revisionNumber.val(d['revision-number'] ? d['revision-number']:"");

    mod.val("");
    mod.prop('disabled',true);
    partNumber.prop('disabled',true);
    revisionNumber.prop('disabled',true);
}


let moduleOnSNList = [];

function loadingDependencies(){

    const sn_field = $("#transaction-serial-number-field");
    const sn = sn_field.val();

    async function loadModule(){

        
        // $(".genexpert-module-replacement-reveal-form").addClass("maximize-height");
        // displayMiniLoader(".module-replacement-loader-reveal",
        // "module-replacement-loader-screen","Searching Module...");
        // $(".module-replacement-loader-reveal").show();


        const modelNumber = sn_field.children('option:selected').data("model-number");

        $("#transaction-model-number-field").val(modelNumber);
        
        
        moduleController.getModule(`AND genexpertSN="${sn}"`,function(res){
            
            const  module_container = $(".transaction-module-replacement-area");
            module_container.html("");

            module_container.data("current-data",res);

            const f = $(".transaction-module-replace-from-field");
            f.html("");

            moduleOnSNList = res;

            res.forEach((d,i) => {
                
                const item = $(`<option value="${d['serialnumber']}">${d['serialnumber']}
                </option>`);
                item.data("data",d);
                f.append(item);
            

            });
            const module_trans_selection = $(".transaction-module-select-transaction-field");
            if(res.length == 0){
                
            }else{
                
                const d = f.children("option:selected").data("data");
                displayModuleInfoOnSelect(d);
            }
           

            // $(".module-replacement-loader-reveal").hide();
            // $(".genexpert-module-replacement-reveal-form").removeClass("maximize-height");

        });

    }

    async function loadCalibration(){

        const new_start = $("#transaction-xpertcheck-new-start-calibration-field");
        const new_next = $("#transaction-xpertcheck-new-next-calibration-field");
        xpertcheckController.getXpertcheck(sn,function(res){

            if(res.length != 0){
               
                $("#transaction-xpertcheck-last-calibration-field").
                val(getOnDate(res[0]['calibrate_start']));

                $("#transaction-xpertcheck-last-on-next-calibration-field").
                val(getOnDate(res[0]['calibrate_done']));
    
                
                const nextyear = dateSection.addYear(new Date(getOnDate(res[0]['calibrate_done'])),1);
                new_start.val(getOnDate(res[0]['calibrate_done']));
                new_next.val(getOnDate(nextyear));
            }else{
                $("#transaction-xpertcheck-last-calibration-field").val("");
                $("#transaction-xpertcheck-last-on-next-calibration-field").val("");
                new_start.val("");
                new_next.val("");

            }
           
           
           
        });
    }

    async function loadMaintanance(){

        const new_start = $("#transaction-pm-new-start-maintenance-field");
        const new_next = $("#transaction-pm-new-next-maintenance-field");
        const old_start = $("#transaction-pm-last-maintenance-field");
        const old_next = $("#transaction-pm-last-next-maintenance-field");
        preventiveMaintenanceController.getPM(sn,function(res){

            if(res.length != 0){
               
                old_start.val(getOnDate(res[0]['calibrate_start']));

                old_next.val(getOnDate(res[0]['calibrate_done']));
    
                
                const nextyear = dateSection.addYear(new Date(getOnDate(res[0]['calibrate_done'])),1);
                new_start.val(getOnDate(res[0]['calibrate_done']));
                new_next.val(getOnDate(nextyear));
            }else{
                old_start.val("");
                old_next.val("");
                new_start.val("");
                new_next.val("");

            }
           
           
           
        });
    }

    loadModule();
    loadCalibration();
    loadMaintanance();

}

function pmCalcNext(){
    
    const calibrationFrom = $("#transaction-pm-new-start-maintenance-field").val();
    const timeLengthVal = $("#transaction-pm-duration-number-field").val();
    const timeLengthFormat = $("#transaction-pm-duration-frequency-field").children("option:selected").val();
    const calibrationTo = $("#transaction-pm-new-next-maintenance-field");

    if(calibrationFrom != "" && timeLengthVal != "" && timeLengthFormat != ""){
        let date = new Date(calibrationFrom);
        

        function addDays(theDate, days) {
            days++;
            return new Date(theDate.getTime() + days*24*60*60*1000);
        }


        if(timeLengthFormat == "year"){
            date.setDate(date.getDate()+1);
            date.setFullYear(date.getFullYear() + parseInt(timeLengthVal));
            calibrationTo.val(getOnDate(date.toDateString()));
        }
        if(timeLengthFormat == "month"){
            date.setDate(date.getDate()+1);
            date.setMonth(date.getMonth() + parseInt(timeLengthVal));
            calibrationTo.val(getOnDate(date.toDateString()));

        }
        if(timeLengthFormat == "day"){
           
            calibrationTo.val(getOnDate(addDays(date,timeLengthVal).toDateString()));

        }
        
        

    }

}

function xpertcheckCalcNext(){
    
    const calibrationFrom = $("#transaction-xpertcheck-new-start-calibration-field").val();
    const calibrationTo = $("#transaction-xpertcheck-new-next-calibration-field");

    if(calibrationFrom != ""){
        let date = new Date(calibrationFrom);

        date.setDate(date.getDate()+1);
        date.setFullYear(date.getFullYear() + 1);
        calibrationTo.val(getOnDate(date.toDateString()));
        
        

    }

}
function installation_prioritize(div){


    const installation_form = $(".genexpert-installation-reveal-form");
    const module_trans_selection = div ? $(div):$(".transaction-module-select-transaction-field");
    
    if(installation_form.children().hasClass("pinned-div")){
       
        $(".transaction-serial-number-input").removeClass("hide-serial-number-select");
        $(".transaction-serial-number-select").addClass("hide-serial-number-select");

        module_trans_selection.html(`<option value="New Installation">New Installation</option>`);
        module_trans_selection.trigger('change');
        return true;

    }else{
        
        $(".transaction-serial-number-input").addClass("hide-serial-number-select");
        $(".transaction-serial-number-select").removeClass("hide-serial-number-select");

        module_trans_selection.html(`
        <option value="Replacement">Replacement</option>
        <option value="New Installation">New Installation</option>`);
        module_trans_selection.trigger('change');
        // FOR MODULE WHICH IS ONLY NEW INSTALLATION NOT REPLACEMENT

        return false;


    }
}
function toggleServiceTypeOption(div){

    const val = $(div).val();

    const installation_form = $(".genexpert-installation-reveal-form");
    const module_trans_selection = $(".transaction-module-select-transaction-field");


    function notAllowedMessage(message){

        if(installation_prioritize()){
            $(".transaction-service-error-message").html(message);
            $(".transaction-service-error-message").show();
            setTimeout(function(){
                $(".transaction-service-error-message").show();
            },5000);

            return true;
        }else{
            return false;
        }
    }

    switch(val){

        case "None":$("#service-type-reveal-area").removeClass("service-reveal"); break;
        case "Installation":installationDisplay(); break;
        case "Repair":repairDisplay(); break;
        case "Transfer":transferDisplay(); break;
        case "Pull-out":pullOutDisplay(); break;
        case "Module":moduleReplacementDisplay(); break;
        case "Xpertcheck":xpertcheckDisplay(); break;
        case "Maintenance":maintenanceDisplay(); break;
        case "Others":otherDisplay();break;
        default:;
        
    }


    function removeLabelOnRevealForms(){
        $(".genexpert-installation-reveal-form").removeClass("select-label");
        $(".genexpert-repair-reveal-form").removeClass("select-label");
        $(".genexpert-transfer-reveal-form").removeClass("select-label");
        $(".genexpert-pullout-reveal-form").removeClass("select-label");
        $(".genexpert-module-replacement-reveal-form").removeClass("select-label");
        $(".genexpert-xpertcheck-reveal-form").removeClass("select-label");
        $(".genexpert-maintenance-reveal-form").removeClass("select-label");
        $(".genexpert-other-reveal-form").removeClass("select-label");
    }

    function installationDisplay(){

        installation_form.addClass("st-reveal-form-reveal").siblings().
        removeClass("st-reveal-form-reveal");
        $("#service-type-reveal-area").addClass("service-reveal");

        $(".transaction-serial-number-input").removeClass("hide-serial-number-select");

        $(".transaction-serial-number-select").addClass("hide-serial-number-select");

        removeLabelOnRevealForms();
        $(".genexpert-installation-reveal-form").addClass("select-label");

        // $(".service-report-toggle-box").prop('checked', false);
        // $("#service-report-reveal-area").removeClass("service-reveal-report");
    }

    function repairDisplay(){

        if(!notAllowedMessage('Repair transaction is not allowed during Installation.')){
            $(".genexpert-repair-reveal-form").addClass("st-reveal-form-reveal").siblings().
            removeClass("st-reveal-form-reveal");
            $("#service-type-reveal-area").addClass("service-reveal");
            removeLabelOnRevealForms();
            $(".genexpert-repair-reveal-form").addClass("select-label");
        }else{
            $(div).val("Installation");
        }
      
    }


    function transferDisplay(){
        if(!notAllowedMessage('Transfer transaction is not allowed during Installation.')){

            $(".genexpert-transfer-reveal-form").addClass("st-reveal-form-reveal").siblings().
            removeClass("st-reveal-form-reveal");
            $("#service-type-reveal-area").addClass("service-reveal");
            removeLabelOnRevealForms();
            $(".genexpert-transfer-reveal-form").addClass("select-label");

        }else{
            $(div).val("Installation");
        }

        
        
    }

    function pullOutDisplay(){
       
        if(!notAllowedMessage('Pull out transaction is not allowed during Installation.')){

            $(".genexpert-pullout-reveal-form").addClass("st-reveal-form-reveal").siblings().
            removeClass("st-reveal-form-reveal");
            $("#service-type-reveal-area").addClass("service-reveal");
            removeLabelOnRevealForms();
            $(".genexpert-pullout-reveal-form").addClass("select-label");

        }else{
            $(div).val("Installation");
        }

    }

    function moduleReplacementDisplay(){

    
        $(".genexpert-module-replacement-reveal-form").addClass("st-reveal-form-reveal").siblings().
        removeClass("st-reveal-form-reveal");
        $("#service-type-reveal-area").addClass("service-reveal");

        
        if($(".genexpert-installation-reveal-form").children().hasClass("pinned-div")){
           
            $(".transaction-serial-number-input").removeClass("hide-serial-number-select");
            $(".transaction-serial-number-select").addClass("hide-serial-number-select");
    
        }else{
            
            $(".transaction-serial-number-input").addClass("hide-serial-number-select");
            $(".transaction-serial-number-select").removeClass("hide-serial-number-select");
    
        }

        removeLabelOnRevealForms();
        $(".genexpert-module-replacement-reveal-form").addClass("select-label");




        
    }

    function xpertcheckDisplay(){
        $(".genexpert-xpertcheck-reveal-form").addClass("st-reveal-form-reveal").siblings().
        removeClass("st-reveal-form-reveal");
        $("#service-type-reveal-area").addClass("service-reveal");

     
        // installation_prioritize();
        removeLabelOnRevealForms();
        $(".genexpert-xpertcheck-reveal-form").addClass("select-label");
    }

    function maintenanceDisplay(){

        $(".genexpert-maintenance-reveal-form").addClass("st-reveal-form-reveal").siblings().
        removeClass("st-reveal-form-reveal");
        $("#service-type-reveal-area").addClass("service-reveal");

    
        // installation_prioritize();
        removeLabelOnRevealForms();
        $(".genexpert-maintenance-reveal-form").addClass("select-label");
    }

    function otherDisplay(){
        
        if(!notAllowedMessage('Pull out transaction is not allowed during Installation.')){

            $(".genexpert-other-reveal-form").addClass("st-reveal-form-reveal").siblings().
            removeClass("st-reveal-form-reveal");
            $("#service-type-reveal-area").addClass("service-reveal");
            removeLabelOnRevealForms();
            $(".genexpert-other-reveal-form").addClass("select-label");

        }else{
            $(div).val("Installation");
        }
    }


    
}

function checkInstallationEntry(){

    const percentage = genexpertView.transaction().installation().errorFreePercentage();
    const iarea = $(".service-reveal");

    $(".service-reveal").css("background",getColorWithOpacity(percentage/100,0.2));
    

}

const  mod_trans_selection = $(".module-row-entry .transaction-module-select-transaction-field");

function pinTransaction(div){
    const root = $(div).parent().parent().parent();
    const service_reveal_area = root.children(".service-reveal-area");
    const st_reveal_form_reveal = service_reveal_area.children(".st-reveal-form-reveal");
    st_reveal_form_reveal.append(`<div class='pinned-div'> 
    <a href="#" onclick="unPinTransaction(this)">
        <i class="fa fa-thumb-tack"></i> </a></div>`);

    if(st_reveal_form_reveal.hasClass("genexpert-installation-reveal-form")){

        const  type_of_service = $("#transaction-type-of-service-field");
        type_of_service.html(`<option value="None"></option>
        <option value="Installation">Installation</option>
        <option value="Module">Module</option>
        <option value="Xpertcheck">Xpertcheck/Calibration</option>
        <option value="Maintenance">Maintenance</option>`);

        type_of_service.val("Installation");
        type_of_service.trigger('change');

        $('.transaction-module-select-transaction-field').html(`
        <option value="New Installation">New Installation</option>`);
        $('.transaction-module-select-transaction-field').trigger('change');


    }
    


}
function unPinTransaction(div){
    const st_reveal_form_reveal = $(div).parent().parent();
    $(div).parent().remove();

    if(st_reveal_form_reveal.hasClass("genexpert-installation-reveal-form")){
        const  type_of_service = $("#transaction-type-of-service-field");

        type_of_service.html(`
        <option value="None"></option>
        <option value="Installation">Installation</option>
        <option value="Repair">Repair</option>
        <option value="Transfer">Transfer</option>
        <option value="Pull-out">Pull-out</option>
        <option value="Module">Module</option>
        <option value="Xpertcheck">Xpertcheck/Calibration</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Others">Others</option>`);
        type_of_service.val("Installation");
        type_of_service.trigger('change');

        $('.transaction-module-select-transaction-field').html(`
        <option value="Replacement">Replacement</option>
        <option value="New Installation">New Installation</option>`);

        $('.transaction-module-select-transaction-field').val('Replacement');
        $('.transaction-module-select-transaction-field').trigger('change');

    }
}
function addModuleTransaction(){

    const item = $(".module-row-main");
    const container = $(".module-entry-list");
    let hr = "";
    if(container.html() != ""){
        hr = `<hr class='module-form-divider'>`;
    }
   
    const items = $(`${hr}<div class="frame-row module-row-entry mt-3" 
    tabindex="1" onkeyup="removeForm(event,this)">${item.html()}</div>`);
    container.append(items);

    const sel = items.children(".frame-row").children(".frame-item")
    .children(".frame-input").children("select.transaction-module-replace-from-field");
    sel.html("");

    const mod_sel = items.children(".frame-row").children(".frame-item")
    .children(".transaction-module-select-transaction-field");

    mod_sel.trigger('change');

    if(!installation_prioritize(mod_sel)){

        moduleOnSNList.forEach((d,i) => {
        
            const opt = $(`<option value="${d['serialnumber']}">${d['serialnumber']}</option>`);
            opt.data("data",d);
            sel.append(opt);
        });
    }

 
   
    

}

function displayAddressFromNewTransfer(){
    const transfer_add = $(".transfer-facility-new-address");
    if(transfer_add.hasClass("transfer-facility-new-address-reveal")){
        transfer_add.removeClass("transfer-facility-new-address-reveal");
    }else{
        transfer_add.addClass("transfer-facility-new-address-reveal");
    }
}


function showSideTable(div){
    const btn = $(div);
    btn.addClass("main-transaction-head-item-active").siblings()
    .removeClass("main-transaction-head-item-active");

    const panel_id = btn.attr("panel-id");
    const panel = $(`#${panel_id}`);
    panel.removeClass("hide-trans-panel").siblings().addClass("hide-trans-panel");
}
function addMainTransRow(){

    const tbody = $(`#transaction-main-tbody`);
    const item = $(`<tr row-id='${getRandomNumbers()}' onclick="setSelectedTransaction(this)">
    <td class="w-2-5 p-1">
        <a href="#" class="btn btn-danger trans-del-btn" 
        onclick="deleteRow(this)"><i class="fa fa-trash"></i></a>
    </td>
   
    <td class="w-30 trans-facility-area">
        <input type="text"
        class="trans-underline-field w-100"></td>
    </td>
    <td class="w-20"><input type="text"
        class="trans-underline-field w-100"></td>
    <td class="w-20"><input type="text"
        class="trans-underline-field w-100"></td>
    <td class="w-10"><input type="text"
        class="trans-underline-field w-100"></td>
    <td class="w-17-5">
        <input type="text"
        class="trans-underline-field w-100"></td>
    </tr>`);

    const div = item.children("td.trans-facility-area").children("input");
    autoCompleteView.displaySites(div,"siteName");
    tbody.append(item);
    
}
function addMachine(){

    function installationRow(){

        const tr = $(`#transaction-main-tbody`).children('tr.selected-main-trans-style');
        const trans_row_id = tr.attr("row-id");

        const tbody = $("#transaction-machine-installation-tbody");
        const item = `<tr row-id="${trans_row_id}">
        <td class="w-20-px p-1">
        <a href="#" class="btn btn-danger trans-del-btn" 
        onclick="deleteRow(this)"><i class="fa fa-trash"></i></a>
        </td>
        <td class="w-150-px">
        <select class="trans-underline-field w-100 
        engineer-drop-down"></select></td>
        <td class="w-100-px"><input type="date"
        class="trans-underline-field w-100"></td>
        <td class="w-150-px"><select class="trans-underline-field w-100 
        installation-type-drop-down"></select></td>
        <td class="w-150-px"><input type="text"
        class="trans-underline-field w-100"></td>
        <td class="w-100-px"><input type="text"
        class="trans-underline-field w-100"></td>
        <td class="w-150-px"><input type="date"
        class="trans-underline-field w-100"></td>
        <td class="w-200-px"><input type="date"
        class="trans-underline-field w-100"></td>
        <td class="w-300-px"><input type="text"
        class="trans-underline-field w-100"></td>
        </tr>`;

        tbody.append(item);
    }
    function updateRow(){

        const tr = $(`#transaction-main-tbody`).children('tr.selected-main-trans-style');
        const trans_row_id = tr.attr("row-id");

        const tbody = $("#transaction-machine-update-tbody");
        const item = `<tr row-id="${trans_row_id}">
            <td class="w-20-px p-1">
            <a href="#" class="btn btn-danger trans-del-btn" 
            onclick="deleteRow(this)"><i class="fa fa-trash"></i></a>
            </td>
            
            <td class="w-150-px"><input type="text"
            class="trans-underline-field w-100"></td>
            <td class="w-350-px"><input type="text"
            class="trans-underline-field w-100"></td>
            <td class="w-150-px"><input type="date"
            class="trans-underline-field w-100"></td>
            <td class="w-200-px"><select class="trans-underline-field w-100 
            installation-type-drop-down"></select></td>
            <td class="w-300-px"><select class="trans-underline-field w-100 
            model-number-drop-down"></select></td>
            <td class="w-200-px"><select class="trans-underline-field w-100 
            engineer-drop-down"></select></td>
            <td class="w-150-px"><select class="trans-underline-field w-100">
                <option value="Active">Active</option>
                <option value="Terminated">Terminated</option>
            </select></td>
            <td class="w-150-px"><input type="text"
            class="trans-underline-field w-100"></td>
            <td class="w-150-px"><input type="text"
            class="trans-underline-field w-100"></td>
            <td class="w-200-px"><input type="date"
            class="trans-underline-field w-100"></td>
            <td class="w-200-px"><input type="date"
            class="trans-underline-field w-100"></td>
            <td class="w-300-px"><input type="text"
            class="trans-underline-field w-100"></td>
        </tr>`;

        tbody.append(item);
    }
    function repairRow(){
        const tr = $(`#transaction-main-tbody`).children('tr.selected-main-trans-style');
        const trans_row_id = tr.attr("row-id");

        const tbody = $("#transaction-machine-repair-tbody");
        const item = `<tr row-id="${trans_row_id}">
            <td class="w-2-5 p-1">
            <a href="#" class="btn btn-danger trans-del-btn" 
            onclick="deleteRow(this)"><i class="fa fa-trash"></i></a>
            </td>
            
            <td class="w-15"><input type="date"
            class="trans-underline-field w-100"></td>
            <td class="w-22-5">
            <select class="trans-underline-field w-100 
            engineer-drop-down"></select>
            </td>
            <td class="w-60"><input type="text"
            class="trans-underline-field w-100"></td>

        </tr>`;

        tbody.append(item);

    }
    function transferRow(){

        const tr = $(`#transaction-main-tbody`).children('tr.selected-main-trans-style');
        const trans_row_id = tr.attr("row-id");

        const tbody = $("#transaction-machine-transfer-tbody");
        const item = `<tr row-id="${trans_row_id}">
            <td class="w-2-5 p-1">
            <a href="#" class="btn btn-danger trans-del-btn" 
            onclick="deleteRow(this)"><i class="fa fa-trash"></i></a>
            </td>
            
            <td class="w-30"><input type="text"
            class="trans-underline-field w-100"></td>
            <td class="w-15"><input type="date"
            class="trans-underline-field w-100"></td>
            <td class="w-20">
            <select class="trans-underline-field w-100 
            engineer-drop-down"></select>
            </td>
            <td class="w-32-5"><input type="text"
            class="trans-underline-field w-100"></td>

        </tr>`;

        tbody.append(item);
    }
    function pullOutRow(){
        const tr = $(`#transaction-main-tbody`).children('tr.selected-main-trans-style');
        const trans_row_id = tr.attr("row-id");

        const tbody = $("#transaction-machine-pullout-tbody");
        const item = `<tr row-id="${trans_row_id}">
        <td class="w-2-5 p-1">
        <a href="#" class="btn btn-danger trans-del-btn" 
        onclick="deleteRow(this)"><i class="fa fa-trash"></i></a>
        </td>
        
        <td class="w-15"><input type="date"
        class="trans-underline-field w-100"></td>
        <td class="w-22-5">
        <select class="trans-underline-field w-100 
        engineer-drop-down"></select>
        </td>
        <td class="w-60"><input type="text"
        class="trans-underline-field w-100"></td>

        </tr>`;

        tbody.append(item);
    }

    return {installationRow,updateRow,repairRow,transferRow,pullOutRow};
}
function addServiceReportTransRow(){


    const tr = $(`#transaction-main-tbody`).children('tr.selected-main-trans-style');
    const trans_row_id = tr.attr("row-id");


    const tbody = $(`#transaction-service-report-tbody`);
    const item = ` <tr row-id="${trans_row_id}">
        <td class="w-20-px p-1">
            <a href="#" class="btn btn-danger trans-del-btn" 
            onclick="deleteRow(this)"><i class="fa fa-trash"></i></a>
        </td>
        <td class="w-150-px">
            <input type="text"
            class="trans-underline-field w-100"></td>
        <td class="w-100-px">
            <input type="date"
            class="trans-underline-field w-100"></td>
        <td class="w-350-px"> <input type="text"
            class="trans-underline-field w-100"></td>
        <td class="w-150-px"><input type="text"
            class="trans-underline-field w-100"></td>
        <td class="w-150-px"><input type="text"
            class="trans-underline-field w-100"></td>
        <td class="w-150-px"><input type="text"
            class="trans-underline-field w-100"></td>
        <td class="w-150-px"><input type="text"
            class="trans-underline-field w-100"></td>
        <td class="w-300-px"><select class="trans-underline-field w-100 
            model-number-drop-down"></select></td>
        <td class="w-350-px"><input type="text"
            class="trans-underline-field w-100"></td></td>
        <td class="w-350-px"><input type="text"
            class="trans-underline-field w-100"></td></td>
        <td class="w-350-px"><input type="text"
            class="trans-underline-field w-100"></td></td>
        <td class="w-350-px"><input type="text"
            class="trans-underline-field w-100"></td></td>
        <td class="w-200-px"><select class="trans-underline-field w-100 
            engineer-drop-down"></select></td>
        <td class="w-200-px"><input type="text"
            class="trans-underline-field w-100"></td>
        <td class="w-150-px"><input type="date"
            class="trans-underline-field w-100"></td>
        <td class="w-150-px"><input type="date"
            class="trans-underline-field w-100"></td>
        </tr>`;
        tbody.append(item);
}

function getRandomNumbers(){

    const ids = [];

    const tbody = $(`#transaction-main-tbody`);
    tbody.each((i,el)=>{
        const id = $(el).children("tr").attr('row-id');
        
        ids.push(id);
    });

    function makeRand(){
        return Math.floor((Math.random() * 100) + 1);
    }

    function setRand(){
        const rd = makeRand();
        if(ids.includes(rd)){
            setRand();
        }else{
            return rd;
        }
    }

    return setRand();

}
function deleteRow(div){
    const btn = $(div);
    btn.parent().parent().remove();
}

function setSelectedTransaction(div){
    const trselected = $(div);
    trselected.addClass("selected-main-trans-style")
    .siblings().removeClass("selected-main-trans-style");

    const rowID = trselected.attr("row-id");
   

    const tbodies = ["#transaction-service-report-tbody",
    "#transaction-machine-installation-tbody",
    "#transaction-machine-update-tbody",
    "#transaction-machine-repair-tbody",
    "#transaction-machine-transfer-tbody",
    "#transaction-machine-pullout-tbody"];
    tbodies.forEach(tb=>{

        const tr = $(`${tb}`).children(`tr[row-id='${rowID}']`);
        const tr_not = $(`${tb}`).children(`tr[row-id!='${rowID}']`);
        tr.removeClass("hide-table-row");
        tr_not.addClass("hide-table-row");
    });

}

transactionController.showList();