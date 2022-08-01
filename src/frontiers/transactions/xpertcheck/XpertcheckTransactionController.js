const { backendScreen } = require("../../sections/MessageLoadingSection");
const {getOnDate } = require("../../sections/RequestSection");
const xpertcheckTransactionModel = require("./XpertcheckTransactionModel");
const xpertcheckTransactionView = require("./XpertcheckTransactionView");

class XpertcheckTransactionController{
    constructor(){}


    setCalibrationTo(){

        const calibrationFrom = $("#xpertcheck-schedule-calibration-from").val();
        const timeLengthVal = $("#xpertcheck-schedule-time-length-value").val();
        const timeLengthFormat = $("#xpertcheck-schedule-time-length-format").children("option:selected").val();
        const calibrationTo = $("#xpertcheck-schedule-calibration-to");

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
    timeLengthRemainingUpdate(calibrateFrom,calibrateTo,callback){

        setInterval(function(){
            const fromDate = new Date(calibrateFrom);
            const currentDate = new Date();
            const toDate = new Date(calibrateTo);

            let fromDateTime = fromDate.getTime();
            let currentDateTime = currentDate.getTime();
            let toDateTime = toDate.getTime();
            let fromcurrent = currentDateTime - fromDateTime;
            let fromto = toDateTime-fromDateTime;

        
            let time_calculate =Math.ceil((fromcurrent/fromto) * 100);
            callback(time_calculate);

        },1000);

    }
    goSchedule(){

        let values = xpertcheckTransactionView.setSchedule().getAllEntries();
        
        backendScreen({
            "container":`#transaction-frame-area`,
            "screen-name":"xpertcheck-schedule-error-screen",
            "loading-box":{
                "version":1,
                "message":"Please wait..."
            }
        });

        if(xpertcheckTransactionView.setSchedule().fieldValidation()){
            

            xpertcheckTransactionModel.schedule().checkServiceReportExistProcess(
                values['service-report']['service-report-num'],function(){

                    backendScreen({
                        "container":`#transaction-frame-area`,
                        "screen-name":"xpertcheck-schedule-error-screen",
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

                    xpertcheckTransactionModel.schedule().checkGenexpertExistProcess(values['genexpert'],function(){

                        xpertcheckTransactionModel.schedule().scheduleProcess(values,function(res){

                            values['service-report']['service-report-particular-id'] = res['xpckID'];

                            xpertcheckTransactionModel.schedule().insertServiceReportProcess(
                                values['service-report'],function(){
                                    backendScreen({
                                        "container":`#transaction-frame-area`,
                                        "screen-name":"xpertcheck-schedule-error-screen",
                                        "message-box":{
                                            "version":2,
                                            "title":"Xpertcheck Set Schedule Message",
                                            "message":`Successfully Set New Schedule for Xpertcheck`,
                                            "border-radius":true
                                        }
                                    });

                                });

                        });

                    },function(){

                        backendScreen({
                            "container":`#transaction-frame-area`,
                            "screen-name":"xpertcheck-schedule-error-screen",
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
const xpertcheckTransactionController = new XpertcheckTransactionController();
module.exports = xpertcheckTransactionController;