const Model = require("./Model");
class InstallationTypeModel extends Model{
    constructor(){
        super();
    }

    statements(){

        function select(){

            const filter = "";
            return `SELECT * FROM installationtype WHERE itName !="undefined" AND itName!="-"`;

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
const installationTypeModel = new InstallationTypeModel();
module.exports = installationTypeModel;