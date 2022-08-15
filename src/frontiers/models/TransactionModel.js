const transactionView = require("../views/TransactionView");
const Model = require("./Model");

class TransactionModel extends Model{
    constructor(){
        super();
    }

    statements(){
        var self = this;
        function insert(){


            const data = transactionView.getMainTransactDatas();
            const services = transactionView.getChooseServices().join(",");
            return `INSERT INTO transactions(facility,department,
                equipment,model,serialnumber,typeofService,
                sub_transID,need_service_report,sc_number,
                connect_jotform,jotform_ticketNo,transactby) 
                VALUES(
                    "${data['facility-site']}",
                    "${data['department']}",
                    "${data['equipment']}",
                    "${data['model-number']}",
                    "${data['serial-number']}",
                    "${services}",
                    ${data['sub-transaction-id']},
                    ${data['need-service-report']},
                    "${data['service-report-number']}",
                    ${data['connect-jotform']},
                    "${data['jotform-ticket-no']}",
                    ${self.acctJSON["online"]['userID']}
                )`;
        }

        function select(){

            const filter = "";

            return `SELECT transID,transDate,facility,department,
            equipment,model,serialnumber,typeofService,
            sub_transID,need_service_report,sc_number,
            connect_jotform,jotform_ticketNo,transactby FROM transactions 
            WHERE 1=1 ${filter} ORDER BY transID ASC`;
        }

        function getTotal(filter=""){
            return `SELECT COUNT(*) AS transTotal 
            FROM transactions a
            LEFT JOIN genexpert b ON b.serialnumber = a.serialnumber
                LEFT JOIN site b_a ON b_a.siteID = b.siteID
                    LEFT JOIN contact b_a_a ON b_a_a.siteID = b_a.siteID 
                LEFT JOIN engineer b_b ON b_b.engineerID = b.engineerID 
                LEFT JOIN installationtype b_c ON b_c.itID = b.itID 
                LEFT JOIN modelnumber b_d ON b_d.mnID = b.mnID
            LEFT JOIN service_report c ON c.service_report_num = a.sc_number
            LEFT JOIN jotform_assistance d ON d.ticket_no = a.jotform_ticketNo 
            LEFT JOIN user e ON e.userID = a.transactby 
            WHERE 1=1 ${filter}`;
        }

        function selectAll(filter,limit,offset){

            const transFilter = filter;
            const limitOffset = `LIMIT ${limit} OFFSET ${offset}`;

            return `SELECT 
            a.transID,
            a.transDate,
            a.serialnumber,
            a.facility,
            a.typeofService,
            a.need_service_report,
            a.sc_number,
            a.connect_jotform,
            a.jotform_ticketNo,
            a.transactby,
            b.serialnumber AS genexpert_serialnumber,
            b.dateinstalled,
            b_a.siteName,
            b_a.region,
            b_a.province,
            b_a.city,
            b_a.barangay,
            b_a.street,
            b_a_a.fullname AS contactname,
            b_a_a.position AS contactposition,
            b_a_a.contactnumber AS contactnumber,
            b_a_a.email AS contactemail,
            b_b.fullname AS engineerName,
            b_c.itName,
            b_d.mnID,
            b_d.mnName,
            c.service_report_num,
            c.equipment AS sr_equipment,
            c.department AS sr_department,
            c.telno AS sr_telno,
            c.problems_reported AS sr_problems_reported,
            c.diagnostic_findings AS sr_diagnostic_findings,
            c.corrective_action AS sr_corrective_action,
            c.comments AS sr_comments,
            CONCAT(e.firstname,' ',e.lastname) AS transBy,
            d.*
            FROM transactions a 
            LEFT JOIN genexpert b ON b.serialnumber = a.serialnumber
                LEFT JOIN site b_a ON b_a.siteID = b.siteID
                    LEFT JOIN contact b_a_a ON b_a_a.siteID = b_a.siteID 
                LEFT JOIN engineer b_b ON b_b.engineerID = b.engineerID 
                LEFT JOIN installationtype b_c ON b_c.itID = b.itID 
                LEFT JOIN modelnumber b_d ON b_d.mnID = b.mnID
            LEFT JOIN service_report c ON c.service_report_num = a.sc_number
            LEFT JOIN jotform_assistance d ON d.ticket_no = a.jotform_ticketNo 
            LEFT JOIN user e ON e.userID = a.transactby
            WHERE 1=1 ${transFilter} ORDER BY a.transID DESC ${limitOffset}`;
        }

        return {insert,select,selectAll,getTotal};
    }

    process(){

        var self = this;
        function select(callback){

            self.inquireDatabase({
                "statement":self.statements().select(),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }

        function insert(callback){
            self.inquireDatabase({
                "statement":self.statements().insert(),
                "results":function(res){
                    callback(res);
                }
            });
        }

        function selectAll(filter,limit,offset,callback){
            self.inquireDatabase({
                "statement":self.statements().selectAll(filter,limit,offset),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }

        function getTotal(filter="",callback){
            self.inquireDatabase({
                "statement":self.statements().getTotal(filter),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }

        return {select,insert,selectAll,getTotal};
    }



}
const transactionModel = new TransactionModel();
module.exports = transactionModel;