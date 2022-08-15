const { getOnDate } = require("../../supporters/sections/RequestSection");
const notific = require("../../supporters/storages/settings.json");
class NotificationView{

    constructor(){}

    createNotificationRow(){

    }

    displayList(datas,container,autoRemoveAfterRead = false){

        const myContainer = $(container);
        myContainer.html("");
       

        let countUnread = 0;

        datas.forEach(d => {

            let readStatStyle = '';
            let wordReadStyle='';
            if(d['status'] == 'unread'){
                countUnread++;
                readStatStyle = 'unread-emphasis';
                wordReadStyle = 'read-word-emphasis';
            }

            const item = `<div class="notification-list-row ${readStatStyle}" 
            onclick="readNotification(this,${autoRemoveAfterRead})" data-support='${JSON.stringify(d)}'>
            <div class="notification-list-message"><b>${d['firstname']} ${d['lastname']}</b> ${d['message']}</div>
            <div class="notification-list-time small d-flex">
                <div class="notif-time w-20">${getOnDate(d['notificationDate'])}</div>
                <div class="notif-space w-60"></div>
                <div class="notif-date w-20">04-18-2022</div>
            </div>
            </div>`;
            
            myContainer.append(item);
        });

        

    }

    countUnreadNotification(countUnread){

        if(countUnread == 0){
            $(".badge-notification").addClass("badge-notification-hide");
            if(!$(".sems-notification-box-area").hasClass("notification-box-hide")){
                $(".sems-notification-box-area").addClass("notification-box-hide");
            }
            $(".sems-notification-box-area").addClass("notification-box-hide");
        }else{
            $(".badge-notification").html(countUnread);
            $(".badge-notification").removeClass("badge-notification-hide");
            $(".sems-notification-box-area").children(".notification-box-message").html(`${countUnread} new transaction/s added.`);
            
            if($(".sems-notification-box-area").hasClass("notification-box-hide")){
                $(".sems-notification-box-area").removeClass("notification-box-hide");
            }
           
            // notify(countUnread);
        }

        $(".notification-btn").on('click',function(){
            $(".badge-notification").addClass("badge-notification-hide");
        });
    }


}
const notificationView = new NotificationView();
module.exports = notificationView;