const engineerModel = require("../models/EngineerModel");
const engineerView = require("../views/EngineerView");
class EngineerController{

    constructor(){}
  
    displayEngineer(container,callback=function(){}){

        engineerModel.process().select(function(res){

            localStorage.setItem('engineers',JSON.stringify(res));

            engineerView.displayOnList(container,res);
            callback();
        });
      
    }

   

   
}
const engineerController = new EngineerController();
module.exports = engineerController;