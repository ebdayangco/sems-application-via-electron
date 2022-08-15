// const notificationController = require("../../controllers/NotificationController");

function readNotification(div,remove){

    const data = $(div).data("support");
    notificationController.readNotification(data['notificationID'],function(){
            $(div).addClass("read-word-emphasis").removeClass("unread-emphasis");
            if(remove){
                $(div).remove();
            }
    });
}