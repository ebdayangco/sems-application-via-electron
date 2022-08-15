const transactionView = require("../views/TransactionView");
const Model = require("./Model");
class FacilityModel extends Model{
    constructor(){
        super();
    }

    statements(){
        
        var self = this;
      

        function select(){

            const filter = "";
            return `SELECT * FROM site WHERE siteName IS NOT NULL`;

        }

        function selectDepartment(){

            return `SELECT departmentName FROM department`;

        }

        function entry(datas){

            let d = datas;

            return `
            CALL facilityEntry(
                "${d['site']}",
                "${d['region']}",
                "${d['province']}",
                "${d['city']}",
                "${d['barangay']}",
                "${d['street']}",
                "${d['longitude']}",
                "${d['latitude']}",
                ${self.acctJSON["online"]['userID']},
                ${self.acctJSON["online"]['userID']},
                ${self.getTransID()})`;
        }

        function update(sets,where){
            
            return `UPDATE site SET ${sets} ${where}`;
        }

        return {select,entry,update,selectDepartment};
    }

    process(){

        var self = this;

        function select(callback){
            self.inquireDatabase({
                "statement":self.statements().select(),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }

            });
        }
        function selectDepartment(callback){
            self.inquireDatabase({
                "statement":self.statements().selectDepartment(),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }

            });
        }
        function entry(data,callback){
            self.inquireDatabase({
                "statement":self.statements().entry(data)
            },callback);
        }

        function update(sets,where,callback){
            self.inquireDatabase({
                "statement":self.statements().update(sets,where)
            },callback);
        }

        return {select,update,entry,selectDepartment};
    }
}
const facilityModel = new FacilityModel();
module.exports = facilityModel;