const jotformModel = require("../models/JotFormModel");
const jotforView = require("../views/JotFormView");
var jotform = require("jotform");
const PaginationController = require("./PaginationController");
const reportLibrary = require("../../supporters/sections/ReportLibrary");
const { getOnDate } = require("../../supporters/sections/RequestSection");
class JotFormController{

    constructor(){


        this.paginationController_assistance = new PaginationController();
        this.paginationController_assistance.pageNum =  `#jotform-index-pagination-assistance > 
        .pagination-paging-control > .pagination-select > input`;

        
        this.paginationController_reporting = new PaginationController();
        this.paginationController_reporting.pageNum =  `#jotform-index-pagination-reporting > 
        .pagination-paging-control > .pagination-select > input`;


        this.exec();
        this.forms = [
            {
                "form-name":"GeneXpert Assistance Form",
                "form-id":"203208647129051"
            },
            {
                "form-name":"GeneXpert Reporting System - PBSP",
                "form-id":"221108174452448"
            }

        ]
    }

    gettingDatas(){


    }



    onView(){

        return jotforView;
    }

   

    exec(){

        var self = this;
       
        this.displaySubmissions().exec();
        setInterval(function(){

            try{
                self.getNewSubmissions(true);
            }catch(ex){

                console.log(ex);
            }

        },15000);
        
    }

    getAllSubmissions(callback){

        jotformModel.process().getAllSubmissions(function(res){
            callback(res);
        });
    }

    onFilterView(div){

        jotforView.toggleFilter(div,'#jotform-filter-area');
        this.div = div;
    }

    onPagination_ass(){

        var self = this;
        return this.paginationController_assistance.paginationControl(function(){
            self.displaySubmissions().displayGenexpertAssistance();
        });
    }

    onPagination_repo(){

        var self = this;
        return this.paginationController_reporting.paginationControl(function(){
            self.displaySubmissions().displayGenexpertReport();
        });
    }

    filterProcess(){


        if($("#jotform-filter-reporting").hasClass("jotform-filter-form-hide")){

            $( `#jotform-index-pagination-assistance > 
            .pagination-paging-control > .pagination-select > input`).val(1);
            this.displaySubmissions().displayGenexpertAssistance();
            $('#jotform-filter-area').removeClass("showFromHeight");
        }else{

            $( `#jotform-index-pagination-reporting > 
            .pagination-paging-control > .pagination-select > input`).val(1);
            this.displaySubmissions().displayGenexpertReport();
            $('#jotform-filter-area').removeClass("showFromHeight");
        }
    }

    displaySubmissions(appendOnly = false){


        async function getTotalGenexpertAssistance(callback){
            const filters = jotforView.getFiltersAssistance();
            jotformModel.process().getTotalSubmissionsAssistance({
                "filter":` AND form_id='203208647129051' ${filters}`,
            },function(res){

                const total= res[0]['jotform_total'];
                callback(total);
            });

        }

        async function getTotalGenexpertReporting(callback){

            const filters = jotforView.getFiltersReporting();
            jotformModel.process().getTotalSubmissionsReporting({
                "filter":` AND form_id='221108174452448' ${filters}`,
            },function(res){

                const total= res[0]['jotform_total'];
                callback(total);
            });

        }


        async function displayGenexpertAssistance(){

            const filters = jotforView.getFiltersAssistance();
            const limitOffset = jotforView.getLimitOffsetOfAssistance();
            let limit = limitOffset['limit'];
            let offset = limitOffset['offset'];
            let pageNum = limitOffset['page-num'];

            getTotalGenexpertAssistance(function(total){

                const totalPage = Math.ceil(total/limit);
                if(totalPage-pageNum == 0){
                  
                   $(`#jotform-index-pagination-assistance .pagination-paging-control > 
                   .pagination-next > a`).addClass('a-disabled');

                }else if(totalPage == 1){
                    $(`#jotform-index-pagination-assistance .pagination-paging-control > 
                    .pagination-next > a`).addClass('a-disabled');
                }else{
                    $(`#jotform-index-pagination-assistance .pagination-paging-control > 
                   .pagination-next > a`).removeClass('a-disabled');
                }

                if(pageNum == 1 || isNaN(pageNum)){
                    $(`#jotform-index-pagination-assistance .pagination-paging-control > 
                    .pagination-previous > a`).addClass('a-disabled');
                }else{
                    $(`#jotform-index-pagination-assistance .pagination-paging-control > 
                    .pagination-previous > a`).removeClass('a-disabled');
                }

                jotformModel.process().getSubmissionsAssistance({
                    "filter":` AND form_id='203208647129051' ${filters}`,
                    "limit":limit,
                    "offset":offset 
                },function(res){
                    jotforView.displayOnAssistanceList(res,
                    appendOnly,function(){
                        jotforView.displayPaginationJotformAssistance(limit,offset,total);
                    });
                });

            });

            

        }

        async function displayGenexpertReport(){
            const filters = jotforView.getFiltersReporting();
            const limitOffset = jotforView.getLimitOffsetOfReporting();
            let limit = limitOffset['limit'];
            let offset = limitOffset['offset'];
            let pageNum = limitOffset['page-num'];


            getTotalGenexpertReporting(function(total){


                const totalPage = Math.ceil(total/limit);

                if(totalPage-pageNum == 0){
                  
                   $(`#jotform-index-pagination-reporting .pagination-paging-control > 
                   .pagination-next > a`).addClass('a-disabled');

                }else if(totalPage == 1){
                    $(`#jotform-index-pagination-reporting .pagination-paging-control > 
                    .pagination-next > a`).addClass('a-disabled');
                }else{
                    $(`#jotform-index-pagination-reporting .pagination-paging-control > 
                   .pagination-next > a`).removeClass('a-disabled');
                }

                if(pageNum == 1 || isNaN(pageNum)){
                    $(`#jotform-index-pagination-reporting .pagination-paging-control > 
                    .pagination-previous > a`).addClass('a-disabled');
                }else{
                    $(`#jotform-index-pagination-reporting .pagination-paging-control > 
                    .pagination-previous > a`).removeClass('a-disabled');
                }

                jotformModel.process().getSubmissionsReporting({
                    "filter":` AND form_id='221108174452448' ${filters}`,
                    "limit":limit,
                    "offset":offset 
                },function(res){
                    jotforView.displayOnReportingList(res,
                    appendOnly,function(){
                        jotforView.displayPaginationJotformReporting(limit,offset,total);
                    });
                });

            });

            
        }

        function exec(){
            try{
                displayGenexpertAssistance();
                displayGenexpertReport();
            }catch(ex){

            }
           
        }


        return {displayGenexpertAssistance,displayGenexpertReport,exec};

       


    }

    getGenexpertAssistanceSubmissions(formID,callback){


        var jotform_sheets_api_key = '37b61cf50d2b4582859cb6e6123837a4';
        jotform.options({
            debug:false,
            apiKey:jotform_sheets_api_key
        });
        const dd = [];
        async function runProcess(){
    
            await jotform.getFormSubmissions(formID,{
                offset: 0,
                limit:1000,
            }).then((r)=>{
    
                
                r.forEach((a,i)=>{
        
                        const ticketNo = a['answers']['26']['answer']?a['answers']['26']['answer']: 
                        "";                
                        const acctFacility = a['answers']['4']['answer']?
                        a['answers']['4']['answer']:"";
                        const dpt = a['answers']['5']['answer']?a['answers']['5']['answer']:
                        "";
                        const endUser = a['answers']['6']['answer']?
                        `${a['answers']['6']['answer']['first']} ${a['answers']['6']['answer']['last']}`:"";
                        const email = a['answers']['7']['answer']?a['answers']['7']['answer']:"";
                        const cntNum = a['answers']['9']['answer']?a['answers']['9']['answer']:"";
                        const doi_month = a['answers']['10']['answer']?
                        a['answers']['10']['answer']['month']:"";
                        const doi_date = a['answers']['10']['answer']?
                        a['answers']['10']['answer']['day']:"";
                        const doi_year = a['answers']['10']['answer']?
                        a['answers']['10']['answer']['year']:"";
                        const toi_hr = a['answers']['11']['answer']?
                        a['answers']['11']['answer']['hourSelect']:"";
                        const toi_min = a['answers']['11']['answer']?
                        a['answers']['11']['answer']['minuteSelect']:"";
                        const toi_ampm = a['answers']['11']['answer']?
                        a['answers']['11']['answer']['ampm']:"";
                        const mog = a['answers']['13']['answer']?a['answers']['13']['answer']:"";
                        const isn = a['answers']['14']['answer']?a['answers']['14']['answer']:"";
                        const toc = a['answers']['15']['answer']?a['answers']['15']['answer']:"";
                        const doc = a['answers']['16']['answer']?a['answers']['16']['answer']:"";
                        const msn = a['answers']['17']['answer']?a['answers']['17']['answer']:"";
                        const koc = a['answers']['21']['answer']?a['answers']['21']['answer']:"";
                        const qd = a['answers']['19']['answer']?a['answers']['19']['answer']:"";
                        const lnb = a['answers']['20']['answer']?a['answers']['20']['answer']:"";
                        const stat = "Unopen";
                        const data = {
                            "form-id":a['form_id'],
                            "submission-id":a['id'],
                            "submission-date":a['updated_at']== null?a['created_at']:a['updated_at'],
                            "ticket-no":ticketNo,
                            "account-facility":acctFacility,
                            "department":dpt,
                            "end-user":endUser,
                            "email":email,
                            "contact-number":cntNum,
                            "date-of-incident":`${doi_year}-${doi_month}-${doi_date}`,
                            "time-of-incident":`${toi_hr}:${toi_min} ${toi_ampm}`,
                            "model-of-genexpert":mog,
                            "instrument-serial-number":isn,
                            "type-of-concern":toc,
                            "description-of-concern":doc,
                            "module-serial-number":msn,
                            "kind-of-cartridge":koc,
                            "quantity-damage":qd,
                            "lot-no-box":lnb,
                            "status":stat
                        }
        
                        dd.push(data);
                
                });
        
        
                
              
            });
        }
    
        runProcess().then(()=>{
            callback(dd);
        });
    
    
           
    
    }
    
    getGenexpertReportSubmissions(formID,callback){
    
    
        var jotform_sheets_api_key = '37b61cf50d2b4582859cb6e6123837a4';
        jotform.options({
            debug:false,
            apiKey:jotform_sheets_api_key
        });
        const dd = [];
        async function runProcess(){
    
            await jotform.getFormSubmissions(formID,{
                offset: 0,
                limit:1000,
            }).then((r)=>{
                
                // if(formID == "221108174452448"){
                //     console.log(r);
                // }
                
                r.forEach((b,i)=>{

                        
                        const a = b['answers'];
    
                        const ticketNo = a['3'] ? a['3']['answer']:"";
                        const facilityRegion = a['9'] ? a['9']['answer']:"";
                        const facilityName = a['5'] ? a['5']['answer']:"";
                        const reportedby =  a['11'] ? `${a['11']['answer']? 
                        a['11']['answer']['first']:""} ${a['11']['answer']?a['11']['answer']['last']:""}` :"";
                        const reported_email = a['17'] ? a['17']['answer']:"";
                        const reported_cnum = a['10'] ? a['10']['answer']?a['10']['answer']['full']:"":"";
                        const dop_month = a['51'] ? a['51']['answer']?a['51']['answer']['month']:"":"01";
                        const dop_date = a['51'] ? a['51']['answer']?a['51']['answer']['day']:"":"01";
                        const dop_year = a['51'] ? a['51']['answer']?a['51']['answer']['year']:"":"0001";
                        const top_hr = a['51'] ? a['51']['answer']?a['51']['answer']['hour']:"":"00";
                        const top_min = a['51'] ? a['51']['answer']?a['51']['answer']['min']:"":"00";
                        const top_ampm = a['51'] ? a['51']['answer']?a['51']['answer']['ampm']:"":"AM";
                        const mog =a['14'] ? a['14']['answer']:"";
                        const isn = a['15'] ? a['15']['answer']:"";
                        const tor = a['88'] ? a['88']['answer']:"";
                        const tope = a['16'] ? a['16']['answer']:"";
                        const all_module_pass_xpertcheck = a['91'] ? a['91']['answer']:"";
                        const cm = a['32'] ? a['32']['answer']:"";
                        const tga =  a['36'] ? a['36']['answer']:"";
                        const stat = a['92'] ? a['92']['answer']:"";
                        const g_cpu_sn = a['41'] ? a['41']['answer']:"";
                        const g_laptop_sn = a['81'] ? a['81']['answer']:"";
                        const g_monitor_sn = a['42'] ? a['42']['answer']:"";
                        const g_bcs_sn = a['43'] ? a['43']['answer']:"";
                        const data = {
                            "form-id":b['form_id'],
                            "submission-id":b['id'],
                            "submission-date":b['updated_at']== null?b['created_at']:b['updated_at'],
                            "ticket-no":ticketNo,
                            "facility-region":facilityRegion,
                            "facility-name":facilityName,
                            "ticket-status":stat,
                            "reported-by":reportedby,
                            "reporter-cnum":reported_cnum,
                            "reporter-email":reported_email,
                            "model-of-genexpert":mog,
                            "genexpert-serial-number":isn,
                            "module-all-pass-xpertcheck":all_module_pass_xpertcheck,
                            "type-of-report":tor,
                            "date-problem-encountered":`${dop_year}-${dop_month}-${dop_date} ${top_hr}:${top_min} ${top_ampm}`,
                            "type-problem-encountered":tope,
                            "concerned-modules":cm,
                            "type-genexpert-accessory":tga,
                            "genexpert-cpu-sn":g_cpu_sn,
                            "genexpert-laptop-sn":g_laptop_sn,
                            "genexpert-monitor-sn":g_monitor_sn,
                            "genexpert-bcs-sn":g_bcs_sn
                        }
        
                        dd.push(data);
                
                });
        
        
                
              
            });
        }
    
        runProcess().then(()=>{
            callback(dd);
        });
    
    
           
    
    }

    getNewSubmissions(appendOnly=false){

        var self = this;

        async function genexpertAssistance(callback){
           
            self.getGenexpertAssistanceSubmissions("203208647129051",function(datas){
           
                const ticketNos = datas.map((d,i)=>{
                    if(i > 0){
                        return `UNION ALL SELECT "${d['ticket-no']}" AS ticket_no`;
                    }else{
                        return `SELECT "${d['ticket-no']}" AS ticket_no`;
                    }
                   
                }).toString().replaceAll(","," ");
                
                jotformModel.process().groupFindSubmissions_assistance(ticketNos,function(res){
    
                    const values = res.map(v=>{
                        return v['ticket_no'];
                    });
    
                    const new_datas = datas.filter(v=>{
                        return values.includes(v['ticket-no']);
                    }).map(v=>{
                        return `(
                            "${v['form-id']}",
                            "${v['submission-id']}",
                            "${v['submission-date']}",
                            "${v['ticket-no']}",
                            "${v['account-facility'].replaceAll('"','\\"').replaceAll("'","\\'")}",
                            "${v['department'].replaceAll('"','\\"').replaceAll("'","\\'")}",
                            "${v['end-user'].replaceAll('"','\\"').replaceAll("'","\\'")}",
                            "${v['email'].replaceAll('"','\\"').replaceAll("'","\\'")}",
                            "${v['contact-number'].replaceAll('"','\\"').replaceAll("'","\\'")}",
                            "${v['date-of-incident']}",
                            "${v['time-of-incident']}",
                            "${v['model-of-genexpert']}",
                            "${v['instrument-serial-number']}",
                            "${v['type-of-concern'].replaceAll('"','\\"').replaceAll("'","\\'")}",
                            "${v['description-of-concern'].replaceAll('"','\\"').replaceAll("'","\\'")}",
                            "${v['module-serial-number']}",
                            "${v['kind-of-cartridge'].replaceAll('"','\\"').replaceAll("'","\\'")}",
                            "${v['quantity-damage']}",
                            "${v['lot-no-box']}",
                            "${v['status']}")`
                    }).toString();
    
                    if(new_datas){
                        jotformModel.process().insertSubmission_assistance(new_datas,function(){
                           callback();
                           
                        });
                    }
                 
    
                   
                  
                });
                
            });

        }

       
        async function genexpertReporting(callback){

            self.getGenexpertReportSubmissions("221108174452448",function(datas){

           
                const ticketNos = datas.map((d,i)=>{
                    if(i > 0){
                        return `UNION ALL SELECT "${d['ticket-no']}" AS ticket_no`;
                    }else{
                        return `SELECT "${d['ticket-no']}" AS ticket_no`;
                    }
                   
                }).toString().replaceAll(","," ");
                
                jotformModel.process().groupFindSubmissions_reporting(ticketNos,function(res){
    
                    const values = res.map(v=>{
                        return v['ticket_no'];
                    });

                    const new_datas = datas.filter(v=>{
                        return values.includes(v['ticket-no']);
                    }).map(v=>{
                       
                        // if(v['concerned-modules'] != undefined ){
                        //     console.log(v['concerned-modules']);
                        //     v['concerned-modules']=v['concerned-modules']+"".str.replace(/"/g, '\"');
                        // }

                        let ticket_stat = v['ticket-status'] != undefined ? 
                        v['ticket-status']:"";
                        ticket_stat=ticket_stat.replace(/"/g,'\\\"');

                        let reported_by = v['reported-by'] != undefined ? 
                        v['reported-by']:"";
                        reported_by=reported_by.replace(/"/g,'\\\"');

                        let reported_cnum = v['reporter-cnum'] != undefined ? 
                        v['reporter-cnum']:"";
                        reported_cnum=reported_cnum.replace(/"/g,'\\\"');

                        let reported_email = v['reporter-email'] != undefined ? 
                        v['reporter-email']:"";
                        reported_email=reported_email.replace(/"/g,'\\\"');

                        let model_of_genexpert = v['model-of-genexpert'] != undefined ? 
                        v['model-of-genexpert']:"";
                        model_of_genexpert=model_of_genexpert.replace(/"/g,'\\\"');

                        let genexpert_serial_number = v['genexpert-serial-number'] != undefined ? 
                        v['genexpert-serial-number']:"";
                        genexpert_serial_number=genexpert_serial_number.replace(/"/g,'\\\"');

                        let module_pass_xpertcheck = v['module-all-pass-xpertcheck'] != undefined ? 
                        v['module-all-pass-xpertcheck']:"";
                        module_pass_xpertcheck=module_pass_xpertcheck.replace(/"/g,'\\\"');

                        let date_prob_encountered = v['date-problem-encountered'] != undefined ? 
                        v['date-problem-encountered']:"";
                        date_prob_encountered=date_prob_encountered.replace(/"/g,'\\\"');

                        let type_report = v['type-of-report'] != undefined ? 
                        v['type-of-report']:"";
                        type_report=type_report.replace(/"/g,'\\\"');

                        let type_problem_encountered = v['type-problem-encountered'] != undefined ? 
                        v['type-problem-encountered']:"";
                        type_problem_encountered=type_problem_encountered.replace(/"/g,'\\\"');

                        let concerned_modules = v['concerned-modules'] != undefined ? v['concerned-modules']:"";
                        concerned_modules=concerned_modules.replace(/"/g,'\\\"');

                        let facility_region = v['facility-region'] != undefined ? v['facility-region']:"";
                        facility_region=facility_region.replace(/"/g,'\\\"');

                         let type_genexpert_accessory = v['type-genexpert-accessory'] != undefined ? 
                         v['type-genexpert-accessory']:"";
                         type_genexpert_accessory=type_genexpert_accessory.replace(/"/g,'\\\"');

                        let facility_name = v['facility-name'] != undefined ? v['facility-name']:"";
                        facility_name=facility_name.replace(/"/g,'\\\"');

                        let gen_cpu_sn = v['genexpert-cpu-sn'] != undefined ? v['genexpert-cpu-sn']:"";
                        gen_cpu_sn=gen_cpu_sn.replace(/"/g,'\\\"');

                        let gen_laptop_sn = v['genexpert-laptop-sn'] != undefined ? v['facility-name']:"";
                        gen_laptop_sn=gen_laptop_sn.replace(/"/g,'\\\"');

                        let gen_monitor_sn = v['genexpert-monitor-sn'] != undefined ? v['facility-name']:"";
                        gen_monitor_sn=gen_monitor_sn.replace(/"/g,'\\\"');

                        let gen_bcs_sn = v['genexpert-bcs-sn'] != undefined ? v['facility-name']:"";
                        gen_bcs_sn=gen_bcs_sn.replace(/"/g,'\\\"');
                        

                        return `(
                            "${v['form-id']}",
                            "${v['submission-id']}",
                            "${v['submission-date']}",
                            "${v['ticket-no']}",
                            "${v['facility-region']+"".replaceAll('"','\\"').replaceAll("'","\\'")}",
                            "${v['facility-name']+"".replaceAll('"','\\"').replaceAll("'","\\'")}",
                            "${ticket_stat}",
                            "${reported_by}",
                            "${reported_cnum}",
                            "${reported_email}",
                            "${model_of_genexpert}",
                            "${genexpert_serial_number}",
                            "${module_pass_xpertcheck}",
                            "${type_report}",
                            "${date_prob_encountered}",
                            "${type_problem_encountered}",
                            "${concerned_modules}",
                            "${type_genexpert_accessory}",
                            "${gen_cpu_sn}",
                            "${gen_laptop_sn}",
                            "${gen_monitor_sn}",
                            "${gen_bcs_sn}")`
                    }).toString();
    
                    if(new_datas){
                        jotformModel.process().insertSubmission_reporting(new_datas,function(){
                            callback();
                        });
                    }
                 
    
                   
                  
                });
                
            });

        }


        genexpertAssistance(function(){
            self.displaySubmissions(appendOnly).displayGenexpertAssistance();
        });
        genexpertReporting(function(){
            self.displaySubmissions(appendOnly).displayGenexpertReport();
        });
        

    }

    findSubmission_viaMachineSN(sn,callback){
        jotformModel.process().findSubmissionByMachineSN(sn,callback);
    }

    getAllJotformAssistance(filter="",callback){

        jotformModel.process().getAllAssistanceSubmissions(filter,callback);

    }

    getAllJotformReporting(filter="",callback){

        jotformModel.process().getAllReportingSubmissions(filter,callback);

    }


    onReport(){

        var self = this;
        let c = 0;

        function datasInExcel(withFilter = false){

            async function loader(){
                const v = self.onView();
                v.screenName="jotform-report-process-screen";
                v.container = "#jotform-frame-area";
                 v.loader({
                     "loader-01":true
                 });
            }

            loader();

            reportLibrary.saveFile_and_return().then(p=>{

                const exc = reportLibrary.excel().exporting();
                const workbook = exc.createWorkBook();
                const sheets =  ['Jotform Assistance','Jotform Reporting'];

                // creating all sheets
                sheets.forEach(sheet=>{
                       exc.createWorksheet(workbook,sheet); 
                });

                const assistanceFilter = withFilter?self.onView().getFiltersAssistance():"";
                const reportingFilter = withFilter?self.onView().getFiltersReporting():"";
           
                // // START ASSISTANCE AREAS
                self.getAllJotformAssistance(assistanceFilter,function(assistance_res){


                    const assistance_sheet = exc.getWorksheet(workbook,'Jotform Assistance');


                    // Add headers
                    assistance_sheet.columns = [
                        { header: 'Ticket No', key:'ticket-no', width: 15},
                        { header: 'Submission Date', key:'submission-date', width: 15},
                        { header: 'Facility', key: 'facility', width: 25 },
                        { header: 'Department', key: 'department', width: 20},
                        { header: 'End User', key: 'end-user', width: 15},
                        { header: 'Email', key: 'email', width: 25},
                        { header: 'Contact Number', key: 'contact-number', width: 15},
                        { header: 'Date of Incident', key: 'date-incident', width: 15},
                        { header: 'Time of Incident', key: 'time-incident', width: 15},
                        { header: 'Model of Genexpert', key: 'model-of-genexpert', width: 20},
                        { header: 'Instrument Serial Number', key: 'instrument-serial-number',width: 15},
                        { header: 'Type of Concern', key: 'type-of-concern', width: 20},
                        { header: 'Description of Concern', key: 'description-of-concern', width: 30},
                        { header: 'Module Serial Number/s', key: 'module-serial-number', width: 25},
                        { header: 'Kind of Cartridge', key: 'kind-of-cartridge', width: 20},
                        { header: 'Lot No. in Box', key: 'lot-no-box', width: 20},
                        { header: 'Quantity Damage Problem of Cartridge', key: 'quantity-damage-cartridge', width: 20}
                    ];



                    if(assistance_res.length != 0){
                        assistance_sheet.addTable({
                            name: "jotformAssistanceTable".replace(' ', '_'),
                            ref: 'A1',
                            headerRow: true,
                            totalsRow: false,
                            style: {
                            theme: 'TableStyleMedium10',
                            showRowStripes: true,
                            },
                            columns: [
                                { name: 'Ticket No', key:'ticket-no', width: 15},
                                { name: 'Submission Date', key:'submission-date', width: 15},
                                { name: 'Facility', key: 'facility', width: 25 },
                                { name: 'Department', key: 'department', width: 20},
                                { name: 'End User', key: 'end-user', width: 15},
                                { name: 'Email', key: 'email', width: 25},
                                { name: 'Contact Number', key: 'contact-number', width: 15},
                                { name: 'Date of Incident', key: 'date-incident', width: 15},
                                { name: 'Time of Incident', key: 'time-incident', width: 15},
                                { name: 'Model of Genexpert', key: 'model-of-genexpert', width: 20},
                                { name: 'Instrument Serial Number', key: 'instrument-serial-number',width: 15},
                                { name: 'Type of Concern', key: 'type-of-concern', width: 20},
                                { name: 'Description of Concern', key: 'description-of-concern', width: 30},
                                { name: 'Module Serial Number/s', key: 'module-serial-number', width: 25},
                                { name: 'Kind of Cartridge', key: 'kind-of-cartridge', width: 20},
                                { name: 'Lot No. in Box', key: 'lot-no-box', width: 20},
                                { name: 'Quantity Damage Problem of Cartridge', key: 'quantity-damage-cartridge', width: 20},
                                { name: 'Status', key: 'status', width: 15}
                            ],
                            rows: assistance_res.map(d=>{
                                return [
                                    d['ticket_no'],
                                    d['submission_date'] ? getOnDate(d['submission_date']):"",
                                    d['account_hospital'],
                                    d['department'],
                                    d['end_user'],
                                    d['email'],
                                    d['contact_number'],
                                    d['date_of_incident'] ?getOnDate(d['date_of_incident']):"None",
                                    d['time_of_incident'],
                                    d['model_of_genexpert'],
                                    d['instrument_serial_number'],
                                    d['type_of_concern'],
                                    d['description_of_concern'],
                                    d['module_sn_hardware'],
                                    d['kind_cartridge_cartridge'],
                                    d['lot_no_in_box'],
                                    d['quantity_damage_problem_cartridge'],
                                    d['ticket_status']
                                ]
                            }),
                        
                        });
                    }

                    // START REPORTING AREAS

                    self.getAllJotformReporting(reportingFilter,function(reporting_res){

                        const reporting_sheet = exc.getWorksheet(workbook,'Jotform Reporting');


                        // Add headers
                        reporting_sheet.columns = [
                            { header: 'Ticket No', key:'ticket-no', width: 15},
                            { header: 'Submission Date', key:'submission-date', width: 15},
                            { header: 'Facility', key: 'facility', width: 25 },
                            { header: 'Region', key: 'region', width: 20},
                            { header: 'Status', key: 'status', width: 15},
                            { header: 'Reported By', key: 'reported-by', width: 15},
                            { header: 'Reporter Email', key: 'reporter-email', width: 25},
                            { header: 'Reporter Contact Number', key: 'reporter-contact-number', width: 15},
                            { header: 'Model of Genexpert', key: 'model-of-genexpert', width: 20},
                            { header: 'Instrument Serial Number', key: 'instrument-serial-number', width: 15},
                            { header: 'Module All Pass Xpertcheck', key: 'module-pass-xpertcheck', width: 15},
                            { header: 'Type of Report', key: 'type-of-report', width: 15},
                            { header: 'Date of Problem Encountered', key: 'date-problem-encountered', width: 20},
                            { header: 'Type of Problem Encountered', key: 'type-problem-encountered', width: 25},
                            { header: 'Concern Modules', key: 'concern-modules', width: 20},
                            { header: 'Type Genexpert Accessory', key: 'type-genexpert-accessory', width: 20},
                            { header: 'Genexpert CPU Serial #', key: 'gen-cpu-sn', width: 20},
                            { header: 'Genexpert Laptop Serial #', key: 'gen-laptop-sn', width: 20},
                            { header: 'Genexpert Monitor Serial #', key: 'gen-monitor-sn', width: 20},
                            { header: 'Genexpert Barcode Scanner Serial #', key: 'gen-bcs-sn', width: 20}
                        ];
    
    
    
                        if(reporting_res.length != 0){
                            reporting_sheet.addTable({
                                name: "jotformReportingTable".replace(' ', '_'),
                                ref: 'A1',
                                headerRow: true,
                                totalsRow: false,
                                style: {
                                theme: 'TableStyleMedium11',
                                showRowStripes: true,
                                },
                                columns: [
                                    { name: 'Ticket No', key:'ticket-no', width: 15},
                                    { name: 'Submission Date', key:'submission-date', width: 15},
                                    { name: 'Facility', key: 'facility', width: 25 },
                                    { name: 'Region', key: 'region', width: 20},
                                    { name: 'Status', key: 'status', width: 15},
                                    { name: 'Reported By', key: 'reported-by', width: 15},
                                    { name: 'Reporter Email', key: 'reporter-email', width: 25},
                                    { name: 'Reporter Contact Number', key: 'reporter-contact-number', width: 15},
                                    { name: 'Model of Genexpert', key: 'model-of-genexpert', width: 20},
                                    { name: 'Instrument Serial Number', key: 'instrument-serial-number', width: 15},
                                    { name: 'Module All Pass Xpertcheck', key: 'module-pass-xpertcheck', width: 15},
                                    { name: 'Type of Report', key: 'type-of-report', width: 15},
                                    { name: 'Date of Problem Encountered', key: 'date-problem-encountered', width: 20},
                                    { name: 'Type of Problem Encountered', key: 'type-problem-encountered', width: 25},
                                    { name: 'Concern Modules', key: 'concern-modules', width: 20},
                                    { name: 'Type Genexpert Accessory', key: 'type-genexpert-accessory', width: 20},
                                    { name: 'Genexpert CPU Serial #', key: 'gen-cpu-sn', width: 20},
                                    { name: 'Genexpert Laptop Serial #', key: 'gen-laptop-sn', width: 20},
                                    { name: 'Genexpert Monitor Serial #', key: 'gen-monitor-sn', width: 20},
                                    { name: 'Genexpert Barcode Scanner Serial #', key: 'gen-bcs-sn', width: 20}
                                ],
                                rows: reporting_res.map(d=>{
                                    return [
                                        d['ticket_no'],
                                        d['submission_date'] ? getOnDate(d['submission_date']):"",
                                        d['facility_name'],
                                        d['facility_region'],
                                        d['ticketStatus'],
                                        d['reportedBy'],
                                        d['reporter_email'],
                                        d['reporter_cnum'],
                                        d['model_genexpert'],
                                        d['genexpert_serial_number'],
                                        d['module_all_pass_xpertcheck'],
                                        d['type_report'],
                                        d['date_problem_encountered'],
                                        d['type_of_problem_encountered'],
                                        d['concerned_modules'],
                                        d['type_genexpert_accessory'],
                                        d['genexpert_cpu_sn'],
                                        d['genexpert_laptop_sn'],
                                        d['genexpert_monitor_sn'],
                                        d['genexpert_barcode_scanner_sn']
                                    ]
                                }),
                            
                            });
                        }


        
                        exc.exec(workbook,p,function(){
                            
                            self.onView().messager({
                                "message-02":true,
                                "title":"Report Message",
                                "message":`Successfully Create Report`
                            });
                            
                        });
    

                    });

                });

            });
           
           

        }

     

        // function datasWithFilterInExcel(){

        //     const assistanceFilter = self.onView().getFiltersAssistance();
        //     const reportingFilter = self.onView().getFiltersReporting();
        //     datasInExcel(assistanceFilter,reportingFilter);

        // }

        

        return {datasInExcel};

    }

    
    
}
const jotformController = new JotFormController();
module.exports = jotformController;