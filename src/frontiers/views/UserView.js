const View = require("./View");
class UserView extends View{
    constructor(){
        super();
    }

    displayOnList(container,datas){
        //displaying
        const dd = $(container);
        dd.html("");
        dd.append(`<option value='0'></option>`);
        datas.forEach(userList=>{
            dd.append(`<option value='${userList['userID']}'>
                    ${userList['firstname']} ${userList['lastname']}</option>`);
        });
           
    }
}
const userView = new UserView();
module.exports = userView;