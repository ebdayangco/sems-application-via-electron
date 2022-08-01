const moduleModel = require("../models/ModuleModel");
const moduleView = require("../views/ModuleView");
const genexpertController = require("./GenexpertController");
// const genexpertController = require("./GenexpertController");
const serviceReportController = require("./ServiceReportController");
class ModuleController{
    constructor(){}

    checkModuleOnLocations(genexpertSN,locations,callback){
        moduleModel.process().checkModuleOnLocations(genexpertSN,locations,callback);
    }

    insertModule(data,callback){
        moduleModel.process().insert(data,callback);
    }

    checkModuleExist(modules,ifexist,ifnotexist){
        moduleModel.process().checkExist(modules,ifexist,ifnotexist);
    }

    getModule(condition,callback){
        moduleModel.process().getModule(condition,callback);
    }

    newModule(transID,datas,callback){
        moduleModel.setTransID(transID);
        moduleModel.process().newModule(datas,callback);
    }

    replaceModule(transID,datas,callback){
        moduleModel.setTransID(transID);
        moduleModel.process().replaceModule(datas,callback);
    }

    getEntireModules(callback){
        moduleModel.process().getAllModules(callback);
    }

    checkSNExists(arrofSN,callback){


        moduleModel.process().checkSNExistList(arrofSN,callback);
    }

    transaction(){
        var self = this;

        function installationOnTransaction(mainTransaction,serviceReportTransaction,err,success){
            if(moduleView.transaction().installation().validateInstallation()){
                const data = moduleView.transaction().installation().getNewInstallation();
                const sn = `${data['serial-number']}`;
                moduleModel.process().checkSNExistList(sn,function(res){

                    if(res.length > 0){
                        err(`Serial Number/s ${sn} already exist!`);

                    }else{

                        const moduleData = {
                            'module-genexpert':data['genexpert'],
                            'module-serial-number':data['serial-number'],
                            'module-location':data['location'],
                            'module-installation-type':data['installation-type'],
                            'module-engineer':data['engineer'],
                            'module-date-installed':data['date-installed'],
                            'module-revision-number':"",
                            'module-part-number':""
                        }

                        self.insertModule(moduleData,function(){

                            mainTransaction(function(){
                                serviceReportTransaction(function(){
                                    success({
                                        "message-02":true,
                                        "title":"Module Installation Message",
                                        "message":`Successfully Install new Module`
                                    });
                                });
                            });

                        });

                       

                    }

                });

            }
        }

        function replacement(){

            function searchDataForReplacement(){

                if(moduleView.transaction().replacement().onValidateSearchValue()){

                    const searchValue = moduleView.transaction().replacement().getSearchValue();
                    moduleModel.process().findDataforModuleReplacement(searchValue,function(res){
                        moduleView.transaction().replacement()
                        .displayOnSearchResultForModuleReplacement(res);
                        moduleView.exitScreen();
                        
                    });
                }

            }

           

            function replacementOnTransaction(mainTransaction,serviceReportTransaction,err,success){
                
                if(moduleView.transaction().replacement().validateReplacementOnTransaction()){

                    const datas = getModuleChanges();



                    const sns = datas.map(d=>{
                        return d['current']['serial-number'];
                    });


                    function hasDuplicates(arr) {
                        return arr.some(x => arr.indexOf(x) !== arr.lastIndexOf(x));
                    }

                    const listsOfModules = "'" + sns.join("', '") + "'";

                    if(hasDuplicates(sns)){
                        err(`Duplicate entry/ies for serial number.Please check`);

                    }else{

                        moduleModel.process().checkSNExistList(listsOfModules,function(res){

                            if(res.length > 0){
    
                                const sn_gr = res.map(d=>{
                                    return d['serialnumber'];
                                });
            
                                const listsOfModules = "'" + sn_gr.join("', '") + "'";
                                err(`Serial Number/s ${listsOfModules} already exist!`);
    
                            }else{

                                const finalList = [];
                                datas.forEach(d=>{

                                    const curr = d['current'];
                                    const prev = d['previous'];
                                    curr['genexpert'] = prev['genexpertSN'];
                                    curr['previous-serial-number'] = prev['serialnumber']
                                    finalList.push(curr);
                                   

                                });

                                function moduleReplacementProcess(arr,count,callback){

                                    if(count < arr.length){

                                        moduleModel.process().updateModule(arr[count],function(){
                                            count++;
                                            moduleReplacementProcess(arr,count,callback);
                                        });
                                    }else{
                                        callback();
                                    }

                                }


                                moduleReplacementProcess(finalList,0,function(){
                                    mainTransaction(function(){
                                        serviceReportTransaction(function(){
                                            success({
                                                "message-02":true,
                                                "title":"Module Replacement Message",
                                                "message":`Successfully Replaced Module/s`
                                            });
                                        });
                                    });
                                });
                               

                            }
                        });
                    }
                    
                   
                  


                }


            }
            

            function replacementProcess(){

                
                if(moduleView.transaction().replacement().validateModuleReplacementProcess()){
                    const datas = moduleView.transaction().replacement().getValueOnreplaceModule();

                   
                   

                    // check if module to replace is exist or not
                    moduleModel.process().checkExist([datas['new-serial-number']],function(res){
                   
                        moduleView.messager({"message-01":true,
                        "messages":[`Module ${datas['new-serial-number']} was currently installed 
                        in Genexpert ${res[0]['genexpertSN']}`]});
                    },function(){
                       
                        serviceReportController.checkServiceReport(
                            datas['service-report']['service-report-num'],function(){
                            // if service report number exist  
                            moduleView.messager({"message-01":true,
                            "messages":[`${datas['service-report']['service-report-num']} already used!`]
                            }); 
                        },function(){

                            moduleModel.process().moduleReplacement(datas,function(res){

                                const servicereport = datas['service-report'];
                                servicereport['service-report-particular-id'] = res['moduleID'];

                                genexpertController.transaction().updateOnModuleReplacement(res[0]['genexpertSN'],
                                function(){
                                    serviceReportController.insertServiceReport(servicereport,function(){
                                    
                                        genexpertController.reloading(function(){
                                            moduleView.container = "#transaction-frame-area";
                                            moduleView.messager({
                                                "message-02":true,
                                                "title":"Module Replacement Message",
                                                "message":`Successfully Replaced Module 
                                                ${datas['previous-serial-number']} to Module 
                                                ${datas['new-serial-number']}`
                                            });
                                            moduleView.transaction().replacement().clearAll();
                                        });
                                        
                                    });

                                });

                               
                            });
    
                          
                        });


                       
                    });

                   
                }
            }

            return {searchDataForReplacement,replacementProcess,replacementOnTransaction};

        }

        return {replacement,installationOnTransaction};
    }

    updateModule(datas,callback){

        console.log(datas);
        let sets = `
        genexpertSN="${datas['genexpert']}",
        serialnumber="${datas['serial-number']}",
        location="${datas['location']}",
        dateinstalled="${datas['date-installed']}",
        itID=${datas['installation-type']},
        engineerID=${datas['installed-by']},
        part_number="${datas['part-number']}",
        revision_number="${datas['revision-number']}"`;

        let where = ` WHERE moduleID = ${datas['module-id']}`;
        moduleModel.process().update(sets,where,callback);
    }

    onView(){
        return moduleView;
    }

}
const moduleController = new ModuleController();
module.exports = moduleController;