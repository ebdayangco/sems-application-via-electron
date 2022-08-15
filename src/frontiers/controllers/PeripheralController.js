const peripheralModel = require("../models/PeripheralModel");
class PeripheralController{
    constructor(){}

    insertPeripheral(data,callback){
        peripheralModel.process().insert(data,callback);
    }

    updatePeripheral(datas,callback){

        let sets = `
        peripheralName="${datas['peripheral-name']}",
        serialnumber="${datas['peripheral-serial-number']}",
        modelnumber="${datas['peripheral-model-number']}"`;

        let where = `WHERE genexpertSN = "${datas['peripheral-genexpert']}" 
        AND periID = ${datas['peripheral-id']}`;
        peripheralModel.process().update(sets,where,callback);


    }

    getAllPeripheral(callback){
        peripheralModel.process().getAllPeripheral(callback);
    }


}
const peripheralController = new PeripheralController();
module.exports = peripheralController;