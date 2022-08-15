const fs = require('fs');
const reportSection = require('../sections/ReportSection');
const {backendScreen} = require('../sections/MessageLoadingSection');
const reportModel = require('./ReportModel');
const { getOnDate } = require('../../supporters/sections/RequestSection');
class ReportController{

    constructor(){}

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
}
const reportController = new ReportController();
module.exports = reportController;