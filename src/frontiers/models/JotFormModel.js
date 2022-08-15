const Model = require("./Model");
class JotFormModel extends Model{
    constructor(){
        super();
    }

    statements(){

        function insertSubmission_assistance(datas){
            return `
               INSERT INTO jotform_assistance(
                form_id,
                submission_id,
                submission_date,
                ticket_no,
                account_hospital,
                department,
                end_user,
                email,
                contact_number,
                date_of_incident,
                time_of_incident,
                model_of_genexpert,
                instrument_serial_number,
                type_of_concern,
                description_of_concern,
                module_sn_hardware,
                kind_cartridge_cartridge,
                quantity_damage_problem_cartridge,
                lot_no_in_box,
                ticket_status)
                VALUES${datas}
                `;

        }

        function insertSubmission_reporting(datas){
            return `
               INSERT INTO jotform_reporting(
                form_id,
                submission_id,
                submission_date,
                ticket_no,
                facility_region,
                facility_name,
                ticketStatus,
                reportedBy,
                reporter_cnum,
                reporter_email,
                model_genexpert,
                genexpert_serial_number,
                module_all_pass_xpertcheck,
                type_report,
                date_problem_encountered,
                type_of_problem_encountered,
                concerned_modules,
                type_genexpert_accessory,
                genexpert_cpu_sn,
                genexpert_laptop_sn,
                genexpert_monitor_sn,
                genexpert_barcode_scanner_sn)
                VALUES${datas}
                `;

        }

        function groupFindSubmissions_reporting(ticketNos){

            return `SELECT * FROM (${ticketNos}) xxx
            WHERE xxx.ticket_no NOT IN(SELECT ticket_no FROM jotform_reporting)`;

        }

        function groupFindSubmissions_assistance(ticketNos){
            return `SELECT * FROM (${ticketNos}) xxx
            WHERE xxx.ticket_no NOT IN(SELECT ticket_no FROM jotform_assistance)`;
        }

        function getTotalSubmission(filter =""){
            return `SELECT count(jotform_id) AS total FROM jotform_assistance 
            WHERE 1=1 ${filter}`;
        }

        function getAllSubmissions(){
            return `SELECT * FROM jotform`;
        }

        function getSubmissionsAssistance(filter ="",limit=50,offset=0){

              
            let limitStatement =  limit ?`LIMIT ${limit}`:'';
            let offsetStatement =  offset ?` OFFSET ${offset}`:'';
            let orderStatement = limit != null && offset != null ? 
            'ORDER BY submission_date DESC ,ticket_no':"";


            return `SELECT * FROM jotform_assistance a
            LEFT JOIN genexpert b ON b.serialnumber = a.instrument_serial_number
            LEFT JOIN engineer c ON c.engineerID = b.engineerID 
            LEFT JOIN installationtype d ON d.itID = b.itID 
            LEFT JOIN modelnumber e ON e.mnID = b.mnID
            WHERE 1=1 ${filter} ${orderStatement} 
            ${limitStatement} ${offsetStatement}`;
        }
        
        function getAllReportingSubmissions(filter=""){

       
            let orderStatement = 'ORDER BY submission_date DESC ,ticket_no';


            return `SELECT * FROM jotform_reporting a
            LEFT JOIN genexpert b ON b.serialnumber = a.genexpert_serial_number
            LEFT JOIN engineer c ON c.engineerID = b.engineerID 
            LEFT JOIN installationtype d ON d.itID = b.itID 
            LEFT JOIN modelnumber e ON e.mnID = b.mnID
            WHERE 1=1 ${filter} ${orderStatement}`;
        }

        function getAllAssistanceSubmissions(filter =""){

              
            let orderStatement = 'ORDER BY submission_date DESC ,ticket_no';

            // console.log(`SELECT * FROM jotform_assistance a
            // LEFT JOIN genexpert b ON b.serialnumber = a.instrument_serial_number
            // LEFT JOIN engineer c ON c.engineerID = b.engineerID 
            // LEFT JOIN installationtype d ON d.itID = b.itID 
            // LEFT JOIN modelnumber e ON e.mnID = b.mnID
            // WHERE 1=1 ${filter} ${orderStatement}`);

            return `SELECT * FROM jotform_assistance a
            LEFT JOIN genexpert b ON b.serialnumber = a.instrument_serial_number
            LEFT JOIN engineer c ON c.engineerID = b.engineerID 
            LEFT JOIN installationtype d ON d.itID = b.itID 
            LEFT JOIN modelnumber e ON e.mnID = b.mnID
            WHERE 1=1 ${filter} ${orderStatement}`;
        }

        function getSubmissionsReporting(filter ="",limit=50,offset=0){

              
            let limitStatement =  limit ?`LIMIT ${limit}`:'';
            let offsetStatement =  offset ?` OFFSET ${offset}`:'';
            let orderStatement = limit != null && offset != null ? 
            'ORDER BY submission_date DESC ,ticket_no':"";
            
            return `SELECT * FROM jotform_reporting a
            LEFT JOIN genexpert b ON b.serialnumber = a.genexpert_serial_number
            LEFT JOIN engineer c ON c.engineerID = b.engineerID 
            LEFT JOIN installationtype d ON d.itID = b.itID 
            LEFT JOIN modelnumber e ON e.mnID = b.mnID
            WHERE 1=1 ${filter} ${orderStatement} 
            ${limitStatement} ${offsetStatement}`;
        }

        function getTotalSubmissionsAssistance(filter=""){
            return `SELECT COUNT(*) AS jotform_total FROM jotform_assistance a  
            LEFT JOIN genexpert b ON b.serialnumber = a.instrument_serial_number
            LEFT JOIN engineer c ON c.engineerID = b.engineerID 
            LEFT JOIN installationtype d ON d.itID = b.itID 
            LEFT JOIN modelnumber e ON e.mnID = b.mnID 
            WHERE 1=1 ${filter}`;
        }

        function getTotalSubmissionsReporting(filter=""){
            return `SELECT COUNT(*) AS jotform_total FROM jotform_reporting a  
            LEFT JOIN genexpert b ON b.serialnumber = a.genexpert_serial_number
            LEFT JOIN engineer c ON c.engineerID = b.engineerID 
            LEFT JOIN installationtype d ON d.itID = b.itID 
            LEFT JOIN modelnumber e ON e.mnID = b.mnID 
            WHERE 1=1 ${filter}`;
        }

        function findSubmissionByMachineSN(sn){
            return `SELECT * FROM(
                SELECT ticket_no,ticket_status as status,
                instrument_serial_number as instrument_serial_number 
                FROM jotform_assistance 
                UNION ALL 

                SELECT ticket_no,ticketStatus as status,
                genexpert_serial_number as instrument_serial_number 
                FROM jotform_reporting
            ) xxx WHERE 1=1 AND instrument_serial_number LIKE "%${sn}%" 
            `;
        }

        return {insertSubmission_assistance,insertSubmission_reporting,
            groupFindSubmissions_reporting,groupFindSubmissions_assistance,
            getSubmissionsReporting,getSubmissionsAssistance,getTotalSubmission,
            getAllSubmissions,findSubmissionByMachineSN,getTotalSubmissionsAssistance,
            getTotalSubmissionsReporting,getAllAssistanceSubmissions,getAllReportingSubmissions};

    }

    process(){

        var self = this;

        function insertSubmission_assistance(datas,callback){
            self.inquireDatabase({
                "statement":self.statements().insertSubmission_assistance(datas)},callback);
        }

        function insertSubmission_reporting(datas,callback){
            self.inquireDatabase({
                "statement":self.statements().insertSubmission_reporting(datas)},callback);
        }

        function groupFindSubmissions_assistance(ticketNos,callback){

            self.inquireDatabase({
                "statement":self.statements().groupFindSubmissions_assistance(ticketNos),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });

        }

        function groupFindSubmissions_reporting(ticketNos,callback){

            self.inquireDatabase({
                "statement":self.statements().groupFindSubmissions_reporting(ticketNos),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });

        }
        // function getTotalSubmission(filter,callback){
        //     self.inquireDatabase({
        //         "statement":self.statements().getTotalSubmission(filter),
        //         "results":function(res){
        //             callback(JSON.parse(JSON.stringify(res)));
        //         }
        //     });
        // }
        function getAllAssistanceSubmissions(filter="",callback){
            self.inquireDatabase({
                "statement":self.statements().getAllAssistanceSubmissions(filter),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }


        function getSubmissionsAssistance(options,callback){
            self.inquireDatabase({
                "statement":self.statements().getSubmissionsAssistance(
                    options['filter'],options['limit'],options['offset']),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }

        function getAllReportingSubmissions(filter,callback){
            self.inquireDatabase({
                "statement":self.statements().getAllReportingSubmissions(filter),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }

        function getSubmissionsReporting(options,callback){
            self.inquireDatabase({
                "statement":self.statements().getSubmissionsReporting(
                    options['filter'],options['limit'],options['offset']),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }

        function getTotalSubmissionsAssistance(options,callback){

            self.inquireDatabase({
                "statement":self.statements().getTotalSubmissionsAssistance(options['filter']),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }

        function getTotalSubmissionsReporting(options,callback){

            self.inquireDatabase({
                "statement":self.statements().getTotalSubmissionsReporting(options['filter']),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }



        function getAllSubmissions(callback){
            self.inquireDatabase({
                "statement":self.statements().getAllSubmissions(),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }



        function findSubmissionByMachineSN(sn,callback){
            self.inquireDatabase({
                "statement":self.statements().findSubmissionByMachineSN(sn),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }
        return {insertSubmission_assistance,insertSubmission_reporting,
            groupFindSubmissions_assistance,
            getTotalSubmissionsAssistance,getTotalSubmissionsReporting,
            groupFindSubmissions_reporting,getSubmissionsAssistance,
            getSubmissionsReporting,getAllSubmissions,
            findSubmissionByMachineSN,getAllReportingSubmissions,
            getAllAssistanceSubmissions};
    }
}
const jotformModel = new JotFormModel();
module.exports = jotformModel;