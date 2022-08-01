const { inquireDatabase } = require("../databases/ApplicationDatabase");
const addressSection = require("../sections/AddressSection");
const { backendScreen } = require("../sections/MessageLoadingSection");

class TransController{

    constructor(){
       
    }

    displayAddresses(){

        addressSection.assignAddress({
            "region":{
                "container":"#searchTransactionByRegion"
            },
            "province":{
                "container":"#searchTransactionByProvince"
            },
            "city":{
                "container":"#searchTransactionByCity"
            },
            "barangay":{
                "container":"#searchTransactionByBarangay"
            }
        })


    }

    searchOn(){

        var self = this;

        backendScreen({
            "container":"#transaction-frame-area > .transaction-main-area > .transaction-head-area",
            "screen-name":"searching-transaction-screen",
            "loading-box":{
                 "version":1,
                 "message":"Please wait..."
            }
        });


        const table = $(`.table-select > select`).children("option:selected").val();
        const searchby = $(`.field-select > select`).children("option:selected").data("field");
        let searchValue = '';
        let conditions = ``;

        if(searchby == "a.serialnumber"){

            searchValue = $("#searchTransactionBySerialNumber").val();
            if(table == "genexpert"){
                conditions = searchValue  == "" ? " AND a.serialnumber='N/A'":` AND a.serialnumber LIKE "%${searchValue}%"`;
            }
            if(table == "module"){
                conditions = searchValue  == "" ? " AND a.serialnumber='N/A'":
                ` AND a.serialnumber LIKE "%${searchValue}%"`;
            }
            if(table == "haemonetics"){
                conditions = searchValue  == "" ?" AND a.serialnumber='N/A'":` AND a.serialnumber LIKE "%${searchValue}%"`;
            }
            if(table == "xpertcheck"){
                conditions = searchValue  == "" ?" AND a.serialnumber='N/A'":` AND a.genexpertSN LIKE "%${searchValue}%"`;
            }
            if(table == "preventive-maintenance"){
                conditions = searchValue  == "" ?" AND a.serialnumber='N/A'":` AND a.genexpertSN  LIKE "%${searchValue}%"`;
            }
            
        }

        if(searchby == "b.siteName"){
            searchValue = $("#searchTransactionBySite").val();
            conditions = searchValue  == "" ? " AND b.siteName='N/A'":` AND ${searchby}  LIKE "%${searchValue}%"`;
        }

        if(searchby == "addresses"){
            let ca = $("#searchTransactionByCompleteAddress").val();
            let reg = $("#searchTransactionByRegion").val();
            let prov = $("#searchTransactionByProvince").val();
            let cit = $("#searchTransactionByCity").val();
            let bara = $("#searchTransactionByBarangay").val();
            conditions += ca == "" ? "" : ` AND b.complete_address LIKE "%${ca}%"`;
            conditions += JSON.parse(reg)['name'] == undefined ? "" : ` AND b.region LIKE "%${JSON.parse(reg)['name']}%"`;
            conditions += JSON.parse(prov)['name'] == undefined ? "" : ` AND b.province LIKE "%${JSON.parse(prov)['name']}%"`;
            conditions += JSON.parse(cit)['name'] == undefined ? "" : ` AND b.city LIKE "%${JSON.parse(cit)['name']}%"`;
            conditions += JSON.parse(bara)['name'] == undefined ? "" : ` AND b.barangay LIKE "%${JSON.parse(bara)['name']}%"`;
        }
      
         let statement="";
         
         switch(table){
            case "genexpert":
                statement=`SELECT a.serialnumber AS myserialnumber,a.*,b.* FROM genexpert a 
                LEFT JOIN site b ON b.siteID = a.siteID 
                WHERE 1=1 ${conditions}`;
            break;

            case "module":
                statement=`SELECT a.serialnumber AS myserialnumber,a.*,b.*,c.* 
                FROM module a 
                LEFT JOIN genexpert c ON c.serialnumber = a.genexpertSN
                LEFT JOIN site b ON b.siteID = c.siteID 
                WHERE 1=1 ${conditions}`;
            break;

            case "haemonetics":
                statement=`SELECT a.serialnumber AS myserialnumber,a.*,b.* FROM haemonetics a 
                LEFT JOIN site b ON b.siteID = a.siteID 
                WHERE 1=1 ${conditions}`;
            break;

            case "xpertcheck":
                statement=`SELECT a.serialnumber AS myserialnumber,a.*,b.*,c.* FROM xpertcheck a 
                LEFT JOIN genexpert c ON c.serialnumber = a.genexpertSN
                LEFT JOIN site b ON b.siteID = c.siteID 
                WHERE 1=1 ${conditions}`;
            break;

            case "preventive-maintenance":
                statement=`SELECT a.serialnumber AS myserialnumber,a.*,b.*,c.* 
                FROM preventive_maintenance a 
                LEFT JOIN genexpert c ON c.serialnumber = a.genexpertSN
                LEFT JOIN site b ON b.siteID = c.siteID 
                WHERE 1=1 ${conditions}`;
            break;
         }



        inquireDatabase({
            "statement":statement,
            "results":function(res){
                self.addRowOnSearch(table,res);
            }
        },function(){
           $(".searching-transaction-screen").remove();
        });

    }

    addRowOnSearch(table,datas){
        const processDatas = JSON.parse(JSON.stringify(datas));
        let transType ='';
        let serialnumber = 'myserialnumber';
        switch(table){
            case "genexpert":getGenexpertTransType(); break;
            case "haemonetics":getHaemoneticsTransType(); break;
            case "module":getModuleTransType(); break;
            case "xpertcheck":getXpertcheckTransType(); break;
            case "preventive-maintenance":getPMTransType(); break;
            default:"";
        }

        function getGenexpertTransType(){
            transType = `
                <select class="transType">
                    <option value="transfer">Transfer/Replace</option>
                </select>
            `;
            serialnumber = "myserialnumber";
        }

        function getModuleTransType(){
            transType = `
                <select class="transType">
                    <option value="replace">Replace</option>
                    <option value="repair">Repair</option>
                    <option value="transfer">Transfer</option>
                </select>
            `;

            serialnumber = "myserialnumber";
        }

        function getHaemoneticsTransType(){
            transType = `
            <select class="transType">
                <option value="transfer">Transfer/Replace</option>
            </select>
            `;

            serialnumber = "myserialnumber";
        }

        function getXpertcheckTransType(){
            transType = `
            <select class="transType">
                <option value="setSchedule">Set Schedule</option>
            </select>
            `;

            serialnumber = "genexpertSN";
        }

        function getPMTransType(){
            transType = `
            <select class="transType">
                <option value="setSchedule">Set Schedule</option>
            </select>
            `;

            serialnumber = "genexpertSN";
        }

        const firstRow = $("#transactionResultListArea").children("tr:nth-child(1)").html();
        $("#transactionResultListArea").html("");
        $("#transactionResultListArea").append(`<tr>${firstRow}</tr>`);

        processDatas.forEach(data => {
            const item = `
            <tr>
                <td>${transType}</td>
                <td>${data[serialnumber]}</td>
                <td>${data['siteName']}</td>
                <td>${data['complete_address']}</td>
                <td>${data['status']}</td>
                <td><a href="#" data-info="${data}" class="btn btn-primary w-100" 
                onclick="transController. displayFormArea()">Proceed</a></td>
            </tr>
            `;

            $("#transactionResultListArea").append(item);
        });
        
    }

    displayFormArea(){
        $("#transaction-frame-area > .transaction-form-display-area").addClass("display-form-area");
    }

}

const transController = new TransController();
module.exports = transController;