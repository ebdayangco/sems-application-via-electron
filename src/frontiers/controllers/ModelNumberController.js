const modelNumberModel = require("../models/ModelNumberModel");
const modelnumberView = require("../views/ModelNumberView");
class ModelNumberController{

    constructor(){}
  
    displayModelNumber(container,callback=function(){}){
        
        modelNumberModel.process().select(function(res){
            modelnumberView.displayOnList(container,res);
            callback();
        });
      
    }

   
}
const modelNumberController = new ModelNumberController();
module.exports = modelNumberController;