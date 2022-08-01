const { getOnDate } = require("../../supporters/sections/RequestSection");
const notific = require("../../supporters/storages/settings.json");
class NotificationView{

    constructor(){}

    displayList(datas,notify){

        const myContainer = $("#notification-list-content-area");
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
            
            const item = ` <div class="frame-body-list-row d-flex ${readStatStyle}" 
            data-support='${JSON.stringify(d)}'
            onclick="readNotification(this)">
                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots 
                ${wordReadStyle}" 
                style="width:10%">${getOnDate(d['notificationDate'])}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots 
                ${wordReadStyle}"
                style="width:20%">${d['transactionType']}</div>

                <div class="frame-reveal-table-list-title-item text-unfit-hidden-dots 
                ${wordReadStyle}"
                style="width:70%">${d['message']}</div>
            </div>`;

            myContainer.append(item);
        });

        if(countUnread == 0){
            $("#menu-item-row-notification").removeClass("notification-alert");
        }else{
            $("#menu-item-row-notification").addClass("notification-alert");
            notify(countUnread);
        }

        $("#menu-item-row-notification").on('click',function(){
            $("#menu-item-row-notification").removeClass("notification-alert");
        });

    }


}
const notificationView = new NotificationView();
module.exports = notificationView;