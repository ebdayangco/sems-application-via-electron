const { inquireDatabase } = require("../../databases/ApplicationDatabase");
const acctJSON = require("../../storages/account.json");
class ModuleTransactionModel{
    constructor(){}

    installation(){

        function installationStatement(values){

            return `CALL installModule(
                "${values['genexpert']}",
                "${values['serial-number']}",
                "N/A","N/A","Active",
                ${acctJSON["online"]['userID']},
                ${acctJSON["online"]['userID']},
                "${values['location']}",
                "${values['date-installed']}",
                "${values['installation-type-text']}",
                "${values['engineer-text']}")`;

        }

        function checkServiceReportExistStatement(servicereportnum){
            return `SELECT service_report_num FROM service_report 
                    WHERE service_report_num="${servicereportnum}" AND status != "Cancel"`;
        }

        function checkModuleExistStatement(serialnumber){
            return `SELECT serialnumber FROM module 
                    WHERE serialnumber="${serialnumber}" AND status="Active"`;
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

        function checkModuleExistProcess(serialnumber,ifexist,ifnotexist){

            inquireDatabase({
                "statement":checkModuleExistStatement(serialnumber),
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
        function installationProcess(values,callback){

            inquireDatabase({
                "statement":`UPDATE module SET status="Terminated" WHERE 
                genexpertSN='${values["genexpert"]}' AND location='${values["location"]}'`
            },function(){
                inquireDatabase({
                    "statement":installationStatement(values),
                    "results":function(r){
    
                        inquireDatabase({
                            "statement":`SELECT moduleID FROM module WHERE 
                            serialnumber='${values["serial-number"]}' 
                            AND genexpertSN='${values["genexpert"]}'`,
                            "results":function(res){
                                callback(JSON.parse(JSON.stringify(res))[0]);
    
    
                               
    
                            }
                        });
                    }
                },function(){
                    
                });  
            });

           

        }



        return {installationProcess,checkServiceReportExistProcess,
            checkModuleExistProcess,insertServiceReportProcess,checkGenexpertExistProcess};
    }

    repair(){

    }

    replacement(){

        function searchModuleStatement(lookfor){
            return `SELECT 
            a.genexpertSN AS a_genexpertSN,
            a.serialnumber AS a_moduleSN,
            a.location AS a_location,
            a.dateinstalled AS a_dateinstalled,
            a.revision_number AS a_revision_number,
            a.part_number AS a_part_number,
            a.status AS a_status,
            d.itName AS d_itName,
            e.fullname AS e_fullname,
            c.complete_address AS c_complete_address,
            c.siteName AS c_siteName,
            c.region AS c_region,
            c.province AS c_province,
            c.city AS c_city,
            c.barangay AS c_barangay
            FROM module a
            LEFT JOIN genexpert b ON b.serialnumber = a.genexpertSN
            LEFT JOIN site c ON c.siteID = b.siteID
            LEFT JOIN installationtype d ON d.itID = a.itID
            LEFt JOIN engineer e ON e.engineerID = a.engineerID
            WHERE a.status = "Active" AND
            b.serialnumber LIKE "%${lookfor}%" OR
            c.siteName LIKE "%${lookfor}%" OR
            a.serialnumber LIKE "%${lookfor}%" OR
            c.region LIKE "%${lookfor}%" OR
            c.province LIKE "%${lookfor}%" OR
            c.barangay LIKE "%${lookfor}%" OR
            c.city LIKE "%${lookfor}%" OR
            e.fullname LIKE "%${lookfor}%" OR
            a.location LIKE "%${lookfor}%"`;
        }

        function replaceProcessStatement(data){

            return `
                CALL replaceModule(
                    "${data['previous-serial-number']}",
                    "${data['revision-number']}",
                    "${data['part-number']}",
                    "${data['remarks']}",
                    "${data['location']}",
                    "${data['genexpert']}",
                    "${data['new-serial-number']}",
                    "${data['new-date-installed']}",
                    ${data['new-installation-type']},
                    ${data['new-engineer']},
                    ${acctJSON["online"]['userID']}

                )
            `;

        }

        function findModule(lookfor,callback){

            inquireDatabase({
                "statement":searchModuleStatement(lookfor),
                "results":function(res){
                    const datas = JSON.parse(JSON.stringify(res));
                    callback(datas);

                }
            },function(){});

        }

        function replaceModule(data,callback){
            inquireDatabase({
                "statement":replaceProcessStatement(data),
                "results":function(res){
                    callback();
                }
            },function(){});
        }


        return {findModule,replaceModule};


    }

    transfer(){

    }


}
const moduleTransactionModel = new ModuleTransactionModel();
module.exports = moduleTransactionModel;