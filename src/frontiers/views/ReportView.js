const reportDefaultJSON = require("../../supporters/storages/report-default.json");
const reportSection = require("../../supporters/sections/ReportSection");
const { getOnDate } = require("../../supporters/sections/RequestSection");
const fs = require("fs");
const View = require("./View");
const genexpertView = require("./GenexpertView");
const ExcelReport = require("../../supporters/sections/ExcelReport");
const { dialog } = require("electron");

class ReportView extends View{
    constructor(){
        super();
        this.border_radius = false;
    }

    getAllReportTheme(dirname){

        return {
            "genexpert-machine-information":
            `${dirname}\\..\\layouts\\html\\reports\\genexpert_machine_information.html`,
            "genexpert-all":
            `${dirname}\\..\\layouts\\html\\reports\\genexpert_all.html`
            
        }

    }

    classifyTableandFields(datas){

        const tableList = [
            "genexpert",
            "haemonetics",
            "module",
            "peripheral",
            "assaystatistic",
            "xpertcheck",
            "preventive_maintenance",
            "engineer",
            "site",
            "modelnumber",
            "installationtype"
        ];
        const classifiedList = [];
        
        tableList.forEach(tbl=>{
            
            classifiedList.push({
                "table":tbl,
                "fields": datas.filter(d=>{
                    return d['TABLE_NAME'] == tbl;
                }).map(v=>{
                    return v['COLUMN_NAME'];
                })
            })
           
        });
        
        this.createTableList(classifiedList);
    
    }

    createTableList(datas){

        const table_tbody = $("#report-table-list-tbody");
        const field_tbody = $("#report-field-list-tbody");
        table_tbody.html("");
        field_tbody.html("");
        datas.forEach(d=>{

            
            
            const item = `
            <tr>
            <td><input type="checkbox" onclick="reportController.maker().getView().createFieldList(this)"
            data-table='${d["table"]}' data-fields='${JSON.stringify(d["fields"])}'></td>
            <td>${d["table"]}</td>
            <td><input type="checkbox" data-table='${d["table"]}' 
            onclick="reportController.maker().getView().hideUnSelected(this)"></td>
            <td><input type="checkbox" checked data-table='${d["table"]}'></td>
            </tr>
            `;
            table_tbody.append(item);
            
        });

    }

    createFieldList(div){

        let checked = $(div).is(':checked');
        
        let table = $(div).data("table");
        let fields = JSON.parse(JSON.stringify($(div).data("fields")));
        const tbody = $("#report-field-list-tbody");
        const tr = tbody.children(`tr[data-table='${table}']`);

        if(checked){

            if(tr.hasClass("hide-table-row")){
                tr.removeClass("hide-table-row");
            }else{
                fields.forEach(f=>{
                    const item = 
                    `<tr data-table='${table}'>
                    <td><input type="checkbox" class="select-field"></td>
                    <td>${table}</td>
                    <td>${f}</td>
                    <td><select 
                    style="height:28px;" class="w-100 select-filter">
                            <option value="N/A"></option>
                            <option value="=">Equal To</option>
                            <option value="%">Contain</option>
                            
                        </select>
                    </td>
                    <td><input type="text" class="w-100 value-one"></td>
                    <td><input type="text" class="w-100 value-two"></td>
                    <td><input type="text" class="w-100 value-three"></td>
                    <td><input type="checkbox" class="check-group-by"></td>
                    <td><input type="checkbox" class="check-order-by"></td>
                    </tr>`;
        
                    tbody.append(item);
                });
            }

            
        }else{

            tr.addClass("hide-table-row");

        }

      

        


        
    }

    hideUnSelected(div){

        let checked = $(div).is(':checked');
        let table = $(div).data("table");
        const tbody = $("#report-field-list-tbody");

        let tr = tbody.children(`tr[data-table='${table}']`).children('td:nth-child(1)').children("input").not(":checked");
        console.log(tr.html());
 
        if(checked){
            tr.parent("td").parent("tr").addClass("hide-table-row");
            
        }else{
           
            tr.parent("td").parent("tr").removeClass("hide-table-row");
            
        }



        
    }

    setReportTitle(){
        $(".cur-date").html(getOnDate());
        $(".generate-by").html(`${accJSON["online"]['lastname']}, ${accJSON["online"]['firstname']}`);
    }

    createReport(div,container = "body"){


        let siteName = $(div).attr("report-name");

        let reportList = [
            {
                "report-name":"site-per-region",
                "location":`${__dirname}/site-per-region.html`
            },
            {
                "report-name":"assay-statistic",
                "location":`${__dirname}/assay-statistic.html`
            },
            {
                "report-name":"xpertcheck",
                "location":`${__dirname}/report-xpertcheck.html`
            },
            {
                "report-name":"preventive-maintenance",
                "location":`${__dirname}/report-pm.html`
            }
        ];

        let reportFilter = reportList.filter(re=>{
             return re['report-name'] == siteName;
        })[0];


        if(reportFilter['report-name'] == "site-per-region"){

            reportModel.onGenexpertSitePerRegion(function(res){

                let regions = [];
                let region_object = {};
                res.forEach(data => {
                    if(!regions.includes(data['region'])){
                        regions.push(data['region']);
                        region_object[data['region']] = [];
                        region_object[data['region']].push(data);
                    }else{
                        region_object[data['region']].push(data);
                    }
                });
    
                let keys = Object.keys(region_object);
                let values = Object.values(region_object)
                // console.log(keys);
                let objs = [];
                for(var x = 0; x<keys.length; x++){
    
                    let obj = {
                        "region":keys[x],
                        "counts":region_object[keys[x]][0]['count_per_region'],
                        "list":JSON.parse(JSON.stringify(values[x]))
                    }
    
                    objs.push(obj);
    
                }

                objs.forEach(c=>{
                    c['list'].forEach((d,i)=>{
                        d['item_no'] = i + 1;
                        d['dateinstalled'] = getOnDate(d['dateinstalled']);
                    });
                });
    
               async function loadingStart(){
    
                    await backendScreen({
                        "container":container,
                        "screen-name":"report-loading-screen",
                        "loading-box":{
                            "version":1,
                            "message":"Please wait..."
                        }
                    });
               } 
    
                loadingStart().then(()=>{
                    console.log(JSON.parse(JSON.stringify(objs)));
                    const content = fs.readFileSync(reportFilter['location']).toString();
                    reportSection.onCreate(content,JSON.parse(JSON.stringify(objs)),container);
        
                
        
                });
               
    
                
            });
    
        }else if(reportFilter['report-name'] == "assay-statistic"){
           
            reportModel.onAssaystatistic(function(res){

                let unique_sn_obj = [];
                let unique_sn = [];
                let count = 1;
                res.forEach(r=>{
                    if(!unique_sn.includes(r['b_serialnumber'])){
                        
                        unique_sn.push(r['b_serialnumber']);
                        let te = r['a_test']+"".trim();
                        te.replace('\\n','');
                        r['a_test'] = te;
                        r['item_no'] = count;
                        r['b_dateinstalled'] = getOnDate(r['b_dateinstalled']);
                        r['a_dateupdated'] = getOnDate(r['a_dateupdated']);
                        unique_sn_obj.push(r);
                        count++;
                    }
                });

                async function loadingStart(){
    
                    await backendScreen({
                        "container":container,
                        "screen-name":"report-loading-screen",
                        "loading-box":{
                            "version":1,
                            "message":"Please wait..."
                        }
                    });
               } 
    
                loadingStart().then(()=>{
                    const content = fs.readFileSync(reportFilter['location']).toString();
                    reportSection.onCreate(content,
                        JSON.parse(JSON.stringify(unique_sn_obj)),container);
        
                });
 
            });
        }else if(reportFilter['report-name'] == "xpertcheck"){
            reportModel.onXpertcheck(function(res){

                res.forEach(r=>{
                    r['calibrate_done'] = getOnDate(r['calbrate_done']);
                    r['calibrate_start'] = getOnDate(r['calibrate_start']);
                    r['dateinstalled'] = getOnDate(r['dateinstalled']);
                })


                async function loadingStart(){
    
                    await backendScreen({
                        "container":container,
                        "screen-name":"report-loading-screen",
                        "loading-box":{
                            "version":1,
                            "message":"Please wait..."
                        }
                    });
               } 
    
                loadingStart().then(()=>{
                    const content = fs.readFileSync(reportFilter['location']).toString();
                    reportSection.onCreate(content,
                        JSON.parse(JSON.stringify(res)),container);
        
                });

            });

        }else if(reportFilter['report-name'] == "preventive-maintenance"){
            reportModel.onPM(function(res){

                res.forEach(r=>{
                    r['calibrate_done'] = getOnDate(r['calbrate_done']);
                    r['calibrate_start'] = getOnDate(r['calibrate_start']);
                    r['dateinstalled'] = getOnDate(r['dateinstalled']);
                })


                async function loadingStart(){
    
                    await backendScreen({
                        "container":container,
                        "screen-name":"report-loading-screen",
                        "loading-box":{
                            "version":1,
                            "message":"Please wait..."
                        }
                    });
               } 
    
                loadingStart().then(()=>{
                    const content = fs.readFileSync(reportFilter['location']).toString();
                    reportSection.onCreate(content,
                        JSON.parse(JSON.stringify(res)),container);
        
                });

            });

        }else{
            console.log("no report");
        }


       
    }

    list(){

        var self = this;

        function reportRow(data){
        
            let oc = "";
            let rname = data['report-name']

            if(data['report-type'] == "default"){
                oc = `onclick="reportController.list().onDefault('${rname}','pdf')"`;
            }

            let st = createStatement(data);
            
            
            const item = `
                <div class="report-row" data-data='${JSON.stringify(data)}' data-statement='${st}'>
                <div class="report-col w-5">
                    <a href="#" class="btn btn-danger" ${oc}><i class="fa fa-file-pdf-o"></i></a></div>
                <div class="report-col w-5">
                    <a href="#" class="btn btn-success"><i class="fa fa-file-excel-o"></i></a>
                </div>
                <div class="report-col w-25">${data['report-name']}</div>
                <div class="report-col w-40">${data['report-description']}</div>
                <div class="report-col w-20">${data['report-made-by']}</div>
                <div class="report-col w-10">${data['report-access-type']}</div>
                </div>
            `;


            return item;
        }

        function generatePDF(div){

        }
        function generateExcel(div){}
        function showInformation(div){}
        function showDefault(){


            let reportBody = $(".report-tbody");
            reportBody.html("");

            reportDefaultJSON.forEach(r=>{
                r["report-type"] = "default";
                reportBody.append(reportRow(r));
            });


        }
        function showCreated(){}
        function createStatement(data){

            let table = data['schema'];
            
            let statement = "";

            return statement;
        }

        function createOnDefaultReport(reportName,datas){

            let reportList = [
                {
                    "report-name":"Site Per Region",
                    "location":`${__dirname}/../layouts/html/reports/site-per-region.html`
                },
                {
                    "report-name":"Assay Statistics",
                    "location":`${__dirname}/../layouts/html/reports/assay-statistic.html`
                },
                {
                    "report-name":"Xpertcheck",
                    "location":`${__dirname}/../layouts/html/reports/report-xpertcheck.html`
                },
                {
                    "report-name":"Preventive Maintenance",
                    "location":`${__dirname}/../layouts/html/reports/report-pm.html`
                }
            ];
    
            let reportFilter = reportList.filter(re=>{
                 return re['report-name'] == reportName;
            })[0];

            function sitePerRegion(){

                let regions = [];
                let region_object = {};

                datas.forEach(data => {
                    if(!regions.includes(data['region'])){
                        regions.push(data['region']);
                        region_object[data['region']] = [];
                        region_object[data['region']].push(data);
                    }else{
                        region_object[data['region']].push(data);
                    }
                });
    
                let keys = Object.keys(region_object);
                let values = Object.values(region_object)
                // console.log(keys);
                let objs = [];
                for(var x = 0; x<keys.length; x++){
    
                    let obj = {
                        "region":keys[x],
                        "counts":region_object[keys[x]][0]['count_per_region'],
                        "list":JSON.parse(JSON.stringify(values[x]))
                    }
    
                    objs.push(obj);
    
                }

                objs.forEach(c=>{
                    c['list'].forEach((d,i)=>{
                        d['item_no'] = i + 1;
                        d['dateinstalled'] = getOnDate(d['dateinstalled']);
                    });
                });
    
               async function loadingStart(){

                
                    await self.loader({
                        "loader-01":true
                    });
                 
               } 
    
                loadingStart().then(()=>{
                    const content = fs.readFileSync(reportFilter['location']).toString();
                    reportSection.onCreate(content,JSON.parse(JSON.stringify(objs)),"body");
                
        
                });
            }

            function onAssaystatistic(){

                let unique_sn_obj = [];
                let unique_sn = [];
                let count = 1;
                datas.forEach(r=>{
                    if(!unique_sn.includes(r['b_serialnumber'])){
                        
                        unique_sn.push(r['b_serialnumber']);
                        let te = r['a_test']+"".trim();
                        te.replace('\\n','');
                        r['a_test'] = te;
                        r['item_no'] = count;
                        r['b_dateinstalled'] = getOnDate(r['b_dateinstalled']);
                        r['a_dateupdated'] = getOnDate(r['a_dateupdated']);
                        unique_sn_obj.push(r);
                        count++;
                    }
                });

                async function loadingStart(){
    
                    await self.loader({
                        "loader-01":true
                    });
               } 
    
                loadingStart().then(()=>{
                    const content = fs.readFileSync(reportFilter['location']).toString();
                    reportSection.onCreate(content,
                        JSON.parse(JSON.stringify(unique_sn_obj)),"body");
        
                });
            }

            function onXpertcheck(){

                datas.forEach(r=>{
                    r['calibrate_done'] = getOnDate(r['calbrate_done']);
                    r['calibrate_start'] = getOnDate(r['calibrate_start']);
                    r['dateinstalled'] = getOnDate(r['dateinstalled']);
                })


                async function loadingStart(){
    
                     await self.loader({
                        "loader-01":true
                    });
               } 
    
                loadingStart().then(()=>{
                    const content = fs.readFileSync(reportFilter['location']).toString();
                    reportSection.onCreate(content,
                        JSON.parse(JSON.stringify(datas)),"body");
        
                });
            }

            function onPreventiveMaintenance(){
                datas.forEach(r=>{
                    r['calibrate_done'] = getOnDate(r['calbrate_done']);
                    r['calibrate_start'] = getOnDate(r['calibrate_start']);
                    r['dateinstalled'] = getOnDate(r['dateinstalled']);
                })


                async function loadingStart(){
    
                    await self.loader({
                        "loader-01":true
                    });
               } 
    
                loadingStart().then(()=>{
                    const content = fs.readFileSync(reportFilter['location']).toString();
                    reportSection.onCreate(content,
                        JSON.parse(JSON.stringify(datas)),"body");
        
                });
            }

            return {sitePerRegion,onAssaystatistic,onXpertcheck,onPreventiveMaintenance}
        }

        return {showDefault,showCreated,createOnDefaultReport};
    }

    onPrivateSchema(){

    }

    closeReportOption(){
        hideSubForm("#report-option-area","top");
    }

    onExport(categFormat,callback){

        const homeDir = require('os').homedir();
        const desktopDir = `${homeDir}/Desktop`;
        
        
        let path = dialog.showSaveDialogSync(null,{
            defaultPath:desktopDir
        });
    
       
       

        if(categFormat == "excel"){
            const last5 = path.slice(path.length-5,path.length);
            
            if(last5 != ".xlsx"){
                path+=".xlsx";
            }
        }

        else if(categFormat == "pdf"){

            const last4 = path.slice(path.length-4,path.length);
            if(last4 != ".pdf"){
                path+=".pdf";
             }
        }

        else{

            const last5 = path.slice(path.length-5,path.length);
            if(last5 != ".xlsx"){
                path+=".xlsx";
            }
        }

        const indexOflastSlash = path.lastIndexOf("\\");
        const directory = path.slice(0,indexOflastSlash+1);
        const filename = path.slice(indexOflastSlash+1,path.length);
       
        callback(path,directory,filename);
       
    }

    findExcel(callback,motherparent = "body"){
   
        var self = this;

        $(motherparent).append(`
        <form enctype="multipart/form-data" style="display:none;">
        <input type="file" name="" id="uploadexcel" hidden>
        </form>`
        );

        $("#uploadexcel").trigger('click');
    
        $("#uploadexcel").on("change",function(e){ 
            var path = e.target.files[0].path;

            if(path+"".endsWith('.xlsx')){

               
                self.loader({
                    "loader-01":true
                });
               
                callback(path);
                
            }else{
                
                self.messager({
                    "message-01":true,
                    "messages":['Invalid Excel File. Only allowed XLSX format.']});
               
            }
            

            
        });
    }

    onExcel(opt){
          console.log("hey");

        var self = this;

        function onExportProcess(d){

            // d = genexpertView.list().classifyingData(d);

        //     function setGenexpert(datas,align){
        //         let column_headers = [];
        //         let row_headers =[
        //             "ID",
        //             "Date Added",
        //             "Date Updated",
        //             "Genx Serial Number",
        //             "Site/Facility",
        //             "Installed By",
        //             "Date Installed",
        //             "Installation Type",
        //             "Model Number",
        //             "Complete Address",
        //             "Region",
        //             "Province",
        //             "City",
        //             "Barangay",
        //             "Street",
        //             "Latitude",
        //             "Longitude",
        //             "Software Version",
        //             "OS Version",
        //             "Warranty Expiry Date",
        //             "Service Contract Expiry Date",
        //             "Status",
        //             "Remarks",
        //             "Added By"];
        //         let column_values = [];
        //         let row_values = [];
        //         datas.forEach((v,i)=>{
        //             let header = [
        //                 `${row_headers[0]}`,
        //                 `${row_headers[1]}`,
        //                 `${row_headers[2]}`,
        //                 `${row_headers[3]}`,
        //                 `${row_headers[4]}`,
        //                 `${row_headers[5]}`,
        //                 `${row_headers[6]}`,
        //                 `${row_headers[7]}`,
        //                 `${row_headers[8]}`,
        //                 `${row_headers[9]}`,
        //                 `${row_headers[10]}`,
        //                 `${row_headers[11]}`,
        //                 `${row_headers[12]}`,
        //                 `${row_headers[13]}`,
        //                 `${row_headers[14]}`,
        //                 `${row_headers[15]}`,
        //                 `${row_headers[16]}`,
        //                 `${row_headers[17]}`,
        //                 `${row_headers[18]}`,
        //                 `${row_headers[19]}`,
        //                 `${row_headers[20]}`,
        //                 `${row_headers[21]}`,
        //                 `${row_headers[22]}`,
        //                 `${row_headers[23]}`];
        //             column_headers.push(...header);
        
        //             let value = [
        //                 `${v['genex_genexpertID']}`,
        //                 `${v['genex_dateadded']}`,
        //                 `${v['genex_dateupdated']}`,
        //                 `${v['genex_serialnumber']}`,
        //                 `${v['genex_faci_siteName']}`,
        //                 `${v['genex_eng_fullname']}`,
        //                 `${v['genex_dateinstalled']}`,
        //                 `${v['genex_inst_itName']}`,
        //                 `${v['genex_mode_mnName']}`,
        //                 `${v['genex_faci_complete_address']}`,
        //                 `${v['genex_faci_region']}`,
        //                 `${v['genex_faci_province']}`,
        //                 `${v['genex_faci_city']}`,
        //                 `${v['genex_faci_barangay']}`,
        //                 `${v['genex_faci_street']}`,
        //                 `${v['genex_faci_latitude']}`,
        //                 `${v['genex_faci_longitude']}`,
        //                 `${v['genex_software_version']}`,
        //                 `${v['genex_os_version']}`,
        //                 `${v['genex_warranty_expiry_date']}`,
        //                 `${v['genex_service_contract_expiry_date']}`,
        //                 `${v['genex_status']}`,
        //                 `${v['genex_remarks']}`,
        //                 `${v['genex_user_addedby_firstname']} ${v['genex_user_addedby_lastname']}`];
        
        //             row_values.push(value);
        //             column_values.push(...value);
        //         });
        
        //         if(align == "column"){
        //             return {column_headers,column_values};
        //         }else{
        //                 return {row_headers,row_values};
        //         }
        
        //     }
            
        //     function setContacts(datas,align){

        //         let column_headers = [];
        //         let row_headers = align == "column" ? 
        //         ['Contact Person','Contact Position','Contact Email','Contact Number']:
        //         ['Genx Serial Number','Facility','Contact Person','Contact Position'
        //         ,'Contact Email','Contact Number'];
        //         let column_values = [];
        //         let row_values = [];
        //         datas.forEach((v,i)=>{
        //             let header = [`${row_headers[0]} #${i+1}`,`${row_headers[1]} #${i+1}`,
        //             `${row_headers[2]} #${i+1}`,`${row_headers[3]} #${i+1}`];
        //             column_headers.push(...header);

        //             let value = [
        //                 `${v['genex_faci_cont_fullname']}`,
        //                 `${v['genex_faci_cont_position']}`,
        //                 `${v['genex_faci_cont_email']}`,
        //                 `${v['genex_faci_cont_contactnumber']}`];

        //             row_values.push(value);
        //             column_values.push(...value);
        //         });

        //         if(align == "column"){
        //             return {column_headers,column_values};
        //         }else{
        //             return {row_headers,row_values};
        //         }

        //     }
            
        //     function setAssaystatistics(datas,align){

        //         let column_headers = [];
        //         let row_headers = align == "column" ? ['Assay Date','Assay Test','Assay Quantity'] :
        //             ['Genx Serial Number','Facility','Assay Date','Assay Test','Assay Quantity'];
        //         let column_values = [];
        //         let row_values = [];
        //         datas.forEach((v,i)=>{
        //             let header = [`${row_headers[0]} #${i+1}`,`${row_headers[1]} #${i+1}`,
        //             `${row_headers[2]} #${i+1}`];
        //             column_headers.push(...header);

        //             let col_value = [
        //                 `${v['assay_dateupdated']}`,
        //                 `${v['assay_test']}`,
        //                 `${v['assay_quantity']}`];
        //             let row_value =  [
                        
        //                 `${v['genex_serialnumber']}`,
        //                 `${v['genex_faci_siteName']}`,
        //                 `${v['assay_dateupdated']}`,
        //                 `${v['assay_test']}`,
        //                 `${v['assay_quantity']}`
        //             ];    

        //             row_values.push(row_value);
        //             column_values.push(...col_value);
        //         });

        //     if(align == "column"){
        //         return {column_headers,column_values};
        //     }else{
        //         return {row_headers,row_values};
        //     }

        //     }
            
        //     function setPeripherals(datas,align){

        //     let column_headers = [];
        //     let row_headers = align == "column" ?['Peripheral Name','Peripheral Serial Number','Peripheral Model Number']:
        //     ['Genx Serial Number','Facility','Peripheral Name','Peripheral Serial Number','Peripheral Model Number'];
        //     let column_values = [];
        //     let row_values = [];
        //     datas.forEach((v,i)=>{
        //         let header = [`${row_headers[0]} #${i+1}`,`${row_headers[1]} #${i+1}`,
        //         `${row_headers[2]} #${i+1}`];
        //         column_headers.push(...header);

        //         let column_value = [
        //             `${v['peri_peripheralName']}`,
        //             `${v['peri_serialnumber']}`,
        //             `${v['peri_modelnumber']}`
        //         ];

        //         let row_value = [
        //             `${v['genex_serialnumber']}`,
        //             `${v['genex_faci_siteName']}`,
        //             `${v['peri_peripheralName']}`,
        //             `${v['peri_serialnumber']}`,
        //             `${v['peri_modelnumber']}`
        //         ];


                    
        //         row_values.push(row_value);
        //         column_values.push(...column_value);
        //     });

        // if(align == "column"){
        //     return {column_headers,column_values};
        // }else{
        //     return {row_headers,row_values};
        // }

        //     }
            
        //     function setModules(datas,align){


        //     let column_headers = [];
        //     let row_headers = align == "column" ? ['Module Location',
        //     'Module Date Installed',
        //     'Module Installation Type',
        //     'Module Installed By',
        //     'Module Revision Number',
        //     'Module Part Number']:
        //     ['Genx Serial Number','Facility',
        //     'Module Location',
        //     'Module Date Installed',
        //     'Module Installation Type',
        //     'Module Installed By',
        //     'Module Revision Number',
        //     'Module Part Number'];

        //     let column_values = [];
        //     let row_values = [];
        //     datas.forEach((v,i)=>{
        //         let header = [`${row_headers[0]} #${i+1}`,`${row_headers[1]} #${i+1}`,
        //         `${row_headers[2]} #${i+1}`,`${row_headers[3]} #${i+1}`,
        //         `${row_headers[4]} #${i+1}`,`${row_headers[5]} #${i+1}`];
        //         column_headers.push(...header);

        //         let column_value = [
        //             `${v['modu_location']}`,
        //             `${v['modu_dateinstalled']}`,
        //             `${v['modu_inst_itName']}`,
        //             `${v['modu_eng_fullname']}`,
        //             `${v['modu_revision_number']}`,
        //             `${v['modu_part_number']}`
        //         ];

        //         let row_value = [
        //             `${v['genex_serialnumber']}`,
        //             `${v['genex_faci_siteName']}`,
        //             `${v['modu_location']}`,
        //             `${v['modu_dateinstalled']}`,
        //             `${v['modu_inst_itName']}`,
        //             `${v['modu_eng_fullname']}`,
        //             `${v['modu_revision_number']}`,
        //             `${v['modu_part_number']}`];
                    
        //         row_values.push(row_value);
        //         column_values.push(...column_value);
        //     });

        // if(align == "column"){
        //     return {column_headers,column_values};
        // }else{
        //     return {row_headers,row_values};
        // }

        //     }
            
        //     function setAll(datas){
        //         const allheaders = [];
        //         const allvalues = [];



        //         allheaders.push(...setGenexpert(datas['genexperts'],"rows")['row_headers']);
        //         allheaders.push(...setContacts(datas['contacts'],"column")['column_headers']);
        //         allheaders.push(...setAssaystatistics(datas['assaystatistics'],"column")['column_headers']);

        //         allvalues.push(...setGenexpert(datas['genexperts'],"rows")['row_values']);
        //         allvalues.push(...setContacts(datas['contacts'],"column")['column_values']);
        //         allvalues.push(...setAssaystatistics(datas['assaystatistics'],"column")['column_values']);

                
        //         return {allheaders,allvalues};

        //     }
            
        //     const allHeaders = setAll(d)['allheaders'];
        //     const allRows = setAll(d)['allvalues'];

        //     const genexpertHeaders = setGenexpert(d['genexperts'],"rows")['row_headers'];
        //     const genexpertValues = setGenexpert(d['genexperts'],"rows")['row_values'];

        //     const contactsHeaders = setContacts(d['contacts'],"rows")['row_headers'];
        //     const contactsValues = setContacts(d['contacts'],"rows")['row_values'];

        //     const assayHeaders = setAssaystatistics(d['assaystatistics'],"rows")['row_headers'];
        //     const assayValues = setAssaystatistics(d['assaystatistics'],"rows")['row_values'];

        //     const periHeaders = setPeripherals(d['peripherals'],"rows")['row_headers'];
        //     const periValues = setPeripherals(d['peripherals'],"rows")['row_values'];

        //     const modHeaders = setModules(d['modules'],"rows")['row_headers'];
        //     const modValues = setModules(d['modules'],"rows")['row_values'];

        //     const sheets = [ 
        //         {
        //             "sheet-name":"All",
        //             "headers":allHeaders,
        //             "rows":allRows
        //         },
        //         {
        //             "sheet-name":"Genexpert",
        //             "headers":genexpertHeaders,
        //             "rows":genexpertValues
        //         },
        //         {
        //             "sheet-name":"Contacts",
        //             "headers":contactsHeaders,
        //             "rows":contactsValues
        //         },
        //         {
        //             "sheet-name":"Assay Statistics",
        //             "headers":assayHeaders,
        //             "rows":assayValues
        //         },
        //         {
        //             "sheet-name":"Peripherals",
        //             "headers":periHeaders,
        //             "rows":periValues
        //         },
        //         {
        //             "sheet-name":"Modules",
        //             "headers":modHeaders,
        //             "rows":modValues
        //         }
        //     ];
            self.findExcel(function(path){
                    // const report = new ExcelReport();
                    // report.createWorkbook();
        
                    // sheets.forEach(sheet => {
                    // report.createSheet(sheet['sheet-name']);
                    // report.addRow(sheet['sheet-name'],sheet['headers']);
                    //     sheet['rows'].forEach(row =>{
                    //         report.addRow(sheet['sheet-name'],row);
                    //     });
                    // });
                    // report.download(path);
            })

            // self.onExport("excel",function(path,directory,fileName){
                    
            //         const report = new ExcelReport();
            //         report.createWorkbook();
        
            //         sheets.forEach(sheet => {
            //         report.createSheet(sheet['sheet-name']);
            //         report.addRow(sheet['sheet-name'],sheet['headers']);
            //             sheet['rows'].forEach(row =>{
            //                 report.addRow(sheet['sheet-name'],row);
            //             });
            //         });
            //         report.download(path);
            // });
                
        }
       
        // if(opt['transaction'] == "export"){
        //     onExportProcess(opt['datas']);
        // }

     
    }

    onPDF(){


    }

}
const reportView = new ReportView();
module.exports = reportView;