const { backendScreen } = require("../../sections/MessageLoadingSection");
const { getOnDate } = require("../../sections/RequestSection");

class GenexpertTransactionView{
    constructor(){}

    getSearchValue(){
        
        return $("#genexpertTransferSearchField").val();
    }

    validateSearchGenexpertTransfer(){

        if(this.getSearchValue() == ""){

            backendScreen({
                "container":"#transaction-frame-area",
                "screen-name":"genexpert-transfer-search-error-screen",
                "message-box":{
                     "version":1,
                     "messages":["Empty search field!"]
                }
            });
            return false;
        }else{
            return true;
        }
    }
    validateTransferData(){

        const newfacility = $("#genexpert-transfer-to-facility").val();
        const sr_number = $("#transaction-service-report-number").val();
        let messages = [];

        if(newfacility == ""){
            messages.push("Please provide new facility");
        }
        if(sr_number == ""){
            messages.push("Please provide service report number.");
        }

        if(messages.length != 0){
            backendScreen({
                "container":"#transaction-frame-area",
                "screen-name":"genexpert-transfer-search-error-screen",
                "message-box":{
                     "version":1,
                     "messages":messages
                }
            });
        }


       return messages.length == 0;

    }
    getTransferFinalData(){

        const data = $(".genexpert-transfer-main-form").data("whole");
        const sn = data['a_serialnumber'];
        const newfacility = $("#genexpert-transfer-to-facility").val();

        return {
            "serial-number":sn,
            "new-facility":newfacility
        }
    }
    displayInfo(data){

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
                onclick="genexpertTransactionController.hideInfoForm()">Return</a>
            </div>
        
        `;

        info_form.html(item);
    }
    displaySearchResults(datas){

        const tbody = $("#genexpert-transfer-tbody-area");
        tbody.html("");
        datas.forEach(data => {

                const item = `
                <tr data-whole='${JSON.stringify(data)}'>
                <td style="width:5%">
                    <a href="#" 
                    class="btn btn-info w-100" 
                    onclick="genexpertTransactionController.showInfoForm(this)" 
                    ><i class="fa fa-info"></i></a>
                </td>
                <td style="width:15%">${data['a_serialnumber']}</td>
                <td style="width:35%">${data['b_siteName']}</td>
                <td style="width:15%">${getOnDate(data['a_dateinstalled'])}</td>
                <td style="width:15%">${data['c_itName']}</td>
                <td style="width:15%">${data['d_fullname']}</td>
                <td style="width:10%;">
                    <a href="#" class="btn btn-primary w-100" 
                    onclick="genexpertTransactionController.showTransferForm(this)">
                    Transfer</a>
                </td>
            </tr>
                
                `;

            tbody.append(item);
        });
        
    }
}
const genexpertTransactionView = new GenexpertTransactionView();
module.exports = genexpertTransactionView;