const { backendScreen } = require("../../sections/MessageLoadingSection");
const genexpertTransactionModel = require("./GenexpertTransactionModel");
const genexpertTransactionView = require("./GenexpertTransactionView");

class GenexpertTransactionController{
    constructor(){}

    findGenexpertFacilityOrSN(){


        const searchValue = genexpertTransactionView.getSearchValue();
        if(genexpertTransactionView.validateSearchGenexpertTransfer()){
            
            backendScreen({
                "container":`#transaction-frame-area`,
                "screen-name":"genexpert-transfer-search-error-screen",
                "loading-box":{
                    "version":1,
                    "message":"Please wait..."
                }
            });

            genexpertTransactionModel.onSearchviaTransfer(searchValue,function(results){
                genexpertTransactionView.displaySearchResults(results);
                $(".genexpert-transfer-search-error-screen").remove();
            });


        }

    }

    ontransferProcess(){

        backendScreen({
            "container":`#transaction-frame-area`,
            "screen-name":"genexpert-transfer-search-error-screen",
            "loading-box":{
                "version":1,
                "message":"Please wait..."
            }
        });
        if(genexpertTransactionView.validateTransferData()){
            const data = genexpertTransactionView.getTransferFinalData();

            genexpertTransactionModel.onTransferProcess(data['new-facility']
            ,data['serial-number'],function(){
                backendScreen({
                    "container":`#transaction-frame-area`,
                    "screen-name":"genexpert-transfer-search-error-screen",
                    "message-box":{
                        "version":2,
                        "title":"Genexpert Transfer Message",
                        "message":`Successfully Transfer Genexpert SN #${data['serial-number']} to 
                        ${data['new-facility']} site.`,
                        "border-radius":true
                    }
                });
            });
        }

    }

    showInfoForm(div){
        $(".genexpert-transfer-info-form").addClass("show-transfer-info-form");

        const data = $(div).parent("td").parent("tr").data("whole");
        genexpertTransactionView.displayInfo(data);
    }
    hideInfoForm(){
        $(".genexpert-transfer-info-form").removeClass("show-transfer-info-form");
    }
    showTransferForm(div){
        const data = $(div).parent("td").parent("tr").data("whole");
        $(".genexpert-transfer-main-form").data("whole",data);
        $(".genexpert-transfer-main-form").addClass("show-transfer-main-form");
    }
    hideTransferForm(){
        $(".genexpert-transfer-main-form").removeClass("show-transfer-main-form");
    }
}
const genexpertTransactionController = new GenexpertTransactionController();
module.exports = genexpertTransactionController;