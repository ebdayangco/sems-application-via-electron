const {backendScreen} = require("../../supporters/sections/MessageLoadingSection");
class View{

    constructor(){
        this.screenName = "black-screen";
        this.border_radius = false;
        this.container = "body";
    }
    getTransactionSerialNumberBasedPin(){
        const installation_form = $(".genexpert-installation-reveal-form");
        
        if(installation_form.children().hasClass("pinned-div")){
           
            return $("#transaction-serial-number-field-input").val();
            

        }else{
          
            return $("#transaction-serial-number-field").val();
        }
    }

    exitScreen(){
        $(`.${this.screenName}`).remove();
    }

    toggleFilter(div,area){

        const filter_area = $(area);
        const btn = $(div);

        if(filter_area.hasClass("showFromHeight")){
            filter_area.removeClass("showFromHeight");
            btn.html("<i class='fa fa-filter'></i> Show Filter");


        }else{

            filter_area.addClass("showFromHeight");
            btn.html("<i class='fa fa-filter'></i> Hide Filter");
        }
      
       
    }
    
    clearList(lists){

        lists.forEach(l=>{

            this.clear(l['div'],l['type']);

        });
    }

    clear(div,type){
        if(type=="text" || type=="date"){
            $(div).val("");
        }
        if(type=="select"){
            $(div).prop('selectedIndex',0);
        }
    }
    messager_5(option){

        backendScreen({
            "container":"body",
            "screen-name":this.screenName,
            "animation":{
                "stand-up":{
                    "length-second":600,
                    "second":"ms"
                }
            },
            "message-box":{
                "version":5,
                "messages":{
                    "datas":option['datas']
                }
            },
            "border-radius":this.border_radius
        });
    }
    messager(option){
        

        if(option['message-02']){
            backendScreen({
                "container":this.container,
                "screen-name":this.screenName,
                "message-box":{
                     "version":2,
                     "title":option['title'],
                     "message":option['message']
                },
                "registered-user-execute":option['back-login']
              
            });
        }else if(option['message-01']){

            backendScreen({
                "container":this.container,
                "screen-name":this.screenName,
                "animation":{
                    "stand-up":{
                        "length-second":600,
                        "second":"ms"
                    }
                },
                "message-box":{
                    "version":1,
                    "messages":option['messages']
                },
                "border-radius":this.border_radius
            });
        }
        else{
            backendScreen({
                "container":"body",
                "screen-name":this.screenName,
                "animation":{
                    "stand-up":{
                        "length-second":600,
                        "second":"ms"
                    }
                },
                "message-box":{
                    "version":1,
                    "messages":option['messages']
                },
                "border-radius":this.border_radius
            });
        }
        
    }

    loader(option){

        if(option['loader-01']){

            backendScreen({
                "container":this.container,
                "screen-name":this.screenName,
                "loading-box":{
                     "version":1,
                     "message":option['message']?option['message']:"Please wait..."
                },
                "border-radius":this.border_radius
            });
        }  
    }




    validateProcess(args){

        let messages = this.validate(args);

        this.loader({
            "loader-01":true
        });

        if(messages.length != 0){
            
            this.messager({"message-01":true,
            "messages":messages
        }); 

            
        }

        return messages.length == 0;
        

    }

    validate(args){

        let messages = [];

        args.forEach(arg => {

            if(arg['field'] == "text" || arg['field'] == "date"){
                
                arg['validation'].forEach(arg_val=>{

                    if(arg_val == "empty"){
                        if(this.checkNormalField(arg['value']).isEmpty()){
                            arg['message'] ? messages.push(arg['message']) 
                            : messages.push(`${arg['label']} is empty!`);
        
                        }
                    }

                    if(arg_val == "null"){
                        if(this.checkNormalField(arg['value']).isNull()){
                            arg['message'] ? messages.push(arg['message']) 
                            : messages.push(`${arg['label']} is null!`);
        
                        }
                    }

                    if(arg_val == "undefined"){
                        if(this.checkNormalField(arg['value']).isUndefined()){
                            arg['message'] ? messages.push(arg['message']) 
                            : messages.push(`${arg['label']} is undefined!`);
        
                        }
                    }

                    if(arg_val == "pair"){

                        if(arg['value'][0] != arg['value'][1]){
                            arg['message'] ? messages.push(arg['message']) 
                            : messages.push(`${arg['label'][0]} 
                            and ${arg['label'][1]} is not match!`);
                        }

                    }

                    

                });
               
            }else if(arg['field'] == "html"){

                arg['validation'].forEach(arg_val=>{

                    if(arg_val == "n/a"){

                        if(arg['value'] == "N/A"){
                            arg['message'] ? messages.push(arg['message']) 
                            : messages.push(`${arg['label']} is empty!`);
        
                        }
                    }

                });
            }else if(arg['field'] == "select"){

                arg['validation'].forEach(arg_val=>{

                    if(arg_val == "empty"){

                        if(!this.checkSelectField(arg['value'])){
                            arg['message'] ? messages.push(arg['message']) 
                            : messages.push(`${arg['label']} is empty!`);
        
                        }
                    }
                    

                });
            }

        
           

        });

        return messages;

    }

    checkNormalField(val){

        function isEmpty(){
            return val == "";
        }

        function isNull(){
            return val == null;
        }

        function isUndefined(){
            return val == undefined;
        }

        return {isEmpty,isNull,isUndefined};


    }

    selectNotValidValue(){
        return ["",0,null,"None"];
    }

    checkSelectField(val){

        const len = this.selectNotValidValue().filter(v=>{
            return v == val;
        });


        return len.length == 0;
    }



}
module.exports = View;