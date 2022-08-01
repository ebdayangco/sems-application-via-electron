const userModel = require("../models/UserModel");
const userView = require("../views/UserView");
const Controller = require("./Controller");

class UserController extends Controller{
    constructor(){
        super();
    }

    displayUsers(container,callback=function(){}){
        
        userModel.process().select(function(res){
            userView.displayOnList(container,res);
            callback();
        });
    }


}
const userController = new UserController();
module.exports = userController;