const { toDateTimeString } = require("../../supporters/sections/RequestSection");
const Model = require("./Model");
class AssayStatisticModel extends Model{
    constructor(){
        super();
    }

    statements(){

        var self = this;
        
        function insert(data){
            return `
            INSERT INTO assaystatistic(genexpertSN,dateadded,test,quantity,addedby,updatedby,active,
                transID)
            VALUES(
            "${data['assay-genexpert']}",
            "${data['assay-date'] == ""? "0001-01-01":toDateTimeString(data['assay-date'])}",    
            "${data['assay-test']}","${data['assay-quantity']}",
            ${self.acctJSON["online"]['userID']},
            ${self.acctJSON["online"]['userID']},true,
            ${self.getTransID()}
            )`;
        }

        function update(sets,where){
            sets+=`,updatedby=${self.acctJSON["online"]['userID']}`;
            return `UPDATE assaystatistic SET ${sets} ${where}`;
        }

        function getAllAssaystatistic(){
            return `SELECT *,
            CONCAT(b.firstname," ",b.lastname) AS addedby,
            CONCAT(c.firstname," ",c.lastname) AS updatedby 
            FROM assaystatistic a
            LEFT JOIN user b ON b.userID = a.addedby
            LEFT JOIN user c ON c.userID = a.updatedby 
            ORDER BY genexpertSN,test,quantity`;
        }

        return {insert,update,getAllAssaystatistic};
    }

    process(){

        var self = this;

        function insert(data,callback){
            
            self.inquireDatabase({
                "statement":self.statements().insert(data)},callback);
        }

        function update(sets,where,callback){
            
            self.inquireDatabase({
                "statement":self.statements().update(sets,where)},callback);
        }

        function getAllAssaystatistic(callback){
            self.inquireDatabase({
                "statement":self.statements().getAllAssaystatistic(),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }

        return {insert,update,getAllAssaystatistic};

    }
}
const assayStatisticModel = new AssayStatisticModel();
module.exports = assayStatisticModel;