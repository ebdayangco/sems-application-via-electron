const { addTime } = require("../../supporters/sections/RequestSection");
const Model = require("./Model");
class PreventiveMaintenanceModel extends Model{
    constructor(){super();}

    statements(){

        var self = this;
    
        function insert(values){
            return `CALL schedulePM(
                "${values['serial-number']}",
                "${values['new-start-maintenance']}",
                "${values['new-next-maintenance']}",
                "${values['maintenance-by']}",
                ${self.acctJSON["online"]['userID']},
                ${self.acctJSON["online"]['userID']},
                ${self.getTransID()}
            )`;
        }
        function multiInsertExcelBased(datas){
            
            const statements = [];
            datas.forEach(data => {

                if(data['pm-date'] != "" || data['pm-date'] != "-"){

                    // console.log(data['pm-date']);

                    let dueDate = addTime("year",1,data['pm-date']);

                    if(data['pm-frequency']+"".toLowerCase() == "annually"){
                        dueDate = addTime("year",1,data['pm-date']);
                    }
                    if(data['pm-frequency']+"".toLowerCase() == "semi-annually"){
                        dueDate = addTime("month",6,data['pm-date']);
                    }
                    if(data['pm-frequency']+"".toLowerCase() == "quarterly"){
                        dueDate = addTime("month",3,data['pm-date']);
                    }
                    // "${data['done-by']}"

                    if(data['genexpert-serial-number'] != "" 
                    && data['genexpert-serial-number'] != undefined
                    && data['pm-date'] != "NaN-NaN-NaN" && dueDate !="NaN-NaN-NaN"){



                        const engineers = JSON.parse(localStorage.getItem('engineers'));
                        const engineerFound = data['done-by'] ?data['done-by'].toLowerCase():'';

                        let engineer = engineers.filter((v)=>{
                            const fullname = v['fullname'].toLowerCase();
                            if(fullname == engineerFound){
                                return true;
                            }else{
                                return fullname.includes(engineerFound);
                            }
                        });

                        engineer = engineer.length == 0 ? 0:engineer[0]['engineerID'];
                        
                        statements.push(`CALL schedulePM(
                            "${data['genexpert-serial-number']}",
                            "${data['pm-date']}",
                            "${dueDate}",
                            ${engineer},
                            ${self.acctJSON["online"]['userID']},
                            ${self.acctJSON["online"]['userID']}
                        )`);
                    }
                   
                }

            });

            return statements;
            
        }
        function getLastPMBasedGenexpertSN(serialnumber){
            return `SELECT calibrate_start,calibrate_done 
            FROM preventive_maintenance WHERE genexpertSN="${serialnumber}"`;
        }

        function select(options){

            let limit = options["limit"];
            let offset = options["offset"];
            let filter = options["filter"];

            // return `SELECT
            //     a.genexpertSN AS a_genexpertSN,
            //     a.engineerID AS a_engineerID, 
            //     aa.pmID AS aa_xpertcheckID,
            //     aa.dateadded AS aa_dateadded,
            //     aa.dateupdated AS aa_dateupdated,
            //     aa.genexpertSN AS aa_genexpertSN,
            //     aa.calibrate_start AS aa_calibrate_start,
            //     aa.calibrate_done AS aa_calibrate_done,
            //     aa.engineerID AS aa_engineerID,
            //     aa.addedby AS aa_addedby,
            //     aa.updatedby AS aa_updatedby,
            //     aa.current_pm AS aa_current_pm,
            //     b.dateadded AS b_dateadded,
            //     b.dateupdated AS b_dateupdated,
            //     b.serialnumber AS b_serialnumber,
            //     b.engineerID AS b_engineerID,
            //     b.dateinstalled AS b_dateinstalled,
            //     b.itID AS b_itID,
            //     b.mnID AS b_mnID,
            //     b.siteID AS b_siteID,
            //     b.software_version AS b_software_version,
            //     b.os_version AS b_os_version,
            //     b.warranty_expiry_date AS b_warranty_expiry_date,
            //     b.service_contract_expiry_date AS b_service_contract_expiry_date,
            //     b.status AS b_status,
            //     b.remarks AS b_remarks,
            //     b.addedby AS b_addedby,
            //     b.updatedby AS b_updatedby,
            //     ba.siteID AS ba_siteID,
            //     ba.siteName AS ba_siteName,
            //     ba.complete_address AS ba_complete_address,
            //     ba.region AS ba_region,
            //     ba.province AS ba_province,
            //     ba.city AS ba_city,
            //     ba.barangay AS ba_barangay,
            //     ba.street AS ba_street,
            //     ba.latitude AS ba_latitude,
            //     ba.longitude AS ba_longitude,
            //     bb.moduleID AS bb_moduleID,
            //     bb.dateadded AS bb_dateadded,
            //     bb.dateupdated AS bb_dateupdated,
            //     bb.genexpertSN AS bb_genexpertSN,
            //     bb.serialnumber AS bb_serialnumber,
            //     bb.revision_number AS bb_revision_number,
            //     bb.part_number AS bb_part_number,
            //     bb.status AS bb_status,
            //     bb.addedby AS bb_addedby,
            //     bb.updatedby AS bb_updatedby,
            //     bb.location AS bb_location,
            //     bb.dateinstalled AS bb_dateinstalled,
            //     bb.itID AS bb_itID,
            //     bb.engineerID AS bb_engineerID,
            //     c.fullname AS c_fullname,
            //     c.active AS c_active,
            //     bc.fullname AS bc_fullname,
            //     bd.itName AS bd_itName,
            //     be.mnName AS be_mnName
            // FROM (
            //     SELECT a.genexpertSN,a.engineerID
            // FROM preventive_maintenance a 
            // WHERE a.current_pm = 1 
            // ORDER BY a.dateupdated DESC LIMIT ${limit} OFFSET ${offset}
            // ) a
            // LEFT JOIN preventive_maintenance aa ON aa.genexpertSN = a.genexpertSN
            // LEFT JOIN genexpert b ON b.serialnumber=a.genexpertSN
            //     LEFT JOIN site ba ON ba.siteID = b.siteID
            //     LEFT JOIN module bb ON bb.genexpertSN = b.serialnumber
            //         LEFT JOIN engineer bba ON bba.engineerID = bb.engineerID 
            //         LEFT JOIN installationtype bbb ON bbb.itID = bb.itID 
            //     LEFT JOIN engineer bc ON bc.engineerID = b.engineerID 
            //     LEFT JOIN installationtype bd ON bd.itID = b.itID 
            //     LEFt JOIN modelnumber be ON be.mnID  = b.mnID 
            // LEFT JOIN engineer c ON c.engineerID = a.engineerID 
            // WHERE 1=1 ${filter}`
             
            return `SELECT * FROM (SELECT 
                a.pmID AS a_pmID,
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
                FROM preventive_maintenance a
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
                ORDER BY xxx.a_calibrate_done 
                ASC LIMIT ${limit} OFFSET ${offset}`;

        }

        function getDatas(condition){
            return `SELECT * FROM preventive_maintenance a 
            LEFT JOIN engineer b ON b.engineerID = a.engineerID 
            WHERE 1=1 ${condition} ORDER BY calibrate_done DESC`;
        }

        
        function getRecords(filter=""){
            return `SELECT 
            a.recordID AS a_recordID,
            a.pmID AS a_pmID,
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
            FROM preventive_maintenance_record a
            LEFT JOIN engineer b ON b.engineerID = a.engineerID 
            LEFT JOIN user c ON c.userID = a.addedby
            LEFT JOIN user d ON d.userID = a.updatedby
            WHERE 1=1 ${filter} ORDER BY a.dateofrecord DESC `;
        }

        function updatePM(options){

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

            return `UPDATE preventive_maintenance SET ${sets_statement} 
            WHERE genexpertSN="${options['genexpert']}"`;



        }

        function getAllPM(condition = ""){

            return `
            SELECT a.dateadded,a.dateupdated,a.genexpertSN,
            "Current" AS stat,
            a.calibrate_start,a.calibrate_done,b.fullname,
            CONCAT(c.firstname," ",c.lastname) AS addedby,
            CONCAT(d.firstname," ",d.lastname) AS updatedby 
            FROM preventive_maintenance a
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
            FROM preventive_maintenance_record a
            LEFT JOIN engineer b ON b.engineerID = a.engineerID 
            LEFT JOIN user c ON c.userID = a.addedby 
            LEFT JOIN user d ON d.userID = a.updatedby
            WHERE 1=1 ${condition} 
            ORDER BY genexpertSN,dateadded DESC`;
        }

        function getFilterDatas(condition){

            return `
            SELECT a.dateadded,a.dateupdated,a.genexpertSN,
            "Current" AS stat,
            a.calibrate_start,a.calibrate_done,b.fullname,
            CONCAT(c.firstname," ",c.lastname) AS addedby,
            CONCAT(d.firstname," ",d.lastname) AS updatedby 
            FROM preventive_maintenance a
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
            FROM preventive_maintenance_record a
            LEFT JOIN engineer b ON b.engineerID = a.engineerID 
            LEFT JOIN user c ON c.userID = a.addedby 
            LEFT JOIN user d ON d.userID = a.updatedby
            WHERE 1=1 ${condition}
            ORDER BY genexpertSN,dateadded DESC`;
        }



        return {insert,multiInsertExcelBased,getLastPMBasedGenexpertSN,select,getDatas,
            getRecords,updatePM,getAllPM,getFilterDatas};
    }

    process(){

        var self = this;

        function insert(values,callback){

            self.inquireDatabase({
                "statement":self.statements().insert(values),
                "results":function(r){
                    self.inquireDatabase({
                        "statement":`SELECT MAX(pmID) AS prevID FROM preventive_maintenance`,
                        "results":function(res){
                            callback(JSON.parse(JSON.stringify(res))[0]);


                        }
                    });
                }
            });

          
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

        function getLastPMBasedGenexpertSN(serialnumber,callback){

            self.inquireDatabase({
                "statement":self.statements().getLastPMBasedGenexpertSN(serialnumber),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));

                }

             });
        }

        function getTotalProcess(callback){
            self.inquireDatabase({
                "statement":`SELECT count(pmID) AS total 
                FROM preventive_maintenance WHERE 1=1`,
                "results":function(res){
                  callback(JSON.parse(JSON.stringify(res)));
                }
            },function(){});
        }
        
        function getProcess(options,callback){

            self.inquireDatabase({
              "statement":self.statements().select(options),
              "results":function(res){
                  callback(JSON.parse(JSON.stringify(res)));

              }

           },function(){});

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

        function updatePM(options,callback){

            self.inquireDatabase({
                "statement":self.statements().updatePM(options)
             },callback);
        }

        function getAllPM(callback,condition=""){
            self.inquireDatabase({
                "statement":self.statements().getAllPM(condition),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));

                }

             });
        }

        function getFilterDatas(condition,callback){
            self.inquireDatabase({
                "statement":self.statements().getFilterDatas(condition,callback),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));

                }

             });
        }

        return {insert,getLastPMBasedGenexpertSN,getProcess,getTotalProcess,
            insertMultiExcelProcess,getDatas,getRecords,updatePM,getAllPM,getFilterDatas};
    }

  

        

}

const preventiveMaintenanceModel = new PreventiveMaintenanceModel();
module.exports = preventiveMaintenanceModel;