const assayStatisticModel = require("../models/AssayStatisticModel");
class AssayStatisticController{
    constructor(){}

    insertAssayStatistic(data,callback){
        assayStatisticModel.process().insert(data,callback);
    }

    updateAssaystatistic(datas,callback){

        let sets = `
        test="${datas['assay-test']}",
        quantity="${datas['assay-quantity']}"`;

        let where = `WHERE genexpertSN = "${datas['assay-genexpert']}" 
        AND asID = ${datas['assay-id']}`;
        assayStatisticModel.process().update(sets,where,callback);
    }

    getAllAssaystatistic(callback){
        assayStatisticModel.process().getAllAssaystatistic(callback);
    }

}
const assayStatisticController = new AssayStatisticController();
module.exports = assayStatisticController;