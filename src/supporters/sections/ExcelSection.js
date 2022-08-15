const { backendScreen } = require("./MessageLoadingSection");
require('core-js/modules/es.promise');
require('core-js/modules/es.string.includes');
require('core-js/modules/es.object.assign');
require('core-js/modules/es.object.keys');
require('core-js/modules/es.symbol');
require('core-js/modules/es.symbol.async-iterator');
require('regenerator-runtime/runtime');
const ExcelJS  = require("exceljs/dist/es5");
const { ExcelReport } = require("./ExcelReport");
const { dialog } = require("electron");
const accJSON = require("../storages/account.json");
const { inquireDatabase } = require("../databases/ApplicationDatabase");
const { getOnDate } = require("./RequestSection");
class ExcelSection{
    constructor(){

    }

    findExcel(callback,motherparent = "body"){

        $(motherparent).append(`
        <form enctype="multipart/form-data" style="display:none;">
        <input type="file" name="" id="uploadexcel" hidden>
        </form>`
        );

        $("#uploadexcel").trigger('click');
    
        $("#uploadexcel").on("change",function(e){ 
            var path = e.target.files[0].path;

            if(path+"".endsWith('.xlsx')){

                backendScreen({
                        "container":"body",
                        "screen-name":"asset-upload-excel-sap-screen",
                        "loading-box":{
                             "version":1,
                             "message":"Reading Data...."
                        }
                    });
                callback(path);
                
            }else{
                backendScreen({
                    "container":"body",
                    "screen-name":"error-login-screen",
                    "animation":{
                        "stand-up":{
                            "length-second":600,
                            "second":"ms"
                        }
                    },
                    "message-box":{
                         "version":1,
                         "messages":["Invalid Excel File. Only allowed XLSX format."]
                    }
                });
            }
            

            
        });
    }

    uploadingSAP(){
        this.findExcel(function(path){
            const workbook = new ExcelJS.Workbook();
            workbook.xlsx.readFile(path).then(function(){
                var worksheet = workbook.getWorksheet(1);
                worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
                    console.log(row);
                });
            });

        });
    }

    uploadExcelData(callback){
     
        this.uploadSAP(function(datas){


            function escapeRegex(string) {
                return string.replace(/[-\/\\^$*+?.()|[\]{}]"',/g, '\\$&');
            }
            
            const genexperts = datas['genexperts'];
            const assaystatistics = datas['assaystatistics'];
            const modules = datas['modules'];
            const genexpertStatements = [];
            const assayStatements = [];
            const moduleStatements = [];

        

            genexperts.forEach(genexpert=>{

                let modelnumber = genexpert['model-number']+"";
                modelnumber = modelnumber.trim().replace(/"/g,"");
               
                let st = `
                    CALL installGenexpert(
                        "SAP",
                        "${genexpert['serial-number']}",
                        "${genexpert['installed-by']}",
                        "${getOnDate(genexpert['date-installed'])}",
                        "${genexpert['facility']}",
                        "${genexpert['complete-address']}",
                        "N/A",
                        "N/A",
                        "N/A",
                        "N/A",
                        "",
                        "",
                        "",
                        "${genexpert['installation-type']}",
                        "${modelnumber}",
                        "",
                        "",
                        "0001-01-01",
                        "0001-01-01",
                        "${genexpert['status']}",
                        "",
                        ${accJSON["online"]['userID']},
                        ${accJSON["online"]['userID']}
                        )`;

                genexpertStatements.push(st);
            });

            assaystatistics.forEach(assay=>{
                let st = `
                    CALL installAssayStatistic(
                        "${assay['genexpert-serial-number']}",
                        "${assay['test']}",
                        ${assay['quantity']},
                        ${accJSON["online"]['userID']},
                        ${accJSON["online"]['userID']}
                    )
                `;

                assayStatements.push(st);
            });

            modules.forEach(mod=>{


                mod['installed-by'] = mod['installed-by']+"".replace(/"/g,'\"');
                mod['installed-by'] = mod['installed-by']+"".replace(/'/g,"\'");
                mod['installed-by'] = mod['installed-by']+"".replace(/,/g,"\,");
                mod['installed-by'] = escapeRegex(mod['installed-by']);

                let st = `
                    CALL installModule(
                        "${mod['genexpert-serial-number']}",
                        "${mod['serial-number']}",
                        "${mod['revision-number']}",
                        "${mod['part-number']}",
                        "${mod['status']}",
                        ${accJSON["online"]['userID']},
                        ${accJSON["online"]['userID']},
                        "${mod['location']}",
                        "${getOnDate(mod['date-installed'])}",
                        "${mod['installation-type']}",
                        "${mod['installed-by']}"
                    )
                `;

                moduleStatements.push(st);
            });


            function genexpertProcess(count,callback){

                $(".ldg-box-01 > h3").html(`Genexpert Process 
                ${Math.ceil((count/genexpertStatements.length)* 100)}%`);

                if(count < genexpertStatements.length){

                    inquireDatabase({
                        "statement":genexpertStatements[count]
                    },function(){
                        count++;
                        genexpertProcess(count,callback);

                    })

                }else{
                    callback();
                }

            }

            function assayProcess(count,callback){

                $(".ldg-box-01 > h3").html(`Assaystatistic Process 
                ${Math.ceil((count/assayStatements.length)* 100)}%`);

                if(count < assayStatements.length){

                    inquireDatabase({
                        "statement":assayStatements[count]
                    },function(){
                        count++;
                        assayProcess(count,callback);

                    })

                }else{
                    callback();
                }

            }

            function moduleProcess(count,callback){

                $(".ldg-box-01 > h3").html(`Module Process 
                ${Math.ceil((count/moduleStatements.length)* 100)}%`);

                if(count < moduleStatements.length){

                    inquireDatabase({
                        "statement":moduleStatements[count]
                    },function(){
                        count++;
                        moduleProcess(count,callback);

                    })

                }else{
                    callback();
                }

            }

            backendScreen({
                "container":"body",
                "screen-name":"sap-progress-screen",
                "loading-box":{
                     "version":1,
                     "message":"Please wait..."
                }
            });

            genexpertProcess(0,function(){

                assayProcess(0,function(){

                    moduleProcess(0,function(){
                        $(".sap-progress-screen").remove();
                        callback();
                    });
                  

                });
               
            });


        });
      
    }

    uploadSAP(callback){

        this.findExcel(function(path){
            const workbook = new ExcelJS.Workbook();
            workbook.xlsx.readFile(path)
            .then(function() {
        
                var worksheet = workbook.getWorksheet(1);
                const genexperts = [];
                const modules = [];
                const assaystatistics = [];
                let current_selected_row_genexpert_serial_number = "";
                worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {

                    if(rowNumber > 1){
                        
                        if(current_selected_row_genexpert_serial_number == ""){
                            current_selected_row_genexpert_serial_number = row.values[2];
                        }

                        if(row.values.length > 3){

                            if(row.values[4] == "Machine"){

                                genexperts.push({
                                    "serial-number":row.values[2],
                                    "facility": row.values[11],
                                    "date-installed":row.values[7],
                                    "installation-type":row.values[8],
                                    "installed-by":row.values[13],
                                    "model-number":row.values[1],
                                    "complete-address":row.values[12],
                                    "status":row.values[5]
                                });

                                assaystatistics.push({
                                    "genexpert-serial-number":row.values[2],
                                    "test":row.values[8],
                                    "quantity":row.values[9] == undefined ?0:row.values[9],
                                    "running-date":row.values[10]
                                });
                                
                            }else if(row.values[4] == "Modules"){

                                    modules.push({
                                        "serial-number":row.values[3],
                                        "genexpert-serial-number":row.values[2],
                                        "date-installed":row.values[7],
                                        "installation-type":row.values[8],
                                        "installed-by":row.values[13],
                                        "status":row.values[5],
                                        "location":row.values[6],
                                        "revision-number":"NA",
                                        "part-number":"NA"
                                    });

                                
                            
                            }

                        
                        
                        }


                    }


                }); //End of the loop   
                callback({   
                    "genexperts":genexperts,
                    "modules":modules,
                    "assaystatistics":assaystatistics
                });
                
                

            });


        });
    }

    uploadPM(fileformat,callback){

        this.findExcel(function(path){

            const workbook = new ExcelJS.Workbook();
            workbook.xlsx.readFile(path)
            .then(function() {
        
                // var worksheet = workbook.getWorksheet(1);

                workbook.worksheets.forEach(w=>{
                
                    switch(w['name']){
                        case "PM Schedule NCR": pmScheduleNCR(w); break;
                    }





                });

                function pmScheduleNCR(worksheet){

                    let keys = [];
                    let alls = [];
                    let cleans = [];

                    worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {

                       
                        if(rowNumber > 2){

                            if(rowNumber == 3){
                                keys = row.values;
                            }else{
                                const rowadd = {};
                                row.values.forEach((v,i)=>{
                                    rowadd[keys[i]] = v;
                                });
                                alls.push(rowadd);


                            }

                        }

                    });

                    alls.forEach(d=>{
                        cleans.push({
                            "genexpert-serial-number":d['SERIAL NUMBER'],
                            "pm-date":getOnDate(d['LAST PM DATE']),
                            "pm-due-date":getOnDate(d['NEXT PM DATE']),
                            "done-by":d['IN-CHARGE'],
                            "remarks":d['REMARKS'],
                            "pm-frequency":d['PM-FREQUENCY']
                        });
                    });
                
                    return callback(cleans);


                    //onDatabase

                    
                }

         
                // worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {

                    

                // }); //End of the loop   
               
                

            });


        });
    }

    uploadXpertcheck(fileformat,callback){

        this.findExcel(function(path){

            const workbook = new ExcelJS.Workbook();
            workbook.xlsx.readFile(path)
            .then(function() {
        
                // var worksheet = workbook.getWorksheet(1);

                workbook.worksheets.forEach(w=>{
                
                    switch(w['name']){
                        case "Cal Schedule NCR": xpertcheckScheduleNCR(w); break;
                    }





                });

                function xpertcheckScheduleNCR(worksheet){

                    let keys = [];
                    let alls = [];
                    let cleans = [];

                    worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {

                       
                        if(rowNumber > 2){

                            if(rowNumber == 3){
                                keys = row.values;
                            }else{
                                const rowadd = {};
                                row.values.forEach((v,i)=>{
                                    rowadd[keys[i]] = v;
                                });
                                alls.push(rowadd);


                            }

                        }

                    });

                    alls.forEach(d=>{
                        cleans.push({
                            "genexpert-serial-number":d['SERIAL NUMBER'],
                            "xpertcheck-date":getOnDate(d['CAL DATE']),
                            "xpertcheck-due-date":getOnDate(d['NEXT PM DATE']),
                            "done-by":d['IN-CHARGE'],
                            "remarks":d['REMARKS'],
                            "xpertcheck-frequency":d['FREQUENCY']
                        });
                    });
                
                    return callback(cleans);


                    //onDatabase

                    
                }

         
                // worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {

                    

                // }); //End of the loop   
               
                

            });


        });
    }
    
    openExcelFile(cb){

        const homeDir = require('os').homedir();
        const desktopDir = `${homeDir}/Desktop`;
        
    
        let path = dialog.showSaveDialogSync(null,{
            defaultPath:desktopDir
        });
    
        const last5 = path.slice(path.length-5,path.length);
        const indexOflastSlash = path.lastIndexOf("\\");

        if(last5 != ".xlsx"){
           path+=".xlsx";
        }
        const directory = path.slice(0,indexOflastSlash+1);
        const filename = path.slice(indexOflastSlash+1,path.length);
       
        cb(path,directory,filename);
       
    }

    getDatas(filterName,callback){
        const filter = filterJSON[filterName];

        
        
    }

    createExcel(fileName,wb){
        const ExcelForm = new ExcelReport();
        ExcelForm.createWorkbook();

        wb.forEach(sheet => {
            ExcelForm.createSheet(sheet['sheet-name']);
            ExcelForm.addRow(sheet['sheet-name'],sheet['headers']);
            sheet['rows'].forEach(row =>{
                ExcelForm.addRow(sheet['sheet-name'],row);
            });
        });
        ExcelForm.download(fileName);
     

    }

    createMachineReportFilterBased(datas,callback){
       
        
        var self = this;
       function createFile(sheets){

        self.openExcelFile(function(path,directory,filename){
                
                self.createExcel(path,sheets);
            });
       }
      
       function setGenexpert(datas,align){
        let column_headers = [];
        let row_headers =[
            "ID",
            "Date Added",
            "Date Updated",
            "Genx Serial Number",
            "Site/Facility",
            "Installed By",
            "Date Installed",
            "Installation Type",
            "Model Number",
            "Complete Address",
            "Region",
            "Province",
            "City",
            "Barangay",
            "Street",
            "Latitude",
            "Longitude",
            "Software Version",
            "OS Version",
            "Warranty Expiry Date",
            "Service Contract Expiry Date",
            "Status",
            "Remarks",
            "Added By"];
        let column_values = [];
        let row_values = [];
        datas.forEach((v,i)=>{
            let header = [
                `${row_headers[0]}`,
                `${row_headers[1]}`,
                `${row_headers[2]}`,
                `${row_headers[3]}`,
                `${row_headers[4]}`,
                `${row_headers[5]}`,
                `${row_headers[6]}`,
                `${row_headers[7]}`,
                `${row_headers[8]}`,
                `${row_headers[9]}`,
                `${row_headers[10]}`,
                `${row_headers[11]}`,
                `${row_headers[12]}`,
                `${row_headers[13]}`,
                `${row_headers[14]}`,
                `${row_headers[15]}`,
                `${row_headers[16]}`,
                `${row_headers[17]}`,
                `${row_headers[18]}`,
                `${row_headers[19]}`,
                `${row_headers[20]}`,
                `${row_headers[21]}`,
                `${row_headers[22]}`,
                `${row_headers[23]}`];
            column_headers.push(...header);

            let value = [
                `${v['genex_genexpertID']}`,
                `${v['genex_dateadded']}`,
                `${v['genex_dateupdated']}`,
                `${v['genex_serialnumber']}`,
                `${v['genex_faci_siteName']}`,
                `${v['genex_eng_fullname']}`,
                `${v['genex_dateinstalled']}`,
                `${v['genex_inst_itName']}`,
                `${v['genex_mode_mnName']}`,
                `${v['genex_faci_complete_address']}`,
                `${v['genex_faci_region']}`,
                `${v['genex_faci_province']}`,
                `${v['genex_faci_city']}`,
                `${v['genex_faci_barangay']}`,
                `${v['genex_faci_street']}`,
                `${v['genex_faci_latitude']}`,
                `${v['genex_faci_longitude']}`,
                `${v['genex_software_version']}`,
                `${v['genex_os_version']}`,
                `${v['genex_warranty_expiry_date']}`,
                `${v['genex_service_contract_expiry_date']}`,
                `${v['genex_status']}`,
                `${v['genex_remarks']}`,
                `${v['genex_user_addedby_firstname']} ${v['genex_user_addedby_lastname']}`];

            row_values.push(value);
            column_values.push(...value);
        });

        if(align == "column"){
            return {column_headers,column_values};
        }else{
                return {row_headers,row_values};
        }

       }

       function setContacts(datas,align){

            let column_headers = [];
            let row_headers = align == "column" ? 
            ['Contact Person','Contact Position','Contact Email','Contact Number']:
            ['Genx Serial Number','Facility','Contact Person','Contact Position'
            ,'Contact Email','Contact Number'];
            let column_values = [];
            let row_values = [];
            datas.forEach((v,i)=>{
                let header = [`${row_headers[0]} #${i+1}`,`${row_headers[1]} #${i+1}`,
                `${row_headers[2]} #${i+1}`,`${row_headers[3]} #${i+1}`];
                column_headers.push(...header);

                let value = [
                    `${v['genex_faci_cont_fullname']}`,
                    `${v['genex_faci_cont_position']}`,
                    `${v['genex_faci_cont_email']}`,
                    `${v['genex_faci_cont_contactnumber']}`];

                row_values.push(value);
                column_values.push(...value);
            });

           if(align == "column"){
               return {column_headers,column_values};
           }else{
                return {row_headers,row_values};
           }

       }

       function setAssaystatistics(datas,align){

            let column_headers = [];
            let row_headers = align == "column" ? ['Assay Date','Assay Test','Assay Quantity'] :
             ['Genx Serial Number','Facility','Assay Date','Assay Test','Assay Quantity'];
            let column_values = [];
            let row_values = [];
            datas.forEach((v,i)=>{
                let header = [`${row_headers[0]} #${i+1}`,`${row_headers[1]} #${i+1}`,
                `${row_headers[2]} #${i+1}`];
                column_headers.push(...header);

                let col_value = [
                    `${v['assay_dateupdated']}`,
                    `${v['assay_test']}`,
                    `${v['assay_quantity']}`];
                let row_value =  [
                  
                    `${v['genex_serialnumber']}`,
                    `${v['genex_faci_siteName']}`,
                    `${v['assay_dateupdated']}`,
                    `${v['assay_test']}`,
                    `${v['assay_quantity']}`
                ];    

                row_values.push(row_value);
                column_values.push(...col_value);
            });

       if(align == "column"){
           return {column_headers,column_values};
       }else{
            return {row_headers,row_values};
       }

       }

       function setPeripherals(datas,align){

        let column_headers = [];
        let row_headers = align == "column" ?['Peripheral Name','Peripheral Serial Number','Peripheral Model Number']:
        ['Genx Serial Number','Facility','Peripheral Name','Peripheral Serial Number','Peripheral Model Number'];
        let column_values = [];
        let row_values = [];
        datas.forEach((v,i)=>{
            let header = [`${row_headers[0]} #${i+1}`,`${row_headers[1]} #${i+1}`,
            `${row_headers[2]} #${i+1}`];
            column_headers.push(...header);

            let column_value = [
                `${v['peri_peripheralName']}`,
                `${v['peri_serialnumber']}`,
                `${v['peri_modelnumber']}`
            ];

            let row_value = [
                `${v['genex_serialnumber']}`,
                `${v['genex_faci_siteName']}`,
                `${v['peri_peripheralName']}`,
                `${v['peri_serialnumber']}`,
                `${v['peri_modelnumber']}`
            ];


                
            row_values.push(row_value);
            column_values.push(...column_value);
        });

   if(align == "column"){
       return {column_headers,column_values};
   }else{
        return {row_headers,row_values};
   }

       }

       function setModules(datas,align){


        let column_headers = [];
        let row_headers = align == "column" ? ['Module Location',
        'Module Date Installed',
        'Module Installation Type',
        'Module Installed By',
        'Module Revision Number',
        'Module Part Number']:
        ['Genx Serial Number','Facility',
        'Module Location',
        'Module Date Installed',
        'Module Installation Type',
        'Module Installed By',
        'Module Revision Number',
        'Module Part Number'];

        let column_values = [];
        let row_values = [];
        datas.forEach((v,i)=>{
            let header = [`${row_headers[0]} #${i+1}`,`${row_headers[1]} #${i+1}`,
            `${row_headers[2]} #${i+1}`,`${row_headers[3]} #${i+1}`,
            `${row_headers[4]} #${i+1}`,`${row_headers[5]} #${i+1}`];
            column_headers.push(...header);

            let column_value = [
                `${v['modu_location']}`,
                `${v['modu_dateinstalled']}`,
                `${v['modu_inst_itName']}`,
                `${v['modu_eng_fullname']}`,
                `${v['modu_revision_number']}`,
                `${v['modu_part_number']}`
            ];

            let row_value = [
                `${v['genex_serialnumber']}`,
                `${v['genex_faci_siteName']}`,
                `${v['modu_location']}`,
                `${v['modu_dateinstalled']}`,
                `${v['modu_inst_itName']}`,
                `${v['modu_eng_fullname']}`,
                `${v['modu_revision_number']}`,
                `${v['modu_part_number']}`];
               
            row_values.push(row_value);
            column_values.push(...column_value);
        });

   if(align == "column"){
       return {column_headers,column_values};
   }else{
        return {row_headers,row_values};
   }

       }

        function setAll(datas){
            const allheaders = [];
            const allvalues = [];



            allheaders.push(...setGenexpert(datas['genexperts'],"rows")['row_headers']);
            allheaders.push(...setContacts(datas['contacts'],"column")['column_headers']);
            allheaders.push(...setAssaystatistics(datas['assaystatistics'],"column")['column_headers']);

            allvalues.push(...setGenexpert(datas['genexperts'],"rows")['row_values']);
            allvalues.push(...setContacts(datas['contacts'],"column")['column_values']);
            allvalues.push(...setAssaystatistics(datas['assaystatistics'],"column")['column_values']);

            
            return {allheaders,allvalues};

        }

        const allHeaders = setAll(datas)['allheaders'];
        const allRows = setAll(datas)['allvalues'];

        const genexpertHeaders = setGenexpert(datas['genexperts'],"rows")['row_headers'];
        const genexpertValues = setGenexpert(datas['genexperts'],"rows")['row_values'];

        const contactsHeaders = setContacts(datas['contacts'],"rows")['row_headers'];
        const contactsValues = setContacts(datas['contacts'],"rows")['row_values'];

        const assayHeaders = setAssaystatistics(datas['assaystatistics'],"rows")['row_headers'];
        const assayValues = setAssaystatistics(datas['assaystatistics'],"rows")['row_values'];

        const periHeaders = setPeripherals(datas['peripherals'],"rows")['row_headers'];
        const periValues = setPeripherals(datas['peripherals'],"rows")['row_values'];

        const modHeaders = setModules(datas['modules'],"rows")['row_headers'];
        const modValues = setModules(datas['modules'],"rows")['row_values'];


        createFile([ 
            {
                "sheet-name":"All",
                "headers":allHeaders,
                "rows":allRows
            },
            {
                "sheet-name":"Genexpert",
                "headers":genexpertHeaders,
                "rows":genexpertValues
            },
            {
                "sheet-name":"Contacts",
                "headers":contactsHeaders,
                "rows":contactsValues
            },
            {
                "sheet-name":"Assay Statistics",
                "headers":assayHeaders,
                "rows":assayValues
            },
            {
                "sheet-name":"Peripherals",
                "headers":periHeaders,
                "rows":periValues
            },
            {
                "sheet-name":"Modules",
                "headers":modHeaders,
                "rows":modValues
            }
    ]);
        callback();
    }

    createExcelReport(datas,callback){

        var self = this;
      

       
        function genexpertHeaders(nottoDisplay){
            const defaultheader = [
                "ID",
                "Date Added",
                "Date Updated",
                "Genx Serial Number",
                "Site/Facility",
                "Installed By",
                "Date Installed",
                "Installation Type",
                "Model Number",
                "Complete Address",
                "Region",
                "Province",
                "City",
                "Barangay","Street",
                "Latitude",
                "Longitude",
                "Software Version",
                "OS Version",
                "Warranty Expiry Date",
                "Service Contract Expiry Date",
                "Status",
                "Remarks",
                "Added By"];
            nottoDisplay.forEach(val => {
                defaultheader = defaultheader.filter(hdr=>{
                    hdr != val;
                });
            });
    
            return defaultheader;
        }

        function createContactHeaders(){
            
        }

        function classifiedDatas(cb){

            self.getDatas(filterName,function(datas){

                const headers = genexpertHeaders();
                const rows = [];


                const contactCounts =  datas['contacts'].map(v=>{
                    return v['contact_a_siteID'];
                }).reduce((acc, value) => ({
                    ...acc,
                    [value]: (acc[value] || 0) + 1
                 }), {});
    
                 let contactLargest= 0;
                 Object.values(contactCounts).forEach((n,i)=>{
                    if(contactLargest < n){
                        contactLargest = n;
                    }
                 });

                 for(let c = 1; c<=contactLargest; c++){
                    headers.push(`Contact Person #${c}`);
                    headers.push(`Contact Position #${c}`);
                    headers.push(`Contact Email #${c}`);
                    headers.push(`Contact Number #${c}`);
                  
                }


                const moduleCounts =  datas['modules'].filter(fi=>{
                    return fi['genexpert_h_status'] == "Active";
                }).map(v=>{
                    return v['genexpert_h_genexpertSN'];
                }).reduce((acc, value) => ({
                    ...acc,
                    [value]: (acc[value] || 0) + 1
                 }), {});
    
                 let modlargest= 0;
               
                 Object.values(moduleCounts).forEach((n,i)=>{
                    if(modlargest < n){
                        modlargest = n;
                    }
                 });
    
                for(let i = 1; i<=modlargest; i++){
                headers.push(`Module SN #${i}`);
                headers.push(`Module Location #${i}`);
                headers.push(`Module Date Installed #${i}`);
                headers.push(`Module Installation Type #${i}`);
                headers.push(`Module Installed By #${i}`);
                headers.push(`Module Revision Number #${i}`);
                headers.push(`Module Part Number #${i}`);
                }

                const assayCounts =  datas['assaystatistics'].filter(f=>{
                    return f['genexpert_j_genexpertSN'] != "undefined";
                }).map(v=>{
                    return v['genexpert_j_genexpertSN'];
                }).reduce((acc, value) => ({
                    ...acc,
                    [value]: (acc[value] || 0) + 1
                 }), {});
    
                let assaylargest= 0;
                
                Object.values(assayCounts).forEach((n,i)=>{
                    if(assaylargest < n){
                        assaylargest = n;
                    }
                });

                for(let a = 1; a<=assaylargest; a++){
                    headers.push(`Assay Date #${a}`);
                    headers.push(`Assay Test #${a}`);
                    headers.push(`Assay Quantity #${a}`);
                }

                const periCounts =  datas['peripherals'].filter(f=>{
                    return f['genexpert_i_genexpertSN'] != "undefined";
                }).map(v=>{
                    return v['genexpert_i_genexpertSN'];
                }).reduce((acc, value) => ({
                    ...acc,
                    [value]: (acc[value] || 0) + 1
                 }), {});
    
                let periLargest= 0;
                
                Object.values(periCounts).forEach((n,i)=>{
                    if(periLargest < n){
                        periLargest = n;
                    }
                });

                for(let b = 1; b<=periLargest; b++){
                    headers.push(`Peripheral Name #${b}`);
                    headers.push(`Peripheral Serial Number #${b}`);
                    headers.push(`Peripheral Model Number #${b}`);
                }


                //classifying rows     
                const assetDatas = datas['assets'].map(v=>{

                    const addbyfullname = `${v["genexpert_f_firstname"]} ${v["genexpert_f_lastname"]}`;

                    let contactLine = [];
                    const contactvalues = datas['contacts'].filter(con=>{
                        return con["contact_a_siteID"] == v["genexpert_a_siteID"];
                    });

                    contactvalues.forEach(con=>{
                        contactLine.push(con["contact_a_fullname"]);
                        contactLine.push(con["contact_a_position"]);
                        contactLine.push(con["contact_a_email"]);
                        contactLine.push(con["contact_a_contactnumber"]);
                        
                    });


                    let modLine = [];

                    const modvalues = datas['modules'].filter(mod=>{
                        return mod["genexpert_h_genexpertSN"] == v["genexpert_a_serialnumber"] && 
                        mod["genexpert_h_status"] == "Active";
                    });
                    
                    modvalues.forEach(mod=>{
                        modLine.push(mod["genexpert_h_serialnumber"]);
                        modLine.push(mod["genexpert_h_location"]);
                        modLine.push(mod["genexpert_h_dateinstalled"]);
                        modLine.push(mod["genexpert_hc_itName"]);
                        modLine.push(mod["genexpert_hd_fullname"]);
                        modLine.push(mod["genexpert_h_revision_number"]);
                        modLine.push(mod["genexpert_h_part_number"]);
                        
                    });

                    const modremains = modlargest - modvalues.length;

                    for(let x=0; x<modremains; x++){

                        modLine.push("");
                        modLine.push("");
                        modLine.push("");
                        modLine.push("");
                        modLine.push("");
                        modLine.push("");
                        modLine.push("");

                    }

                    
                    let assayLine = [];

                    const assayvalues = datas['assaystatistics'].filter(assay=>{
                        return assay["genexpert_j_genexpertSN"] == v["genexpert_a_serialnumber"];
                    });

                    assayvalues.forEach(assay=>{
                        assayLine.push(self.changeDate(assay["genexpert_j_dateadded"]));
                        assayLine.push(assay["genexpert_j_test"]);
                        assayLine.push(assay["genexpert_j_quality"]);
                    });


                    const assayremains = assaylargest - assayvalues.length;

                    for(let z=0; z<assayremains; z++){

                        assayLine.push("");
                        assayLine.push("");
                        assayLine.push("");

                    }


                    let periLine = [];

                    const perivalues = datas['peripherals'].filter(peri=>{
                        return peri["genexpert_i_genexpertSN"] == v["genexpert_a_serialnumber"];
                    });
                    
                    perivalues.forEach(mod=>{
                        periLine.push(mod["genexpert_i_peripheralName"]);
                        periLine.push(mod["genexpert_i_serialnumber"]);
                        periLine.push(mod["genexpert_i_modelnumber"]);
                        
                    });

                    const periremains = periLargest - perivalues.length;

                    for(let y=0; y<periremains; y++){

                        periLine.push("");
                        periLine.push("");
                        periLine.push("");
                    }


                    return [
                        v["genexpert_a_genexpertID"],
                        self.changeDate(v["genexpert_a_dateadded"]),
                        self.changeDate(v["genexpert_a_dateupdated"]),
                        v["genexpert_a_serialnumber"],
                        v["genexpert_e_siteName"],
                        v["genexpert_b_fullname"],
                        v["genexpert_a_dateinstalled"],
                        v["genexpert_c_itName"],
                        v["genexpert_d_mnName"],
                        v["genexpert_e_complete_address"],
                        v["genexpert_e_region"],
                        v["genexpert_e_province"],
                        v["genexpert_e_city"],
                        v["genexpert_e_barangay"],
                        v["genexpert_e_street"],
                        v["genexpert_e_latitude"],
                        v["genexpert_e_longitude"],
                        v["genexpert_a_software_version"],
                        v["genexpert_a_os_version"],
                        v["genexpert_a_warranty_expiry_date"],
                        v["genexpert_a_service_contract_expiry_date"],
                        v["genexpert_a_status"],
                        v["genexpert_a_remarks"],
                        addbyfullname,
                        ...contactLine,
                        ...modLine,
                        ...assayLine,
                        ...periLine
                        
                    ]
                });
    
                rows.push(...assetDatas);
                 
                cb(headers,rows);
                
    
            });

        }

        this.openExcelFile(function(path,directory,filename){

            classifiedDatas(function(headers,rows){

                self.createExcel(path,[
                    {
                        "sheet-name":"All",
                        "headers":headers,
                        "rows":rows
                    }
                ]);
            })
        });

        callback();


    }

    download(){

        function individual(datas,filename){

            console.log(datas);

            const workbook = new ExcelJS.Workbook();

            function bySheet(){

                workbook.addWorksheet("Genexpert");
                workbook.addWorksheet("Assaystatistics");
                workbook.addWorksheet("Peripherals");
                workbook.addWorksheet("Modules");
                workbook.addWorksheet("Xpertchecks");
                workbook.addWorksheet("Preventive Maintenances");
                

                // assign genexpert
                const genexpert = workbook.getWorksheet("Genexpert");
                const gen = datas['genexpert'];
                
                const titleColumn = genexpert.getColumn(1);
                titleColumn.width = 30;
                titleColumn.style = {font:{bold: true, name: 'Verdana'}};
                const valueColumn = genexpert.getColumn(2);
                valueColumn.width = 100;

                let rows = [
                ["Serial Number",gen['genex_serialnumber']],
                ["Facility/Site",gen['genex_faci_siteName']],
                ["Date Installed",getOnDate(gen['genex_dateinstalled'])],
                ["Date Added",getOnDate(gen['genex_dateadded'])],
                ["Last Update",getOnDate(gen['genex_dateupdated'])],
                ["Engineer",gen['genex_eng_fullname']],
                ["Installation Type",gen['genex_inst_itName']],
                ["Model Number",gen['genex_mode_mnName']],
                ["Software Version",gen['genex_software_version']],
                ["OS Version",gen['genex_os_version']],
                ["Added By",`${gen['genex_user_addedby_firstname']} ${gen['genex_user_addedby_lastname']}`],
                ["Last Update By",`${gen['genex_user_updatedby_firstname']} ${gen['genex_user_updatedby_lastname']}`]];

                rows.forEach(r=>{
                    const row = genexpert.addRow(r);
                    row.getCell(1).border = {
                        top: {style:'thin'},
                        left: {style:'thin'},
                        bottom: {style:'thin'},
                        right: {style:'thin'}
                    };

                    row.getCell(1).fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: {
                            argb: "FFFF7D7D"
                        },bgColor: {
                            argb: "00000000"
                        }
                    };
                    row.getCell(2).border = {
                        top: {style:'thin'},
                        left: {style:'thin'},
                        bottom: {style:'thin'},
                        right: {style:'thin'}
                    };


                   
                });

                

                // assign assaystatistic
                const assaystatistic = workbook.getWorksheet("Assaystatistics");
                const assays = datas['assaystatistic'];
                assaystatistic.columns = [
                    { header: 'Date Added', key:'assay-date-added', width: 20},
                    { header: 'Date Updated', key: 'assay-date-updated', width: 20 },
                    { header: 'Assay', key: 'assay-assay', width: 30},
                    { header: 'Assay Statistic', key: 'assay-statistic', width: 30},
                    { header: 'Added By', key: 'assay-added-by', width: 40},
                    { header: 'Last Updated By', key: 'assay-updated-by', width: 40}
                  ];

                  assaystatistic.getRow(1).eachCell((cell, rowNumber) => { 
                    cell.font = { color: { argb: '000000' },size: 12,
                    bold: true}
                    });
             
                assays.forEach(a=>{
                    assaystatistic.addRow([
                        getOnDate(a['assay_dateadded']),
                        getOnDate(a['assay_dateupdated']),
                        a['assay_test'],
                        a['assay_quantity'],
                        `${a['assay_addedby_firstname']} ${a['assay_addedby_lastname']}`,
                        `${a['assay_updatedby_firstname']} ${a['assay_updatedby_lastname']}`
                    ]);
                });


                 // assign peripherals
                 const peripherals = workbook.getWorksheet("Peripherals");
                 const peris = datas['peripheral'];
                 peripherals.columns = [
                     { header: 'Date Added', key:'peri-date-added', width: 20},
                     { header: 'Date Updated', key: 'peri-date-updated', width: 20 },
                     { header: 'Name', key: 'peri-name', width: 30},
                     { header: 'Serial Number', key: 'peri-serial-number', width: 30},
                     { header: 'Model Number', key: 'peri-model-number', width: 30},
                     { header: 'Added By', key: 'peri-added-by', width: 40},
                     { header: 'Last Updated By', key: 'peri-updated-by', width: 40}
                   ];

                   peripherals.getRow(1).eachCell((cell, rowNumber) => { 
                    cell.font = { color: { argb: '000000' },size: 12,
                    bold: true}
                    });
              
                peris.forEach(a=>{
                     peripherals.addRow([
                         getOnDate(a['peri_dateadded']),
                         getOnDate(a['peri_dateupdated']),
                         a['peri_peripheralName'],
                         a['peri_serialnumber'],
                         a['peri_modelnumber'],
                         `${a['peri_addedby_firstname']} ${a['peri_addedby_lastname']}`,
                         `${a['peri_updatedby_firstname']} ${a['peri_updatedby_lastname']}`
                     ]);
                });

                 // assign modules
                 const modules = workbook.getWorksheet("Modules");
                 const mod = datas['module'];
                 modules.columns = [
                     { header: 'Date Added', key:'module-date-added', width: 20},
                     { header: 'Date Updated', key: 'module-date-updated', width: 20 },
                     { header: 'Serial Number', key: 'module-serial-number', width: 15},
                     { header: 'Location', key: 'module-location', width: 15},
                     { header: 'Date Installed', key: 'module-date-installed', width: 20},
                     { header: 'Engineer', key: 'module-engineer', width: 30},
                     { header: 'Installation Type', key: 'module-installation-type', width: 20},
                     { header: 'Status', key: 'module-status', width: 20},
                     { header: 'Part Number', key: 'module-part-number', width: 25},
                     { header: 'Revision Number', key: 'module-revision-number', width: 25},
                     { header: 'Added By', key: 'module-added-by', width: 40},
                     { header: 'Last Updated By', key: 'module-updated-by', width: 40}
                   ];

                   modules.getRow(1).eachCell((cell, rowNumber) => { 
                    cell.font = { color: { argb: '000000' },size: 12,
                    bold: true}
                    });
              
                   mod.forEach(a=>{
                    modules.addRow([
                         getOnDate(a['modu_dateadded']),
                         getOnDate(a['modu_dateupdated']),
                         a['modu_serialnumber'],
                         a['modu_location'],
                         getOnDate(a['modu_dateinstalled']),
                         a['modu_eng_fullname'],
                         a['modu_inst_itName'],
                         a['modu_status'],
                         a['modu_part_number'],
                         a['modu_revision_number'],
                         `${a['modu_user_addedby_firstname']} ${a['modu_user_addedby_lastname']}`,
                         `${a['modu_user_updatedby_firstname']} ${a['modu_user_updatedby_lastname']}`
                     ]);
                });


                // assign xpertcheck
                const xpertchecks = workbook.getWorksheet("Xpertchecks");
                const xchecks = datas['xpertcheck'];
                xpertchecks.columns = [
                    { header: 'Calibrate Start', key: 'xpertcheck-calibrate-start', width: 15},
                    { header: 'Calibrate Done', key: 'xpertcheck-calibrate-done', width: 15},
                    { header: 'Engineer', key: 'xpertcheck-engineer', width: 20}
                    
                  ];

                  xpertchecks.getRow(1).eachCell((cell, rowNumber) => { 
                    cell.font = { color: { argb: '000000' },size: 12,
                    bold: true}
                    });
             
                  xchecks.forEach(a=>{
                    xpertchecks.addRow([
                        getOnDate(a['calibrate_start']),
                        getOnDate(a['calibrate_done']),
                        a['fullname']
                    ]);
               });

               // assign xpertcheck
               const preventive_maintenances = workbook.getWorksheet("Preventive Maintenances");
               const pms = datas['preventive-maintenance'];
               preventive_maintenances.columns = [
                   { header: 'Calibrate Start', key: 'pm-calibrate-start', width: 15},
                   { header: 'Calibrate Done', key: 'pm-calibrate-done', width: 15},
                   { header: 'Engineer', key: 'pm-engineer', width: 20}
                   
                 ];

                 preventive_maintenances.getRow(1).eachCell((cell, rowNumber) => { 
                    cell.font = { color: { argb: '000000' },size: 12,
                    bold: true}
                    });
            
                 pms.forEach(a=>{
                    preventive_maintenances.addRow([
                       getOnDate(a['calibrate_start']),
                       getOnDate(a['calibrate_done']),
                       a['fullname']
                   ]);
              });
                

                workbook.xlsx.writeFile(filename);


            }

            return {bySheet};

        }

        return {individual};
    }



}
module.exports = ExcelSection;