const Model = require("./Model");
class NotificationModel extends Model{
    constructor(){super();}

    statements(){

        var self = this;

        function insertNotification(data){

            return `INSERT INTO notifications(notifyBy,transactionType,message,readby,status)
            SELECT 
            ${self.acctJSON["online"]['userID']} AS nBy,
            "${data['transaction']}" AS ttle,
            "${data['message']}" AS msg,
            userID AS uid,
            "unread" FROM user WHERE userID != ${self.acctJSON["online"]['userID']}`;
        }

        function getAllNotification(limit = 50, offset = 0){
            return `SELECT * FROM notifications a 
            LEFT JOIN user b ON b.userID = a.notifyBy
            WHERE 
            readby = ${self.acctJSON["online"]['userID']} 
            ORDER BY notificationDate DESC LIMIT ${limit} OFFSET ${offset}`;
        }

        function getUnreadNotification(limit = 50, offset = 0){
            return `SELECT * FROM notifications a 
            LEFT JOIN user b ON b.userID = a.notifyBy
            WHERE 
            readby = ${self.acctJSON["online"]['userID']} AND status="unread" 
            ORDER BY notificationDate DESC LIMIT ${limit} OFFSET ${offset}`;
        }

        function getTotalUnreadNotification(){
            return `SELECT count(*) AS totalUnread FROM notifications a 
            LEFT JOIN user b ON b.userID = a.notifyBy
            WHERE 
            readby = ${self.acctJSON["online"]['userID']} AND status="unread"`;
        }

       

        function readNotification(notID){
            return `UPDATE notifications SET status='read' WHERE 
            readby = ${self.acctJSON["online"]['userID']} 
            and notificationID=${notID}`;
        }

        return {insertNotification,getAllNotification,readNotification,getUnreadNotification,
        getTotalUnreadNotification};
    }

    process(){

        var self = this;

        function insertNotification(data,callback){
            self.inquireDatabase({
                "statement":self.statements().insertNotification(data),
            },callback);
        }

        function getAllNotification(limit=50,offset=0,callback){

            self.inquireDatabase({
                "statement":self.statements().getAllNotification(limit,offset),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }

        function getUnreadNotification(limit=50,offset=0,callback){

            self.inquireDatabase({
                "statement":self.statements().getUnreadNotification(limit,offset),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }

        function getTotalUnreadNotification(callback){

            self.inquireDatabase({
                "statement":self.statements().getTotalUnreadNotification(),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }
            });
        }

        function readNotification(notID,callback){
            self.inquireDatabase({
                "statement":self.statements().readNotification(notID),
            },callback);
        }

        return {insertNotification,getAllNotification,readNotification,getUnreadNotification
        ,getTotalUnreadNotification};

    }
}
const notificationModel = new NotificationModel();
module.exports = notificationModel;