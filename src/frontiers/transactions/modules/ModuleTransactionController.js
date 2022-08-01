const { backendScreen } = require("../../sections/MessageLoadingSection");
const moduleTransactionModel = require("./ModuleTransactionModel");
const moduleTransactionView = require("./ModuleTransactionView");
const {getOnDate} = require("../../sections/RequestSection");
class ModuleTransactionController{
    constructor(){}

    goInstall(){

        const values = moduleTransactionView.installation().getAllEntries();

        if(moduleTransactionView.installation().fieldValidation()){

            backendScreen({
                "container":`#transaction-frame-area`,
                "screen-name":"module-installation-error-screen",
                "loading-box":{
                    "version":1,
                    "message":"Please wait..."
                }
            });

            moduleTransactionModel.installation().checkModuleExistProcess(values['serial-number'],function(){
                backendScreen({
                    "container":`#transaction-frame-area`,
                    "screen-name":"module-installation-error-screen",
                    "animation":{
                        "stand-up":{
                            "length-second":600,
                            "second":"ms"
                        }
                    },
                    "message-box":{
                        "version":1,
                        "messages":[`Module ${values['serial-number']} already exist!`]
                    }
                });
            },function(){

                moduleTransactionModel.installation().checkServiceReportExistProcess(
                values['service-report']['service-report-num'],function(){
                    backendScreen({
                        "container":`#transaction-frame-area`,
                        "screen-name":"module-installation-error-screen",
                        "animation":{
                            "stand-up":{
                                "length-second":600,
                                "second":"ms"
                            }
                        },
                        "message-box":{
                            "version":1,
                            "messages":[`Service Report 
                            ${values['service-report']['service-report-num']} already exist!`]
                        }
                    });
                },function(){
                    
                    moduleTransactionModel.installation().checkGenexpertExistProcess(values['genexpert'],
                    function(){
                        moduleTransactionModel.installation().installationProcess(values,function(res){

                            values['service-report']['service-report-particular-id'] = res['moduleID'];
    
                            moduleTransactionModel.installation().insertServiceReportProcess(
                                values['service-report'],function(){
                                backendScreen({
                                    "container":`#transaction-frame-area`,
                                    "screen-name":"module-installation-error-screen",
                                    "message-box":{
                                        "version":2,
                                        "title":"Module Installation Message",
                                        "message":`Successfully Replace New Module`,
                                        "border-radius":true
                                    }
                                });
                            });
    
                        });

                    },function(){

                        backendScreen({
                            "container":`#transaction-frame-area`,
                            "screen-name":"module-installation-error-screen",
                            "animation":{
                                "stand-up":{
                                    "length-second":600,
                                    "second":"ms"
                                }
                            },
                            "message-box":{
                                "version":1,
                                "messages":[`Genexpert 
                                ${values['genexpert']} not exist!`]
                            }
                        });

                    });

                   
                });


              
            });

           
        }


    }

    showReplaceForm(div){
        
        const data = $(div).parent("td").parent("tr").data("whole");
        $(".module-replacement-main-form").data("catch",data);
        $(".module-replacement-main-form").addClass("show-replacement-form");
    }

    hideReplaceForm(){
        $(".module-replacement-main-form").removeClass("show-replacement-form");
    }

    showInfoForm(div){
        
        const data = $(div).parent("td").parent("tr").data("whole");
        this.displayInfo(data);
        $(".module-replacement-info-form").addClass("show-info-form");
        
    }

    displayInfo(data){
        const infoForm = $(".module-replacement-info-form");
        infoForm.html("");

        const item = `
        <div class="module-replacement-info-row">
        <div class="module-replacement-info-label">Genexpert SN:</div>
        <div class="module-replacement-info-value">${data['a_genexpertSN']}</div>
        </div>

        <div class="module-replacement-info-row">
            <div class="module-replacement-info-label">Facility:</div>
            <div class="module-replacement-info-value">${data['c_siteName']}</div>
        </div>

        <div class="module-replacement-info-row">
            <div class="module-replacement-info-label">Region:</div>
            <div class="module-replacement-info-value">${data['c_region']}</div>
        </div>

        <div class="module-replacement-info-row">
            <div class="module-replacement-info-label">Province:</div>
            <div class="module-replacement-info-value">${data['c_province']}</div>
        </div>

        <div class="module-replacement-info-row">
            <div class="module-replacement-info-label">City:</div>
            <div class="module-replacement-info-value">${data['c_city']}</div>
        </div>

        <div class="module-replacement-info-row">
            <div class="module-replacement-info-label">Barangay:</div>
            <div class="module-replacement-info-value">${data['c_barangay']}</div>
        </div>

        <div class="module-replacement-info-row">
            <div class="module-replacement-info-label">Module SN:</div>
            <div class="module-replacement-info-value">${data['a_moduleSN']}</div>
        </div>

        <div class="module-replacement-info-row">
            <div class="module-replacement-info-label">Location:</div>
            <div class="module-replacement-info-value">${data['a_location']}</div>
        </div>

        <div class="module-replacement-info-row">
            <div class="module-replacement-info-label">Date Installed:</div>
            <div class="module-replacement-info-value">${getOnDate(data['a_dateinstalled'])}</div>
        </div>

        <div class="module-replacement-info-row">
            <div class="module-replacement-info-label">Installation Type:</div>
            <div class="module-replacement-info-value">${data['d_itName']}</div>
        </div>

        <div class="module-replacement-info-row">
            <div class="module-replacement-info-label">Engineer:</div>
            <div class="module-replacement-info-value">${data['e_fullname']}</div>
        </div>

        <div class="module-replacement-info-row">
            <div class="module-replacement-info-label">Revision Number:</div>
            <div class="module-replacement-info-value">${data['a_revision_number']}</div>
        </div>

        <div class="module-replacement-info-row">
            <div class="module-replacement-info-label">Part Number:</div>
            <div class="module-replacement-info-value">${data['a_part_number']}</div>
        </div>

        <div class="module-replacement-info-row">
            <a href="#" class="btn btn-danger w-25" 
            onclick="moduletransactionController.hideInfoForm()">Return</a>
        </div>
        
        `;

        infoForm.html(item);

    }

    hideInfoForm(){
        $(".module-replacement-info-form").removeClass("show-info-form");
    }

    goFindModule(){

        const value = moduleTransactionView.replacement().getReturnValueViaModuleSearch();

        if(moduleTransactionView.replacement().validateSearchModule()){

            backendScreen({
                "container":`#transaction-frame-area`,
                "screen-name":"module-replacement-error-screen",
                "loading-box":{
                    "version":1,
                    "message":"Please wait..."
                }
            });


            moduleTransactionModel.replacement().findModule(value,function(res){
                moduleTransactionView.replacement().displayResults_via_search_module(res);
                $(".module-replacement-error-screen").remove();

            });

        }
    }

    goReplaceModule(){

        const data = moduleTransactionView.replacement().getValueOnreplaceModule();
        if(moduleTransactionView.replacement().validateReplacementModule()){

            backendScreen({
                "container":`#transaction-frame-area`,
                "screen-name":"module-replacement-error-screen",
                "loading-box":{
                    "version":1,
                    "message":"Please wait..."
                }
            });
            data['new-date-installed'] =  getOnDate(data['new-date-installed']);

            moduleTransactionModel.replacement().replaceModule(data,function(){

                backendScreen({
                    "container":`#transaction-frame-area`,
                    "screen-name":"module-replacement-error-screen",
                    "message-box":{
                        "version":2,
                        "title":"Module Replacement Message",
                        "message":`Successfully Replaced ${data['previous-serial-number']} to
                        ${data['new-serial-number']} at Location ${data['location']}`,
                        "border-radius":true
                    }
                });
            });


        }

    }

}

const moduleTransactionController = new ModuleTransactionController();
module.exports = moduleTransactionController;