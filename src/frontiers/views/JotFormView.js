const { getOnDate } = require("../../supporters/sections/RequestSection");
const View = require("./View");

class JotFormView extends View{
    constructor(){
        super();
    }

    displayAssistanceInfo(div){
        showSubForm("#jotform-assistance-information-area","top");
        const data = $(div).data('row');
        this.assignAssistanceInfo(data);
       
       
    }

    displayReportingInfo(div){
        showSubForm("#jotform-reporting-information-area","top");
        const data = $(div).data('row');
        this.assignReportingInfo(data);
       
       
    }

    assignAssistanceInfo(data){

        const ticketNo = $("#jotform-info-assistance-ticket-no");
        const submissionDate = $("#jotform-info-assistance-submission-date");
        const accountHospital = $("#jotform-info-assistance-account-hospital");
        const department = $("#jotform-info-assistance-department");
        const endUser = $("#jotform-info-assistance-end-user");
        const email = $("#jotform-info-assistance-email");
        const contactNumber = $("#jotform-info-assistance-contact-number");
        const dateOfIncident = $("#jotform-info-assistance-date-of-incident");
        const timeOfIncident = $("#jotform-info-assistance-time-of-incident");
        const modelGenexpert = $("#jotform-info-assistance-model-of-genexpert");
        const instrument_serial_number = $("#jotform-info-assistance-instrument-serial-number");
        const typeOfConcern = $("#jotform-info-assistance-type-of-concern");
        const descriptionOfConcern = $("#jotform-info-assistance-description-of-concern");
        const moduleSerialNumber = $("#jotform-info-assistance-module-serial-number");
        const kindOfCartridge = $("#jotform-info-assistance-kind-of-cartridge");
        const quantityDamage = $("#jotform-info-assistance-quantity-of-damage");
        const lotNoBox = $("#jotform-info-assistance-lot-no-box");

        //make empty first
        [ticketNo,submissionDate,accountHospital,department,endUser,
        email,contactNumber,dateOfIncident,timeOfIncident,modelGenexpert,
        instrument_serial_number,typeOfConcern,descriptionOfConcern,
        moduleSerialNumber,kindOfCartridge,quantityDamage,lotNoBox].forEach(d=>{
            d.html("");
        });

        ticketNo.html(data['ticket_no']);
        submissionDate.html(getOnDate(data['submission_date']));
        accountHospital.html(data['account_facility']);
        department.html(data['department']);
        endUser.html(data['end_user']);
        email.html(data['email']);
        contactNumber.html(data['contact_number']);
        dateOfIncident.html(getOnDate(data['date_of_incident']));
        timeOfIncident.html(data['time_of_incident']);
        modelGenexpert.html(data['model_of_genexpert']);
        instrument_serial_number.html(data['instrument_serial_number']);
        typeOfConcern.html(data['type_of_concern']);
        descriptionOfConcern.html(data['description_of_concern']);
        moduleSerialNumber.html(data['module_serial_number']);
        kindOfCartridge.html(data['kind_of_cartridge']);
        quantityDamage.html(data['quantity_damage']);
        lotNoBox.html(data['lot_no_in_box']);

    }

    assignReportingInfo(data){

        const ticketNo = $("#jotform-info-reporting-ticket-no");
        const submissionDate = $("#jotform-info-reporting-submission-date");
        const reported_by = $("#jotform-info-reporting-reported-by");
        const reporter_email = $("#jotform-info-reporting-reporter-email");
        const reporter_cnum = $("#jotform-info-reporting-reporter-contact-number");
        const machine_sn = $("#jotform-info-reporting-machine-serial-number");
        const facility_name = $("#jotform-info-reporting-facility-name");
        const model_genexpert = $("#jotform-info-reporting-model-genexpert");
        const module_pass_xpertcheck = $("#jotform-info-reporting-module-pass-xpertcheck");
        const type_report = $("#jotform-info-reporting-type-report");
        const date_problem_encountered = $("#jotform-info-reporting-date-problem-encountered");
        const type_problem_encountered = $("#jotform-info-reporting-type-problem-encountered");
        const concerned_modules = $("#jotform-info-reporting-concerned-modules");
        const type_genexpert_accessory = $("#jotform-info-reporting-type-genexpert-accessory");
        const gen_cpu_sn = $("#jotform-info-reporting-genexpert-cpu-sn");
        const gen_laptop_sn = $("#jotform-info-reporting-genexpert-laptop-sn");
        const gen_monitor_sn = $("#jotform-info-reporting-genexpert-monitor-sn");
        const gen_bcs_sn = $("#jotform-info-reporting-genexpert-barcode-scanner-sn");

        //make empty first
        [ticketNo,submissionDate,reported_by,reporter_email,reporter_cnum,
        machine_sn,facility_name,model_genexpert,module_pass_xpertcheck,type_report,
        date_problem_encountered,type_problem_encountered,concerned_modules,
        type_genexpert_accessory,gen_cpu_sn,gen_laptop_sn,gen_monitor_sn,gen_bcs_sn].forEach(d=>{
            d.html("");
        });
        ticketNo.html(data['ticket_no']);
        submissionDate.html(getOnDate(data['submission_date']));
        reported_by.html(data['reportedBy']);
        reporter_email.html(data['reporter_email']);
        reporter_cnum.html(data['reporter_cnum']);
        machine_sn.html(data['genexpert_serial_number']);
        facility_name.html(data['facility_name']);
        model_genexpert.html(data['model_genexpert']);
        module_pass_xpertcheck.html(data['module_all_pass_xpertcheck']);
        type_report.html(data['type_report']);
        date_problem_encountered.html(data['date_problem_encountered']);
        type_problem_encountered.html(data['type_of_problem_encountered']);
        concerned_modules.html(data['concerned_modules']);
        type_genexpert_accessory.html(data['type_genexpert_accessory']);
        gen_cpu_sn.html(data['genexpert_cpu_sn']);
        gen_laptop_sn.html(data['genexpert_laptop_sn']);
        gen_monitor_sn.html(data['genexpert_monitor_sn']);
        gen_bcs_sn.html(data['genexpert_barcode_scanner_sn']);

    }

    getLimitOffsetOfAssistance(){

        const page_num = $(`#jotform-index-pagination-assistance 
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

    getLimitOffsetOfReporting(){

        const page_num = $(`#jotform-index-pagination-reporting  
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

    displayPaginationJotformAssistance(limit,offset,total){

        if(total != null){

            const page_num = $(`#jotform-index-pagination-assistance  
            > .pagination-paging-control > .pagination-select > input`);
    
            const limitPage = Math.floor(total/limit);
            let to = offset+limit;
            let from = offset+1;
    
            if(page_num.val() > limitPage){
            
                to = total;
                let remain = total % limit;
                from = (total - remain) + 1;
            }
            
            const pagination = $("#jotform-index-pagination-assistance");
            const info = `${from}-${to} of ${total}`
            pagination.children(".pagination-paging-control").children(".pagination-label").html(info);  
        }

       
    }

    displayPaginationJotformReporting(limit,offset,total){

        if(total != null){

            const page_num = $(`#jotform-index-pagination-reporting  
            > .pagination-paging-control > .pagination-select > input`);
    
            const limitPage = Math.floor(total/limit);
            let to = offset+limit;
            let from = offset+1;
    
            if(page_num.val() > limitPage){
            
                to = total;
                let remain = total % limit;
                from = (total - remain) + 1;
            }
            
            const pagination = $("#jotform-index-pagination-reporting");
            const info = `${from}-${to} of ${total}`
            pagination.children(".pagination-paging-control").children(".pagination-label").html(info);  
        }

       
    }

   displayOnAssistanceList(datas,append = false,callback){

       const container = $("#jotform-list-content-area-genexpert-assistance");

    if(!append){
        container.html("");
    }
   
    datas.forEach(d => {

        const status = ``;

        const row = `
        <div class="frame-body-list-row ${status} d-flex" 
        data-row='${JSON.stringify(d)}'
        onclick="jotformController.onView().displayAssistanceInfo(this)">

            <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
            style="width:150px">${getOnDate(d['submission_date'])}</div>

            <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
            style="width:150px">${d['ticket_no']}</div>


            <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
            style="width:150px">${d['instrument_serial_number']}</div>

            <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
            style="width:350px">${d['account_hospital']}</div>

            <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
            style="width:200px">
            ${d['end_user']}</div>

            <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
            style="width:250px">${d['email']}</div>

            <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
            style="width:300px">${d['type_of_concern']}</div>

            <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
            style="width:300px">${d['description_of_concern']}</div>

        </div>
        `;





        container.append(row);


       
    });

    callback();


   }

   displayOnReportingList(datas,append = false,callback){

       const container = $("#jotform-list-content-area-genexpert-report");

    if(!append){
        container.html("");
    }
    
    datas.forEach(d => {
        

        const status = ``;

        const row = `
        <div class="frame-body-list-row ${status} d-flex" 
        data-row='${JSON.stringify(d)}'
        onclick="jotformController.onView().displayReportingInfo(this)">

            <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
            style="width:150px">${getOnDate(d['submission_date'])}</div>

            <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
            style="width:150px">${d['ticket_no']}</div>


            <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
            style="width:150px">${d['genexpert_serial_number']}</div>

            <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
            style="width:350px">${d['facility_name']}</div>

            <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
            style="width:200px">
            ${d['reportedBy']}</div>


            <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
            style="width:250px">${d['reporter_email']}</div>

            <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
            style="width:300px">${d['type_report']}</div>

            <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
            style="width:300px">${d['type_of_problem_encountered']}</div>

        </div>
        `;



        

        container.append(row);


       
    });

    callback();


   }


   getFiltersAssistance(){
            
    const ticketNo = $(`#jotform-filter-assistance-ticket-no`);
    const submission_date = $(`#jotform-filter-assistance-submission-date`);
    const end_user = $(`#jotform-filter-assistance-end-user`);
    const account_hospital = $(`#jotform-filter-assistance-account-hospital`);
    const department = $(`#jotform-filter-assistance-department`);
    const email = $(`#jotform-filter-assistance-email`);
    const contactnumber = $(`#jotform-filter-assistance-contact-number`);
    const dateofincident = $(`#jotform-filter-assistance-date-of-incident`);
    const timeofincident = $(`#jotform-filter-assistance-time-of-incident`);
    const model = $(`#jotform-filter-assistance-model-of-genexpert`);
    const serialnumber = $(`#jotform-filter-assistance-instrument-serial-number`);
    const module_sns = $(`#jotform-filter-assistance-module-serial-numbers`);
    const kind_of_cartridge = $(`#jotform-filter-assistance-kind-of-cartridge`);
    const quantity_damage = $(`#jotform-filter-assistance-quantity-of-damage`);
    const lot_no_in_box = $(`#jotform-filter-assistance-lot-no-box`);
    const type_of_concern = $(`#jotform-filter-assistance-type-of-concern`);
    const description_of_concern = $(`#jotform-filter-assistance-description-of-concern`);


    let cond = '';
    cond += ticketNo.val() != "" ? setState('ticket_no',ticketNo.val()):"";
    cond += submission_date.val() != "" ? setState('submission_date',submission_date.val()):"";
    cond += end_user.val() != "" ? setState('end_user',end_user.val()):"";
    cond += account_hospital.val() != "" ? setState('account_hospital',account_hospital.val()):"";
    cond += department.val() != "" ? setState('department',department.val()):"";
    cond += email.val() != "" ? setState('email',email.val()):"";
    cond += contactnumber.val() != "" ? setState('contact_number',contactnumber.val()):"";
    cond += dateofincident.val() != "" ? setState('date_of_incident',dateofincident.val()):"";
    cond += timeofincident.val() != "" ? setState('time_of_incident',timeofincident.val()):"";
    cond += model.val() != "" ? setState('model_of_genexpert',model.val()):"";
    cond += serialnumber.val() != "" ? setState('instrument_serial_number',serialnumber.val()):"";
    cond += module_sns.val() != "" ? setState('module_serial_number',module_sns.val()):"";
    cond += kind_of_cartridge.val() != "" ? setState('kind_of_cartridge',kind_of_cartridge.val()):"";
    cond += quantity_damage.val() != "" ? setState('quantity_damage',quantity_damage.val()):"";
    cond += lot_no_in_box.val() != "" ? setState('lot_no_in_box',lot_no_in_box.val()):"";
    cond += type_of_concern.val() != "" ? setState('type_of_concern',type_of_concern.val()):"";
    cond += description_of_concern.val() != "" ? setState('description_of_concern',description_of_concern.val()):"";

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


    return cond;
   }

   getFiltersReporting(){
            
    const ticketNo = $(`#jotform-filter-reporting-ticket-no`);
    const submission_date = $(`#jotform-filter-reporting-submission-date`);
    const reported_by = $(`#jotform-filter-reporting-reported-by`);
    const reporter_email = $(`#jotform-filter-reporting-reporter-email`);
    const reporter_cnum = $(`#jotform-filter-reporting-reporter-contact-number`);
    const machine_sn = $(`#jotform-filter-reporting-machine-serial-number`);
    const facility_name = $(`#jotform-filter-reporting-facility-name`);
    const model_genexpert = $(`#jotform-filter-reporting-model-of-genexpert`);
    const module_pass_xpertcheck = $(`#jotform-filter-reporting-module-pass-xpertcheck`);
    const type_report = $(`#jotform-filter-reporting-type-of-report`);
    const date_problem_encountered = $(`#jotform-filter-reporting-date-of-problem-encountered`);
    const type_problem_encountered = $(`#jotform-filter-reporting-type-of-problem-encountered`);
    const concerned_modules = $(`#jotform-filter-reporting-concerned-modules`);
    const type_genexpert_accessory = $(`#jotform-filter-reporting-type-genexpert-accessory`);
    const genexpert_cpu_sn = $(`#jotform-filter-reporting-genexpert-cpu-sn`);
    const genexpert_laptop_sn = $(`#jotform-filter-reporting-genexpert-laptop-sn`);
    const genexpert_monitor_sn = $(`#jotform-filter-reporting-genexpert-monitor-sn`);
    const genexpert_bcs_sn = $(`#jotform-filter-reporting-genexpert-barcode-scanner-sn`);
 


    let cond = '';
    cond += ticketNo.val() != "" ? setState('ticket_no',ticketNo.val()):"";
    cond += submission_date.val() != "" ? setState('submission_date',submission_date.val()):"";
    cond += reported_by.val() != "" ? setState('reportedBy',reported_by.val()):"";
    cond += reporter_email.val() != "" ? setState('reporter_email',reporter_email.val()):"";
    cond += reporter_cnum.val() != "" ? setState('reporter_cnum',reporter_cnum.val()):"";
    cond += machine_sn.val() != "" ? setState('genexpert_serial_number',machine_sn.val()):"";
    cond += facility_name.val() != "" ? setState('facility_name',facility_name.val()):"";
    cond += model_genexpert.val() != "" ? setState('model_genexpert',model_genexpert.val()):"";
    cond += module_pass_xpertcheck.val() != "N/A" ? setState('module_all_pass_xpertcheck',module_pass_xpertcheck.val()):"";
    cond += type_report.val() != "" ? setState('type_report',type_report.val()):"";
    cond += date_problem_encountered.val() != "" ? setState('date_problem_encountered',date_problem_encountered.val()):"";
    cond += type_problem_encountered.val() != "" ? setState('type_of_problem_encountered',type_problem_encountered.val()):"";
    cond += concerned_modules.val() != "" ? setState('concerned_modules',concerned_modules.val()):"";
    cond += type_genexpert_accessory.val() != "" ? setState('type_genexpert_accessory',type_genexpert_accessory.val()):"";
    cond += genexpert_cpu_sn.val() != "" ? setState('genexpert_cpu_sn',genexpert_cpu_sn.val()):"";
    cond += genexpert_laptop_sn.val() != "" ? setState('genexpert_laptop_sn',genexpert_laptop_sn.val()):"";
    cond += genexpert_monitor_sn.val() != "" ? setState('genexpert_monitor_sn',genexpert_monitor_sn.val()):"";
    cond += genexpert_bcs_sn.val() != "" ? setState('genexpert_barcode_scanner_sn',genexpert_bcs_sn.val()):"";
    
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

    
    return cond;
   }

  
}
const jotforView = new JotFormView();
module.exports = jotforView;