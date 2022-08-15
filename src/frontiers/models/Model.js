const ApplicationDatabase = require("../../supporters/databases/ApplicationDatabase");
const Controller = require("../controllers/Controller");
// const acctJSON = require("../../supporters/storages/account.json");
const controller = new Controller();
const acctJSON = controller.getLoggedIn();

class Model extends ApplicationDatabase{
    
    constructor(){
        super();
        
        this.acctJSON = {
            "online":acctJSON
        };

        Model.transaction_id = 0;



    }
    setTransID(tID){
        Model.transaction_id = tID;
    }

    getTransID(){
        return Model.transaction_id;
    }

}
module.exports = Model;