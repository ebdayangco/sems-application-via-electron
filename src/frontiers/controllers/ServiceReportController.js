const reportLibrary = require("../../supporters/sections/ReportLibrary");
const serviceReportModel = require("../models/ServiceReportModel");
const serviceReportView = require("../views/ServiceReportView");
const transactionView = require("../views/TransactionView");
const PaginationController = require("./PaginationController");
class ServiceReportController{
    constructor(){

        this.displayServiceReport(true);
        this.paginationController = new PaginationController();
        this.paginationController.pageNum =  `#service-report-index-pagination > 
        .pagination-paging-control > .pagination-select > input`;

    }
    onView(){
        return serviceReportView;
    }

    onFilterView(div){

        serviceReportView.toggleFilter(div,'#service-report-filter-area');
        this.div = div;
    }

    insertServiceReport(transID,callback){

        let mainValidate = transactionView.getMainTransactDatas();
        
        if(mainValidate['need-service-report'] === true){

            serviceReportModel.process().insert(transID,callback);

        }else{
            callback();
        }
        
    }
    checkServiceReport(servicereportnum,ifexist,ifnotexist){
        serviceReportModel.process().checkExist(servicereportnum,ifexist,ifnotexist);
    }

    getServiceReport(filter="",limit=50,offset=0,callback){
        serviceReportModel.process().getServiceReport(filter,limit,offset,callback);
    }
    getServiceReportforGenexpertInfo(sn,callback){
        serviceReportModel.process().getServiceReportforGenexpertInfo(sn,callback);
    }
   
    onPagination(){

        var self = this;
        return this.paginationController.paginationControl(function(){
            self.displayServiceReport();
        });
    }

    getAllServiceReport(filter,callback){
        serviceReportModel.process().getAllServiceReport(filter,callback);
    }



    displayServiceReport(showLoad = true){

        var self = this;

        const sr_model = serviceReportModel.process();
        const allfilter = serviceReportView.getFilters();
        const limitOffset = serviceReportView.getLimitOffset();
        let limit = limitOffset['limit'];
        let offset = limitOffset['offset'];
        let pageNum = limitOffset['page-num'];
        serviceReportView.container = "#service-report-frame-area";
        serviceReportView.screenName = "service-report-process-screen";

        async function startLoader(showLoad){
            if(showLoad){
                serviceReportView.loader({
                    "loader-01":true
                });
            }
           
        }

        startLoader(showLoad).then(()=>{


            sr_model.getTotalServiceReport(allfilter,function(t_res){

                const total = t_res[0]['total'];

                const totalPage = Math.ceil(total/limit);

                if(totalPage-pageNum == 0){
                
                $(`#service-report-index-pagination .pagination-paging-control > 
                .pagination-next > a`).addClass('a-disabled');

                }else if(totalPage == 1){

                    $(`#service-report-index-pagination .pagination-paging-control > 
                    .pagination-next > a`).addClass('a-disabled');

                }else{
                    $(`#service-report-index-pagination .pagination-paging-control > 
                    .pagination-next > a`).removeClass('a-disabled');
                }

                if(pageNum == 1 || isNaN(pageNum)){

                    $(`#service-report-index-pagination .pagination-paging-control > 
                    .pagination-previous > a`).addClass('a-disabled');

                }else{

                    $(`#service-report-index-pagination .pagination-paging-control > 
                    .pagination-previous > a`).removeClass('a-disabled');
                }   
                
    
                sr_model.getServiceReport(allfilter,limit,offset,function(sr_res){

                    serviceReportView.displayDatas(sr_res);
                    serviceReportView.displayPaginationInfo(limit,offset,total);
                    serviceReportView.exitScreen();
                    $('#service-report-filter-area').removeClass("showFromHeight");
    
                });
    
    
    
            });


            
            


        });


       

      
    }

    getFilterDatas(condition,callback){
        serviceReportModel.process().getFilterDatas(condition,callback);
    }

    onReport(){

        var self = this;
        let c = 0;

        function datasInExcel(withFilter = false){

            async function loader(){
                const v = self.onView();
                v.screenName="service-report-process-screen";
                v.container = "#service-report-frame-area";
                 v.loader({
                     "loader-01":true
                 });
            }

            loader();
            reportLibrary.saveFile_and_return().then(p=>{


                const exc = reportLibrary.excel().exporting();
                const workbook = exc.createWorkBook();
                const sheets =  ['Service Report'];

                // creating all sheets
                sheets.forEach(sheet=>{
                       exc.createWorksheet(workbook,sheet); 
                });

                const serviceReportFilter = withFilter?serviceReportView.getFilters():"";

                self.getAllServiceReport(serviceReportFilter,function(service_report_res){


                    const service_report_sheet = exc.getWorksheet(workbook,'Service Report');

                    // Add headers
                    service_report_sheet.columns = [
                        { header: 'Transaction Date', key:'trans-date', width: 15},
                        { header: 'Equipment', key:'equipment', width: 15},
                        { header: 'Service Report Number', key: 'service-report-num', width: 15},
                        { header: 'GenX SN', key: 'genex-serial-num', width: 15},
                        { header: 'Model Number', key: 'model-num', width: 30},
                        { header: 'Facility', key: 'facility-site', width: 35},
                        { header: 'Department', key: 'department', width: 20},
                        { header: 'Tel No', key: 'tel-no', width: 20},
                        { header: 'Service Name', key: 'service-name', width: 25},
                        { header: 'Problems Reported', key: 'problems-reported', width: 35},
                        { header: 'Diagnostic Findings', key: 'diagnostic-findings',width: 35},
                        { header: 'Corrective Action', key: 'corrective-action', width: 35},
                        { header: 'Comments', key: 'comments', width: 35},
                        { header: 'Service Engineer', key: 'service-engineer', width: 25},
                        { header: 'Customer Name', key: 'customer-name', width: 25},
                        { header: 'SE Sign Date', key: 'engineer-sign-date', width: 15},
                        { header: 'Customer Sign Date', key: 'customer-sign-date', width: 15}
                    ];



                    if(service_report_res.length != 0){
                        service_report_sheet.addTable({
                            name: "ServiceReportMainTable".replace(' ', '_'),
                            ref: 'A1',
                            headerRow: true,
                            totalsRow: false,
                            style: {
                            theme: 'TableStyleMedium10',
                            showRowStripes: true,
                            },
                            columns: [
                                { name: 'Transaction Date', key:'trans-date', width: 15},
                                { name: 'Equipment', key:'equipment', width: 15},
                                { name: 'Service Report Number', key: 'service-report-num', width: 15},
                                { name: 'GenX SN', key: 'genex-serial-num', width: 15},
                                { name: 'Model Number', key: 'model-num', width: 30},
                                { name: 'Facility', key: 'facility-site', width: 35},
                                { name: 'Department', key: 'department', width: 20},
                                { name: 'Tel No', key: 'tel-no', width: 20},
                                { name: 'Service Name', key: 'service-name', width: 25},
                                { name: 'Problems Reported', key: 'problems-reported', width: 35},
                                { name: 'Diagnostic Findings', key: 'diagnostic-findings',width: 35},
                                { name: 'Corrective Action', key: 'corrective-action', width: 35},
                                { name: 'Comments', key: 'comments', width: 35},
                                { name: 'Service Engineer', key: 'service-engineer', width: 25},
                                { name: 'Customer Name', key: 'customer-name', width: 25},
                                { name: 'SE Sign Date', key: 'engineer-sign-date', width: 15},
                                { name: 'Customer Sign Date', key: 'customer-sign-date', width: 15}
                            ],
                            rows: service_report_res.map(d=>{
                                console.log(d);
                                return [
                                    d['date_added'] ? getOnDate(d['date_added']):"",
                                    d['equipment'],
                                    d['service_report_num'],
                                    d['genexpert_serial_number'],
                                    d['mnName'],
                                    d['facilitySR'],
                                    d['department'],
                                    d['telno'],
                                    d['service_type'],,
                                    d['problems_reported'],
                                    d['diagnostic_findings'],
                                    d['corrective_action'],
                                    d['comments'],
                                    d['fullname'],
                                    d['customer_name'],
                                    d['engineer_sign_date'],
                                    d['customer_sign_date']
                                ]
                            }),
                        
                        });
                    }


                    exc.exec(workbook,p,function(){
        
                        self.onView().messager({
                            "message-02":true,
                            "title":"Report Message",
                            "message":`Successfully Create Report`
                        });
                        
                    });


                });
           
           
            });
           
           

        }



        

        return {datasInExcel};

    }
}
const serviceReportController = new ServiceReportController();
module.exports = serviceReportController;