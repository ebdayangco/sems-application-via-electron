const { backendScreen } = require("../../sections/MessageLoadingSection");

class PMTransactionView{

    constructor(){

    }

    setSchedule(){

       

        function getFields(){

            return {
                "genexpert":`#pm-schedule-genexpert-serial-number`,
                "engineer":`#pm-schedule-engineer`,
                "calibration-from":`#pm-schedule-calibration-from`,
                "calibration-to":`#pm-schedule-calibration-to`,
                "time-length-value":`#pm-schedule-time-length-value`,
                "time-length-format":`#pm-schedule-time-length-format`
            }

        }

        function getAllEntries(){

            const fields = getFields();

             
            const service_report = {};
            service_report['service-report-particular-id'] = 0;
            service_report['service-report-for-what'] = "preventive-maintenance";
            const fileObj = $("#service_report_full_location").html() == "" ?
            `../../galleries/blnk_pg.png`: $("#service_report_full_location").html();
            service_report['service-report-num'] = $("#transaction-service-report-number").val();

            service_report['file-object'] = fileObj;
            service_report['remarks'] = $("#pm-schedule-remarks").val();
            service_report['status'] = "Active";

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

        function fieldValidation(){

            const values = getAllEntries();
            let messages = [];
            if(values['genexpert'] == ""){
                messages.push("Please provide Genexpert Serial Number.");

            }

            if(values['calibration-from'] == ""){
                messages.push("Please provide calibration from.");

            }

            if(values['calibration-to'] == ""){
                messages.push("Please provide calibration to.");

            }

            if(values['service-report']['service-report-num'] == ""){
                messages.push("Service Report # must provided.");
            }

            if(messages.length != 0){
                backendScreen({
                    "container":`#transaction-frame-area`,
                    "screen-name":"pm-schedule-error-screen",
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
}

const pmTransactionView = new PMTransactionView();
module.exports = pmTransactionView;