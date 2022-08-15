const { toDateTimeString, getOnDate } = require("../../supporters/sections/RequestSection");
const genexpertView = require("../views/GenexpertView");
const transactionView = require("../views/TransactionView");
const Model = require("./Model");
class GenexpertModel extends Model{
    constructor(){  super();}


    statements(){

        var self = this;


        function getEntireIndividualGenexpert(){
            return `SELECT *,
            CONCAT(f.firstname," ",f.lastname) AS addedby,
            CONCAT(g.firstname," ",g.lastname) AS updatedby,
            CONCAT("START:{",xg.cal_start,"}, END:{",xg.cal_done,"}") AS current_xpertcheck,
            CONCAT("START:{",prg.cal_start,"}, END:{",prg.cal_done,"}") AS current_preventive_maintenance
             FROM genexpert a
            LEFT JOIN engineer b ON b.engineerID = a.engineerID 
            LEFT JOIN installationtype c ON c.itID = a.itID 
            LEFT JOIN modelnumber d ON d.mnID = a.mnID 
            LEFT JOIN site e ON e.siteID = a.siteID 
            LEFT JOIN user f ON f.userID = a.addedby 
            LEFT JOIN user g ON g.userID = a.updatedby 
            LEFT JOIN (
                SELECT a.serialnumber AS genexpertSN,
                GROUP_CONCAT(b.serialnumber) AS moduleSN
                FROM genexpert a
                LEFT JOIN module b ON b.genexpertSN = a.serialnumber
                GROUP BY a.serialnumber
                ) mg ON mg.genexpertSN = a.serialnumber 
                
            LEFT JOIN (
            SELECT a.serialnumber AS genexpertSN,
                GROUP_CONCAT("{",b.test,":",b.quantity,"}") AS assay_group
                FROM genexpert a
                LEFT JOIN assaystatistic b ON b.genexpertSN = a.serialnumber
                WHERE b.test != "-" AND b.test != "undefined"
                GROUP BY a.serialnumber
            ) ag ON ag.genexpertSN = a.serialnumber 
            
            LEFT JOIN ( 
            
            SELECT genexpertSN,IF(peripheralName IS NULL,"",peripheralName) AS peripheral_group FROM 
                (SELECT a.serialnumber AS genexpertSN,
                GROUP_CONCAT(b.peripheralName) AS peripheralName
                FROM genexpert a
                LEFT JOIN peripheral b ON b.genexpertSN = a.serialnumber
                GROUP BY a.serialnumber) xxx
                ) pg ON pg.genexpertSN = a.serialnumber 
               LEFT JOIN (
			SELECT a.genexpertSN,MAX(a.calibrate_start) AS cal_start,
			MAX(a.calibrate_done) AS cal_done  FROM xpertcheck a
			GROUP BY a.genexpertSN
               ) xg ON xg.genexpertSN = a.serialnumber 
                LEFT JOIN (
			SELECT a.genexpertSN,MAX(a.calibrate_start) AS cal_start,
			MAX(a.calibrate_done) AS cal_done  FROM preventive_maintenance a
			GROUP BY a.genexpertSN
               ) prg ON prg.genexpertSN = a.serialnumber
               
               LEFT JOIN (
			SELECT a.genexpert_serial_number AS genexSN_service_report,
			a.service_report_num AS service_report_number,
			MAX(a.date_added) AS latest 
			FROM service_report a 
			GROUP BY a.genexpert_serial_number,a.service_report_num
               ) srg ON srg.genexSN_service_report = a.serialnumber 
            `;
        }

        function genexpertUpdates(sets,where){
            sets+=`,updatedby=${self.acctJSON["online"]['userID']},
            lastTransaction="Edit"`;
            return `UPDATE genexpert SET ${sets} ${where}`;
        }

        function genexpertUpdateOnModuleReplacement(serialnumber){
            return `UPDATE genexpert SET lastTransaction='Module Replacement' 
            WHERE serialnumber="${serialnumber}"`;
        }

        function getGenexpertViaFacility(facility){
            return `SELECT serialnumber,mnID FROM genexpert WHERE siteID = 
            (SELECT siteID FROM site WHERE siteName="${facility}")`;
        }

        function genexpertSearch(search_item){
                return `SELECT 
                a.serialnumber AS a_serialnumber,
                a.dateadded AS a_dateadded,
                a.dateupdated AS a_dateupdated,	
                a.dateinstalled AS a_dateinstalled,
                d.fullname AS d_fullname,
                c.itName AS c_itName,
                e.mnName AS e_mnName,
                a.software_version AS a_software_version,
                a.os_version AS a_os_version,
                a.warranty_expiry_date AS a_warranty_expiry_date,
                a.service_contract_expiry_date AS a_service_contract_expiry_date,
                a.status AS a_status,
                b.siteName AS b_siteName,
                b.region AS b_region,
                b.province AS b_province,
                b.city AS b_city,
                b.barangay AS b_barangay,
                b.complete_address AS b_complete_address
            FROM genexpert a
            LEFT JOIN site b ON b.siteID = a.siteID
            LEFT JOIN installationtype c ON c.itID = a.itID
            LEFT JOIN engineer d ON d.engineerID = a.engineerID 
            LEFT JOIN modelnumber e ON e.mnID = a.mnID
            WHERE a.status = "Active" AND
            a.serialnumber LIKE "%${search_item}%" OR
            c.itName LIKE "%${search_item}%" OR
            b.siteName LIKE "%${search_item}%" OR
            e.mnName LIKE "%${search_item}%" OR
            d.fullname LIKE "%${search_item}%" OR
            a.software_version LIKE "%${search_item}%" OR
            a.os_version LIKE "%${search_item}%" OR
            b.region LIKE "%${search_item}%" OR
            b.province LIKE "%${search_item}%" OR
            b.city LIKE "%${search_item}%" OR
            b.barangay LIKE "%${search_item}%" OR
            b.complete_address LIKE "%${search_item}%"`;
        }

        function findGenexpertViaSerialNumber(serialnumber){
            return `SELECT 
                a.serialnumber AS a_serialnumber,
                a.dateadded AS a_dateadded,
                a.dateupdated AS a_dateupdated,	
                a.dateinstalled AS a_dateinstalled,
                d.fullname AS d_fullname,
                c.itName AS c_itName,
                e.mnName AS e_mnName,
                a.software_version AS a_software_version,
                a.os_version AS a_os_version,
                a.warranty_expiry_date AS a_warranty_expiry_date,
                a.service_contract_expiry_date AS a_service_contract_expiry_date,
                a.status AS a_status,
                b.siteName AS b_siteName,
                b.region AS b_region,
                b.province AS b_province,
                b.city AS b_city,
                b.barangay AS b_barangay,
                b.complete_address AS b_complete_address
            FROM genexpert a
            LEFT JOIN site b ON b.siteID = a.siteID
            LEFT JOIN installationtype c ON c.itID = a.itID
            LEFT JOIN engineer d ON d.engineerID = a.engineerID 
            LEFT JOIN modelnumber e ON e.mnID = a.mnID
            WHERE a.status = "Active" AND a.serialnumber="${serialnumber}"`;
        }

        function genexpertTransfer(){

            const main = genexpertView.transaction().transfer().getOnTransferEntry();

            const entry = transactionView.getMainTransactDatas();
            
            return `UPDATE genexpert SET siteID 
            =insertFacilityAlone("${main['new-facility']}"), 
            dateinstalled="${getOnDate(main['date-installed'])}",
            updatedby=${self.acctJSON["online"]['userID']},
            remarks="${main['remarks']}",lastTransaction="transfer" 
            WHERE serialnumber="${main['serial-number']}"`;
        }

        function getTotalGenexpertStatement(filter){
            return ` SELECT COUNT(xxxx.unique_genexpert_serial_number) AS assetTotal FROM( 
                SELECT xx.unique_genexpert_serial_number FROM (
                           SELECT genex.serialnumber AS unique_genexpert_serial_number
                           FROM genexpert genex
                           LEFT JOIN engineer genex_eng ON genex_eng.engineerID = genex.engineerID
                                   LEFT JOIN user genex_eng_addedby ON genex_eng_addedby.userID = genex_eng.addedby
                                   LEFT JOIN user genex_eng_updatedby ON genex_eng_updatedby.userID = genex_eng.updatedby
                               LEFT JOIN installationtype genex_inst ON genex_inst.itID = genex.itID
                                   LEFT JOIN user genex_inst_addedby ON genex_inst_addedby.userID = genex_inst.addedby
                                   LEFT JOIN user genex_inst_updatedby ON genex_inst_updatedby.userID = genex_inst.updatedby
                               LEFT JOIN modelnumber genex_mode ON genex_mode.mnID = genex.mnID 
                                   LEFT JOIN user genex_mode_addedby ON genex_mode_addedby.userID = genex_mode.addedby
                                   LEFT JOIN user genex_mode_updatedby ON genex_mode_updatedby.userID = genex_mode.updatedby
                               LEFT JOIN site genex_faci ON genex_faci.siteID = genex.siteID
                                   LEFT JOIN user genex_faci_addedby ON genex_faci_addedby.userID  = genex_faci.addedby
                                   LEFT JOIN user genex_faci_updatedby ON genex_faci_updatedby.userID  = genex_faci.updatedby	
                                   LEFT JOIN contact genex_faci_cont ON genex_faci_cont.siteID = genex_faci.siteID
                               LEFT JOIN user genex_user_addedby ON genex_user_addedby.userID = genex.addedby
                               LEFT JOIN user genex_user_updatedby ON genex_user_updatedby.userID = genex.updatedby
                               LEFT JOIN assaystatistic assay ON assay.genexpertSN = genex.serialnumber
                                   LEFT JOIN user assay_addedby ON assay_addedby.userID = assay.addedby
                                   LEFT JOIN user assay_updatedby ON assay_updatedby.userID = assay.updatedby	
                               LEFT JOIN peripheral peri ON peri.genexpertSN = genex.serialnumber
                                   LEFT JOIN user peri_addedby ON peri_addedby.userID = peri.addedby
                                   LEFT JOIN user peri_updatedby ON peri_updatedby.userID = peri.updatedby	
                           LEFT JOIN module modu ON modu.genexpertSN = genex.serialnumber
                               LEFT JOIN engineer modu_eng ON modu_eng.engineerID = modu.engineerID
                                   LEFT JOIN user modu_eng_addedby ON modu_eng_addedby.userID = modu_eng.addedby
                                   LEFT JOIN user modu_eng_updatedby ON modu_eng_updatedby.userID = modu_eng.updatedby
                               LEFT JOIN installationtype modu_inst ON modu_inst.itID = modu.itID
                                   LEFT JOIN user modu_inst_addedby ON modu_inst_addedby.userID = modu_inst.addedby
                                   LEFT JOIN user modu_inst_updatedby ON modu_inst_updatedby.userID = modu_inst.updatedby	
                               LEFT JOIN user modu_user_addedby ON modu_user_addedby.userID = modu.addedby
                               LEFT JOIN user modu_user_updatedby ON modu_user_updatedby.userID = modu.updatedby 
                               LEFT JOIN 
                               (SELECT * FROM (SELECT MAX(a.dateupdated) AS latest, a.serialnumber AS sn FROM genexpert a 
                               GROUP BY a.serialnumber) aa ) xxx ON xxx.latest = genex.dateupdated AND 
                               xxx.sn = genex.serialnumber      
                               WHERE 1=1  ${filter} GROUP BY genex.serialnumber) xx )xxxx`;
        }
        

        function getGenexpertStatement(filter ="",limit=50,offset=0){
           
            let limitStatement =  limit ?`LIMIT ${limit}`:'';
            let offsetStatement =  offset ?` OFFSET ${offset}`:'';
            let orderStatement = limit != null && offset != null ? 
            ` ORDER BY genex.dateupdated DESC `:'';

            const pieces = `LEFT JOIN xpertcheck xper ON xper.genexpertSN = genex.serialnumber 
            LEFT JOIN engineer xper_eng ON xper_eng.engineerID = xper.engineerID
            LEFT JOIN user xper_addedby ON xper_addedby.userID = xper.addedby
            LEFT JOIN user xper_updatedby ON xper_updatedby.userID = xper.updatedby
            LEFT JOIN preventive_maintenance preve ON preve.genexpertSN = genex.serialnumber 
            LEFT JOIN engineer preve_eng ON preve_eng.engineerID = preve.engineerID
            LEFT JOIN user preve_addedby ON preve_addedby.userID = preve.addedby
            LEFT JOIN user preve_updatedby ON preve_updatedby.userID = preve.updatedby
            LEFT JOIN service_report servi ON servi.machine_id = genex.serialnumber
            LEFT JOIN user servi_addedby ON servi_addedby.userID = servi.addedby
            LEFT JOIN user servi_updatedby ON servi_updatedby.userID = servi.updatedby `;

            return ` 
            SELECT * FROM (
             SELECT 
             xxx.latest AS latest,
             genex.genexpertID AS genex_genexpertID,
             genex.dateadded AS genex_dateadded,
             genex.dateupdated AS genex_dateupdated,
             genex.serialnumber AS genex_serialnumber,
             genex.engineerID AS genex_engineerID,
                 genex_eng.engineerID AS genex_eng_engineerID,
                 genex_eng.dateadded AS genex_eng_dateadded,
                 genex_eng.dateupdated AS genex_eng_dateupdated,
                 genex_eng.fullname AS genex_eng_fullname,
                 genex_eng.addedby AS genex_eng_addedby,
                     genex_eng_addedby.userID AS genex_eng_addedby_userID,
                     genex_eng_addedby.dateadded AS genex_eng_addedby_dateadded,
                     genex_eng_addedby.dateupdated AS genex_eng_addedby_dateupdated,
                     genex_eng_addedby.firstname AS genex_eng_addedby_firstname,
                     genex_eng_addedby.lastname AS genex_eng_addedby_lastname,
                     genex_eng_addedby.email AS genex_eng_addedby_email,
                     genex_eng_addedby.contactnumber AS genex_eng_addedby_contactnumber,
                     genex_eng_addedby.password AS genex_eng_addedby_password,
                     genex_eng_addedby.active AS genex_eng_addedby_active,
                 genex_eng.updatedby AS genex_eng_updatedby,
                     genex_eng_updatedby.userID AS genex_eng_updatedby_userID,
                     genex_eng_updatedby.dateadded AS genex_eng_updatedby_dateadded,
                     genex_eng_updatedby.dateupdated AS genex_eng_updatedby_dateupdated,
                     genex_eng_updatedby.firstname AS genex_eng_updatedby_firstname,
                     genex_eng_updatedby.lastname AS genex_eng_updatedby_lastname,
                     genex_eng_updatedby.email AS genex_eng_updatedby_email,
                     genex_eng_updatedby.contactnumber AS genex_eng_updatedby_contactnumber,
                     genex_eng_updatedby.password AS genex_eng_updatedby_password,
                     genex_eng_updatedby.active AS genex_eng_updatedby_active,
                 genex.dateinstalled AS genex_dateinstalled,
                 genex.itID AS genex_itID,
                 genex_inst.itID AS genex_inst_itID,
                 genex_inst.dateadded AS genex_inst_dateadded,
                 genex_inst.dateupdated AS genex_inst_dateupdated,
                 genex_inst.itName AS genex_inst_itName,
                 genex_inst.addedby AS genex_inst_addedby,
                     genex_inst_addedby.userID AS genex_inst_addedby_userID,
                     genex_inst_addedby.dateadded AS genex_inst_addedby_dateadded,
                     genex_inst_addedby.dateupdated AS genex_inst_addedby_dateupdated,
                     genex_inst_addedby.firstname AS genex_inst_addedby_firstname,
                     genex_inst_addedby.lastname AS genex_inst_addedby_lastname,
                     genex_inst_addedby.email AS genex_inst_addedby_email,
                     genex_inst_addedby.contactnumber AS genex_inst_addedby_contactnumber,
                     genex_inst_addedby.password AS genex_inst_addedby_password,
                     genex_inst_addedby.active AS genex_inst_addedby_active,
                 genex_inst.updatedby AS genex_inst_updatedby,
                     genex_inst_updatedby.userID AS genex_inst_updatedby_userID,
                     genex_inst_updatedby.dateadded AS genex_inst_updatedby_dateadded,
                     genex_inst_updatedby.dateupdated AS genex_inst_updatedbyb_dateupdated,
                     genex_inst_updatedby.firstname AS genex_inst_updatedby_firstname,
                     genex_inst_updatedby.lastname AS genex_inst_updatedby_lastname,
                     genex_inst_updatedby.email AS genex_inst_updatedby_email,
                     genex_inst_updatedby.contactnumber AS genex_inst_updatedby_contactnumber,
                     genex_inst_updatedby.password AS genex_inst_updatedby_password,
                     genex_inst_updatedby.active AS genex_inst_updatedby_active,
                 genex.mnID AS genex_mnID,
                 genex_mode.mnID AS genex_mode_mnID,
                 genex_mode.dateadded AS genex_mode_dateadded,
                 genex_mode.dateupdated AS genex_mode_dateupdated,
                 genex_mode.mnName AS genex_mode_mnName,
                 genex_mode.addedby AS genex_mode_addedby,
                     genex_mode_addedby.userID AS genex_mode_addedby_userID,
                     genex_mode_addedby.dateadded AS genex_mode_addedby_dateadded,
                     genex_mode_addedby.dateupdated AS genex_mode_addedby_dateupdated,
                     genex_mode_addedby.firstname AS genex_mode_addedby_firstname,
                     genex_mode_addedby.lastname AS genex_mode_addedby_lastname,
                     genex_mode_addedby.email AS genex_mode_addedby_email,
                     genex_mode_addedby.contactnumber AS genex_mode_addedby_contactnumber,
                     genex_mode_addedby.password AS genex_mode_addedby_password,
                     genex_mode_addedby.active AS genex_mode_addedby_active,
                 genex_mode.updatedby AS genex_mode_updatedby,
                     genex_mode_updatedby.userID AS genex_mode_updatedby_userID,
                     genex_mode_updatedby.dateadded AS genex_mode_updatedby_dateadded,
                     genex_mode_updatedby.dateupdated AS genex_mode_updatedby_dateupdated,
                     genex_mode_updatedby.firstname AS genex_mode_updatedby_firstname,
                     genex_mode_updatedby.lastname AS genex_mode_updatedby_lastname,
                     genex_mode_updatedby.email AS genex_mode_updatedby_email,
                     genex_mode_updatedby.contactnumber AS genex_mode_updatedby_contactnumber,
                     genex_mode_updatedby.password AS genex_mode_updatedby_password,
                     genex_mode_updatedby.active AS genex_mode_updatedby_active,
                 genex.siteID AS genex_siteID,
                 genex_faci.siteID AS genex_faci_siteID,
                 genex_faci.dateadded AS genex_faci_dateadded,
                 genex_faci.dateupdated AS genex_faci_dateupdated,
                 genex_faci.addedby AS genex_faci_addedby,
                     genex_faci_addedby.userID AS genex_faci_addedby_userID,
                     genex_faci_addedby.dateadded AS genex_faci_addedby_dateadded,
                     genex_faci_addedby.dateupdated AS genex_faci_addedby_dateupdated,
                     genex_faci_addedby.firstname AS genex_faci_addedby_firstname,
                     genex_faci_addedby.lastname AS genex_faci_addedby_lastname,
                     genex_faci_addedby.email AS genex_faci_addedby_email,
                     genex_faci_addedby.contactnumber AS genex_faci_addedby_contactnumber,
                     genex_faci_addedby.password AS genex_faci_addedby_password,
                     genex_faci_addedby.active AS genex_faci_addedby_active,
                 genex_faci.updatedby AS genex_faci_updatedby,
                     genex_faci_updatedby.userID AS genex_faci_updatedby_userID,
                     genex_faci_updatedby.dateadded AS genex_faci_updatedby_dateadded,
                     genex_faci_updatedby.dateupdated AS genex_faci_updatedby_dateupdated,
                     genex_faci_updatedby.firstname AS genex_faci_updatedby_firstname,
                     genex_faci_updatedby.lastname AS genex_faci_updatedby_lastname,
                     genex_faci_updatedby.email AS genex_faci_updatedby_email,
                     genex_faci_updatedby.contactnumber AS genex_faci_updatedby_contactnumber,
                     genex_faci_updatedby.password AS genex_faci_updatedby_password,
                     genex_faci_updatedby.active AS genex_faci_updatedby_active,
                 genex_faci.siteName AS genex_faci_siteName,
                 genex_faci.complete_address AS genex_faci_complete_address,
                 genex_faci.region AS genex_faci_region,
                 genex_faci.province AS genex_faci_province,
                 genex_faci.city AS genex_faci_city,
                 genex_faci.barangay AS genex_faci_barangay,
                 genex_faci.street AS genex_faci_street,
                 genex_faci.latitude AS genex_faci_latitude,
                 genex_faci.longitude AS genex_faci_longitude,
                          genex_faci_cont.contactID AS genex_faci_cont_contactID,
                          genex_faci_cont.dateadded AS genex_faci_cont_dateadded,
                          genex_faci_cont.dateupdated AS genex_faci_cont_dateupdated,
                          genex_faci_cont.addedby AS genex_faci_cont_addedby,
                          genex_faci_cont.updatedby AS genex_faci_cont_updatedby,
                          genex_faci_cont.fullname AS genex_faci_cont_fullname,
                          genex_faci_cont.email AS genex_faci_cont_email,
                          genex_faci_cont.contactnumber AS genex_faci_cont_contactnumber,
                          genex_faci_cont.active AS genex_faci_cont_active,
                          genex_faci_cont.siteID AS genex_faci_cont_siteID,
                          genex_faci_cont.position AS genex_faci_cont_position,					
                 genex.software_version AS genex_software_version,
                 genex.os_version AS genex_os_version,
                 genex.warranty_expiry_date AS genex_warranty_expiry_date,
                 genex.service_contract_expiry_date AS genex_service_contract_expiry_date,
                 genex.status AS genex_status,
                 genex.remarks AS genex_remarks,
                 genex.addedby AS genex_addedby,
                 genex_user_addedby.userID AS genex_user_addedby_userID,
                 genex_user_addedby.dateadded AS genex_user_addedby_dateadded,
                 genex_user_addedby.dateupdated AS genex_user_addedby_dateupdated,
                 genex_user_addedby.firstname AS genex_user_addedby_firstname,
                 genex_user_addedby.lastname AS genex_user_addedby_lastname,
                 genex_user_addedby.email AS genex_user_addedby_email,
                 genex_user_addedby.contactnumber AS genex_user_addedby_contactnumber,
                 genex_user_addedby.password AS genex_user_addedby_password,
                 genex_user_addedby.active AS genex_user_addedby_active,
                 genex.updatedby AS genex_updatedby,
                 genex_user_updatedby.userID AS genex_user_updatedby_userID,
                 genex_user_updatedby.dateadded AS genex_user_updatedby_dateadded,
                 genex_user_updatedby.dateupdated AS genex_user_updatedby_dateupdated,
                 genex_user_updatedby.firstname AS genex_user_updatedby_firstname,
                 genex_user_updatedby.lastname AS genex_user_updatedby_lastname,
                 genex_user_updatedby.email AS genex_user_updatedby_email,
                 genex_user_updatedby.contactnumber AS genex_user_updatedby_contactnumber,
                 genex_user_updatedby.password AS genex_user_updatedby_password,
                 genex_user_updatedby.active AS genex_user_updatedby_active,
                 assay.asID AS assay_asID, 
                     assay.dateupdated AS assay_dateupdated,
                     assay.dateadded AS assay_dateadded,
                     assay.genexpertSN AS assay_genexpertSN,
                     assay.test AS assay_test,
                     assay.quantity AS assay_quantity,
                     assay.addedby AS assay_addedby,
                         assay_addedby.userID AS assay_addedby_userID,
                         assay_addedby.dateadded AS assay_addedby_dateadded,
                         assay_addedby.dateupdated AS assay_addedby_dateupdated,
                         assay_addedby.firstname AS assay_addedby_firstname,
                         assay_addedby.lastname AS assay_addedby_lastname,
                         assay_addedby.email AS assay_addedby_email,
                         assay_addedby.contactnumber AS assay_addedby_contactnumber,
                         assay_addedby.password AS assay_addedby_password,
                         assay_addedby.active AS assay_addedby_active,
                     assay.updatedby AS assay_updatedby,
                         assay_updatedby.userID AS assay_updatedby_userID,
                         assay_updatedby.dateadded AS assay_updatedby_dateadded,
                         assay_updatedby.dateupdated AS assay_updatedby_dateupdated,
                         assay_updatedby.firstname AS assay_updatedby_firstname,
                         assay_updatedby.lastname AS assay_updatedby_lastname,
                         assay_updatedby.email AS assay_updatedby_email,
                         assay_updatedby.contactnumber AS assay_updatedby_contactnumber,
                         assay_updatedby.password AS assay_updatedby_password,
                         assay_updatedby.active AS assay_updatedby_active,
                     peri.periID AS peri_periID,
                     peri.dateadded AS peri_dateadded,
                     peri.dateupdated AS peri_dateupdated,
                     peri.peripheralName AS peri_peripheralName,
                     peri.serialnumber AS peri_serialnumber,
                     peri.modelnumber AS peri_modelnumber,
                     peri.genexpertSN AS peri_genexpertSN,
                     peri.current AS peri_current,
                     peri.addedby AS peri_addedby,
                         peri_addedby.userID AS peri_addedby_userID,
                         peri_addedby.dateadded AS peri_addedby_dateadded,
                         peri_addedby.dateupdated AS peri_addedby_dateupdated,
                         peri_addedby.firstname AS peri_addedby_firstname,
                         peri_addedby.lastname AS peri_addedby_lastname,
                         peri_addedby.email AS peri_addedby_email,
                         peri_addedby.contactnumber AS peri_addedby_contactnumber,
                         peri_addedby.password AS peri_addedby_password,
                         peri_addedby.active AS peri_addedby_active,
                     peri.updatedby AS peri_updatedby,
                         peri_updatedby.userID AS peri_updatedby_userID,
                         peri_updatedby.dateadded AS peri_updatedby_dateadded,
                         peri_updatedby.dateupdated AS peri_updatedby_dateupdated,
                         peri_updatedby.firstname AS peri_updatedby_firstname,
                         peri_updatedby.lastname AS peri_updatedby_lastname,
                         peri_updatedby.email AS peri_updatedby_email,
                         peri_updatedby.contactnumber AS peri_updatedby_contactnumber,
                         peri_updatedby.password AS peri_updatedby_password,
                         peri_updatedby.active AS peri_updatedby_active,
                     modu.moduleID AS modu_moduleID,
                     modu.dateadded AS modu_dateadded,
                     modu.dateupdated AS modu_dateupdated,
                     modu.genexpertSN AS modu_genexpertSN,
                     modu.serialnumber AS modu_serialnumber,
                     modu.revision_number AS modu_revision_number,
                     modu.part_number AS modu_part_number,
                     modu.status AS modu_status,
                     modu.addedby AS modu_addedby,
                     modu.updatedby AS modu_updatedby,
                     modu.location AS modu_location,
                     modu.dateinstalled AS modu_dateinstalled,
                     modu.itID AS modu_itID,
                     modu.engineerID AS modu_engineerID,
                     modu.statusHistory AS modu_statusHistory,
                         modu_eng.engineerID AS modu_eng_engineerID,
                         modu_eng.dateadded AS modu_eng_dateadded,
                         modu_eng.dateupdated AS modu_eng_dateupdated,
                         modu_eng.fullname AS modu_eng_fullname,
                         modu_eng.addedby AS modu_eng_addedby,
                             modu_eng_addedby.userID AS modu_eng_addedby_userID,
                             modu_eng_addedby.dateadded AS modu_eng_addedby_dateadded,
                             modu_eng_addedby.dateupdated AS modu_eng_addedby_dateupdated,
                             modu_eng_addedby.firstname AS modu_eng_addedby_firstname,
                             modu_eng_addedby.lastname AS modu_eng_addedby_lastname,
                             modu_eng_addedby.email AS modu_eng_addedby_email,
                             modu_eng_addedby.contactnumber AS modu_eng_addedby_contactnumber,
                             modu_eng_addedby.password AS modu_eng_addedby_password,
                             modu_eng_addedby.active AS modu_eng_addedby_active,
                         modu_eng.updatedby AS modu_eng_updatedby,
                             modu_eng_updatedby.userID AS modu_eng_updatedby_userID,
                             modu_eng_updatedby.dateadded AS modu_eng_updatedby_dateadded,
                             modu_eng_updatedby.dateupdated AS modu_eng_updatedby_dateupdated,
                             modu_eng_updatedby.firstname AS modu_eng_updatedby_firstname,
                             modu_eng_updatedby.lastname AS modu_eng_updatedby_lastname,
                             modu_eng_updatedby.email AS modu_eng_updatedby_email,
                             modu_eng_updatedby.contactnumber AS modu_eng_updatedby_contactnumber,
                             modu_eng_updatedby.password AS modu_eng_updatedby_password,
                             modu_eng_updatedby.active AS modu_eng_updatedby_active,
                     modu_inst.itID AS modu_inst_itID,
                     modu_inst.dateadded AS modu_inst_dateadded,
                     modu_inst.dateupdated AS modu_inst_dateupdated,
                     modu_inst.itName AS modu_inst_itName,
                     modu_inst.addedby AS modu_inst_addedby,
                         modu_inst_addedby.userID AS modu_inst_addedby_userID,
                         modu_inst_addedby.dateadded AS modu_inst_addedby_dateadded,
                         modu_inst_addedby.dateupdated AS modu_inst_addedby_dateupdated,
                         modu_inst_addedby.firstname AS modu_inst_addedby_firstname,
                         modu_inst_addedby.lastname AS modu_inst_addedby_lastname,
                         modu_inst_addedby.email AS modu_inst_addedby_email,
                         modu_inst_addedby.contactnumber AS modu_inst_addedby_contactnumber,
                         modu_inst_addedby.password AS modu_inst_addedby_password,
                         modu_inst_addedby.active AS modu_inst_addedby_active,
                     modu_inst.updatedby AS modu_inst_updatedby,
                         modu_inst_updatedby.userID AS modu_inst_updatedby_userID,
                         modu_inst_updatedby.dateadded AS modu_inst_updatedby_dateadded,
                         modu_inst_updatedby.dateupdated AS modu_inst_updatedby_dateupdated,
                         modu_inst_updatedby.firstname AS modu_inst_updatedby_firstname,
                         modu_inst_updatedby.lastname AS modu_inst_updatedby_lastname,
                         modu_inst_updatedby.email AS modu_inst_updatedby_email,
                         modu_inst_updatedby.contactnumber AS modu_inst_updatedby_contactnumber,
                         modu_inst_updatedby.password AS modu_inst_updatedby_password,
                         modu_inst_updatedby.active AS modu_inst_updatedby_active,
                     modu_user_addedby.userID AS modu_user_addedby_userID,
                     modu_user_addedby.dateadded AS modu_user_addedby_dateadded,
                     modu_user_addedby.dateupdated AS modu_user_addedby_dateupdated,
                     modu_user_addedby.firstname AS modu_user_addedby_firstname,
                     modu_user_addedby.lastname AS modu_user_addedby_lastname,
                     modu_user_addedby.email AS modu_user_addedby_email,
                     modu_user_addedby.contactnumber AS modu_user_addedby_contactnumber,
                     modu_user_addedby.password AS modu_user_addedby_password,
                     modu_user_addedby.active AS modu_user_addedby_active,
                     modu_user_updatedby.userID AS modu_user_updatedby_userID,
                     modu_user_updatedby.dateadded AS modu_user_updatedby_dateadded,
                     modu_user_updatedby.dateupdated AS modu_user_updatedby_dateupdated,
                     modu_user_updatedby.firstname AS modu_user_updatedby_firstname,
                     modu_user_updatedby.lastname AS modu_user_updatedby_lastname,
                     modu_user_updatedby.email AS modu_user_updatedby_email,
                     modu_user_updatedby.contactnumber AS modu_user_updatedby_contactnumber,
                     modu_user_updatedby.password AS modu_user_updatedby_password,
                     modu_user_updatedby.active AS modu_user_updatedby_active FROM (
                 SELECT genex.serialnumber AS unique_genexpert_serial_number
                 FROM genexpert genex
                 LEFT JOIN engineer genex_eng ON genex_eng.engineerID = genex.engineerID
                         LEFT JOIN user genex_eng_addedby ON genex_eng_addedby.userID = genex_eng.addedby
                         LEFT JOIN user genex_eng_updatedby ON genex_eng_updatedby.userID = genex_eng.updatedby
                     LEFT JOIN installationtype genex_inst ON genex_inst.itID = genex.itID
                         LEFT JOIN user genex_inst_addedby ON genex_inst_addedby.userID = genex_inst.addedby
                         LEFT JOIN user genex_inst_updatedby ON genex_inst_updatedby.userID = genex_inst.updatedby
                     LEFT JOIN modelnumber genex_mode ON genex_mode.mnID = genex.mnID 
                         LEFT JOIN user genex_mode_addedby ON genex_mode_addedby.userID = genex_mode.addedby
                         LEFT JOIN user genex_mode_updatedby ON genex_mode_updatedby.userID = genex_mode.updatedby
                     LEFT JOIN site genex_faci ON genex_faci.siteID = genex.siteID
                         LEFT JOIN user genex_faci_addedby ON genex_faci_addedby.userID  = genex_faci.addedby
                         LEFT JOIN user genex_faci_updatedby ON genex_faci_updatedby.userID  = genex_faci.updatedby	
                         LEFT JOIN contact genex_faci_cont ON genex_faci_cont.siteID = genex_faci.siteID
                     LEFT JOIN user genex_user_addedby ON genex_user_addedby.userID = genex.addedby
                     LEFT JOIN user genex_user_updatedby ON genex_user_updatedby.userID = genex.updatedby
                     LEFT JOIN assaystatistic assay ON assay.genexpertSN = genex.serialnumber
                         LEFT JOIN user assay_addedby ON assay_addedby.userID = assay.addedby
                         LEFT JOIN user assay_updatedby ON assay_updatedby.userID = assay.updatedby	
                     LEFT JOIN peripheral peri ON peri.genexpertSN = genex.serialnumber
                         LEFT JOIN user peri_addedby ON peri_addedby.userID = peri.addedby
                         LEFT JOIN user peri_updatedby ON peri_updatedby.userID = peri.updatedby	
                 LEFT JOIN module modu ON modu.genexpertSN = genex.serialnumber
                     LEFT JOIN engineer modu_eng ON modu_eng.engineerID = modu.engineerID
                         LEFT JOIN user modu_eng_addedby ON modu_eng_addedby.userID = modu_eng.addedby
                         LEFT JOIN user modu_eng_updatedby ON modu_eng_updatedby.userID = modu_eng.updatedby
                     LEFT JOIN installationtype modu_inst ON modu_inst.itID = modu.itID
                         LEFT JOIN user modu_inst_addedby ON modu_inst_addedby.userID = modu_inst.addedby
                         LEFT JOIN user modu_inst_updatedby ON modu_inst_updatedby.userID = modu_inst.updatedby	
                     LEFT JOIN user modu_user_addedby ON modu_user_addedby.userID = modu.addedby
                     LEFT JOIN user modu_user_updatedby ON modu_user_updatedby.userID = modu.updatedby
                     LEFT JOIN 
                     (SELECT * FROM (SELECT MAX(a.dateupdated) AS latest, a.serialnumber AS sn FROM genexpert a 
                     GROUP BY a.serialnumber) aa ) xxx ON xxx.latest = genex.dateupdated AND 
                     xxx.sn = genex.serialnumber 
                 WHERE 1=1 ${filter} GROUP BY genex.serialnumber ${orderStatement} 
                 ${limitStatement} ${offsetStatement}) xx 
                 LEFT JOIN genexpert genex ON genex.serialnumber = xx.unique_genexpert_serial_number
                     LEFT JOIN engineer genex_eng ON genex_eng.engineerID = genex.engineerID
                         LEFT JOIN user genex_eng_addedby ON genex_eng_addedby.userID = genex_eng.addedby
                         LEFT JOIN user genex_eng_updatedby ON genex_eng_updatedby.userID = genex_eng.updatedby
                     LEFT JOIN installationtype genex_inst ON genex_inst.itID = genex.itID
                         LEFT JOIN user genex_inst_addedby ON genex_inst_addedby.userID = genex_inst.addedby
                         LEFT JOIN user genex_inst_updatedby ON genex_inst_updatedby.userID = genex_inst.updatedby
                     LEFT JOIN modelnumber genex_mode ON genex_mode.mnID = genex.mnID 
                         LEFT JOIN user genex_mode_addedby ON genex_mode_addedby.userID = genex_mode.addedby
                         LEFT JOIN user genex_mode_updatedby ON genex_mode_updatedby.userID = genex_mode.updatedby
                     LEFT JOIN site genex_faci ON genex_faci.siteID = genex.siteID
                         LEFT JOIN user genex_faci_addedby ON genex_faci_addedby.userID  = genex_faci.addedby
                         LEFT JOIN user genex_faci_updatedby ON genex_faci_updatedby.userID  = genex_faci.updatedby	
                         LEFT JOIN contact genex_faci_cont ON genex_faci_cont.siteID = genex_faci.siteID
                     LEFT JOIN user genex_user_addedby ON genex_user_addedby.userID = genex.addedby
                     LEFT JOIN user genex_user_updatedby ON genex_user_updatedby.userID = genex.updatedby
                 LEFT JOIN assaystatistic assay ON assay.genexpertSN = xx.unique_genexpert_serial_number
                         LEFT JOIN user assay_addedby ON assay_addedby.userID = assay.addedby
                         LEFT JOIN user assay_updatedby ON assay_updatedby.userID = assay.updatedby	
                     LEFT JOIN peripheral peri ON peri.genexpertSN = xx.unique_genexpert_serial_number
                         LEFT JOIN user peri_addedby ON peri_addedby.userID = peri.addedby
                         LEFT JOIN user peri_updatedby ON peri_updatedby.userID = peri.updatedby	
                 LEFT JOIN (SELECT * FROM (
                    SELECT 'Current' AS statusHistory,moduleID,dateadded,dateupdated,genexpertSN,serialnumber,revision_number,part_number,
                    STATUS,addedby,updatedby,location,dateinstalled,itID,engineerID FROM module 
                    ) xxx) modu ON modu.genexpertSN = xx.unique_genexpert_serial_number
                     LEFT JOIN engineer modu_eng ON modu_eng.engineerID = modu.engineerID
                         LEFT JOIN user modu_eng_addedby ON modu_eng_addedby.userID = modu_eng.addedby
                         LEFT JOIN user modu_eng_updatedby ON modu_eng_updatedby.userID = modu_eng.updatedby
                     LEFT JOIN installationtype modu_inst ON modu_inst.itID = modu.itID
                         LEFT JOIN user modu_inst_addedby ON modu_inst_addedby.userID = modu_inst.addedby
                         LEFT JOIN user modu_inst_updatedby ON modu_inst_updatedby.userID = modu_inst.updatedby	
                     LEFT JOIN user modu_user_addedby ON modu_user_addedby.userID = modu.addedby
                     LEFT JOIN user modu_user_updatedby ON modu_user_updatedby.userID = modu.updatedby
                     LEFT JOIN 
                     (SELECT * FROM (SELECT MAX(a.dateupdated) AS latest, a.serialnumber AS sn FROM genexpert a 
                     GROUP BY a.serialnumber) aa ) xxx ON xxx.latest = genex.dateupdated AND 
                     xxx.sn = genex.serialnumber  
                     WHERE 1=1 ORDER BY genex.dateupdated DESC
             ) aa 
             LEFT JOIN (
                 SELECT MAX(a.dateupdated) AS mod_latest, a.serialnumber AS sn FROM module a 
                 GROUP BY a.serialnumber
                 ) xx ON xx.sn = aa.modu_serialnumber AND xx.mod_latest = aa.modu_dateupdated 
             WHERE 1=1 ORDER BY aa.genex_dateupdated DESC`;

            //    UNION ALL 
            // SELECT 'Record' AS statusHistory,moduleID,dateadded,dateupdated,genexpertSN,serialnumber,revision_number,part_number,
            // STATUS,addedby,updatedby,location,dateinstalled,itID,engineerID 
            // FROM module_records
        }

        function checkExist(serialNumber){
            return `SELECT serialnumber FROM genexpert WHERE serialnumber="${serialNumber}"`;
        }

     
        function genexpertPullout(data){
            return `UPDATE genexpert SET status="Terminated",
            updatedby=${self.acctJSON["online"]['userID']},
            dateupdated="${getOnDate(data['date-pullout'])}",
            remarks="${data['remarks']}",lastTransaction="pull-out"
            WHERE serialnumber="${data['serial-number']}"`;
        }


        function getIDAfterTransaction(serialnumber){
            return `SELECT genexpertID FROM genexpert WHERE serialnumber="${serialnumber}"`;
        }

        function getRecords(filter ="",limit=50,offset=0){


            return `SELECT * FROM genexpert_records a
            LEFT JOIN engineer b ON b.engineerID = a.engineerID 
            LEFT JOIN installationtype c ON c.itID = a.itID 
            LEFT JOIN modelnumber d ON d.mnID = a.mnID 
            LEFT JOIN site e ON e.siteID = a.siteID
            LEFT JOIN user f ON f.userID = a.addedby 
            LEFT JOIN user g ON g.userID = a.updatedby 
            WHERE 1=1 ${filter}
            ORDER BY a.serialnumber`;
        }

        function transaction(){

            function installation(datas){

                const d = datas['genexpert'];
                return `INSERT INTO genexpert(serialnumber,siteID,engineerID,dateinstalled,itID,mnID,software_version
                    ,os_version,warranty_expiry_date,service_contract_expiry_date,status,
                    remarks,addedby,updatedby,lastTransaction,transactionID)
                    SELECT 
                    "${d['serial-number']}" AS sn,
                    (SELECT siteID FROM site WHERE siteName="${d['site']}") AS sID,
                    ${d['installed-by']} AS engID,
                    "${d['date-installed'] == ""? "0001-01-01":toDateTimeString(d['date-installed'])}" AS din,
                    ${d['installation-type']} AS itI,
                    ${d['model-number']} AS mnI,
                    "${d['software-version']}" AS sove,
                    "${d['os-version']}" AS osve,
                    "${d['warranty-expiry-date'] == ""? "0001-01-01":toDateTimeString(d['warranty-expiry-date'])}" AS wed,
                    "${d['service-contract-expiry-date'] == ""? "0001-01-01":toDateTimeString(d['service-contract-expiry-date'])}" AS sced,
                    "Active" AS stat,
                    "${d['remarks']}" AS rem,
                    ${self.acctJSON["online"]['userID']} AS adby,
                    ${self.acctJSON["online"]['userID']} AS upby,
                    "Installation" AS lastrans,
                    ${self.getTransID()} AS tID 
                    WHERE NOT EXISTS (SELECT serialnumber FROM genexpert 
                        WHERE serialnumber="${d['serial-number']}")`;
            }

            function repair(datas){
                const d = datas;
                return `UPDATE genexpert SET remarks="${d['remarks']}",
                dateupdated="${getOnDate()}",repairby=${d['engineer']},
                repairdate="${getOnDate(d['date-repair'])}",
                transactionID = ${self.getTransID()} 
                WHERE serialnumber="${d['serial-number']}"`;
            }

            function transfer(datas){

                const d = datas;
                return `
                UPDATE genexpert SET siteID = 
                (facilityEntry_w_return(
                    "${d['new-facility']}",
                    "${d['region']}",
                    "${d['province']}",
                    "${d['city']}",
                    "${d['barangay']}",
                    "${d['street']}",
                    "${d['longitude']}",
                    "${d['latitude']}",
                    ${self.acctJSON["online"]['userID']},
                    ${self.acctJSON["online"]['userID']})),
                    dateinstalled="${getOnDate(d['date-installed'])}",
                    updatedby=${self.acctJSON["online"]['userID']},
                    remarks="${d['remarks']}",
                    lastTransaction="transfer",
                    status="Active",
                    transferby=${d['transfer-by']} ,
                    dateupdated="${getOnDate()}",
                    transferdate="${getOnDate(d['date-installed'])}",
                    transactionID = ${self.getTransID()}  
                    WHERE serialnumber="${d['serial-number']}"`;
            }

            function pullout(datas){

                const d = datas;
                return `UPDATE genexpert SET status="Terminated",
                updatedby=${self.acctJSON["online"]['userID']},
                dateupdated="${getOnDate(d['date-pullout'])}",
                pulloutdate="${getOnDate(d['date-pullout'])}",
                pulloutby=${d['engineer']},
                remarks="${d['remarks']}",
                lastTransaction="pull-out",
                transactionID = ${self.getTransID()} 
                WHERE serialnumber="${d['serial-number']}"`;
            }

            function others(datas){

                const d = datas;
                return `UPDATE genexpert SET ,
                updatedby=${self.acctJSON["online"]['userID']},
                dateupdated="${getOnDate(d['date-of'])}",
                othersdate="${getOnDate(d['date-pullout'])}",
                othersby=${d['engineer']},
                remarks="${d['remarks']}",
                lastTransaction="others - ${d['other-specify']}",
                transactionID = ${self.getTransID()} 
                WHERE serialnumber="${d['serial-number']}"`;
            }

            function history(serialnumber){
                return `SELECT 
                a.transID,
                a.transDate,
                a.facility,
                a.department,
                a.equipment,
                g.mnName,
                a.serialnumber AS genexpertSN,
                a.typeofService,
                a.need_service_report,
                a.sc_number,
                a.connect_jotform,
                a.jotform_ticketNo,
                CONCAT(h.firstname," ",h.lastname) AS transactedby 
                FROM transactions a
                LEFT JOIN genexpert b ON b.transactionID = a.transID
                LEFT JOIN module c ON c.transID = a.transID
                LEFT JOIN xpertcheck d ON d.transID = a.transID
                LEFT JOIN preventive_maintenance e ON e.transID = a.transID
                LEFT JOIN service_report f ON f.service_report_num = a.sc_number
                LEFT JOIN modelnumber g ON g.mnID = a.model 
                LEFT JOIN user h ON h.userID = a.transactby 
                WHERE a.serialnumber = "${serialnumber}"`;
            }
    
            return {installation,repair,transfer,pullout,others,history};
        }

        function SAP(genexpertDatas,moduleDatas,assayDatas){

            const genexpertStatementsList = [];

            const moduleStatementsList = [];
            const assayStatementsList = [];


            function genexpertStatements(datas){

                datas.forEach(obj => {

                    const data = Object.values(obj);

                    data[0].forEach((d,i)=>{


                        const site = d['site'] ? d['site']
                        .replaceAll('"','\\"').replaceAll("'","\\'"):d['site'];
                        const instType = d['installation-type'] ? 
                        d['installation-type']
                                .replaceAll('"','\\"').replaceAll("'","\\'"): d['installation-type'];

                        const modelnumber = d['model-number'] ?d['model-number'].
                        replaceAll('"','\\"').replaceAll("'","\\'"):d['modelnumber'];
                       
                        if(i == 0){
                            genexpertStatementsList.push(`INSERT INTO genexpert(serialnumber,siteID,engineerID,dateinstalled,
                                itID,mnID,status,addedby,updatedby,lastTransaction,transactionID)
                                SELECT 
                                "${d['serial-number']}" AS sn,
                                (facilityEntry_w_return(
                                    "${site}",
                                    "N/A",
                                    "N/A",
                                    "N/A",
                                    "N/A",
                                    "N/A",
                                    "N/A",
                                    "N/A",
                                    ${self.acctJSON["online"]['userID']},
                                    ${self.acctJSON["online"]['userID']})) AS sID,
                                (installEngineer("${d['technician']}",
                                ${self.acctJSON["online"]['userID']},
                                ${self.acctJSON["online"]['userID']})) AS engID,
                                "${d['date-installed'] ? 
                                getOnDate(d['date-installed']):"0001-01-01"}" AS din,
                                (installInstallationType("${instType}", 
                                ${self.acctJSON["online"]['userID']},
                                ${self.acctJSON["online"]['userID']})) AS itI,
                                (installModelNumber("${modelnumber}", 
                                ${self.acctJSON["online"]['userID']},
                                ${self.acctJSON["online"]['userID']})) AS mnI,
                                "${d['status']}" AS stat,
                                ${self.acctJSON["online"]['userID']} AS adby,
                                ${self.acctJSON["online"]['userID']} AS upby,
                                "Installation" AS lastrans,
                                0 AS tID`);
                        }else{
                            genexpertStatementsList.push(`INSERT INTO genexpert_records(dateadded,dateupdated,genexpertID,serialnumber,siteID,engineerID,dateinstalled,
                                itID,mnID,status,addedby,updatedby,record_action,transactionID)
                                SELECT 
                                "${getOnDate()}" AS dadded,
                                "${getOnDate()}" AS dupdated,
                                0 AS genID,
                                "${d['serial-number']}" AS sn,
                                (facilityEntry_w_return(
                                    "${site}",
                                    "N/A",
                                    "N/A",
                                    "N/A",
                                    "N/A",
                                    "N/A",
                                    "N/A",
                                    "N/A",
                                    ${self.acctJSON["online"]['userID']},
                                    ${self.acctJSON["online"]['userID']})) AS sID,
                                (installEngineer("${d['technician']}",
                                ${self.acctJSON["online"]['userID']},
                                ${self.acctJSON["online"]['userID']})) AS engID,
                                "${d['date-installed'] ? 
                                getOnDate(d['date-installed']):"0001-01-01"}" AS din,
                                (installInstallationType("${instType}", 
                                ${self.acctJSON["online"]['userID']},
                                ${self.acctJSON["online"]['userID']})) AS itI,
                                (installModelNumber("${d['model-number']
                                .replaceAll('"','\\"').replaceAll("'","\\'")}", 
                                ${self.acctJSON["online"]['userID']},
                                ${self.acctJSON["online"]['userID']})) AS mnI,
                                "${d['status']}" AS stat,
                                ${self.acctJSON["online"]['userID']} AS adby,
                                ${self.acctJSON["online"]['userID']} AS upby,
                                "Installation" AS lastrans,
                                0 AS tID`);
                        }
                    });
                    
                });


            }

            function moduleStatements(datas){

                datas.forEach(obj => {

                    const data = Object.values(obj);

                    data[0].forEach((d,i)=>{

                       
                        const instType = d['installation-type'] ? 
                        d['installation-type']
                                .replaceAll('"','\\"').replaceAll("'","\\'"): d['installation-type'];

                        if(i == 0){

                            moduleStatementsList.push(`
                            INSERT INTO module(genexpertSN,serialnumber,location,itID,engineerID
                                ,dateinstalled,status,revision_number,part_number,addedby,updatedby,
                                transID) 
                                SELECT 
                                "${d['genexpert-serial-number']}" AS gSN,
                                "${d['module-serial-number']}" AS mSN,
                                "${d['location']}" AS loc,
                                (installInstallationType("${instType}", 
                                ${self.acctJSON["online"]['userID']},
                                ${self.acctJSON["online"]['userID']})) AS itI,
                                (installEngineer("${d['technician']}",
                                ${self.acctJSON["online"]['userID']},
                                ${self.acctJSON["online"]['userID']})) AS engID,
                                "${d['date-installed'] ?
                                getOnDate(d['date-installed']):'0001-01-01'}" AS din,
                                "${d['status']}" AS stat,
                                "N/A" AS ren,
                                "N/A" AS pan,
                                ${self.acctJSON["online"]['userID']} AS adby,
                                ${self.acctJSON["online"]['userID']} AS upby,
                                0 AS tID`);
                        }else{
                            moduleStatementsList.push(`
                            INSERT INTO module_records(dateadded,dateupdated,genexpertSN,serialnumber,location,itID,engineerID
                                ,dateinstalled,status,revision_number,part_number,addedby,updatedby,
                                transID) 
                                SELECT
                                "${getOnDate()}" AS dadded,
                                "${getOnDate()}" AS dupdated, 
                                "${d['genexpert-serial-number']}" AS gSN,
                                "${d['module-serial-number']}" AS mSN,
                                "${d['location']}" AS loc,
                                (installInstallationType("${instType}", 
                                ${self.acctJSON["online"]['userID']},
                                ${self.acctJSON["online"]['userID']})) AS itI,
                                (installEngineer("${d['technician']}",
                                ${self.acctJSON["online"]['userID']},
                                ${self.acctJSON["online"]['userID']})) AS engID,
                                "${d['date-installed'] ?
                                getOnDate(d['date-installed']):'0001-01-01'}" AS din,
                                "${d['status']}" AS stat,
                                "N/A" AS ren,
                                "N/A" AS pan,
                                ${self.acctJSON["online"]['userID']} AS adby,
                                ${self.acctJSON["online"]['userID']} AS upby,
                                0 AS tID`);
                        }
                    });
                    
                });
            }

            function assayStatements(datas){


                datas.forEach(obj => {

                    const genexpert = Object.keys(obj);
                    const data = Object.values(obj);

                    data[0].forEach((d,i)=>{

                        assayStatementsList.push(`
                        INSERT INTO assaystatistic(genexpertSN,dateadded,test,
                            quantity,addedby,updatedby,active,
                            transID)
                        VALUES(
                        "${genexpert}",
                        "${d['date-installed'] ? getOnDate(d['date-installed']):"0001-01-01"}",    
                        "N/A","${d['assay']}",
                        ${self.acctJSON["online"]['userID']},
                        ${self.acctJSON["online"]['userID']},true,
                        0
                        )`);
                    });

                });

            }

            genexpertStatements(genexpertDatas);
            moduleStatements(moduleDatas);
            assayStatements(assayDatas);

            return {
                "genexperts":genexpertStatementsList,
                "modules":moduleStatementsList,
                "assays":assayStatementsList
            }
        }

        return {genexpertSearch,genexpertTransfer,
            getGenexpertStatement,getTotalGenexpertStatement,checkExist,transaction,
            genexpertPullout,getIDAfterTransaction,findGenexpertViaSerialNumber,
            genexpertUpdates,getRecords,genexpertUpdateOnModuleReplacement,
            getGenexpertViaFacility,getEntireIndividualGenexpert,SAP};
    }

    process(){

        var self = this;
        
        function SAPProcess(genexpertDatas,moduleDatas,assayDatas,callback){

            const {genexperts,modules,assays} = self.statements()
            .SAP(genexpertDatas,moduleDatas,assayDatas);

            const loaderbox = $(".ldg-box-01 > h3");

            async function onMessage(msg){
                loaderbox.html(msg);
            }

            function cycleProcess(title,count,datas,callback){

                if(count < datas.length){

                    self.inquireDatabase({"statement":datas[count]},function(){
                        const msg = `${title} ${Math.ceil((count/datas.length) * 100) } %`;
                        onMessage(msg);
                        count++;
                        cycleProcess(title,count,datas,callback);
                    });
                }else{
                    callback();
                }

            }



            cycleProcess("Genexpert Process ",0,genexperts,function(){
                cycleProcess("Module Process ",0,modules,function(){
                    cycleProcess("Assay Statistic Process",0,assays,callback);
                });
                //callback();
           });

        }

        function genexpertSearch(search_item,callback){
            self.inquireDatabase({
                "statement":self.statements().genexpertSearch(search_item),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }

        function findGenexpertViaSerialNumber(serialNumber,callback){
            self.inquireDatabase({
                "statement":self.statements().findGenexpertViaSerialNumber(serialNumber),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }

        function genexpertPullout(datas,callback){

            self.inquireDatabase({
                "statement":self.statements().genexpertPullout(datas)
            },function(){

                self.inquireDatabase({
                    "statement":self.statements().getIDAfterTransaction(datas['serial-number']),
                    "results":function(res){
                        callback(JSON.parse(JSON.stringify(res))[0]);
                    }

                });

            });
        }

        function getRecords(){
            self.inquireDatabase({
                "statement":self.statements().getRecords(),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }

        function genexpertTransfer(callback){

            const entry = genexpertView.transaction().transfer().getOnTransferEntry();

            self.inquireDatabase({
                "statement":self.statements().genexpertTransfer()
            },callback(entry));
    
        }


        function genexpertTotal(options){
            self.inquireDatabase({
                "statement":self.statements().getTotalGenexpertStatement(options['filters']),
                "results":function(res){
                    options['results'](JSON.parse(JSON.stringify(res)));
                }
            },options['done']);
        }

        function getGenexpert(options){
            self.inquireDatabase({
                "statement":self.statements().getGenexpertStatement(
                    options['filters'],options['limit'],options['offset']),
                "results":function(res){
                    options['results'](JSON.parse(JSON.stringify(res)));
                }
            },options['done']);


        }

        function checkExist(serialnumber,ifexist,ifnotexist){
         
            self.inquireDatabase({
                "statement":self.statements().checkExist(serialnumber),
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

        function transaction(){

            function installation(datas,callback){
            
                self.inquireDatabase({
                    "statement":self.statements().transaction().installation(datas)
                },callback);
            }

            function repair(datas,callback){
            
                self.inquireDatabase({
                    "statement":self.statements().transaction().repair(datas)
                },callback);
            }

            function transfer(datas,callback){
            
                self.inquireDatabase({
                    "statement":self.statements().transaction().transfer(datas)
                },callback);
            }

            function pullout(datas,callback){
            
                self.inquireDatabase({
                    "statement":self.statements().transaction().pullout(datas)
                },callback);
            }

            function others(datas,callback){
            
                self.inquireDatabase({
                    "statement":self.statements().transaction().others(datas)
                },callback);
            }

            function history(serialnumber,callback){
                self.inquireDatabase({
                    "statement":self.statements().transaction().history(serialnumber),
                    "results":function(res){
                        callback(JSON.parse(JSON.stringify(res)));
                    }
                });
            }



            return {installation,repair,transfer,pullout,others,history};
        }

        function assayStatisticEntriesOnGenexpert(datas,insertAssayStatistic,callback){

            const completeDatas = [];
            datas['assaystatistics'].forEach(assay => {
                assay["logged-by"] = self.acctJSON["online"]['userID'];
                assay['assay-genexpert'] = datas['genexpert']['serial-number'];
                completeDatas.push(assay);
            });

            function onProcess(count,callback){

                if(count < completeDatas.length){

                   insertAssayStatistic(completeDatas[count],function(){
                       count++;
                       onProcess(count,callback);
                   });

                }else{
                    callback();
                }

            }

            onProcess(0,callback);
        }

        function peripheralEntriesOnGenexpert(datas,insertPeripheral,callback){

            const completeDatas = [];

            datas['peripherals'].forEach(peri => {
                peri["logged-by"] = self.acctJSON["online"]['userID'];
                peri['peripheral-genexpert'] = datas['genexpert']['serial-number'];
                completeDatas.push(peri);
            });
           
            function onProcess(count,callback){

                if(count < completeDatas.length){

                    insertPeripheral(completeDatas[count],function(){
                       count++;
                       onProcess(count,callback);
                   });

                }else{
                    callback();
                }

            }

            onProcess(0,callback);
        }

        function moduleEntriesOnGenexpert(datas,insertModule,callback){

            const completeDatas = [];

            datas['modules'].forEach(modu => {
                modu["logged-by"] = self.acctJSON["online"]['userID'];
                modu['module-genexpert'] = datas['genexpert']['serial-number'];
                completeDatas.push(modu);
            });
           
            function onProcess(count,callback){

                if(count < completeDatas.length){

                    insertModule(completeDatas[count],function(){
                       count++;
                       onProcess(count,callback);
                   });

                }else{
                    callback();
                }

            }

            onProcess(0,callback);
        }

        function singleEntryProcess(datas,funcs,callback){
            

            // INSERTING PROCESS

            // facility or site
            funcs[0](datas['genexpert'],function(){

                // contacts
                funcs[1](datas['genexpert'],function(){
                    // genexpert
                    transaction().installation(datas,function(){
                            // assayStatistic
                            assayStatisticEntriesOnGenexpert(datas,
                                funcs[2],function(){
                                    // peripheral 
                                peripheralEntriesOnGenexpert(datas,
                                    funcs[3],callback);
                            });
                            
                       
                    });
                });
            });


        }

        function genexpertUpdateDatas(datas,facilityFunc,contactCreateFunc
            ,contactEditFunc,assayCreateFunc,assayEditFunc,insertPeripheralFunc,
            updatePeripheralFunc,updateModuleFunc,callback){

            const genexpert_serial_number = datas.filter(d=>{
                return d['genexpert-serial-number'];
            })[0]['genexpert-serial-number'];

            const genexperts =  datas.filter(d=>{
                return d['genexpert'];
            });

            function siteProcess(callback){
                const sites = datas.filter(d=>{
                    return d['site'];
                });
    
                if(sites.length != 0){


                    facilityFunc(sites[0]['site'],function(){
                         // to change last update

                         if(genexperts.length == 0){
                            let setsForLastUpdate = `updatedby=${self.acctJSON["online"]['userID']}`
                            let whereSN = ` WHERE serialnumber="${genexpert_serial_number}"`;
                            self.inquireDatabase({
                                "statement":self.statements().genexpertUpdates(setsForLastUpdate,whereSN),
                            },callback);
                         }else{
                             callback();
                         }
                       
                    });
                    
                   


                }else{
                    callback();
                }

            }

            function genexpertProcess(callback){


                if(genexperts.length != 0){

                    let sets  = "";

                    genexperts[0]['genexpert'].forEach((d,i)=>{
                        if(i > 0){
                            sets+=",";
                        }
                        sets += `${d['field']}="${d['value']}"`;
                        
                    });

                    let where = ` WHERE serialnumber="${genexpert_serial_number}"`;
                    
                    self.inquireDatabase({
                        "statement":self.statements().genexpertUpdates(sets,where),
                    },callback);

                }else{
                    callback();
                }


               

            }

            function contactProcess(callback){

                const contacts = datas.filter(d=>{
                    return d['contacts'];
                });
    
                if(contacts.length != 0){
                    let d = contacts[0]['contacts'][0];


                    if(d['new']){
                        

                        d['new'].forEach(n=>{

                            contactCreateFunc(n,function(){
                                if(genexperts.length == 0){
                                    let setsForLastUpdate = `updatedby=${self.acctJSON["online"]['userID']}`
                                    let whereSN = ` WHERE serialnumber="${genexpert_serial_number}"`;
                                    self.inquireDatabase({
                                        "statement":self.statements().genexpertUpdates(setsForLastUpdate,whereSN),
                                    },callback);
                                }else{
                                    callback();
                                }
                            });

                        });
                        

                    }else if(d['edit']){

                        d['edit'].forEach(e=>{
                            contactEditFunc(e,function(){
                                if(genexperts.length == 0){
                                    let setsForLastUpdate = `updatedby=${self.acctJSON["online"]['userID']}`
                                    let whereSN = ` WHERE serialnumber="${genexpert_serial_number}"`;
                                    self.inquireDatabase({
                                        "statement":self.statements().genexpertUpdates(setsForLastUpdate,whereSN),
                                    },callback);
                                }else{
                                    callback();
                                }
                            });
                        });
                        
                    }else{
                        callback();
                    }

                }else{
                    callback();
                }


            }

            function assaystatisticProcess(callback){

                const assaystatistics = datas.filter(d=>{
                    return d['assaystatistics'];
                });
    
                if(assaystatistics.length != 0){
                    let d = assaystatistics[0]['assaystatistics'][0];


                    if(d['new']){
                        

                        d['new'].forEach(n=>{

                            assayCreateFunc(n,function(){
                                if(genexperts.length == 0){
                                    let setsForLastUpdate = `updatedby=${self.acctJSON["online"]['userID']}`
                                    let whereSN = ` WHERE serialnumber="${genexpert_serial_number}"`;
                                    self.inquireDatabase({
                                        "statement":self.statements().genexpertUpdates(setsForLastUpdate,whereSN),
                                    },callback);
                                }else{
                                    callback();
                                }
                            });
 
                        });
                        

                    }else if(d['edit']){

                        d['edit'].forEach(e=>{
                            assayEditFunc(e,function(){

                                if(genexperts.length == 0){
                                    let setsForLastUpdate = `updatedby=${self.acctJSON["online"]['userID']}`
                                    let whereSN = ` WHERE serialnumber="${genexpert_serial_number}"`;
                                    self.inquireDatabase({
                                        "statement":self.statements().genexpertUpdates(setsForLastUpdate,whereSN),
                                    },callback);
                                }else{
                                     callback();
                                }
                            });
                        });
                        
                    }else{
                        callback();
                    }

                }else{
                    callback();
                }


            }

            function peripheralProcess(callback){

                const peripherals = datas.filter(d=>{
                    return d['peripherals'];
                });
    
                if(peripherals.length != 0){
                    let d = peripherals[0]['peripherals'][0];


                    if(d['new']){
                        

                        d['new'].forEach(n=>{

                            insertPeripheralFunc(n,function(){
                                if(genexperts.length == 0){
                                    let setsForLastUpdate = `updatedby=${self.acctJSON["online"]['userID']}`
                                    let whereSN = ` WHERE serialnumber="${genexpert_serial_number}"`;
                                    self.inquireDatabase({
                                        "statement":self.statements().genexpertUpdates(setsForLastUpdate,whereSN),
                                    },callback);
                                }else{
                                     callback();
                                }
                            });

                        });
                        

                    }else if(d['edit']){

                        d['edit'].forEach(e=>{
                            updatePeripheralFunc(e,function(){
                                if(genexperts.length == 0){
                                    let setsForLastUpdate = `updatedby=${self.acctJSON["online"]['userID']}`
                                    let whereSN = ` WHERE serialnumber="${genexpert_serial_number}"`;
                                    self.inquireDatabase({
                                        "statement":self.statements().genexpertUpdates(setsForLastUpdate,whereSN),
                                    },callback);
                                }else{
                                    callback();
                                }
                            });
                           
                        });
                        
                    }else{
                        callback();
                    }

                }else{
                    callback();
                }


            }


            function moduleProcess(callback){

                const modules = datas.filter(d=>{
                    return d['modules'];
                });
    
                if(modules.length != 0){
                    let d = modules[0]['modules'][0];


                    if(d['new']){
                        
                        // Proceed to transaction
                        

                    }else if(d['edit']){

                        d['edit'].forEach(e=>{
                            updateModuleFunc(e,function(){
                                if(genexperts.length == 0){
                                    let setsForLastUpdate = `updatedby=${self.acctJSON["online"]['userID']}`
                                    let whereSN = ` WHERE serialnumber="${genexpert_serial_number}"`;
                                    self.inquireDatabase({
                                        "statement":self.statements().genexpertUpdates(setsForLastUpdate,whereSN),
                                    },callback);
                                 }else{
                                     callback();
                                 }
                            });
                            
                        });
                        
                    }else{
                        callback();
                    }

                }else{
                    callback();
                }


            }


         
            siteProcess(function(){
                contactProcess(function(){
                    assaystatisticProcess(function(){
                        peripheralProcess(function(){
                            moduleProcess(function(){
                                genexpertProcess(callback);
                            });
                        });
                        
                    });
                    
                });
                
            });

            
            

        }

        function genexpertUpdateOnModuleReplacement(serialnumber,callback){
            self.inquireDatabase({
                "statement":self.statements().genexpertUpdateOnModuleReplacement(serialnumber),
            },callback);
        }

        function getGenexpertViaFacility(facility,callback){
            self.inquireDatabase({
                "statement":self.statements().getGenexpertViaFacility(facility),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }


        function getEntireIndividualGenexpert(callback){
            self.inquireDatabase({
                "statement":self.statements().getEntireIndividualGenexpert(),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }


        return {genexpertSearch,genexpertTransfer,genexpertTotal,
            getGenexpert,checkExist,singleEntryProcess,genexpertPullout,
            findGenexpertViaSerialNumber,genexpertUpdateDatas,getRecords,
            genexpertUpdateOnModuleReplacement,getGenexpertViaFacility
            ,getEntireIndividualGenexpert,transaction,SAPProcess};
    }
}
const genexpertModel = new GenexpertModel();
module.exports = genexpertModel;