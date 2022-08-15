const { BrowserWindow, app ,ipcMain, dialog,Notification } = require("electron");
const ledger = require("./list");
const EOL = require('os').EOL;
const fs = require('fs');
const path = require('path');
let CWD = process.cwd();
const { getOnDate } = require("../src/supporters/sections/RequestSection");
const { backendScreen } = require("../src/supporters/sections/MessageLoadingSection");
const rootDir = CWD;
const jsreport = require('jsreport')({
rootDirectory:rootDir
});

const log = require('electron-log');
log.transports.file.resolvePath = () => path.join('C:/Users/macare-programmer/OneDrive/Documents/electron-course/auto-update-electron', '/logs/main.log');
log.info('Hello, log');
log.warn('Some problem appears');

const { autoUpdater } = require('electron-updater');

const jreport = require('@jsreport/jsreport-core')();
jreport.use(require('@jsreport/jsreport-chrome-pdf')());
jreport.use(require('@jsreport/jsreport-handlebars')());
const {print} = require("pdf-to-printer");

// const electronInstaller = require('electron-winstaller');


class MainApplication extends require("./blueprint"){

    constructor(){
        super();
    }


    autoUpdaterProcess(){

        autoUpdater.checkForUpdates();
        autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {

            consolog.log("new updates available");
            const dialogOpts = {
                type: 'info',
                buttons: ['Ok'],
                title: 'Application Update',
                message: process.platform === 'win32' ? releaseNotes : releaseName,
                detail: 'A new version is being downloaded.'
            }
            dialog.showMessageBox(dialogOpts, (response) => {
        
            });
        })
        
        autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
            consolog.log("download updating...");
            const dialogOpts = {
                type: 'info',
                buttons: ['Restart', 'Later'],
                title: 'Application Update',
                message: process.platform === 'win32' ? releaseNotes : releaseName,
                detail: 'A new version has been downloaded. Restart the application to apply the updates.'
            };
            dialog.showMessageBox(dialogOpts).then((returnValue) => {
                if (returnValue.response === 0) autoUpdater.quitAndInstall()
            })
        });

       
    }


    application(){

        var self = this;

        function settings(){
            
            self.openWindow({toOpen:"main-index"});
            
           autoUpdater.checkForUpdatesAndNotify();
                
        }

        app.on('ready',settings);

        autoUpdater.on("update-available",()=>{
            log.info("update-available")
         });
         
         autoUpdater.on("checking-for-update",()=>{
             log.info("checking-for-update")
         })
         
         autoUpdater.on("download-progress",()=>{
             log.info("download-progress")
         });
         autoUpdater.on("update-downloaded",()=>{
             log.info("update-downloaded")
         });
       
        app.on('window-all-closed', () => {if (process.platform !== 'darwin') {app.quit()}});
        app.on('activate', () => {
             
            if (BrowserWindow.getAllWindows().length === 0) {
                settings();  
            }

        });

        // Object.defineProperty(app, 'isPackaged', {
        //     get() {
        //       return true;
        //     }
        //   });

        self.ipcSettings();
        self.ipcDeclares();
    
        process.on('uncaughtException', function (err) {
            console.log(err);
        });



       

    }

    ipcSettings(){

        [
            
            {channelname:"open-access",work:(data)=>this.openWindow(data)},
            {channelname:"open-main",work:(data)=>this.openWindow(data)},
            {channelname:"open-server",work:(data)=>this.openWindow(data)},
            {channelname:"open-genexpert",work:(data)=>this.openWindow(data)},
            {channelname:"replace-window",work:(data)=>this.openWindow(data)},
        ].forEach(action=>{

            ipcMain.once(action.channelname,function(event,data){
                action.work(data);
            });
            
        });

        return this;
    }

    ipcDeclares(){

        var self = this;

  
        
        ipcMain.once('quit-app',function(event,data){
            app.quit();
        });

        ipcMain.on('app-auto-update',function(event,data){
            self.autoUpdaterProcess();
        });

        ipcMain.on('restore-window',function(events,data){
            // BrowserWindow.getFocusedWindow().minimize();
            const fwind = BrowserWindow.getFocusedWindow();
            fwind.setContentSize(1200,650,true);
            fwind.center();
            
        });

        ipcMain.on('minimize-window',function(events,data){
            BrowserWindow.getFocusedWindow().minimize();
            
            
        });

        ipcMain.on('maximize-window',function(events,data){
            BrowserWindow.getFocusedWindow().maximize();
        });

        ipcMain.on("show-dev-tools",function(events,data){
            BrowserWindow.getFocusedWindow().webContents.openDevTools();
        });

        ipcMain.on("show-notification",function(events,data){

            const n = new Notification({ title: data['title'], body: data['body'] });
            // n.show();

            events.reply('catch-notification',n);
        });

        ipcMain.on('find-file',function (event,datas){
            
            const homeDir = require('os').homedir();
            const desktopDir = `${homeDir}/Desktop`;
            
            let p = dialog.showSaveDialogSync(null,{
                defaultPath:desktopDir
            });

            const last5 = p.slice(p.length-5,p.length);
            const indexOflastSlash = p.lastIndexOf("\\");
    
            if(last5 != ".pdf"){
                p+=".pdf";
            }
            const directory = p.slice(0,indexOflastSlash+1);
            const filename = p.slice(indexOflastSlash+1,path.length);

        });

        ipcMain.on('read-excel-file',function (event,datas){
            
            const homeDir = require('os').homedir();
            const desktopDir = `${homeDir}/Desktop`;
            
            let p = dialog.showOpenDialogSync(null,{
                defaultPath:desktopDir
            });

            if(p){
                
                event.reply('file-path',p);
            }

            

        });


        ipcMain.on('find-excel-file',function (event,datas){
            
            const homeDir = require('os').homedir();
            const desktopDir = `${homeDir}/Desktop`;
            
            let p = dialog.showSaveDialogSync(null,{
                defaultPath:desktopDir
            });

            if(p){
                
                const last5 = p.slice(p.length-5,p.length);
                const indexOflastSlash = p.lastIndexOf("\\");
        
                if(last5 != ".xlsx"){
                    p+=".xlsx";
                }
                const directory = p.slice(0,indexOflastSlash+1);
                const filename = p.slice(indexOflastSlash+1,path.length);

                event.reply('file-path',p);
            }

            

        });

        ipcMain.on('save-file',function(event,datas){
            const homeDir = require('os').homedir();
            const desktopDir = `${homeDir}/Desktop`;
            
            let p = dialog.showSaveDialogSync(null,{
                defaultPath:desktopDir
            });

            const last5 = p.slice(p.length-5,p.length);
            const indexOflastSlash = p.lastIndexOf("\\");

            event.reply('catch-save-file',p);  

        });

        ipcMain.on('print-process',function(event,data){

            // data = JSON.parse(JSON.stringify(data));

            async function onProcess(){ 
                if (!jreport._initialized) {
                    await jreport.init();
                    console.log('info', 'jsreport started')
                }

                const result = await jreport.render({
                    template: {
                        content: data['content'],
                        engine: 'handlebars',
                        recipe: 'chrome-pdf'
                    },
                    data: {
                        genexpert: data['datas']['genexperts'],
                        
                        
                    }
                });

                return result;
            }


            try{
                onProcess().then((resp)=>{
                    console.log("done");
                    fs.writeFileSync(data['path'],resp.content,{flag:'w'});
                    event.reply('print-done','done');                  
                });
            }catch(e){
                console.log(e);
            }


        });

        ipcMain.on('export-file',function(event,datas){

            const homeDir = require('os').homedir();
            const desktopDir = `${homeDir}/Desktop`;
            
            let p = dialog.showSaveDialogSync(null,{
                defaultPath:desktopDir
            });

            const last5 = p.slice(p.length-5,p.length);
            const indexOflastSlash = p.lastIndexOf("\\");

            if(last5 != ".pdf"){
                p+=".pdf";
            }

         
            async function onProcess(){ 
                
                if (!jreport._initialized) {
                    await jreport.init();
                    console.log('info', 'jsreport started')
                }
                const genexpert = datas['datas']['genexpert'];

                let strt = genexpert['genex_faci_street'] && genexpert['genex_faci_street'] !=null ? 
                `${genexpert['genex_faci_street']},`:"";

                let brgy = genexpert['genex_faci_barangay'] && genexpert['genex_faci_barangay'] !=null ? 
                `brgy. ${genexpert['genex_faci_barangay']},`:"";

                let city = genexpert['genex_faci_city'] && genexpert['genex_faci_city'] !=null ? 
                `${genexpert['genex_faci_city']}, `:"";

                let province = genexpert['genex_faci_province'] && genexpert['genex_faci_province'] !=null ? 
                `${genexpert['genex_faci_province']}, `:"";

                let region = genexpert['genex_faci_region'] && genexpert['genex_faci_region'] !=null ? 
                `${genexpert['genex_faci_region']}`:"";


                let series = `${strt}${brgy}${city}
                ${province}${region}`;


                let address = genexpert['genex_faci_region']  || 
                genexpert['genex_faci_province']  || 
                genexpert['genex_faci_city']  || 
                genexpert['genex_faci_barangay'] ? series :genexpert['genex_faci_complete_address'];


                // get only active module
                let modules =  datas['datas']['module'].filter(d=>{
                    return d['modu_status'] == 'Active';
                });
                
                modules.forEach(d=>{
                    d['modu_dateinstalled'] = getOnDate(d['modu_dateinstalled']);
                });

                datas['datas']['peripheral'].forEach(d=>{
                    d['peri_dateadded'] = getOnDate(d['peri_dateadded']);
                });

                datas['datas']['assaystatistic'].forEach(d=>{
                    d['assay_dateadded'] = getOnDate(d['assay_dateadded']);
                });

                datas['datas']['xpertcheck'].forEach(d=>{
                    d['calibrate_done'] = getOnDate(d['calibrate_done']);
                    d['calibrate_start'] = getOnDate(d['calibrate_start']);
                    d['dateadded'] = getOnDate(d['dateadded']);
                    d['dateupdated'] = getOnDate(d['dateupdated']);
                    d['status'] = d['current_xpertcheck']?'Current':'Done';
                });

                datas['datas']['preventive-maintenance'].forEach(d=>{
                    d['calibrate_done'] = getOnDate(d['calibrate_done']);
                    d['calibrate_start'] = getOnDate(d['calibrate_start']);
                    d['dateadded'] = getOnDate(d['dateadded']);
                    d['dateupdated'] = getOnDate(d['dateupdated']);
                    d['status'] = d['current_pm']?'Current':'Done';
                });
             
                
                const result = await jreport.render({
                    template: {
                        content: datas['content'],
                        engine: 'handlebars',
                        recipe: 'chrome-pdf'
                    },
                    data: {
                        genexpert: genexpert,
                        address:address,
                        installed_date:getOnDate(genexpert['genex_dateinstalled']),
                        last_date_update:genexpert['genex_dateupdated'] 
                        ? getOnDate(genexpert['genex_dateupdated']):"Not yet",
                        updated_by:`${genexpert['genex_user_updatedby_firstname']} 
                        ${genexpert['genex_user_updatedby_lastname']}`,
                        module:modules,
                        peripheral:datas['datas']['peripheral'],
                        assaystatistic:datas['datas']['assaystatistic'],
                        xpertcheck:datas['datas']['xpertcheck'],
                        preventive_maintenance:datas['datas']['preventive-maintenance']
                        
                    }
                });

                return result;
                

            }

            try{
                onProcess().then((resp)=>{
                    console.log("done");
                    fs.writeFileSync(p,resp.content,{flag:'w'});
                    event.reply('reply','done');                  
                });
            }catch(e){
                console.log(e);
            }
            
           
           

        });

        ipcMain.on('print-file',function(event,datas){
            
            async function onProcess(){ 
                
                if (!jreport._initialized) {
                    await jreport.init();
                    console.log('info', 'jsreport started')
                }
                const genexpert = datas['datas']['genexpert'];

                let strt = genexpert['genex_faci_street'] && genexpert['genex_faci_street'] !=null ? 
                `${genexpert['genex_faci_street']},`:"";

                let brgy = genexpert['genex_faci_barangay'] && genexpert['genex_faci_barangay'] !=null ? 
                `brgy. ${genexpert['genex_faci_barangay']},`:"";

                let city = genexpert['genex_faci_city'] && genexpert['genex_faci_city'] !=null ? 
                `${genexpert['genex_faci_city']}, `:"";

                let province = genexpert['genex_faci_province'] && genexpert['genex_faci_province'] !=null ? 
                `${genexpert['genex_faci_province']}, `:"";

                let region = genexpert['genex_faci_region'] && genexpert['genex_faci_region'] !=null ? 
                `${genexpert['genex_faci_region']}`:"";


                let series = `${strt}${brgy}${city}
                ${province}${region}`;


                let address = genexpert['genex_faci_region']  || 
                genexpert['genex_faci_province']  || 
                genexpert['genex_faci_city']  || 
                genexpert['genex_faci_barangay'] ? series :genexpert['genex_faci_complete_address'];


                // get only active module
                let modules =  datas['datas']['module'].filter(d=>{
                    return d['modu_status'] == 'Active';
                });
                
                modules.forEach(d=>{
                    d['modu_dateinstalled'] = getOnDate(d['modu_dateinstalled']);
                });

                datas['datas']['peripheral'].forEach(d=>{
                    d['peri_dateadded'] = getOnDate(d['peri_dateadded']);
                });

                datas['datas']['assaystatistic'].forEach(d=>{
                    d['assay_dateadded'] = getOnDate(d['assay_dateadded']);
                });

                datas['datas']['xpertcheck'].forEach(d=>{
                    d['calibrate_done'] = getOnDate(d['calibrate_done']);
                    d['calibrate_start'] = getOnDate(d['calibrate_start']);
                    d['dateadded'] = getOnDate(d['dateadded']);
                    d['dateupdated'] = getOnDate(d['dateupdated']);
                    d['status'] = d['current_xpertcheck']?'Current':'Done';
                });

                datas['datas']['preventive-maintenance'].forEach(d=>{
                    d['calibrate_done'] = getOnDate(d['calibrate_done']);
                    d['calibrate_start'] = getOnDate(d['calibrate_start']);
                    d['dateadded'] = getOnDate(d['dateadded']);
                    d['dateupdated'] = getOnDate(d['dateupdated']);
                    d['status'] = d['current_pm']?'Current':'Done';
                });
             
                
                const result = await jreport.render({
                    template: {
                        content: datas['content'],
                        engine: 'handlebars',
                        recipe: 'chrome-pdf'
                    },
                    data: {
                        genexpert: genexpert,
                        address:address,
                        installed_date:getOnDate(genexpert['genex_dateinstalled']),
                        last_date_update:genexpert['genex_dateupdated'] 
                        ? getOnDate(genexpert['genex_dateupdated']):"Not yet",
                        updated_by:`${genexpert['genex_user_updatedby_firstname']} 
                        ${genexpert['genex_user_updatedby_lastname']}`,
                        module:modules,
                        peripheral:datas['datas']['peripheral'],
                        assaystatistic:datas['datas']['assaystatistic'],
                        xpertcheck:datas['datas']['xpertcheck'],
                        preventive_maintenance:datas['datas']['preventive-maintenance']
                        
                    }
                });

                return result;
                

            }

            

            try{
                onProcess().then((resp)=>{

                    // const b = Buffer.from(resp.content);

                    // console.log(b.toString('utf8'));

                    // var stream = fs.createWriteStream(
                    // `${__dirname}/../src/frontiers/layouts/html/reports/print.pdf`, {flags: 'a'});
                    // stream.write(b.toString('utf8'), function() {
                    //     // console.log(resp.content);
                    //     // var html = buildHtml();
                    //     // stream.end(html);
                    // });
                    
                    
                    fs.writeFile(`${__dirname}/../src/frontiers/layouts/html/reports/print.pdf`,
                    resp.content,{flag:'w'},function(err){

                        if(!err){
                            // let windo = new BrowserWindow({width: 800, height: 600, show: false });
                            // windo.loadURL(`file://${__dirname}/../src/frontiers/layouts/html/reports/print.pdf`);
                            // // Could be redundant, try if you need this.
                            // windo.once('ready-to-show', () => windo.hide());
                            // // load PDF.
                           
                            // // if pdf is loaded start printing.
                            // windo.webContents.on('did-finish-load', () => {
                            //     windo.webContents.print();
                            //     // close window after print order.
                            //     windo = null;
                            // });
                            
                            print(`${__dirname}/../src/frontiers/layouts/html/reports/print.pdf`,
                            {printDialog:true}).then(()=>{
                                event.reply('reply','done');   
                            });
    
                        
                        }else{
                            backendScreen({
                                "container":"body",
                                "screen-name":"file-error-screen",
                                "animation":{
                                    "stand-up":{
                                        "length-second":600,
                                        "second":"ms"
                                    }
                                },
                                "message-box":{
                                    "version":1,
                                    "messages":err.message
                                }
                            });
                        }

                    });
                    // fs.writeFileSync(
                    //     `${__dirname}/../src/frontiers/layouts/html/reports/print.pdf`,resp.content,{flag:'w'});


                        
                  
                });
            }catch(e){
                console.error(e);
            }            
        });

        ipcMain.on('open-save-dialog',async (event,datas)=>{


            let cur = JSON.parse(JSON.stringify(datas['datas']));

           
            function appLog(level, message) {
                const origMsg = message
              
                message += EOL
              
                if (level === 'info') {
                  console.log(origMsg)
                  fs.appendFileSync(path.join(CWD, 'app-info.log'), message)
                } else if (level === 'error') {
                  console.error(origMsg)
                  fs.appendFileSync(path.join(CWD, 'app-error.log'), message)
                }
            }


            const homeDir = require('os').homedir();
            const desktopDir = `${homeDir}/Desktop`;
            
            let p = dialog.showSaveDialogSync(null,{
                defaultPath:desktopDir
            });

            const last5 = p.slice(p.length-5,p.length);
            const indexOflastSlash = p.lastIndexOf("\\");
    
            if(last5 != ".pdf"){
                p+=".pdf";
            }
            const directory = p.slice(0,indexOflastSlash+1);
            const filename = p.slice(indexOflastSlash+1,path.length);

            try {
                // we defer jsreport initialization on first report render
                // to avoid slowing down the app at start time
                if (!jsreport._initialized) {
                    await jsreport.init()
                    appLog('info', 'jsreport started')
                }
    
                appLog('info', 'rendering report..')
                
        
                jsreport.render({
                    template: {
                        content: datas['content'],
                        engine: 'handlebars',
                        recipe: 'chrome-pdf',
                        
                    },
                    
                    data: {
                        rows: cur,
                        current_date:getOnDate(),
                        generate_by:`${datas['generate-by']}`,
                        logo_image:`../galleries/macarelogo.png`
                    }
                }).then((resp)=>{



                    try {

                        appLog('info', 'report generated')
                        fs.writeFileSync(p,resp.content,{flag:'w'});
                        event.reply("reply","done");
                        // fs.writeFileSync(p, resp.content)
        
                        // const pdfWindow = new BrowserWindow({
                        //     width: 1024,
                        //     height: 800,
                        //     webPreferences: {
                        //         plugins: true
                        //     }
                        // })
        
                        // pdfWindow.loadURL(url.format({
                        // pathname: p,
                        // protocol: 'file'
                        // }))
        
                        event.sender.send('render-finish', {})
    
                    
                    } catch (e) {
                        appLog('error', `error while generating or saving report: ${e.stack}`)
                        event.sender.send('render-finish', { errorText: e.stack })
                    }


                });

                
    
  
            } catch (e) {
                appLog('error', `error while starting jsreport: ${e.stack}`);
            
            }

           
            

        });

        // ipcMain.on('window-event',function(events,data){
        //     // BrowserWindow.getFocusedWindow().maximize();
        // });

       
    }

    machineWindow(options){

        var self = this;
        const window = this.setUp(options["set-up"])['window'];
        window.loadURL(`file://${options["set-up"]["route"]}`).then(()=>{

           

            options.show ? opening():"";
            
            function opening(){
                // options.toClosed ? closedWindow(options.toClosed):"";
                closedWindow(window);
                
                options["toMaximize"] ? window.maximize() : "";
                window.show();
                window.once('ready-to-show', () => {
                    autoUpdater.checkForUpdatesAndNotify();
                });
            }
        });


        

        function closedWindow(toOpen){

            BrowserWindow.getAllWindows().filter(wind=>{
                return wind != toOpen;
            }).forEach(w=>{
                if(!w.isDestroyed()){
                    w.destroy();
                }
            });
            
            // // BrowserWindow.getFocusedWindow().close();

            // found.length > 0 ? found[0].close() : "";
                // let found = self.windows.filter(w=>{
                //     return w['name'] == toClosed;
                // });

                // found.length > 0 ? found[0].close() : "";


        }

       
    }

    openWindow(data){
        this.machineWindow({
            "set-up": ledger[data.toOpen],
            "toClosed": data.toClosed,
            "show":true,
            "toMaximize":data.toMaximize ? data.toMaximize : false
           
        });

       

    }

  
}
const application = new MainApplication();
module.exports = {
    startUp:function(){
        application.application();
    },
    window_installer:function(){
        application.createWindowInstaller();
    }
}


// App auto update tutorial link
// https://medium.com/@johndyer24/creating-and-deploying-an-auto-updating-electron-app-for-mac-and-windows-using-electron-builder-6a3982c0cee6
//https://github.com/iffy/electron-updater-example