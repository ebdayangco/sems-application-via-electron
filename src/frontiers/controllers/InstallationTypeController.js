const installationTypeModel = require("../models/InstallationTypeModel");
const installationTypeView = require("../views/InstallationTypeView");
class InstallationTypeController {
    constructor(){}

    displayInstallationType(container,callback=function(){}){
        
        installationTypeModel.process().select(function(res){
            installationTypeView.displayOnList(container,res);
            callback();
        });
    }


}
const installationtypeController = new InstallationTypeController();
module.exports = installationtypeController;