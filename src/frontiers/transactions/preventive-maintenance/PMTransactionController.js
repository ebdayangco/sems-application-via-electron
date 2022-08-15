const { backendScreen } = require("../../sections/MessageLoadingSection");
const {getOnDate } = require("../../sections/RequestSection");
const pmTransactionModel = require("./PMTransactionModel");
const pmTransactionView = require("./PMTransactionView");

class PMTransactionController{
    constructor(){}
    setCalibrationTo(){

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
    goSchedule(){

        let values = pmTransactionView.setSchedule().getAllEntries();
        
        backendScreen({
            "container":`#transaction-frame-area`,
            "screen-name":"pm-schedule-error-screen",
            "loading-box":{
                "version":1,
                "message":"Please wait..."
            }
        });

        if(pmTransactionView.setSchedule().fieldValidation()){
            

            pmTransactionModel.schedule().checkServiceReportExistProcess(
                values['service-report']['service-report-num'],function(){

                    backendScreen({
                        "container":`#transaction-frame-area`,
                        "screen-name":"pm-schedule-error-screen",
                        "animation":{
                            "stand-up":{
                                "length-second":600,
                                "second":"ms"
                            }
                        },
                        "message-box":{
                            "version":1,
                            "messages":[`Service Report 
                            ${values['service-report']['service-report-num']} already exist!`]
                        }
                    });


                },function(){

                    pmTransactionModel.schedule().checkGenexpertExistProcess(values['genexpert'],function(){

                        pmTransactionModel.schedule().scheduleProcess(values,function(res){

                            values['service-report']['service-report-particular-id'] = res['prevID'];

                            pmTransactionModel.schedule().insertServiceReportProcess(
                                values['service-report'],function(){
                                    backendScreen({
                                        "container":`#transaction-frame-area`,
                                        "screen-name":"pm-schedule-error-screen",
                                        "message-box":{
                                            "version":2,
                                            "title":"Preventive Maintenance Set Schedule Message",
                                            "message":`Successfully Set New Schedule for Preventive Maintenance`,
                                            "border-radius":true
                                        }
                                    });

                                });

                        });

                    },function(){

                        backendScreen({
                            "container":`#transaction-frame-area`,
                            "screen-name":"pm-schedule-error-screen",
                            "animation":{
                                "stand-up":{
                                    "length-second":600,
                                    "second":"ms"
                                }
                            },
                            "message-box":{
                                "version":1,
                                "messages":[`Genexpert 
                                ${values['genexpert']} not exist!`]
                            }
                        });
                    });

                    
                });



        }




    }

    
}
const pmTransactionController = new PMTransactionController();
module.exports = pmTransactionController;