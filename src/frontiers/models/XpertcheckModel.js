const Model = require("./Model");
class XpertcheckModel extends Model{
    constructor(){super();}
    
    statements(){

        var self = this;

        function select(options){
            let limit = options["limit"];
            let offset = options["offset"];
            let filter = options["filter"];

            return `SELECT * FROM (SELECT 
            a.xpertcheckID AS a_xpertcheckID,
            a.dateadded AS a_dateadded,
            a.dateupdated AS a_dateupdated,
            a.genexpertSN AS a_genexpertSN,
            a.calibrate_start AS a_calibrate_start,
            a.calibrate_done AS a_calibrate_done,
            b.serialnumber AS b_serialnumber,
            b.dateinstalled AS b_dateinstalled,
            h.siteID AS h_siteID,
            h.siteName AS h_siteName,
            h.complete_address AS h_complete_address,
            h.region AS h_region,
            h.province AS h_province,
            h.city AS h_city,
            h.barangay AS h_barangay,
            h.street AS h_street,
            c.fullname AS c_fullname,
            d.itName AS d_itName,
            e.mnName AS e_mnName,
            CONCAT(f.firstname,' ',f.lastname) AS f_addedby,
            CONCAT(g.firstname,' ',g.lastname) AS g_updatedby,
            i.fullname AS i_fullname,
            i.engineerID AS i_engineerID,
            (CURRENT_DATE = a.calibrate_done) AS onStatus
            FROM xpertcheck a
            LEFT JOIN genexpert b ON b.serialnumber = a.genexpertSN
                LEFT JOIN engineer c ON c.engineerID = b.engineerID
                LEFT JOIN installationtype d ON d.itID = b.itID 
                LEFT JOIN modelnumber e ON e.mnID = b.mnID 
                LEFT JOIN user f ON f.userID = b.addedby
                LEFT JOIN user g ON g.userID = b.updatedby
                LEFT JOIN site h ON h.siteID = b.siteID 
            LEFT JOIN engineer i ON i.engineerID = a.engineerID
            LEFT JOIN user j ON j.userID = a.addedby
            LEFT JOIN user k ON k.userID = a.updatedby 
            WHERE 1 = 1 ${filter}) xxx 
            ORDER BY xxx.a_calibrate_done ASC LIMIT ${limit} OFFSET ${offset}`;

        }

        function getRecords(filter=""){
            return `SELECT 
            a.recordID AS a_recordID,
            a.xpertcheckID AS a_xpertcheckID,
            a.dateofrecord AS a_dateofrecord,
            a.genexpertSN AS a_genexpertSN,
            a.calibrate_start AS a_calibrate_start,
            a.calibrate_done AS a_calibrate_done,
            a.engineerID AS a_engineerID,
                b.engineerID AS b_engineerID,
                b.fullname AS b_fullname,
            a.addedby AS a_addedby,
                c.userID AS c_userID, 
                c.firstname AS c_firstname,
                c.lastname AS c_lastname,
                c.email AS c_email,
                c.contactnumber AS c_contactnumber,
            a.updatedby AS a_updatedby,
                d.userID AS d_userID, 
                d.firstname AS d_firstname,
                d.lastname AS d_lastname,
                d.email AS d_email,
                d.contactnumber AS d_contactnumber,
            a.dateadded AS a_dateadded,
            a.dateupdated AS a_dateupdated,
            a.record_action AS a_record_action,
            a.record_remarks AS a_record_remarks
            FROM xpertcheck_record a
            LEFT JOIN engineer b ON b.engineerID = a.engineerID 
            LEFT JOIN user c ON c.userID = a.addedby
            LEFT JOIN user d ON d.userID = a.updatedby
            WHERE 1=1 ${filter} ORDER BY a.dateofrecord DESC `;
        }

        function getDatas(condition){
            return `SELECT *, a.calibrate_start,a.calibrate_done,b.fullname,
            CONCAT(c.firstname," ",c.lastname) AS addedby,
            CONCAT(d.firstname," ",d.lastname) AS updatedby 
            FROM xpertcheck a 
            LEFT JOIN engineer b ON b.engineerID = a.engineerID
            LEFT JOIN user c ON c.userID = a.addedby 
            LEFT JOIN user d ON d.userID = a.updatedby 
            WHERE 1=1 ${condition} ORDER BY calibrate_done DESC`;
        }

        function getFilterDatas(condition){
            return `
            SELECT a.dateadded,a.dateupdated,a.genexpertSN,
            "Current" AS stat,
            a.calibrate_start,a.calibrate_done,b.fullname,
            CONCAT(c.firstname," ",c.lastname) AS addedby,
            CONCAT(d.firstname," ",d.lastname) AS updatedby 
            FROM xpertcheck a
            LEFT JOIN engineer b ON b.engineerID = a.engineerID 
            LEFT JOIN user c ON c.userID = a.addedby 
            LEFT JOIN user d ON d.userID = a.updatedby
            WHERE 1=1 ${condition}
            UNION ALL
            
            SELECT a.dateadded,a.dateupdated,a.genexpertSN,
            "Previous" AS stat,
            a.calibrate_start,a.calibrate_done,b.fullname,
            CONCAT(c.firstname," ",c.lastname) AS addedby,
            CONCAT(d.firstname," ",d.lastname) AS updatedby  
            FROM xpertcheck_record a
            LEFT JOIN engineer b ON b.engineerID = a.engineerID 
            LEFT JOIN user c ON c.userID = a.addedby 
            LEFT JOIN user d ON d.userID = a.updatedby
            WHERE 1=1 ${condition}
            ORDER BY genexpertSN,dateadded DESC
            `;
        }

        function insert(values){
            return `CALL scheduleXpertcheck(
                "${values['serial-number']}",
                "${values['new-start-calibration']}",
                "${values['new-next-calibration']}",
                "${values['calibrate-by']}",
                ${self.acctJSON["online"]['userID']},
                ${self.acctJSON["online"]['userID']},
                ${self.getTransID()}
            )`;
        }

        function getLastXpertcheckBasedGenexpertSN(serialnumber){
            return `SELECT calibrate_start,calibrate_done  
            FROM xpertcheck WHERE genexpertSN="${serialnumber}"`;
        }

        function updateXpertcheck(options){

            let sets = [];
            let remarks = "";
            options['calibrate-start'] != "" ? sets.push(options['calibrate-start']):"";
            options['calibrate-done']  != "" ? sets.push(options['calibrate-done']):"";
            options['engineer']  != "" ? sets.push(options['engineer']):"";
            if(options['record-remarks'].length != 0){
                options['record-remarks'].forEach((d,i)=>{
                    if(i == 0){
                        remarks += d;
                    }else{
                        if(d){
                            remarks += ` and ${d}`
                        }
                        
                    }
                });
                sets.push(`record_remarks="${remarks}"`);
            }

            sets.push(`last_transaction="${options['last-transaction']}"`);

            let sets_statement = "";
            sets.forEach((d,i)=>{
                if(i == 0){
                    sets_statement += `${d}`;
                }else{
                    sets_statement += `,${d}`;
                }
            });

            return `UPDATE xpertcheck SET ${sets_statement} 
            WHERE genexpertSN="${options['genexpert']}"`;



        }

        function multiInsertExcelBased(datas){
            
            const statements = [];
            datas.forEach(data => {

                if(data['xpertcheck-date'] != "" || data['xpertcheck-date'] != "-"){

                    // console.log(data['pm-date']);

                    let dueDate = addTime("year",1,data['xpertcheck-date']);

                    if(data['xpertcheck-frequency']+"".toLowerCase() == "annually"){
                        dueDate = addTime("year",1,data['xpertcheck-date']);
                    }
                    if(data['xpertcheck-frequency']+"".toLowerCase() == "semi-annually"){
                        dueDate = addTime("month",6,data['xpertcheck-date']);
                    }
                    if(data['xpertcheck-frequency']+"".toLowerCase() == "quarterly"){
                        dueDate = addTime("month",3,data['xpertcheck-date']);
                    }
                    // "${data['done-by']}"

                    if(data['genexpert-serial-number'] != "" 
                    && data['genexpert-serial-number'] != undefined
                    && data['xpertcheck-date'] != "NaN-NaN-NaN" && dueDate !="NaN-NaN-NaN"){
                        
                        statements.push(`CALL schedulePM(
                            "${data['genexpert-serial-number']}",
                            "${data['xpertcheck-date']}",
                            "${dueDate}",
                            1,
                            ${self.acctJSON["online"]['userID']},
                            ${self.acctJSON["online"]['userID']}
                        )`);
                    }
                   
                }

            });

            return statements;
            
        }

        function getAllXpertcheck(condition=""){

            return `
            SELECT a.dateadded,a.dateupdated,a.genexpertSN,
            "Current" AS stat,
            a.calibrate_start,a.calibrate_done,b.fullname,
            CONCAT(c.firstname," ",c.lastname) AS addedby,
            CONCAT(d.firstname," ",d.lastname) AS updatedby 
            FROM xpertcheck a
            LEFT JOIN engineer b ON b.engineerID = a.engineerID 
            LEFT JOIN user c ON c.userID = a.addedby 
            LEFT JOIN user d ON d.userID = a.updatedby
            
            
            UNION ALL
            
            SELECT a.dateadded,a.dateupdated,a.genexpertSN,
            "Previous" AS stat,
            a.calibrate_start,a.calibrate_done,b.fullname,
            CONCAT(c.firstname," ",c.lastname) AS addedby,
            CONCAT(d.firstname," ",d.lastname) AS updatedby  
            FROM xpertcheck_record a
            LEFT JOIN engineer b ON b.engineerID = a.engineerID 
            LEFT JOIN user c ON c.userID = a.addedby 
            LEFT JOIN user d ON d.userID = a.updatedby
            
            ORDER BY genexpertSN,dateadded DESC`;
        }

        return {select,insert,getLastXpertcheckBasedGenexpertSN,getDatas,getRecords,
            updateXpertcheck,multiInsertExcelBased,getAllXpertcheck,getFilterDatas};
    }
    process(){
        var self = this;
        function select(options,callback){
            self.inquireDatabase({
                "statement":self.statements().select(options),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));

                }

             });
        }

        function insert(values,callback){
            self.inquireDatabase({
                "statement":self.statements().insert(values),
                "results":function(r){
                    self.inquireDatabase({
                        "statement":`SELECT MAX(xpertcheckID) AS xpckID FROM xpertcheck`,
                        "results":function(res){
                            callback(JSON.parse(JSON.stringify(res))[0]);
                            

                        }
                    });
                }
            });
        }

        function getTotalProcess(callback){
            self.inquireDatabase({
                "statement":`SELECT count(xpertcheckID) AS total 
                FROM xpertcheck WHERE 1=1`,
                "results":function(res){
                  callback(JSON.parse(JSON.stringify(res)));
                }
            },function(){});
        }

        function getLastXpertcheckBasedGenexpertSN(serialnumber,callback){

            self.inquireDatabase({
                "statement":self.statements().getLastXpertcheckBasedGenexpertSN(serialnumber),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));

                }

             });
        }

        function getDatas(condition,callback){

            
            self.inquireDatabase({
                "statement":self.statements().getDatas(condition),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));

                }

             });

        }

        function getRecords(filter,callback){
            self.inquireDatabase({
                "statement":self.statements().getRecords(filter),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));

                }

             });
        }

        function updateXpertcheck(options,callback){

            self.inquireDatabase({
                "statement":self.statements().updateXpertcheck(options)
             },callback);
        }

        function insertMultiExcelProcess(datas,count,callback){

            const statements = self.statements().multiInsertExcelBased(datas);

            $(".ldg-box-01 > h3").html(`Preventive Maintenance Process 
            ${Math.ceil((count/statements.length)* 100)}%`);

            if(count < statements.length){

                self.inquireDatabase({
                    "statement":statements[count]
                },function(){
                    count++;
                    insertMultiExcelProcess(datas,count,callback);

                })

            }else{
                callback();
            }

        }

        function getAllXpertcheck(callback){
            self.inquireDatabase({
                "statement":self.statements().getAllXpertcheck(),
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

        return {select,insert,getLastXpertcheckBasedGenexpertSN
            ,getTotalProcess,getDatas,getRecords,updateXpertcheck,
            getAllXpertcheck,getFilterDatas};
    }
}
const xpertcheckModel = new XpertcheckModel();
module.exports = xpertcheckModel;