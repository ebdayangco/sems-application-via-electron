const notificationModel = require("../models/NotificationModel");
const notificationView = require("../views/NotificationView");

class NotificationController{
    constructor(){
       this.liveNotification();
    }

    liveNotification(){
       
        function checkingNotification(){
            notificationModel.process().findUnreadNotification(function(res){
                notificationView.displayList(res,function(n){   
                        $("#menu-item-row-notification").addClass("notification-alert");
                });
            });
        }

        checkingNotification();

        setInterval(function(){
            checkingNotification();
        },8000);
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