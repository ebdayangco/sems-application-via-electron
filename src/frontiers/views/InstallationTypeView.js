const View = require("./View");
class InstallationTypeView extends View{
    constructor(){
        super();
    }

    displayOnList(container,datas){
        //displaying
        const dd = $(container);
        dd.html("");
        dd.append(`<option value='0'></option>`);
        datas.forEach(installationtype=>{
            dd.append(`<option value='${installationtype['itID']}'>
                    ${installationtype['itName']}</option>`);
        });
           
    }
}
const installationTypeView = new InstallationTypeView();
module.exports = installationTypeView;