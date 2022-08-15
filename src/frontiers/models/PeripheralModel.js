const Model = require("./Model");
class PeripheralModel extends Model{
    constructor(){super();}

    statements(){

        var self = this;
        
        function insert(data){
            return `INSERT INTO
            peripheral(peripheralName,serialnumber,modelnumber
            ,genexpertSN,addedby,updatedby,current,transID)
            SELECT 
            "${data['peripheral-name']}" AS pName,
            "${data['peripheral-serial-number']}" AS pSN,
            "${data['peripheral-model-number']}" AS pMN,
            "${data['peripheral-genexpert']}" AS gSN,
            ${self.acctJSON["online"]['userID']} AS adby,
            ${self.acctJSON["online"]['userID']} AS updby,
            true AS cur,
            ${self.getTransID()} AS tID 
            WHERE NOT EXISTS(
                SELECT peripheralName FROM peripheral WHERE 
                peripheralName = "${data['peripheral-name']}" 
                AND genexpertSN="${data['peripheral-genexpert']}"
            )`;
        }

        function update(sets,where){

            sets+=`,updatedby=${self.acctJSON["online"]['userID']}`;
            return `UPDATE peripheral SET ${sets} ${where}`;
        }

        function getAllPeripheral(){
            return `SELECT *,
            CONCAT(b.firstname," ",b.lastname) AS addedby,
            CONCAT(c.firstname," ",c.lastname) AS updatedby 
            FROM peripheral a
            LEFT JOIN user b ON b.userID = a.addedby
            LEFT JOIN user c ON c.userID = a.updatedby 
            ORDER BY genexpertSN,peripheralName`;
        }

        return {insert,update,getAllPeripheral};
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

        function getAllPeripheral(callback){
            self.inquireDatabase({
                "statement":self.statements().getAllPeripheral(),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }

        return {insert,update,getAllPeripheral};

    }
}
const peripheralModel = new PeripheralModel();
module.exports = peripheralModel;
