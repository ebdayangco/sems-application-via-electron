const View = require("./View");
const {writeJSON, liveDateAndTime} = require("../../supporters/sections/RequestSection");
const { ipcRenderer } = require("electron");
const accountJSONfile = require("../../supporters/storages/account.json");
const { hasScreen, closeScreen } = require("../../supporters/sections/MessageLoadingSection");
const accountController = require("../controllers/AccountController");
const accountJSONpath = `../../supporters/storages/account.json`;
class AccountView extends View{
    constructor(){
       super();
       this.screenName = "account-process-screen";
       this.border_radius = true;
    }

 

    uiAnimation(){
        
        var self = this;
        const goRegisterbtn = document.querySelector(".goRegisterbtn");
        goRegisterbtn.addEventListener("click",function(){
           
            
            
            $(".circle-background").css({
                "transform":"translate(98%,-50%)"
    
            });
            
            setTimeout(function(){
                $(".login-option-area").css({
                    "left":"-100%"
                });
                $("#account-current-form").data("current","register");
            },100);
    
            setTimeout(function(){
                $(".register-option-area").css({
                    "right":"-60%"
                });
            },100);
    
            setTimeout(function(){
                $(".login-form").css({
                    "display":"none"
                });
            },500);
    
            setTimeout(function(){
                $(".register-form").css({
                    "left":"1%",
                    "visibility":"visible"
                });
            },500);
        
    
        });
    
        const goLoginbtn = document.querySelector(".goLoginbtn");
    
    
        goLoginbtn.addEventListener("click",function(){


            $(".circle-background").css({
                "transform":"translate(0%,-50%)"
        
            });
        
            setTimeout(function(){
                $(".login-option-area").css({
                    "left":"0%"
                });

                $("#account-current-form").data("current","login");
            },100);
        
            setTimeout(function(){
                $(".register-option-area").css({
                    "right":"-100%"
                });
            },100);
        
            setTimeout(function(){
                $(".login-form").css({
                    "display":"block"
                });
            },500);
        
            setTimeout(function(){
                $(".register-form").css({
                    "right":"2%",
                    "visibility":"hidden"
                });
            },500);
        
        
        });
    
    }

    getLoginEntries(){

        const email = $("#txtLoginEmail").val();
        const password = $("#txtLoginPassword").val();

        return {email,password};
    }

    getRegisterEntries(){

        const firstname = $("#txtRegisterFirstname").val();
        const lastname = $("#txtRegisterLastname").val();
        const email = $("#txtRegisterEmail").val();
        const contact_number = $("#txtRegistercontactNumber").val();
        const password = $("#txtRegisterPassword").val();
        const retype_password = $("#txtRegisterPasswordConfirmation").val();
        return {
            firstname,lastname,email,contact_number,password,retype_password
        };
    }

    validateLoginEntries(){


        const values = this.getLoginEntries();

        return this.validateProcess([
            {
                "field":"text",
                "value":values['email'],
                "label":"Email",
                "validation":["empty"]
            },
            {
                "field":"text",
                "value":values['password'],
                "label":"Password",
                "validation":["empty"]
            }
        ]);

        


    }

    validateRegisterEntries(){

        const values = this.getRegisterEntries();

        return this.validateProcess([
            {
                "field":"text",
                "value":values['firstname'],
                "label":"First name",
                "validation":["empty"]
            },
            {
                "field":"text",
                "value":values['lastname'],
                "label":"Last name",
                "validation":["empty"]
            },
            {
                "field":"text",
                "value":values['email'],
                "label":"Email",
                "validation":["empty"]
            },
            {
                "field":"text",
                "value":values['contact_number'],
                "label":"Contact Number",
                "validation":["empty"]
            },
            {
                "field":"text",
                "value":values['password'],
                "label":"Password",
                "validation":["empty"]
            },
            {
                "field":"text",
                "value":[values['password'],values['retype_password']],
                "label":["Password","Re-type Password"],
                "validation":["pair"],
                "message":"Password do not match"
            }
        ]);

    }

    updateLoginLogger(acct){
        
        var self = this;

        this.accountStorages().turnOnline(acct,function(){
            self.openMain();
        });
    }

    openMain(){
        ipcRenderer.sendSync("replace-window",{
            toClosed:"account-access",
            toOpen:"main-index",
            toMaximize:true
        });
    }

    retrievePassword(){

        var self = this;

        function getRetrievePasswordEntries(){

            return {
                "email":$("#email-for-retrieve-password").val(),
                "code":$("#code-for-retrieve-password").val(),
                "new-password":$("#new-password-for-retrieve-password").val(),
                "retype-password":$("#retype-password-for-retrieve-password").val()
            }

        }
        function clearAll(){

            $("#email-for-retrieve-password").val("");
            $("#code-for-retrieve-password").val("");
            $("#new-password-for-retrieve-password").val("");
            $("#retype-password-for-retrieve-password").val("");
        }
        function validateRetrievePassword(){
            const values = getRetrievePasswordEntries();
        
            return self.validateProcess([
                {
                    "field":"text",
                    "value":values['email'],
                    "label":"Email",
                    "validation":["empty"],
                    "message":"Please provide your email."
                },
                {
                    "field":"text",
                    "value":values['code'],
                    "label":"Code",
                    "validation":["empty"],
                    "message":"Please write the code sent to your email."
                },
                {
                    "field":"text",
                    "value":values['new-password'],
                    "label":"New Password",
                    "validation":["empty"],
                    "message":"Please provide new password."
                },
                {
                    "field":"text",
                    "value":values['retype-password'],
                    "label":"Re-type Password",
                    "validation":["empty"],
                    "message":"Please re-type your password."
                },
                {
                    "field":"text",
                    "value":[values['new-password'],values['retype-password']],
                    "label":["Password","Re-type Password"],
                    "validation":["pair"],
                    "message":"Password do not match"
                }
            ]);
    
    
        }

        return {validateRetrievePassword,getRetrievePasswordEntries,clearAll};
    }



    accountStorages(){

        function turnOnline(datas,done){
            let newDatas = accountJSONfile;
            newDatas['online'] = datas;
            newDatas['logged-in-status'] = "online";
            newDatas['histories'] = {
                "date-logged-in": liveDateAndTime(),
                "account-user-id":datas['userID']
            }

            let found = newDatas['account-list'].filter(acct=>{
                return acct['userID'] == datas['userID'];
            });

            if(!found){
                newDatas['account-list'].push(datas);
            }

            writeJSON(`${__dirname}/${accountJSONpath}`,JSON.stringify(newDatas),function(){
                done();
            });
        }
        function turnOffline(done){
            let newDatas = accountJSONfile;
            newDatas['online'] = {};
            newDatas['logged-in-status'] = "offline";
            newDatas['histories'][0]['data-logged-out'] = liveDateAndTime();
            writeJSON(`${__dirname}/${accountJSONpath}`,JSON.stringify(newDatas),function(){
                done();
            })
        }

        function getLastLoggedIn(){
            return accountJSONfile['last-logged-in'];
        }
        function loggedHistories(){
            return accountJSONfile['histories'];
        }
        function accountSavedList(){
            return accountJSONfile['account-list'];
        }
        function changeAccountInfo(datas,done){
            let newDatas = accountJSONfile;
            newDatas['online'] = datas;
        
            writeJSON(accountJSONpath,JSON.stringify(newDatas),function(){
                done();
            })
        }
        function changeAccountPassword(password,done){
            let newDatas = accountJSONfile;
            newDatas['online']['password'] = password;
          
            writeJSON(accountJSONpath,JSON.stringify(newDatas),function(){
                done();
            })
        }

        return {turnOffline,turnOnline,getLastLoggedIn,loggedHistories,
            accountSavedList,changeAccountInfo,changeAccountPassword};

    }

    keyboard_keys(func){

        // $(document).on("mouseenter",function(evt){
        //     if (evt.which === 13) {
        //         console.log("I enter enter")
        //     }
        // });

        document.addEventListener("keyup", function(event) {
      
            if (event.key === 'Enter') {

                if(hasScreen()){
                    closeScreen();
                }else{
                    func();
                }
               
               
            }
        });

    }
}
const accountView = new AccountView();
module.exports = accountView;