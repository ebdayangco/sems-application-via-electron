const Model = require("./Model");
class EngineerModel extends Model{
    constructor(){
        super();
    }
    statements(){

        function select(){

            const filter = "";
            return `SELECT * FROM engineer WHERE active=true`;

        }

        return {select};
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

        return {select};
    }

    
}
const engineerModel = new EngineerModel();
module.exports = engineerModel;