const { inquireDatabase } = require("../../databases/ApplicationDatabase");

class GenexpertTransactionModel{

    constructor(){}

    statements(){

        function searchGenexpertforTransfer(lookFor){

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
         a.serialnumber LIKE "%${lookFor}%" OR
         c.itName LIKE "%${lookFor}%" OR
         b.siteName LIKE "%${lookFor}%" OR
         e.mnName LIKE "%${lookFor}%" OR
         d.fullname LIKE "%${lookFor}%" OR
         a.software_version LIKE "%${lookFor}%" OR
         a.os_version LIKE "%${lookFor}%" OR
         b.region LIKE "%${lookFor}%" OR
         b.province LIKE "%${lookFor}%" OR
         b.city LIKE "%${lookFor}%" OR
         b.barangay LIKE "%${lookFor}%" OR
         b.complete_address LIKE "%${lookFor}%"`;

        }

        function transferGenexpert(siteName,serialnumber){
            return `UPDATE genexpert SET siteID 
            =(SELECT siteID FROM site WHERE siteName="${siteName}") WHERE 
            serialnumber="${serialnumber}"`;
        }


        return {searchGenexpertforTransfer,transferGenexpert};


    }

    onSearchviaTransfer(lookFor,callback){

        inquireDatabase({
            "statement":this.statements().searchGenexpertforTransfer(lookFor),
            "results":function(res){
                callback(JSON.parse(JSON.stringify(res)));
            }
        },function(){});

    }

    onTransferProcess(siteName,serialnumber,callback){

        inquireDatabase({
            "statement":this.statements().transferGenexpert(siteName,serialnumber),
            "results":function(res){
                callback();
            }
        },function(){});

    }

}

const genexpertTransactionModel = new GenexpertTransactionModel();
module.exports = genexpertTransactionModel;