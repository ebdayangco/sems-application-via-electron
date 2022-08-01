const CHANGE_LOCATIONS = `${process.cwd()}\\resources\\app`;
const FORM_ID = '221862079325054';
const JOTFORM_KEY = '60b3cb964acba4e0832c921bd7605c90';
var jotform = require("jotform");


class AppUpdaterController{
    constructor(){}

    getDatas(){

        var self = this;
        jotform.options({
            debug:false,
            apiKey:JOTFORM_KEY
        });

        const dd = [];
        async function runProcess(){
    
            await jotform.getFormSubmissions(FORM_ID,{
                offset: 0,
                limit:1000,
            }).then((r)=>{
                console.log(r);
                r.forEach((a,i)=>{
        
                    const zipUrl = a['answers']['1']['answer']?a['answers']['1']['answer'][0]: 
                    ""; 

                    // const target = isDev ? `${process.cwd()}\\app-updates\\file_${i}`:
                    // `${CHANGE_LOCATIONS}\\app-updates\\file_${i}`;
                    self.unzipAndMove(zipUrl,`${process.cwd()}\\app-updates\\file_${i}`,function(){
                        console.log("ok");
                    });
                   
                
                });
        
        
                
              
            });
        }
    
        runProcess().then(()=>{
            // callback(dd);
        });
    }

    unzipAndMove(filePath,moveIntoFolder,callback){

    
    }
}
const appUpdaterController = new AppUpdaterController();
module.exports = appUpdaterController;
