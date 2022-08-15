const contactModel = require("../models/ContactModel");
class ContactController{
    constructor(){}
    getAllContacts(callback,filter = ""){
        contactModel.process().select(function(res){
            callback(res);
        },filter);
      
    }

    insertContacts(data,callback){
        contactModel.process().entry(data,callback);
    }

    updateContacts(datas,callback){


        let sets = `
            contactnumber="${datas['contact-number']}",
            email="${datas['email']}",
            fullname="${datas['fullname']}",
            position="${datas['position']}"
        `;

        let where = `WHERE siteID = ${datas['site-id']} AND contactID = ${datas['contact-id']}`;
        contactModel.process().update(sets,where,callback);

    }
}
const contactController = new ContactController();
module.exports = contactController;