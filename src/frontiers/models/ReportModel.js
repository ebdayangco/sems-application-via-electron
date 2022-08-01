const Model = require("./Model");
class ReportModel extends Model{
    constructor(){
        super();
        this.database = 'lpytdtsx_macare_sems';
        
    }

    statements(){
        var self = this;
        function getAllTablesAndField(){
            return `SELECT TABLE_NAME,COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = "${self.database}"`;
        }

        function defaultReportStatements(){
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
                    WHERE 1=1
                    ) xx WHERE xx.remaining !=0
                ) xxx`;
            }
    
            function getPreventiveMaintenance(){

                return `SELECT
                    ROW_NUMBER() OVER (ORDER BY xx.remaining) AS item_no,xx.* FROM (
                    SELECT 
                    c.siteName,b.serialnumber,d.itName,
                    e.mnName,b.dateinstalled,a.calibrate_start,a.calibrate_done,
                    c.region,
                    IF(DATEDIFF(a.calibrate_done, CURRENT_DATE) < 0,'Waiting for next calibration',
                    'Ready for next calibration') AS remaining
                    FROM preventive_maintenance a
                    LEFT JOIN genexpert b ON b.serialnumber = a.genexpertSN
                    LEFT JOIN site c ON c.siteID = b.siteID
                    LEFT JOIN installationtype d ON d.itID = b.itID
                    LEFT JOIN modelnumber e ON e.mnID = b.mnID
                    ) xx`;
                // return `SELECT xxx.*,IF((CEIL(100-CEIL((xxx.remaining/xxx.whole) * 100))) < 0,0,(CEIL(100-CEIL((xxx.remaining/xxx.whole) * 100)))) AS percentage FROM (
                //     SELECT ROW_NUMBER() OVER (ORDER BY xx.remaining) AS item_no,xx.* FROM(
                //     SELECT 
                //     c.siteName,
                //     b.serialnumber,
                //     d.itName,
                //     e.mnName,
                //     b.dateinstalled,
                //     a.calibrate_start,
                //     a.calibrate_done,
                //     c.region,
                //     DATEDIFF(a.calibrate_done,a.calibrate_start) AS whole,
                //     IF(DATEDIFF(a.calibrate_done, CURRENT_DATE) < 0,0,DATEDIFF(a.calibrate_done, CURRENT_DATE)) AS remaining
                //     FROM preventive_maintenance a 
                //     LEFT JOIN genexpert b ON b.serialnumber = a.genexpertSN
                //     LEFT JOIN site c ON c.siteID = b.siteID
                //     LEFT JOIN installationtype d ON d.itID = b.itID
                //     LEFT JOIN modelnumber e ON e.mnID = b.mnID
                //     ) xx WHERE xx.remaining !=0
                // ) xxx `;
            }

            return {genexSitePerRegion,getAssayStatistic,getXpertcheck,
            getPreventiveMaintenance};
        }

        return {getAllTablesAndField,defaultReportStatements};

    }

    process(option){
        
        var self = this;
        function getAllTablesAndField(){
            
            self.inquireDatabase({
                "statement":self.statements().getAllTablesAndField(),
                "results":function(res){
                    option['results'](JSON.parse(JSON.stringify(res)));
                }
            })
        }

        function getSitePerRegion(){

            self.inquireDatabase({
                "statement":self.statements().defaultReportStatements().genexSitePerRegion(),
                "results":function(res){
                    option['results'](JSON.parse(JSON.stringify(res)));
                }
            });
                              
        }

        function getAssaystatistic(){

            self.inquireDatabase({
                "statement":self.statements().defaultReportStatements().getAssayStatistic(),
                "results":function(res){
                    option['results'](JSON.parse(JSON.stringify(res)));
                }
            });
                              
        }

        function getXpertcheck(){

            self.inquireDatabase({
                "statement":self.statements().defaultReportStatements().getXpertcheck(),
                "results":function(res){
                    option['results'](JSON.parse(JSON.stringify(res)));
                }
            });
                              
        }

        function getPreventiveMaintenance(){

            self.inquireDatabase({
                "statement":self.statements().defaultReportStatements().getPreventiveMaintenance(),
                "results":function(res){
                    option['results'](JSON.parse(JSON.stringify(res)));
                }
            });
                              
        }

        return {getAllTablesAndField,getSitePerRegion,getAssaystatistic
            ,getXpertcheck,getPreventiveMaintenance};
    }
}
const reportModel = new ReportModel();
module.exports = reportModel;