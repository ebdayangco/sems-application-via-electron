const { toDateTimeString } = require("../../supporters/sections/RequestSection");
const Model = require("./Model");
class ModuleModel extends Model{
    constructor(){
        super();
    }

    statements(){

        var self = this;

        function checkModuleOnLocations(genexpertSN,locations){
            return `SELECT * FROM module WHERE genexpertSN="${genexpertSN}" AND location 
            IN("${locations}")`;
        }

        function getAllModules(){
            return `
                SELECT *, 
                CONCAT(d.firstname," ",d.lastname) AS addedby,
                CONCAT(e.firstname," ",e.lastname) AS updatedby FROM module a
                LEFT JOIN engineer b ON b.engineerID = a.engineerID 
                LEFT JOIN installationtype c ON c.itID = a.itID 
                LEFT JOIN user d ON d.userID = a.addedby
                LEFT JOIN user e ON e.userID = a.updatedby 
                ORDER BY genexpertSN,status,location
            `
        }

        function checkSNExistList(snList){
            return `SELECT serialnumber FROM module WHERE serialnumber IN("${snList}")`;
        }

        function insertNewModule(datas){
            const d = datas;

            return `INSERT INTO module(genexpertSN,serialnumber,location,itID,engineerID
                ,dateinstalled,status,revision_number,part_number,addedby,updatedby,transID) 
                SELECT 
                "${d['genexpert']}" AS gSN,
                "${d['new-serial-number']}" AS mSN,
                "${d['location']}" AS loc,
                ${d['installation-type']} AS itI,
                ${d['engineer']} AS engI,
                "${d['date-installed'] == ""? '0001-01-01':
                toDateTimeString(d['date-installed'])}" AS din,
                "${d['status']}" AS stat,
                "${d['revision-number']}" AS ren,
                "${d['part-number']}" AS pan,
                ${self.acctJSON["online"]['userID']} AS adby,
                ${self.acctJSON["online"]['userID']} AS upby,
                ${self.getTransID()} AS tID`;
        }

        function replaceNewModule(datas){
            const d = datas;

            return `INSERT INTO module(genexpertSN,serialnumber,location,itID,engineerID
                ,dateinstalled,status,revision_number,part_number,addedby,updatedby,transID) 
                SELECT 
                "${d['genexpert']}" AS gSN,
                "${d['new-serial-number']}" AS mSN,
                "${d['location']}" AS loc,
                ${d['installation-type']} AS itI,
                ${d['engineer']} AS engI,
                "${d['date-installed'] == ""? '0001-01-01':
                toDateTimeString(d['date-installed'])}" AS din,
                "Active" AS stat,
                "" AS ren,
                "" AS pan,
                ${self.acctJSON["online"]['userID']} AS adby,
                ${self.acctJSON["online"]['userID']} AS upby,
                ${self.getTransID()} AS tID`;
        }

        function assignRNPNtoModule(datas){
            const d = datas;

            return `UPDATE module SET revision_number="${d['revision-number']}",
                part_number="${d['part-number']}",status="Terminated" 
                WHERE serialnumber="${d['replace-from']}" AND 
                genexpertSN="${d['genexpert']}"`;
        }
        
        function insert(data){
            return `INSERT INTO module(genexpertSN,serialnumber,location,itID,engineerID
                ,dateinstalled,STATUS,revision_number,part_number,addedby,updatedby) 
                SELECT 
                "${data['module-genexpert']}" AS gSN,
                "${data['module-serial-number']}" AS mSN,
                "${data['module-location']}" AS loc,
                ${data['module-installation-type']} AS itI,
                ${data['module-engineer']} AS engI,
                "${data['module-date-installed'] == ""? "0001-01-01":
                toDateTimeString(data['module-date-installed'])}" AS din,
                "Active" AS stat,
                "${data['module-revision-number']}" AS ren,
                "${data['module-part-number']}" AS pan,
                ${self.acctJSON["online"]['userID']} AS adby,
                ${self.acctJSON["online"]['userID']} AS upby`;
        }

        function checkExist(modulesn){
            
            let series = `"${modulesn[0]}"`;
            modulesn.forEach((v,i)=>{
                series += i == 0 ? "":`,"${v}"`;
            });

            return `SELECT genexpertSN,serialnumber FROM module WHERE serialnumber 
            IN(${series}) AND status ="Active"`;
        }

        function searchForModuleReplacement(lookfor){
            return `SELECT * FROM (SELECT 
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
                a.location LIKE "%${lookfor}%"
            ) xxx WHERE xxx.a_status ="Active"`;
        }

        function moduleReplacement(data){

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
                    ${self.acctJSON["online"]['userID']}

                )
            `;

        }

        function getIDAfterTransaction(serialnumber){
            return `SELECT moduleID FROM module WHERE serialnumber="${serialnumber}"`;
        }

        function update(sets,where){
            sets+=`,updatedby=${self.acctJSON["online"]['userID']}`;
            return `UPDATE module SET ${sets} ${where}`;
        }

        function getModule(condition){
            return `SELECT * FROM module WHERE 1=1 ${condition}`;
        }

        function updateModule(data){
            return `UPDATE module 
            SET 
            serialnumber="${data['serial-number']}",
            location="${data['location']}",
            dateinstalled="${data['date-installed']}",
            status="${data['status']}",
            engineerID=${data['engineer']},
            itID=${data['installation-type']},
            updatedby=${self.acctJSON["online"]['userID']} 
            WHERE genexpertSN="${data['genexpert']}" AND 
            serialnumber = "${data['previous-serial-number']}"`;
        }

        function getRecords(module_serial_number){

            return `SELECT "Current" AS tbl,a.moduleID,a.dateadded,
            a.dateupdated,a.genexpertSN,c.siteName,
            a.serialnumber,a.revision_number,a.part_number,
            a.status,a.addedby,a.updatedby,a.location,a.dateinstalled,d.itName,e.fullname,
            CONCAT(f.firstname," ",f.lastname) AS update_by
            FROM module a
            LEFT JOIN genexpert b ON b.serialnumber = a.genexpertSN
            LEFT JOIN site c ON c.siteID = b.siteID
            LEFT JOIN installationtype d ON d.itID = a.itID 
            LEFT JOIN engineer e ON e.engineerID = a.engineerID
            LEFT JOIN user f ON f.userID = a.updatedby
            WHERE a.serialnumber = "${module_serial_number}"
             UNION ALL
            SELECT "Record" AS tbl,a.moduleID,a.dateadded,a.dateupdated,a.genexpertSN,c.siteName,
            a.serialnumber,a.revision_number,a.part_number,
            a.status,a.addedby,a.updatedby,a.location,a.dateinstalled,d.itName,e.fullname,
            CONCAT(f.firstname," ",f.lastname) AS update_by
            FROM module_records a
            LEFT JOIN genexpert b ON b.serialnumber = a.genexpertSN
            LEFT JOIN site c ON c.siteID = b.siteID
            LEFT JOIN installationtype d ON d.itID = a.itID 
            LEFT JOIN engineer e ON e.engineerID = a.engineerID
            LEFT JOIN user f ON f.userID = a.updatedby
            WHERE a.serialnumber = "${module_serial_number}" 
            ORDER BY dateupdated DESC`;

        }



        return {insert,checkExist,searchForModuleReplacement,moduleReplacement,
            getIDAfterTransaction,update,getModule,checkSNExistList,updateModule,getRecords,
            getAllModules,insertNewModule,checkModuleOnLocations,assignRNPNtoModule,
            replaceNewModule};
    }

    process(){

        var self = this;

        function insert(data,callback){
            
            self.inquireDatabase({
                "statement":self.statements().insert(data)},callback);
        }
        function newModule(datas,callback){
            
            self.inquireDatabase({
                "statement":self.statements().insertNewModule(datas)},callback);
        }
        function checkExist(modules,ifexist,ifnotexist){

            self.inquireDatabase({
                "statement":self.statements().checkExist(modules),
                "results":function(res){
                    const found = JSON.parse(JSON.stringify(res));

                    found.length == 0 ?ifnotexist():ifexist(found);
                }
            });
        }
        function findDataforModuleReplacement(search,callback){
            
            self.inquireDatabase({
                "statement":self.statements().searchForModuleReplacement(search),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }
        function moduleReplacement(data,callback){

            self.inquireDatabase({
                "statement":self.statements().moduleReplacement(data),
            },function(){
                
                self.inquireDatabase({
                    "statement":self.statements().getIDAfterTransaction(data['previous-serial-number']),
                    "results":function(res){
                        callback(JSON.parse(JSON.stringify(res))[0]);
                    }
                })
            });
        }
        function getModule(condition,callback){
            
            self.inquireDatabase({
                "statement":self.statements().getModule(condition),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }

        function update(set,where,callback){
            
            self.inquireDatabase({
                "statement":self.statements().update(set,where)},callback);
        } 

        function checkSNExistList(snList,callback){

            self.inquireDatabase({
                "statement":self.statements().checkSNExistList(snList),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }
        function updateModule(data,callback){
            self.inquireDatabase({
                "statement":self.statements().updateModule(data)},callback);
        }
        
        function replaceModule(data,callback){
            self.inquireDatabase({
                "statement":self.statements().replaceNewModule(data)},function(){
                    self.inquireDatabase({
                    "statement":self.statements().assignRNPNtoModule(data)},callback);
            });
        }

        function getRecords(module_serial_number,callback){
            
            self.inquireDatabase({
                "statement":self.statements().getRecords(module_serial_number),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }

        function getAllModules(callback){
            self.inquireDatabase({
                "statement":self.statements().getAllModules(),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }


        function checkModuleOnLocations(genexpertSN,locations,callback){
            self.inquireDatabase({
                "statement":self.statements().checkModuleOnLocations(genexpertSN,locations),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }

        return {insert,checkExist,findDataforModuleReplacement,moduleReplacement,update,
        getModule,checkSNExistList,updateModule,getRecords,getAllModules,newModule,
        checkModuleOnLocations,replaceModule};

    }
}
const moduleModel = new ModuleModel();
module.exports = moduleModel;