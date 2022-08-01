
function showWriteForm(){
    $(".genexpert-information-read-form").removeClass("left-0");
    $(".genexpert-information-write-form").addClass("right-0");
}
function showReadForm(){
    $(".genexpert-information-write-form").removeClass("right-0");
    $(".genexpert-information-read-form").addClass("left-0");
}

function genexpertInformationAssigneeValues(data){
    

    let gen = data['genexpert'];
    let contacts = data['contact'];
    let peripheral = data['peripheral'];
    let assaystatistic = data['assaystatistic'];
    let modules = data['module'];
  
    let currentModules = modules.filter(m=>{
        return m['modu_statusHistory'] == "Current";
    });
    currentModules = currentModules.sort(arrangeByLocation);

    $(".module-status-active > input").prop("checked","checked");


    const bp = genexpertInformationComponentBlueprint();
 
    const general_info = bp['panels'].filter(p=>{
        return p['id'] == "genexpert-info-general-panel";})[0]['body'];

    const software_info = bp['panels'].filter(p=>{
        return p['id'] == "genexpert-info-software-panel";})[0]['body'];

    const address_info = bp['panels'].filter(p=>{
        return p['id'] == "genexpert-info-address-panel";})[0]['body'];

    const contact_info = bp['panels'].filter(p=>{
        return p['id'] == "genexpert-info-contact-panel";})[0]['table'];

        
    const assay_info = bp['panels'].filter(p=>{
        return p['id'] == "genexpert-info-assaystatistic-panel";})[0]['table'];

    const peripheral_info = bp['panels'].filter(p=>{
            return p['id'] == "genexpert-info-peripheral-panel";})[0]['table'];

    const module_info = bp['panels'].filter(p=>{
        return p['id'] == "genexpert-info-module-panel";})[0]['table'];


    assignReadProcess(general_info,gen);
    assignReadProcess(address_info,gen);
    assignReadProcess(software_info,gen);
    assignReadProcess(contact_info,contacts,true);
    assignReadProcess(assay_info,assaystatistic,true);
    assignReadProcess(peripheral_info,peripheral,true);
    assignReadProcess(module_info,currentModules,true);

    function arrangeByLocation(a, b) {
        // Use toUpperCase() to ignore character casing
        const bandA = a['modu_location'].toUpperCase().trim();
        const bandB = b['modu_location'].toUpperCase().trim();
      
        let comparison = 0;
        if (bandA > bandB) {
          comparison = 1;
        } else if (bandA < bandB) {
          comparison = -1;
        }
        return comparison;
    }

    function analyzeCheckBoxStatus(){

        const terminatedCheckBox = $(".module-status-terminated > input");
        const activeCheckBox = $(".module-status-active > input");
        let terminatedModules = [];  
        let activeModules = [];

        if(terminatedCheckBox.prop("checked") === true){
            terminatedModules = modules.filter(m=>{
                return m['modu_status'] == "Terminated";
            });

            terminatedModules = terminatedModules.sort(arrangeByLocation);
            
        }


        if(activeCheckBox.prop("checked") === true){
            activeModules = modules.filter(m=>{
                return m['modu_status'] == "Active";
            });
            activeModules = activeModules.sort(arrangeByLocation);
        }

        assignReadProcess(module_info,[...activeModules,...terminatedModules],true);

    }

    $(".module-status-active > input").on("click",function(){

        analyzeCheckBoxStatus();


    });


    $(".module-status-terminated > input").on("click",function(){

        analyzeCheckBoxStatus();
    });

    function assignReadProcess(arr,data,tabular = false){
        
        if(tabular){

                // tabular form
                const tbody = $(`#${arr['body-id']}`);
                tbody.html("");
                tbody.data("all",data);
                data.forEach(d=>{

                    const statColor = arr['body-id'] == "genexpert-info-module-tbody" ? d['modu_statusHistory']?
                    d['modu_statusHistory'] == "Record" ? "terminated-bg-color":"":"":"";

                    let tr = `<tr class="${statColor}"
                    data-data='${JSON.stringify(d)}' 
                    onclick="${arr['click']}" data-table-row-id="${d[arr['db-table-row-id']]}">`;
                    const db_fields = arr['db-fields'];
                    const db_fields_type = arr['db-fields-type'];
                    db_fields.forEach((dbf,i)=>{

                        if(dbf instanceof Object && dbf['component']){
                            
                            tr+=`<td class="p-1" data-module='${JSON.stringify(d)}'>
                            <a class="btn btn-warning w-100 module-record-button" 
                            style="height:25px !important; 
                            font-size:10px !important;" 
                            onclick="showModuleHistory(this)"><i class="fa fa-book"></i></a>
                            </td>`;

                        }else{
                            if(db_fields_type[i] == "date"){
                               
                                tr+=`<td data-current="${d[dbf]}">${getOnDate(d[dbf])}</td>`;
                            }
                            else if(db_fields_type[i] == "select"){
                                tr+=`<td data-current="${d[dbf[0]]}" 
                                data-current-id="${d[dbf[1]]}" 
                                data-update-id="${d[dbf[1]]}">${d[dbf[0]]}</td>`;
                            }else{
                                tr+=`<td data-current="${d[dbf]}">${d[dbf]}</td>`;
                            }   
                        }
                      
                       

                       
                        
                    });

                    tr+="</tr>";
                    tbody.append(tr);
                });




        }else{
            arr.forEach(f=>{

                if(f['field'] == "date" || f['field'] == "date-fixed"){

                    let dd = "------";

                    if(gen[f['db-field']]){

                        if(getOnDate(gen[f['db-field']]) != "2001-01-01" && 
                        getOnDate(gen[f['db-field']]) != "0001-01-01" ){
                            dd = getOnDate(gen[f['db-field']]);
                        }
                    }


                    $(`#${f['id']}`).html(getOnDate(gen[f['db-field']]));
                    $(`#${f['id']}`).data("current",getOnDate(gen[f['db-field']]));
                }else if(f['field'] == "select"){

                    if(Array.isArray(f['db-field'])){
                        let first = data[f['db-field'][0]];
                        let last = data[f['db-field'][1]];
                        $(`#${f['id']}`).html(`${first} ${last}`);
                        $(`#${f['id']}`).data("id",data[f['db-id']]);
                        $(`#${f['id']}`).data("current",`${first} ${last}`);
                    }else{
    
                        $(`#${f['id']}`).html(data[f['db-field']] ? data[f['db-field']] :"N/A");
                        $(`#${f['id']}`).data("id",data[f['db-id']]);
                        $(`#${f['id']}`).data("current",data[f['db-field']] ? data[f['db-field']] :"N/A");
                    }
                    
                }else if(f['field'] == "facility-info"){

                    $(`#${f['id']}`).html(data[f['db-field']] ? data[f['db-field']] :"N/A");
                    $(`#${f['id']}`).data("current",data[f['db-field']] ? data[f['db-field']] :"N/A");
                    $(`#${f['id']}`).data("primary-id",data[f['db-primary-id']?f['db-primary-id']:0]);
                    $(`#${f['id']}`).data("select",data[f['db-primary-id']?f['db-primary-id']:0]);
                }else if(f['field'] == "fixed"){

                    if(Array.isArray(f['db-field'])){
                        let first = data[f['db-field'][0]];
                        let last = data[f['db-field'][1]];
                        $(`#${f['id']}`).html(`${first} ${last}`);
                        $(`#${f['id']}`).data("id",data[f['db-id']]);
                        $(`#${f['id']}`).data("current",`${first} ${last}`);
                    }else{
                        $(`#${f['id']}`).html(data[f['db-field']] ? data[f['db-field']] :"N/A");
                        $(`#${f['id']}`).data("current",data[f['db-field']] ? data[f['db-field']] :"N/A");
                    }
                }else{
                    $(`#${f['id']}`).html(data[f['db-field']] ? data[f['db-field']] :"N/A");
                    $(`#${f['id']}`).data("current",data[f['db-field']] ? data[f['db-field']] :"N/A");
                }

                
               
            });
        }
        

        
    
    }
  

}

function genexpertInformationComponentBlueprint(){
    return {
        "panels":[
            {
                "id":"genexpert-info-general-panel",
                "title":"General Information",
                "click":"",
                "body":[
                    {
                        "title":"Serial Number",
                        "value":"888888",
                        "id":"genexpert-info-serial-number",
                        "field":"special",
                        "db-field":"genex_serialnumber",
                        "updated-field":"serialnumber",
                        "width":"20%"
                    },
                    {
                        "title":"Facility/Site",
                        "value":"Cebu City Medical Center",
                        "id":"genexpert-info-facility_site",
                        "field":"facility-info",
                        "db-field":"genex_faci_siteName",
                        "updated-field":"siteID",
                        "width":"100%",
                        "db-primary-id":"genex_faci_siteID"
                    },
                    {
                        "title":"Date Installed",
                        "value":"2022-01-01",
                        "id":"genexpert-info-date-installed",
                        "field":"date",
                        "db-field":"genex_dateinstalled",
                        "updated-field":"dateinstalled",
                        "width":"20%"
                    },
                    {
                        "title":"Installation Type",
                        "value":"Macare PDBC",
                        "id":"genexpert-info-installation-type",
                        "field":"select",
                        "db-field":"genex_inst_itName",
                        "db-id":"genex_inst_itID",
                        "class-list":"installation-type-drop-down",
                        "updated-field":"itID",
                        "width":"25%"
                    },
                    {
                        "title":"Model Number",
                        "value":"Genexpert Model 4 System",
                        "id":"genexpert-info-model-number",
                        "field":"select",
                        "db-field":"genex_mode_mnName",
                        "db-id":"genex_mode_mnID",
                        "class-list":"model-number-drop-down",
                        "updated-field":"mnID",
                        "width":"100%"
                    },
                    {
                        "title":"Installed By",
                        "value":"Gerald Selga",
                        "id":"genexpert-info-installed-by",
                        "field":"select",
                        "db-field":"genex_eng_fullname",
                        "db-id":"genex_eng_engineerID",
                        "class-list":"engineer-drop-down",
                        "updated-field":"engineerID",
                        "width":"30%"
                    },
                    {
                        "title":"Last Update Date",
                        "value":"2022-05-04",
                        "id":"genexpert-info-last-update-date",
                        "field":"date-fixed",
                        "db-field":"genex_dateupdated",
                    },
                    {
                        "title":"Added by",
                        "value":"Gerald Selga",
                        "id":"genexpert-info-added-by",
                        "field":"fixed",
                        "db-field":["genex_user_addedby_firstname",
                        "genex_user_addedby_lastname"],
                        "db-id":"genex_user_addedby_userID"
                    },
                    {
                        "title":"Last Update By",
                        "value":"Gerald Selga",
                        "id":"genexpert-info-last-update-by",
                        "field":"fixed",
                        "db-field":["genex_user_updatedby_firstname",
                        "genex_user_updatedby_lastname"],
                        "db-id":"genex_user_updatedby_userID"
                    },
                    {
                        "title":"Status",
                        "value":"Active",
                        "id":"genexpert-info-status",
                        "field":"fixed",
                        "db-field":"genex_status",
                        "width":"100%",
                        "updated-field":"status",
                    },
                    {
                        "title":"Remarks",
                        "value":"No remarks",
                        "id":"genexpert-info-remarks",
                        "field":"text",
                        "db-field":"genex_remarks",
                        "width":"100%",
                        "updated-field":"remarks",
                    }
                ]
            },
            {
                "id":"genexpert-info-address-panel",
                "title":"Address Information",
                "click":"",
                "body":[
                    {
                        "title":"Region",
                        "value":"Region VII",
                        "id":"genexpert-info-region",
                        "field":"facility-info",
                        "class-field":"region-drop-down",
                        "db-field":"genex_faci_region",
                        "updated-field":"region"
                    },
                    {
                        "title":"Province",
                        "value":"Cebu",
                        "id":"genexpert-info-province",
                        "field":"facility-info",
                        "class-field":"province-drop-down",
                        "db-field":"genex_faci_province",
                        "updated-field":"province"
                    },
                    {
                        "title":"City/Municipality",
                        "value":"Cebu City",
                        "id":"genexpert-info-city",
                        "field":"facility-info",
                        "class-field":"city-drop-down",
                        "db-field":"genex_faci_city",
                        "updated-field":"city"
                    },
                    {
                        "title":"Barangay",
                        "value":"Tisa",
                        "id":"genexpert-info-barangay",
                        "field":"facility-info",
                        "class-field":"barangay-drop-down",
                        "db-field":"genex_faci_barangay",
                        "updated-field":"barangay"
                    },
                    {
                        "title":"Street",
                        "value":"Katipunan St.",
                        "id":"genexpert-info-street",
                        "field":"facility-info",
                        "db-field":"genex_faci_street",
                        "updated-field":"street"
                    },
                    {
                        "title":"Latitude",
                        "value":"1212323",
                        "id":"genexpert-info-latitude",
                        "field":"facility-info",
                        "db-field":"genex_faci_latitude",
                        "updated-field":"latitude"
                    },
                    {
                        "title":"Longitude",
                        "value":"425423",
                        "id":"genexpert-info-longitude",
                        "field":"facility-info",
                        "db-field":"genex_faci_longitude",
                        "updated-field":"longitude"
                    }
                ]
            },
            {
                "id":"genexpert-info-contact-panel",
                "title":"Contact Information",
                "click":"showContactInfoForm(this,'new')",
                "table":{
                    "id":"genexpert-info-contact-table",
                    "head":{
                        "name":"frame-info-panel-body-table-head",
                        "rows":["Fullname","Position","Email","Contact Number"]
                    },
                    "click":"showContactInfoForm(this,'update')",
                    "body":"genexpert-info-panel-body-table-body",
                    "body-id":"genexpert-info-contact-tbody",
                    "db-table-row-id":"genex_faci_cont_contactID",
                    "db-fields-type":["text","text","text","text"],
                    "db-fields":["genex_faci_cont_fullname",
                    "genex_faci_cont_position","genex_faci_cont_email",
                    "genex_faci_cont_contactnumber"]
                }
            },
            {
                "id":"genexpert-info-software-panel",
                "title":"Software Information",
                "click":"",
                "body":[
                    {
                        "title-lg":"Software Version",
                        "value":"Windows 10",
                        "id":"genexpert-info-software-version",
                        "db-field":"genex_software_version",
                        "field":"text",
                        "width":"30%",
                        "updated-field":"software_version"
                    },
                    {
                        "title-lg":"OS Version",
                        "value":"Windows",
                        "id":"genexpert-info-os-version",
                        "db-field":"genex_os_version",
                        "field":"text",
                        "width":"30%",
                        "updated-field":"os_version"
                    },
                    {
                        "title-lg":"Warranty Expiry Date",
                        "value":"",
                        "id":"genexpert-info-warranty-expiry-date",
                         "db-field":"genex_warranty_expiry_date",
                         "field":"date",
                         "width":"25%",
                         "updated-field":"warranty_expiry_date"
                    },
                    {
                        "title-lg":"Service Contract Expiry Date",
                        "value":"",
                        "id":"genexpert-info-service-contract-expiry-date",
                        "field":"date",
                        "width":"25%",
                        "update-field":"service_contract_expiry_date"
                    }
                ]
            },
            {
                "id":"genexpert-info-assaystatistic-panel",
                "title":"Assay Statistic Information",
                "click":"showAssayStatisticInfoForm(this,'new')",
                "table":{
                    "id":"genexpert-info-assay-table",
                    "head":{
                        "name":"frame-info-panel-body-table-head",
                        "rows":["Assay","Quantity"]
                    },
                    "click":"showAssayStatisticInfoForm(this,'update')",
                    "body":"genexpert-info-panel-body-table-body",
                    "body-id":"genexpert-info-assaystatistic-tbody",
                    "db-table-row-id":"assay_asID",
                    "db-fields-type":["text","text"],
                    "db-fields":["assay_test","assay_quantity"]
                }
            },
            {
                "id":"genexpert-info-peripheral-panel",
                "title":"Peripheral Information",
                "click":"showPeripheralInfoForm(this,'new')",
                "table":{
                    "id":"genexpert-info-peripheral-table",
                    "head":{
                        "name":"frame-info-panel-body-table-head",
                        "rows":["Name","Serial Number","Model Number"]
                    },
                    "click":"showPeripheralInfoForm(this,'update')",
                    "body":"genexpert-info-panel-body-table-body",
                    "db-table-row-id":"peri_periID",
                    "body-id":"genexpert-info-peripheral-tbody",
                    "db-fields-type":["text","text","text"],
                    "db-fields":["peri_peripheralName","peri_serialnumber","peri_modelnumber"]
                }
            },
            {
                "id":"genexpert-info-module-panel",
                "title":"Module Information",
                "click":"openModuleEntryForm(this)",
                "table":{
                    "id":"genexpert-info-module-table",
                    "head":{
                        "name":"frame-info-panel-body-table-head",
                        "rows":["Serial Number","Location","Date Installed","Installation Type",
                        "Installed By","Part Number","Revision Number","Status","Records"]
                    },
                    "click":"showModuleInfoForm(this,event)",
                    "body":"genexpert-info-panel-body-table-body",
                    "body-id":"genexpert-info-module-tbody",
                    "db-table-row-id":"modu_moduleID",
                    "db-fields-type":["text","text","date","select","select","text","text","text"],
                    "db-fields":["modu_serialnumber","modu_location","modu_dateinstalled",
                    ["modu_inst_itName","modu_inst_itID"],
                    ["modu_eng_fullname","modu_eng_engineerID"],"modu_part_number","modu_revision_number",
                    "modu_status",{
                        "component":"button",
                        "click":function(div){
                            showModuleHistory(div);
                        }
                    }]
                }
            }
        ]
    };
}

function genexpertInformationPanelSetUp(){
    const container = $(".genexpert-information-read-area");
    container.html("");
    addFramePanel(".genexpert-information-read-area",genexpertInformationComponentBlueprint());
}

function showEditForm(div){
    const html = $(div).html();
    if(html == "Edit View"){
        
        $(".genexpert-information-read-area").addClass("opacity-0");
        setTimeout(function(){
            showSubForm('.genexpert-information-write-area','top');
            $(".genexpert-information-write-area").removeClass("overflow-hidden");
            $(".genexpert-information-write-area").removeClass("opacity-0");
            $(".genexpert-information-read-area").addClass("display-none");
        },300);
        
        $(div).html("Read View");
    }else{
        
        $(".genexpert-information-write-area").addClass("overflow-hidden");
        $(".genexpert-information-write-area").addClass("opacity-0");
        $(".genexpert-information-read-area").removeClass("display-none");
        setTimeout(function(){
            hideSubForm('.genexpert-information-write-area','top');
            $(".genexpert-information-read-area").removeClass("opacity-0");
            
        },300);
        $(div).html("Edit View");
    }
    
}
function displayMiniLoader(container,screenName,message="Searching and Loading the Data..."){
  
    let style = `<style>
        .${screenName}{
            position:absolute;
            top:0;
            left:0;
            width:100%;
            height:100%;
            background:rgba(27, 27, 27, 0.349);
            backdrop-filter:blur(5px);
            z-index:10000;
        }

        .${screenName} > .loading_container {
            width: 100px;
            height: 100px;
            position: absolute;
            left: 50%;
            top: 48%;
            transform: translate(-50%, -50%);
            border-radius: 150px;
          }
          
          .${screenName} >.loading_container > .loading {
            width: 100%;
            height: 100%;
            border-radius: 150px;
            border-right: 3px solid #fff;
            animation: animate 2s linear infinite;
          }
          
          .${screenName} > h3 {
            position: absolute;
            left: 50%;
            top:50%;
            transform: translate(-50%, -50%);
            color:#fff;
            font-size:12px;
            font-weight:100;
            margin-top:60px !important;
          }
          

          @keyframes animate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
    </style>`;

    

    let div = `<div class="${screenName}">
        <div class="loading_container">
            <div class="loading">
            </div>
        </div>
        <h3>${message}</h3>
    </div>`;

    $(container).append(style+div);


}

function hideMiniLoader(screenName){
    $(`.${screenName}`).remove();

}


function changeFieldtoValue(div){

    const main = $(div);
    const parent = main.parent();
    const data = main.data("content");
    const update = data['updated-field'];
    const current = main.data("current");
    const present_value = data['field'] == "select"? 
    main.children("option:selected").text():main.val();
    const selectID = data['field'] == "select"? main.children("option:selected").val():0;
    data['value'] = present_value;

    const prev = `<a href="#" onclick="changeValuetoField(this)" data-type="${data['field']}"
    class="genexpert-info-link" data-current="${current}" data-select="${selectID}"
    id="${data['id']}" 
    data-content='${JSON.stringify(data)}'
    data-update="${update}">${present_value == ""?
    "N/A":present_value}</a>`;

    parent.html(prev);

    if(data['field'] == "select"){
        parent.children("a").data("id",main.val());
    }

    
}
function changeValuetoField(div){
    const main = $(div);
    const current_val = main.data("current");
    const parent = main.parent();
    const data = main.data("content");
    const update = data['updated-field'];
    const val = main.html();
    let item = null;

    if(data['field'] == "select"){

        item=`<select class="${data['class-list']} genexpert-info-field" 
        onblur="changeFieldtoValue(this)" id="${data['id']}"
        data-content='${JSON.stringify(data)}' 
        data-current="${current_val}" 
        data-type="${data['field']}" 
        data-update="${update}"></select>`;
        const id = main.data("id");
        const div = $(`.${data['class-list']}`).html();
        parent.html(item);
        parent.children().trigger('focus');
        $(`#${data['id']}`).html(div);
        $(`#${data['id']}`).val(id);
        $(`#${data['id']}`).css("width",data['width'] ? data['width']:"100%");
       
    }
    if(data['field'] == "text"){
        item=`<input type="${data['field']}" id="${data['id']}" 
        value="${val}" data-content='${JSON.stringify(data)}' 
        onblur="changeFieldtoValue(this)"
        class="genexpert-info-field" 
        data-current="${current_val}" 
        data-type="${data['field']}" 
        data-update="${update}">`;
        parent.html(item);
        parent.children().trigger('focus');
        $(`#${data['id']}`).css("width",data['width'] ? data['width']:"100%");
    }

    if(data['field'] == "date"){
        item=`<input type="${data['field']}" id="${data['id']}" 
        value="${val}" data-content='${JSON.stringify(data)}' 
        onblur="changeFieldtoValue(this)"
        class="genexpert-info-field" 
        data-current="${current_val}" 
        data-type="${data['field']}" 
        data-update="${update}">`;
        parent.html(item);
        parent.children().trigger('focus');
        $(`#${data['id']}`).css("width",data['width'] ? data['width']:"100%");
    }

    if(data['field'] == "facility-info"){

        let data = {
            "facility":$("#genexpert-info-facility_site").html(),
            "region":$("#genexpert-info-region").html(),
            "province":$("#genexpert-info-province").html(),
            "city":$("#genexpert-info-city").html(),
            "barangay":$("#genexpert-info-barangay").html()
        }


        displayFacilityInfo(data,sendBackFromFacilityInfo);     
        showSubForm("#facility-info-area","top");

    }

    
}

function sendBackFromFacilityInfo(data){


    hideSubForm("#facility-info-area","top");
    $("#genexpert-info-facility_site").html(data['facility'] == "" ?"N/A":data['facility']);
    $("#genexpert-info-facility_site").data("select",data['siteID']);
    $("#genexpert-info-region").html(data['region'] == "" ?"N/A":data['region']);
    $("#genexpert-info-province").html(data['province'] == "" ?"N/A":data['province']);
    $("#genexpert-info-city").html(data['city'] == "" ?"N/A":data['city']);
    $("#genexpert-info-barangay").html(data['barangay'] == "" ?"N/A":data['barangay']);
    $("#genexpert-info-street").html(data['street'] == "" ?"N/A":data['street']);
    $("#genexpert-info-latitude").html(data['latitude'] == "" ?"N/A":data['latitude']);
    $("#genexpert-info-longitude").html(data['longitude'] == "" ?"N/A":data['longitude']);
    
}

function togglePanel(ids,div){

    $(div).addClass("frame-info-control-button-active").siblings()
    .removeClass("frame-info-control-button-active");

    $(".frame-info-panel").hide();
    ids.forEach(id=>{
        $(`#${id}`).show();
    });
    
}

function showAllPanel(div){
    
    $(div).addClass("frame-info-control-button-active").siblings()
    .removeClass("frame-info-control-button-active");
    $(".frame-info-panel").show();
}

function addFramePanel(container,options){

    let panels = options['panels'];

    panels.forEach(p => {


            let optionStatus = p['title'] == "Module Information" ? `
                <div class="module-status-option-view d-flex" style="width:200px;">
                    <div class="module-status-active">
                        <input type="checkbox" checked="checked"/> <b>Active</b>
                    </div>
                    <div class="module-status-terminated">
                        <input type="checkbox"/> <b>Terminated</b>
                    </div>
                </div>
            
            `:"";


            let panel = `<div class="frame-info-panel" id="${p['id']}">`;
            let tableBtn = ` <a href="#" class="panel-add-btn" 
            style="margin-left:3px;" 
            name="contact" onclick=${p['click']}>
                <i class="fa fa-plus"></i>
            </a>`;
            let notTableBtn = `<a href="#" class="panel-edit-btn" 
            style="margin-left:10px;" name="general" onclick=${p['click']}><i class="fa fa-edit"></i>
            </a>`;
            let btn = p['table'] ? tableBtn : "";
            let title = `<div class="frame-info-panel-title d-flex">${p['title']}${btn}
            ${optionStatus}
            
            </div>`;

            if(p['table']){

                const table_id = p['table']['id'];
                const table_thead = p['table']['head']['name'];
                const table_body = p['table']['body'];
                const table_body_id = p['table']['body-id'];

              
                let table = `
                    <table class="frame-info-panel-table" id="${table_id}" 
                    clickEvent="${p['table']['click']}">
                    <thead class="${table_thead}"><tr>`;
                   
                    p['table']['head']['rows'].forEach(h=>{
                        table+=`<th>${h}</th>`;
                    });
    
                table +=`
                    </tr>
                    </thead>
                    <tbody class="${table_body}" id="${table_body_id}">
                    </tbody>
                    </table>
                `;

                panel+=title+table;
                
            }else{
                let body = `<div class="frame-info-panel-body">`;
               
                p['body'].forEach(i=>{

                    let item = ` <div class="frame-info-panel-body-item">`;
                    item+=i["title-lg"] ? 
                    `<div class="frame-info-panel-body-item-title-lg">${i['title-lg']}</div>`:
                    `<div class="frame-info-panel-body-item-title">${i['title']}</div>`;
                    

                    item+=`<div class="frame-info-panel-body-item-value">
                    <a href="#" onclick="changeValuetoField(this)" 
                    class="genexpert-info-link" 
                    data-type="${i['field']}" 
                    id="${i['id']}" 
                    data-update="${i['updated-field']}"
                    data-current="${i['value'] == ""?"N/A":i['value']}" 
                    data-content='${JSON.stringify(i)}'>${i['value']}</a></div>`;
                    item+=`</div>`;
                    body+=item;
                });

                body+=`</div>`;
                panel+=title+body;
            }
            
            panel+=`</div>`;

            
            $(container).append(panel);
    });


}

function showContactInfoForm(div,transType){


    let data = $(div).data("data");
   
    let fname = $("#contact-info-fullname");
    let position = $("#contact-info-position");
    let contactNumber = $("#contact-info-contact-number");
    let email = $("#contact-info-email");
    let siteID = $("#genexpert-info-facility_site").data("select");
    

    if(transType == "new"){
            // assign here
        fname.val("");
        position.val("");
        contactNumber.val("");
        email.val("");

        $("#contact-info-submit-btn").on("click",function(){

            const tbody = $(div).parent(".frame-info-panel-title")
            .siblings(".frame-info-panel-table").children("tbody");
            
            const click = $(div).parent(".frame-info-panel-title")
            .siblings(".frame-info-panel-table").attr("clickEvent");

            const data = {
                "genex_faci_cont_siteID":siteID,
                "genex_faci_cont_fullname":fname.val(),
                "genex_faci_cont_position":position.val(),
                "genex_faci_cont_contactnumber":contactNumber.val(),
                "genex_faci_cont_email":email.val()
            }

            const item = `<tr onclick="${click}" 
            data-data='${JSON.stringify(data)}' data-new="new">
                <td>${fname.val()}</td>
                <td>${position.val()}</td>
                <td>${email.val()}</td>
                <td>${contactNumber.val()}</td>
            </tr>`;

            tbody.append(item);
            hideSubForm('#contact-info-area','top');
            $(this).off("click");

        });

    }else{

          // assign here
        fname.val(data['genex_faci_cont_fullname']);
        position.val(data['genex_faci_cont_position']);
        contactNumber.val(data['genex_faci_cont_contactnumber']);
        email.val(data['genex_faci_cont_email']);
        hideSubForm('#contact-info-area','top');

        $("#contact-info-submit-btn").on("click",function(){

            const d = {
                "genex_faci_cont_contactID":data['genex_faci_cont_contactID'],
                "genex_faci_cont_siteID":data['genex_faci_cont_siteID'],
                "genex_faci_cont_fullname":fname.val(),
                "genex_faci_cont_position":position.val(),
                "genex_faci_cont_contactnumber":contactNumber.val(),
                "genex_faci_cont_email":email.val()
            }

            const tr = $(div);
            tr.data("data",d);
            tr.attr("data-edit","edit");
            tr.children("td:nth-child(1)").html(fname.val());
            tr.children("td:nth-child(2)").html(position.val());
            tr.children("td:nth-child(3)").html(email.val());
            tr.children("td:nth-child(4)").html(contactNumber.val());
           
            hideSubForm('#contact-info-area','top');
            $(this).off("click");

        });
        

    }


    $("#contact-info-close-btn").on("click",function(){
        $("#contact-info-submit-btn").off("click");
        hideSubForm('#contact-info-area','top');
    });
    
  

    showSubForm('#contact-info-area','top');
}

function showAssayStatisticInfoForm(div,transType){

    let data = $(div).data("data");
   
    let test = $("#assay-entry-test");
    let quantity = $("#assay-entry-quantity");

    if(transType == "new"){
        // assign here
        test.val("");
        quantity.val("");
       
        $("#assay-entry-submit-btn").on("click",function(){

            const data = {
                "assay_test":test.val(),
                "assay_quantity":quantity.val(),
              
            }

            const tbody = $(div).parent(".frame-info-panel-title")
            .siblings(".frame-info-panel-table")
            .children("tbody#genexpert-info-assaystatistic-tbody");
            
            const click = $(div).parent(".frame-info-panel-title")
            .siblings(".frame-info-panel-table").attr("clickEvent");
            
            const item = `<tr onclick="${click}" 
            data-data='${JSON.stringify(data)}' data-new="new">
                <td>${test.val()}</td>
                <td>${quantity.val()}</td>
            </tr>`;
            
            tbody.append(item);
            hideSubForm('#assaystatistic-entry-area','left');

            $(this).off("click");

        });

    }else{
        // assign here
        test.val(data['assay_test']);
        quantity.val(data['assay_quantity']);
       
        showSubForm('#assaystatistic-entry-area','left');

        $("#assay-entry-submit-btn").on("click",function(){

            const data = {
                "assay_test":test.val(),
                "assay_quantity":quantity.val(),
            }

            const tr = $(div);
            tr.data("data",data);
            tr.attr("data-edit","edit");
            tr.children("td:nth-child(1)").html(test.val());
            tr.children("td:nth-child(2)").html(quantity.val());
            hideSubForm('#assaystatistic-entry-area','left');
            $(this).off("click");


        });
        

    }

    $("#assaystatistic-entry-close-btn").on("click",function(){
        $("#assay-entry-submit-btn").off("click");
        hideSubForm('#assaystatistic-entry-area','left');
    });


    showSubForm('#assaystatistic-entry-area','left');

    
}

function showPeripheralInfoForm(div,transType){

    let data = $(div).data("data");
   
    let pname = $("#peripheral-entry-name");
    let serialnumber = $("#peripheral-entry-serial-number");
    let modelnumber = $("#peripheral-entry-model-number");

    if(transType == "new"){
        // assign here
        pname.val("");
        serialnumber.val("");
        modelnumber.val("");
       
        $("#peripheral-entry-submit-btn").on("click",function(){

            const data = {
                "peri_peripheralName":pname.val(),
                "peri_serialnumber":serialnumber.val(),
                "peri_modelnumber":modelnumber.val()
              
            }

            const tbody = $(div).parent(".frame-info-panel-title")
            .siblings(".frame-info-panel-table")
            .children("tbody#genexpert-info-peripheral-tbody");
            
            const click = $(div).parent(".frame-info-panel-title")
            .siblings(".frame-info-panel-table").attr("clickEvent");
            
            const item = `<tr onclick="${click}" 
            data-data='${JSON.stringify(data)}' data-new="new">
                <td>${pname.val()}</td>
                <td>${serialnumber.val()}</td>
                <td>${modelnumber.val()}</td>
            </tr>`;
            
            tbody.append(item);
            hideSubForm('#peripheral-entry-area','left');

            $(this).off("click");

        });

    }else{
        // assign here
        pname.val(data['peri_peripheralName']);
        serialnumber.val(data['peri_serialnumber']);
        modelnumber.val(data['peri_modelnumber']);
        showSubForm('#peripheral-entry-area','left');

        $("#peripheral-entry-submit-btn").on("click",function(){

            const data = {
                "peri_peripheralName":pname.val(),
                "peri_serialnumber":serialnumber.val(),
                "peri_modelnumber":modelnumber.val()
              
            }

            const tr = $(div);
            tr.data("data",data);
            tr.attr("data-edit","edit");
            tr.children("td:nth-child(1)").html(pname.val());
            tr.children("td:nth-child(2)").html(serialnumber.val());
            tr.children("td:nth-child(3)").html(modelnumber.val());
            hideSubForm('#peripheral-entry-area','left');
            $(this).off("click");

            
        });
        

    }

    $("#peripheral-entry-close-btn").on("click",function(){
        $("#peripheral-entry-submit-btn").off("click");
        hideSubForm('#peripheral-entry-area','left');
    });

    showSubForm('#peripheral-entry-area','left');

    
}

function openModuleEntryForm(div){

    hideSubForm("#genexpert-information-area",'left');

   
    $(div).attr("href","#transaction-frame-area");
    $(div).parent().parent().parent().parent().parent()
    .parent()
    .children(".menu-area").children(".menu-item-area")
    .children(`a[href="#transaction-frame-area"]`).trigger("click");

    $("#transaction-category-list").val("Genexpert").trigger("change");
    $("#transaction-type-list").val("Module Replacement").trigger("change");
    

   
}

function showModuleInfoForm(div,evt){

    // module-record-button

    const trgt = $(evt.target);

    if(trgt.attr('class')){
        if(trgt.attr('class').includes("module-record-button") || 
        trgt.attr('class').includes("fa-book")){

        }else{
            exec();
        }
    }else{
        exec();
    }
    
    function exec(){

        let data = $(div).data("data");
   
        let serialnumber = $("#module-info-serial-number");
        let location = $("#module-info-location");
        let dateinstalled = $("#module-info-date-installed");
        let installedby = $("#module-info-engineer");
        let installType = $("#module-info-installation-type");
        let revisionNumber = $("#module-info-revision-number");
        let partNumber = $("#module-info-part-number");
       
    
            // assign here
            serialnumber.val(data['modu_serialnumber']);
            location.val(data['modu_location']);
            dateinstalled.val(getOnDate(data['modu_dateinstalled']));
            installedby.val(data['modu_eng_engineerID']);
            installType.val(data['modu_inst_itID']);
            revisionNumber.val(data['modu_revision_number']);
            partNumber.val(data['modu_part_number']);
            showSubForm('#module-info-area','left');
    
            $("#module-info-submit-btn").on("click",function(){
    
                const data = {
                    "modu_serialnumber":serialnumber.val(),
                    "modu_location":location.val(),
                    "modu_dateinstalled":dateinstalled.val(),
                    "modu_eng_engineerID":installedby.val(),
                    "modu_inst_itID":installType.val(),
                    "modu_revision_number":revisionNumber.val(),
                    "modu_part_number":partNumber.val()
                  
                }
    
                const tr = $(div);
                tr.data("data",data);
                tr.attr("data-edit","edit");
                tr.children("td:nth-child(1)").html(serialnumber.val());
                tr.children("td:nth-child(2)").html(location.val());
                tr.children("td:nth-child(3)").html(getOnDate(dateinstalled.val()));
                
                tr.children("td:nth-child(4)").data("update-id",
                installType.children("option:selected").val());
                tr.children("td:nth-child(4)").html(installType.children("option:selected").text());
                tr.children("td:nth-child(5)").data("update-id",
                installedby.children("option:selected").val());
                tr.children("td:nth-child(5)").html(installedby.children("option:selected").text());
                tr.children("td:nth-child(6)").html(revisionNumber.val());
                tr.children("td:nth-child(7)").html(partNumber.val());
                hideSubForm('#module-info-area','left');
                $(this).off("click");
    
    
            });
    
            $("#module-info-close-btn").on("click",function(){
                $("#module-info-submit-btn").off("click");
                hideSubForm('#module-info-area','left');
            });
            
    
    
    
        showSubForm('#module-info-area','left');
    }



    
}

