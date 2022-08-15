const View = require("./View");
class ModelNumberView extends View{
    constructor(){
        super();
    }
    displayOnList(container,datas){
        //displaying
        const dd = $(container);
        dd.html("");
        dd.append(`<option value='0'></option>`);
        datas.forEach(modelnumber=>{
            dd.append(`<option value='${modelnumber['mnID']}'>
                    ${modelnumber['mnName']}</option>`);
        });
           
    }
}
const modelnumberView = new ModelNumberView();
module.exports = modelnumberView;