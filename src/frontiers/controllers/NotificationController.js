const notificationModel = require("../models/NotificationModel");
const notificationView = require("../views/NotificationView");

class NotificationController{
    constructor(){
      
       this.allOffset = 0;
       this.unreadOffset = 0;
       this.allend = false;
       this.unreadend = false;
       this.constant_limit = 25;
       this.allLimit = this.constant_limit;
       this.unreadLimit = this.constant_limit;
       this.liveNotification();
    }
    
    
    addAllLimit(){
       
        if(!this.allend){
            this.allLimit = this.allLimit + this.constant_limit;
        }
       
        
    }
    addUnreadLimit(){
       
        if(!this.unreadend){
            this.unreadLimit = this.unreadLimit + this.constant_limit;
        }
       
        
    }
    resetAllLimit(){
        this.allLimit = this.constant_limit;
    }
    resetUnreadLimit(){
        this.unreadLimit = this.constant_limit;
    }

    getAllOffset(){
        return this.allOffset;
    }


    getUnreadOffset(){
        return this.unreadOffset;
    }

    getAllLimit(){
        return this.allLimit;
    }

    getUnreadLimit(){
        return this.unreadLimit;
    }
    
    notificationAction(){
        var self = this;
        async function getAllNotification(){

            notificationModel.process().getAllNotification(
                self.getAllLimit(),self.getAllOffset(),function(res){
               
                if(res.length < self.getAllLimit()){
                    self.end = true;
                }

                notificationView.displayList(res,".notification-list-all-area");
            });

        }

        async function getUnreadNotification(){

            notificationModel.process().getUnreadNotification(
                self.getUnreadLimit(),self.getUnreadOffset(),function(res){
               
                if(res.length < self.getUnreadLimit()){
                    self.end = true;
                }

                notificationView.displayList(res,".notification-list-unread-area",true);
            });
        }

        async function getTotalUnreadNotification(){

            notificationModel.process().getTotalUnreadNotification(function(res){
               
                notificationView.countUnreadNotification(res[0]['totalUnread']);
            });
        }

        return {getAllNotification,getUnreadNotification,getTotalUnreadNotification}
    }

    liveNotification(){
        var self = this;

        const action = this.notificationAction();
       
        action.getAllNotification();
        action.getUnreadNotification();
        action.getTotalUnreadNotification();

        setInterval(function(){
            action.getAllNotification();
            action.getUnreadNotification();
            action.getTotalUnreadNotification();
        },8000);
    }
    addAllListOnScroll(){
        // this.addOffset();
        this.addAllLimit();
        this.notificationAction().getAllNotification();
        
    }

    addUnreadListOnScroll(){
        // this.addOffset();
        this.addUnreadLimit();
        this.notificationAction().getUnreadNotification();
    }

    readNotification(notificationID,callback){
        notificationModel.process().readNotification(notificationID,callback);
    }

    onDisplay(){

    }

    setNotification(title,message){

        // notifying(title,body);
        notificationModel.process().insertNotification({
            title,message},function(){
        });

    }
    addNotification(transaction,message){
        
    }
}
const notificationController = new NotificationController();
module.exports = notificationController;