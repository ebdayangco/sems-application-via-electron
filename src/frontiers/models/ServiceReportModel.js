const serviceReportView = require("../views/ServiceReportView");
const Model = require("./Model");
class ServiceReportModel extends Model{
    constructor(){super();}
    statements(){

        var self = this;

        function checkExist(servicereportnum){
            return `SELECT service_report_num FROM service_report 
                    WHERE service_report_num="${servicereportnum}"`;
        }

        function insert(transID){

            const fileObj = $("#service_report_full_location").data("file");
            const data = serviceReportView.getEntryDatas();
        
            return `INSERT INTO 
            service_report(service_report_num,
                service_type,transact_id,addedby,updatedby,filename,fileobject,
                problems_reported,diagnostic_findings,corrective_action,comments,
                genexpert_serial_number,equipment,modelnumber,facility,department,
                telno,engineerID,customer_name,engineer_sign_date,customer_sign_date)
            VALUES(
                "${data['service-report-number']}",
                "${data['service-type']}",
                "${transID}",
                ${self.acctJSON["online"]['userID']},
                ${self.acctJSON["online"]['userID']},
                "${data['service-type']}_${transID}",
                LOAD_FILE("${fileObj}"),
                "${data['problems-reported']}",
                "${data['diagnostic-findings']}",
                "${data['corrective-action']}",
                "${data['comments']}",
                "${data['genexpert-serial-number']}",
                "${data['equipment']}",
                "${data['model-number']}",
                "${data['facility']}",
                "${data['department']}",
                "${data['tel-no']}",
                ${data['engineer-name']},
                "${data['customer-name']}",
                "${data['engineer-sign-date']}",
                "${data['customer-sign-date']}")`;
             
        }

        function getDatas(genexpertSN){
            return `SELECT * FROM service_report a
            LEFT JOIN user b ON b.userID = a.addedby 
            WHERE for_what="genexpert" AND 
            particular_id=(SELECT genexpertID FROM genexpert WHERE 
                serialnumber='${genexpertSN}' LIMIT 1)
            UNION ALL
            SELECT * FROM service_report a 
            LEFT JOIN user b ON b.userID = a.addedby 
            WHERE for_what="module" AND 
            particular_id IN(SELECT moduleID FROM module WHERE genexpertSN='${genexpertSN}')
            UNION ALL
            SELECT * FROM service_report a 
            LEFT JOIN user b ON b.userID = a.addedby 
            WHERE for_what="xpertcheck" AND 
            particular_id IN(SELECT xpertcheckID FROM xpertcheck WHERE genexpertSN='${genexpertSN}')
            UNION ALL
            SELECT * FROM service_report a 
            LEFT JOIN user b ON b.userID = a.addedby 
            WHERE for_what="preventive-maintenance" AND 
            particular_id IN(SELECT xpertcheckID FROM xpertcheck WHERE genexpertSN='${genexpertSN}')`;
        }

        function getAllServiceReport(filter){
            return `SELECT 
            a.*,b.*,c.*,d.*,a.facility AS facilitySR,d.engineerID AS engineerSR  
            FROM service_report a
            LEFT JOIN genexpert b ON b.serialnumber = a.genexpert_serial_number 
            LEFT JOIN transactions c ON c.transID = a.transact_id  
            LEFT JOIN engineer d ON d.engineerID = a.engineerID  
            WHERE 1=1 ${filter}
            ORDER BY date_added DESC`;
        }

        function getFilterDatas(condition){
            return `SELECT * FROM service_report
            WHERE 1=1 ${condition} 
            ORDER BY genexpert_serial_number,date_added DESC`;
        }

        function getTotalServiceReport(filter){

            return `SELECT COUNT(*) AS total  FROM service_report a
            LEFT JOIN genexpert b ON b.serialnumber = a.genexpert_serial_number
            LEFT JOIN modelnumber c ON c.mnID = a.modelnumber 
            LEFT JOIN transactions d ON d.transID = a.transact_id 
            LEFT JOIN user e ON e.userID = a.addedby 
            LEFT JOIN user f ON f.userID = a.updatedby 
            LEFT JOIN engineer g ON g.engineerID = a.engineerID 
            WHERE 1=1 ${filter}`;

        }

        function getServiceReport(filter="",limit=50,offset=0){

            let limitStatement =  limit ?`LIMIT ${limit}`:'';
            let offsetStatement =  offset ?` OFFSET ${offset}`:'';
            let orderStatement = limit != null && offset != null ? 
            ` ORDER BY a.date_added DESC `:'';

            return `
                SELECT a.*,a.engineerID AS engineerSR,a.facility AS facilitySR,
            b.*,c.*,
            d.*,e.*,f.*,g.fullname FROM service_report a
            LEFT JOIN genexpert b ON b.serialnumber = a.genexpert_serial_number
            LEFT JOIN modelnumber c ON c.mnID = a.modelnumber 
            LEFT JOIN transactions d ON d.transID = a.transact_id 
            LEFT JOIN user e ON e.userID = a.addedby 
            LEFT JOIN user f ON f.userID = a.updatedby 
            LEFT JOIN engineer g ON g.engineerID = a.engineerID

            WHERE 1=1 ${filter} ${orderStatement} 
            ${limitStatement} ${offsetStatement}`;

        }

        function getServiceReportforGenexpertInfo(sn){

            return `
                SELECT a.*,a.engineerID AS engineerSR,a.facility AS facilitySR,
            b.*,c.*,
            d.*,e.*,f.*,g.fullname FROM service_report a
            LEFT JOIN genexpert b ON b.serialnumber = a.genexpert_serial_number
            LEFT JOIN modelnumber c ON c.mnID = a.modelnumber 
            LEFT JOIN transactions d ON d.transID = a.transact_id 
            LEFT JOIN user e ON e.userID = a.addedby 
            LEFT JOIN user f ON f.userID = a.updatedby 
            LEFT JOIN engineer g ON g.engineerID = a.engineerID
            WHERE a.genexpert_serial_number="${sn}" ORDER BY a.date_added DESC`;

        }

        return {checkExist,insert,getDatas,getAllServiceReport,getFilterDatas,
            getTotalServiceReport,getServiceReport,getServiceReportforGenexpertInfo};
    }

    process(){

        var self = this;

        function checkExist(servicereportnum,ifexist,ifnotexist){
            self.inquireDatabase({
                "statement":self.statements().checkExist(servicereportnum),
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

        function insert(transID,callback){

            self.inquireDatabase({
                "statement":self.statements().insert(transID)
            },callback);
        }

        function getDatas(genexpertSN,callback){

            self.inquireDatabase({
                "statement":self.statements().getDatas(genexpertSN),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));

                }

             });

        }

        function getAllServiceReport(filter,callback){

            self.inquireDatabase({
                "statement":self.statements().getAllServiceReport(filter),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));

                }

             });

        }

        function getFilterDatas(condition,callback){

            self.inquireDatabase({
                "statement":self.statements().getFilterDatas(condition),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));

                }

             });

        }

        function getServiceReportforGenexpertInfo(sn,callback){

            self.inquireDatabase({
                "statement":self.statements().getServiceReportforGenexpertInfo(sn),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }

             });

        }

        function getServiceReport(filter="",limit=50,offset=0,callback){

            self.inquireDatabase({
                "statement":self.statements().getServiceReport(filter,limit,offset),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));

                }

             });

        }

        function getTotalServiceReport(filter="",callback){

            self.inquireDatabase({
                "statement":self.statements().getTotalServiceReport(filter),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));

                }

             });

        }

        return {checkExist,insert,getDatas,getAllServiceReport,getFilterDatas,getServiceReport,
        getTotalServiceReport,getServiceReportforGenexpertInfo};
    }
}
const serviceReportModel = new ServiceReportModel();
module.exports = serviceReportModel;