const View = require("./View");

class ServiceReportView extends View{
    constructor(){
        super();
        this.transactID = 0;
    }

    getEntryDatas(){
        return {
            "service-report-number":$("#transaction-service-report-number-field").val(),
            "problems-reported":$("#transaction-service-report-problems-reported-field").val(),
            "diagnostic-findings":$("#transaction-service-report-diagnostic-findings-field").val(),
            "corrective-action":$("#transaction-service-report-corrective-action-field").val(),
            "comments":$("#transaction-service-report-comments-field").val(),
            "service-type":$("#transaction-type-of-service-field").val(),
            "transact-id":this.transactID,
            "facility":$("#transaction-facility-field").val(),
            "department":$("#transaction-department-field").val(),
            "tel-no":$("#transaction-tel-no-field").val(),
            "genexpert-serial-number":this.getTransactionSerialNumberBasedPin(),
            "equipment":$("#transaction-equipment-field").val(),
            "model-number":$("#transaction-model-number-field").val(),
            "engineer-name":$("#transaction-service-report-engineer-field").val(),
            "customer-name":$("#transaction-service-report-customer-name-field").val(),
            "engineer-sign-date":$("#transaction-service-report-engineer-sign-date-field").val(),
            "customer-sign-date":$("#transaction-service-report-customer-sign-date-field").val()
        }
    }


    displayDatas(datas){


        const main_container = $("#service-report-body-list-content-area");
        main_container.html("");

        datas.forEach(d => {
            const item = `
            <div class="frame-body-list-row d-flex" data-row='${JSON.stringify(d)}'
            onclick="revealServiceReportInformation(this)">

                <div class="frame-report-btns text-dark frame-reveal-table-list-title-item 
                text-unfit-hidden-dots" 
                style="width:50px; font-size:15px; 
                font-weight:600;"><i class="fa fa-print"></i></div>

                <div class="text-danger frame-report-btns frame-report-btns-pdf frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:50px; font-size:15px; font-weight:600;">
                <i class="fa fa-file-pdf-o"></i></div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:100px">${d['service_report_num']}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:100px">${d['genexpert_serial_number']}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:350px">${d['facilitySR']}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:250px">${d['fullname']}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:250px">${d['problems_reported']}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:250px">${d['diagnostic_findings']}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots" 
                style="width:250px">${d['corrective_action']}</div>

            </div>
            `;


            main_container.append(item);
        });


    }

    getFilters(){
            
        const service_report_num = $("#service-report-filter-service-report-number");
        const gen_serial_num = $("#service-report-filter-genexpert-serial-number");
        const facility = $("#service-report-filter-facility");
        const model_number = $("#service-report-filter-model-number");
        const equipment = $("#service-report-filter-equipment");
        const department = $("#service-report-filter-department");
        const tel_no = $("#service-report-filter-tel-no");
        const service_type = $("#service-report-filter-service-type");
        const trans_id = $("#service-report-filter-transaction-id");
        const encoded_date = $("#service-report-filter-encoded-date");
        const encoded_by = $("#service-report-filter-encoded-by");
        const problems_reported = $("#service-report-filter-problems-reported");
        const diagnostic_findings = $("#service-report-filter-diagnostic-findings");
        const corrective_action = $("#service-report-filter-corrective-action");
        const comments = $("#service-report-filter-comments");
        const engineer_name = $("#service-report-filter-engineer-name");
        const engineer_sign_date = $("#service-report-filter-engineer-sign-date");
        const customer_name = $("#service-report-filter-customer-name");
        const customer_sign_date = $("#service-report-filter-customer-sign-date");  

        let cond = '';
        cond += service_report_num.val() != "" ? setState('service_report_num',service_report_num.val()):"";
        cond += gen_serial_num.val() != "" ? setState('genexpert_serial_number',gen_serial_num.val()):"";
        cond += facility.val() != "" ? setState('a.facility',facility.val()):"";
        cond += model_number.val() != 0 ? setState('modelnumber',model_number.val()):"";
        cond += department.val() != "" ? setState('department',department.val()):"";
        cond += tel_no.val() != "" ? setState('telno',tel_no.val()):"";
        cond += service_type.val() != "None" ? setState('service_type',service_type.val()):"";
        cond += trans_id.val() != "" ? setState('transact_id',trans_id.val()):"";
        cond += encoded_date.val() != "" ? setState('date_added',encoded_date.val()):"";
        cond += encoded_by.val() != 0 ? setState('addedby',encoded_by.val()):"";
        cond += problems_reported.val() != "" ? setState('problems_reported',problems_reported.val()):"";
        cond += diagnostic_findings.val() != "" ? setState('diagnostic_findings',diagnostic_findings.val()):"";
        cond += corrective_action.val() != "" ? setState('corrective_action',corrective_action.val()):"";
        cond += comments.val() != "" ? setState('comments',comments.val()):"";
        cond += engineer_name.val() != 0 ? setState('a.engineerID',engineer_name.val()):"";
        cond += engineer_sign_date.val() != "" ? setState('engineer_sign_date',engineer_sign_date.val()):"";
        cond += customer_name.val() != "" ? setState('customer_name',customer_name.val()):"";
        cond += customer_sign_date.val() != "" ? setState('customer_sign_date',customer_sign_date.val()):"";
    
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

    getLimitOffset(){

        const page_num = $(`#service-report-index-pagination 
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

    displayPaginationInfo(limit,offset,total){

        if(total != null){

            const page_num = $(`#service-report-index-pagination 
            > .pagination-paging-control > .pagination-select > input`);
    
            const limitPage = Math.floor(total/limit);
            let to = offset+limit;
            let from = offset+1;
    
            if(page_num.val() > limitPage){
            
                to = total;
                let remain = total % limit;
                from = (total - remain) + 1;
            }
            
            const pagination = $("#service-report-index-pagination");
            const info = `${from}-${to} of ${total}`
            pagination.children(".pagination-paging-control").children(".pagination-label").html(info);  
        }

       
    }
}

const serviceReportView = new ServiceReportView();
module.exports = serviceReportView;