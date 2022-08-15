const {inquireDatabase} = require("../databases/ApplicationDatabase");
class ReportModel{

    constructor(){


    }

    statements(){

        function genexSitePerRegion(){
            return `SELECT 
            xx.regioncount AS count_per_region,
            si.region AS region,
            si.siteName As siteName,
            gen.serialnumber AS genexpertSN,
            d.itName AS installTypeName,
            e.mnName AS modelnumberName,
            gen.dateinstalled AS dateinstalled,
            si.province AS province,
            si.city AS city_municipality,
            c.fullname AS engineerName
            FROM genexpert gen
            LEFT JOIN site si ON si.siteID = gen.siteID
            LEFT JOIN engineer c ON c.engineerID = gen.engineerID
                LEFT JOIN installationtype d ON d.itID = gen.itID
                LEFT JOIN modelnumber e ON e.mnID = gen.mnID  
            LEFT JOIN (SELECT b.region,COUNT(b.region) AS regioncount 
                FROM genexpert a
                LEFT JOIN site b ON b.siteID = a.siteID
                GROUP BY b.region) xx ON xx.region = si.region 
                WHERE si.region IS NOT NULL AND si.region != "" 
                ORDER BY si.region,si.province,si.city`;

        }

        function getAssayStatistic(){
            return `SELECT 
            c.siteName AS c_siteName,
            b.serialnumber AS b_serialnumber,
            d.itName AS d_itName,
            e.mnName AS e_mnName,
            b.dateinstalled AS b_dateinstalled,
            a.test AS a_test,
            a.quantity AS a_quantity,
            xx.a_dateupdated AS a_dateupdated,
            b.status AS stat 
            FROM
            (SELECT 
            a.genexpertSN AS genexpertSN,
            MAX(a.dateupdated) AS a_dateupdated
            FROM assaystatistic a 
            GROUP BY a.genexpertSN ) xx
            LEFT JOIN assaystatistic a ON a.genexpertSN = xx.genexpertSN 
            AND a.dateupdated = xx.a_dateupdated
            LEFT JOIN genexpert b ON b.serialnumber = a.genexpertSN 
            LEFT JOIN site c ON c.siteID = b.siteID
            LEFT JOIN installationtype d ON d.itID = b.itID
            LEFT JOIN modelnumber e ON e.mnID = b.mnID ORDER BY c.siteName`;
        }

        function getXpertcheck(){
            return `SELECT xxx.*,IF((CEIL(100-CEIL((xxx.remaining/xxx.whole) * 100))) < 0,0,(CEIL(100-CEIL((xxx.remaining/xxx.whole) * 100)))) AS percentage FROM (
                SELECT ROW_NUMBER() OVER (ORDER BY xx.remaining) AS item_no,xx.* FROM(
                SELECT 
                c.siteName,
                b.serialnumber,
                d.itName,
                e.mnName,
                b.dateinstalled,
                a.calibrate_start,
                a.calibrate_done,
                c.region,
                DATEDIFF(a.calibrate_done,a.calibrate_start) AS whole,
                IF(DATEDIFF(a.calibrate_done, CURRENT_DATE) < 0,0,DATEDIFF(a.calibrate_done, CURRENT_DATE)) AS remaining
                FROM xpertcheck a 
                LEFT JOIN genexpert b ON b.serialnumber = a.genexpertSN
                LEFT JOIN site c ON c.siteID = b.siteID
                LEFT JOIN installationtype d ON d.itID = b.itID
                LEFT JOIN modelnumber e ON e.mnID = b.mnID
                WHERE a.current_xpertcheck = TRUE
                ) xx WHERE xx.remaining !=0
            ) xxx`;
        }

        function getPreventiveMaintenance(){
            return `SELECT xxx.*,IF((CEIL(100-CEIL((xxx.remaining/xxx.whole) * 100))) < 0,0,(CEIL(100-CEIL((xxx.remaining/xxx.whole) * 100)))) AS percentage FROM (
                SELECT ROW_NUMBER() OVER (ORDER BY xx.remaining) AS item_no,xx.* FROM(
                SELECT 
                c.siteName,
                b.serialnumber,
                d.itName,
                e.mnName,
                b.dateinstalled,
                a.calibrate_start,
                a.calibrate_done,
                c.region,
                DATEDIFF(a.calibrate_done,a.calibrate_start) AS whole,
                IF(DATEDIFF(a.calibrate_done, CURRENT_DATE) < 0,0,DATEDIFF(a.calibrate_done, CURRENT_DATE)) AS remaining
                FROM preventive_maintenance a 
                LEFT JOIN genexpert b ON b.serialnumber = a.genexpertSN
                LEFT JOIN site c ON c.siteID = b.siteID
                LEFT JOIN installationtype d ON d.itID = b.itID
                LEFT JOIN modelnumber e ON e.mnID = b.mnID
                WHERE a.current_pm = true
                ) xx WHERE xx.remaining !=0
            ) xxx `;
        }
        
        return {genexSitePerRegion,getAssayStatistic,getXpertcheck,
            getPreventiveMaintenance};
    }

    onGenexpertSitePerRegion(callback){

        inquireDatabase({
            "statement":this.statements().genexSitePerRegion(),
            "results":function(results){
                callback(JSON.parse(JSON.stringify(results)));
            }
        });
    }

    onAssaystatistic(callback){
        inquireDatabase({
            "statement":this.statements().getAssayStatistic(),
            "results":function(results){
                callback(JSON.parse(JSON.stringify(results)));
            }
        });
    }

    onXpertcheck(callback){
        inquireDatabase({
            "statement":this.statements().getXpertcheck(),
            "results":function(results){
                callback(JSON.parse(JSON.stringify(results)));
            }
        });
    }

    onPM(callback){
        inquireDatabase({
            "statement":this.statements().getPreventiveMaintenance(),
            "results":function(results){
                callback(JSON.parse(JSON.stringify(results)));
            }
        });
    }
}
const reportModel = new ReportModel();
module.exports = reportModel;