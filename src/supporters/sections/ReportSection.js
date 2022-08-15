const {ipcRenderer } = require('electron');
const Controller = require('../../frontiers/controllers/Controller');
const { backendScreen } = require('./MessageLoadingSection');
const controller = new Controller();
const acctJSON = controller.getLoggedIn();

class ReportSection{

    constructor(){

    }


    onFile(callback){

        ipcRenderer.send('find-excel-file',"");
        ipcRenderer.on("file-path",function(events,datas){
            callback(datas);
        });

    }



    onCreate(content,datas,container){

       console.log(acctJSON);
        
        ipcRenderer.send('open-save-dialog',
        {
            "content":content,
            "datas":datas,
            "generate-by":`${acctJSON['firstname']} ${acctJSON['lastname']}`
        }
        
        );

        ipcRenderer.on("reply",function(events,datas){
            backendScreen({
                "container":container,
                "screen-name":"report-loading-screen",
                "message-box":{
                     "version":2,
                     "title":"Report Message",
                     "message":`Done Generating Reports.`
                }
            });
        }); 
           
        

    }


}
const reportSection = new ReportSection();
module.exports = reportSection;