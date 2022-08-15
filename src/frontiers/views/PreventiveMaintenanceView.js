const { getOnDate,getColor } = require("../../supporters/sections/RequestSection");
const contactController = require("../controllers/ContactController");
const View = require("./View");
class PreventiveMaintenanceView extends View{
    constructor(){
        super();
        this.screenName = "preventive-maintenance-process-screen";
    }

    userInterfaces(){

        function openPMScheduleFromList(div){

           

            $(div).attr("href","#transaction-frame-area");
            $(div).parent().parent().parent().parent().parent().parent().parent()
            .children(".menu-area").children(".menu-item-area")
            .children(`a[href="#transaction-frame-area"]`).trigger("click");
        
            $("#transaction-category-list").val("Genexpert").trigger("change");
            $("#transaction-type-list").val("Preventive Maintenance").trigger("change");
        }
        function getFilters(){
            
            const genexpert_serial_number = $("#pm-filter-genexpert-serial-number");
            const genexpert_facility = $("#pm-filter-genexpert-facility");
            const genexpert_date_installed = $("#pm-filter-genexpert-date-installed");
            const genexpert_status = $("#pm-genexpert-filter-status");
            const genexpert_installedby = $("#pm-filter-genexpert-installed-by");
            const genexpert_installationtype = $("#pm-filter-genexpert-installation-type");
            const genexpert_modelnumber = $("#pm-filter-model-number");
            const genexpert_remarks = $("#pm-filter-remarks");

            const genexpert_region = $("#pm-filter-region");
            const genexpert_province = $("#pm-filter-province");
            const genexpert_city = $("#pm-filter-city");
            const genexpert_barangay = $("#pm-filter-barangay");
            const genexpert_street = $("#pm-filter-street");
            const genexpert_latitude = $("#pm-filter-latitude");
            const genexpert_longitude = $("#pm-filter-longitude");

            const genexpert_contactperson = $("#pm-entry-fullname");
            const genexpert_contactposition = $("#pm-filter-position");
            const genexpert_contactnumber = $("#pm-filter-contact-number");
            const genexpert_contactemail = $("#pm-filter-contact-email");

            const genexpert_softwareversion = $("#pm-filter-software-version");
            const genexpert_osversion = $("#pm-filter-os-version");
            const genexpert_warranty_expiry_date = $("#pm-filter-warranty-expiry-date");
            const genexpert_sc_expiry_date = $("#pm-filter-service-contract-expiry-date");
            const genexpert_dateadded = $("#pm-filter-date-added");
            const genexpert_updatedby = $("#pm-filter-updated-by");
            const genexpert_addedby = $("#pm-filter-added-by");
            
            const pm_current_full_date = $("#pm-filter-pm-current-full-date");
            const pm_current_split_month = $("#pm-filter-pm-current-month");
            const pm_current_split_date = $("#pm-filter-pm-current-date");
            const pm_current_split_year = $("#pm-filter-pm-current-year");

            const pm_due_full_date = $("#pm-filter-pm-due-full-date");
            const pm_due_split_month = $("#pm-filter-pm-due-month");
            const pm_due_split_date = $("#pm-filter-pm-due-date");
            const pm_due_split_year = $("#pm-filter-pm-due-year");
            const pm_calibrate_by = $("#pm-filter-pm-engineer");
            const pm_status = $("#pm-filter-pm-status");

          


            let cond = '';
            let fieldname = '';
            let firstname = '';
            let lastname = '';
            let value = '';


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

            if(pm_current_full_date.val()){

                fieldname = pm_current_full_date.data("field-name");
                value = pm_current_full_date.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }

            if(pm_current_split_month.children('option:selected').val() != "0"){

                fieldname = pm_current_split_month.data("field-name");
                value = pm_current_split_month.children('option:selected').val();
                cond+=value == "" ?"":` AND MONTH(${fieldname}) = "${value}"`;
            }

            if(pm_current_split_date.children('option:selected').val() != "0"){

                fieldname = pm_current_split_date.data("field-name");
                value = pm_current_split_date.children('option:selected').val();
                cond+=value == "" ?"":` AND DAY(${fieldname}) = "${value}"`;
            }

            if(pm_current_split_year.children('option:selected').val() != "0"){

                fieldname = pm_current_split_year.data("field-name");
                value = pm_current_split_year.children('option:selected').val();
                cond+=value == "" ?"":` AND YEAR(${fieldname}) = "${value}"`;
            }

            if(pm_due_full_date.val()!=""){

                fieldname = pm_due_full_date.data("field-name");
                value = pm_due_full_date.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;
            }

            
            if(pm_due_split_month.children('option:selected').val() != "0"){

                fieldname = pm_due_split_month.data("field-name");
                value = pm_due_split_month.children('option:selected').val();
                cond+=value == "" ?"":` AND MONTH(${fieldname}) = "${value}"`;
            }

            if(pm_due_split_date.children('option:selected').val() != "0"){

                fieldname = pm_due_split_date.data("field-name");
                value = pm_due_split_date.children('option:selected').val();
                cond+=value == "" ?"":` AND DAY(${fieldname}) = "${value}"`;
            }

            if(pm_due_split_year.children('option:selected').val() != "0"){

                fieldname = pm_due_split_year.data("field-name");
                value = pm_due_split_year.children('option:selected').val();
                cond+=value == "" ?"":` AND YEAR(${fieldname}) = "${value}"`;
            }

            if(pm_status.val()){


                fieldname = pm_status.data("field-name");
                value = pm_status.val();
                cond+=value == "0" ?"":` AND ${fieldname}${setCondition(value,true)}`;
            }
            if(pm_calibrate_by.val()){
                fieldname = pm_calibrate_by.data("field-name");
                value = pm_calibrate_by.val();
                cond+=value == "0" ?"":` AND ${fieldname}${setCondition(value,true)}`;
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
            
          
            return cond;
        }

        return {openPMScheduleFromList,getFilters};
    }


    views(){

        function timeLengthRemainingUpdate(calibrateFrom,calibrateTo,callback){

            let myInterval = setInterval(function(){
                const fromDate = new Date(calibrateFrom);
                const currentDate = new Date();
                const toDate = new Date(calibrateTo);
    
                let fromDateTime = fromDate.getTime();
                let currentDateTime = currentDate.getTime();
                let toDateTime = toDate.getTime();
                let fromcurrent = currentDateTime - fromDateTime;
                let fromto = toDateTime-fromDateTime;
    
            
                let time_calculate = Math.ceil((fromcurrent/fromto) * 100);
                callback(time_calculate,myInterval);
    
            },1000);
    
        }

        function displayInfoDatas(data,recordFunc){

            console.log(data);

            $("#pm-information-area").data('whole',data);
            
            const genexpert_serial_number = $("#pm-info-genexpert-serial-number");
            const genexpert_facility = $("#pm-info-genexpert-facility");
            const genexpert_dateinstalled = $("#pm-info-genexpert-date-installed");
            const genexpert_engineer = $("#pm-info-genexpert-installed-by");
            const genexpert_installation_type = $("#pm-info-genexpert-installation-type");
            const genexpert_model_number = $("#pm-info-genexpert-model-number");

            genexpert_serial_number.html(data['a_genexpertSN']);
            genexpert_facility.html(data['h_siteName']);
            genexpert_engineer.html(data['c_fullname']);
            genexpert_dateinstalled.html(getOnDate(data['b_dateinstalled'])); 
            genexpert_installation_type.html(data['d_itName']); 
            genexpert_model_number.html(data['e_mnName']);   
            

            let address = "";
            let cadded = 0;
            let region = "";
            let province = "";
            let city = "";
            let barangay = "";
            let street = "";
            if(data['h_region'] && data['h_region'] !="N/A"){
                cadded++;
                region = data['h_region'];
            }
            if(data['h_province'] && data['h_province'] !="N/A"){
                cadded++;
                province = data['h_province']+"".includes("province") ? data['h_province']+", " :
                data['h_province']+ " province, ";
            }
            if(data['h_city']){
                cadded++;
                city = data['h_city']+"".includes("city") ? data['h_city']+", " :
                data['h_city']+ " city, ";
            }
            if(data['h_barangay'] && data['h_barangay'] !="N/A"){
                cadded++;
                barangay = 
                data['h_barangay'].includes("barangay") || 
                data['h_barangay'].includes("brgy") ? data['h_barangay']+", " :
                "brgy. "+ data['h_barangay']+ ", ";
            }

            if(data['h_street'] && data['h_street'] !="N/A"){
                cadded++;
                street = 
                data['h_street'].includes("st.") || 
                data['h_street'].includes("street") ? data['h_street']+", " :
                data['h_street']+ " street, ";
            }

            function capitalize(str){

                const arr = str.split(" ");
                
                for (var i = 0; i < arr.length; i++) {
                    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase();

                }
                return arr.join(" ");
            }

            function combineAddress(){
                
                return capitalize(street)+capitalize(barangay)+
                capitalize(city)+capitalize(province)+capitalize(region);
            }

            address = cadded  == 0 ? data['h_complete_address'] :combineAddress();

           const pm_genexpert_address = $("#pm-info-genexpert-address");
           pm_genexpert_address.html(address);


            async function loadGenexpertContacts(){
            displayMiniLoader("#pm-genexpert-contact-panel",
                    "pm-genexpert-contact-loader-screen");
                contactController.getAllContacts(function(res){

                    const tbody = $("#pm-info-genexpert-contact-tbody");
                    tbody.html("");

                    res.forEach(d=>{
                        const item = `
                        <tr class="normal-color">
                        <td>${d['fullname']}</td>
                        <td>${d['position']}</td>
                        <td>${d['contactnumber']}</td>
                        <td>${d['email']}</td>
                    </tr>
                  
                        `;

                        tbody.append(item);
                    });


                },` AND b.siteID=${data['h_siteID']}`);
                
    
            }

            async function loadPMRecords(){
                displayMiniLoader("#pm-records-panel",
                        "pm-records-loader-screen");

                        const tbody = $("#pm-records-tbody");
                        tbody.html("");
                    
                        recordFunc(` AND a.genexpertSN="${data['a_genexpertSN']}"`,
                        function(res){
                            res.forEach((d,i)=>{

                                let cls = d['a_record_action'] == 
                                "edit schedule"?"edit-color":"done-color";

                                const item = `
                                <tr class=${cls}>
                                <td>${getOnDate(d['a_calibrate_start'])}</td>
                                <td>${getOnDate(d['a_calibrate_done'])}</td>
                                <td>${d['b_fullname']}</td>
                                <td>${d['d_firstname']} ${d['d_lastname']}</td>
                                <td>${d['a_record_action']}</td>
                                </tr>`;
                                tbody.append(item);
                            });
                        });
                    
        
                }

            loadGenexpertContacts().then(()=>{
                hideMiniLoader("pm-genexpert-contact-loader-screen");
            });

            
            loadPMRecords().then(()=>{
                hideMiniLoader("pm-records-loader-screen");
            });

            // const xpertcheck_serial_number = $("#xpertcheck-info-serial-number");
            const pm_current = $("#pm-info-current-date-value");
            const pm_due = $("#pm-info-due-date-value");
            const pm_engineer = $("#pm-info-engineer-value");
            pm_current.html(getOnDate(data['a_calibrate_start']));
            pm_due.html(getOnDate(data['a_calibrate_done']));
            pm_engineer.html(data['i_fullname']);
            pm_engineer.attr("data-select-id",data['i_engineerID']);
            
        }

        function displayDatas(datas){

            // console.log(datas);

            function getUniqueValues(key){
                return [...new Map(datas.map(item =>
                    [item[key], item])).values()];
            }
            let pmList = [];
            let pm_unique_values = []
            datas.forEach(d=>{
                if(!pmList.includes(d['a_genexpertSN'])){
                    pmList.push(d['a_genexpertSN']);
                    pm_unique_values.push(d);
                }
            });


            function changeOnDate(d){
                const date = new Date(d);
                const month = date.getMonth()+1;
                const day = date.getDate();
                const year = date.getFullYear();
                return `${year}-${month <= 9 ?`0${month}`:month}-
                ${day <= 9 ?`0${day}`:day}`;
            }

            let content_area = $(".pm-body-list-content-area");
            content_area.html("");
            content_area.data("datas",pm_unique_values);
            pm_unique_values.forEach(data=>{

                
                // <div class="xpertcheck-list-title-item small text-unfit-hidden-dots" 
                // style="width:9%">
                // <a href="#" onclick="preventiveMaintenanceController.reschedule(this,event)"
                // class="text-info frame-report-btns" style="font-size:17px; 
                // color:light-blue !important; line-height:1em;">
                // <i class="fa fa-pencil-square-o"></i></a>
                // </div>
                
                const lists = datas.filter(d=>{
                    return d['a_genexpertSN'] == data['a_genexpertSN'];
                }).filter((v,i,a)=>a.findIndex(v2=>['a_pmID'].every(k=>v2[k] ===v[k]))===i);

                let item = `
                    <div class="pm-list-row w-100 d-flex" 
                    data-whole='${JSON.stringify(data)}' 
                    data-list='${JSON.stringify(lists)}'  
                    onclick="preventiveMaintenanceController.openInfo(this,event)">

                    <div class="pm-list-title-item small text-unfit-hidden-dots" style="width:10%">${data['a_genexpertSN']}</div>
                    <div class="pm-list-title-item small text-unfit-hidden-dots" style="width:35%">${data['h_siteName']}</div>
                    <div class="pm-list-title-item small text-unfit-hidden-dots" style="width:10%">${changeOnDate(data['a_calibrate_start'])}</div>
                    <div class="pm-list-title-item small text-unfit-hidden-dots" style="width:10%">${changeOnDate(data['a_calibrate_done'])}</div>
                    <div class="pm-list-title-item pm-list-title-item-pb small" style="width:15%">
                        <div class="pm-list-label">
                            <h5>0%</h5>
                        </div>
                        <div class="pm-list-progress-bar"></div>
                    </div>
                    <div class="pm-list-title-item small text-unfit-hidden-dots" style="width:20%">${data['i_fullname']}</div>
                    </div>
                `;
                const row = $(item);
                const pb = row.children(".pm-list-title-item-pb")
                .children(".pm-list-progress-bar");

                const lbl = row.children(".pm-list-title-item-pb")
                .children(".pm-list-label").children("h5");
               

                timeLengthRemainingUpdate(data['a_calibrate_start'],
                data['a_calibrate_done'],function(per,interv){
                    pb.css("width",`${per}%`);
                    lbl.html(``);
                    
                    pb.css("background",getColor(per/100));
                    if(per == 100 || per > 100){
                        clearInterval(interv);
                        pb.css("width",`${per}%`);
                        lbl.css("color","#000");
                        pb.css("background",getColor(1));
                    }
                });

               
                content_area.append(row);



            });
        
        }

        function getPMLimitOffset(){

            const page_num = $(`#pm-index-pagination 
            > .pagination-paging-control > .pagination-select > input`).val();
    
            let page_val = 1;
    
    
    
            if(page_num !="" && !isNaN(page_num) && page_num !=0){
                page_val = page_num;
            }
    
            return {
                "limit":50,
                "offset":(page_val-1) * 50,
                "pageNum":parseInt(page_num)
            };
    
        }

        function getPMFilter(){


            const calibrate_from = $("#pm-filter-calibrate-from");
            const calibrate_to = $("#pm-filter-calibrate-to");
            const calibrate_by = $("#pm-filter-calibrate-by");
            const genexpert_serial_number = $("#pm-filter-genexpert-serial-number");
            const genexpert_facility = $("#pm-filter-genexpert-facility");
            const genexpert_date_installed = $("#pm-filter-genexpert-date-installed");
            const genexpert_engineer = $("#pm-filter-genexpert-engineer");
            const genexpert_installation_type = $("#pm-filter-genexpert-installation-type");
            const genexpert_model_number = $("#pm-filter-genexpert-model-number");
            const genexpert_complete_address = $("#pm-filter-genexpert-complete-address");
            const genexpert_region = $("#pm-filter-genexpert-region");
            const genexpert_province = $("#pm-filter-genexpert-province");
            const genexpert_city = $("#pm-filter-genexpert-city");
            const genexpert_barangay = $("#pm-filter-genexpert-barangay");
            const genexpert_street = $("#pm-filter-genexpert-street");
            const module_serial_number = $("#pm-filter-module-serial-number");
            const module_location = $("#pm-filter-module-location");
            const module_date_installed = $("#pm-filter-module-date-installed");
            const module_engineer = $("#pm-filter-module-engineer");
            const module_installation_type = $("#pm-filter-module-installation-type");
            const module_part_number = $("#pm-filter-module-part-number");
            const module_revision_number = $("#pm-filter-module-revision-number");

            
            function setCondition(val){

                let res = "";
                if(val.startsWith("=")){
                    res = `="${val}"`;
                }else if(val.startsWith("%")){
                    res = ` LIKE "%${val}%"`;
                }else{
                    res = `="${val}"`;
                    
                }
                return res;
            }


            let cond = '';
            let fieldname = '';
            let value = '';

            function setterInputCondition(obj){

                fieldname = obj.attr("field-name");
                value = obj.val() == undefined || obj.val() == 0? "":obj.val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;

            }

            function setterSelectCondition(obj){

                fieldname = obj.attr("field-name");
                value = obj.children("option:selected").val() == undefined 
                || obj.children("option:selected").val() == 0? "":
                obj.children("option:selected").val();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;

            }

            function setterAddressCondition(obj){

                fieldname = obj.attr("field-name");
                value = obj.children("option:selected").text() == undefined 
                || obj.children("option:selected").text() == "N/A" ? "":
                obj.children("option:selected").text();
                cond+=value == "" ?"":` AND ${fieldname}${setCondition(value)}`;

            }

            [calibrate_from,
            calibrate_to,
            genexpert_serial_number,
            genexpert_facility,
            genexpert_date_installed,
            genexpert_complete_address,
            genexpert_street,
            module_serial_number,
            module_location,
            module_date_installed,
            module_part_number,
            module_revision_number].forEach(obj=>{
                setterInputCondition(obj);
            });

            [calibrate_by,
            genexpert_engineer,
            genexpert_installation_type,
            genexpert_model_number,
            module_engineer,
            module_installation_type].forEach(obj=>{
                    setterSelectCondition(obj);
                });

            [genexpert_region,
            genexpert_province,
            genexpert_city,
            genexpert_barangay,].forEach(obj=>{
                    setterAddressCondition(obj);
            });


            return cond;
    
           
        }

        return {displayDatas,getPMFilter,getPMLimitOffset,displayInfoDatas};
    }

    transaction(){

        var self = this;
        this.container = "#transaction-frame-area";

        function pmEntries(){

            return {
                "last-start-maintenance":$("#transaction-pm-last-maintenance-field").val(),
                "last-next-maintenance":$("#transaction-pm-last-next-maintenance-field").val(),
                "new-start-maintenance":$("#transaction-pm-new-start-maintenance-field").val(),
                "new-next-maintenance":$("#transaction-pm-new-next-maintenance-field").val(),
                "maintenance-by":$("#transaction-pm-engineer-maintenance-field").val(),
                "serial-number":self.getTransactionSerialNumberBasedPin()
            }
        }

        function validate(){

            const entries = pmEntries();

            const messages = [];

            if(entries['new-start-maintenance'] == ""){
                messages.push(`Provide date of maintenance`);
            }
            if(entries['new-next-maintenance'] == ""){
                messages.push(`Provide date of end of maintenance`);
            }
            if(entries['maintenance-by'] == 0){
                errs.push(`Select engineer during maintenance`);
            }


            return messages;
           
        }

        
        function mainList(){

            
    
            function timeLengthRemainingUpdate(calibrateFrom,calibrateTo,callback){
    
                let myInterval = setInterval(function(){
                    const fromDate = new Date(calibrateFrom);
                    const currentDate = new Date();
                    const toDate = new Date(calibrateTo);
        
                    let fromDateTime = fromDate.getTime();
                    let currentDateTime = currentDate.getTime();
                    let toDateTime = toDate.getTime();
                    let fromcurrent = currentDateTime - fromDateTime;
                    let fromto = toDateTime-fromDateTime;
        
                
                    let time_calculate = Math.ceil((fromcurrent/fromto) * 100);
                    callback(time_calculate,myInterval);
        
                },1000);
        
            }

            return {timeLengthRemainingUpdate};
        }

        function setSchedule(){

            function assignDatas(datas){
                
                const fields = getFields();
                $(fields['genexpert']).val(datas['a_genexpertSN']);
                $(fields['engineer']).val(datas['i_engineerID']);
                $("#pm-schedule-last-calibration").val(getOnDate(datas['a_calibrate_start']));
                $(fields['calibration-from']).val(getOnDate(datas['a_calibrate_done']));
                $(fields['time-length-value']).val(1);
                $(fields['time-length-format']).val('year');
                setCalibrationTo();
                $(fields['remarks']).val(`Re-schedule preventive maintenance 
                on Genexpert ${datas['a_genexpertSN']} from ${$(fields['calibration-from']).val()} to ${$(fields['calibration-to']).val()}`);
            }

            function setCalibrationTo(){

                const calibrationFrom = $("#pm-schedule-calibration-from").val();
                const timeLengthVal = $("#pm-schedule-time-length-value").val();
                const timeLengthFormat = $("#pm-schedule-time-length-format").children("option:selected").val();
                const calibrationTo = $("#pm-schedule-calibration-to");
        
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

            function validate(){

                const values = entries();
    
                return self.validateProcess([
                    {
                        "field":"text",
                        "value":values['genexpert'],
                        "label":"Serial Number",
                        "validation":["empty"],
                        "message":"Please provide Genexpert Serial Number."
                    },
                    {
                        "field":"date",
                        "value":values['calibration-from'],
                        "label":"Calibration From",
                        "validation":["empty"],
                        "message":"Please provide calibration from."
                    },
                    {
                        "field":"date",
                        "value":values['calibration-to'],
                        "label":"Calibration To",
                        "validation":["empty"],
                        "message":"Please provide calibration to."
                    },
                    // ,
                    // {
                    //     "field":"text",
                    //     "value":values['service-report']['service-report-num'],
                    //     "label":"Service Report Number",
                    //     "validation":["empty"],
                    //     "message":"Service Report # must provided."
                    // }
                ]);
            }
    
            
            function getFields(){
    
                return {
                    "genexpert":`#pm-schedule-genexpert-serial-number`,
                    "engineer":`#pm-schedule-engineer`,
                    "calibration-from":`#pm-schedule-calibration-from`,
                    "calibration-to":`#pm-schedule-calibration-to`,
                    "time-length-value":`#pm-schedule-time-length-value`,
                    "time-length-format":`#pm-schedule-time-length-format`,
                    "remarks":`#pm-schedule-remarks`,
                    "service-report":`#transaction-service-report-number`
                }
    
            }
    
            function allClear(){
    
                const fields = Object.values(getFields());
                const type = ["text","select","date","date","text","select","text","text"];
                let objects = [];
                fields.forEach((f,i)=>{
                    objects.push({
                        "div":f,
                        "type":type[i]
                    });
                })
    
                self.clearList(objects);
            }
    
            function entries(){
    
                const fields = getFields();
    
                const service_report = {};
                service_report['service-report-particular-id'] = 0;
                service_report['service-report-for-what'] = "preventive-maintenance";
                const fileObj = $("#service_report_full_location").html() == "" ?
                `../../galleries/blnk_pg.png`: $("#service_report_full_location").html();
                service_report['service-report-num'] = $("#transaction-service-report-number").val();
    
                service_report['file-object'] = fileObj;
                service_report['remarks'] = $("#pm-schedule-remarks").val();
                service_report['status'] = "Schedule";
                service_report['genexpert-serial-number'] = $(`${fields['genexpert']}`).val();
    
                return {
                    "genexpert":$(`${fields['genexpert']}`).val(),
                    "engineer":$(`${fields['engineer']}`).children("option:selected").val(),
                    "calibration-from":$(`${fields['calibration-from']}`).val(),
                    "calibration-to":$(`${fields['calibration-to']}`).val(),
                    "time-length-value":$(`${fields['time-length-value']}`).val(),
                    "time-length-format":$(`${fields['time-length-format']}`).children("option:selected").val(),
                    "service-report":service_report
                }
            }

            function validateGenexpertSN(){

                const values = entries();

                return self.validateProcess([
                    {
                        "field":"text",
                        "value":values['genexpert'],
                        "label":"Serial Number",
                        "validation":["empty"],
                        "message":"Please provide Genexpert Serial Number."
                    }
                ]);
            }

            function showInfo(data){

                showGenexpertInfo(data);
                $(".pm-genexpert-info-form")
                .addClass("show-pm-genexpert-info-form");
                
            }

            function hideInfo(){

                $(".pm-genexpert-info-form")
                .removeClass("show-pm-genexpert-info-form");
            }
            function clearLastCalibration(){
                $("#pm-schedule-last-calibration").val("");
            }
            function displayLastCalibration(data){
                $("#pm-schedule-last-calibration").val(getOnDate(data));
            }
            function showGenexpertInfo(data){
                const info_form = $(".pm-genexpert-info-form");
                info_form.html("");
        
                const item = `
                    <div class="pm-schedule-info-row">
                        <div class="pm-schedule-info-label">Genexpert SN:</div>
                        <div class="pm-schedule-info-value">${data['a_serialnumber']}</div>
                    </div>

                    <div class="pm-schedule-info-row">
                        <div class="pm-schedule-info-label">Facility:</div>
                        <div class="pm-schedule-info-value">${data['b_siteName']}</div>

                    </div>

                    <div class="pm-schedule-info-row">
                        <div class="pm-schedule-info-label">Date Installed:</div>
                        <div class="pm-schedule-info-value">${getOnDate(data['a_dateinstalled'])}</div>

                    </div>

                    <div class="pm-schedule-info-row">
                        <div class="pm-schedule-info-label">Installation Type:</div>
                        <div class="pm-schedule-info-value">${data['c_itName']}</div>

                    </div>

                    <div class="pm-schedule-info-row">
                        <div class="pm-schedule-info-label">Model Number:</div>
                        <div class="pm-schedule-info-value">${data['e_mnName']}</div>
                    </div>

                    <div class="pm-schedule-info-row">
                        <div class="pm-schedule-info-label">Engineer:</div>
                        <div class="pm-schedule-info-value">${data['d_fullname']}</div>
                    </div>

                    <div class="pm-schedule-info-row">
                        <div class="pm-schedule-info-label">Software Version:</div>
                        <div class="pm-schedule-info-value">${data['a_software_version']}</div>
                    </div>

                    <div class="pm-schedule-info-row">
                        <div class="pm-schedule-info-label">OS Version:</div>
                        <div class="pm-schedule-info-value">${data['a_os_version']}</div>
                    </div>

                    <div class="pm-schedule-info-row">
                        <div class="pm-schedule-info-label">Warranty Expiry Date:</div>
                        <div class="pm-schedule-info-value">${getOnDate(data['a_warranty_expiry_date'])}</div>
                    </div>

                    <div class="pm-schedule-info-row">
                        <div class="pm-schedule-info-label">Service Contract Expiry Date:</div>
                        <div class="pm-schedule-info-value">${getOnDate(data['a_service_contract_expiry_date'])}</div>
                    </div>

                    <div class="pm-schedule-info-row">
                        <div class="pm-schedule-info-label">Region:</div>
                        <div class="pm-schedule-info-value">${data['b_region']}</div>
                    </div>

                    <div class="pm-schedule-info-row">
                        <div class="pm-schedule-info-label">Province:</div>
                        <div class="pm-schedule-info-value">${data['b_province']}</div>
                    </div>

                    <div class="pm-schedule-info-row">
                        <div class="pm-schedule-info-label">City:</div>
                        <div class="pm-schedule-info-value">${data['b_city']}</div>
                    </div>

                    <div class="pm-schedule-info-row">
                        <div class="pm-schedule-info-label">Barangay:</div>
                        <div class="pm-schedule-info-value">${data['b_barangay']}</div>
                    </div>

                    <div class="pm-schedule-info-row">
                        <a href="#" class="btn btn-danger w-25" 
                        onclick="preventiveMaintenanceController.onView().transaction()
                        .setSchedule().hideInfo()">Return</a>
                    </div>
                `;
        
                info_form.html(item);
            }

            return {validate,allClear,entries,showInfo,hideInfo,clearLastCalibration,
                displayLastCalibration,validateGenexpertSN,setCalibrationTo,assignDatas};
        }

        function getUpdateEntries(){

            const currentData = $("#pm-information-area").data('whole');
            const genexpert_serial_number = $("#pm-info-genexpert-serial-number");
            const pm_current = $("#pm-info-current-date-value");
            const pm_due = $("#pm-info-due-date-value");
            const pm_engineer = $("#pm-info-engineer-value");


            let currentDateStatement = getOnDate(currentData['a_calibrate_start']) == 
            pm_current.html() ? "" : `preventive maintenance date has changed to ${pm_current.html()}`;

            let dueDateStatement = getOnDate(currentData['a_calibrate_done']) == 
            pm_due.html() ? "" : `due date has changed to ${pm_due.val()}`;

            let engineer_txt = pm_engineer.html();
            let engineer_val = pm_engineer.data("select-id");


            let engineerStatement = currentData['i_fullname'] == engineer_txt ? "" 
            : `engineer has changed to ${engineer_txt}`;

            let currentDateCondition = currentDateStatement != ""?
            `calibrate_start='${pm_current.html()}'`:"";

            let dueDateCondition = dueDateStatement != ""?
            `calibrate_done='${pm_due.html()}'`:"";

            let engineerCondition = engineerStatement != ""?
            `engineerID=${engineer_val}`:"";

            return {
                "calibrate-start":currentDateCondition,
                "calibrate-done":dueDateCondition,
                "engineer":engineerCondition,
                "record-remarks":[currentDateStatement,dueDateStatement,engineerStatement],
                "last-transaction":"edit schedule",
                "empty":currentDateCondition == "" && dueDateCondition == "" 
                && engineerCondition == "",
                "genexpert":genexpert_serial_number.html()
            }
        }

        return {mainList,setSchedule,getUpdateEntries,pmEntries,
            validate};

    }

    displayPaginationInfo(limit,offset,total){

        const page_num = $(`#pm-index-pagination 
        > .pagination-paging-control > .pagination-select > input`);

        const limitPage = Math.floor(total/limit);
        let to = offset+limit;
        let from = offset+1;

        if(page_num.val() > limitPage){
        
            to = total;
            let remain = total % limit;
            from = (total - remain) + 1;
        }
        
        const pagination = $("#pm-index-pagination");
        const info = `${from}-${to} of ${total}`
        pagination.children(".pagination-paging-control").children(".pagination-label").html(info);
    }


}
const preventiveMaintenanceView = new PreventiveMaintenanceView();
module.exports = preventiveMaintenanceView;