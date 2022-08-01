const View = require("./View");
class ModuleView extends View{
    constructor(){
        super();
    }

    transaction(){

        var self = this;

        function replacement(){

            self.container = "#transaction-frame-area";

            function validateReplacementOnTransaction(){

                const container = $(".transaction-module-replacement-area");
                const errs = [];

                container.each((i,el)=>{
                    const box = $(el).children(".frame-row").children(".frame-box");
            
                
                            const box_area = box.children(".module-replace-basic-info-area");
            
                            const row = box_area.children(".frame-row")
                            .children(".frame-item").children(".frame-input");
                        
                            const curr_sn = row.children("#transaction-module-replacement-serial-number-field");
                            const curr_location = row.children("#transaction-module-replacement-location-field");
                        
                            const curr_dateinstalled = row.children("#transaction-module-replacement-date-installed-field");
            

                            if(curr_sn.val() == ""){
                                errs.push(`Serial Number at Row ${i+1} must be provided`);
                            }

                            if(curr_location.val() == ""){
                                errs.push(`Location at Row ${i+1} must be provided`);
                            }

                            if(curr_dateinstalled.val() == ""){
                                errs.push(`Date Installed at Row ${i+1} must be provided`);
                            }
            
                            
            
                });
                if(errs.length != 0){
                    self.messager({"message-01":true,
                    "messages":errs});
                }
               
                return errs.length == 0;
            }

            function getSearchValue(){
                return $("#searchmoduleviaReplacementField").val();
            }
    
            function onValidateSearchValue(){
    
                return self.validateProcess([
                    {
                        "field":"text",
                        "value":getSearchValue(),
                        "label":"Search value",
                        "validation":["empty"],
                        "message":"Please fill up search field"
                    }
                ]);
            }

            function displayOnSearchResultForModuleReplacement(datas){

                const tbody = $("#module-replacement-tbody-area");
                tbody.html("");
                datas.forEach(data => {
                    const item = `
                        <tr data-whole='${JSON.stringify(data)}'>
                            <td style="width:5%">
                                <a href="#" 
                                class="btn btn-info w-100" 
                                onclick="moduleController.onView().transaction().
                                replacement().showInfo(this)" 
                                ><i class="fa fa-info"></i></a></td>
                            <td style="width:10%">${data['a_genexpertSN']}</td>
                            <td style="width:30%">${data['c_siteName']}</td>
                            <td style="width:10%">${data['a_moduleSN']}</td>
                            <td style="width:10%">${data['a_location']}</td>
                            <td style="width:20%">${data['e_fullname']}</td>
                            <td style="width:10%;">
                                <a href="#" class="btn btn-warning w-100" 
                                onclick="moduleController.onView().transaction()
                                .replacement().showReplaceform(this)">
                                Replace</a>
                            </td>
                        </tr>
                    `; 
                    
                    tbody.append(item);
                });
            }

            function showInfo(div){
        
                const data = $(div).parent("td").parent("tr").data("whole");
                displayInfo(data);
                $(".module-replacement-info-form").addClass("show-info-form");
                
            }

            function displayInfo(data){
                const infoForm = $(".module-replacement-info-form");
                infoForm.html("");
        
                const item = `
                <div class="module-replacement-info-row">
                <div class="module-replacement-info-label">Genexpert SN:</div>
                <div class="module-replacement-info-value">${data['a_genexpertSN']}</div>
                </div>
        
                <div class="module-replacement-info-row">
                    <div class="module-replacement-info-label">Facility:</div>
                    <div class="module-replacement-info-value">${data['c_siteName']}</div>
                </div>
        
                <div class="module-replacement-info-row">
                    <div class="module-replacement-info-label">Region:</div>
                    <div class="module-replacement-info-value">${data['c_region']}</div>
                </div>
        
                <div class="module-replacement-info-row">
                    <div class="module-replacement-info-label">Province:</div>
                    <div class="module-replacement-info-value">${data['c_province']}</div>
                </div>
        
                <div class="module-replacement-info-row">
                    <div class="module-replacement-info-label">City:</div>
                    <div class="module-replacement-info-value">${data['c_city']}</div>
                </div>
        
                <div class="module-replacement-info-row">
                    <div class="module-replacement-info-label">Barangay:</div>
                    <div class="module-replacement-info-value">${data['c_barangay']}</div>
                </div>
        
                <div class="module-replacement-info-row">
                    <div class="module-replacement-info-label">Module SN:</div>
                    <div class="module-replacement-info-value">${data['a_moduleSN']}</div>
                </div>
        
                <div class="module-replacement-info-row">
                    <div class="module-replacement-info-label">Location:</div>
                    <div class="module-replacement-info-value">${data['a_location']}</div>
                </div>
        
                <div class="module-replacement-info-row">
                    <div class="module-replacement-info-label">Date Installed:</div>
                    <div class="module-replacement-info-value">${getOnDate(data['a_dateinstalled'])}</div>
                </div>
        
                <div class="module-replacement-info-row">
                    <div class="module-replacement-info-label">Installation Type:</div>
                    <div class="module-replacement-info-value">${data['d_itName']}</div>
                </div>
        
                <div class="module-replacement-info-row">
                    <div class="module-replacement-info-label">Engineer:</div>
                    <div class="module-replacement-info-value">${data['e_fullname']}</div>
                </div>
        
                <div class="module-replacement-info-row">
                    <div class="module-replacement-info-label">Revision Number:</div>
                    <div class="module-replacement-info-value">${data['a_revision_number']}</div>
                </div>
        
                <div class="module-replacement-info-row">
                    <div class="module-replacement-info-label">Part Number:</div>
                    <div class="module-replacement-info-value">${data['a_part_number']}</div>
                </div>
        
                <div class="module-replacement-info-row">
                    <a href="#" class="btn btn-danger w-25" 
                    onclick="moduleController.onView().transaction()
                    .replacement().hideInfo()">Return</a>
                </div>
                
                `;
        
                infoForm.html(item);
        
            }

            function hideInfo(){
                $(".module-replacement-info-form").removeClass("show-info-form");
            }

            function showReplaceform(div){
        
                const data = $(div).parent("td").parent("tr").data("whole");
                $(".module-replacement-main-form").data("catch",data);
                $(".module-replacement-main-form").addClass("show-replacement-form");
            }
        
            function hideReplaceform(){
                $(".module-replacement-main-form").removeClass("show-replacement-form");
            }

            function getValueOnreplaceModule(){

                const mainData =   $(".module-replacement-main-form").data("catch");   
       
                   return{
                      "previous-serial-number":mainData['a_moduleSN'],
                      "revision-number":$("#module-replacement-revision-number").val(),
                      "part-number":$("#module-replacement-part-number").val(),
                      "remarks":$("#module-replacement-remarks").val(),
                      "location":mainData['a_location'],
                      "genexpert":mainData['a_genexpertSN'],
                      "new-serial-number":$("#module-replacement-new-serial-number").val(),
                      "new-date-installed":$("#module-replacement-new-date-installed").val(), 
                      "new-installation-type":
                      $("#module-replacement-new-installation-type").children("option:selected").val(),
                      "new-installation-type-text":
                      $("#module-replacement-new-installation-type").children("option:selected").text(), 
                      "new-engineer-text":$("#module-replacement-new-installed-by")
                      .children("option:selected").text(),
                      "new-engineer":$("#module-replacement-new-installed-by")
                      .children("option:selected").val(),
                      'service-report':{
                            'service-report-num':$("#transaction-service-report-number").val(),
                            'service-report-particular-id':0,
                            'service-report-for-what':'module',
                            'remarks':$("#module-replacement-remarks").val(),
                            'status':'Replacement',
                            'genexpert-serial-number':mainData['a_genexpertSN']
                        }
                   }
            }

            function validateModuleReplacementProcess(){

                const data = getValueOnreplaceModule();
                return self.validateProcess([
                    {
                        "field":"text",
                        "value":data['new-serial-number'],
                        "label":"Serial Number",
                        "validation":["empty"],
                        "message":"Please provide new serial number."
                    },
                    {
                        "field":"text",
                        "value":data['new-installation-type-text'],
                        "label":"Serial Number",
                        "validation":["empty"],
                        "message":"Please select installation type."
                    },
                    {
                        "field":"text",
                        "value":data['new-engineer-text'],
                        "label":"Serial Number",
                        "validation":["empty"],
                        "message":"Please select engineer."
                    },
                    {
                        "field":"date",
                        "value":data['new-date-installed'],
                        "label":"Date Installed",
                        "validation":["empty"],
                        "message":"Please provide installation date."
                    },
                    {
                        "field":"text",
                        "value":data['service-report']['service-report-num'],
                        "label":"Serial Number",
                        "validation":["empty"],
                        "message":"Please provide service report number."
                    }
                ]);
            }

                   
            function clearAll(){
                
                const labels = {
                    "module-replacement-part-number":{
                        "type":"text-field",
                        "id":"module-replacement-part-number"   
                    },
                    "module-replacement-revision-number":{
                        "type":"text-field",
                        "id":"module-replacement-revision-number"   
                    },
                    "module-replacement-remarks":{
                        "type":"text-field",
                        "id":"module-replacement-remarks"
                    },
                    "module-replacement-new-serial-number":{
                        "type":"text-field",
                        "id":"module-replacement-new-serial-number"
                    },
                    "module-replacement-new-date-installed":{
                        "type":"date-field",
                        "id":"module-replacement-new-date-installed"
                    },
                    "module-replacement-new-installed-by":{
                        "type":"select-field",
                        "id":"module-replacement-new-installed-by"
                    },
                    "module-replacement-new-installation-type":{
                        "type":"select-field",
                        "id":"module-replacement-new-installation-type"
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
    
            return {getSearchValue,onValidateSearchValue,displayOnSearchResultForModuleReplacement,
            showInfo,hideInfo,showReplaceform,hideReplaceform,getValueOnreplaceModule,
            validateModuleReplacementProcess,clearAll,validateReplacementOnTransaction}
        }

        function installation(){

            function getNewInstallation(){
                return {
                    "serial-number":$("#transaction-module-installation-serial-number-field").val(),
                    "location":$("#transaction-module-installation-location-field").val(),
                    "date-installed":$("#transaction-module-installation-date-installed-field").val(),
                    "engineer":$("#transaction-module-installation-engineer-field").val(),
                    "status":$("#transaction-module-installation-status-field").val(),
                    "installation-type":$("#transaction-module-installation-installation-type-field").val(),
                    "genexpert":$("#transaction-serial-number-field").val()
                }
            }

            function validateInstallation(){
                const data = getNewInstallation();

                const errs = [];


                if(data['serial-number'] == ""){
                    errs.push("Please provide module serial number");
                }

                if(data['location'] == ""){
                    errs.push("Please provide module location");
                }

                if(data['status'] == ""){
                    errs.push("Please provide module status");
                }

                if(data['date-installed'] == ""){
                    errs.push("Please provide module installation date");
                }

                if(data['engineer'] == 0){
                    errs.push("Please provide module engineer");
                }

                if(data['installation-type'] == 0){
                    errs.push("Please provide module installation type");
                }

                if(errs.length != 0){
                    self.messager({"message-01":true,"messages":errs});
                }

               
                return errs.length == 0;
            }




            return {getNewInstallation,validateInstallation};

        }



        return {replacement,installation};

    }
}
const moduleView = new ModuleView();
module.exports = moduleView;