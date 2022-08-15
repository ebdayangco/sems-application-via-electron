const accountModel = require("../models/AccountModel");
const accountView = require("../views/AccountView");
const nodemailer = require('nodemailer');
const md5 = require("md5");
const Controller = require("./Controller");
const autocompleteSection = require("../../supporters/sections/AutoCompleteSection");  
const { ipcRenderer } = require("electron");

class AccountController extends Controller{
    constructor(){
        super();
        this.viewAccess = "login";
        this.enterKey();
        ipcRenderer.on('update_available', () => {
            alert("new Update available");
          });
          ipcRenderer.on('update_downloaded', () => {
            alert("new download available");
          });
    }

    getCurrentLocation(){
        return $("#account-current-form").data("current");
    }


    enterKey(){

        var self = this;
     
        autocompleteSection.whenPressEnter(function(){
            

            if(self.getCurrentLocation() == "login"){

                
                if ($(`.${accountView.screenName}`)[0]){
                    
                    $(".msg-box-01-close-btn").trigger("click");
                    setTimeout(function(){
                        $(`.${accountView.screenName}`).remove();
                        accountView.exitScreen();
                    },800);
                    
                  
                    
                } else {
                    $("#btnAccountLogin").trigger("click");
                }
               
                
            }else{

                if ($(`.${accountView.screenName}`)[0]){
                    
                    $(".msg-box-01-close-btn").trigger("click");
                    setTimeout(function(){
                        $(`.${accountView.screenName}`).remove();
                        accountView.exitScreen();
                    },800);
                    
                    
                } else {
                    $("#btnAccountRegister").trigger("click");
                }
            }


        });
       
       
        
    }

    login(){
        
        try{
            var self = this;
            if(accountView.validateLoginEntries()){
                let entry = accountView.getLoginEntries();
                accountModel.process({
                    "data":entry, 
                    "negative":function(){
                       accountView.messager({
                           "message-01":true,
                           "messages":['Invalid Account!']});
                    },
                    "positive":function(res){
                      
                        // accountView.updateLoginLogger(res[0]);
                       
                            self.setLoggedIn(res[0],function(){
                                accountView.openMain();
                            });
                    }
                }).login();
    
            }
        }catch(err){
            alert(err);
        }
     
    }

    register(){

        if(accountView.validateRegisterEntries()){
            let entry = accountView.getRegisterEntries();
            
                accountModel.process({
                    "data":entry,
                    "email-exist":function(){
                        accountView.messager({
                            "message-01":true,
                            "messages":['Email already registered!']});
                    },
                    "proceed":function(){
                        accountView.messager({
                            "message-02":true,
                            "title":"Account Register Message",
                            "message":`Welcome <b>${entry['firstname']} ${entry['lastname']}</b>! 
                            You are now an officially a user on this application. Free to ask Us, 
                            after you login on the system. Thank you.`,
                            "back-login":true
                            });
                    }
                }).register();
            
            
        }
      
        
    }

    retrieveAccount(){

        try{
            if(accountView.retrievePassword().validateRetrievePassword()){

                const values = accountView.retrievePassword().getRetrievePasswordEntries();
    
                accountModel.process().checkIfCodeExist(values['email'],values['code'],function(){
                    accountModel.process().changePasswordOnCodeBased(values['email'],values['new-password'],function(){
                        accountModel.process().deleteCodeFromForgotPassword(values['email'],function(){
                            accountView.retrievePassword().clearAll();
                            accountView.messager({
                                "message-02":true,
                                "title":"Retrieve Account Message",
                                "message":`Successfully change your password. You can now login.`
                            });
                        });
                    });
                },function(){
                    accountView.messager({
                        "message-01":true,
                        "messages":['Code or Email Not found']});
                    
                });
    
                
    
            }
        }catch(ex){
            alert(ex);
        }

       

    }

    forgotPassword(){
       
        function emailExist(option){
            accountModel.process().emailExist(option);
        }

        function sendEmailProcess(){

                const emailValue = $("#text-email-for-change-password").val();

                if(emailValue == ""){
                    accountView.messager({
                        "message-01":true,
                        "messages":['Please provide email']});
                }else{
                    emailExist({
                        "email":emailValue,
                        "exist":function(){
                            const code = getRandomSomething();
                            insertUserforChangePassword(emailValue,code,function(){
                                sendEmailForChangePassword(emailValue,code);
                                $("#text-email-for-change-password").val("");
                            });
                        },
                        "not-exist":function(){
                            accountView.messager({
                                   "message-01":true,
                                   "messages":['Email is not registered!']});
                        }
                    });
                }

            
            
        }

        function getRandomSomething(){
            let rand_nums = Math.floor(Math.random() * 1000000000000000000000) + 1;
            return md5(rand_nums);
        }

        function insertUserforChangePassword(email,code,callback){

            accountModel.process().insertUserForgotPassword(email,code,callback);
        }
        
        
        function openForgotPasswordForm(){
            showSubForm("#user-change-password-area","top");
        }
        function openRetrievePasswordForm(){
            showSubForm("#user-retrieve-password-area","top");
        }

        function sendEmailForChangePassword(emailValue,code){

            try {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'macaresems05192022@gmail.com',
                      pass: 'yhzkpnxcxgjvuhvf'
                    },
                    tls:{
                     
                        rejectUnauthorized: false
                    }
                });
            } catch (error) {
                accountView.messager({
                    "message-01":true,
                    "messages":[error]});
            }
            
            // const pass = "yhzkpnxcxgjvuhvf";

            async function send() {

                try {
                    await transporter.sendMail({
                        from: 'macaresems05192022@gmail.com',
                        to: emailValue,
                        subject: 'SEMS - Password Retrieves Information',
                        html: `Open recover form and use this code on the app: <b>${code}</b>`
                    });
                    // alert(JSON.stringify(result, null, 4));                    
                } catch (error) {
                    accountView.messager({
                        "message-01":true,
                        "messages":[error]});
                }
              
                
            }
            accountView.loader({"loader-01":true});
            send().then(()=>{

                accountView.messager({
                    "message-02":true,
                    "title":"Email Send Message",
                    "message":`Successfully Send Code for Retrieving Password. 
                    macaresems05192022@gmail.com will sent you an email. You can 
                    open your spam folder if you cannot see there.`
                });
            });
        }



        return {openForgotPasswordForm,sendEmailForChangePassword,sendEmailProcess,
            openRetrievePasswordForm};
    }



}

const accountController = new AccountController();
module.exports = accountController;

