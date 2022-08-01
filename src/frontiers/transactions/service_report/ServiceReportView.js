class ServiceReportView{
    constructor(){}
    setData(data){
        this.data = data;
        return this;
    }
    getData(){

        const sr_num = $("#service-report-number-entry");
        const sr_pi = this.data['service-report-particular-id'];
        const sr_fw = this.data['service-report-for-what'];
        const sr_ab = this.data['service-report-added-by'];
        const sr_ub = this.data['service-report-updated-by'];
        const sr_fn = this.data['service-report-file-name'];
        const sr_fo = this.data['service-report-file-object'];
        const sr_rm = this.data['service-report-remarks'];
        const sr_st = this.data['service-report-status'];

        return{
            "service-report-number":sr_num.val(),
            "service-report-particular-id":sr_pi,

        }

    }



}
const serviceReportView = new ServiceReportView();
module.exports = serviceReportView;