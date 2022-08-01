const serviceReportController = require("../../controllers/ServiceReportController");

function revealServiceReportInformation(div){
    $("#service-report-information-area").addClass("service-report-information-area-reveal");
}

function hideServiceReportInformation(){
    $("#service-report-information-area").removeClass("service-report-information-area-reveal");
}