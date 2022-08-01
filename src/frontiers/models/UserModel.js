const Model = require("./Model");

class UserModel extends Model{
    constructor(){
        super();
    }

    statements(){

        function select(){

            const filter = "";
            return `SELECT * FROM user`;

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
const userModel = new UserModel();
module.exports = userModel;