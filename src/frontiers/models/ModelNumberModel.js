const Model = require("./Model");
class ModelNumberModel extends Model{
    constructor(){
        super();
    }
    statements(){

        function select(){

            const filter = "";
            return `SELECT * FROM modelnumber WHERE mnName !="MCS+ APHERESIS SYSTEM"`;

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
const modelNumberModel = new ModelNumberModel();
module.exports = modelNumberModel;