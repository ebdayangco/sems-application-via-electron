
    
    const accountController = require("../../controllers/AccountController");
    const accountView = require("../../views/AccountView");

//declaration
accountView.uiAnimation();
// accountView.keyboard_keys(accountController.login);


const fs = require("fs");
const { ipcRenderer } = require("electron");

function getLoc(htmlName){
    return `${__dirname}/${htmlName}`;
}
function appendProcess(htmlName,loadto,callback){
    const content = fs.readFileSync(getLoc(htmlName),{encoding:"utf-8"});
    $(loadto).append(content);
    callback();
}

function showSubForm(id_class,hideLocation,div){
    const form = $(id_class);
    switch(hideLocation){
        case "top": form.addClass("showFromTop");  break;
        case "bottom": form.addClass("showFromBottom");  break;
        case "left": form.addClass("showFromLeft");  break;
        case "right": form.addClass("showFromRight");  break;
        default:form.addClass("showFromTop");  break;
    }

    if(div){
        $(div).off("click");
    }

}

function hideSubForm(id_class,lastLocation,div){

    const form = $(id_class);
    switch(lastLocation){
        case "top": form.removeClass("showFromTop");  break;
        case "bottom": form.removeClass("showFromBottom");  break;
        case "left": form.removeClass("showFromLeft");  break;
        case "right": form.removeClass("showFromRight");  break;
        default:form.removeClass("showFromTop");  break;
    }
    if(div){
        $(div).off("click");
    }
   
}


appendProcess(`../../layouts/html/user-change-password.html`,'.access-area',function(){
    appendProcess(`../../layouts/html/user-retrieve-password.html`,'.access-area',function(){
    
    });
});

    
module.exports = accountController;


