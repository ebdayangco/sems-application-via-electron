const {backendScreen} = require("../../sections/MessageLoadingSection");
class ModuleTransactionView{

    constructor(){}

    installation(){

        
        function allFields(){

            return {
                "genexpert":`#module-installation-genexpert-serial-number`,
                "serial-number":`#module-installation-serial-number`,
                "location":`#module-installation-location`,
                "date-installed":`#module-installation-date-installed`,
                "installation-type":`#module-installation-installation-type`,
                "engineer":`#module-installation-engineer`
            }

        }

        function getAllEntries(){

            const fields = allFields();

            const service_report = {};
            service_report['service-report-particular-id'] = 0;
            service_report['service-report-for-what'] = "module";
            const fileObj = $("#service_report_full_location").html() == "" ?
            `../../galleries/blnk_pg.png`: $("#service_report_full_location").html();
            service_report['service-report-num'] = $("#transaction-service-report-number").val();

            service_report['file-object'] = fileObj;
            service_report['remarks'] = $("#module-installation-remarks").val();
            service_report['status'] = "Active";

            return {
                "genexpert":$(fields['genexpert']).val(),
                "serial-number":$(fields['serial-number']).val(),
                "location":$(fields['location']).val(),
                "date-installed":$(fields['date-installed']).val(),
                "installation-type":$(fields['installation-type']).children("option:selected").val(),
                "installation-type-text":$(fields['installation-type']).children("option:selected").text(),
                "engineer":$(fields['engineer']).children("option:selected").val(),
                "engineer-text":$(fields['engineer']).children("option:selected").text(),
                "service-report":service_report
            }

        }
        
        
        function fieldValidation(){

            const values = getAllEntries();
            let messages = [];

            if(values['genexpert'] == ""){
                messages.push("Please provide Genexpert Serial Number");
            }

            if(values['serial-number'] == ""){
                messages.push("Please provide Module Serial Number");
            }

            if(values['location'] == ""){
                messages.push("Please provide Module Location");
            }

            if(values['date-installed'] == ""){
                messages.push("Please provide Module Date Installed");
            }
            if(values['service-report']['service-report-num'] == ""){
                messages.push("Service Report # must provided.");
            }

            if(messages.length != 0){
                backendScreen({
                    "container":`#transaction-frame-area`,
                    "screen-name":"module-installation-error-screen",
                    "message-box":{
                        "version":1,
                        "messages":messages
                    }
                });
            }

            return messages.length == 0;


        }



        return {fieldValidation,getAllEntries};


    }

    repair(){

    }

    replacement(){

        function getReturnValueViaModuleSearch(){
            
            return $("#searchmoduleviaReplacementField").val();
        }

        function validateSearchModule(){

            const value = getReturnValueViaModuleSearch();
            let messages = [];
            if(value == ""){
                messages.push("Please fill up search field.");
            }

            if(messages.length != 0){
                backendScreen({
                    "container":`#transaction-frame-area`,
                    "screen-name":"module-replacement-error-screen",
                    "message-box":{
                        "version":1,
                        "messages":messages
                    }
                });
            }

            return messages.length == 0;
        }

        function displayResults_via_search_module(datas){

            const tbody = $("#module-replacement-tbody-area");
            tbody.html("");
            datas.forEach(data => {
                const item = `
                    <tr data-whole='${JSON.stringify(data)}'>
                        <td style="width:5%">
                            <a href="#" 
                            class="btn btn-info w-100" 
                            onclick="moduletransactionController.showInfoForm(this)" 
                            ><i class="fa fa-info"></i></a></td>
                        <td style="width:10%">${data['a_genexpertSN']}</td>
                        <td style="width:30%">${data['c_siteName']}</td>
                        <td style="width:10%">${data['a_moduleSN']}</td>
                        <td style="width:10%">${data['a_location']}</td>
                        <td style="width:20%">${data['e_fullname']}</td>
                        <td style="width:10%;">
                            <a href="#" class="btn btn-warning w-100" 
                            onclick="moduletransactionController.showReplaceForm(this)">
                            Replace</a>
                        </td>
                    </tr>
                `; 
                
                tbody.append(item);
            });

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
               .children("option:selected").val()
            }
        }

        function validateReplacementModule(){
            const data = getValueOnreplaceModule();
            let messages = [];
            if(data['new-serial-number'] == ""){
                messages.push("Please provide new serial number.");
            }

            if(data['new-date-installed'] == ""){
                messages.push("Please provide date installed.");
            }

            if(data['new-installation-type-text'] == "" || 
            data['new-installation-type-text'] == null){
                messages.push("Please select installation type.");
            }

            if(data['new-engineer-text'] == "" || 
            data['new-engineer-text'] == null){
                messages.push("Please select engineer.");
            }

            if(messages.length != 0){
                backendScreen({
                    "container":`#transaction-frame-area`,
                    "screen-name":"module-replacement-error-screen",
                    "message-box":{
                        "version":1,
                        "messages":messages
                    }
                });
            }

            return messages.length == 0;
        }


        return {getReturnValueViaModuleSearch,validateSearchModule,
            displayResults_via_search_module,getValueOnreplaceModule,
            validateReplacementModule}

    }

    transfer(){

    }

}
const moduleTransactionView = new ModuleTransactionView();
module.exports = moduleTransactionView;