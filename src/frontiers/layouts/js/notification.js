// const notificationController = require("../../controllers/NotificationController");

function readNotification(div){

    const data = $(div).data("support");
    notificationController.readNotification(data['notificationID'],function(){
            $(div).addClass("read-word-emphasis").removeClass("unread-emphasis");
    });
}