const { inquireDatabase } = require("../../databases/ApplicationDatabase");
const acctJSON = require("../../storages/account.json");
class XpertcheckTransactionModel{
    constructor(){}

    schedule(){

        function scheduleStatement(values){
            return `CALL scheduleXpertcheck(
                "${values['genexpert']}",
                "${values['calibration-from']}",
                "${values['calibration-to']}",
                "${values['engineer']}",
                ${acctJSON["online"]['userID']},
                ${acctJSON["online"]['userID']}
            )`;
        }

        function checkServiceReportExistStatement(servicereportnum){
            return `SELECT service_report_num FROM service_report 
                    WHERE service_report_num="${servicereportnum}" AND status != "Cancel"`;
        }

        function insertServiceReportStatement(data){
                
            return `INSERT INTO 
            service_report(service_report_num,
                particular_id,for_what,addedby,updatedby,filename,fileobject,remarks,status)
            VALUES(
                "${data['service-report-num']}",
                "${data['service-report-particular-id']}",
                "${data['service-report-for-what']}",
                ${acctJSON["online"]['userID']},
                ${acctJSON["online"]['userID']},
                "${data['service-report-for-what']}_${data['service-report-particular-id']}",
                LOAD_FILE("${data['file-object']}"),
                "${data['remarks']}",
                "${data['status']}")`;
             
        }

        function checkServiceReportExistProcess(servicereportnum,ifexist,ifnotexist){

            inquireDatabase({
                "statement":checkServiceReportExistStatement(servicereportnum),
                "results":function(res){
                    const found = JSON.parse(JSON.stringify(res));

                    if(found.length == 0){
                        ifnotexist();
                    }else{
                        ifexist();
                    }
                }
            },function(){});


        }

        function checkGenexpertExistProcess(genexpert,ifexist,ifnotexist){

            inquireDatabase({
                "statement":`SELECT serialnumber FROM genexpert WHERE serialnumber="${genexpert}"`,
                "results":function(res){
                    const found = JSON.parse(JSON.stringify(res));

                    if(found.length == 0){
                        ifnotexist();
                    }else{
                        ifexist();
                    }
                }
            },function(){});

        }

        function insertServiceReportProcess(data,callback){

            inquireDatabase({
                "statement":insertServiceReportStatement(data)
            },callback);
        }

        function scheduleProcess(values,callback){

            inquireDatabase({
                "statement":scheduleStatement(values),
                "results":function(r){
                    inquireDatabase({
                        "statement":`SELECT MAX(xpertcheckID) AS xpckID FROM xpertcheck`,
                        "results":function(res){
                            callback(JSON.parse(JSON.stringify(res))[0]);


                        }
                    });
                }
            },function(){
                    
            });
        }

        return {scheduleProcess,insertServiceReportProcess,
            checkServiceReportExistProcess,checkGenexpertExistProcess};

    }
}

const xpertcheckTransactionModel = new XpertcheckTransactionModel();
module.exports = xpertcheckTransactionModel;