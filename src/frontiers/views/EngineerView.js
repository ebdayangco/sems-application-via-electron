const View = require("./View");
class EngineerView extends View{
    constructor(){
        super();
        this.div = null;
    }

    displayOnList(container,datas){
        //displaying
        const dd = $(container);
        dd.html("");
        dd.append(`<option value='0'></option>`);
        datas.forEach(engineer=>{
            dd.append(`<option value='${engineer['engineerID']}'>
                    ${engineer['fullname']}</option>`);
        });
        this.div = dd;
        
           
    }

 
}
const engineerView = new EngineerView();
module.exports = engineerView;