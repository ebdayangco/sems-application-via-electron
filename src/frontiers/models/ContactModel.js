const accountController = require("../controllers/AccountController");
const Model = require("./Model");
class ContactModel extends Model{
    constructor(){
        super();
    }

    statements(){

        var self = this;

        function select(filter=""){

           
            return `SELECT
            b.siteID AS sID, 
            b.siteName,
            b.region,a.fullname,a.position,a.contactnumber,a.email 
            FROM contact a 
            LEFT JOIN site b ON b.siteID = a.siteID WHERE 1=1 ${filter}`;

        }
        function entry(datas){

                const d = datas;

                return `
                CALL contactEntry(
                    "${d['site']}",
                    "${d['contact-fullname']}",
                    "${d['contact-position']}",
                    "${d['contact-email']}",
                    "${d['contact-number']}",
                    ${self.acctJSON["online"]['userID']},
                    ${self.acctJSON["online"]['userID']},
                    ${self.getTransID()})`;
   
        }

        function update(set,where){
            set+=`,updatedby=${self.acctJSON["online"]['userID']}`;
            return `UPDATE contact SET ${set} ${where}`;
        }

        return {select,entry,update};
    }

    process(){

        var self = this;

        function select(callback,filter){
            self.inquireDatabase({
                "statement":self.statements().select(filter),
                "results":function(res){
                    callback(JSON.parse(JSON.stringify(res)));
                }

            });
        }

        function entry(data,callback){
            self.inquireDatabase({
                "statement":self.statements().entry(data)
            },callback);
        }

        function update(set,where,callback){

            self.inquireDatabase({
                "statement":self.statements().update(set,where)
            },callback);
        }

        return {select,entry,update};
    }

}
const contactModel = new ContactModel();
module.exports = contactModel;