const facilityModel = require("../models/FacilityModel");
const facilityView = require("../views/FacilityView");
const contactController = require("./ContactController");
class FacilityController{
    constructor(){}

    getAllSites(callback){
        
        facilityModel.process().select(function(res){
            callback(res);
        });
      
    }
    getAllDepartment(callback){
        facilityModel.process().selectDepartment(function(res){
            callback(res);
        });
    }

    setUpAutoComplete(){
        facilityView.facilityOnAutoComplete().settingUp(
            this.getAllSites,contactController.getAllContacts);

    }

    facilityEntry(data,callback){
        
        facilityModel.process().entry(data,callback);
        
    }
    
    updateFacility(datas,callback){

        const primary = datas.filter((d,i)=>{
            return i == 0;
        })[0];

        let sets = "";

        datas.filter((f,i)=>{
            return i != 0;
        }).map((d,i)=>{

           if(i == 0){
               return `${d['field']} = "${d['value']}"`;
           }else{
                return `,${d['field']} = "${d['value']}"`;
           }
        }).forEach(st => {
            sets+=st;
        });

        let where = `WHERE ${primary['field']} = ${primary['value']}`;


        facilityModel.process().update(sets,where,callback);

    }

    onView(){
        return facilityView;
    }

}
const facilityController = new FacilityController();
module.exports = facilityController;