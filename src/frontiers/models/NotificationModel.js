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

        function findUnreadNotification(){
            return `SELECT * FROM notifications a 
            LEFT JOIN user b ON b.userID = a.notifyBy
            WHERE 
            readby = ${self.acctJSON["online"]['userID']} ORDER BY status DESC`;
        }

        function readNotification(notID){
            return `UPDATE notifications SET status='read' WHERE 
            readby = ${self.acctJSON["online"]['userID']} 
            and notificationID=${notID}`;
        }

        return {insertNotification,findUnreadNotification,readNotification};
    }

    process(){

        var self = this;

        function insertNotification(data,callback){
            self.inquireDatabase({
                "statement":self.statements().insertNotification(data),
            },callback);
        }

        function findUnreadNotification(callback){

            self.inquireDatabase({
                "statement":self.statements().findUnreadNotification(),
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

        return {insertNotification,findUnreadNotification,readNotification};

    }
}
const notificationModel = new NotificationModel();
module.exports = notificationModel;